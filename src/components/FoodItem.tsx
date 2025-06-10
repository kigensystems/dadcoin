import React, { useEffect, useState } from 'react';

interface FoodItemProps {
  id: string;
  type: 'burger' | 'hotdog' | 'corn';
  spawnTime: number;
  cookDuration: number;
  onFlip: (id: string) => void;
}

const FoodItem: React.FC<FoodItemProps> = ({ id, type, spawnTime, cookDuration, onFlip }) => {
  const [elapsed, setElapsed] = useState(0);
  const [status, setStatus] = useState<'raw' | 'perfect' | 'burnt'>('raw');

  useEffect(() => {
    const updateElapsed = () => {
      const now = Date.now();
      const newElapsed = now - spawnTime;
      setElapsed(newElapsed);

      // Calculate status based on cook duration
      const perfectStart = cookDuration * 0.75;
      const perfectEnd = cookDuration * 0.95;
      
      if (newElapsed < perfectStart) {
        setStatus('raw');
      } else if (newElapsed >= perfectStart && newElapsed <= perfectEnd) {
        setStatus('perfect');
      } else {
        setStatus('burnt');
      }
    };

    const interval = setInterval(updateElapsed, 100);
    return () => clearInterval(interval);
  }, [spawnTime, cookDuration]);

  const getTimeRemaining = () => {
    const perfectStart = cookDuration * 0.75;
    const timeUntilPerfect = Math.max(0, perfectStart - elapsed);
    return Math.ceil(timeUntilPerfect / 1000);
  };

  const getFoodEmoji = () => {
    switch (type) {
      case 'burger': return '🍔';
      case 'hotdog': return '🌭';
      case 'corn': return '🌽';
    }
  };

  const progress = Math.min((elapsed / cookDuration) * 100, 100);

  return (
    <div
      className="relative cursor-pointer transform transition-all duration-200 hover:scale-110"
      onClick={() => onFlip(id)}
      title={`${type} - ${status}`}
    >
      {/* Enhanced duration indicator above food */}
      {status === 'raw' && (
        <div className="absolute -top-14 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-amber-600 to-orange-600 text-white px-3 py-2 rounded-full text-sm font-bold border-2 border-white shadow-lg animate-pulse">
          ⏱️ {getTimeRemaining()}s
        </div>
      )}
      
      {/* Enhanced cooking progress bar */}
      <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
        <div className="w-24 h-3 bg-gray-800 rounded-full overflow-hidden border-2 border-white shadow-lg">
          <div 
            className={`h-full transition-all duration-200 ${
              status === 'perfect' ? 'bg-gradient-to-r from-green-400 to-green-600' : 
              status === 'burnt' ? 'bg-gradient-to-r from-red-500 to-red-700' : 'bg-gradient-to-r from-blue-400 to-blue-600'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-center mt-1">
          <span className="text-xs font-bold text-white bg-black/70 px-2 py-1 rounded-full">
            {Math.round(progress)}%
          </span>
        </div>
      </div>
      
      {/* High quality emoji food */}
      <div className="relative">
        <div 
          className={`text-6xl transition-all duration-300 filter drop-shadow-xl ${
            status === 'perfect' ? 'brightness-110 saturate-150 scale-110' : 
            status === 'burnt' ? 'brightness-75 saturate-75 hue-rotate-15 scale-95' : ''
          }`}
          style={{ 
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
            lineHeight: '1'
          }}
        >
          {getFoodEmoji()}
        </div>
        
        {/* Grill marks overlay for cooked food */}
        {status !== 'raw' && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute w-12 h-1 bg-black/60 left-1/2 top-1/3 transform -translate-x-1/2 rotate-45" />
            <div className="absolute w-12 h-1 bg-black/60 left-1/2 top-2/3 transform -translate-x-1/2 -rotate-45" />
          </div>
        )}
        
        {/* Steam effect for perfect food */}
        {status === 'perfect' && (
          <>
            <div className="absolute -top-2 left-1/4 w-1 h-4 bg-white/70 rounded-full animate-pulse opacity-90" />
            <div className="absolute -top-3 left-1/2 w-1 h-5 bg-white/70 rounded-full animate-pulse opacity-70" style={{ animationDelay: '0.3s' }} />
            <div className="absolute -top-2 right-1/4 w-1 h-4 bg-white/70 rounded-full animate-pulse opacity-90" style={{ animationDelay: '0.6s' }} />
          </>
        )}
      </div>
      
      {/* Status indicators */}
      {status === 'perfect' && (
        <div className="absolute -top-3 -right-3 w-6 h-6 bg-green-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
          <span className="text-white text-sm font-bold">✓</span>
        </div>
      )}
      
      {status === 'burnt' && (
        <div className="absolute -top-3 -right-3 w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
          <span className="text-white text-xs">🔥</span>
        </div>
      )}
    </div>
  );
};

export default FoodItem;