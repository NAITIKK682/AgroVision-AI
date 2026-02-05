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

// --- 1. NAYA VIDEO SPLASH COMPONENT ---
const VideoSplashScreen = ({ onFinished }) => {
  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 flex items-center justify-center bg-[#020d08] z-[300]"
    >
      <video 
        src="/splash-video.mp4" // Make sure this is in your public folder
        autoPlay 
        muted 
        playsInline 
        onEnded={onFinished} // Video khatam hote hi trigger hoga
        className="w-full h-full object-cover md:w-auto md:max-h-[80vh]"
      />
      {/* Fallback timer agar video load na ho ya bohot lambi ho */}
      <button 
        onClick={onFinished}
        className="absolute bottom-10 text-emerald-500/50 text-xs uppercase tracking-widest"
      >
        Skip Intro
      </button>
    </motion.div>
  );
};

// High-Fidelity Loading State (Used for Page Transitions)
const LoadingScreen = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-[#020d08] z-[200]">
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center"
    >
      <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
      <span className="text-emerald-400 font-mono tracking-widest uppercase text-xs animate-pulse">Initializing Agro-Neural System</span>
    </motion.div>
  </div>
);

const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
            <LandingPage />
          </motion.div>
        } />
        <Route path="/scan" element={
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4 }}>
            <DetectionPage />
          </motion.div>
        } />
        <Route path="/history" element={
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4 }}>
            <HistoryPage />
          </motion.div>
        } />
        <Route path="/assistant" element={
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4 }}>
            <AssistantPage />
          </motion.div>
        } />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  // --- 2. SPLASH STATE LOGIC ---
  const [showSplash, setShowSplash] = useState(true);

  // Optional: Sirf Session mein ek baar splash dikhane ke liye
  // useEffect(() => {
  //   const hasSeenSplash = sessionStorage.getItem('splashSeen');
  //   if (hasSeenSplash) setShowSplash(false);
  // }, []);

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
            <div className="min-h-screen flex flex-col bg-[#020d08] selection:bg-emerald-500/30 selection:text-emerald-200">
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