import React, { useEffect, useRef } from 'react';
import { ArrowDown } from 'lucide-react';

const DadHero: React.FC = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
            entry.target.classList.remove('opacity-0', 'translate-y-10');
          }
        });
      },
      { threshold: 0.1 }
    );
    
    if (titleRef.current) {
      observer.observe(titleRef.current);
    }
    
    return () => {
      if (titleRef.current) {
        observer.unobserve(titleRef.current);
      }
    };
  }, []);

  return (
    <section className="min-h-[90vh] flex flex-col justify-center relative overflow-hidden">
      <div className="container mx-auto px-4 z-10">
        <div className="flex flex-col items-center text-center">
          <img 
            src="https://imgur.com/rgo63fD" 
            alt="DadCoin Hero" 
            className="w-64 h-64 mb-8 object-contain"
          />
          <div 
            className="mb-8 opacity-0 translate-y-10 transition-all duration-1000" 
            ref={titleRef}
          >
            <h1 className="text-5xl md:text-7xl font-extrabold mb-2">
              <span className="dad-outline text-dadcoin-black">DAD</span>COIN
            </h1>
            <p className="text-xl md:text-2xl font-medium mt-4 max-w-2xl mx-auto">
              
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <a 
              href="#learn-more" 
              className="btn btn-primary"
            >
              Learn More
            </a>
            <a 
              href="#newsletter" 
              className="btn btn-outline"
            >
              Join the Dad Club
            </a>
          </div>
          
          <div className="mt-16">
            <ArrowDown className="h-10 w-10 animate-bounce" />
          </div>
        </div>
      </div>
      
      {/* Background elements */}
      <div className="absolute top-1/4 left-10 opacity-20 w-32 h-32 rounded-full border-4 border-black"></div>
      <div className="absolute bottom-1/4 right-10 opacity-20 w-48 h-48 rounded-full border-4 border-black"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-10">
        <div className="w-96 h-96 rounded-full border-8 border-black"></div>
      </div>
    </section>
  );
};

export default DadHero;