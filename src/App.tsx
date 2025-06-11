import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import FaqPage from './pages/FaqPage';
import AuthPage from './pages/AuthPage';
import GamePage from './pages/GamePage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import { GlobalPoolProvider } from './context/GlobalPoolContext';
import { WalletAuthProvider } from './context/WalletAuthContext';
import './App.css';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <WalletAuthProvider>
      <GlobalPoolProvider>
        <Router>
          <ScrollToTop />
          <div className="app bg-dadcoin-yellow min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/faq" element={<FaqPage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/game" element={<GamePage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </GlobalPoolProvider>
    </WalletAuthProvider>
  );
}

export default App;