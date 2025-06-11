# Pump.fun Token Setup Guide

## Overview
This guide explains how to integrate your pump.fun token with the DADCOIN game distribution system.

## Key Differences with Pump.fun Tokens

### 1. **Token Decimals**
- Pump.fun tokens use **6 decimals** (not 9)
- We've already updated the code to handle this

### 2. **Token Creation Process**
1. Go to [pump.fun](https://pump.fun)
2. Create your DADCOIN token
3. Set token supply (e.g., 1 billion)
4. Add liquidity as needed
5. Get your token mint address

### 3. **What You Need After Token Creation**

From pump.fun, you'll get:
- **Token Mint Address**: The unique identifier for your token
- **Token Symbol**: DADCOIN
- **Decimals**: 6 (standard for pump.fun)

## Integration Steps

### 1. **Update Environment Variables**

```env
# Token from pump.fun
VITE_DADCOIN_MINT_ADDRESS=YOUR_PUMP_FUN_TOKEN_ADDRESS
VITE_DISTRIBUTION_WALLET=YOUR_WALLET_THAT_HOLDS_TOKENS

# For Netlify Functions
DADCOIN_MINT_ADDRESS=YOUR_PUMP_FUN_TOKEN_ADDRESS
DISTRIBUTION_WALLET_PRIVATE_KEY=[your_wallet_private_key_array]
```

### 2. **Buy Tokens for Distribution**

After creating on pump.fun:
1. Buy some tokens from the pump.fun interface
2. Send them to your distribution wallet
3. This wallet will distribute rewards to players

### 3. **Token Distribution Strategy**

Consider your tokenomics:
- Total Supply: Set on pump.fun
- Game Rewards Pool: How many tokens for players?
- Distribution Rate: 0.1 DADCOIN per game point

Example allocation:
- 1B total supply
- 100M for game rewards (10%)
- Can reward 1 billion game points

### 4. **Liquidity Considerations**

Pump.fun tokens need liquidity for trading:
- Initial liquidity from creation
- Consider bonding curve progress
- May affect token price as players sell rewards

## Testing Checklist

1. **After Token Creation:**
   - [ ] Copy token mint address
   - [ ] Update `tokenConfig.ts`
   - [ ] Buy tokens for distribution wallet
   - [ ] Test wallet has SOL for fees

2. **Test Game Flow:**
   - [ ] Play game and earn points
   - [ ] Submit score (creates session)
   - [ ] Claim tokens (sends DADCOIN)
   - [ ] Check wallet received tokens

3. **Verify on Solana:**
   - Check transaction on [Solscan](https://solscan.io)
   - Verify token account created
   - Confirm correct amount sent

## Important Notes

### Token Price Volatility
- Pump.fun tokens can be very volatile
- Players earning tokens might sell immediately
- Consider this in your reward calculations

### Bonding Curve
- Pump.fun uses bonding curves
- Price increases as more people buy
- Early buyers get better prices

### Migration Path
If your token "graduates" from pump.fun:
- Token mint address stays the same
- Distribution system continues working
- May need to add to DEX liquidity

## Monitoring

1. **Track Distribution:**
   ```sql
   -- Total tokens distributed
   SELECT SUM(tokens_earned) as total_distributed
   FROM game_sessions
   WHERE claimed = true;
   ```

2. **Watch Wallet Balance:**
   - Monitor distribution wallet
   - Refill when running low
   - Set up alerts

3. **Player Activity:**
   - Track claim rates
   - Monitor sell pressure
   - Adjust rewards if needed

## FAQ

**Q: Do I need to modify the smart contracts?**
A: No, pump.fun handles all contracts. Just use the token mint address.

**Q: Can players trade earned tokens immediately?**
A: Yes, pump.fun tokens are immediately tradeable.

**Q: What if my token "graduates" to Raydium?**
A: The distribution system continues working with the same mint address.

**Q: How much SOL do I need in distribution wallet?**
A: About 0.002 SOL per distribution transaction for fees.

## Support

- Pump.fun Discord: [discord.gg/pumpfun](https://discord.gg/pumpfun)
- Solana Status: [status.solana.com](https://status.solana.com)
- Your Game Support: support@dadcoin.io