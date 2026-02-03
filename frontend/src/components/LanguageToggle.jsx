import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const LanguageToggle = () => {
  const { lang, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="px-4 py-2 bg-agro-green hover:bg-opacity-80 text-white rounded-lg transition-colors flex items-center space-x-2"
      aria-label={lang === 'en' ? 'Switch to Hindi' : 'Switch to English'}
    >
      <span>{lang === 'en' ? 'हिंदी' : 'English'}</span>
      <span>{lang === 'en' ? '🇮🇳' : '🇬🇧'}</span>
    </button>
  );
};

export default LanguageToggle;