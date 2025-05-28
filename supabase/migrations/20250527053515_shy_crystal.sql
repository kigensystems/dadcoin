/*
  # Reset all platform values
  
  1. Changes
    - Reset global pool back to initial value of 500,000
    - Clear all user wallet balances and pools
    - Clear claim history
    
  2. Security
    - Maintain existing RLS policies
*/

-- Reset global pool to initial value
UPDATE global_pool
SET value = 500000
WHERE id = 1;

-- Reset all user wallet balances and pools
UPDATE user_wallets
SET 
  balance = 0,
  current_pool = 0,
  last_claim_at = NULL;

-- Clear claim history
TRUNCATE claim_history;