import React, { createContext, useContext, useEffect, useState } from 'react';
import { WalletAuthUser, getCurrentWalletSession, logoutWallet } from '../lib/wallet-auth';

interface WalletAuthContextType {
  user: WalletAuthUser | null;
  isAuthenticated: boolean;
  logout: () => void;
  refreshUser: () => void;
}

const WalletAuthContext = createContext<WalletAuthContextType | null>(null);

export const useWalletAuth = () => {
  const context = useContext(WalletAuthContext);
  if (!context) {
    throw new Error('useWalletAuth must be used within a WalletAuthProvider');
  }
  return context;
};

interface WalletAuthProviderProps {
  children: React.ReactNode;
}

export const WalletAuthProvider: React.FC<WalletAuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<WalletAuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const refreshUser = () => {
    const session = getCurrentWalletSession();
    setUser(session);
    setIsAuthenticated(session !== null);
  };

  const logout = () => {
    logoutWallet();
    setUser(null);
    setIsAuthenticated(false);
  };

  useEffect(() => {
    // Check for existing session on mount
    refreshUser();
  }, []);

  const value = {
    user,
    isAuthenticated,
    logout,
    refreshUser
  };

  return (
    <WalletAuthContext.Provider value={value}>
      {children}
    </WalletAuthContext.Provider>
  );
};

export default WalletAuthContext;