import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Coins, Trophy, Wallet, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { connectWallet, signMessage } from '../lib/phantom';
import { submitGameScore, claimGameTokens } from '../lib/api';
import confetti from 'canvas-confetti';
import GrillGame from '../components/GrillGame';

interface GameResult {
  score: number;
  tokensEarned: number;
  sessionId?: string;
}

const GamePage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [wallet, setWallet] = useState<{publicKey: string; displayAddress: string} | null>(null);
  const [gameResult, setGameResult] = useState<GameResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showGame, setShowGame] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleWalletConnect = async () => {
    const walletData = await connectWallet();
    if (walletData) {
      setWallet(walletData);
    }
  };

  const handleGameOver = async (finalScore: number) => {
    if (!wallet) return;
    
    setIsLoading(true);
    try {
      // Generate session ID
      const sessionId = `game_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Submit score to backend for validation
      const scoreResult = await submitGameScore({
        score: finalScore,
        gameType: 'grill',
        walletAddress: wallet.publicKey,
        sessionId
      });
      
      if (scoreResult.success && scoreResult.data) {
        const result: GameResult = {
          score: finalScore,
          tokensEarned: scoreResult.data.tokensEarned,
          sessionId: scoreResult.data.sessionId
        };
        
        setGameResult(result);
        setShowGame(false);
        
        if (result.tokensEarned > 0) {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        }
      } else {
        alert('Error submitting score. Please try again.');
        setShowGame(false);
      }
    } catch (error) {
      console.error('Error handling game over:', error);
      alert('Error processing game results.');
      setShowGame(false);
    } finally {
      setIsLoading(false);
    }
  };

  const claimTokens = async () => {
    if (!gameResult || !wallet || !gameResult.sessionId) return;
    
    setIsLoading(true);
    try {
      // Sign a message to verify wallet ownership
      const message = `Claim ${gameResult.tokensEarned} DADCOIN for game session ${gameResult.sessionId}`;
      const signature = await signMessage(message, wallet.publicKey);
      
      if (!signature) {
        alert('Please approve the signature request in your wallet to claim tokens.');
        setIsLoading(false);
        return;
      }
      
      // Claim tokens through API
      const claimResult = await claimGameTokens({
        amount: gameResult.tokensEarned,
        walletAddress: wallet.publicKey,
        gameSessionId: gameResult.sessionId
      });
      
      if (claimResult.success) {
        alert(`${gameResult.tokensEarned} DADCOIN tokens claimed successfully!\n\nNote: Actual token distribution requires backend implementation.`);
        setGameResult(null);
      } else {
        alert(`Error claiming tokens: ${claimResult.error}`);
      }
    } catch (error) {
      console.error('Error claiming tokens:', error);
      alert('Error claiming tokens. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!wallet) {
    return (
      <div className="min-h-screen bg-dadcoin-yellow flex flex-col items-center justify-center px-4">
        <div className="card max-w-md text-center">
          <Wallet className="h-16 w-16 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-4">Grill Master Challenge</h1>
          <p className="text-lg mb-6">
            Connect your wallet to start earning Dadcoin by mastering the grill!
          </p>
          <button
            onClick={handleWalletConnect}
            className="btn btn-primary w-full"
          >
            Connect Phantom Wallet
          </button>
          <button
            onClick={() => navigate('/')}
            className="btn btn-outline w-full mt-4"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // Show the game if user wants to play
  if (showGame) {
    return <GrillGame onGameOver={handleGameOver} />;
  }

  return (
    <div className="min-h-screen bg-dadcoin-yellow px-4 py-8">
      <div className="container max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Grill Master Challenge</h1>
          <p className="text-lg">Master the grill to earn Dadcoin!</p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <Wallet className="h-5 w-5" />
            <span className="font-medium">{wallet.displayAddress}</span>
          </div>
        </div>

        {/* Game Results */}
        {gameResult && (
          <div className="card text-center max-w-2xl mx-auto mb-8">
            <Trophy className="h-16 w-16 mx-auto mb-4 text-yellow-600" />
            <h2 className="text-3xl font-bold mb-6">Grilling Session Complete!</h2>
            
            <div className="bg-blue-100 p-4 rounded-lg mb-6">
              <div className="text-2xl font-bold">{gameResult.score}</div>
              <div className="text-sm">Final Score</div>
            </div>

            <div className="bg-dadcoin-yellow border-2 border-black rounded-lg p-6 mb-6">
              <h3 className="text-xl font-bold mb-2">Tokens Earned</h3>
              <div className="flex items-center justify-center gap-2">
                <Coins className="h-8 w-8" />
                <span className="text-3xl font-bold">{gameResult.tokensEarned}</span>
                <span className="text-lg">DADCOIN</span>
              </div>
            </div>
            
            <div className="bg-blue-50 border-2 border-blue-400 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold text-blue-900 mb-1">Token Distribution Setup Required</p>
                  <p className="text-blue-800">
                    To enable actual token transfers, update the token configuration in 
                    <code className="bg-blue-100 px-1 mx-1 rounded">src/lib/tokenConfig.ts</code>
                    with your DADCOIN mint address and distribution wallet.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 justify-center mb-6">
              <button
                onClick={claimTokens}
                disabled={isLoading}
                className="btn btn-primary px-8 py-3"
              >
                {isLoading ? 'Claiming...' : 'Claim Tokens to Wallet'}
              </button>
              <button
                onClick={() => setShowGame(true)}
                className="btn btn-outline px-8 py-3"
              >
                Grill Again
              </button>
            </div>
          </div>
        )}

        {/* Start Game */}
        {!gameResult && (
          <div className="card text-center max-w-2xl mx-auto">
            <div className="text-6xl mb-4">🔥</div>
            <h2 className="text-2xl font-bold mb-4">Ready to Fire Up the Grill?</h2>
            <p className="text-lg mb-6">
              Show off your grilling skills! Click food at the perfect moment and swat away pesky flies.
            </p>
            <button
              onClick={() => setShowGame(true)}
              className="btn btn-primary text-xl px-8 py-4"
            >
              Start Grilling!
            </button>
          </div>
        )}

        <div className="text-center mt-8">
          <button
            onClick={() => navigate('/')}
            className="btn btn-outline"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default GamePage;