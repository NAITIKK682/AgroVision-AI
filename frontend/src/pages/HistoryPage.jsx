import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useOffline } from '../contexts/OfflineContext';
import { getHistory } from '../services/api';
import { pdfService } from '../services/pdfService';

/**
 * @file HistoryPage.jsx
 * @description Premium AI-Dashboard style history view with futuristic aesthetics and agricultural data visualization.
 */

const HistoryPage = () => {
  const { t, lang } = useLanguage();
  const { cachedScans, isLoading: offlineLoading } = useOffline();
  const navigate = useNavigate();
  
  const [serverHistory, setServerHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('offline'); // 'offline' or 'server'

  useEffect(() => {
    fetchServerHistory();
  }, []);

  const fetchServerHistory = async () => {
    try {
      const data = await getHistory();
      setServerHistory(data.scans || []);
    } catch (error) {
      console.error('Failed to fetch history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = (scan) => {
    try {
      const doc = pdfService.generateOfflineReport(scan, lang);
      pdfService.downloadPDF(doc, `agroviz-report-${new Date(scan.timestamp || scan.date).getTime()}.pdf`);
    } catch (error) {
      console.error('PDF generation error:', error);
    }
  };

  const getSeverityStyles = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'low':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'high':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const historyItems = useMemo(() => 
    activeTab === 'offline' ? cachedScans : serverHistory, 
  [activeTab, cachedScans, serverHistory]);

  return (
    <div className="min-h-screen bg-[#020d08] text-gray-100 selection:bg-emerald-500/30">
      {/* Dynamic Radial Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-emerald-900/20 blur-[120px] rounded-full" />
        <div className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] bg-emerald-800/10 blur-[100px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <header className="mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-b from-white to-emerald-400 mb-2">
                {t('history')}
              </h1>
              <p className="text-emerald-500/80 font-medium tracking-wide max-w-md">
                ARCHIVE OF CROP DIAGNOSTICS & AI-POWERED ANALYSIS
              </p>
            </div>
            
            {/* Glass Tab System */}
            <div className="flex p-1 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
              {['offline', 'server'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 uppercase tracking-widest ${
                    activeTab === tab 
                    ? 'bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.4)]' 
                    : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {tab} ({tab === 'offline' ? cachedScans.length : serverHistory.length})
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* Status Handling */}
        {(loading || offlineLoading) ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-6">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 border-4 border-emerald-500/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-emerald-500 font-mono animate-pulse tracking-widest uppercase text-sm">Synchronizing Intelligence...</p>
          </div>
        ) : historyItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 rounded-[2rem] border-2 border-dashed border-white/5 bg-white/[0.02] backdrop-blur-md">
            <div className="w-20 h-20 mb-6 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
              <svg className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">No Records Found</h3>
            <p className="text-gray-400 mb-8 max-w-xs text-center">
              Our neural network has no data for this sector yet. 
            </p>
            <button
              onClick={() => navigate('/scan')}
              className="px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-black rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 uppercase tracking-tighter"
            >
              Initialize Scan
            </button>
          </div>
        ) : (
          /* Grid Layout */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {historyItems.map((scan, index) => (
              <div 
                key={scan.key || index} 
                className="group relative bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 transition-all duration-500 hover:border-emerald-500/40 hover:bg-white/[0.06] hover:-translate-y-2 overflow-hidden shadow-2xl"
              >
                {/* Glow Effect on Hover */}
                <div className="absolute -inset-px bg-gradient-to-br from-emerald-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2rem]" />
                
                <div className="relative flex flex-col sm:flex-row gap-6">
                  {/* Image Container */}
                  <div className="relative w-full sm:w-32 h-32 flex-shrink-0 overflow-hidden rounded-2xl border border-white/10">
                    {scan.image ? (
                      <img 
                        src={scan.image} 
                        alt="Crop Diagnostic" 
                        className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-emerald-900/20 flex items-center justify-center text-3xl">🌾</div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-black text-white truncate uppercase tracking-tight">
                        {scan.crop_name || 'System Asset'}
                      </h3>
                      {scan.confidence && (
                        <span className="font-mono text-[10px] border border-emerald-500/50 text-emerald-400 px-2 py-0.5 rounded uppercase tracking-tighter">
                          {scan.confidence} Match
                        </span>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {scan.disease_name && (
                        <span className="text-red-400 font-bold text-sm uppercase tracking-tighter">
                          {scan.disease_name}
                        </span>
                      )}
                      {scan.severity && (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border uppercase tracking-widest ${getSeverityStyles(scan.severity)}`}>
                          {scan.severity}
                        </span>
                      )}
                    </div>

                    <p className="text-gray-500 font-mono text-[11px] mb-6 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      {formatDate(scan.timestamp || scan.date)}
                    </p>

                    {/* Action Bar */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleDownloadPDF(scan)}
                        className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-widest transition-all active:scale-95"
                      >
                        Reports.pdf
                      </button>
                      <button
                        onClick={() => navigate('/scan')}
                        className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold uppercase tracking-widest transition-all active:scale-95 shadow-[0_4px_12px_rgba(16,185,129,0.2)]"
                      >
                        Recalibrate
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;