/*
  # Create user wallet and history tables
  
  1. New Tables
    - `user_wallets`: Stores user wallet balances
      - `user_id` (uuid, references auth.users)
      - `balance` (numeric, default 0)
      - `updated_at` (timestamp)
    
    - `claim_history`: Stores history of user claims
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `amount` (numeric)
      - `claimed_at` (timestamp)
  
  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to read/write their own data
*/

-- Create user wallets table
CREATE TABLE IF NOT EXISTS user_wallets (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  balance numeric DEFAULT 0 NOT NULL,
  updated_at timestamptz DEFAULT now()
);

-- Create claim history table
CREATE TABLE IF NOT EXISTS claim_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  amount numeric NOT NULL,
  claimed_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE claim_history ENABLE ROW LEVEL SECURITY;

-- Policies for user_wallets
CREATE POLICY "Users can read own wallet"
  ON user_wallets
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own wallet"
  ON user_wallets
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policies for claim_history
CREATE POLICY "Users can read own claim history"
  ON claim_history
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own claims"
  ON claim_history
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create trigger to create wallet on user signup
CREATE OR REPLACE FUNCTION create_user_wallet()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_wallets (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_user_wallet();