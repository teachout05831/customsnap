-- Fix RLS for activity_log table
-- Run this in Supabase SQL Editor

-- Drop existing policy if any
DROP POLICY IF EXISTS "Allow all activity operations" ON activity_log;

-- Create permissive policy for anon users
CREATE POLICY "Allow all activity operations" ON activity_log
  FOR ALL TO anon
  USING (true)
  WITH CHECK (true);

-- Also ensure RLS is enabled
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
