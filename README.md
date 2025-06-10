# DADCOIN 🪙

The world's first cryptocurrency powered by dad jokes and grilling skills. Earn DADCOIN tokens by mastering the grill and sharing your best dad humor!

## Features

- 🔥 **Grill Master Challenge** - Play the BBQ game to earn tokens
- 😄 **Dad Joke Generator** - Mine DADCOIN with legendary dad jokes
- 👛 **Phantom Wallet Integration** - Connect your Solana wallet
- 🏆 **Leaderboards** - Compete for the top spots
- 💰 **Real Token Rewards** - Earn actual DADCOIN SPL tokens

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Blockchain**: Solana Web3.js + SPL Token
- **Wallet**: Phantom Wallet Integration
- **Backend**: Supabase (auth & data)
- **Deployment**: Vercel/Netlify ready

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Phantom Wallet browser extension
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/dadcoin.git
cd dadcoin
```

2. Install dependencies:
```bash
npm install
```

3. Create environment variables:
```bash
cp .env.example .env
```

4. Update `.env` with your values:
```env
# Supabase (required)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Token Configuration (required for distribution)
VITE_DADCOIN_MINT_ADDRESS=your_token_mint_address
VITE_DISTRIBUTION_WALLET=your_distribution_wallet_public_key
VITE_SOLANA_NETWORK=mainnet-beta
VITE_SOLANA_RPC=https://api.mainnet-beta.solana.com
```

5. Run development server:
```bash
npm run dev
```

## Token Distribution Setup

### 1. Create Your DADCOIN Token

Create an SPL token on Solana using tools like:
- [Solana Token Creator](https://www.solana.com/developers/guides/getstarted/how-to-create-a-token)
- [Strata Protocol](https://strataprotocol.com)
- Solana CLI tools

### 2. Configure Token Settings

Update `src/lib/tokenConfig.ts`:
```typescript
export const TOKEN_CONFIG = {
  MINT_ADDRESS: 'YOUR_DADCOIN_MINT_ADDRESS',
  DISTRIBUTION_WALLET: 'YOUR_DISTRIBUTION_WALLET_PUBLIC_KEY',
  DECIMALS: 9,
  NETWORK: 'mainnet-beta'
};
```

### 3. Backend Requirements

Token distribution requires a backend server to:
- Validate game scores securely
- Sign transactions with distribution wallet
- Submit transactions to Solana network

See [TOKEN_SETUP.md](./TOKEN_SETUP.md) for detailed backend implementation guide.

## Game Mechanics

### Grill Master Challenge
- Click food at perfect timing to score points
- Earn 0.1 DADCOIN per point
- Compete on global leaderboard
- 60-second time limit

### Dad Joke Generator
- Generate random dad jokes
- Rare jokes earn bonus tokens
- 0.0001% chance for jackpot
- Hourly claim limits

## Security Features

- ✅ Server-side score validation
- ✅ Wallet signature verification
- ✅ Session-based claim tracking
- ✅ Rate limiting protection
- ✅ No private keys in frontend

## Development

### Commands

```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check

# Linting
npm run lint

# Format code
npm run format
```

### Project Structure

```
src/
├── components/       # React components
├── context/         # React context providers
├── lib/            # Utilities and integrations
├── pages/          # Page components
├── assets/         # Images and static files
└── App.tsx         # Main app component
```

## Deployment

### Vercel
```bash
npm run build
vercel --prod
```

### Netlify
```bash
npm run build
netlify deploy --prod --dir=dist
```

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

MIT License - see LICENSE file for details

## Support

- Discord: [Join our community](#)
- Twitter: [@dadcoin](#)
- Email: support@dadcoin.io

## Roadmap

- [ ] Mobile app version
- [ ] More games (Dad Joke Battle, Lawn Mower Racing)
- [ ] NFT integration for rare jokes
- [ ] DAO governance
- [ ] Cross-chain bridges

---

Built with ❤️ and dad jokes by the DADCOIN team