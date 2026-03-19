import React, { createContext, useState, useEffect, useContext, useCallback, useMemo } from 'react';
import en from '../translations/en.json';
import hi from '../translations/hi.json';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => 
    localStorage.getItem('agrovision-lang') || 'en'
  );

  // Sync language with document metadata and load assets
  useEffect(() => {
    localStorage.setItem('agrovision-lang', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = 'ltr'; // Defaulting to LTR

    if (lang === 'hi' && !document.getElementById('hindi-font')) {
      const link = document.createElement('link');
      link.id = 'hindi-font';
      link.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;500;700&display=swap';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
  }, [lang]);

  // Optimized translation function with memoization and fallback logic
  const t = useCallback((key, options = {}) => {
    const translations = lang === 'hi' ? hi : en;
    let text = translations[key] || en[key] || key; // Fallback to English, then Key
    
    if (options.replace) {
      Object.entries(options.replace).forEach(([k, v]) => {
        text = text.replace(new RegExp(`{${k}}`, 'g'), v);
      });
    }
    return text;
  }, [lang]);

  const toggleLanguage = useCallback(() => {
    setLang(prev => prev === 'en' ? 'hi' : 'en');
  }, []);

  const value = useMemo(() => ({ lang, t, toggleLanguage }), [lang, t, toggleLanguage]);

  return (
    <LanguageContext.Provider value={value}>
      <div style={{ fontFamily: lang === 'hi' ? "'Noto Sans Devanagari', sans-serif" : 'inherit' }}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};