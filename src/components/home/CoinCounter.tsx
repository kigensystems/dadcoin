import React, { useState, useEffect } from 'react';
import { Coins } from 'lucide-react';

interface CoinCounterProps {
  value: number;
}

const CoinCounter: React.FC<CoinCounterProps> = ({ value }) => {
  const [displayValue, setDisplayValue] = useState(value);
  const [isIncreasing, setIsIncreasing] = useState(true);
  
  useEffect(() => {
    // Animate the counter
    const duration = 1000; // ms
    const steps = 20;
    const stepTime = duration / steps;
    const increment = (value - displayValue) / steps;
    
    setIsIncreasing(value > displayValue);
    
    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      if (currentStep >= steps) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(prev => prev + increment);
      }
    }, stepTime);
    
    return () => clearInterval(timer);
  }, [value, displayValue]);

  return (
    <div className="flex items-center justify-center">
      <div className="relative">
        <div className="flex items-center">
          <Coins className={`h-10 w-10 mr-2 ${isIncreasing ? 'text-green-600' : 'text-red-600'}`} />
          <span className="text-4xl font-bold">
            {displayValue.toFixed(2)}
          </span>
          <span className="ml-2 text-lg">$DAD</span>
        </div>
        <div 
          className={`absolute -top-6 right-0 font-medium ${
            isIncreasing ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {isIncreasing ? '↑' : '↓'} {Math.abs(value - displayValue).toFixed(2)}
        </div>
      </div>
    </div>
  );
};

export default CoinCounter;