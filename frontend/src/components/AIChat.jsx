import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { askAssistant } from '../services/api';
import VoiceAssistant from './VoiceAssistant';

/**
 * @file AIChat.jsx
 * @description Enhanced AI Messaging interface featuring glassmorphism, 
 * neon emerald accents, and a futuristic terminal-style interaction flow.
 */

const AIChat = () => {
  const { t, lang } = useLanguage();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { 
      text: input, 
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await askAssistant(input, lang);
      
      const botMessage = {
        text: response.answer || response.response,
        sender: 'bot',
        timestamp: new Date().toISOString(),
        sources: response.sources || []
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      console.error('Assistant error:', err);
      setError('Neural link interrupted. Please recalibrate.');
      
      const errorMessage = {
        text: 'System Error: Unable to process request. Please check your connection and try again.',
        sender: 'bot',
        timestamp: new Date().toISOString(),
        error: true
      };

      setMessages(prev => [...prev, errorMessage]);
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

  const handleVoiceInput = (transcript) => {
    setInput(transcript);
    // Auto-send after voice input with a slight UX delay
    setTimeout(() => {
        if(transcript.trim()) handleSend();
    }, 600);
  };

  return (
    <div className="flex flex-col h-[70vh] w-full max-w-5xl mx-auto overflow-hidden">
      
      {/* --- MESSAGES VIEWPORT --- */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-6 scrollbar-thin scrollbar-thumb-emerald-500/20">
        {messages.length === 0 && !isLoading && (
            <div className="h-full flex flex-col items-center justify-center opacity-40 text-center">
                <div className="w-16 h-16 border-2 border-emerald-500/20 rounded-full flex items-center justify-center mb-4">
                    <span className="text-2xl">⚡</span>
                </div>
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-emerald-500">
                    Awaiting Input Command...
                </p>
            </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex animate-in fade-in slide-in-from-bottom-4 duration-500 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`relative group max-w-[85%] md:max-w-[70%] rounded-[1.5rem] px-5 py-4 transition-all duration-300 ${
                message.sender === 'user'
                  ? 'bg-emerald-600 text-white shadow-[0_10px_30px_-10px_rgba(16,185,129,0.4)] rounded-tr-none'
                  : message.error
                  ? 'bg-red-500/10 border border-red-500/30 text-red-400 rounded-tl-none'
                  : 'bg-white/5 backdrop-blur-md border border-white/10 text-gray-100 rounded-tl-none shadow-xl hover:bg-white/[0.08]'
              }`}
            >
              {/* Message Content */}
              <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap font-medium">
                {message.text}
              </p>
              
              {/* Citations/Sources */}
              {message.sources && message.sources.length > 0 && (
                <div className="mt-4 pt-3 border-t border-white/10 text-[10px] opacity-60">
                  <p className="font-black uppercase tracking-widest text-emerald-400 mb-1">Validated Data Sources:</p>
                  <ul className="flex flex-wrap gap-2">
                    {message.sources.map((source, i) => (
                      <li key={i} className="bg-black/20 px-2 py-0.5 rounded border border-white/5 uppercase">
                        {source}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Timestamp */}
              <div className={`mt-2 flex items-center gap-2 text-[9px] font-mono tracking-tighter uppercase opacity-40 ${message.sender === 'user' ? 'justify-start' : 'justify-end'}`}>
                {new Date(message.timestamp).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            </div>
          </div>
        ))}

        {/* --- TYPING INDICATOR --- */}
        {isLoading && (
          <div className="flex justify-start animate-in fade-in duration-300">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl rounded-tl-none px-5 py-4">
              <div className="flex space-x-1.5 items-center">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce delay-75"></div>
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce delay-150"></div>
                <span className="ml-2 text-[10px] font-mono uppercase text-emerald-500/60 tracking-widest">Neural Processing</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* --- INPUT DOCK --- */}
      <div className="p-4 md:p-6 bg-gradient-to-t from-black/40 to-transparent">
        <div className="relative group flex items-center gap-3 bg-white/5 backdrop-blur-xl border border-white/10 p-2 rounded-2xl transition-all duration-300 focus-within:border-emerald-500/50 focus-within:bg-white/[0.08] shadow-2xl">
          
          <div className="pl-2">
            <VoiceAssistant onTranscript={handleVoiceInput} />
          </div>
          
          <textarea
            rows="1"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={t('voice_placeholder') || "Command the AI..."}
            className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-gray-500 text-sm py-3 resize-none max-h-32 font-medium"
            disabled={isLoading}
          />
          
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className={`flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 ${
              isLoading || !input.trim()
                ? 'bg-white/5 text-gray-600 opacity-50 cursor-not-allowed'
                : 'bg-emerald-500 text-black hover:bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)] active:scale-90'
            }`}
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            )}
          </button>
        </div>
        
        <p className="mt-3 text-[9px] text-center text-gray-600 font-mono uppercase tracking-[0.2em]">
            System Priority: Accuracy & Health Analysis
        </p>
      </div>
    </div>
  );
};

export default AIChat;