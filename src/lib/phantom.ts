import { PublicKey } from '@solana/web3.js';

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