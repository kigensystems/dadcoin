/*
  # Update Global Pool RLS Policies

  1. Changes
    - Update RLS policies for global_pool table to allow:
      - Anyone to read the global pool value
      - Authenticated users to update the global pool value
      - System role to manage all operations

  2. Security
    - Enable RLS on global_pool table
    - Add policies for read and update operations
*/

-- First ensure RLS is enabled
ALTER TABLE global_pool ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow anyone to read global pool" ON global_pool;
DROP POLICY IF EXISTS "Allow authenticated users to update global pool" ON global_pool;

-- Create new policies
CREATE POLICY "Allow anyone to read global pool"
ON global_pool
FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow authenticated users to update global pool"
ON global_pool
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Allow system role full access
CREATE POLICY "Allow system role full access"
ON global_pool
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);