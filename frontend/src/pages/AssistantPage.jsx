import React from 'react';
import AIChat from '../components/AIChat';

/**
 * @file AssistantPage.jsx
 * @description The Command Center for the AI Assistant. 
 * Featuring a deep-space emerald aesthetic, high-tech HUD elements, and glassmorphism.
 */

const AssistantPage = () => {
  return (
    /* Added bg-[#020d08] and min-h-screen to the absolute wrapper to overwrite any parent white background */
    <div className="min-h-screen bg-[#020d08] relative overflow-hidden selection:bg-emerald-500/30">
      
      {/* --- FUTURISTIC BACKGROUND ELEMENTS --- */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Dynamic Mesh Gradient */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-900/15 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-800/10 blur-[100px] rounded-full" />
        
        {/* Decorative Grid Overlay - Low Opacity */}
        <div className="absolute inset-0 opacity-[0.03]" 
          style={{ 
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`, 
            backgroundSize: '40px 40px' 
          }} 
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        
        {/* --- PAGE HEADER --- */}
        <header className="mb-10 text-center md:text-left">
          <div className="inline-flex items-center gap-3 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4 transition-all hover:bg-emerald-500/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">
              Neural Core Online
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white uppercase mb-4">
            AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">Assistant</span>
          </h1>
          
          <p className="text-gray-400 text-sm md:text-base max-w-2xl leading-relaxed font-medium">
            Deploying advanced agronomic intelligence to diagnose crop health, 
            prescribe treatments, and optimize your harvest yield in real-time.
          </p>
        </header>

        {/* --- CHAT INTERFACE CONTAINER --- */}
        <main className="relative group">
          {/* Outer Neon Glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-emerald-900/20 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
          
          {/* Main Container - Forced dark background to prevent bleed-through */}
          <div className="relative bg-[#05120b] backdrop-blur-2xl border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden min-h-[600px] flex flex-col">
            
            {/* HUD Title Bar */}
            <div className="flex items-center justify-between px-8 py-4 border-b border-white/5 bg-white/[0.02]">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                  <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-sm font-black text-white uppercase tracking-widest">Agro-Neural v3.4</h2>
                  <p className="text-[10px] text-emerald-500 font-mono">ENCRYPTED END-TO-END</p>
                </div>
              </div>
              
              <div className="hidden sm:flex gap-2">
                <div className="w-2 h-2 rounded-full bg-white/10"></div>
                <div className="w-2 h-2 rounded-full bg-white/10"></div>
                <div className="w-2 h-2 rounded-full bg-white/10"></div>
              </div>
            </div>

            {/* The Chat Component Injection */}
            <div className="flex-1 p-2 md:p-4 bg-transparent">
              <AIChat />
            </div>

          </div>
        </main>

        {/* --- FOOTER FEED --- */}
        <footer className="mt-8 flex flex-wrap justify-center md:justify-between gap-4 px-4">
          <div className="flex items-center gap-6">
            <div className="text-center md:text-left">
              <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Response Latency</p>
              <p className="text-xs text-emerald-500 font-mono">14ms</p>
            </div>
            <div className="text-center md:text-left">
              <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Processing Mode</p>
              <p className="text-xs text-white font-mono uppercase">Deep Search</p>
            </div>
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest italic">
              "Technology for the Earth"
            </p>
          </div>
        </footer>

      </div>
    </div>
  );
};

export default AssistantPage;