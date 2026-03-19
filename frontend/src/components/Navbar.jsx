import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageToggle from './LanguageToggle';

/**
 * @component NeuralLeafIcon
 * @description The core animated brand mark. Restored the dash-array drawing animation.
 */
const NeuralLeafIcon = () => (
  <div className="relative w-10 h-10 flex items-center justify-center">
    {/* Background Glow Layer */}
    <div className="absolute inset-0 bg-emerald-500/20 blur-lg rounded-full animate-pulse" />
    
    <div className="relative w-full h-full bg-gradient-to-br from-[#041d13] to-[#0a4d32] border border-emerald-500/30 rounded-xl flex items-center justify-center shadow-2xl overflow-hidden group-hover:border-emerald-400/50 transition-colors duration-500">
      {/* Micro-grid Overlay */}
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:4px_4px]" />

      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 relative z-10" xmlns="http://www.w3.org/2000/svg">
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
          style={{ 
            strokeDasharray: '20', 
            strokeDashoffset: '20', 
            animation: 'drawLeaf 3s infinite ease-in-out' 
          }}
        />
      </svg>

      {/* Interactive Shimmer */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
    </div>
  </div>
);

/**
 * @component AgroVisionLogo
 * @description Typography and Icon combined with hover states.
 */
const AgroVisionLogo = () => (
  <div className="relative group flex items-center gap-3">
    <NeuralLeafIcon />
    <div className="flex flex-col leading-none">
      <span className="text-xl font-black tracking-tighter text-white uppercase">
        Agro<span className="text-emerald-500">Vision</span>
      </span>
      <span className="text-[8px] font-bold text-emerald-500/50 tracking-[0.4em] uppercase mt-1">
        Precision Intelligence
      </span>
    </div>
  </div>
);

/**
 * @main Navbar
 * @description High-performance navigation with zero top-gap and slim geometry.
 */
const Navbar = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeHover, setActiveHover] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = useMemo(() => [
    { path: '/', label: 'Home', id: 'home' },
    { path: '/scan', label: 'Scan Crop', id: 'scan' },
    { path: '/history', label: 'Dashboard', id: 'history' },
    { path: '/assistant', label: 'AI Expert', id: 'assistant' },
  ], []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <>
      {/* Header Container: No padding-top to eliminate the black gap */}
      <header className="fixed top-0 left-0 right-0 z-[100] bg-[#041d13]">
        <nav 
          className={`
            relative mx-auto w-full max-w-7xl
            transition-all duration-500 ease-out
            ${isScrolled 
              ? 'bg-[#041d13]/90 backdrop-blur-2xl py-2 shadow-2xl border-b border-white/10' 
              : 'bg-transparent py-4 border-b border-transparent'
            }
          `}
        >
          <div className="px-6 md:px-10">
            <div className="flex justify-between items-center h-12">
              
              <Link to="/" className="active:scale-95 transition-transform duration-300">
                <AgroVisionLogo />
              </Link>

              <div className="hidden lg:flex items-center space-x-1 bg-black/30 backdrop-blur-3xl rounded-full p-1 border border-white/10">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.id}
                      to={item.path}
                      onMouseEnter={() => setActiveHover(item.id)}
                      onMouseLeave={() => setActiveHover(null)}
                      className={`
                        relative px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-500
                        ${isActive ? 'text-white' : 'text-white/60 hover:text-white'}
                      `}
                    >
                      {isActive && (
                        <div className="absolute inset-0 bg-emerald-600 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.4)] animate-nav-slide" />
                      )}
                      
                      {!isActive && activeHover === item.id && (
                        <div className="absolute inset-0 bg-white/5 rounded-full transition-opacity" />
                      )}
                      
                      <span className="relative z-10">{item.label}</span>
                    </Link>
                  );
                })}
              </div>

              <div className="flex items-center space-x-4">
                <div className="hidden sm:flex items-center">
                  <LanguageToggle />
                </div>
                
                {/* Fixed Mobile Toggle - Prevents circular distortion */}
                <button 
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className={`
                    md:hidden w-10 h-10 flex flex-col items-center justify-center rounded-lg
                    bg-white/5 border border-white/10 transition-all
                    ${isMobileMenuOpen ? 'bg-emerald-500/20' : ''}
                  `}
                >
                  <div className="w-5 h-4 relative flex flex-col justify-between items-center">
                    <span className={`w-full h-[2px] bg-white transition-all transform ${isMobileMenuOpen ? 'rotate-45 translate-y-[7px]' : ''}`}></span>
                    <span className={`w-full h-[2px] bg-white transition-all ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
                    <span className={`w-full h-[2px] bg-white transition-all transform ${isMobileMenuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`}></span>
                  </div>
                </button>

                <Link 
                  to="/scan" 
                  className="hidden md:flex px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest transition-all"
                >
                  Quick Scan
                </Link>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          <div className={`md:hidden overflow-hidden transition-all duration-500 ${isMobileMenuOpen ? 'max-h-[400px] border-t border-white/5' : 'max-h-0'}`}>
            <div className="p-6 space-y-3 bg-[#041d13]">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.path}
                  className="block px-6 py-4 rounded-xl text-xs font-black uppercase tracking-widest bg-white/5 text-white"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes drawLeaf {
            0% { stroke-dashoffset: 20; }
            100% { stroke-dashoffset: 0; }
          }
          @keyframes nav-slide {
            from { opacity: 0; transform: scaleX(0.9); }
            to { opacity: 1; transform: scaleX(1); }
          }
          @keyframes shimmer {
            100% { transform: translateX(100%); }
          }
          .animate-shimmer { animation: shimmer 1.5s infinite; }
          .animate-nav-slide { animation: nav-slide 0.3s ease-out forwards; }
        `}} />
      </header>
    </>
  );
};

export default Navbar;