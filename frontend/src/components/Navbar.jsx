import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageToggle from './LanguageToggle';

/**
 * @component AgroVisionLogo
 * @description Premium Brand Mark combining Agriculture and Neural Intelligence.
 */
const AgroVisionLogo = () => (
  <div className="relative group flex items-center gap-3">
    <div className="relative">
      {/* Dynamic Glow Layer */}
      <div className="absolute inset-0 bg-emerald-500 blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-700" />
      
      {/* Brand Shield */}
      <div className="relative w-11 h-11 bg-gradient-to-br from-[#041d13] to-[#0a4d32] border border-emerald-500/30 rounded-2xl flex items-center justify-center shadow-2xl transform group-hover:rotate-[-5deg] group-hover:scale-105 transition-all duration-500 ease-out overflow-hidden">
        {/* Animated Grid Background */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:6px_6px]" />

        {/* Neural Leaf SVG */}
        <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 relative z-10" xmlns="http://www.w3.org/2000/svg">
          <path 
            d="M12 2L4.5 9C4.5 9 3 13 5 17C7 21 12 22 12 22C12 22 17 21 19 17C21 13 19.5 9 19.5 9L12 2Z" 
            className="stroke-emerald-400 fill-emerald-500/10" 
            strokeWidth="1.5" 
            strokeLinejoin="round"
          />
          <path 
            d="M12 22V7M12 7L16 4M12 12L8 9M12 17L17 14" 
            className="stroke-emerald-400" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            style={{ strokeDasharray: '20', strokeDashoffset: '20', animation: 'draw 3s infinite ease-in-out' }}
          />
        </svg>

        {/* Shimmer Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      </div>
    </div>

    {/* Typography Lockup */}
    <div className="flex flex-col leading-none">
      <span className="text-xl font-black tracking-tighter text-white">
        AGRO<span className="text-emerald-500">VISION</span>
      </span>
      <span className="text-[9px] font-bold text-emerald-500/60 tracking-[0.3em] uppercase mt-1">
        Precision AI
      </span>
    </div>
  </div>
);

const Navbar = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/scan', label: 'Scan Crop' },
    { path: '/history', label: 'History' },
    { path: '/assistant', label: 'AI Assistant' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] px-4 sm:px-6 lg:px-12 pt-4 pointer-events-none">
      <nav 
        className={`mx-auto max-w-7xl transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] rounded-[2.5rem] pointer-events-auto ${
          isScrolled 
            ? 'bg-[#041d13]/90 backdrop-blur-3xl py-3 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.4)] border border-white/10 -translate-y-1' 
            : 'bg-[#041d13]/40 backdrop-blur-md py-5 border border-white/5'
        } text-white`}
      >
        <div className="px-6 lg:px-10">
          <div className="flex justify-between items-center h-12">
            
            {/* Logo Link */}
            <Link to="/" className="active:scale-95 transition-transform duration-300">
              <AgroVisionLogo />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center bg-black/20 backdrop-blur-xl rounded-[2rem] p-1.5 border border-white/10">
              {navItems.map(item => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-7 py-2.5 rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.15em] transition-all duration-500 relative group/nav ${
                      isActive ? 'text-white' : 'text-white/70 hover:text-white'
                    }`}
                  >
                    {isActive && (
                      <div className="absolute inset-0 bg-emerald-500 rounded-[1.5rem] shadow-[0_8px_20px_rgba(16,185,129,0.3)] animate-nav-in" />
                    )}
                    <span className="relative z-10">{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-3">
              <div className="hidden sm:flex items-center">
                <div className="h-6 w-[1px] bg-white/10 mx-6" />
                <LanguageToggle />
              </div>
              
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle Menu"
                className="md:hidden w-12 h-12 flex flex-col items-center justify-center rounded-2xl bg-white/10 border border-white/20 text-white transition-all active:scale-90"
              >
                <div className="w-6 h-5 relative flex flex-col justify-between overflow-hidden">
                  <span className={`w-full h-[2px] bg-white rounded-full transition-all duration-500 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                  <span className={`w-full h-[2px] bg-white rounded-full transition-all duration-500 ${isMobileMenuOpen ? '-translate-x-full opacity-0' : ''}`}></span>
                  <span className={`w-full h-[2px] bg-white rounded-full transition-all duration-500 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div 
          className={`md:hidden overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${
            isMobileMenuOpen ? 'max-h-[30rem] opacity-100 mt-4' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="px-6 pb-8 pt-4 space-y-3 bg-[#041d13]/95 backdrop-blur-2xl rounded-b-[2rem]">
            {navItems.map((item, idx) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{ transitionDelay: `${idx * 50}ms` }}
                  className={`block px-6 py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all ${
                    isActive 
                      ? 'bg-emerald-500 text-white shadow-xl translate-x-2' 
                      : 'bg-white/5 text-white/80 hover:text-white hover:translate-x-1'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <div className="pt-6 mt-4 border-t border-white/10 flex justify-between items-center px-2">
              <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Region</span>
              <LanguageToggle />
            </div>
          </div>
        </div>
      </nav>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes draw {
          from { stroke-dashoffset: 20; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes nav-in {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-nav-in { animation: nav-in 0.3s cubic-bezier(0.23, 1, 0.32, 1) forwards; }
      `}} />
    </header>
  );
};

export default Navbar;