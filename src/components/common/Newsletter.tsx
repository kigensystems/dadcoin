import React, { useState } from 'react';
import { Mail, CheckCircle } from 'lucide-react';

const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(true);
  
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setIsValidEmail(false);
      return;
    }
    
    if (!validateEmail(email)) {
      setIsValidEmail(false);
      return;
    }
    
    // Simulate API call
    setTimeout(() => {
      setIsSubscribed(true);
      setEmail('');
    }, 1000);
  };

  return (
    <div className="relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="card max-w-3xl mx-auto relative z-10">
          <div className="flex items-center justify-center mb-6">
            <Mail className="h-10 w-10 mr-2" />
            <h2 className="text-3xl font-bold">Join the Dad Club</h2>
          </div>
          
          {isSubscribed ? (
            <div className="bg-green-100 p-4 rounded-lg flex items-center">
              <CheckCircle className="h-6 w-6 mr-2 text-green-600" />
              <p>You've successfully subscribed to the Dad Club! Prepare for wisdom.</p>
            </div>
          ) : (
            <>
              <p className="text-center mb-6">
                Subscribe to our newsletter for dad jokes, grilling tips, and Dadcoin updates.
                We promise not to spam you more than your actual dad texts you about the weather.
              </p>
              
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-grow">
                    <input
                      type="email"
                      placeholder="youremail@example.com"
                      className={`w-full p-3 border-2 ${
                        isValidEmail ? 'border-black' : 'border-red-500'
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-black`}
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setIsValidEmail(true);
                      }}
                    />
                    {!isValidEmail && (
                      <p className="text-red-500 mt-1 text-sm">Please enter a valid email address</p>
                    )}
                  </div>
                  <button type="submit" className="btn btn-primary whitespace-nowrap">
                    Subscribe Now
                  </button>
                </div>
              </form>
              
              <p className="text-sm text-gray-500 mt-4">
                By subscribing, you agree to receive dad jokes that may or may not be funny.
                Unsubscribe anytime (but your dad will be disappointed).
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Newsletter;