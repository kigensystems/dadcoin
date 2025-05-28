import React, { useEffect, useState } from 'react';
import { Clock, Coins, Award, Users } from 'lucide-react';
import Newsletter from '../components/common/Newsletter';
import { useGlobalPool } from '../context/GlobalPoolContext';
import { supabase } from '../lib/supabase';

const AboutPage: React.FC = () => {
  const { globalPoolValue } = useGlobalPool();
  const [totalRewards, setTotalRewards] = useState<number>(0);

  useEffect(() => {
    const fetchTotalRewards = async () => {
      try {
        const { data, error } = await supabase.rpc('get_total_claimed_amount');
        if (error) throw error;
        setTotalRewards(data || 0);
      } catch (error) {
        console.error('Error fetching total rewards:', error);
      }
    };

    fetchTotalRewards();

    const channel = supabase.channel('claim_history_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'claim_history'
        },
        () => {
          fetchTotalRewards();
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Subscribed to claim history changes');
        }
      });

    return () => {
      channel.unsubscribe();
    };
  }, []);

  const stats = [
    { 
      icon: <Coins />, 
      value: totalRewards.toLocaleString(undefined, { maximumFractionDigits: 2 }), 
      label: 'Dadcoin Rewarded' 
    },
    { 
      icon: <Users />, 
      value: (globalPoolValue - 500000).toLocaleString(undefined, { maximumFractionDigits: 2 }), 
      label: 'Dadcoins Generated' 
    },
    { 
      icon: <Clock />, 
      value: '24/7', 
      label: 'Community Support' 
    },
    { 
      icon: <Award />, 
      value: '#1', 
      label: 'In Dad Satisfaction' 
    }
  ];

  return (
    <>
      <section className="section">
        <div className="container">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">About Dadcoin</h1>
            <p className="text-xl max-w-2xl mx-auto">
              The story behind the world's first Play-to-Laugh cryptocurrency
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="h-[250px]">
              <img 
                src="https://imgur.com/0LqgdKy.png" 
                alt="Dad checking phone" 
                className="w-full h-full object-contain rounded-lg"
              />
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] border-2 border-black h-[250px] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">Our Origin Story</h2>
              <p className="mb-4">
                Dadcoin was born from a simple yet powerful idea: what if we could turn 
                the universal appeal of dad jokes into a revolutionary reward system?
              </p>
              <p className="mb-4">
                Our team of visionary developers and comedy enthusiasts created the world's 
                first Play-to-Laugh ecosystem, where humor meets blockchain technology.
              </p>
              <p>
                Today, Dadcoin stands as a testament to innovation in the meme coin space, 
                proving that community, humor, and technology can create real value.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="section bg-white border-y-2 border-black">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="card text-center p-6 transform hover:scale-105 transition-transform">
                <div className="flex justify-center mb-4">
                  {React.cloneElement(stat.icon as React.ReactElement, { 
                    className: 'h-12 w-12 text-dadcoin-black' 
                  })}
                </div>
                <div className="text-3xl md:text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-lg font-semibold">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <section className="section">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How Dadcoin Works</h2>
            <p className="text-lg max-w-2xl mx-auto">
              Our innovative Play-to-Laugh system combines community engagement with cutting-edge blockchain technology
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card">
              <h3 className="text-xl font-bold mb-4">1. Joke Generation</h3>
              <p>
                Generate dad jokes through our platform to earn rewards. Our unique 
                algorithm evaluates each joke's potential, with rarer jokes earning 
                higher rewards. It's completely free to participate!
              </p>
            </div>
            
            <div className="card">
              <h3 className="text-xl font-bold mb-4">2. Tokenomics</h3>
              <p>
                Dadcoin has a total supply of 1 billion coins, with 100M allocated to the Global Pool Vault 
                for distributing winnings to joke generators. This ensures a sustainable reward system 
                for our growing community of humor enthusiasts.
              </p>
            </div>
            
            <div className="card">
              <h3 className="text-xl font-bold mb-4">3. Community Rewards</h3>
              <p>
                Participate in our vibrant community to earn additional rewards. Special events, 
                rare joke discoveries, and legendary combinations can unlock substantial bonuses 
                and unique opportunities.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="section bg-white border-y-2 border-black">
        <div className="container">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="w-full md:w-1/2">
              <h2 className="text-3xl font-bold mb-4">The Dadcoin Team</h2>
              <p className="mb-4">
                Our team consists of blockchain innovators, comedy enthusiasts, and 
                community builders who believe in the power of humor to create value.
              </p>
              <p className="mb-4">
                With decades of combined experience in cryptocurrency, smart contracts, 
                and community management, we're building the future of social tokens.
              </p>
              <p>
                Together, we're revolutionizing the meme coin space by creating the 
                first truly interactive, reward-based humor platform on the blockchain.
              </p>
            </div>
            
            <div className="w-full md:w-1/2">
              <img 
                src="https://images.pexels.com/photos/8851096/pexels-photo-8851096.jpeg" 
                alt="Team working" 
                className="rounded-lg border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" 
              />
            </div>
          </div>
        </div>
      </section>
      
      <section id="newsletter" className="section">
        <div className="container">
          <Newsletter />
        </div>
      </section>
    </>
  );
};

export default AboutPage;