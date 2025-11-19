-- ==========================================
-- MONITORING AND ALERTS FOR beta_users TABLE
-- ==========================================
-- Run this in Supabase SQL Editor to set up monitoring
-- Dashboard: https://supabase.com/dashboard/project/shijwijxomocxqycjvud/sql/new

-- ==========================================
-- 1. CREATE AUDIT LOG TABLE
-- ==========================================
-- Tracks all operations on beta_users table
CREATE TABLE IF NOT EXISTS beta_users_audit_log (
  id BIGSERIAL PRIMARY KEY,
  operation TEXT NOT NULL, -- INSERT, UPDATE, DELETE
  beta_id TEXT,
  email TEXT,
  performed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address TEXT, -- From application logs if available
  user_agent TEXT, -- From application logs if available
  old_data JSONB, -- For UPDATE and DELETE
  new_data JSONB, -- For INSERT and UPDATE
  notes TEXT
);

-- Index for fast queries
CREATE INDEX IF NOT EXISTS idx_audit_log_performed_at ON beta_users_audit_log(performed_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_log_operation ON beta_users_audit_log(operation);
CREATE INDEX IF NOT EXISTS idx_audit_log_beta_id ON beta_users_audit_log(beta_id);

-- Enable RLS on audit log (admin-only access)
ALTER TABLE beta_users_audit_log ENABLE ROW LEVEL SECURITY;

-- Block public access to audit logs
CREATE POLICY "Block all public access to audit logs"
ON beta_users_audit_log FOR ALL
TO public
USING (false);

-- ==========================================
-- 2. CREATE STATISTICS TABLE
-- ==========================================
-- Tracks hourly statistics for anomaly detection
CREATE TABLE IF NOT EXISTS beta_users_stats (
  id BIGSERIAL PRIMARY KEY,
  hour_start TIMESTAMP WITH TIME ZONE NOT NULL UNIQUE,
  inserts_count INT DEFAULT 0,
  deletes_count INT DEFAULT 0,
  unique_ips_count INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_stats_hour_start ON beta_users_stats(hour_start DESC);

-- Enable RLS (admin-only)
ALTER TABLE beta_users_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Block all public access to stats"
ON beta_users_stats FOR ALL
TO public
USING (false);

-- ==========================================
-- 3. AUDIT TRIGGER FUNCTION
-- ==========================================
-- Logs all INSERT, UPDATE, DELETE operations
CREATE OR REPLACE FUNCTION beta_users_audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'DELETE') THEN
    INSERT INTO beta_users_audit_log (operation, beta_id, email, old_data)
    VALUES ('DELETE', OLD.beta_id, OLD.email, row_to_json(OLD));
    RETURN OLD;
  ELSIF (TG_OP = 'UPDATE') THEN
    INSERT INTO beta_users_audit_log (operation, beta_id, email, old_data, new_data)
    VALUES ('UPDATE', NEW.beta_id, NEW.email, row_to_json(OLD), row_to_json(NEW));
    RETURN NEW;
  ELSIF (TG_OP = 'INSERT') THEN
    INSERT INTO beta_users_audit_log (operation, beta_id, email, new_data)
    VALUES ('INSERT', NEW.beta_id, NEW.email, row_to_json(NEW));
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach trigger to beta_users table
DROP TRIGGER IF EXISTS beta_users_audit_trigger ON beta_users;
CREATE TRIGGER beta_users_audit_trigger
AFTER INSERT OR UPDATE OR DELETE ON beta_users
FOR EACH ROW EXECUTE FUNCTION beta_users_audit_trigger();

-- ==========================================
-- 4. ANOMALY DETECTION FUNCTION
-- ==========================================
-- Detects suspicious activity patterns
CREATE OR REPLACE FUNCTION detect_beta_anomalies()
RETURNS TABLE(
  anomaly_type TEXT,
  severity TEXT,
  description TEXT,
  occurred_at TIMESTAMP WITH TIME ZONE,
  details JSONB
) AS $$
BEGIN
  -- Check 1: Mass deletions (>5 deletions in 1 hour)
  RETURN QUERY
  SELECT
    'mass_deletion'::TEXT,
    'high'::TEXT,
    'Multiple beta users deleted in short time'::TEXT,
    MAX(performed_at),
    jsonb_build_object(
      'count', COUNT(*),
      'beta_ids', jsonb_agg(beta_id),
      'time_window', '1 hour'
    )
  FROM beta_users_audit_log
  WHERE operation = 'DELETE'
    AND performed_at > NOW() - INTERVAL '1 hour'
  GROUP BY DATE_TRUNC('hour', performed_at)
  HAVING COUNT(*) > 5;

  -- Check 2: Rapid signups (>10 signups in 1 hour from suspicious pattern)
  RETURN QUERY
  SELECT
    'rapid_signups'::TEXT,
    'medium'::TEXT,
    'Unusually high signup rate detected'::TEXT,
    MAX(performed_at),
    jsonb_build_object(
      'count', COUNT(*),
      'emails', jsonb_agg(email),
      'time_window', '1 hour'
    )
  FROM beta_users_audit_log
  WHERE operation = 'INSERT'
    AND performed_at > NOW() - INTERVAL '1 hour'
  GROUP BY DATE_TRUNC('hour', performed_at)
  HAVING COUNT(*) > 10;

  -- Check 3: Duplicate IP pattern (if IP tracking is implemented)
  -- This would require storing IP addresses in audit log

  -- Check 4: Database size explosion
  RETURN QUERY
  SELECT
    'database_growth'::TEXT,
    CASE
      WHEN COUNT(*) > 10000 THEN 'high'
      WHEN COUNT(*) > 1000 THEN 'medium'
      ELSE 'low'
    END::TEXT,
    'Beta users table growing rapidly'::TEXT,
    NOW(),
    jsonb_build_object(
      'total_users', COUNT(*),
      'threshold', 1000
    )
  FROM beta_users
  WHERE COUNT(*) > 1000;

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- 5. MONITORING QUERIES
-- ==========================================
-- Run these to check for issues

-- Query 1: Recent audit log (last 24 hours)
-- SELECT * FROM beta_users_audit_log
-- WHERE performed_at > NOW() - INTERVAL '24 hours'
-- ORDER BY performed_at DESC
-- LIMIT 100;

-- Query 2: Check for anomalies
-- SELECT * FROM detect_beta_anomalies();

-- Query 3: Hourly signup rate
-- SELECT
--   DATE_TRUNC('hour', performed_at) AS hour,
--   COUNT(*) AS signups
-- FROM beta_users_audit_log
-- WHERE operation = 'INSERT'
--   AND performed_at > NOW() - INTERVAL '7 days'
-- GROUP BY DATE_TRUNC('hour', performed_at)
-- ORDER BY hour DESC;

-- Query 4: Hourly deletion rate
-- SELECT
--   DATE_TRUNC('hour', performed_at) AS hour,
--   COUNT(*) AS deletions
-- FROM beta_users_audit_log
-- WHERE operation = 'DELETE'
--   AND performed_at > NOW() - INTERVAL '7 days'
-- GROUP BY DATE_TRUNC('hour', performed_at)
-- ORDER BY hour DESC;

-- Query 5: Most active emails (potential duplicates or spam)
-- SELECT
--   email,
--   COUNT(*) AS operations_count,
--   MAX(performed_at) AS last_activity
-- FROM beta_users_audit_log
-- GROUP BY email
-- HAVING COUNT(*) > 3
-- ORDER BY operations_count DESC;

-- ==========================================
-- 6. SCHEDULED MONITORING (OPTIONAL)
-- ==========================================
-- You can set up a cron job via Supabase pg_cron extension
-- to run these checks automatically

-- Enable pg_cron extension (if available in your Supabase plan)
-- CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule anomaly detection (runs every hour)
-- SELECT cron.schedule(
--   'beta-anomaly-check',
--   '0 * * * *', -- Every hour
--   $$
--   SELECT * FROM detect_beta_anomalies();
--   $$
-- );

-- ==========================================
-- 7. CLEANUP OLD AUDIT LOGS
-- ==========================================
-- Keep only last 90 days of audit logs
CREATE OR REPLACE FUNCTION cleanup_old_audit_logs()
RETURNS void AS $$
BEGIN
  DELETE FROM beta_users_audit_log
  WHERE performed_at < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Schedule cleanup (runs daily at 3 AM)
-- SELECT cron.schedule(
--   'beta-audit-cleanup',
--   '0 3 * * *',
--   $$
--   SELECT cleanup_old_audit_logs();
--   $$
-- );

-- ==========================================
-- VERIFICATION
-- ==========================================
-- Test the audit log by inserting a test record
-- INSERT INTO beta_users (beta_id, email, joined_at, consent_given)
-- VALUES ('beta_test_audit', 'audit@test.com', NOW(), true);

-- Check audit log
-- SELECT * FROM beta_users_audit_log ORDER BY performed_at DESC LIMIT 5;

-- Clean up test
-- DELETE FROM beta_users WHERE beta_id = 'beta_test_audit';

-- ==========================================
-- DASHBOARD QUERIES
-- ==========================================

-- Real-time dashboard: Last 24 hours activity
CREATE OR REPLACE VIEW beta_users_dashboard AS
SELECT
  (SELECT COUNT(*) FROM beta_users) AS total_users,
  (SELECT COUNT(*) FROM beta_users_audit_log WHERE operation = 'INSERT' AND performed_at > NOW() - INTERVAL '24 hours') AS signups_24h,
  (SELECT COUNT(*) FROM beta_users_audit_log WHERE operation = 'DELETE' AND performed_at > NOW() - INTERVAL '24 hours') AS deletions_24h,
  (SELECT COUNT(*) FROM beta_users WHERE joined_at > NOW() - INTERVAL '7 days') AS signups_7d,
  (SELECT MAX(performed_at) FROM beta_users_audit_log) AS last_activity;

-- Query the dashboard
-- SELECT * FROM beta_users_dashboard;

-- ==========================================
-- SUMMARY
-- ==========================================
-- What was created:
-- 1. beta_users_audit_log - Tracks all operations
-- 2. beta_users_stats - Hourly statistics
-- 3. Audit trigger - Automatically logs changes
-- 4. Anomaly detection function - Finds suspicious patterns
-- 5. Monitoring queries - Pre-built analytics
-- 6. Dashboard view - Real-time metrics
-- 7. Cleanup function - Removes old logs

-- How to use:
-- - Check for anomalies: SELECT * FROM detect_beta_anomalies();
-- - View recent activity: SELECT * FROM beta_users_audit_log ORDER BY performed_at DESC LIMIT 20;
-- - Dashboard: SELECT * FROM beta_users_dashboard;
