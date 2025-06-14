import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, UserPlus, LogIn, Wallet } from 'lucide-react';
import { registerWallet, loginWallet } from '../lib/wallet-auth';
import { useWalletAuth } from '../context/WalletAuthContext';

const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const { refreshUser } = useWalletAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [walletAddress, setWalletAddress] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!walletAddress || !password) {
        throw new Error('All fields are required');
      }

      if (!isLogin && !acceptedTerms) {
        throw new Error('You must accept the Terms and Conditions');
      }

      let result;
      if (isLogin) {
        result = await loginWallet(walletAddress, password);
      } else {
        result = await registerWallet(walletAddress, password);
      }

      if (!result.success) {
        throw new Error(result.error || 'Authentication failed');
      }

      // Refresh user context and redirect to home page
      refreshUser();
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dadcoin-yellow px-4">
      <div className="card max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {isLogin ? 'Welcome Back!' : 'Join the Dad Club'}
          </h1>
          <p className="text-gray-600">
            {isLogin
              ? 'Enter your wallet address and password to login'
              : 'Register your Solana wallet to start earning DADCOIN'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="wallet" className="block text-sm font-medium text-gray-700 mb-1">
              Solana Wallet Address
            </label>
            <div className="relative">
              <Wallet className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                id="wallet"
                type="text"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value.trim())}
                className="pl-10 w-full p-3 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="e.g. 9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 w-full p-3 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {!isLogin && (
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="w-4 h-4 border-2 border-black rounded focus:ring-2 focus:ring-black"
                />
              </div>
              <div className="ml-3">
                <label htmlFor="terms" className="text-sm text-gray-600">
                  I agree to the{' '}
                  <a href="/terms" className="text-black font-medium hover:underline">
                    Terms and Conditions
                  </a>
                  {' '}and{' '}
                  <a href="/privacy" className="text-black font-medium hover:underline">
                    Privacy Policy
                  </a>
                </label>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border-2 border-red-500 text-red-700 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || (!isLogin && !acceptedTerms)}
            className={`btn btn-primary w-full flex items-center justify-center gap-2 ${
              (!isLogin && !acceptedTerms) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? (
              'Loading...'
            ) : isLogin ? (
              <>
                <LogIn className="h-5 w-5" />
                Log In
              </>
            ) : (
              <>
                <UserPlus className="h-5 w-5" />
                Sign Up
              </>
            )}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setAcceptedTerms(false);
                setWalletAddress('');
                setPassword('');
              }}
              className="text-sm text-gray-600 hover:text-black transition-colors"
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Log in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;