/*
  # Rename jackpot table to global_pool
  
  1. Changes
    - Rename table from 'jackpot' to 'global_pool'
    - Update policy names to reflect new table name
  
  2. Security
    - Maintain existing RLS policies
    - Keep same access rules for public and authenticated users
*/

ALTER TABLE jackpot RENAME TO global_pool;

-- Update policy names
ALTER POLICY "Allow anyone to read jackpot" 
  ON global_pool 
  RENAME TO "Allow anyone to read global pool";

ALTER POLICY "Allow authenticated users to update jackpot" 
  ON global_pool 
  RENAME TO "Allow authenticated users to update global pool";