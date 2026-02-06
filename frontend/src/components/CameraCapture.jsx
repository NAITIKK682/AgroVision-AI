import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

/**
 * CameraCapture Component - Enterprise Grade
 * Resolved: Hardware light staying on, small video output, and capture logic.
 */
const CameraCapture = ({ onCapture, onClose }) => {
  const { t } = useLanguage();
  const [error, setError] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  // Persistent reference to the stream to ensure hardware kill on unmount
  const activeStreamRef = useRef(null);

  // Initialize Camera with optimized constraints
  useEffect(() => {
    let mounted = true;

    const startCamera = async () => {
      try {
        const constraints = {
          video: {
            facingMode: 'environment',
            width: { ideal: 1920 },
            height: { ideal: 1080 },
            aspectRatio: { ideal: 1.7777777778 }
          },
          audio: false
        };

        const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
        
        if (mounted && videoRef.current) {
          activeStreamRef.current = mediaStream;
          videoRef.current.srcObject = mediaStream;
          
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play().catch(console.error);
          };
        }
      } catch (err) {
        console.error('Camera error:', err);
        setError(err.message || 'Unable to access camera. Please check permissions.');
      }
    };

    startCamera();

    // CRITICAL: Clean up function to turn off camera light
    return () => {
      mounted = false;
      if (activeStreamRef.current) {
        activeStreamRef.current.getTracks().forEach(track => {
          track.stop(); // Stops the hardware
          track.enabled = false;
        });
        activeStreamRef.current = null;
      }
    };
  }, []);

  const takePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || isCapturing) return;

    setIsCapturing(true);
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Match internal resolution exactly to the video source
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';

    // Draw frame
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert to blob and export
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `capture_${Date.now()}.jpg`, { type: 'image/jpeg' });
        onCapture(file);
        // Explicitly stop tracks before closing to ensure light turns off immediately
        if (activeStreamRef.current) {
            activeStreamRef.current.getTracks().forEach(track => track.stop());
        }
        onClose(); 
      }
      setIsCapturing(false);
    }, 'image/jpeg', 0.95);
  }, [onCapture, onClose, isCapturing]);

  if (error) {
    return (
      <div className="fixed inset-0 bg-[#020d08] z-[110] flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-6 bg-white p-8 rounded-3xl">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto text-4xl">⚠️</div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-slate-900">{t('cameraError') || 'Camera Error'}</h3>
            <p className="text-slate-500 text-sm leading-relaxed">{error}</p>
          </div>
          <button 
            onClick={onClose} 
            className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-semibold shadow-lg active:scale-95 transition-transform"
          >
            {t('goBack') || 'Go Back'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black z-[100] flex flex-col items-center justify-between overflow-hidden animate-in fade-in duration-500">
      {/* Immersive Header */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-20 bg-gradient-to-b from-black/80 to-transparent">
        <button 
          onClick={onClose}
          className="p-3 bg-white/10 backdrop-blur-xl rounded-full text-white hover:bg-white/20 transition-all active:scale-90"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
        <div className="px-4 py-1.5 bg-emerald-500/20 backdrop-blur-xl border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-[0.2em] rounded-full">
          {t('liveView') || 'Neural Link Active'}
        </div>
      </div>

      {/* Full-Screen Video Viewport */}
      <div className="absolute inset-0 w-full h-full bg-black">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover" // Ensures camera fills the screen
        />
        
        {/* Scanner Overlay UI */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="w-[75vw] h-[75vw] max-w-[350px] max-h-[350px] relative">
              {/* Corner Accents */}
             <div className="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-emerald-500 rounded-tl-3xl"></div>
             <div className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-emerald-500 rounded-tr-3xl"></div>
             <div className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-emerald-500 rounded-bl-3xl"></div>
             <div className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-emerald-500 rounded-br-3xl"></div>
             
             {/* Scanning Line Animation */}
             <div className="absolute inset-x-4 top-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_rgba(16,185,129,0.8)] animate-[scan_2s_linear_infinite]"></div>
          </div>
          <p className="mt-12 text-white/90 font-medium text-center px-8 text-sm tracking-wide drop-shadow-lg bg-black/20 backdrop-blur-md py-2 rounded-full">
            {t('step3') || 'Align plant within frame'}
          </p>
        </div>
      </div>

      {/* Control Center */}
      <div className="relative w-full z-20 pb-12 pt-8 flex items-center justify-center bg-gradient-to-t from-black/90 to-transparent">
        <div className="flex items-center gap-10">
          <div className="w-12 h-12" /> {/* Spacer */}

          <button
            onClick={takePhoto}
            disabled={isCapturing}
            className="group relative flex items-center justify-center"
          >
            {/* Outer Ring */}
            <div className="absolute w-24 h-24 border-2 border-white/50 rounded-full group-hover:scale-110 transition-transform duration-300"></div>
            {/* Inner Button */}
            <div className={`
              relative flex items-center justify-center rounded-full transition-all duration-300
              ${isCapturing ? 'w-12 h-12 bg-emerald-500' : 'w-20 h-20 bg-white group-active:scale-90'}
            `}>
              {isCapturing && (
                 <div className="absolute inset-[-8px] border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
              )}
            </div>
          </button>

          <div className="w-12 h-12 flex flex-col items-center justify-center opacity-40">
             <span className="text-white text-[10px] font-bold">RAW</span>
             <span className="text-white text-[8px]">10-BIT</span>
          </div>
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}} />
    </div>
  );
};

export default CameraCapture;