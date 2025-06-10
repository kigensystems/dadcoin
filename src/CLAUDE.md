# CLAUDE.md

> **Purpose:** Provide Claude Code with project-specific context, coding conventions, and best practices for the DADCOIN project.

---

## 1. Project Overview

- **Name:** DADCOIN
- **Description:**  
  A React+TypeScript web application for a cryptocurrency project that rewards users with DADCOIN tokens for playing games (BBQ Grill Challenge) and generating dad jokes. Features Solana blockchain integration for real token distribution.

- **Primary Stack:**  
  - Frontend: React (v18+) with functional components and hooks  
  - Language: TypeScript (strict mode enabled)  
  - Styling: Tailwind CSS (with custom dadcoin-yellow theme #fbb026)  
  - Build Tools: Vite  
  - State Management: React Context (GlobalPoolContext)  
  - Blockchain: Solana Web3.js + SPL Token
  - Database: Supabase (auth, real-time subscriptions)

- **Key Features:**  
  - 🔥 Grill Master Challenge game (earn 0.1 DADCOIN per point)
  - 😄 Dad Joke Generator with rarity system
  - 👛 Phantom Wallet integration
  - 🏆 Local storage leaderboards
  - 💰 SPL token distribution system

---

## 2. Token Integration

### Configuration Files
- `src/lib/tokenConfig.ts` - Token mint address and distribution wallet configuration
- `src/lib/phantom.ts` - Wallet connection and SPL token transfer logic
- `src/lib/api.ts` - Game score validation and token claim API

### Security Implementation
- Server-side score validation required (prevents client-side manipulation)
- Wallet signature verification for all token claims
- Session-based tracking prevents duplicate claims
- No private keys stored in frontend code
- Rate limiting on joke generation and token claims

### Setup Required
1. Create DADCOIN SPL token on Solana
2. Update `tokenConfig.ts` with mint address and distribution wallet
3. Deploy backend server for transaction signing
4. See `TOKEN_SETUP.md` for detailed instructions

### Game Token Rewards
- **Grill Game**: 0.1 DADCOIN per point scored
- **Joke Generator**: 
  - Common jokes: 1-10 DADCOIN
  - Super rare (1%): 1,000 DADCOIN
  - Ultra rare (0.015%): 10,000 DADCOIN
  - Jackpot (0.0001%): Entire global pool

---

## 3. Coding Standards

1. **Component Structure**  
   - Use functional components with TypeScript
   - Props interfaces defined above component
   - Custom hooks in `src/hooks/`
   - Keep components focused and small

2. **Styling**  
   - Tailwind CSS only (no CSS files)
   - Use theme colors: `dadcoin-yellow`, `black`
   - Consistent spacing and borders
   - Shadow style: `shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]`

3. **Game Development**  
   - Use `requestAnimationFrame` or `setInterval` for game loops
   - Clean up timers in `useEffect` return
   - Local storage for leaderboards
   - Canvas confetti for celebrations

4. **Blockchain Integration**  
   - All token transfers require backend validation
   - Use message signing for wallet verification
   - Handle wallet connection errors gracefully
   - Show clear transaction status to users

---

## 4. File & Folder Structure
```
src/
├── components/
│   ├── common/         # Shared components (Newsletter)
│   ├── home/          # Homepage components
│   ├── layout/        # Header, Footer
│   ├── GrillGame.tsx  # Main game component
│   └── FoodItem.tsx   # Game food items
├── context/           # GlobalPoolContext
├── hooks/            # Custom hooks (useSound)
├── lib/              # Utilities
│   ├── api.ts        # Game API endpoints
│   ├── phantom.ts    # Wallet integration
│   ├── supabase.ts   # Database client
│   └── tokenConfig.ts # Token configuration
├── pages/            # Page components
└── App.tsx           # Main app with routing
```

---

## 5. Important Instructions

### DO:
- ✅ Use high-quality emojis instead of image files when possible
- ✅ Implement proper error handling for all async operations
- ✅ Add loading states for better UX
- ✅ Validate all user inputs
- ✅ Keep game mechanics simple but engaging
- ✅ Use TypeScript strict mode

### DON'T:
- ❌ Store private keys or sensitive data in frontend
- ❌ Trust client-side game scores without validation
- ❌ Create complex game mechanics that confuse users
- ❌ Use external CSS files (Tailwind only)
- ❌ Implement token transfers without backend validation

---

## 6. Testing Checklist

Before deploying:
- [ ] Test wallet connection flow
- [ ] Verify game score submission
- [ ] Check token claim process
- [ ] Test on both desktop and mobile
- [ ] Verify Supabase real-time updates
- [ ] Check rate limiting works
- [ ] Test with Phantom wallet on devnet first