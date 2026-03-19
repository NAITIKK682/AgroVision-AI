/**
 * AgroVision AI - Enterprise Frontend Shell
 * Features: Framer Motion orchestration, dynamic lazy loading, splash screen logic, 
 * and global context injection for production-grade agricultural SaaS.
 */

import React, { Suspense, lazy, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { LanguageProvider } from './contexts/LanguageContext';
import { OfflineProvider } from './contexts/OfflineContext';

// Core Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Optimized Lazy Loaded Pages
const LandingPage = lazy(() => import('./pages/LandingPage'));
const DetectionPage = lazy(() => import('./pages/DetectionPage'));
const HistoryPage = lazy(() => import('./pages/HistoryPage'));
const AssistantPage = lazy(() => import('./pages/AssistantPage'));

/**
 * Enterprise Video Splash Screen
 * Features auto-fallback, skip logic, and hardware-accelerated transitions.
 */
const VideoSplashScreen = ({ onFinished }) => {
  // Automatic fallback if video fails to load or play within 4.5s
  useEffect(() => {
    const timer = setTimeout(onFinished, 4500);
    return () => clearTimeout(timer);
  }, [onFinished]);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05, filter: "blur(20px)" }}
      transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
      className="fixed inset-0 flex items-center justify-center bg-[#020d08] z-[999] overflow-hidden"
    >
      <video 
        src="/splash-video.mp4" 
        autoPlay 
        muted 
        playsInline 
        onEnded={onFinished}
        className="w-full h-full object-cover"
        onError={onFinished}
      />
      
      {/* Premium Cinematic Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#020d08] via-transparent to-[#020d08] opacity-70" />
      
      <motion.button 
        whileHover={{ scale: 1.05, backgroundColor: "rgba(16, 185, 129, 0.1)" }}
        whileTap={{ scale: 0.95 }}
        onClick={onFinished}
        className="absolute bottom-12 px-8 py-3 border border-emerald-500/30 rounded-full text-emerald-500/70 text-[10px] uppercase tracking-[0.4em] transition-all duration-300 backdrop-blur-md"
      >
        Skip Introduction
      </motion.button>
    </motion.div>
  );
};

/**
 * Production-Grade Skeleton/Loading State
 */
const LoadingScreen = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-[#020d08] z-[200]">
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center"
    >
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-2 border-emerald-500/10 rounded-full" />
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="absolute inset-0 border-t-2 border-emerald-500 rounded-full" 
        />
      </div>
      <span className="mt-8 text-emerald-500/60 font-mono tracking-[0.3em] uppercase text-[9px] animate-pulse">
        Engine Synchronizing
      </span>
    </motion.div>
  </div>
);

/**
 * Smooth Scroll Manager
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
};

/**
 * Route Transition Wrapper
 */
const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><LandingPage /></PageWrapper>} />
        <Route path="/scan" element={<PageWrapper><DetectionPage /></PageWrapper>} />
        <Route path="/history" element={<PageWrapper><HistoryPage /></PageWrapper>} />
        <Route path="/assistant" element={<PageWrapper><AssistantPage /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
};

const PageWrapper = ({ children }) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }} 
    animate={{ opacity: 1, y: 0 }} 
    exit={{ opacity: 0, y: -10 }} 
    transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
  >
    {children}
  </motion.div>
);

function App() {
  const [showSplash, setShowSplash] = useState(() => {
    // Splash screen logic: only show once per session
    return !sessionStorage.getItem('splashSeen');
  });

  const handleSplashFinish = () => {
    setShowSplash(false);
    sessionStorage.setItem('splashSeen', 'true');
  };

  return (
    <LanguageProvider>
      <OfflineProvider>
        <AnimatePresence>
          {showSplash && <VideoSplashScreen onFinished={handleSplashFinish} />}
        </AnimatePresence>

        {!showSplash && (
          <Router>
            <ScrollToTop />
            <div className="min-h-screen flex flex-col bg-[#020d08] text-slate-200 selection:bg-emerald-500/30 selection:text-emerald-200 antialiased">
              
              {/* Premium Background Architecture */}
              <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-900/10 blur-[150px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-green-900/10 blur-[150px] rounded-full" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10" />
              </div>

              <Navbar />
              
              <main className="flex-grow pt-20 md:pt-24 relative z-10">
                <Suspense fallback={<LoadingScreen />}>
                  <AnimatedRoutes />
                </Suspense>
              </main>

              <Footer />
            </div>
          </Router>
        )}
      </OfflineProvider>
    </LanguageProvider>
  );
}

export default App;