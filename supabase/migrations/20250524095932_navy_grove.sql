/*
  # Create jackpot table

  1. New Tables
    - `jackpot`
      - `id` (int, primary key)
      - `value` (numeric, default 500000)
      - `updated_at` (timestamp with time zone)

  2. Security
    - Enable RLS on `jackpot` table
    - Add policies for reading and updating jackpot value
*/

CREATE TABLE IF NOT EXISTS jackpot (
  id int PRIMARY KEY,
  value numeric DEFAULT 500000,
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE jackpot ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read the jackpot value
CREATE POLICY "Allow anyone to read jackpot"
  ON jackpot
  FOR SELECT
  TO public
  USING (true);

-- Allow authenticated users to update jackpot
CREATE POLICY "Allow authenticated users to update jackpot"
  ON jackpot
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert initial jackpot value
INSERT INTO jackpot (id, value)
VALUES (1, 500000)
ON CONFLICT (id) DO NOTHING;