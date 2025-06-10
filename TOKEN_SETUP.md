# DADCOIN Token Distribution Setup Guide

## Overview
This guide explains how to set up the DADCOIN token distribution system once you've created your SPL token on Solana.

## Prerequisites
- DADCOIN SPL token created on Solana
- Distribution wallet with DADCOIN tokens for game rewards
- Node.js backend server (for secure transaction signing)

## Configuration Steps

### 1. Update Token Configuration
Edit `src/lib/tokenConfig.ts` with your token details:

```typescript
export const TOKEN_CONFIG = {
  // Your DADCOIN token mint address
  MINT_ADDRESS: 'YOUR_DADCOIN_MINT_ADDRESS_HERE',
  
  // Distribution wallet that holds tokens for rewards
  DISTRIBUTION_WALLET: 'YOUR_DISTRIBUTION_WALLET_PUBLIC_KEY_HERE',
  
  // Network (mainnet-beta or devnet)
  NETWORK: 'mainnet-beta',
  
  // RPC endpoint (optional: use your own RPC for better performance)
  RPC_ENDPOINT: 'https://api.mainnet-beta.solana.com',
};
```

### 2. Environment Variables
Create a `.env` file in your project root:

```env
VITE_DADCOIN_MINT_ADDRESS=YOUR_MINT_ADDRESS
VITE_DISTRIBUTION_WALLET=YOUR_DISTRIBUTION_WALLET
VITE_SOLANA_NETWORK=mainnet-beta
VITE_SOLANA_RPC=https://api.mainnet-beta.solana.com
VITE_API_URL=http://localhost:3001/api
```

### 3. Backend Implementation Required

The current implementation prepares transactions on the frontend but requires a backend server to:

1. **Validate Game Scores**
   - Verify game sessions are legitimate
   - Prevent score manipulation
   - Check for duplicate claims

2. **Sign Transactions**
   - Store distribution wallet private key securely
   - Sign SPL token transfer transactions
   - Submit transactions to Solana

3. **Track Distribution**
   - Log all token distributions
   - Monitor distribution wallet balance
   - Generate reports

### 4. Security Considerations

- **Never expose private keys** in frontend code
- **Validate all game scores** server-side
- **Implement rate limiting** to prevent abuse
- **Use message signing** to verify wallet ownership
- **Monitor for suspicious activity**

## Game Token Distribution Flow

1. **Player completes game** → Score submitted to backend
2. **Backend validates score** → Creates game session record
3. **Player claims tokens** → Signs message with wallet
4. **Backend verifies claim** → Creates SPL transfer transaction
5. **Transaction signed** → Using distribution wallet private key
6. **Tokens transferred** → Transaction submitted to Solana
7. **Confirmation** → Player receives tokens in wallet

## Token Economics

Current reward structure:
- **Grill Game**: 0.1 DADCOIN per point scored
- **Joke Generator**: Variable rewards based on joke rarity

Adjust these values in `src/lib/api.ts`:

```typescript
export const calculateTokenReward = (score: number, gameType: string): number => {
  switch (gameType) {
    case 'grill':
      return Math.floor(score * 0.1); // Adjust multiplier as needed
    // ...
  }
};
```

## Testing on Devnet

1. Create a test token on Solana devnet
2. Update config to use devnet:
   ```typescript
   NETWORK: 'devnet',
   RPC_ENDPOINT: 'https://api.devnet.solana.com',
   ```
3. Get devnet SOL from faucet
4. Test full distribution flow

## Backend API Endpoints Needed

```typescript
// POST /api/game/submit-score
{
  score: number,
  gameType: string,
  walletAddress: string,
  sessionId: string
}

// POST /api/tokens/claim
{
  gameSessionId: string,
  walletAddress: string,
  signature: string,
  message: string
}

// GET /api/game/history
// Returns user's game history and earnings
```

## Support

For questions about token setup:
1. Ensure your SPL token is properly configured
2. Verify distribution wallet has sufficient balance
3. Check Solana network status
4. Review transaction logs for errors

## Next Steps

1. Deploy backend server with wallet signing capability
2. Update API endpoints in frontend
3. Test on devnet before mainnet
4. Monitor distribution wallet balance
5. Set up alerts for low balance conditions