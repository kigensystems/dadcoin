/*
  # Add INSERT policy for user wallets
  
  1. Changes
    - Add policy to allow authenticated users to insert their own wallet
    
  2. Security
    - Maintain existing RLS policies
    - Add INSERT policy for authenticated users
*/

-- Add INSERT policy for user_wallets
CREATE POLICY "Users can insert own wallet"
  ON user_wallets
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);