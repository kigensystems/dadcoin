// Quick test to check if wallet registration worked
import { supabase } from './supabase';

export const checkWalletRegistration = async (walletAddress: string) => {
  console.log('🔍 Checking if wallet was registered:', walletAddress);
  
  try {
    // First, let's see ALL records in both tables
    console.log('📊 Checking ALL wallet_auth records...');
    const { data: allAuth, error: allAuthError } = await supabase
      .from('wallet_auth')
      .select('*');
    console.log('All auth records:', { allAuth, allAuthError });
    
    console.log('📊 Checking ALL user_wallets records...');
    const { data: allWallets, error: allWalletsError } = await supabase
      .from('user_wallets')
      .select('*');
    console.log('All wallet records:', { allWallets, allWalletsError });
    
    // Now check for specific wallet
    const { data: authData, error: authError } = await supabase
      .from('wallet_auth')
      .select('*')
      .eq('wallet_address', walletAddress);
      
    console.log('Specific wallet in auth table:', { authData, authError });
    
    const { data: walletData, error: walletError } = await supabase
      .from('user_wallets')
      .select('*')
      .eq('wallet_address', walletAddress);
      
    console.log('Specific wallet in user_wallets table:', { walletData, walletError });
    
    // Test authentication with the wallet
    console.log('🔐 Testing authentication...');
    const { data: authTest, error: authTestError } = await supabase.rpc('authenticate_wallet', {
      wallet_addr: walletAddress,
      plain_password: 'testpassword123'
    });
    
    console.log('Authentication test:', { authTest, authTestError });
    
  } catch (error) {
    console.error('Check registration error:', error);
  }
};

// Auto-run this check
checkWalletRegistration('9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM');