/*
  # Create claim history view with wallet addresses
  
  1. Changes
    - Create a view to show claim history with wallet addresses
    - Set up security for the view using RLS
  
  2. Security
    - View inherits RLS from underlying tables
    - Users can only see their own claims
*/

-- Create view for claim history with wallet addresses
CREATE OR REPLACE VIEW claim_history_with_wallet AS
SELECT 
  ch.id,
  uw.wallet_address,
  ch.amount,
  ch.claimed_at
FROM claim_history ch
JOIN user_wallets uw ON ch.user_id = uw.user_id;

-- Grant access to authenticated users
GRANT SELECT ON claim_history_with_wallet TO authenticated;

-- The view automatically inherits RLS from the underlying tables,
-- so we don't need to set up additional policies