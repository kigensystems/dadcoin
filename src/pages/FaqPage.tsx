import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Newsletter from '../components/common/Newsletter';

interface FaqItem {
  question: string;
  answer: string;
}

const FaqPage: React.FC = () => {
  const faqs: FaqItem[] = [
    {
      question: "What exactly is Dadcoin?",
      answer: "Dadcoin is the world's first cryptocurrency powered by Proof of Dad Work (PoWD), allowing anyone to earn rewards just by sharing dad jokes. It's a revolutionary platform that turns dad humor into real value."
    },
    {
      question: "How do I earn Dadcoin?",
      answer: "You can earn Dadcoin through our unique Proof of Dad Work (PoWD) system by generating and sharing dad jokes on our platform. The better the joke, the more Dadcoin you can earn. It's completely free to participate!"
    },
    {
      question: "What's the total supply of Dadcoin?",
      answer: "Dadcoin has a total supply of 1 billion coins, with 100 million coins allocated to the Global Pool Vault for distributing winnings to joke generators. This ensures a sustainable reward system for our growing community."
    },
    {
      question: "How does the Global Pool Vault work?",
      answer: "The Global Pool Vault contains 100 million coins dedicated to rewarding users who generate dad jokes. When you generate a joke, you have a chance to earn from this pool, with rewards varying based on the quality of your jokes."
    },
    {
      question: "How do rewards work?",
      answer: "Each joke generation has a chance to earn different reward tiers, from common rewards to the legendary jackpot. The reward system is designed to be fun and engaging while maintaining the value of Dadcoin."
    },
    {
      question: "Is Dadcoin a real cryptocurrency?",
      answer: "While Dadcoin operates on blockchain principles and uses a unique Proof of Dad Work (PoWD) system, it's currently a fun, gamified platform that lets you earn tokens through dad jokes. Think of it as a reward system for spreading dad humor!"
    },
    {
      question: "How do I get started with Dadcoin?",
      answer: "Simply create an account with your wallet address, and you can start generating dad jokes immediately. No initial investment is required - it's completely free to participate and earn rewards."
    },
    {
      question: "What makes Dadcoin unique?",
      answer: "Dadcoin is the first-ever cryptocurrency to implement Proof of Dad Work (PoWD), making it possible for anyone to earn rewards just by sharing dad jokes. Our innovative system combines humor with blockchain technology in a way that's never been done before."
    }
  ];
  
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  
  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <section className="section">
        <div className="container">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h1>
            <p className="text-xl max-w-2xl mx-auto">
              Everything you wanted to know about Dadcoin but were afraid your dad would answer with a joke
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="mb-4 border-2 border-black rounded-lg overflow-hidden"
              >
                <button
                  className="w-full text-left p-4 flex justify-between items-center bg-white hover:bg-gray-50 transition-colors"
                  onClick={() => toggleFaq(index)}
                >
                  <span className="font-bold text-lg">{faq.question}</span>
                  {openIndex === index ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </button>
                
                {openIndex === index && (
                  <div className="p-4 bg-gray-50 border-t border-black">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <p className="mb-4">Still have questions? We're here to help!</p>
            <a href="#contact" className="btn btn-primary">Contact Us</a>
          </div>
        </div>
      </section>
      
      <section id="contact" className="section bg-white border-y-2 border-black">
        <div className="container max-w-4xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Contact The Dad Team</h2>
            <p className="text-lg">
              Have a question about Dadcoin? We're here to help!
            </p>
          </div>
          
          <form className="card">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="name" className="block mb-2 font-medium">Name</label>
                <input
                  type="text"
                  id="name"
                  className="w-full p-3 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Your Name"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block mb-2 font-medium">Email</label>
                <input
                  type="email"
                  id="email"
                  className="w-full p-3 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="youremail@example.com"
                />
              </div>
            </div>
            
            <div className="mb-6">
              <label htmlFor="subject" className="block mb-2 font-medium">Subject</label>
              <input
                type="text"
                id="subject"
                className="w-full p-3 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="What's this about?"
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="message" className="block mb-2 font-medium">Message</label>
              <textarea
                id="message"
                rows={5}
                className="w-full p-3 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Your message here..."
              ></textarea>
            </div>
            
            <div className="flex justify-center">
              <button type="submit" className="btn btn-primary">Send Message</button>
            </div>
          </form>
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

export default FaqPage;