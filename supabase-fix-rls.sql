-- Fix RLS policies for development
-- Run this in Supabase SQL Editor

-- Option 1: Simple fix - allow all operations for anon users (for development)
-- Drop existing policies
DROP POLICY IF EXISTS "Allow anonymous lead inserts" ON leads;
DROP POLICY IF EXISTS "Allow anonymous discovery inserts" ON discovery;

-- Create new permissive policies for anon
CREATE POLICY "Allow all lead operations" ON leads
  FOR ALL TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all discovery operations" ON discovery
  FOR ALL TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all project operations" ON projects
  FOR ALL TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all activity operations" ON activity_log
  FOR ALL TO anon
  USING (true)
  WITH CHECK (true);

-- Note: In production, you'd want stricter policies
-- This is fine for development/testing
