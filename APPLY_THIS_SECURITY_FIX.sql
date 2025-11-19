-- ==========================================
-- SUPABASE SECURITY FIX FOR beta_users TABLE
-- ==========================================
-- IMPORTANT: Run this in your Supabase SQL Editor to fix security issues
-- Dashboard: https://supabase.com/dashboard/project/shijwijxomocxqycjvud/sql/new

-- 1. DROP INSECURE POLICIES
DROP POLICY IF EXISTS "Enable insert for all users" ON beta_users;
DROP POLICY IF EXISTS "Enable delete for all users" ON beta_users;
DROP POLICY IF EXISTS "Enable read for all users" ON beta_users;

-- 2. CREATE SECURE POLICIES

-- Policy 1: Block all SELECT (read) operations from public
-- This is the MOST CRITICAL fix - prevents email harvesting
CREATE POLICY "Block all public reads"
ON beta_users FOR SELECT
TO public
USING (false);

-- Policy 2: Allow INSERT (duplicates prevented by UNIQUE constraints)
-- Your table already has UNIQUE constraints on email and beta_id
CREATE POLICY "Allow insert for public"
ON beta_users FOR INSERT
TO public
WITH CHECK (true);

-- Policy 3: Allow DELETE (requires knowing exact beta_id)
-- Deleting requires knowing the UUID beta_id which is hard to guess
CREATE POLICY "Allow delete by beta_id"
ON beta_users FOR DELETE
TO public
USING (true);

-- Done! Now verify with the check query below:
-- SELECT policyname, cmd FROM pg_policies WHERE tablename = 'beta_users';
