import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY! // Use service key for admin access
);

// Calculate token rewards
const calculateTokenReward = (score: number, gameType: string): number => {
  switch (gameType) {
    case 'grill':
      return Math.floor(score * 0.1); // 0.1 DADCOIN per point
    case 'joke':
      return 0; // Joke game handles its own rewards
    default:
      return 0;
  }
};

// Basic anti-cheat validation
const validateGameScore = (score: number, gameType: string): boolean => {
  switch (gameType) {
    case 'grill':
      // Max possible score in 60 seconds (reasonable limit)
      return score >= 0 && score <= 300;
    default:
      return false;
  }
};

export const handler: Handler = async (event) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse request body
    const { score, gameType, walletAddress, sessionId } = JSON.parse(event.body || '{}');
    
    // Validate required fields
    if (!score || !gameType || !walletAddress || !sessionId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required parameters' })
      };
    }

    // Get auth token from header
    const authHeader = event.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Missing authorization token' })
      };
    }

    const token = authHeader.substring(7);
    
    // Verify user with Supabase
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Invalid authorization token' })
      };
    }

    // Validate game score
    if (!validateGameScore(score, gameType)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid game score' })
      };
    }

    // Check for duplicate session
    const { data: existingSession } = await supabase
      .from('game_sessions')
      .select('id')
      .eq('session_id', sessionId)
      .single();

    if (existingSession) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Session already submitted' })
      };
    }

    // Calculate tokens earned
    const tokensEarned = calculateTokenReward(score, gameType);

    // Create game session record
    const { data: session, error: insertError } = await supabase
      .from('game_sessions')
      .insert({
        user_id: user.id,
        game_type: gameType,
        score: score,
        wallet_address: walletAddress,
        tokens_earned: tokensEarned,
        session_id: sessionId,
        claimed: false
      })
      .select()
      .single();

    if (insertError) {
      console.error('Failed to create session:', insertError);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to save game session' })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        data: {
          sessionId: session.session_id,
          tokensEarned: session.tokens_earned
        }
      })
    };

  } catch (error) {
    console.error('Score submission error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to process score submission',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    };
  }
};