import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

/**
 * AgroVision-AI | Premium Splash Sequence
 * FIX: Mobile Autoplay & Reload Stability
 */

const SplashScreen = ({ onFinished }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    // Mobile browsers fix: Force play on mount
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.log("Autoplay prevented or video loading:", error);
      });
    }

    const timer = setTimeout(() => {
      onFinished();
    }, 6000); 
    
    return () => clearTimeout(timer);
  }, [onFinished]);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 w-full h-full bg-[#020d08] z-[9999] flex flex-col items-center justify-center overflow-hidden"
    >
      <div className="relative z-10 w-full max-w-[280px] md:max-w-[500px] px-4 flex flex-col items-center">
        
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1 }}
          className="w-full overflow-hidden rounded-2xl shadow-2xl shadow-emerald-900/40 border border-emerald-500/10"
        >
          <video 
            ref={videoRef}
            src="/splash-video.mp4" 
            autoPlay 
            muted 
            loop
            playsInline 
            preload="auto"
            onEnded={onFinished}
            className="w-full h-auto block object-contain pointer-events-none"
          />
        </motion.div>

        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 text-center"
        >
          <div className="flex items-center gap-2 justify-center">
             <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
             <p className="text-emerald-500/60 font-mono text-[10px] tracking-[0.4em] uppercase">
               System Loading
             </p>
          </div>
        </motion.div>
      </div>

      <motion.button 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        whileHover={{ opacity: 1, backgroundColor: "rgba(16, 185, 129, 0.05)" }}
        onClick={onFinished}
        className="absolute bottom-10 px-6 py-2 border border-emerald-500/20 rounded-full text-emerald-500/80 text-[9px] font-mono tracking-widest uppercase backdrop-blur-sm transition-all"
      >
        Skip Intro
      </motion.button>

      {/* Tech Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.05)_50%),linear-gradient(90deg,rgba(0,255,0,0.01),rgba(0,255,0,0.02))] bg-[length:100%_4px,4px_100%]" />
    </motion.div>
  );
};

export default SplashScreen;