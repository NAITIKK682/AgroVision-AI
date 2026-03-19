import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { voiceService } from '../services/voiceService';

/**
 * @file VoiceAssistant.jsx
 * @description Enhanced voice interface with a futuristic neon visualizer.
 * Integrates haptic-like animations and glassmorphism to match the AI Dashboard theme.
 */

const VoiceAssistant = ({ onTranscript, onListeningStart, onListeningEnd }) => {
  const { lang } = useLanguage();
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    return () => {
      if (isListening) {
        voiceService.stopListening();
      }
    };
  }, [isListening]);

  const toggleListening = () => {
    if (!voiceService.isSpeechSupported()) {
      setError('Voice input not supported on this device');
      return;
    }

    if (isListening) {
      voiceService.stopListening();
      setIsListening(false);
      if (onListeningEnd) onListeningEnd();
    } else {
      setError(null);
      setIsListening(true);
      if (onListeningStart) onListeningStart();

      voiceService.startListening(
        (transcript) => {
          setIsListening(false);
          if (onListeningEnd) onListeningEnd();
          if (onTranscript) onTranscript(transcript);
        },
        (err) => {
          console.error('Voice recognition error:', err);
          setIsListening(false);
          setError(err.message || 'Link Failure');
          if (onListeningEnd) onListeningEnd();
        },
        lang === 'hi' ? 'hi-IN' : 'en-IN'
      );
    }
  };

  if (!voiceService.isSpeechSupported()) {
    return null;
  }

  return (
    <div className="relative flex items-center justify-center">
      {/* --- NEON VISUALIZER RINGS (Active Only) --- */}
      {isListening && (
        <div className="absolute flex items-center justify-center pointer-events-none">
          <div className="absolute w-12 h-12 border border-emerald-500 rounded-full animate-ping opacity-20"></div>
          <div className="absolute w-16 h-16 border border-emerald-400 rounded-full animate-ping opacity-10 delay-150"></div>
          
          {/* Audio Waveform Simulation */}
          <div className="flex gap-1 items-center justify-center h-4 w-12 mb-16">
            {[...Array(4)].map((_, i) => (
              <div 
                key={i} 
                className={`w-1 bg-emerald-400 rounded-full animate-[bounce_1s_infinite]`}
                style={{ animationDelay: `${i * 0.1}s`, height: `${Math.random() * 100 + 40}%` }}
              />
            ))}
          </div>
        </div>
      )}

      {/* --- MAIN INTERFACE BUTTON --- */}
      <button
        onClick={toggleListening}
        className={`relative z-10 p-3 rounded-xl transition-all duration-500 group overflow-hidden ${
          isListening
            ? 'bg-emerald-500 text-black shadow-[0_0_25px_rgba(16,185,129,0.6)] scale-110'
            : 'bg-white/5 border border-white/10 text-emerald-500 hover:bg-white/10 hover:border-emerald-500/40'
        }`}
        title={isListening ? 'End Transmission' : 'Initiate Voice Command'}
        aria-label={isListening ? 'Stop listening' : 'Start voice input'}
      >
        {/* Glow Shimmer Effect */}
        <div className={`absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
        
        <div className="relative">
          {isListening ? (
            <svg className="w-6 h-6 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          )}
        </div>
      </button>

      {/* --- ERROR HUD --- */}
      {error && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-48 text-center animate-in fade-in slide-in-from-bottom-2">
          <div className="bg-red-500/10 border border-red-500/40 backdrop-blur-md text-red-400 text-[10px] font-black uppercase tracking-widest p-2 rounded-lg shadow-2xl">
            {error}
          </div>
          <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-red-500/40 mx-auto"></div>
        </div>
      )}
    </div>
  );
};

export default VoiceAssistant;