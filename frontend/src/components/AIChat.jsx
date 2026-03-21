/**
 * @file AIChat.jsx
 * @description "Kisan Premium" Edition. 
 * A clean, grounded UI using Earth tones (Forest Green & Warm Creams).
 * Optimized for readability, simplicity, and agricultural branding.
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { askAssistant } from '../services/api';
import VoiceAssistant from './VoiceAssistant';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { FiSend, FiVolume2, FiVolumeX, FiChevronDown, FiAlertCircle } from 'react-icons/fi';

const AIChat = () => {
  const { lang } = useLanguage();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const synth = window.speechSynthesis;

  const messagesContainerRef = useRef(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  // --- Auto-scroll Logic ---
  const scrollToBottom = useCallback((behavior = 'smooth') => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior
      });
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0 || isLoading) {
      setTimeout(() => scrollToBottom('smooth'), 50);
    }
  }, [messages, isLoading, scrollToBottom]);

  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      setShowScrollButton(scrollHeight - scrollTop - clientHeight > 200);
    }
  };

  // --- TTS Handling ---
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
    synth.speak(utterance);
  };

  // --- API Interaction ---
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const now = new Date();
    // Detail Date & Time: e.g., "Oct 24, 10:30 AM"
    const fullTimestamp = now.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ', ' + 
                          now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userMessage = { 
      text: input, 
      sender: 'user',
      timestamp: fullTimestamp
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      const data = await askAssistant(currentInput, lang);
      setMessages(prev => [...prev, {
        text: data.response || data.answer || "Kshama karein, main abhi iska uttar nahi dhoond pa raha hoon.",
        sender: 'bot',
        timestamp: new Date().toLocaleDateString([], { month: 'short', day: 'numeric' }) + ', ' + 
                   new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: data.sources || []
      }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        text: '### Sampark Mein Samasya (Connection Issue)\nKhet se server tak signal thoda kamzor hai. Kripya ek baar fir koshish karein.',
        sender: 'bot',
        timestamp: fullTimestamp,
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
    <div className="flex flex-col h-screen w-full max-w-5xl mx-auto bg-[#FCFBF7] dark:bg-[#0C0D0A] transition-colors duration-500">
      
      {/* KISAN HEADER */}
      <div className="px-6 py-4 flex items-center justify-between border-b border-gray-200/60 dark:border-white/5 bg-white/50 dark:bg-black/20 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white shadow-lg">
            <span className="text-xl font-serif">A</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-800 dark:text-gray-100 leading-tight">AgroVision Sahayak</h1>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-widest">Aapka Digital Mitra</p>
          </div>
        </div>
      </div>

      {/* CHAT VIEWPORT */}
      <div 
        ref={messagesContainerRef} 
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 md:px-16 py-10 space-y-12 scrollbar-hide"
      >
        <AnimatePresence initial={false}>
          {messages.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="h-full flex flex-col items-center justify-center text-center py-20"
            >
              <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mb-6">
                <span className="text-4xl text-emerald-600">🌱</span>
              </div>
              <h2 className="text-3xl font-serif text-gray-800 dark:text-gray-100 mb-2">Ram Ram, Kisan Bhai!</h2>
              <p className="text-gray-500 dark:text-gray-400 max-w-sm">Aaj main aapki kheti ya fasal ke bare mein kaise madad kar sakta hoon?</p>
            </motion.div>
          )}

          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex flex-col ${message.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              {/* DATE & TIME STAMP HEADER */}
              <span className="text-[10px] font-bold text-gray-400 dark:text-gray-600 mb-2 uppercase tracking-tighter">
                {message.timestamp}
              </span>

              <div className={`flex gap-4 max-w-[90%] md:max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-sm shadow-md ${
                  message.sender === 'user' ? 'bg-[#1B4332] text-white' : 'bg-white dark:bg-[#1A1C14] border border-gray-200 dark:border-white/10 text-emerald-600'
                }`}>
                  {message.sender === 'user' ? 'M' : 'AV'}
                </div>

                <div className={`relative px-6 py-4 rounded-[1.5rem] shadow-sm transition-all ${
                  message.sender === 'user' 
                    ? 'bg-[#1B4332] text-white rounded-tr-none' 
                    : 'bg-white dark:bg-[#1A1C14] text-gray-800 dark:text-gray-200 border border-gray-200/50 dark:border-white/5 rounded-tl-none'
                } ${message.error ? 'border-red-300 bg-red-50 text-red-900 shadow-red-100' : ''}`}>
                  
                  {message.error && <FiAlertCircle className="absolute -top-2 -right-2 text-red-500 bg-white rounded-full text-lg" />}

                  <div className="prose dark:prose-invert prose-sm max-w-none leading-relaxed">
                    <ReactMarkdown>{message.text}</ReactMarkdown>
                  </div>

                  {message.sender === 'bot' && !message.error && (
                    <button 
                      onClick={() => toggleSpeech(message.text)}
                      className="mt-4 flex items-center gap-2 text-[10px] font-black text-emerald-600 hover:text-emerald-700 uppercase tracking-widest bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-full"
                    >
                      {isSpeaking ? <><FiVolumeX /> Stop Audio</> : <><FiVolume2 /> Suniye (Listen)</>}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <div className="flex gap-4 items-center">
            <div className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-white/5 animate-pulse" />
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce"></span>
            </div>
          </div>
        )}
      </div>

      {/* INPUT AREA */}
      <div className="p-6 bg-white/80 dark:bg-black/40 backdrop-blur-xl border-t border-gray-200 dark:border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="relative flex items-center bg-[#F1F3EE] dark:bg-[#151712] rounded-3xl border border-gray-200/50 dark:border-white/5 px-3 py-2 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all shadow-inner">
            
            {/* Removed Plus Icon as requested */}

            <textarea
              rows="1"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Yahan apna sawal likhein..."
              className="flex-1 bg-transparent border-none focus:ring-0 text-gray-800 dark:text-gray-100 py-3 px-3 text-base resize-none placeholder-gray-400 font-medium"
              style={{ maxHeight: '180px' }}
            />

            <div className="flex items-center gap-2">
              <VoiceAssistant onTranscript={(t) => setInput(t)} />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                  input.trim() && !isLoading 
                  ? 'bg-emerald-600 text-white shadow-lg hover:bg-emerald-700 scale-100' 
                  : 'bg-gray-300 dark:bg-gray-800 text-gray-500 cursor-not-allowed scale-95 opacity-50'
                }`}
              >
                <FiSend className="text-xl" />
              </button>
            </div>
          </div>
          <p className="text-[10px] text-center text-gray-400 mt-4 font-medium uppercase tracking-[0.1em]">
            AgroVision: Aapki Fasal, Hamara Vishwas
          </p>
        </div>
      </div>

      {/* SCROLL BUTTON */}
      <AnimatePresence>
        {showScrollButton && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0 }}
            onClick={() => scrollToBottom()}
            className="fixed bottom-36 right-8 p-3 bg-white dark:bg-[#1A1C14] text-emerald-600 shadow-xl rounded-full border border-gray-200 dark:border-white/10 z-20"
          >
            <FiChevronDown />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIChat;