/*
  # Update auth trigger for wallet-based authentication

  This migration updates the auth trigger to handle wallet-based authentication
  instead of email-based authentication.

  1. Changes
    - Modified trigger to use wallet address as primary identifier
    - Updated user_wallet creation to use wallet address from auth metadata
*/

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_wallets (user_id, wallet_address, balance)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'wallet_address',
    0
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();