// Pure wallet-based authentication (no Supabase auth)
import { supabase } from './supabase';

export interface WalletAuthUser {
  user_id: string;
  wallet_address: string;
  created_at: string;
}

export interface AuthResult {
  success: boolean;
  user?: WalletAuthUser;
  error?: string;
}

// Register new wallet
export const registerWallet = async (walletAddress: string, password: string): Promise<AuthResult> => {
  try {
    // Validate wallet address format
    if (!/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(walletAddress)) {
      return { success: false, error: 'Invalid wallet address format' };
    }

    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long' };
    }

    // Call our custom registration function
    const { data, error } = await supabase.rpc('register_wallet', {
      wallet_addr: walletAddress,
      plain_password: password
    });

    if (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Registration failed' };
    }

    if (!data.success) {
      return { success: false, error: data.error };
    }

    // Store session in localStorage
    const user = {
      user_id: data.user_id,
      wallet_address: data.wallet_address,
      created_at: new Date().toISOString()
    };
    
    localStorage.setItem('dadcoin_wallet_session', JSON.stringify(user));
    
    return { success: true, user };

  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, error: 'Registration failed' };
  }
};

// Login with wallet
export const loginWallet = async (walletAddress: string, password: string): Promise<AuthResult> => {
  try {
    // Validate wallet address format
    if (!/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(walletAddress)) {
      return { success: false, error: 'Invalid wallet address format' };
    }

    // Call our custom authentication function
    const { data, error } = await supabase.rpc('authenticate_wallet', {
      wallet_addr: walletAddress,
      plain_password: password
    });

    if (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed' };
    }

    if (!data.success) {
      return { success: false, error: data.error };
    }

    // Store session in localStorage
    const user = {
      user_id: data.user_id,
      wallet_address: data.wallet_address,
      created_at: data.created_at
    };
    
    localStorage.setItem('dadcoin_wallet_session', JSON.stringify(user));
    
    return { success: true, user };

  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Login failed' };
  }
};

// Logout
export const logoutWallet = (): void => {
  localStorage.removeItem('dadcoin_wallet_session');
};

// Get current session
export const getCurrentWalletSession = (): WalletAuthUser | null => {
  try {
    const session = localStorage.getItem('dadcoin_wallet_session');
    if (!session) return null;
    
    return JSON.parse(session);
  } catch {
    return null;
  }
};

// Check if user is authenticated
export const isWalletAuthenticated = (): boolean => {
  return getCurrentWalletSession() !== null;
};