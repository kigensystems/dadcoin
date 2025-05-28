import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface GlobalPoolContextType {
  globalPoolValue: number;
  setGlobalPoolValue: (value: number) => void;
}

const GlobalPoolContext = createContext<GlobalPoolContextType | undefined>(undefined);

export const GlobalPoolProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [globalPoolValue, setGlobalPoolValue] = useState(500000);

  useEffect(() => {
    let mounted = true;

    const fetchGlobalPool = async () => {
      try {
        const { data, error } = await supabase
          .from('global_pool')
          .select('value')
          .eq('id', 1)
          .single();
        
        if (error) {
          console.error('Error fetching global pool:', error);
          return;
        }
        
        if (mounted && data) {
          setGlobalPoolValue(data.value);
        }
      } catch (error) {
        console.error('Error in fetchGlobalPool:', error);
      }
    };

    // Initial fetch
    fetchGlobalPool();

    // Set up real-time subscription
    const channel = supabase.channel('global_pool_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'global_pool',
          filter: 'id=eq.1'
        },
        (payload) => {
          if (mounted && payload.new && typeof payload.new.value === 'number') {
            setGlobalPoolValue(payload.new.value);
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Subscribed to global pool changes');
        }
      });

    // Cleanup
    return () => {
      mounted = false;
      channel.unsubscribe();
    };
  }, []);

  return (
    <GlobalPoolContext.Provider value={{ globalPoolValue, setGlobalPoolValue }}>
      {children}
    </GlobalPoolContext.Provider>
  );
};

export const useGlobalPool = () => {
  const context = useContext(GlobalPoolContext);
  if (context === undefined) {
    throw new Error('useGlobalPool must be used within a GlobalPoolProvider');
  }
  return context;
};