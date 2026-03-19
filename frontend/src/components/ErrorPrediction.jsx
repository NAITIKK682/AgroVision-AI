import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { FiAlertOctagon, FiCheck, FiRefreshCcw } from 'react-icons/fi';

const ErrorPrediction = ({ error, onRetry }) => {
  const { t } = useLanguage();

  const getErrorMessage = () => {
    if (typeof error === 'string') return error;
    if (error && error.message) return error.message;
    return "Analysis Interrupted: Invalid Image Stream";
  };

  return (
    <div className="bg-[#0a0505] border border-red-900/30 rounded-[3rem] p-10 text-center shadow-2xl backdrop-blur-xl relative overflow-hidden h-full flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500">
      
      {/* Decorative Error Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-red-600/5 blur-[80px] rounded-full pointer-events-none" />

      <div className="relative z-10">
        <div className="w-20 h-20 bg-red-500/10 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-red-500/20">
          <FiAlertOctagon className="text-4xl text-red-500 animate-pulse" />
        </div>

        <h3 className="text-2xl font-black text-white mb-3 tracking-tight">System Out of Bounds</h3>
        <p className="text-red-400/60 font-medium mb-10 max-w-sm mx-auto leading-relaxed">
          {getErrorMessage()}
        </p>
        
        <div className="bg-black/40 rounded-3xl p-8 border border-white/5 mb-10 inline-block text-left w-full max-w-md">
          <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-6">Adjustment Protocol</p>
          <div className="space-y-5">
            {[
              "Input must be a high-resolution leaf sample",
              "Minimize motion blur and optical noise",
              "Calibrate lighting for contrast optimization"
            ].map((text, i) => (
              <div key={i} className="flex items-start gap-4 group">
                <div className="mt-1 w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center group-hover:bg-emerald-500 transition-colors">
                  <FiCheck className="text-xs text-emerald-500 group-hover:text-black" />
                </div>
                <span className="text-zinc-400 text-sm font-medium group-hover:text-zinc-200 transition-colors">{text}</span>
              </div>
            ))}
          </div>
        </div>
        
        <button 
          onClick={onRetry} 
          className="group flex items-center gap-3 bg-white text-black px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-red-500 hover:text-white transition-all shadow-xl active:scale-95"
        >
          <FiRefreshCcw className="group-hover:rotate-180 transition-transform duration-500" />
          Retry Diagnostic
        </button>
      </div>
    </div>
  );
};

export default ErrorPrediction;