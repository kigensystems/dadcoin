import React from 'react';
import { Laugh, DollarSign, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import CoinCounter from '../components/home/CoinCounter';
import JokeGenerator from '../components/home/JokeGenerator';
import Newsletter from '../components/common/Newsletter';
import FeatureCard from '../components/home/FeatureCard';
import { useGlobalPool } from '../context/GlobalPoolContext';

const HomePage: React.FC = () => {
  const { globalPoolValue } = useGlobalPool();
  
  const features = [
    {
      title: "Dad Joke Mining",
      description: "Generate Dadcoin by telling verified dad jokes. The groanier the joke, the more coins you earn.",
      icon: <Laugh className="h-8 w-8" />,
      color: "bg-blue-100"
    },
    {
      title: "Tokenomics",
      description: "With a total supply of 1 billion coins and 100M allocated to rewards, our Global Pool Vault ensures sustainable earnings for joke generators.",
      icon: <TrendingUp className="h-8 w-8" />,
      color: "bg-green-100"
    },
    {
      title: "Revolutionary Incentives",
      description: "Be part of history with the world's first Proof of Dad Work (PoWD) coin. Earn rewards completely free just by sharing your dad humor!",
      icon: <DollarSign className="h-8 w-8" />,
      color: "bg-red-100"
    }
  ];

  return (
    <>
      <div className="min-h-screen bg-dadcoin-yellow flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-7xl md:text-8xl font-extrabold mb-8">
          <span className="dad-outline text-dadcoin-black">DAD</span>COIN
        </h1>
        <img 
          src="https://i.imgur.com/rgo63fD.png" 
          alt="Dadcoin Hero" 
          className="w-96 h-96 object-contain mb-12"
        />
        <div className="max-w-2xl mx-auto mb-12">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth" className="btn btn-primary">
              Join the Dad Club
            </Link>
          </div>
        </div>
      </div>
      
      <section className="section">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Dadcoin?</h2>
            <p className="text-lg max-w-2xl mx-auto">
              Because money can't buy happiness, but Dadcoin might make you chuckle. 
              And that's basically the same thing.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
                color={feature.color}
              />
            ))}
          </div>
        </div>
      </section>
      
      <section className="section bg-white border-y-2 border-black">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="w-full md:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">What is Dadcoin?</h2>
              <p className="text-lg mb-6">
                Dadcoin is the world's first cryptocurrency powered by dad jokes. 
                Our revolutionary blockchain uses Proof of Dad Work (PoDW) to validate transactions 
                and reward the community for their humor.
              </p>
              <p className="text-lg mb-6">
                Whether you're looking to invest in your future or just want to make 
                puns that are worth something, Dadcoin has your back.
              </p>
              <div className="card relative">
                <h3 className="text-xl font-bold mb-4">Current Global Pool</h3>
                <CoinCounter value={globalPoolValue} />
                <p className="text-sm text-gray-500 mt-4">
                  *Pool increases with each joke generation
                </p>
              </div>
            </div>
            
            <div className="w-full md:w-1/2">
              <JokeGenerator initialJackpot={globalPoolValue} onJackpotChange={() => {}} />
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

export default HomePage;