import { Handler } from '@netlify/functions';
import { Connection, Keypair, Transaction, PublicKey } from '@solana/web3.js';
import { 
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID
} from '@solana/spl-token';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY! // Use service key for admin access
);

// Validate environment variables
const validateConfig = () => {
  const required = [
    'DISTRIBUTION_WALLET_PRIVATE_KEY',
    'DADCOIN_MINT_ADDRESS',
    'SOLANA_RPC_URL',
    'SUPABASE_URL',
    'SUPABASE_SERVICE_KEY'
  ];
  
  for (const key of required) {
    if (!process.env[key]) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
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
    validateConfig();

    // Parse request body
    const { sessionId, walletAddress, signature } = JSON.parse(event.body || '{}');
    
    if (!sessionId || !walletAddress) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required parameters' })
      };
    }

    // Verify the game session exists and hasn't been claimed
    const { data: session, error: sessionError } = await supabase
      .from('game_sessions')
      .select('*')
      .eq('session_id', sessionId)
      .eq('wallet_address', walletAddress)
      .eq('claimed', false)
      .single();

    if (sessionError || !session) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid or already claimed session' })
      };
    }

    // Setup Solana connection
    const connection = new Connection(process.env.SOLANA_RPC_URL!, 'confirmed');
    
    // Load distribution wallet
    const distributionWallet = Keypair.fromSecretKey(
      Uint8Array.from(JSON.parse(process.env.DISTRIBUTION_WALLET_PRIVATE_KEY!))
    );
    
    // Get public keys
    const mintPubkey = new PublicKey(process.env.DADCOIN_MINT_ADDRESS!);
    const userPubkey = new PublicKey(walletAddress);
    
    // Get token accounts
    const distributionTokenAccount = await getAssociatedTokenAddress(
      mintPubkey,
      distributionWallet.publicKey,
      false,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    );

    const userTokenAccount = await getAssociatedTokenAddress(
      mintPubkey,
      userPubkey,
      false,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    );

    // Check if user token account exists
    const userAccountInfo = await connection.getAccountInfo(userTokenAccount);
    
    // Create transaction
    const transaction = new Transaction();
    
    // Add create account instruction if needed
    if (!userAccountInfo) {
      transaction.add(
        createAssociatedTokenAccountInstruction(
          distributionWallet.publicKey, // payer
          userTokenAccount, // account to create
          userPubkey, // owner
          mintPubkey, // mint
          TOKEN_PROGRAM_ID,
          ASSOCIATED_TOKEN_PROGRAM_ID
        )
      );
    }

    // Add transfer instruction (multiply by 10^6 for pump.fun token decimals)
    const transferAmount = session.tokens_earned * Math.pow(10, 6); // pump.fun uses 6 decimals
    transaction.add(
      createTransferInstruction(
        distributionTokenAccount,
        userTokenAccount,
        distributionWallet.publicKey,
        transferAmount,
        [],
        TOKEN_PROGRAM_ID
      )
    );

    // Get recent blockhash
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = distributionWallet.publicKey;

    // Sign and send transaction
    transaction.sign(distributionWallet);
    const signature = await connection.sendRawTransaction(
      transaction.serialize(),
      { skipPreflight: false, preflightCommitment: 'confirmed' }
    );

    // Wait for confirmation
    await connection.confirmTransaction(signature, 'confirmed');

    // Mark session as claimed
    const { error: updateError } = await supabase
      .from('game_sessions')
      .update({ 
        claimed: true, 
        claimed_at: new Date().toISOString(),
        transaction_signature: signature 
      })
      .eq('session_id', sessionId);

    if (updateError) {
      console.error('Failed to update session:', updateError);
      // Continue anyway - tokens were sent
    }

    // Record in claim history
    await supabase
      .from('claim_history')
      .insert({
        user_id: session.user_id,
        amount: session.tokens_earned,
        transaction_signature: signature,
        wallet_address: walletAddress
      });

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        signature,
        amount: session.tokens_earned
      })
    };

  } catch (error) {
    console.error('Token claim error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to process token claim',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    };
  }
};