# DADCOIN Setup Instructions

## 🚀 Complete Setup Guide

Follow these steps **in order** to get DADCOIN running with wallet-based authentication.

---

## Step 1: Database Setup

### 1.1 Run SQL Setup
1. Go to your **Supabase Dashboard** → **SQL Editor**
2. **Copy the entire contents** of `SETUP_COMPLETE.sql`
3. **Paste it** into the SQL Editor
4. **Click "Run"**
5. Wait for "Success" message

**That's it for the database!** ✅

---

## Step 2: Environment Variables

### 2.1 Create .env.local file
1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

### 2.2 Fill in your Supabase credentials
Edit `.env.local` with your actual values:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Get these from:** Supabase Dashboard → Settings → API

---

## Step 3: Test the Setup

### 3.1 Start Development Server
```bash
npm run dev
```

### 3.2 Check Console for Tests
1. Open browser console (F12)
2. Look for test results on homepage load
3. Should see: "🎉 All tests passed!"

### 3.3 Test Wallet Authentication
1. Go to `/auth` page
2. Try signing up with a test wallet address:
   - Wallet: `9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM`
   - Password: `testpassword123`
3. Should redirect to homepage on success

---

## Step 4: You're Done! 🎉

Your DADCOIN platform now has:
- ✅ Pure wallet-based authentication (no emails)
- ✅ Database with all required tables
- ✅ Game sessions tracking
- ✅ Token distribution system
- ✅ Global pool for joke generator

---

## 🗂️ Project Files Overview

### Core Files (Don't Delete):
- `SETUP_COMPLETE.sql` - **ONE-TIME DATABASE SETUP**
- `.env.local` - Your private credentials
- `src/lib/wallet-auth.ts` - Wallet authentication logic
- `src/context/WalletAuthContext.tsx` - Authentication state management
- `src/pages/AuthPage.tsx` - Login/signup page

### Optional Files:
- `SETUP_INSTRUCTIONS.md` - This guide (can delete after setup)
- `.env.example` - Template for other developers

---

## 🔧 Troubleshooting

### Database Issues:
- **"Function does not exist"** → Re-run `SETUP_COMPLETE.sql`
- **"Permission denied"** → Check your Supabase RLS policies

### Authentication Issues:
- **"Invalid wallet format"** → Use valid Solana address (32-44 chars, base58)
- **"Already registered"** → Try logging in instead of signing up

### Environment Issues:
- **"Network error"** → Check `.env.local` has correct Supabase URL/key
- **"CORS error"** → Make sure you're running on localhost during development

---

## 🎮 Ready to Use Features

After setup, users can:
1. **Sign up** with wallet address + password
2. **Login** with wallet address + password  
3. **Play grill game** and earn tokens
4. **Generate dad jokes** and increase global pool
5. **Track game sessions** and claim history

**No emails required - pure wallet-based authentication!** 🚀