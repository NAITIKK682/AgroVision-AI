/**
 * @file AIChat.jsx
 * @description Groq-optimized interface with markdown support, local time, and TTS.
 * Updated to fix raw markdown symbol visibility issues.
 */

import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { askAssistant } from '../services/api';
import VoiceAssistant from './VoiceAssistant';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

const AIChat = () => {
  const { lang } = useLanguage();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef(null);
  const synth = window.speechSynthesis;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Clean up voice if user leaves page
  useEffect(() => {
    return () => synth.cancel();
  }, []);

  /**
   * Text-to-Speech Toggle
   * Isme stop aur start dono functionality hai.
   */
  const toggleSpeech = (text) => {
    if (synth.speaking) {
      synth.cancel();
      if (isSpeaking) {
        setIsSpeaking(false);
        return;
      }
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-US';
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synth.speak(utterance);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    // Local time formatting for UI
    const now = new Date();
    const currentTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userMessage = { 
      text: input, 
      sender: 'user',
      timestamp: currentTime
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      const data = await askAssistant(currentInput, lang);
      
      const botMessage = {
        // Backend key check
        text: data.response || data.answer || "No response received from Groq.",
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: data.sources || []
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      setMessages(prev => [...prev, {
        text: 'System Error: Neural link interrupted. Please try again.',
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        error: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[75vh] w-full max-w-5xl mx-auto overflow-hidden bg-[#050505] rounded-3xl border border-white/10 shadow-2xl">
      
      {/* MESSAGES VIEWPORT */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-6 scrollbar-hide">
        <AnimatePresence initial={false}>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`group relative max-w-[85%] md:max-w-[75%] rounded-2xl px-5 py-4 ${
                  message.sender === 'user'
                    ? 'bg-emerald-600 text-white rounded-tr-none'
                    : 'bg-[#121212] border border-white/10 text-gray-100 rounded-tl-none shadow-xl'
                } ${message.error ? 'border-red-500/50 text-red-400' : ''}`}
              >
                {/* Fixed: Wrapped message.text in ReactMarkdown to hide symbols like # and ** */}
                <div className="text-sm md:text-[15px] leading-relaxed font-sans prose prose-invert max-w-none">
                  <ReactMarkdown>{message.text}</ReactMarkdown>
                </div>
                
                {/* Text to Speech Button for Bot */}
                {message.sender === 'bot' && !message.error && (
                  <button
                    onClick={() => toggleSpeech(message.text)}
                    className="mt-3 flex items-center gap-2 text-[10px] uppercase font-bold text-emerald-400 hover:text-emerald-300 transition-all bg-emerald-400/5 px-2 py-1 rounded-md"
                  >
                    {isSpeaking ? (
                      <><span className="w-2 h-2 bg-red-500 animate-pulse rounded-full" /> STOP VOICE</>
                    ) : (
                      <><span className="opacity-70">🔊</span> READ ALOUD</>
                    )}
                  </button>
                )}
                
                {/* Sources Display */}
                {message.sources && message.sources.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-white/5 text-[9px]">
                    <p className="font-bold text-emerald-500 uppercase mb-2">Verified Sources:</p>
                    <div className="flex flex-wrap gap-2">
                      {message.sources.map((source, i) => (
                        <span key={i} className="bg-white/5 px-2 py-0.5 rounded border border-white/10">{source}</span>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className={`mt-2 text-[9px] font-mono opacity-40 ${message.sender === 'user' ? 'text-left' : 'text-right'}`}>
                  {message.timestamp}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-3 animate-pulse">
                <span className="text-[10px] font-mono text-emerald-500 uppercase tracking-widest">Groq Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT AREA */}
      <div className="p-4 md:p-6 bg-[#0a0a0a]/80 backdrop-blur-md">
        <div className="relative flex items-center gap-3 bg-white/5 border border-white/10 p-2 rounded-2xl shadow-inner focus-within:border-emerald-500/50 transition-all">
          <div className="pl-2">
            <VoiceAssistant onTranscript={(t) => setInput(t)} />
          </div>
          <textarea
            rows="1"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask AgroVision anything..."
            className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-gray-600 text-sm py-3 resize-none"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
              isLoading || !input.trim() ? 'opacity-20 bg-gray-500' : 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChat;