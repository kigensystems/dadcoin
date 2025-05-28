/*
  # Add current_pool to user_wallets
  
  1. Changes
    - Add current_pool column to user_wallets table to persist user's unclaimed rewards
    
  2. Security
    - Maintain existing RLS policies
*/

ALTER TABLE user_wallets
ADD COLUMN current_pool numeric DEFAULT 0;