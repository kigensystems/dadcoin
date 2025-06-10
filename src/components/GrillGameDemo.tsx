import React, { useState } from 'react';
import GrillGame from './GrillGame';
import { Trophy } from 'lucide-react';

const GrillGameDemo: React.FC = () => {
  const [highScore, setHighScore] = useState(0);
  const [lastScore, setLastScore] = useState<number | null>(null);
  const [showGame, setShowGame] = useState(false);

  const handleGameOver = (score: number) => {
    setLastScore(score);
    if (score > highScore) {
      setHighScore(score);
    }
  };

  if (showGame) {
    return <GrillGame onGameOver={handleGameOver} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-100 to-orange-100 flex items-center justify-center p-4">
      <div className="card max-w-lg mx-auto text-center">
        <Trophy className="h-16 w-16 mx-auto mb-4 text-orange-600" />
        <h1 className="text-3xl font-bold mb-4">BBQ Grill Master</h1>
        
        {lastScore !== null && (
          <div className="mb-6 p-4 bg-orange-100 rounded-lg">
            <p className="text-lg">Last Score: <span className="font-bold">{lastScore}</span></p>
            {lastScore === highScore && (
              <p className="text-sm text-green-600 mt-1">New High Score!</p>
            )}
          </div>
        )}
        
        <div className="mb-6">
          <p className="text-sm text-gray-600">High Score</p>
          <p className="text-4xl font-bold text-orange-600">{highScore}</p>
        </div>
        
        <button
          onClick={() => setShowGame(true)}
          className="btn btn-primary text-xl px-8 py-4"
        >
          Start Grilling!
        </button>
        
        <div className="mt-6 text-left space-y-2 text-sm text-gray-600">
          <h3 className="font-bold text-black">How to Play:</h3>
          <ul className="space-y-1">
            <li>• Click food when it's perfectly cooked (golden color)</li>
            <li>• Swat flies before they land on your food</li>
            <li>• Perfect timing = 15 points</li>
            <li>• Good timing = 5 points</li>
            <li>• Fly swat = 10 points</li>
            <li>• Burnt food = 0 points</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GrillGameDemo;