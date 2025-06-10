import { PublicKey } from '@solana/web3.js';

// Token configuration - Update these values when you have your token deployed
export const TOKEN_CONFIG = {
  // DADCOIN Token Mint Address (you'll provide this after creating the token)
  MINT_ADDRESS: process.env.VITE_DADCOIN_MINT_ADDRESS || 'YOUR_TOKEN_MINT_ADDRESS_HERE',
  
  // Token decimals (usually 9 for SPL tokens)
  DECIMALS: 9,
  
  // Distribution wallet (holds tokens for game rewards)
  DISTRIBUTION_WALLET: process.env.VITE_DISTRIBUTION_WALLET || 'YOUR_DISTRIBUTION_WALLET_HERE',
  
  // Solana network
  NETWORK: process.env.VITE_SOLANA_NETWORK || 'mainnet-beta',
  
  // RPC endpoint
  RPC_ENDPOINT: process.env.VITE_SOLANA_RPC || 'https://api.mainnet-beta.solana.com',
};

// Helper to get PublicKey from string
export const getTokenMintPublicKey = () => {
  try {
    return new PublicKey(TOKEN_CONFIG.MINT_ADDRESS);
  } catch (error) {
    console.error('Invalid token mint address:', error);
    return null;
  }
};

export const getDistributionWalletPublicKey = () => {
  try {
    return new PublicKey(TOKEN_CONFIG.DISTRIBUTION_WALLET);
  } catch (error) {
    console.error('Invalid distribution wallet address:', error);
    return null;
  }
};