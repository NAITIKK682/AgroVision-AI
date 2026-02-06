import React, { Suspense, lazy, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { LanguageProvider } from './contexts/LanguageContext';
import { OfflineProvider } from './contexts/OfflineContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Lazy Loaded Pages
const LandingPage = lazy(() => import('./pages/LandingPage'));
const DetectionPage = lazy(() => import('./pages/DetectionPage'));
const HistoryPage = lazy(() => import('./pages/HistoryPage'));
const AssistantPage = lazy(() => import('./pages/AssistantPage'));

/**
 * Enterprise Video Splash Screen
 * Features auto-fallback, skip logic, and high-performance hardware acceleration.
 */
const VideoSplashScreen = ({ onFinished }) => {
  // Automatic fallback if video fails to play/load within 4 seconds
  useEffect(() => {
    const timer = setTimeout(onFinished, 4500);
    return () => clearTimeout(timer);
  }, [onFinished]);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 flex items-center justify-center bg-[#020d08] z-[999]"
    >
      <video 
        src="/splash-video.mp4" 
        autoPlay 
        muted 
        playsInline 
        onEnded={onFinished}
        className="w-full h-full object-cover transition-opacity duration-1000"
        onError={onFinished}
      />
      
      {/* Premium Overlay Branding */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#020d08] via-transparent to-transparent opacity-60" />
      
      <button 
        onClick={onFinished}
        className="absolute bottom-12 px-6 py-2 border border-emerald-500/20 rounded-full text-emerald-500/50 text-[10px] uppercase tracking-[0.3em] hover:bg-emerald-500/10 hover:text-emerald-400 transition-all duration-300"
      >
        Skip Intro
      </button>
    </motion.div>
  );
};

const LoadingScreen = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-[#020d08] z-[200]">
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center"
    >
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 border-2 border-emerald-500/20 rounded-full" />
        <div className="absolute inset-0 border-t-2 border-emerald-500 rounded-full animate-spin" />
      </div>
      <span className="mt-6 text-emerald-500 font-mono tracking-[0.2em] uppercase text-[10px] animate-pulse">
        System Synchronizing
      </span>
    </motion.div>
  </div>
);

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
};

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <PageWrapper><LandingPage /></PageWrapper>
        } />
        <Route path="/scan" element={
          <PageWrapper><DetectionPage /></PageWrapper>
        } />
        <Route path="/history" element={
          <PageWrapper><HistoryPage /></PageWrapper>
        } />
        <Route path="/assistant" element={
          <PageWrapper><AssistantPage /></PageWrapper>
        } />
      </Routes>
    </AnimatePresence>
  );
};

// Reusable Page Wrapper for consistent transitions
const PageWrapper = ({ children }) => (
  <motion.div 
    initial={{ opacity: 0, y: 15 }} 
    animate={{ opacity: 1, y: 0 }} 
    exit={{ opacity: 0, y: -15 }} 
    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
);

function App() {
  const [showSplash, setShowSplash] = useState(() => {
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
            <div className="min-h-screen flex flex-col bg-[#020d08] text-slate-200 selection:bg-emerald-500/30 selection:text-emerald-200">
              {/* Mesh Gradient Background for Premium Look */}
              <div className="fixed inset-0 pointer-events-none opacity-20">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-900/30 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-green-900/20 blur-[120px] rounded-full" />
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