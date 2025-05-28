import React from 'react';
import { Link } from 'react-router-dom';
import { Coins, Twitter, MessageCircle } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-[#fbb026] py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <span className="text-xl font-bold">Dadcoin</span>
            </Link>
            <p className="mb-6 max-w-md">
              The cryptocurrency for dads, by dads. Because dad jokes should be worth something.
            </p>
            <div className="flex gap-4">
              <a 
                href="https://x.com/dadcoinz" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-white transition-colors" 
                aria-label="Twitter"
              >
                <Twitter />
              </a>
              <a 
                href="https://t.me/+v0RWggB34LU3MDYx" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-white transition-colors" 
                aria-label="Telegram"
              >
                <MessageCircle />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><a href="#newsletter" className="hover:text-white transition-colors">Newsletter</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-[#fbb026]/30 mt-12 pt-6 text-center md:flex md:justify-between">
          <p>&copy; {currentYear} Dadcoin. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Made with dad-level commitment 💪</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;