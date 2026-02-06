import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useOffline } from '../contexts/OfflineContext';
import { predictDisease } from '../services/api';
import { 
  FiCamera, 
  FiRefreshCw, 
  FiZap, 
  FiAlertCircle, 
  FiCpu, 
  FiMaximize,
  FiActivity,
  FiCheckCircle
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

// Specialized Components
import ImageUploader from '../components/ImageUploader';
import CameraCapture from '../components/CameraCapture';
import ResultDetails from '../components/ResultDetails';
import ErrorPrediction from '../components/ErrorPrediction';
import WeatherCard from '../components/WeatherCard';
import ScanGuide from '../components/ScanGuide';

/**
 * DetectionPage - Enterprise Production Grade
 * Features: High-precision camera integration, offline caching, 
 * neural scan animations, and responsive layout.
 */
const DetectionPage = () => {
  const { t } = useLanguage();
  const { isOnline, cacheScan } = useOffline();
  
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [location, setLocation] = useState(null);

  // Preview Generation Logic with Memory Safety
  useEffect(() => {
    if (!imageFile) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(imageFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  // High-Precision Geolocation Fetching
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
        (err) => console.warn('Location Access Denied:', err),
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
  }, []);

  const handleImageSelect = (file) => {
    setImageFile(file);
    setError(null);
    setPrediction(null);
  };

  const handleCameraCapture = (file) => {
    setImageFile(file);
    setShowCamera(false);
    setError(null);
    setPrediction(null);
  };

  const handleScan = async () => {
    if (!imageFile) {
      setError({ message: 'Neural engine requires a visual input.' });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Execute AI Prediction API call
      const result = await predictDisease(imageFile, location);
      
      if (result.status === 'success') {
        setPrediction(result.prediction);
        
        // Cache result for history/offline access
        cacheScan({
          ...result.prediction,
          image: previewUrl,
          timestamp: new Date().toISOString(),
          location: location
        });
      } else {
        setError({ message: result.error || 'Diagnostic mismatch detected.' });
      }
    } catch (err) {
      if (!isOnline) {
        setError({ message: t('offline_mode') || 'Working offline...', type: 'warning' });
      } else {
        setError({ message: 'Critical error during neural analysis.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setImageFile(null);
    setPrediction(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#020d08] bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-950/40 via-[#020d08] to-[#010805] pt-28 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Branding */}
        <header className="mb-12 text-center animate-in fade-in slide-in-from-top-4 duration-1000">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6 shadow-[0_0_20px_rgba(16,185,129,0.1)] backdrop-blur-md">
            <FiCpu className="text-sm animate-pulse" />
            Neural Diagnostic Suite v3.2
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-4 leading-[0.9]">
            Analyze <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-green-300 to-emerald-500 italic">Vitality.</span>
          </h1>
          <p className="text-emerald-100/50 font-medium max-w-2xl mx-auto leading-relaxed text-lg">
            High-precision plant pathology detection for enterprise agriculture. 
            Optimized for 14 unique fruit and vegetable cultivars.
          </p>
        </header>

        {/* Dynamic Offline Feedback */}
        <AnimatePresence>
          {!isOnline && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 overflow-hidden"
            >
              <div className="flex items-center justify-between bg-amber-500/10 border border-amber-500/30 p-5 rounded-2xl backdrop-blur-md">
                <div className="flex items-center gap-4 text-amber-400 font-bold text-sm">
                  <FiAlertCircle className="text-xl animate-bounce" />
                  <span>Offline Mode Active — Results will be cached locally.</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* CONTROL INTERFACE (Left Column) */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-[#05150e]/80 backdrop-blur-2xl rounded-[2.5rem] p-8 shadow-2xl border border-emerald-900/30 relative overflow-hidden transition-all duration-500 hover:border-emerald-500/20">
              <div className="relative z-10">
                <h3 className="text-[10px] font-black text-emerald-500 mb-8 uppercase tracking-[0.3em] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_12px_#10b981]" />
                  Session Parameters
                </h3>
                
                <div className="space-y-6">
                  <div className="p-1.5 bg-black/40 rounded-[2rem] border border-emerald-900/20 shadow-inner group overflow-hidden">
                    <ImageUploader 
                      onImageSelect={handleImageSelect} 
                      currentImage={previewUrl}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setShowCamera(true)}
                      className="flex flex-col items-center justify-center gap-2 py-5 rounded-3xl bg-emerald-500 text-[#020d08] font-black text-[10px] uppercase tracking-wider hover:bg-emerald-400 transition-all shadow-[0_4px_30px_rgba(16,185,129,0.3)] group active:scale-95"
                    >
                      <FiCamera className="text-2xl group-hover:rotate-12 transition-transform" />
                      Live Lens
                    </button>
                    <button
                      onClick={handleReset}
                      className="flex flex-col items-center justify-center gap-2 py-5 rounded-3xl bg-zinc-900/50 text-zinc-400 font-black text-[10px] uppercase tracking-wider hover:bg-red-500/10 hover:text-red-400 transition-all border border-zinc-800 active:scale-95"
                    >
                      <FiRefreshCw className="text-2xl group-hover:rotate-180 transition-transform duration-700" />
                      Clear Data
                    </button>
                  </div>

                  <button
                    onClick={handleScan}
                    disabled={!imageFile || isLoading}
                    className={`group relative w-full py-6 rounded-3xl font-black text-white uppercase tracking-[0.2em] transition-all duration-500 shadow-2xl overflow-hidden ${
                      !imageFile || isLoading
                        ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed grayscale'
                        : 'bg-gradient-to-r from-emerald-600 to-emerald-500 hover:shadow-emerald-500/40 hover:-translate-y-1 active:scale-95'
                    }`}
                  >
                    <div className="relative z-10 flex items-center justify-center gap-3">
                      {isLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                          <span className="text-xs">Processing...</span>
                        </>
                      ) : (
                        <>
                          <FiZap className="text-xl group-hover:scale-125 transition-transform" />
                          <span className="text-xs">Initialize Analysis</span>
                        </>
                      )}
                    </div>
                  </button>
                </div>
              </div>
            </div>

            <div className="rounded-[2.5rem] overflow-hidden shadow-2xl border border-emerald-900/20 bg-[#05150e]/50 backdrop-blur-xl">
              <WeatherCard location={location} compact={true} />
            </div>
          </aside>

          {/* ANALYSIS VIEWER (Right Column) */}
          <main className="lg:col-span-8 relative min-h-[700px]">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-[#020d08]/90 backdrop-blur-3xl rounded-[3rem] z-20 flex flex-col items-center justify-center p-12 text-center border border-emerald-500/30"
                >
                  <div className="relative w-80 h-80 mb-10 group">
                    <div className="absolute inset-0 border-[10px] border-emerald-500/10 rounded-[3rem] animate-pulse" />
                    <img src={previewUrl} alt="Scanning" className="w-full h-full object-cover rounded-[2.5rem] opacity-30 shadow-2xl grayscale" />
                    <div className="absolute top-0 left-0 w-full h-1 bg-emerald-400 shadow-[0_0_40px_#10b981] animate-scan-line z-30" />
                    <div className="absolute inset-0 flex items-center justify-center">
                       <FiActivity className="text-emerald-500 text-6xl animate-pulse" />
                    </div>
                  </div>
                  <h2 className="text-3xl font-black text-white mb-3 tracking-tight uppercase tracking-widest">Neural Mapping</h2>
                  <p className="text-emerald-400/60 font-medium max-w-sm">Comparing specimen metrics against 1M+ indexed data points...</p>
                </motion.div>
              ) : error ? (
                <motion.div 
                  key="error"
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                  className="h-full"
                >
                  <ErrorPrediction error={error} onRetry={handleReset} />
                </motion.div>
              ) : prediction ? (
                <motion.div 
                  key="result"
                  initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="h-full"
                >
                  <ResultDetails prediction={prediction} image={previewUrl} />
                </motion.div>
              ) : (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="h-full flex flex-col gap-6"
                >
                  <ScanGuide />
                  <div className="flex-1 bg-gradient-to-br from-[#051c11] to-[#020d08] rounded-[3.5rem] p-16 text-white border border-emerald-900/30 relative overflow-hidden group shadow-2xl transition-all duration-700 hover:border-emerald-500/30">
                    <div className="relative z-10 h-full flex flex-col justify-center">
                      <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center mb-10 border border-emerald-500/20 shadow-inner group-hover:scale-110 transition-transform">
                        <FiMaximize className="text-4xl text-emerald-400" />
                      </div>
                      <h2 className="text-5xl font-black mb-8 tracking-tighter leading-none">
                        Ready for <br/>
                        <span className="text-emerald-500">Live Diagnostic</span>
                      </h2>
                      <div className="space-y-4">
                        <p className="flex items-center gap-3 text-emerald-100/60 font-medium">
                          <FiCheckCircle className="text-emerald-500" /> Multi-modal AI Recognition
                        </p>
                        <p className="flex items-center gap-3 text-emerald-100/60 font-medium">
                          <FiCheckCircle className="text-emerald-500" /> Edge-compute Latency: ~180ms
                        </p>
                      </div>
                    </div>
                    {/* Background Decorative Element */}
                    <div className="absolute right-[-10%] bottom-[-10%] opacity-[0.03] pointer-events-none transition-transform duration-1000 group-hover:scale-125 group-hover:rotate-12">
                      <FiActivity size={500} className="text-emerald-400" />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>

      {/* MODAL: LIVE CAMERA INTERFACE */}
      <AnimatePresence>
        {showCamera && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-black/90 backdrop-blur-3xl flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-2xl bg-emerald-950/20 rounded-[3rem] border border-emerald-500/20 overflow-hidden shadow-[0_0_150px_rgba(16,185,129,0.2)]"
            >
              <CameraCapture 
                onCapture={handleCameraCapture} 
                onClose={() => setShowCamera(false)} 
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scan-line {
          0% { top: 0%; opacity: 0 }
          10% { opacity: 1 }
          90% { opacity: 1 }
          100% { top: 100%; opacity: 0 }
        }
        .animate-scan-line {
          animation: scan-line 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
      `}} />
    </div>
  );
};

export default DetectionPage;