-- ==========================================
-- CHECK CURRENT RLS POLICIES
-- ==========================================
-- Run this in Supabase SQL Editor to see what security is currently in place
-- Dashboard: https://supabase.com/dashboard/project/shijwijxomocxqycjvud/sql/new

-- ==========================================
-- 1. Check if RLS is enabled on beta_users table
-- ==========================================
SELECT
    schemaname,
    tablename,
    rowsecurity AS rls_enabled
FROM pg_tables
WHERE tablename = 'beta_users';
-- Expected: rls_enabled should be 'true' (t)
-- If 'false' (f), RLS is OFF and EVERYTHING is exposed!


-- ==========================================
-- 2. List ALL policies on beta_users table
-- ==========================================
SELECT
    schemaname,
    tablename,
    policyname AS policy_name,
    permissive,
    roles,
    cmd AS command,
    qual AS using_expression,
    with_check AS with_check_expression
FROM pg_policies
WHERE tablename = 'beta_users'
ORDER BY policyname;
-- This shows all policies and what they allow


-- ==========================================
-- 3. HUMAN-READABLE Policy Summary
-- ==========================================
SELECT
    policyname AS "Policy Name",
    CASE
        WHEN cmd = 'SELECT' THEN '🔍 Read/Select'
        WHEN cmd = 'INSERT' THEN '➕ Insert/Create'
        WHEN cmd = 'UPDATE' THEN '✏️ Update/Modify'
        WHEN cmd = 'DELETE' THEN '🗑️ Delete/Remove'
        WHEN cmd = 'ALL' THEN '⚠️ All Operations'
        ELSE cmd
    END AS "Operation",
    CASE
        WHEN qual::text = 'true' THEN '❌ UNSAFE: Allows everything'
        WHEN qual::text = 'false' THEN '✅ SAFE: Blocks everything'
        ELSE '⚠️ Custom: ' || qual::text
    END AS "Security Level (USING)",
    CASE
        WHEN with_check::text = 'true' THEN '❌ UNSAFE: No validation'
        WHEN with_check::text = 'false' THEN '✅ SAFE: Blocks all writes'
        WHEN with_check IS NULL THEN 'N/A (not a write operation)'
        ELSE '⚠️ Custom: ' || with_check::text
    END AS "Security Level (CHECK)"
FROM pg_policies
WHERE tablename = 'beta_users'
ORDER BY policyname;


-- ==========================================
-- 4. Quick Security Score
-- ==========================================
SELECT
    COUNT(*) FILTER (WHERE cmd = 'SELECT' AND qual::text = 'false') AS "SELECT Policies (Blocked)" ,
    COUNT(*) FILTER (WHERE cmd = 'SELECT' AND qual::text = 'true') AS "SELECT Policies (Open - BAD)",
    COUNT(*) FILTER (WHERE cmd = 'INSERT' AND with_check::text = 'true') AS "INSERT Policies (Open - BAD)",
    COUNT(*) FILTER (WHERE cmd = 'DELETE' AND qual::text = 'true') AS "DELETE Policies (Open - BAD)",
    COUNT(*) AS "Total Policies"
FROM pg_policies
WHERE tablename = 'beta_users';
-- Good: SELECT Blocked > 0, all "BAD" counts = 0
-- Bad: Any "BAD" count > 0


-- ==========================================
-- 5. Check Table Structure (Columns)
-- ==========================================
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'beta_users'
ORDER BY ordinal_position;
-- Verify your table has the expected columns


-- ==========================================
-- 6. Check Constraints (Unique, etc.)
-- ==========================================
SELECT
    conname AS constraint_name,
    contype AS constraint_type,
    CASE contype
        WHEN 'p' THEN 'Primary Key'
        WHEN 'u' THEN 'Unique'
        WHEN 'c' THEN 'Check'
        WHEN 'f' THEN 'Foreign Key'
        ELSE contype::text
    END AS constraint_description,
    pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'beta_users'::regclass
ORDER BY contype;
-- Should show unique constraints on beta_id and email


-- ==========================================
-- INTERPRETATION GUIDE
-- ==========================================
/*
🟢 SAFE Configuration:
  - RLS Enabled: true
  - SELECT: Blocked (qual = false) OR no SELECT policy
  - INSERT: Has custom validation (WITH CHECK has constraints)
  - DELETE: Has custom validation (USING has constraints)
  - Total Policies: 3-4 policies with specific rules

🔴 UNSAFE Configuration:
  - RLS Enabled: false (CRITICAL - everything exposed!)
  - SELECT: qual = true (anyone can read all data)
  - INSERT: with_check = true (anyone can insert anything)
  - DELETE: qual = true (anyone can delete everything)

🟡 MODERATE (Your Current Setup per Docs):
  - RLS Enabled: true
  - SELECT: Maybe blocked (need to check)
  - INSERT: with_check = true (UNSAFE - allows spam)
  - DELETE: qual = true (UNSAFE - allows mass deletion)
*/

-- ==========================================
-- NEXT STEPS BASED ON RESULTS
-- ==========================================
/*
IF RLS is DISABLED (false):
  → Run: ALTER TABLE beta_users ENABLE ROW LEVEL SECURITY;
  → Then apply SUPABASE_SECURITY_FIX.sql

IF you see "Enable insert for all users" with true:
  → Apply SUPABASE_SECURITY_FIX.sql immediately

IF you see "Enable delete for all users" with true:
  → Apply SUPABASE_SECURITY_FIX.sql immediately

IF you see any SELECT policy with qual = true:
  → Your email addresses are PUBLIC!
  → Apply SUPABASE_SECURITY_FIX.sql immediately
*/
