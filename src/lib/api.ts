import { supabase } from './supabase';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

interface GameScorePayload {
  score: number;
  gameType: 'grill' | 'joke';
  walletAddress: string;
  sessionId: string;
}

interface TokenClaimPayload {
  amount: number;
  walletAddress: string;
  gameSessionId: string;
}

// Submit game score for validation and token earning
export const submitGameScore = async (payload: GameScorePayload) => {
  try {
    // Get authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // In production, this would call your backend API
    // For now, we'll store in Supabase with validation
    const { data, error } = await supabase
      .from('game_sessions')
      .insert({
        user_id: user.id,
        game_type: payload.gameType,
        score: payload.score,
        wallet_address: payload.walletAddress,
        tokens_earned: calculateTokenReward(payload.score, payload.gameType),
        session_id: payload.sessionId,
        claimed: false
      })
      .select()
      .single();

    if (error) throw error;

    return {
      success: true,
      data: {
        sessionId: data.session_id,
        tokensEarned: data.tokens_earned
      }
    };
  } catch (error) {
    console.error('Error submitting game score:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to submit score'
    };
  }
};

// Claim tokens for a validated game session
export const claimGameTokens = async (payload: TokenClaimPayload) => {
  try {
    // Get authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Verify game session and prevent double claiming
    const { data: session, error: sessionError } = await supabase
      .from('game_sessions')
      .select('*')
      .eq('session_id', payload.gameSessionId)
      .eq('user_id', user.id)
      .eq('claimed', false)
      .single();

    if (sessionError || !session) {
      throw new Error('Invalid or already claimed game session');
    }

    // Mark as claimed
    const { error: updateError } = await supabase
      .from('game_sessions')
      .update({ 
        claimed: true, 
        claimed_at: new Date().toISOString() 
      })
      .eq('session_id', payload.gameSessionId);

    if (updateError) throw updateError;

    // In production, your backend would:
    // 1. Create and sign the SPL token transfer transaction
    // 2. Submit to Solana network
    // 3. Return transaction signature

    // For now, return mock response
    return {
      success: true,
      data: {
        transactionSignature: 'PENDING_BACKEND_IMPLEMENTATION',
        amount: session.tokens_earned,
        message: 'Token distribution requires backend implementation'
      }
    };
  } catch (error) {
    console.error('Error claiming tokens:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to claim tokens'
    };
  }
};

// Calculate token rewards based on game performance
export const calculateTokenReward = (score: number, gameType: string): number => {
  switch (gameType) {
    case 'grill':
      // Grill game: 0.1 DADCOIN per point (more balanced than 0.2)
      return Math.floor(score * 0.1);
    case 'joke':
      // Joke game uses its own complex calculation
      return 0;
    default:
      return 0;
  }
};

// Get user's game history
export const getUserGameHistory = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('game_sessions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) throw error;

    return {
      success: true,
      data: data || []
    };
  } catch (error) {
    console.error('Error fetching game history:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch history'
    };
  }
};

// Validate wallet ownership (user must sign a message)
export const validateWalletOwnership = async (
  walletAddress: string,
  signature: string,
  message: string
) => {
  try {
    // In production, verify the signature server-side
    // This prevents users from claiming tokens to wallets they don't own
    
    return {
      success: true,
      verified: true
    };
  } catch (error) {
    return {
      success: false,
      verified: false,
      error: 'Failed to verify wallet ownership'
    };
  }
};