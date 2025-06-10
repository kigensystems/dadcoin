import { 
  PublicKey, 
  Connection, 
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL
} from '@solana/web3.js';
import { 
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID
} from '@solana/spl-token';
import { TOKEN_CONFIG, getTokenMintPublicKey, getDistributionWalletPublicKey } from './tokenConfig';

export const getProvider = () => {
  if ('phantom' in window) {
    const provider = (window as any).phantom?.solana;

    if (provider?.isPhantom) {
      return provider;
    }
  }

  window.open('https://phantom.app/', '_blank');
  return null;
};

export const connectWallet = async () => {
  try {
    const provider = getProvider();
    if (!provider) return null;

    const response = await provider.connect();
    const publicKey = response.publicKey.toString();
    
    return {
      publicKey,
      displayAddress: `${publicKey.slice(0, 4)}...${publicKey.slice(-4)}`
    };
  } catch (error) {
    console.error('Error connecting to Phantom wallet:', error);
    return null;
  }
};

export const signMessage = async (message: string, publicKey: string) => {
  try {
    const provider = getProvider();
    if (!provider) return null;

    const encodedMessage = new TextEncoder().encode(message);
    const signedMessage = await provider.signMessage(encodedMessage, 'utf8');

    return {
      signature: signedMessage.signature,
      publicKey: new PublicKey(publicKey)
    };
  } catch (error) {
    console.error('Error signing message:', error);
    return null;
  }
};

// Get or create associated token account for user
export const getOrCreateTokenAccount = async (
  connection: Connection,
  userPublicKey: PublicKey,
  mintPublicKey: PublicKey
) => {
  try {
    const associatedTokenAddress = await getAssociatedTokenAddress(
      mintPublicKey,
      userPublicKey,
      false,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    );

    // Check if account exists
    const accountInfo = await connection.getAccountInfo(associatedTokenAddress);
    
    if (!accountInfo) {
      // Need to create the account
      return {
        address: associatedTokenAddress,
        needsCreation: true
      };
    }

    return {
      address: associatedTokenAddress,
      needsCreation: false
    };
  } catch (error) {
    console.error('Error getting token account:', error);
    throw error;
  }
};

// Transfer DADCOIN tokens to user
export const transferDadcoinToUser = async (
  userPublicKey: string,
  amount: number
): Promise<{ success: boolean; signature?: string; error?: string }> => {
  try {
    const provider = getProvider();
    if (!provider) {
      return { success: false, error: 'Phantom wallet not found' };
    }

    const connection = new Connection(TOKEN_CONFIG.RPC_ENDPOINT, 'confirmed');
    
    // Get public keys
    const userPubkey = new PublicKey(userPublicKey);
    const mintPubkey = getTokenMintPublicKey();
    const distributionPubkey = getDistributionWalletPublicKey();
    
    if (!mintPubkey || !distributionPubkey) {
      return { success: false, error: 'Invalid token configuration' };
    }

    // Get token accounts
    const distributionTokenAccount = await getAssociatedTokenAddress(
      mintPubkey,
      distributionPubkey,
      false,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    );

    const userTokenAccountInfo = await getOrCreateTokenAccount(
      connection,
      userPubkey,
      mintPubkey
    );

    // Create transaction
    const transaction = new Transaction();

    // Add create account instruction if needed
    if (userTokenAccountInfo.needsCreation) {
      transaction.add(
        createAssociatedTokenAccountInstruction(
          distributionPubkey, // payer
          userTokenAccountInfo.address, // associated token account
          userPubkey, // owner
          mintPubkey, // mint
          TOKEN_PROGRAM_ID,
          ASSOCIATED_TOKEN_PROGRAM_ID
        )
      );
    }

    // Add transfer instruction
    const transferAmount = Math.floor(amount * Math.pow(10, TOKEN_CONFIG.DECIMALS));
    transaction.add(
      createTransferInstruction(
        distributionTokenAccount, // from
        userTokenAccountInfo.address, // to
        distributionPubkey, // authority
        transferAmount,
        [],
        TOKEN_PROGRAM_ID
      )
    );

    // Get recent blockhash
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = distributionPubkey;

    // Note: In production, this transaction should be sent to your backend
    // The backend would sign it with the distribution wallet's private key
    // and submit it to the network. For now, we'll return the transaction
    // data that needs to be processed server-side.

    return {
      success: false,
      error: 'Server-side transaction signing not yet implemented. Transaction prepared but needs backend processing.'
    };

    // In a complete implementation, your backend would:
    // 1. Receive the transaction details
    // 2. Validate the game score and user eligibility
    // 3. Sign the transaction with distribution wallet
    // 4. Submit to Solana network
    // 5. Return the signature to the frontend

  } catch (error) {
    console.error('Error transferring tokens:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
};