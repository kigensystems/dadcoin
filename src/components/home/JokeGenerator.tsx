import React, { useState, useEffect, useRef } from 'react';
import { RefreshCw, Coins, Trophy, PartyPopper } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import confetti from 'canvas-confetti';

// Define all joke constants
const jokes = [
  "Why don't scientists trust atoms? Because they make up everything!",
  "What do you call a bear with no teeth? A gummy bear!",
  "Why did the scarecrow win an award? Because he was outstanding in his field!",
  "What do you call a fake noodle? An impasta!",
  "Why did the cookie go to the doctor? Because he felt crummy!",
  "What do you call a can opener that doesn't work? A can't opener!",
  "What do you call a pig that does karate? A pork chop!",
  "Why don't eggs tell jokes? They'd crack each other up!",
  "What do you call a bear with no teeth? A gummy bear!",
  "Why did the golfer bring two pairs of pants? In case he got a hole in one!",
  "Why did the math book look so sad? Because it had too many problems!",
  "What do you call cheese that isn't yours? Nacho cheese!",
  "What do you call a sleeping bull? A bulldozer!",
  "Why did the cookie go to the hospital? Because he felt crumbly!",
  "What did the grape say when it got stepped on? Nothing, it just let out a little wine!",
  "Why don't skeletons fight each other? They don't have the guts!",
  "What do you call a snowman with a six-pack? An abdominal snowman!",
  "Why did the scarecrow become a successful motivational speaker? He was outstanding in his field!",
  "What do you call a bear with no ears? B!",
  "Why did the cookie go to the doctor? Because he was feeling crumbly!",
  "What do you call a fish wearing a bow tie? So-fish-ticated!",
  "Why did the gym close down? It just didn't work out!",
  "What do you call a pile of cats? A meow-ntain!",
  "Why don't scientists trust atoms? Because they make up everything!",
  "What do you call a fake noodle? An impasta!",
  "Why did the golfer bring two pairs of pants? In case he got a hole in one!",
  "What do you call cheese that isn't yours? Nacho cheese!",
  "Why did the cookie go to the hospital? Because he felt crumbly!",
  "What did the grape say when it got stepped on? Nothing, it just let out a little wine!",
  "Why don't skeletons fight each other? They don't have the guts!",
  "What do you call a snowman with a six-pack? An abdominal snowman!",
  "What do you call a bear with no ears? B!",
  "What do you call a fish wearing a bow tie? So-fish-ticated!",
  "Why did the gym close down? It just didn't work out!",
  "What do you call a pile of cats? A meow-ntain!"
];

const ultraRareJoke = "What's a dad's favorite cryptocurrency? DADCOIN! 🚀";
const superRareJoke = "What did the dad say when he caught his kid mining cryptocurrency? 'That's a bit much!'";
const jackpotJoke = "Why did the dad become a blockchain developer? Because he wanted to chain together the perfect dad jokes! 🎰";

// Validate reward amount
const validateReward = (amount: number): boolean => {
  return amount > 0 && amount <= 10000000;
};

// Sanitize numeric input
const sanitizeNumber = (num: number): number => {
  return Math.max(0, Math.min(num, 10000000));
};

// Rate limiting
const RATE_LIMIT = {
  MAX_CLAIMS_PER_HOUR: 100,
  MAX_GENERATIONS_PER_MINUTE: 30
};

interface JokeGeneratorProps {
  initialJackpot: number;
  onJackpotChange: (value: number) => void;
}

const JokeGenerator: React.FC<JokeGeneratorProps> = ({ initialJackpot, onJackpotChange }) => {
  const navigate = useNavigate();
  const [currentJoke, setCurrentJoke] = useState(jokes[0]);
  const [coinValue, setCoinValue] = useState(0);
  const [totalValue, setTotalValue] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [claimHistory, setClaimHistory] = useState<{ amount: number; timestamp: string }[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showUltraRare, setShowUltraRare] = useState(false);
  const [showJackpot, setShowJackpot] = useState(false);
  const [user, setUser] = useState(null);
  const [userWallet, setUserWallet] = useState<number>(0);
  const [lastClaimTime, setLastClaimTime] = useState<Date | null>(null);
  const [canClaim, setCanClaim] = useState(true);
  const [timeUntilNextClaim, setTimeUntilNextClaim] = useState<string>('');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [generations, setGenerations] = useState<number[]>([]);

  useEffect(() => {
    audioRef.current = new Audio('https://www.dropbox.com/scl/fi/0bncedan8bqcnsqcro1ro/world-war-3_O27sJRS.mp3?raw=1');
    audioRef.current.volume = 0.5;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session?.user) {
        setUser(null);
        return;
      }

      try {
        const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !currentUser) {
          console.error('Auth error:', userError);
          setUser(null);
          navigate('/auth');
          return;
        }

        setUser(currentUser);
      } catch (error) {
        console.error('Auth check error:', error);
        setUser(null);
        navigate('/auth');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const fetchUserData = async () => {
    if (!user) return;

    const maxRetries = 3;
    let retryCount = 0;

    while (retryCount < maxRetries) {
      try {
        const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !currentUser) {
          console.error('User fetch error:', userError);
          setUser(null);
          navigate('/auth');
          return;
        }

        // Fetch user's current pool and wallet data
        const { data: existingWallet, error: checkError } = await supabase
          .from('user_wallets')
          .select('balance, current_pool, last_claim_at')
          .eq('user_id', currentUser.id)
          .maybeSingle();

        if (checkError) {
          throw checkError;
        }

        if (!existingWallet) {
          const { error: createError } = await supabase
            .from('user_wallets')
            .insert({
              user_id: currentUser.id,
              balance: 0,
              current_pool: 0
            });

          if (createError) {
            throw createError;
          }

          setUserWallet(0);
          setTotalValue(0);
          setLastClaimTime(null);
          setCanClaim(true);
        } else {
          setUserWallet(existingWallet.balance);
          setTotalValue(existingWallet.current_pool || 0);
          setLastClaimTime(existingWallet.last_claim_at ? new Date(existingWallet.last_claim_at) : null);
          
          if (existingWallet.last_claim_at) {
            const lastClaim = new Date(existingWallet.last_claim_at);
            const now = new Date();
            const timeDiff = now.getTime() - lastClaim.getTime();
            const hoursDiff = timeDiff / (1000 * 60 * 60);
            setCanClaim(hoursDiff >= 1);
            
            if (hoursDiff < 1) {
              const minutesLeft = Math.ceil(60 - (timeDiff / (1000 * 60)));
              setTimeUntilNextClaim(`${minutesLeft} minute${minutesLeft !== 1 ? 's' : ''}`);
            }
          } else {
            setCanClaim(true);
          }
        }

        const { data: historyData, error: historyError } = await supabase
          .from('claim_history')
          .select('amount, claimed_at')
          .eq('user_id', currentUser.id)
          .order('claimed_at', { ascending: false });

        if (historyError) {
          throw historyError;
        }

        if (historyData) {
          setClaimHistory(historyData.map(claim => ({
            amount: claim.amount,
            timestamp: new Date(claim.claimed_at).toLocaleString()
          })));
        }

        break;

      } catch (error) {
        console.error('Error in fetchUserData:', error);
        
        if (retryCount === maxRetries - 1) {
          setUser(null);
          navigate('/auth');
          return;
        }
        
        await delay(1000 * Math.pow(2, retryCount));
        retryCount++;
      }
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  // Update cooldown timer
  useEffect(() => {
    if (!lastClaimTime || canClaim) return;

    const timer = setInterval(() => {
      const now = new Date();
      const timeDiff = now.getTime() - lastClaimTime.getTime();
      const hoursDiff = timeDiff / (1000 * 60 * 60);

      if (hoursDiff >= 1) {
        setCanClaim(true);
        setTimeUntilNextClaim('');
        clearInterval(timer);
      } else {
        const minutesLeft = Math.ceil(60 - (timeDiff / (1000 * 60)));
        setTimeUntilNextClaim(`${minutesLeft} minute${minutesLeft !== 1 ? 's' : ''}`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [lastClaimTime, canClaim]);

  const updateGlobalPool = async (newValue: number) => {
    const { data, error } = await supabase
      .from('global_pool')
      .update({ value: newValue })
      .eq('id', 1)
      .select()
      .single();

    if (!error && data) {
      onJackpotChange(data.value);
    }
  };

  const updateUserPool = async (userId: string, newPoolValue: number) => {
    const { error } = await supabase
      .from('user_wallets')
      .update({ current_pool: newPoolValue })
      .eq('user_id', userId);

    if (error) {
      console.error('Error updating user pool:', error);
    }
  };

  const generateJoke = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    try {
      // Rate limiting check
      const now = Date.now();
      const recentGenerations = generations.filter(time => now - time < 60000).length;
      
      if (recentGenerations >= RATE_LIMIT.MAX_GENERATIONS_PER_MINUTE) {
        throw new Error('Rate limit exceeded. Please wait before generating more jokes.');
      }

      setIsAnimating(true);
      setShowUltraRare(false);
      setShowJackpot(false);
      
      const { data: currentPool } = await supabase
        .from('global_pool')
        .select('value')
        .eq('id', 1)
        .single();

      if (!currentPool) return;

      const random = Math.random();
      let newJoke: string;
      let newValue: number;
      
      if (random < 0.000001) {
        newJoke = jackpotJoke;
        newValue = currentPool.value;
        
        try {
          const { error: walletError } = await supabase
            .from('user_wallets')
            .update({ 
              balance: userWallet + currentPool.value,
              current_pool: 0,
              updated_at: new Date().toISOString()
            })
            .eq('user_id', user.id);

          if (walletError) throw walletError;

          const { error: historyError } = await supabase
            .from('claim_history')
            .insert({
              user_id: user.id,
              amount: currentPool.value
            });

          if (historyError) throw historyError;

          setUserWallet(prev => prev + currentPool.value);
          setTotalValue(0);
          
          const timestamp = new Date().toLocaleString();
          setClaimHistory(prev => [...prev, { 
            amount: currentPool.value, 
            timestamp 
          }]);

          await updateGlobalPool(500000);
          
          setShowJackpot(true);
          triggerJackpotCelebration();
          
        } catch (error) {
          console.error('Error processing jackpot:', error);
          return;
        }
      }
      else if (random < 0.00015) {
        newJoke = ultraRareJoke;
        newValue = 10000;
        setShowUltraRare(true);
        
        const updatedPoolValue = Math.min(currentPool.value + newValue, 10000000);
        await updateGlobalPool(updatedPoolValue);
        
        const newTotalValue = totalValue + newValue;
        setTotalValue(newTotalValue);
        await updateUserPool(user.id, newTotalValue);
      }
      else if (random < 0.01) {
        newJoke = superRareJoke;
        newValue = 1000;
        
        const updatedPoolValue = Math.min(currentPool.value + newValue, 10000000);
        await updateGlobalPool(updatedPoolValue);
        
        const newTotalValue = totalValue + newValue;
        setTotalValue(newTotalValue);
        await updateUserPool(user.id, newTotalValue);
      }
      else if (random < 0.25) {
        const specialJokeIndex = Math.floor(Math.random() * 15) + 35;
        newJoke = jokes[specialJokeIndex];
        newValue = Number((Math.random() * (50 - 13) + 13).toFixed(2));
        
        const updatedPoolValue = Math.min(currentPool.value + newValue, 10000000);
        await updateGlobalPool(updatedPoolValue);
        
        const newTotalValue = totalValue + newValue;
        setTotalValue(newTotalValue);
        await updateUserPool(user.id, newTotalValue);
      }
      else {
        const commonJokeIndex = Math.floor(Math.random() * 35);
        newJoke = jokes[commonJokeIndex];
        newValue = Number((Math.random() * (10 - 1) + 1).toFixed(2));
        
        const updatedPoolValue = Math.min(currentPool.value + newValue, 10000000);
        await updateGlobalPool(updatedPoolValue);
        
        const newTotalValue = totalValue + newValue;
        setTotalValue(newTotalValue);
        await updateUserPool(user.id, newTotalValue);
      }

      // Validate reward amount
      if (!validateReward(newValue)) {
        throw new Error('Invalid reward amount');
      }

      newValue = sanitizeNumber(newValue);
      
      setCurrentJoke(newJoke);
      setCoinValue(newValue);
      setGenerations(prev => [...prev, now]);
      
      setTimeout(() => setIsAnimating(false), 1000);
    } catch (error) {
      console.error('Error generating joke:', error);
      setIsAnimating(false);
    }
  };

  const claimPool = async () => {
    if (!user || totalValue <= 0 || !canClaim) return;

    try {
      const now = new Date();
      const { error: walletError } = await supabase
        .from('user_wallets')
        .update({ 
          balance: userWallet + totalValue,
          current_pool: 0,
          last_claim_at: now.toISOString(),
          updated_at: now.toISOString()
        })
        .eq('user_id', user.id);

      if (walletError) throw walletError;

      const { error: historyError } = await supabase
        .from('claim_history')
        .insert({
          user_id: user.id,
          amount: totalValue
        });

      if (historyError) throw historyError;

      setUserWallet(prev => prev + totalValue);
      setTotalValue(0);
      setLastClaimTime(now);
      setCanClaim(false);
      
      const timestamp = new Date().toLocaleString();
      setClaimHistory(prev => [...prev, { amount: totalValue, timestamp }]);
    } catch (error) {
      console.error('Error claiming pool:', error);
    }
  };

  const triggerJackpotCelebration = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(error => console.error('Error playing audio:', error));
    }

    const duration = 15 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#fbb026', '#000000', '#FFD700'],
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#fbb026', '#000000', '#FFD700'],
      });
    }, 250);
  };

  return (
    <div className="card bg-white relative overflow-hidden">
      {showJackpot && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 animate-[fadeIn_0.5s]">
          <div className="text-center text-dadcoin-yellow max-w-2xl mx-auto px-4">
            <PartyPopper className="h-24 w-24 mx-auto mb-8 animate-[bounce_1s_infinite]" />
            <h2 className="text-6xl font-bold mb-6 animate-[pulse_1s_infinite]">
              🎉 JACKPOT! 🎉
            </h2>
            <p className="text-2xl mb-8">
              Holy smokes! You've hit the legendary 0.0001% jackpot!
              Your dad joke game is absolutely incredible!
            </p>
            <div className="bg-dadcoin-yellow text-black p-8 rounded-lg mb-8">
              <p className="text-7xl font-bold animate-[pulse_1.5s_infinite]">
                +{initialJackpot.toLocaleString()} $DADCOIN
              </p>
            </div>
            <p className="text-xl mb-8">
              This is the kind of moment that makes a dad proud.
              You're not just a dad joker, you're a dad joke legend!
            </p>
            <button 
              onClick={() => setShowJackpot(false)}
              className="btn btn-primary bg-dadcoin-yellow text-black text-xl px-12 py-4 hover:bg-opacity-90"
            >
              Claim Your Fortune
            </button>
          </div>
        </div>
      )}

      {showUltraRare && (
        <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center z-10 animate-[fadeIn_0.5s]">
          <div className="text-center text-dadcoin-yellow">
            <Trophy className="h-16 w-16 mx-auto mb-4 animate-[bounce_1s_infinite]" />
            <h3 className="text-2xl font-bold mb-2">LEGENDARY JOKE UNLOCKED!</h3>
            <p className="text-lg mb-4">You've hit the ultra-rare 0.01% chance!</p>
            <p className="text-3xl font-bold animate-[pulse_1s_infinite]">+10,000 $DADCOIN</p>
            <button 
              onClick={() => setShowUltraRare(false)}
              className="mt-6 btn btn-primary"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      <div className="mb-6 min-h-24">
        <p className="text-lg italic">"{currentJoke}"</p>
      </div>
      
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex gap-8">
            <div>
              <span className="text-sm text-gray-500">Joke Value:</span>
              <div className="text-2xl font-bold">{coinValue.toFixed(2)} $DADCOIN</div>
            </div>
            <div>
              <span className="text-sm text-gray-500">Current Pool:</span>
              <div className="text-2xl font-bold">{totalValue.toFixed(2)} $DADCOIN</div>
            </div>
            {user && (
              <div>
                <span className="text-sm text-gray-500">Your Wallet:</span>
                <div className="text-2xl font-bold">{userWallet.toFixed(2)} $DADCOIN</div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            <button 
              onClick={generateJoke}
              className="btn btn-primary flex items-center gap-2"
              disabled={isAnimating || showUltraRare || showJackpot}
            >
              <RefreshCw className={`h-5 w-5 ${isAnimating ? 'animate-spin' : ''}`} />
              {user ? 'New Joke' : 'Login to Generate'}
            </button>

            {user && (
              <button
                onClick={claimPool}
                className={`btn ${totalValue > 0 && canClaim ? 'btn-primary' : 'btn-outline opacity-50 cursor-not-allowed'} flex items-center gap-2`}
                disabled={totalValue === 0 || !canClaim || showUltraRare || showJackpot}
                title={!canClaim ? `Wait ${timeUntilNextClaim} before claiming again` : ''}
              >
                <Coins className="h-5 w-5" />
                {canClaim ? 'Claim Pool' : `Wait ${timeUntilNextClaim}`}
              </button>
            )}
          </div>
          
          {user && (
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="text-sm text-gray-500 hover:text-black transition-colors"
            >
              {showHistory ? 'Hide History' : 'Show History'}
            </button>
          )}
        </div>

        {showHistory && claimHistory.length > 0 && user && (
          <div className="mt-4 border-t border-gray-200 pt-4">
            <h3 className="text-sm font-bold mb-2">Claim History</h3>
            <div className="max-h-40 overflow-y-auto">
              {claimHistory.map((claim, index) => (
                <div key={index} className="flex justify-between text-sm py-1">
                  <span>{claim.timestamp}</span>
                  <span className="font-medium">{claim.amount.toFixed(2)} $DADCOIN</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <p className="text-sm text-gray-500">
        * Joke values are determined by the DadCoin Algorithm (DCA). Generate jokes to build your pool, 
        then claim your $DADCOIN whenever you're ready! The jackpot increases with each joke generation.
        Claims are limited to once per hour.
      </p>
    </div>
  );
};

export default JokeGenerator;