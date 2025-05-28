import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Coins, LogOut, Wallet } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session?.user) {
        setUser(null);
        setWalletAddress('');
        return;
      }

      try {
        const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !currentUser) {
          console.error('Auth error:', userError);
          setUser(null);
          setWalletAddress('');
          navigate('/auth');
          return;
        }

        setUser(currentUser);
        const wallet = currentUser.user_metadata.wallet_address;
        setWalletAddress(wallet ? `${wallet.slice(0, 4)}...` : '');
      } catch (error) {
        console.error('Auth check error:', error);
        setUser(null);
        setWalletAddress('');
        navigate('/auth');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    const handleScroll = () => {
      if (location.pathname === '/') {
        const scrollPosition = window.scrollY;
        setIsVisible(scrollPosition > 100);
      } else {
        setIsVisible(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error);
      }
      
      setUser(null);
      setWalletAddress('');
      navigate('/auth');
    } catch (error) {
      console.error('Logout error:', error);
      setUser(null);
      setWalletAddress('');
      navigate('/auth');
    }
  };

  if (location.pathname !== '/') {
    return null;
  }

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isVisible 
          ? 'translate-y-0 opacity-100 py-2 bg-dadcoin-yellow shadow-lg' 
          : '-translate-y-full opacity-0'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
          
      
        </Link>
        
        <nav className="hidden md:flex items-center gap-8">
          <Link 
            to="/" 
            className={`font-medium ${location.pathname === '/' ? 'font-bold border-b-2 border-black' : ''}`}
          >
            Home
          </Link>
          <Link 
            to="/about" 
            className={`font-medium ${location.pathname === '/about' ? 'font-bold border-b-2 border-black' : ''}`}
          >
            About
          </Link>
          <Link 
            to="/faq" 
            className={`font-medium ${location.pathname === '/faq' ? 'font-bold border-b-2 border-black' : ''}`}
          >
            FAQ
          </Link>
          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                <span className="font-medium">{walletAddress}</span>
              </div>
              <button
                onClick={handleLogout}
                className="btn btn-primary flex items-center gap-2"
              >
                <LogOut className="h-5 w-5" />
                Logout
              </button>
            </div>
          ) : (
            <Link to="/auth" className="btn btn-primary">
              Join the Dad Club
            </Link>
          )}
        </nav>
        
        <button 
          className="md:hidden p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? 'Close Menu' : 'Open Menu'}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-dadcoin-yellow z-40 pt-20">
          <nav className="flex flex-col items-center gap-8 p-8">
            <Link 
              to="/" 
              className={`text-xl ${location.pathname === '/' ? 'font-bold' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className={`text-xl ${location.pathname === '/about' ? 'font-bold' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              to="/faq" 
              className={`text-xl ${location.pathname === '/faq' ? 'font-bold' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              FAQ
            </Link>
            {user ? (
              <>
                <div className="flex items-center gap-2">
                  <Wallet className="h-5 w-5" />
                  <span className="font-medium">{walletAddress}</span>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="btn btn-primary text-xl flex items-center gap-2"
                >
                  <LogOut className="h-5 w-5" />
                  Logout
                </button>
              </>
            ) : (
              <Link 
                to="/auth" 
                className="btn btn-primary text-xl" 
                onClick={() => setIsMenuOpen(false)}
              >
                Join the Dad Club
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;