import React, { useState, useEffect } from 'react';
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
  FiActivity
} from 'react-icons/fi';
import ImageUploader from '../components/ImageUploader';
import CameraCapture from '../components/CameraCapture';
import ResultDetails from '../components/ResultDetails';
import ErrorPrediction from '../components/ErrorPrediction';
import WeatherCard from '../components/WeatherCard';
import ScanGuide from '../components/ScanGuide';

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

  useEffect(() => {
    if (!imageFile) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(imageFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

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
      const result = await predictDisease(imageFile, location);
      
      if (result.status === 'success') {
        setPrediction(result.prediction);
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
        setError({ message: t('offline_mode'), type: 'warning' });
      } else {
        setError({ message: 'Internal server error during analysis.' });
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
        
        {/* Header Section */}
        <header className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
            <FiCpu className="text-sm animate-pulse" />
            Neural Diagnostic Suite v3.2
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-4 leading-none">
            Analyze <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-green-300 italic">Vitality.</span>
          </h1>
          <p className="text-emerald-100/50 font-medium max-w-2xl mx-auto leading-relaxed text-lg">
            Specialized AI detection for 7 Fruits and 7 Vegetables. 
            Instant diagnostic feedback for modern agriculture.
          </p>
        </header>

        {/* Global Offline Alert */}
        {!isOnline && (
          <div className="mb-8 flex items-center justify-between bg-amber-500/10 border border-amber-500/30 p-5 rounded-2xl backdrop-blur-md animate-pulse">
            <div className="flex items-center gap-4 text-amber-400 font-bold text-sm">
              <FiAlertCircle className="text-xl" />
              <span>Offline Mode — Using localized edge-compute cache.</span>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Action Panel (Left) */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-[#05150e]/80 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-2xl border border-emerald-900/30 relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-xs font-black text-emerald-500 mb-6 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                  Input Parameters
                </h3>
                
                <div className="space-y-6">
                  <div className="p-2 bg-black/40 rounded-3xl border border-emerald-900/20 shadow-inner">
                    <ImageUploader 
                      onImageSelect={handleImageSelect} 
                      currentImage={previewUrl}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setShowCamera(true)}
                      className="flex flex-col items-center justify-center gap-2 py-4 rounded-2xl bg-emerald-500 text-[#020d08] font-black text-xs hover:bg-emerald-400 transition-all shadow-[0_4px_20px_rgba(16,185,129,0.3)] group"
                    >
                      <FiCamera className="text-xl group-hover:scale-110 transition-transform" />
                      Camera Source
                    </button>
                    <button
                      onClick={handleReset}
                      className="flex flex-col items-center justify-center gap-2 py-4 rounded-2xl bg-zinc-900 text-red-400 font-bold text-xs hover:bg-red-950/30 transition-all border border-red-900/30 shadow-lg"
                    >
                      <FiRefreshCw className="text-xl" />
                      Reset Data
                    </button>
                  </div>

                  <button
                    onClick={handleScan}
                    disabled={!imageFile || isLoading}
                    className={`group relative w-full py-5 rounded-2xl font-black text-white uppercase tracking-[0.15em] transition-all duration-500 shadow-2xl overflow-hidden ${
                      !imageFile || isLoading
                        ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700'
                        : 'bg-emerald-600 hover:bg-emerald-500 hover:-translate-y-1 shadow-emerald-900/40 border-t border-emerald-400/30'
                    }`}
                  >
                    <div className="relative z-10 flex items-center justify-center gap-3">
                      {isLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <FiZap className="text-lg group-hover:animate-pulse" />
                          <span>Run Diagnostic</span>
                        </>
                      )}
                    </div>
                  </button>
                </div>
              </div>
            </div>

            <div className="rounded-[2.5rem] overflow-hidden shadow-2xl border border-emerald-900/20">
              <WeatherCard location={location} compact={true} />
            </div>
          </aside>

          {/* Visualization Panel (Right) */}
          <main className="lg:col-span-8 relative min-h-[650px]">
            {isLoading ? (
              <div className="absolute inset-0 bg-[#020d08]/80 backdrop-blur-2xl rounded-[3rem] z-20 flex flex-col items-center justify-center p-12 text-center border border-emerald-500/30">
                <div className="relative w-72 h-72 mb-10 group">
                  <img src={previewUrl} alt="Scanning" className="w-full h-full object-cover rounded-[2.5rem] opacity-40 shadow-2xl grayscale" />
                  <div className="absolute top-0 left-0 w-full h-1 bg-emerald-400 shadow-[0_0_30px_#10b981] animate-scan-line z-30" />
                </div>
                <h2 className="text-3xl font-black text-white mb-3">Analyzing Pathogens</h2>
                <p className="text-emerald-400/60 font-medium">Matching leaf structure against our fruit and vegetable dataset...</p>
              </div>
            ) : error ? (
              <div className="h-full">
                <ErrorPrediction error={error} onRetry={handleReset} />
              </div>
            ) : prediction ? (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 h-full">
                <ResultDetails prediction={prediction} image={previewUrl} />
              </div>
            ) : (
              <div className="h-full flex flex-col gap-6">
                <ScanGuide />
                <div className="flex-1 bg-gradient-to-br from-[#051c11] to-[#020d08] rounded-[3rem] p-12 text-white border border-emerald-900/30 relative overflow-hidden group shadow-2xl">
                  <div className="relative z-10 h-full flex flex-col justify-center">
                    <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-8 border border-emerald-500/20">
                      <FiMaximize className="text-3xl text-emerald-400" />
                    </div>
                    <h2 className="text-4xl font-black mb-6 tracking-tight">Diagnostic <br/>Core <span className="text-emerald-500">Active</span></h2>
                    <p className="text-emerald-100/40 max-w-md text-lg leading-relaxed font-medium">
                      Optimized for 7 Fruit and 7 Vegetable varieties. Please ensure 
                      lighting is natural for highest accuracy.
                    </p>
                  </div>
                  <div className="absolute right-[-5%] bottom-[-5%] opacity-[0.05] pointer-events-none transition-transform duration-1000 group-hover:scale-110">
                    <FiActivity size={320} className="text-emerald-400" />
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {showCamera && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-emerald-950/20 rounded-[2.5rem] border border-emerald-500/20 overflow-hidden shadow-[0_0_100px_rgba(16,185,129,0.1)]">
            <CameraCapture 
              onCapture={handleCameraCapture} 
              onClose={() => setShowCamera(false)} 
            />
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scan-line {
          0% { top: 0%; opacity: 0 }
          10% { opacity: 1 }
          90% { opacity: 1 }
          100% { top: 100%; opacity: 0 }
        }
        .animate-scan-line {
          animation: scan-line 3s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
      `}} />
    </div>
  );
};

export default DetectionPage;