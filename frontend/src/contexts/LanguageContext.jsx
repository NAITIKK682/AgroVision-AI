import { createContext, useState, useEffect, useContext } from 'react';
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

  useEffect(() => {
    localStorage.setItem('agrovision-lang', lang);
    document.documentElement.lang = lang;
    
    // Load Hindi font only when needed
    if (lang === 'hi' && !document.getElementById('hindi-font')) {
      const link = document.createElement('link');
      link.id = 'hindi-font';
      link.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;500;700&display=swap';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
  }, [lang]);

  const t = (key, options = {}) => {
    const translations = lang === 'hi' ? hi : en;
    let text = translations[key] || `[${key}]`;
    
    // Variable replacement: t('recovery_time', { days: 14 })
    if (options.replace) {
      Object.entries(options.replace).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, v);
      });
    }
    return text;
  };

  const toggleLanguage = () => {
    setLang(prev => prev === 'en' ? 'hi' : 'en');
  };

  return (
    <LanguageContext.Provider value={{ lang, t, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};