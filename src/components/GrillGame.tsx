import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Timer, Coins, Target, Flame, Volume2, VolumeX } from 'lucide-react';
import FoodItem from './FoodItem';
import { useSound } from '../hooks/useSound';

interface Food {
  id: string;
  type: 'burger' | 'hotdog' | 'corn';
  spawnTime: number;
  cookDuration: number;
  position: { x: number; y: number };
}

interface PointFeedback {
  id: string;
  x: number;
  y: number;
  value: number;
  timestamp: number;
}


interface ScoreBoardProps {
  score: number;
  timeLeft: number;
  gameState: 'menu' | 'playing' | 'finished' | 'countdown';
  soundEnabled: boolean;
  onToggleSound: () => void;
  countdown?: number;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({ score, timeLeft, gameState, soundEnabled, onToggleSound, countdown }) => {
  return (
    <div className="absolute top-28 left-1/2 transform -translate-x-1/2 z-20">
      <div className="flex items-center gap-6">
        <div className="bg-black border-4 border-dadcoin-yellow text-dadcoin-yellow px-6 py-4 rounded-xl shadow-2xl">
          <div className="flex items-center gap-3">
            <Timer className="h-8 w-8" />
            <span className="font-bold text-3xl">{timeLeft}s</span>
          </div>
        </div>
        
        <div className="bg-black border-4 border-dadcoin-yellow text-dadcoin-yellow px-6 py-4 rounded-xl shadow-2xl">
          <div className="flex items-center gap-3">
            <Target className="h-8 w-8" />
            <span className="font-bold text-3xl">{score}</span>
          </div>
        </div>

        <button
          onClick={onToggleSound}
          className="bg-black border-4 border-dadcoin-yellow text-dadcoin-yellow p-4 rounded-xl hover:bg-dadcoin-yellow hover:text-black transition-all shadow-2xl"
        >
          {soundEnabled ? <Volume2 className="h-8 w-8" /> : <VolumeX className="h-8 w-8" />}
        </button>
      </div>
      
      
    </div>
  );
};

interface GrillGameProps {
  onGameOver: (score: number) => void;
}

interface LeaderboardEntry {
  name: string;
  score: number;
  date: string;
}

const GrillGame: React.FC<GrillGameProps> = ({ onGameOver }) => {
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'finished' | 'countdown'>('menu');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [countdown, setCountdown] = useState(3);
  const [foodList, setFoodList] = useState<Food[]>([]);
  const [pointFeedback, setPointFeedback] = useState<PointFeedback[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  
  const gameStartTimeRef = useRef<number>(0);
  const timerRef = useRef<NodeJS.Timeout>();
  const countdownRef = useRef<NodeJS.Timeout>();

  // Sound effects
  const sizzleSound = useSound('/sounds/sizzle.mp3', { volume: 0.3, loop: true });
  const flipSound = useSound('/sounds/flip.mp3', { volume: 0.5 });
  const successSound = useSound('/sounds/success.mp3', { volume: 0.6 });
  const burnSound = useSound('/sounds/burn.mp3', { volume: 0.4 });

  // BBQ Grill positions on the grates - positioned directly under the fire
  const FOOD_TYPES = ['burger', 'hotdog', 'corn'] as const;
  const GRILL_POSITIONS = [
    // Only on the central grill grates where the fire is visible
    { x: 48, y: 42 }, { x: 52, y: 42 },
    { x: 46, y: 45 }, { x: 50, y: 45 }, { x: 54, y: 45 },
    { x: 48, y: 48 }, { x: 52, y: 48 }
  ];

  const randomType = (): 'burger' | 'hotdog' | 'corn' => {
    return FOOD_TYPES[Math.floor(Math.random() * FOOD_TYPES.length)];
  };

  const addFood = (food: Omit<Food, 'id' | 'spawnTime' | 'position'>) => {
    const availablePositions = GRILL_POSITIONS.filter(pos => 
      !foodList.some(f => 
        Math.abs(f.position.x - pos.x) < 12 && Math.abs(f.position.y - pos.y) < 12
      )
    );
    
    if (availablePositions.length === 0) return;
    
    const position = availablePositions[Math.floor(Math.random() * availablePositions.length)];
    
    const newFood: Food = {
      id: `food-${Date.now()}-${Math.random()}`,
      type: food.type,
      spawnTime: Date.now(),
      cookDuration: food.cookDuration,
      position
    };
    
    setFoodList(prev => [...prev, newFood]);
    
    // Play sizzle sound when food is added
    if (soundEnabled) {
      sizzleSound.play();
    }
  };

  const addPointFeedback = (x: number, y: number, value: number) => {
    const feedback: PointFeedback = {
      id: `feedback-${Date.now()}`,
      x,
      y,
      value,
      timestamp: Date.now()
    };
    setPointFeedback(prev => [...prev, feedback]);
    
    // Remove after animation
    setTimeout(() => {
      setPointFeedback(prev => prev.filter(f => f.id !== feedback.id));
    }, 2000);
  };


  // Food spawning effect
  useEffect(() => {
    if (gameState !== 'playing') return;

    const interval = setInterval(() => {
      if (foodList.length < 3) { // Max 3 items on grill at once
        addFood({ 
          type: randomType(), 
          cookDuration: 3000 + Math.random() * 1500 // 3-4.5 seconds cook time
        });
      }
    }, 1200); // Spawn every 1.2 seconds (much faster!)
    
    return () => clearInterval(interval);
  }, [gameState, foodList, soundEnabled]);


  // Timer effect
  useEffect(() => {
    if (gameState !== 'playing') return;

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameState('finished');
          handleGameEnd();
          if (soundEnabled) {
            sizzleSound.stop();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, score, onGameOver, soundEnabled]);


  const handleFlip = (id: string) => {
    const food = foodList.find(f => f.id === id);
    if (!food) return;

    const elapsed = Date.now() - food.spawnTime;
    const perfectStart = food.cookDuration * 0.75;
    const perfectEnd = food.cookDuration * 0.95;
    
    let points = 0;
    let soundToPlay = flipSound;
    
    if (elapsed >= perfectStart - 300 && elapsed <= perfectEnd + 300) {
      // Perfect timing! (narrower window)
      points = 15;
      soundToPlay = successSound;
    } else if (elapsed < perfectStart) {
      // Too early
      points = 3;
    } else {
      // Burnt
      points = 0;
      soundToPlay = burnSound;
    }
    
    setScore(prev => prev + points);
    setFoodList(prev => prev.filter(f => f.id !== id));
    
    // Show point feedback
    addPointFeedback(food.position.x, food.position.y, points);
    
    // Play sound
    if (soundEnabled) {
      soundToPlay.play();
    }
  };


  const startCountdown = () => {
    setGameState('countdown');
    setCountdown(3);
    setScore(0);
    setTimeLeft(60);
    setFoodList([]);
    setPointFeedback([]);
    
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          startGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const startGame = () => {
    setGameState('playing');
    gameStartTimeRef.current = Date.now();
    
    // Start sizzle sound
    if (soundEnabled) {
      sizzleSound.play();
    }
  };

  const toggleSound = () => {
    setSoundEnabled(prev => {
      const newState = !prev;
      if (!newState) {
        // Turn off all sounds
        sizzleSound.stop();
      } else if (gameState === 'playing') {
        // Turn on sizzle if playing
        sizzleSound.play();
      }
      return newState;
    });
  };

  // Load leaderboard from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('dadcoin-grill-leaderboard');
    if (saved) {
      setLeaderboard(JSON.parse(saved));
    }
  }, []);

  const saveToLeaderboard = (finalScore: number) => {
    const playerName = prompt('Great score! Enter your name for the leaderboard:') || 'Anonymous';
    const newEntry: LeaderboardEntry = {
      name: playerName,
      score: finalScore,
      date: new Date().toLocaleDateString()
    };
    
    const newLeaderboard = [...leaderboard, newEntry]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10); // Keep top 10
    
    setLeaderboard(newLeaderboard);
    localStorage.setItem('dadcoin-grill-leaderboard', JSON.stringify(newLeaderboard));
  };

  const handleGameEnd = () => {
    if (score > 0) {
      saveToLeaderboard(score);
    }
    onGameOver(score);
  };

  return (
    <div className="relative w-full h-screen bg-dadcoin-yellow overflow-hidden pt-20">
      {/* BBQ Grill - Much Larger */}
      <div className="absolute inset-0 top-20 flex items-center justify-center">
        <div className="relative">
          <img 
            src="/images/bbq.svg" 
            alt="BBQ Grill"
            className="w-[900px] h-[700px] object-contain filter drop-shadow-2xl"
          />
          
          {/* Countdown overlay directly on BBQ */}
          {gameState === 'countdown' && countdown && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-black/95 text-dadcoin-yellow px-16 py-12 rounded-2xl border-4 border-dadcoin-yellow text-center shadow-2xl">
                <h3 className="text-3xl font-bold mb-6">GET READY!</h3>
                <div className="text-9xl font-bold animate-pulse">{countdown}</div>
              </div>
            </div>
          )}
          
          {/* Quick instructions overlay on BBQ during gameplay */}
          {gameState === 'playing' && (
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
              <div className="bg-black/95 text-dadcoin-yellow px-6 py-3 rounded-lg border-2 border-dadcoin-yellow shadow-lg">
                <p className="text-lg font-bold">
                  🔥 Click meat at perfect timing for maximum points! 🔥
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Score Board */}
      <ScoreBoard 
        score={score} 
        timeLeft={timeLeft} 
        gameState={gameState}
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
        countdown={countdown}
      />

      {/* Game Menu */}
      {gameState === 'menu' && (
        <div className="absolute inset-0 top-20 flex items-center justify-center bg-black/70 backdrop-blur-md">
          <div className="bg-black/90 border-4 border-dadcoin-yellow rounded-2xl p-12 text-center max-w-2xl mx-4 shadow-2xl">
            <div className="text-8xl mb-6">🔥</div>
            <h2 className="text-6xl font-bold mb-8 text-dadcoin-yellow">GRILL MASTER</h2>
            <div className="space-y-4 mb-10 text-white text-xl">
              <div className="flex items-center justify-center gap-4">
                <span className="text-3xl">🍔</span>
                <p>Click food at perfect timing</p>
              </div>
              <div className="flex items-center justify-center gap-4">
                <span className="text-3xl">⚡</span>
                <p>15 points for perfect, 3 for early</p>
              </div>
              <div className="flex items-center justify-center gap-4">
                <span className="text-3xl">⏱️</span>
                <p>60 seconds to become the master</p>
              </div>
            </div>
            <div className="flex gap-6 justify-center">
              <button
                onClick={startCountdown}
                className="bg-gradient-to-r from-dadcoin-orange to-orange-600 text-white font-bold text-2xl px-16 py-6 rounded-xl hover:from-orange-700 hover:to-orange-700 transition-all duration-300 shadow-xl transform hover:scale-105 border-2 border-white"
              >
                START GRILLING
              </button>
              <button
                onClick={() => setShowLeaderboard(true)}
                className="bg-gradient-to-r from-amber-500 to-yellow-600 text-black font-bold text-2xl px-12 py-6 rounded-xl hover:from-amber-600 hover:to-yellow-700 transition-all duration-300 shadow-xl transform hover:scale-105 border-2 border-black"
              >
                🏆 SCORES
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Game Finished */}
      {gameState === 'finished' && (
        <div className="absolute inset-0 top-20 flex items-center justify-center bg-black/70 backdrop-blur-md">
          <div className="bg-black/90 border-4 border-dadcoin-yellow rounded-2xl p-12 text-center max-w-2xl mx-4 shadow-2xl">
            <div className="text-8xl mb-6">🏆</div>
            <h2 className="text-5xl font-bold mb-6 text-dadcoin-yellow">GRILL SESSION COMPLETE</h2>
            <div className="text-9xl font-bold mb-4 text-white">{score}</div>
            <p className="text-3xl mb-10 text-dadcoin-yellow">FINAL SCORE</p>
            <div className="flex gap-4 justify-center flex-wrap">
              <button
                onClick={startCountdown}
                className="bg-gradient-to-r from-dadcoin-orange to-orange-600 text-white font-bold text-xl px-10 py-4 rounded-xl hover:from-orange-700 hover:to-orange-700 transition-all duration-300 shadow-xl transform hover:scale-105 border-2 border-white"
              >
                🔥 GRILL AGAIN
              </button>
              <button
                onClick={() => setShowLeaderboard(true)}
                className="bg-gradient-to-r from-amber-500 to-yellow-600 text-black font-bold text-xl px-10 py-4 rounded-xl hover:from-amber-600 hover:to-yellow-700 transition-all duration-300 shadow-xl transform hover:scale-105 border-2 border-black"
              >
                🏆 SCORES
              </button>
              <button
                onClick={() => setGameState('menu')}
                className="bg-gradient-to-r from-gray-600 to-gray-700 text-white font-bold text-xl px-10 py-4 rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 shadow-xl transform hover:scale-105 border-2 border-white"
              >
                🏠 MENU
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Food Items on the grill */}
      {gameState === 'playing' && foodList.map(food => (
        <div
          key={food.id}
          className="absolute"
          style={{
            left: `${food.position.x}%`,
            top: `${food.position.y}%`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <FoodItem
            id={food.id}
            type={food.type}
            spawnTime={food.spawnTime}
            cookDuration={food.cookDuration}
            onFlip={handleFlip}
          />
        </div>
      ))}

      {/* Point Feedback */}
      {pointFeedback.map(feedback => (
        <div
          key={feedback.id}
          className="absolute pointer-events-none z-30 animate-bounce"
          style={{
            left: `${feedback.x}%`,
            top: `${feedback.y}%`,
            transform: 'translate(-50%, -50%)',
            animation: 'fadeUpOut 2s ease-out forwards'
          }}
        >
          <div className="bg-yellow-400 text-black font-bold px-3 py-1 rounded-full shadow-lg border-2 border-yellow-600">
            +{feedback.value}
          </div>
        </div>
      ))}

      {/* Leaderboard Modal */}
      {showLeaderboard && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-md z-30">
          <div className="bg-black/90 border-4 border-dadcoin-yellow rounded-2xl p-8 text-center max-w-lg mx-4 shadow-2xl">
            <h2 className="text-4xl font-bold mb-8 text-dadcoin-yellow">🏆 TOP GRILL MASTERS 🏆</h2>
            <div className="space-y-3 mb-8 max-h-96 overflow-y-auto">
              {leaderboard.length > 0 ? (
                leaderboard.map((entry, index) => (
                  <div
                    key={index}
                    className={`flex justify-between items-center p-4 rounded-xl ${
                      index === 0 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black' :
                      index === 1 ? 'bg-gradient-to-r from-gray-300 to-gray-400 text-black' :
                      index === 2 ? 'bg-gradient-to-r from-orange-400 to-orange-600 text-black' :
                      'bg-white/20 text-white border border-white/30'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-2xl">
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`}
                      </span>
                      <span className="font-bold text-lg">{entry.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-xl">{entry.score}</div>
                      <div className="text-sm opacity-70">{entry.date}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-white/70 italic py-12 text-xl">No scores yet. Be the first grill master!</div>
              )}
            </div>
            <button
              onClick={() => setShowLeaderboard(false)}
              className="bg-gradient-to-r from-dadcoin-orange to-orange-600 text-white font-bold text-xl px-12 py-4 rounded-xl hover:from-orange-700 hover:to-orange-700 transition-all duration-300 shadow-xl transform hover:scale-105 border-2 border-white"
            >
              CLOSE
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GrillGame;