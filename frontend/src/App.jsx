import React, { Suspense, lazy } from 'react';
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

// High-Fidelity Loading State (Themed to Dark Emerald)
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
        <Route 
          path="/" 
          element={
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
              <LandingPage />
            </motion.div>
          } 
        />
        <Route 
          path="/scan" 
          element={
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4 }}>
              <DetectionPage />
            </motion.div>
          } 
        />
        <Route 
          path="/history" 
          element={
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4 }}>
              <HistoryPage />
            </motion.div>
          } 
        />
        <Route 
          path="/assistant" 
          element={
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4 }}>
              <AssistantPage />
            </motion.div>
          } 
        />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <LanguageProvider>
      <OfflineProvider>
        <Router>
          <ScrollToTop />
          {/* Changed bg-brand-50 to deep black #020d08 */}
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
      </OfflineProvider>
    </LanguageProvider>
  );
}

export default App;