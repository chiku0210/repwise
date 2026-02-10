-- Migration: Fix RLS policies for exercises and muscles tables
-- Description: Allow public SELECT access so exercise picker can load data
-- Created: 2026-02-10

-- Drop existing policies if they exist (to avoid duplicates)
DROP POLICY IF EXISTS "Allow public read access to exercises" ON exercises;
DROP POLICY IF EXISTS "Allow public read access to muscles" ON muscles;

-- Enable RLS on exercises table (if not already enabled)
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;

-- Enable RLS on muscles table (if not already enabled)
ALTER TABLE muscles ENABLE ROW LEVEL SECURITY;

-- Create public read policy for exercises
CREATE POLICY "Allow public read access to exercises"
  ON exercises
  FOR SELECT
  TO public
  USING (true);

-- Create public read policy for muscles
CREATE POLICY "Allow public read access to muscles"
  ON muscles
  FOR SELECT
  TO public
  USING (true);

-- Verify policies are active
COMMENT ON POLICY "Allow public read access to exercises" ON exercises IS
  'Allows all users (authenticated and anon) to read exercise catalog';

COMMENT ON POLICY "Allow public read access to muscles" ON muscles IS
  'Allows all users (authenticated and anon) to read muscle groups';
