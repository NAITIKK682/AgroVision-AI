import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import WeatherCard from '../components/WeatherCard';

/**
 * @description Premium SVG Icon Set with native Framer-like animation properties
 */
const Icons = {
  CropDetection: () => (
    <svg className="w-14 h-14 text-emerald-500 transform transition-transform group-hover:rotate-12 duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M9 12l2 2 4-4m-6-4h.01M15 16h.01" />
      <circle cx="12" cy="12" r="9" strokeOpacity="0.2" />
    </svg>
  ),
  AIAssistant: () => (
    <div className="relative group-hover:scale-110 transition-transform duration-500">
      <svg className="w-14 h-14 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
      <div className="flex space-x-1 absolute -bottom-2 left-1/2 -translate-x-1/2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="w-1.5 h-4 bg-emerald-400/40 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
        ))}
      </div>
    </div>
  ),
  Weather: () => (
    <svg className="w-14 h-14 text-amber-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
    </svg>
  ),
  Offline: () => (
    <svg className="w-14 h-14 text-gray-400 group-hover:text-emerald-400 transition-colors duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.828-2.828" />
    </svg>
  )
};

const LandingPage = () => {
  const { t } = useLanguage();
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    // Force body background to match to eliminate any white flash/gaps
    document.body.style.backgroundColor = "#041d13";
    
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(window.scrollY / (totalScroll || 1));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.body.style.backgroundColor = ""; // Clean up
    };
  }, []);

  const features = [
    {
      icon: <Icons.CropDetection />,
      title: 'Precision Disease Detection',
      description: 'Harnessing Convolutional Neural Networks to identify 38+ crop-specific pathogens with production-grade accuracy.',
      featured: true,
      tag: 'Core Engine'
    },
    {
      icon: <Icons.AIAssistant />,
      title: 'Multilingual Assistant',
      description: 'Real-time agronomy support powered by LLMs, optimized for regional dialects and low-latency voice response.',
      tag: 'AI Support'
    },
    {
      icon: <Icons.Weather />,
      title: 'Hyper-Local Intel',
      description: 'Predictive analytics mapping environmental stressors to potential disease outbreaks before they occur.',
      tag: 'Predictive'
    },
    {
      icon: <Icons.Offline />,
      title: 'Edge Computing',
      description: 'Resilient architecture designed for zero-connectivity environments through advanced client-side caching.',
      tag: 'Resilience'
    },
  ];

  return (
    <div className="bg-[#041d13] selection:bg-emerald-500 selection:text-white font-sans antialiased overflow-x-hidden">
      
      {/* Hero Section: Enterprise Impact */}
      {/* Negative margin-top added to pull section up under the navbar */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-[#041d13] -mt-20 pt-20">
        {/* Generative Background Pattern */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="grass-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="1" />
              </linearGradient>
            </defs>
            {[...Array(25)].map((_, i) => (
              <path
                key={i}
                d={`M${i * 4} 100 Q${i * 4 + 2} 70 ${i * 4} 40`}
                stroke="url(#grass-grad)"
                strokeWidth="0.2"
                fill="none"
                className="animate-sway"
                style={{ animationDelay: `${i * 0.15}s`, transformOrigin: 'bottom' }}
              />
            ))}
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="text-left py-12">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-8 animate-fade-in">
                <span className="relative flex h-2 w-2 mr-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                The Future of Agri-Intelligence
              </div>
              <h1 className="text-6xl md:text-8xl font-black text-white tracking-tight mb-8 leading-[0.9] lg:max-w-xl">
                {t('welcome')} <span className="text-emerald-500 italic">AgroVision.</span>
              </h1>
              <p className="text-xl text-emerald-50/60 mb-10 max-w-lg leading-relaxed font-medium">
                Empowering the global food supply chain with world-class AI detection. Protect your harvest, maximize your yield, and secure your legacy.
              </p>
              <div className="flex flex-wrap gap-6">
                <Link 
                  to="/scan" 
                  className="group relative inline-flex items-center justify-center px-10 py-5 font-black text-white transition-all duration-500 bg-emerald-600 rounded-2xl hover:bg-emerald-500 shadow-[0_20px_40px_rgba(16,185,129,0.25)] hover:-translate-y-1 overflow-hidden"
                >
                  <span className="relative z-10 uppercase tracking-widest text-sm">{t('scan_crop').replace(/[\[\]()]/g, '')}</span>
                  <svg className="w-5 h-5 ml-3 relative z-10 transition-transform group-hover:translate-x-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </Link>
                <a 
                  href="/video/demo.mp4" 
                  className="px-10 py-5 text-emerald-100 font-bold border-2 border-emerald-500/30 rounded-2xl hover:bg-emerald-500/10 transition-colors uppercase tracking-widest text-sm flex items-center"
                >
                  Watch Demo
                </a>
              </div>
            </div>

            {/* Parallax Product Teaser */}
            <div className="relative hidden lg:block perspective-2000">
              <div 
                className="relative bg-gradient-to-br from-white/10 to-transparent backdrop-blur-3xl border border-white/10 rounded-[4rem] p-2 shadow-2xl transition-transform duration-700 ease-out"
                style={{ transform: `translateY(${scrollProgress * -40}px) rotateX(10deg) rotateY(-10deg)` }}
              >
                <div className="bg-[#020d08] aspect-[4/5] rounded-[3.8rem] flex flex-col items-center justify-center relative overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=1200" 
                    alt="Neural Network Vision" 
                    className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-luminosity scale-110 group-hover:scale-100 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#041d13] via-transparent to-transparent" />
                  
                  <div className="relative z-10 text-center">
                    <div className="space-y-4">
                      <div className="h-1.5 w-48 bg-white/10 rounded-full mx-auto overflow-hidden border border-white/5">
                        <div className="h-full bg-emerald-500 animate-loading-bar shadow-[0_0_15px_rgba(16,185,129,0.8)]" />
                      </div>
                      <p className="text-emerald-400 font-mono text-[10px] tracking-[0.3em] uppercase animate-pulse">Scanning Bio-Vitality</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features: Bento Grid 2.0 */}
      <section className="py-32 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-5xl md:text-7xl font-black text-[#041d13] tracking-tighter mb-6 leading-[0.9]">
                Precision Tech. <br/><span className="text-gray-300">Farmer Driven.</span>
              </h2>
              <p className="text-gray-500 text-xl font-medium max-w-md">Every tool you need to transition from traditional farming to data-driven agriculture.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className={`group relative p-12 rounded-[3.5rem] transition-all duration-700 hover:-translate-y-3 overflow-hidden
                  ${feature.featured ? 'md:col-span-2 bg-[#041d13] text-white shadow-2xl shadow-emerald-900/20' : 'bg-gray-50 text-[#041d13] border border-gray-100'}`}
              >
                <div className="relative z-10">
                  <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-12 
                    ${feature.featured ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-200 text-gray-500'}`}>
                    {feature.tag}
                  </span>
                  <div className="mb-8">{feature.icon}</div>
                  <h3 className="text-3xl font-black mb-6 tracking-tight group-hover:text-emerald-500 transition-colors">{feature.title}</h3>
                  <p className={`${feature.featured ? 'text-emerald-50/50' : 'text-gray-500'} text-lg leading-relaxed font-medium`}>
                    {feature.description}
                  </p>
                </div>
                {feature.featured && (
                  <div className="absolute bottom-[-10%] right-[-10%] opacity-10 group-hover:opacity-20 transition-opacity duration-700 group-hover:scale-125">
                    <Icons.CropDetection />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits & Intelligence */}
      <section className="py-32 bg-gray-50 border-y border-gray-100 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-32 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-5xl font-black text-[#041d13] mb-12 tracking-tighter">Cultivating Success at Scale.</h2>
              <div className="space-y-8">
                {[
                  { t: 'Loss Mitigation', d: 'Identify pathogenic threats before they spread through the entire field.' },
                  { t: 'Strategic Treatment', d: 'Curated organic and sustainable chemical recommendations.' },
                  { t: 'Asset Optimization', d: 'Reduce operational costs by applying targeted treatments only where needed.' }
                ].map((benefit, index) => (
                  <div key={index} className="flex gap-6 group">
                    <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-white shadow-xl flex items-center justify-center group-hover:bg-emerald-500 transition-all duration-500">
                      <svg className="w-6 h-6 text-emerald-600 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-[#041d13] mb-1">{benefit.t}</h4>
                      <p className="text-gray-500 font-medium">{benefit.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="relative group">
                <div className="absolute -inset-10 bg-emerald-500/10 blur-[120px] rounded-full group-hover:bg-emerald-500/20 transition-all duration-700" />
                <div className="relative transform hover:scale-[1.03] hover:-rotate-1 transition-all duration-700">
                  <WeatherCard className="shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] rounded-[3rem] overflow-hidden" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-32 bg-white text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-5xl font-black text-[#041d13] mb-24 tracking-tighter italic underline decoration-emerald-500 decoration-8 underline-offset-8">Capture. Analyze. Heal.</h2>
          <div className="grid md:grid-cols-3 gap-20 relative">
             <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gray-100 -z-10" />
            {[
              { step: '01', title: 'Macro Capture', desc: 'Snap a high-resolution photo of the affected foliage using our built-in scanner.' },
              { step: '02', title: 'Neural Analysis', desc: 'Our proprietary model cross-references 50,000+ datasets for instant diagnosis.' },
              { step: '03', title: 'Actionable Plan', desc: 'Download a localized PDF report with precision recovery steps.' }
            ].map((item, i) => (
              <div key={i} className="group">
                <div className="w-24 h-24 bg-white border-8 border-gray-50 text-emerald-600 font-black text-3xl rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-2xl group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500 transform group-hover:-rotate-12">
                  {item.step}
                </div>
                <h3 className="text-2xl font-black text-[#041d13] mb-4 tracking-tight">{item.title}</h3>
                <p className="text-gray-500 font-medium px-8 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* High-Impact CTA Section */}
      <section className="py-40 relative overflow-hidden bg-[#041d13]">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/30 via-transparent to-transparent" />
        <div className="absolute top-0 right-0 w-[50rem] h-[50rem] bg-emerald-500/5 rounded-full blur-[150px] translate-x-1/2 -translate-y-1/2" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-6xl md:text-8xl font-black text-white mb-12 tracking-tighter leading-[0.85]">
            Ready to <span className="text-emerald-500 uppercase">Revolutionize</span> <br/>Your Harvest?
          </h2>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link 
              to="/scan" 
              className="group inline-flex items-center justify-center px-16 py-8 text-xl font-black bg-emerald-500 text-white rounded-[2rem] hover:bg-emerald-400 hover:scale-105 transition-all duration-500 shadow-[0_25px_60px_rgba(16,185,129,0.4)]"
            >
              INITIALIZE FIRST SCAN
              <svg className="w-6 h-6 ml-4 transition-transform group-hover:translate-x-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes sway {
          0%, 100% { transform: rotate(-4deg); }
          50% { transform: rotate(4deg); }
        }
        @keyframes loading-bar {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0); }
          100% { transform: translateX(100%); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        .animate-sway { animation: sway 6s ease-in-out infinite; }
        .animate-loading-bar { animation: loading-bar 3s cubic-bezier(0.85, 0, 0.15, 1) infinite; }
        .animate-float { animation: float 5s ease-in-out infinite; }
        .perspective-2000 { perspective: 2000px; }
      `}} />
    </div>
  );
};

export default LandingPage;