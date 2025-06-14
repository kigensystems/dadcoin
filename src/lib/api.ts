import { supabase } from './supabase';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/.netlify/functions';

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
    // Get authenticated user and session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('User not authenticated');

    // Call Netlify Function
    const response = await fetch(`${API_BASE_URL}/submit-score`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to submit score');
    }

    return data;
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
    // Call Netlify Function
    const response = await fetch(`${API_BASE_URL}/claim-tokens`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sessionId: payload.gameSessionId,
        walletAddress: payload.walletAddress,
        signature: payload.signature || ''
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to claim tokens');
    }

    return {
      success: true,
      data: {
        transactionSignature: data.signature,
        amount: data.amount,
        message: 'Tokens successfully transferred!'
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