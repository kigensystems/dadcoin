/*
  # Add wallet address validation

  1. Changes
    - Add wallet address column to user_wallets table
    - Add validation function for wallet addresses
    - Add trigger to validate wallet addresses on insert/update

  2. Security
    - Maintain existing RLS policies
    - Add validation to ensure proper wallet address format
*/

-- Add wallet_address column if it doesn't exist
ALTER TABLE public.user_wallets
ADD COLUMN IF NOT EXISTS wallet_address TEXT;

-- Create function to validate wallet address format
CREATE OR REPLACE FUNCTION public.check_wallet_address(address TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  IF address IS NULL THEN
    RETURN TRUE; -- Allow null addresses
  END IF;
  RETURN address ~ '^[1-9A-HJ-NP-Za-km-z]{32,44}$';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Create trigger function to validate wallet address
CREATE OR REPLACE FUNCTION public.validate_user_wallet()
RETURNS TRIGGER AS $$
BEGIN
  IF NOT public.check_wallet_address(NEW.wallet_address) THEN
    RAISE EXCEPTION 'Invalid wallet address format';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS validate_user_wallet_trigger ON public.user_wallets;

-- Create new trigger for wallet address validation
CREATE TRIGGER validate_user_wallet_trigger
BEFORE INSERT OR UPDATE ON public.user_wallets
FOR EACH ROW
EXECUTE FUNCTION public.validate_user_wallet();