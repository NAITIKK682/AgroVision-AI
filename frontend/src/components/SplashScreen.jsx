import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

const SplashScreen = ({ onFinished }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinished();
    }, 5000); 
    return () => clearTimeout(timer);
  }, [onFinished]);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 w-screen h-screen bg-[#020d08] z-[999] flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Container for Centered Small Video */}
      <div className="relative w-full flex items-center justify-center px-6">
        <video 
          src="/splash-video.mp4" 
          autoPlay 
          muted 
          playsInline 
          onEnded={onFinished}
          // Mobile par 280px aur Desktop par 500px size rakha hai
          className="w-[280px] md:w-[500px] h-auto object-contain pointer-events-none"
        />
      </div>

      {/* Skip Button - Thoda niche move kiya hai */}
      <motion.button 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        whileHover={{ opacity: 1, scale: 1.05 }}
        onClick={onFinished}
        className="absolute bottom-16 px-6 py-2 border border-emerald-500/30 rounded-full text-emerald-500 text-[10px] font-mono tracking-widest uppercase bg-black/40 backdrop-blur-md"
      >
        Skip Intro
      </motion.button>
    </motion.div>
  );
};

export default SplashScreen;