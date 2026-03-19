/**
 * AgroVision AssistantPage - Enterprise High-Tech HUD
 * Optimized for immersive AI interaction with deep-space emerald aesthetics.
 */

import React from 'react';
import AIChat from '../components/AIChat';

const AssistantPage = () => {
  return (
    <div className="min-h-screen bg-[#020d08] relative overflow-hidden selection:bg-emerald-500/30 font-sans">
      
      {/* --- PREMIUM VISUAL ARCHITECTURE --- */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Dynamic Mesh Gradients for Depth */}
        <div className="absolute top-[-5%] left-[-10%] w-[60%] h-[60%] bg-emerald-900/10 blur-[140px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-5%] right-[-10%] w-[50%] h-[50%] bg-green-900/5 blur-[120px] rounded-full" />
        
        {/* HUD Scanning Line Effect */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] brightness-150" />
        
        {/* Technical Grid Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{ 
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`, 
            backgroundSize: '50px 50px' 
          }} 
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12 md:py-20">
        
        {/* --- DYNAMIC HEADER SYSTEM --- */}
        <header className="mb-12 text-center md:text-left">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-emerald-500/5 border border-emerald-500/20 mb-6 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-emerald-400/80">
              Neural Core: Synchronized
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white uppercase mb-6 leading-none">
            AGRO <span className="text-transparent bg-clip-text bg-gradient-to-br from-emerald-400 via-emerald-500 to-green-700">ASSISTANT</span>
          </h1>
          
          <p className="text-gray-400 text-sm md:text-lg max-w-2xl leading-relaxed font-medium opacity-80">
            Deploying high-latency Llama-3 reasoning to diagnose crop phenotypes, 
            prescribe precision protocols, and optimize yield architecture.
          </p>
        </header>

        {/* --- MAIN INTERFACE: THE COMMAND CENTER --- */}
        <main className="relative group transition-transform duration-700 hover:scale-[1.005]">
          {/* External Ambient Glow */}
          <div className="absolute -inset-1.5 bg-gradient-to-r from-emerald-500/20 to-transparent rounded-[2.6rem] blur-2xl opacity-20 group-hover:opacity-40 transition duration-1000"></div>
          
          {/* Glassmorphic Shell */}
          <div className="relative bg-[#05120b]/80 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden min-h-[650px] flex flex-col">
            
            {/* HUD Title Bar & Diagnostic Data */}
            <div className="flex items-center justify-between px-10 py-6 border-b border-white/5 bg-white/[0.01]">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-emerald-400/10 border border-emerald-500/30 flex items-center justify-center shadow-inner">
                  <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xs font-black text-white/90 uppercase tracking-[0.25em]">Agro-Neural v3.4.1</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[9px] text-emerald-500/70 font-mono tracking-widest uppercase">Encryption: Active</span>
                    <span className="w-1 h-1 rounded-full bg-white/20"></span>
                    <span className="text-[9px] text-emerald-500/70 font-mono tracking-widest uppercase">Protocol: SSL</span>
                  </div>
                </div>
              </div>
              
              {/* HUD Window Controls (Decorative) */}
              <div className="hidden md:flex gap-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/5 border border-white/10"></div>
                ))}
              </div>
            </div>

            {/* AI CHAT INTERFACE COMPONENT */}
            <div className="flex-1 p-3 md:p-6 bg-transparent">
              <AIChat />
            </div>

          </div>
        </main>

        {/* --- SYSTEM FEEDBACK FOOTER --- */}
        <footer className="mt-10 flex flex-wrap justify-center md:justify-between items-center gap-6 px-4">
          <div className="flex items-center gap-10">
            <div className="space-y-1">
              <p className="text-[9px] text-gray-500 uppercase font-black tracking-[0.2em]">Engine Latency</p>
              <div className="flex items-center gap-2">
                <div className="w-12 h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="w-3/4 h-full bg-emerald-500"></div>
                </div>
                <p className="text-[10px] text-emerald-500 font-mono">14.2ms</p>
              </div>
            </div>
            
            <div className="space-y-1">
              <p className="text-[9px] text-gray-500 uppercase font-black tracking-[0.2em]">Cognition Mode</p>
              <p className="text-[10px] text-white font-mono uppercase tracking-wider">Deep Semantic Search</p>
            </div>
          </div>
          
          <div className="text-center md:text-right group">
            <p className="text-[9px] text-gray-600 uppercase font-black tracking-[0.3em] transition-colors group-hover:text-emerald-500/50">
              Technology for a Greener Earth
            </p>
          </div>
        </footer>

      </div>
    </div>
  );
};

export default AssistantPage;