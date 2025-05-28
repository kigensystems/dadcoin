/*
  # Update wallet address handling
  
  1. Changes
    - Remove wallet address validation to allow any input
    - Keep wallet_address column for storing the values
  
  2. Security
    - Maintain RLS policies for data access
*/

-- Add wallet_address column if it doesn't exist
ALTER TABLE public.user_wallets
ADD COLUMN IF NOT EXISTS wallet_address TEXT;

-- Drop existing trigger and functions if they exist
DROP TRIGGER IF EXISTS validate_user_wallet_trigger ON public.user_wallets;
DROP FUNCTION IF EXISTS public.validate_user_wallet();
DROP FUNCTION IF EXISTS public.check_wallet_address(TEXT);