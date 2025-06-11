-- ================================
-- DADCOIN PRODUCTION SETUP
-- ================================
-- Safe for production - will NOT delete existing data
-- Only creates tables/functions if they don't exist

-- 1. Global Pool Table (for joke generator jackpot)
CREATE TABLE IF NOT EXISTS global_pool (
  id INTEGER PRIMARY KEY DEFAULT 1,
  value BIGINT NOT NULL DEFAULT 500000,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO global_pool (id, value) 
VALUES (1, 500000) 
ON CONFLICT (id) DO NOTHING;

-- 2. Wallet Authentication Table (pure wallet-based auth)
CREATE TABLE IF NOT EXISTS wallet_auth (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_address VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE
);

-- 3. User Wallets Table (stores balances and links to wallet_auth)
CREATE TABLE IF NOT EXISTS user_wallets (
  user_id UUID PRIMARY KEY REFERENCES wallet_auth(id) ON DELETE CASCADE,
  wallet_address VARCHAR(100) NOT NULL UNIQUE,
  wallet_auth_id UUID REFERENCES wallet_auth(id) ON DELETE CASCADE,
  balance BIGINT DEFAULT 0 CHECK (balance >= 0),
  current_pool BIGINT DEFAULT 0 CHECK (current_pool >= 0),
  last_claim_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Game Sessions Table (for grill game scores and token distribution)
CREATE TABLE IF NOT EXISTS game_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES wallet_auth(id) ON DELETE CASCADE,
  game_type VARCHAR(50) NOT NULL CHECK (game_type IN ('grill', 'joke')),
  score INTEGER NOT NULL CHECK (score >= 0),
  tokens_earned INTEGER NOT NULL CHECK (tokens_earned >= 0),
  wallet_address VARCHAR(100) NOT NULL,
  session_id VARCHAR(100) UNIQUE NOT NULL,
  claimed BOOLEAN DEFAULT false,
  claimed_at TIMESTAMP WITH TIME ZONE,
  transaction_signature VARCHAR(200),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Claim History Table (track all token claims)
CREATE TABLE IF NOT EXISTS claim_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES wallet_auth(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL CHECK (amount > 0),
  transaction_signature VARCHAR(200),
  wallet_address VARCHAR(100) NOT NULL,
  source VARCHAR(50) DEFAULT 'game' CHECK (source IN ('game', 'joke', 'bonus', 'airdrop')),
  claimed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Create Indexes for Performance (only if they don't exist)
CREATE INDEX IF NOT EXISTS idx_game_sessions_user_id ON game_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_game_sessions_session_id ON game_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_game_sessions_wallet ON game_sessions(wallet_address);
CREATE INDEX IF NOT EXISTS idx_game_sessions_claimed ON game_sessions(claimed);
CREATE INDEX IF NOT EXISTS idx_game_sessions_created_at ON game_sessions(created_at);

CREATE INDEX IF NOT EXISTS idx_claim_history_user_id ON claim_history(user_id);
CREATE INDEX IF NOT EXISTS idx_claim_history_wallet ON claim_history(wallet_address);
CREATE INDEX IF NOT EXISTS idx_claim_history_claimed_at ON claim_history(claimed_at);

CREATE INDEX IF NOT EXISTS idx_wallet_auth_wallet_address ON wallet_auth(wallet_address);
CREATE INDEX IF NOT EXISTS idx_wallet_auth_created_at ON wallet_auth(created_at);

CREATE INDEX IF NOT EXISTS idx_user_wallets_updated_at ON user_wallets(updated_at);
CREATE INDEX IF NOT EXISTS idx_user_wallets_wallet_address ON user_wallets(wallet_address);

-- 7. Enable Row Level Security (safe to run multiple times)
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE claim_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_auth ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE global_pool ENABLE ROW LEVEL SECURITY;

-- 8. Create RLS Policies (drop and recreate for consistency)
DROP POLICY IF EXISTS "Allow all operations on game_sessions" ON game_sessions;
DROP POLICY IF EXISTS "Allow all operations on claim_history" ON claim_history;
DROP POLICY IF EXISTS "Allow all operations on wallet_auth" ON wallet_auth;
DROP POLICY IF EXISTS "Allow all operations on user_wallets" ON user_wallets;
DROP POLICY IF EXISTS "Allow all operations on global_pool" ON global_pool;

CREATE POLICY "Allow all operations on game_sessions" ON game_sessions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on claim_history" ON claim_history FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on wallet_auth" ON wallet_auth FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on user_wallets" ON user_wallets FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on global_pool" ON global_pool FOR ALL USING (true) WITH CHECK (true);

-- 9. Password Hashing Function (safe to recreate)
CREATE OR REPLACE FUNCTION hash_password(plain_password TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN encode(digest(plain_password || 'dadcoin_salt', 'sha256'), 'hex');
END;
$$;

-- 10. Wallet Registration Function (safe to recreate)
CREATE OR REPLACE FUNCTION register_wallet(
    wallet_addr VARCHAR(100),
    plain_password TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    hashed_password TEXT;
    new_auth_id UUID;
BEGIN
    -- Check if wallet already exists
    IF EXISTS (SELECT 1 FROM wallet_auth WHERE wallet_address = wallet_addr) THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Wallet address already registered'
        );
    END IF;
    
    -- Hash password
    hashed_password := hash_password(plain_password);
    
    -- Insert new wallet auth
    INSERT INTO wallet_auth (wallet_address, password_hash)
    VALUES (wallet_addr, hashed_password)
    RETURNING id INTO new_auth_id;
    
    -- Create corresponding user_wallet record
    INSERT INTO user_wallets (user_id, wallet_address, wallet_auth_id, balance, current_pool)
    VALUES (new_auth_id, wallet_addr, new_auth_id, 0, 0);
    
    RETURN json_build_object(
        'success', true,
        'user_id', new_auth_id,
        'wallet_address', wallet_addr,
        'message', 'Wallet registered successfully'
    );
END;
$$;

-- 11. Wallet Authentication Function (safe to recreate)
CREATE OR REPLACE FUNCTION authenticate_wallet(
    wallet_addr VARCHAR(100),
    plain_password TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    auth_record wallet_auth%ROWTYPE;
    hashed_password TEXT;
BEGIN
    -- Hash the provided password
    hashed_password := hash_password(plain_password);
    
    -- Find wallet auth record
    SELECT * INTO auth_record
    FROM wallet_auth
    WHERE wallet_address = wallet_addr AND password_hash = hashed_password;
    
    IF auth_record.id IS NULL THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Invalid wallet address or password'
        );
    END IF;
    
    -- Update last login
    UPDATE wallet_auth 
    SET last_login = NOW()
    WHERE id = auth_record.id;
    
    -- Return success with user info
    RETURN json_build_object(
        'success', true,
        'user_id', auth_record.id,
        'wallet_address', auth_record.wallet_address,
        'created_at', auth_record.created_at
    );
END;
$$;

-- 12. Timestamp Update Function (safe to recreate)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 13. Create Triggers (safe to recreate)
DROP TRIGGER IF EXISTS update_wallet_auth_updated_at ON wallet_auth;
CREATE TRIGGER update_wallet_auth_updated_at
    BEFORE UPDATE ON wallet_auth
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_wallets_updated_at ON user_wallets;
CREATE TRIGGER update_user_wallets_updated_at
    BEFORE UPDATE ON user_wallets
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_global_pool_updated_at ON global_pool;
CREATE TRIGGER update_global_pool_updated_at
    BEFORE UPDATE ON global_pool
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 14. Grant Permissions (safe to run multiple times)
GRANT EXECUTE ON FUNCTION hash_password(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION hash_password(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION authenticate_wallet(VARCHAR, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION authenticate_wallet(VARCHAR, TEXT) TO anon;
GRANT EXECUTE ON FUNCTION register_wallet(VARCHAR, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION register_wallet(VARCHAR, TEXT) TO anon;

GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;

-- 15. Enable Realtime (safe to run multiple times)
DO $$
BEGIN
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE global_pool;
    EXCEPTION WHEN OTHERS THEN
        NULL;
    END;
    
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE game_sessions;
    EXCEPTION WHEN OTHERS THEN
        NULL;
    END;
    
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE user_wallets;
    EXCEPTION WHEN OTHERS THEN
        NULL;
    END;
    
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE wallet_auth;
    EXCEPTION WHEN OTHERS THEN
        NULL;
    END;
END $$;

-- ================================
-- PRODUCTION SETUP COMPLETE! 
-- Safe to run multiple times - preserves existing data
-- ================================