# CLAUDE.md

> **Purpose:** Provide Claude Code with project-specific context, coding conventions, and best practices for the Dadcoin project - a humorous cryptocurrency platform powered by dad jokes.

---

## 1. Project Overview

- **Name:** Dadcoin  
- **Description:**  
  A React-based cryptocurrency platform that gamifies dad jokes through "Proof of Dad Work" (PoWD). Users earn Dadcoin tokens by generating and sharing dad jokes, with real-time global pool tracking and Solana wallet integration.

- **Primary Stack:**  
  - Frontend: React (v18.2.0) with functional components and hooks  
  - Language: TypeScript (strict mode enabled)  
  - Styling: Tailwind CSS (with custom dadcoin-yellow/black theme)  
  - Build Tools: Vite (v5.1.4)  
  - State Management: React Context (GlobalPoolContext)
  - Backend: Supabase (PostgreSQL + real-time subscriptions)
  - Blockchain: Solana Web3.js with Phantom wallet integration
  - Routing: React Router DOM (v6.22.3)

- **Secondary Tools / Integrations:**  
  - ESLint (flat config) for code linting  
  - Lucide React for icons  
  - Canvas Confetti for animations  
  - PostCSS + Autoprefixer  
  - Supabase real-time subscriptions for live data  

---

## 2. File & Folder Structure

```
/
├── public/                    # Static assets
├── src/
│   ├── components/            # Reusable UI components
│   │   ├── common/            # Shared components (Newsletter)
│   │   ├── home/              # Homepage-specific components
│   │   │   ├── CoinCounter.tsx
│   │   │   ├── JokeGenerator.tsx
│   │   │   ├── FeatureCard.tsx
│   │   │   └── DadHero.tsx
│   │   └── layout/            # Layout components
│   │       ├── Header.tsx
│   │       └── Footer.tsx
│   ├── context/               # React Context providers
│   │   └── GlobalPoolContext.tsx
│   ├── lib/                   # External service integrations
│   │   ├── supabase.ts        # Supabase client config
│   │   └── phantom.ts         # Solana wallet integration
│   ├── pages/                 # Page-level route components
│   │   ├── HomePage.tsx
│   │   ├── AboutPage.tsx
│   │   ├── AuthPage.tsx
│   │   ├── FaqPage.tsx
│   │   ├── PrivacyPage.tsx
│   │   └── TermsPage.tsx
│   ├── App.tsx                # Root component with routing
│   ├── main.tsx               # Vite entry point
│   ├── App.css                # Component-specific styles
│   ├── index.css              # Global styles and Tailwind
│   └── vite-env.d.ts          # Vite type definitions
├── supabase/migrations/       # Database migration files
├── .env.local                 # Environment variables (Supabase keys)
├── eslint.config.js           # ESLint flat configuration
├── tailwind.config.js         # Tailwind custom theme
├── tsconfig.json              # TypeScript base config
├── tsconfig.app.json          # App-specific TypeScript config
├── vite.config.ts             # Vite build configuration
└── package.json
```

---

## 3. Coding Standards

1. **Language & Syntax**  
   - Always use **TypeScript** (`.tsx` / `.ts`)  
   - Enable `strict` mode with `noUnusedLocals` and `noUnusedParameters`  
   - Use **functional components** and **React Hooks** exclusively  
   - Use ES Modules (`import` / `export`) with Vite bundler resolution

2. **Styling & Theme**  
   - Use **Tailwind CSS** exclusively for styling  
   - Custom theme colors: `dadcoin-yellow` (#fbb026) and `dadcoin-black` (#000000)  
   - Pre-defined component classes: `.btn`, `.btn-primary`, `.btn-outline`, `.card`, `.section`, `.container`  
   - Inter font family as primary typeface  
   - Custom animations: `float` and `spin` for visual effects

3. **Component Design**  
   - Each component uses TypeScript interfaces for props (`ComponentNameProps`)  
   - Components are organized by feature/domain (`home/`, `layout/`, `common/`)  
   - Use semantic HTML elements within React components  
   - Implement proper accessibility with `aria-*` attributes and focus states

4. **State Management & Data Flow**  
   - Global state via React Context (`GlobalPoolContext` for real-time pool values)  
   - Supabase real-time subscriptions for live data updates  
   - Local component state for UI interactions (modals, forms, animations)  
   - Authentication state managed through Supabase Auth with session persistence

5. **External Integrations**  
   - **Supabase**: Database, auth, and real-time subscriptions  
   - **Solana/Phantom**: Wallet connection and message signing  
   - **Environment Variables**: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY

---

## 4. Key Features & Business Logic

1. **Dad Joke Mining System**  
   - Users generate jokes to earn Dadcoin tokens  
   - Implemented in `JokeGenerator.tsx` component  
   - Integration with global pool value tracking

2. **Wallet Integration**  
   - Phantom wallet connection via `lib/phantom.ts`  
   - Wallet address display in header (truncated format)  
   - Message signing for authentication

3. **Real-time Global Pool**  
   - Live updating coin pool via Supabase subscriptions  
   - Animated counter in `CoinCounter.tsx`  
   - Context provider for global state management

4. **Authentication Flow**  
   - Supabase Auth with wallet-based authentication  
   - Session persistence and auto-refresh  
   - Protected routes and user state management

---

## 5. Build & Development Commands

```bash
# Install dependencies
npm install

# Start dev server (localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

---

## 6. Environment Setup

Required environment variables in `.env.local`:
```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## 7. Prompt Guidelines for Claude Code

1. **Project Context**  
   - Always reference the dad joke/cryptocurrency theme when creating features  
   - Maintain the humorous, lighthearted tone in UI copy  
   - Use the established dadcoin-yellow/black color scheme

2. **Component Creation**  
   - Follow the existing folder structure (`components/home/`, `components/layout/`, etc.)  
   - Use TypeScript interfaces for all component props  
   - Implement responsive design with Tailwind breakpoints  
   - Include proper accessibility attributes

3. **Integration Requirements**  
   - New features should integrate with the GlobalPoolContext when relevant  
   - Use Supabase for data persistence and real-time updates  
   - Follow the established pattern for wallet integration if blockchain features are needed

4. **Styling Conventions**  
   - Use existing Tailwind component classes (`.btn`, `.card`, etc.)  
   - Maintain the bold, high-contrast visual style  
   - Include hover states and smooth transitions  
   - Use Lucide React icons for consistency

5. **Code Quality**  
   - Write clean, readable TypeScript with proper type definitions  
   - Handle loading and error states appropriately  
   - Include proper cleanup for subscriptions and event listeners  
   - Follow React best practices for hooks and lifecycle management

---

## 8. Important Notes

- The header only displays on the homepage (`/`) with scroll-based visibility  
- Real-time features rely on Supabase subscriptions - ensure proper cleanup  
- Wallet integration is optional but should follow the established Phantom pattern  
- The global pool value is the central metric driving user engagement  
- All dad joke content should maintain family-friendly humor standards