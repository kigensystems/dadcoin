import React, { useState } from 'react';

interface FlyProps {
  id: string;
  x: number;
  y: number;
  onSwat: (id: string) => void;
}

const Fly: React.FC<FlyProps> = ({ id, x, y, onSwat }) => {
  const [isSwatted, setIsSwatted] = useState(false);

  const handleSwat = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsSwatted(true);
    onSwat(id);
  };

  if (isSwatted) {
    return (
      <div
        className="absolute pointer-events-none transform -translate-x-1/2 -translate-y-1/2 animate-ping"
        style={{ left: `${x}%`, top: `${y}%` }}
      >
        <div className="text-xl">💥</div>
      </div>
    );
  }

  return (
    <div
      className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 hover:scale-125 z-10"
      style={{ 
        left: `${x}%`, 
        top: `${y}%`,
        filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.3))'
      }}
      onClick={handleSwat}
      title="Swat this fly!"
    >
      {/* Fly body with wings */}
      <div className="relative">
        {/* Wings */}
        <div className="absolute -top-1 -left-1 w-6 h-4 opacity-60">
          <div className="absolute top-0 left-0 w-3 h-2 bg-gray-300 rounded-full animate-ping" style={{ animationDuration: '0.3s' }} />
          <div className="absolute top-0 right-0 w-3 h-2 bg-gray-300 rounded-full animate-ping" style={{ animationDuration: '0.3s', animationDelay: '0.1s' }} />
        </div>
        
        {/* Fly body */}
        <div className="relative w-4 h-4 bg-black rounded-full border border-gray-600 flex items-center justify-center animate-bounce" style={{ animationDuration: '1s' }}>
          {/* Eyes */}
          <div className="flex gap-0.5">
            <div className="w-1 h-1 bg-red-400 rounded-full" />
            <div className="w-1 h-1 bg-red-400 rounded-full" />
          </div>
        </div>
        
        {/* Flight path indicator */}
        <div className="absolute -inset-2 border border-dashed border-gray-400 rounded-full opacity-30 animate-spin" style={{ animationDuration: '3s' }} />
      </div>
    </div>
  );
};

export default Fly;