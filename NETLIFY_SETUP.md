# Netlify Deployment & Token Distribution Setup

## Overview
This guide explains how to deploy your DADCOIN project on Netlify with serverless functions for secure token distribution.

## Prerequisites
- Netlify account
- DADCOIN SPL token created
- Distribution wallet with DADCOIN tokens
- Supabase project setup

## Setup Steps

### 1. Environment Variables
Add these to your Netlify environment variables (Site settings → Environment variables):

```bash
# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key

# Token Configuration
DADCOIN_MINT_ADDRESS=your_token_mint_address
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com

# Distribution Wallet (CRITICAL - Keep Secret!)
DISTRIBUTION_WALLET_PRIVATE_KEY=[your_wallet_private_key_as_array]
```

### 2. Private Key Format
Your distribution wallet private key should be stored as a JSON array:
```
[123,45,67,89,...]  // Array of numbers from your wallet's secret key
```

To get this from Phantom:
1. Export private key from Phantom
2. Convert base58 to byte array
3. Store as JSON array string

### 3. Database Tables
Create these tables in Supabase:

```sql
-- Game sessions table
CREATE TABLE game_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  game_type VARCHAR(50),
  score INTEGER,
  tokens_earned INTEGER,
  wallet_address VARCHAR(100),
  session_id VARCHAR(100) UNIQUE,
  claimed BOOLEAN DEFAULT false,
  claimed_at TIMESTAMP,
  transaction_signature VARCHAR(200),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Claim history table
CREATE TABLE claim_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  amount INTEGER,
  transaction_signature VARCHAR(200),
  wallet_address VARCHAR(100),
  claimed_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_game_sessions_user_id ON game_sessions(user_id);
CREATE INDEX idx_game_sessions_session_id ON game_sessions(session_id);
CREATE INDEX idx_claim_history_user_id ON claim_history(user_id);
```

### 4. Deploy to Netlify

1. **Connect GitHub Repository**
   - Login to Netlify
   - "New site from Git"
   - Select your repository

2. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Functions directory: `netlify/functions`

3. **Deploy**
   - Netlify will automatically deploy
   - Functions will be available at `/.netlify/functions/[function-name]`

### 5. Test the Functions

Test score submission:
```bash
curl -X POST https://your-site.netlify.app/.netlify/functions/submit-score \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SUPABASE_TOKEN" \
  -d '{
    "score": 100,
    "gameType": "grill",
    "walletAddress": "YOUR_WALLET_ADDRESS",
    "sessionId": "test-session-123"
  }'
```

Test token claim:
```bash
curl -X POST https://your-site.netlify.app/.netlify/functions/claim-tokens \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "test-session-123",
    "walletAddress": "YOUR_WALLET_ADDRESS"
  }'
```

## Security Considerations

1. **Private Key Security**
   - Never commit private keys
   - Use Netlify environment variables only
   - Consider using a hardware wallet for production

2. **Rate Limiting**
   - Netlify Functions have built-in rate limits
   - Add custom rate limiting in functions if needed

3. **Validation**
   - Score validation prevents cheating
   - Session IDs prevent duplicate claims
   - Wallet signature verification ensures ownership

## Monitoring

1. **Netlify Functions Log**
   - View in Netlify dashboard → Functions tab
   - Monitor for errors and successful transfers

2. **Supabase Dashboard**
   - Track game sessions
   - Monitor claim history
   - Check for suspicious activity

3. **Solana Explorer**
   - Verify transactions on-chain
   - Monitor distribution wallet balance

## Costs

- **Netlify Free Tier**: 125k function requests/month
- **Paid Plans**: Start at $25/month for more requests
- **Solana Transaction Fees**: ~$0.00025 per transfer

## Troubleshooting

### Function Timeout
- Netlify Functions have 10-second timeout
- If transactions fail, consider:
  - Using faster RPC endpoint
  - Implementing retry logic
  - Queue system for high volume

### Private Key Issues
- Ensure key is properly formatted as JSON array
- Test with devnet first
- Check wallet has SOL for fees

### Token Transfer Failures
- Verify distribution wallet has tokens
- Check user wallet can receive SPL tokens
- Ensure mint address is correct

## Next Steps

1. Test thoroughly on devnet
2. Set up monitoring alerts
3. Create admin dashboard for tracking
4. Implement withdrawal limits
5. Add multi-sig for extra security