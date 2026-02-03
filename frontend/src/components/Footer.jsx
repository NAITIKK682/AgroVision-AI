import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-agro-dark text-agro-light py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-agro-green w-10 h-10 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">🌾</span>
              </div>
              <span className="text-xl font-bold">AgroVision</span>
            </div>
            <p className="text-sm opacity-80">
              Smart crop disease detection for farmers. Empowering agriculture with AI.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="hover:text-agro-green transition">Home</a></li>
              <li><a href="/scan" className="hover:text-agro-green transition">Scan Crop</a></li>
              <li><a href="/history" className="hover:text-agro-green transition">History</a></li>
              <li><a href="/assistant" className="hover:text-agro-green transition">AI Assistant</a></li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h4 className="font-bold mb-4">Features</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <span className="text-agro-green mr-2">✓</span>
                <span>Disease Detection</span>
              </li>
              <li className="flex items-start">
                <span className="text-agro-green mr-2">✓</span>
                <span>Weather Alerts</span>
              </li>
              <li className="flex items-start">
                <span className="text-agro-green mr-2">✓</span>
                <span>Voice Assistant</span>
              </li>
              <li className="flex items-start">
                <span className="text-agro-green mr-2">✓</span>
                <span>Offline Mode</span>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <span className="mr-2">📧</span>
                <span>support@agrovision.ai</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">📱</span>
                <span className="font-semibold">+91 8948866980</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-agro-green/30 mt-8 pt-6 text-center text-sm opacity-70">
          <p>
            © {new Date().getFullYear()} AgroVision. Built with ❤️ for Farmers.
          </p>
          <p className="mt-2 text-xs">
            Disclaimer: This tool provides advisory only. Consult agricultural experts for critical decisions.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;