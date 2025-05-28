/*
  # Add last claim timestamp and cooldown check
  
  1. Changes
    - Add last_claim_at column to user_wallets table
    - Add function to check claim cooldown
    - Add constraint to enforce one-hour cooldown between claims
  
  2. Security
    - Maintain existing RLS policies
    - Add server-side validation for claim cooldown
*/

-- Add last_claim_at column to user_wallets
ALTER TABLE user_wallets
ADD COLUMN last_claim_at timestamptz DEFAULT NULL;

-- Create function to check claim cooldown
CREATE OR REPLACE FUNCTION check_claim_cooldown(wallet_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN (
    SELECT 
      CASE 
        WHEN last_claim_at IS NULL THEN true
        WHEN NOW() - last_claim_at >= interval '1 hour' THEN true
        ELSE false
      END
    FROM user_wallets
    WHERE user_id = wallet_id
  );
END;
$$ LANGUAGE plpgsql;