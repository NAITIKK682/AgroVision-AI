import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

/**
 * CameraCapture Component - Professional Grade
 * Modern camera app UI with live preview, capture, and image preview
 * Features: Rounded preview, circular capture button, retake/predict flow
 */
const CameraCapture = ({ onCapture, onClose }) => {
  const { t } = useLanguage();
  const [error, setError] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cameraActive, setCameraActive] = useState(true);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const activeStreamRef = useRef(null);
  const capturedBlobRef = useRef(null); // Store blob for prediction

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
        const imageUrl = URL.createObjectURL(blob);
        capturedBlobRef.current = blob; // ✅ Store blob for predict
        setCapturedImage(imageUrl);
        setCameraActive(false);
      }
      setIsCapturing(false);
    }, 'image/jpeg', 0.95);
  }, [isCapturing]);

  const handleRetake = useCallback(() => {
    if (capturedImage) {
      URL.revokeObjectURL(capturedImage);
    }
    capturedBlobRef.current = null; // ✅ Clear stored blob
    setCapturedImage(null);
    setCameraActive(true);
    setIsProcessing(false);
  }, [capturedImage]);

  const handlePredict = useCallback(() => {
    // ✅ Use stored blob instead of empty canvas
    if (!capturedBlobRef.current) {
      console.error('No captured image found');
      return;
    }

    setIsProcessing(true);
    const blob = capturedBlobRef.current;
    const file = new File([blob], `capture_${Date.now()}.jpg`, { type: 'image/jpeg' });
    
    // Send to backend for prediction
    onCapture(file);
    
    // Stop camera stream
    if (activeStreamRef.current) {
      activeStreamRef.current.getTracks().forEach(track => track.stop());
    }
    
    // Auto close after a brief delay
    setTimeout(onClose, 300);
  }, [onCapture, onClose]);

  // ============== ERROR STATE ==============
  if (error) {
    return (
      <div className="fixed inset-0 bg-gradient-to-b from-slate-900 to-slate-950 z-[110] flex items-center justify-center p-6 animate-in fade-in duration-300">
        <div className="max-w-sm w-full text-center space-y-6 bg-white p-8 rounded-3xl shadow-2xl">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto text-5xl animate-bounce">
            📷
          </div>
          <div className="space-y-3">
            <h3 className="text-2xl font-bold text-slate-900">{t('cameraError') || 'Camera Access Denied'}</h3>
            <p className="text-slate-600 text-sm leading-relaxed">{error}</p>
            <p className="text-xs text-slate-500">Please check that your device has a camera and permissions are granted.</p>
          </div>
          <button 
            onClick={onClose} 
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200"
          >
            {t('goBack') || 'Go Back'}
          </button>
        </div>
      </div>
    );
  }

  // ============== IMAGE PREVIEW STATE ==============
  if (capturedImage && !cameraActive) {
    return (
      <div className="fixed inset-0 bg-gradient-to-b from-slate-900 to-slate-950 z-[100] flex flex-col animate-in fade-in duration-300">
        {/* Header */}
        <div className="pt-6 px-6 pb-4 z-20">
          <button 
            onClick={onClose}
            className="p-3 bg-white/10 backdrop-blur-xl hover:bg-white/20 rounded-full text-white transition-all active:scale-90 duration-200"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Image Preview */}
        <div className="flex-1 px-6 py-8 flex items-center justify-center overflow-hidden">
          <div className="relative w-full max-w-sm aspect-square bg-black rounded-3xl shadow-2xl overflow-hidden group">
            {/* Image */}
            <img 
              src={capturedImage} 
              alt="Captured" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            
            {/* Overlay Check */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div className="text-white text-center">
                <svg className="w-16 h-16 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-semibold">Image Ready</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons at Bottom */}
        <div className="px-6 pb-12 pt-6 space-y-3 z-20 bg-gradient-to-t from-slate-950 via-slate-900 to-transparent">
          {/* Predict Button */}
          <button
            onClick={handlePredict}
            disabled={isProcessing}
            className={`
              w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg
              flex items-center justify-center gap-3 group
              ${isProcessing 
                ? 'bg-emerald-600/50 text-emerald-100 cursor-not-allowed' 
                : 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white active:scale-95 hover:shadow-xl'
              }
            `}
          >
            {isProcessing ? (
              <>
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>{t('analyzing') || 'Analyzing...'}</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5 group-active:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.3A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z" />
                </svg>
                <span>{t('predict') || 'Analyze Crop'}</span>
              </>
            )}
          </button>

          {/* Retake Button */}
          <button
            onClick={handleRetake}
            disabled={isProcessing}
            className={`
              w-full py-3.5 px-6 rounded-2xl font-semibold text-base transition-all duration-300 shadow-md
              flex items-center justify-center gap-3 group
              ${isProcessing
                ? 'bg-slate-600/30 text-slate-400 cursor-not-allowed'
                : 'bg-slate-700/50 hover:bg-slate-700 text-white border border-slate-600 hover:border-slate-500 active:scale-95'
              }
            `}
          >
            <svg className="w-5 h-5 group-active:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>{t('retake') || 'Retake Photo'}</span>
          </button>
        </div>
      </div>
    );
  }

  // ============== CAMERA PREVIEW STATE ==============
  return (
    <div className="fixed inset-0 bg-black z-[100] flex flex-col animate-in fade-in duration-300">
      {/* ===== TOP HEADER ===== */}
      <div className="pt-4 px-6 pb-3 z-20 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
        <button 
          onClick={onClose}
          className="p-2.5 bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-full text-white transition-all active:scale-90 duration-200"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        
        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/20 backdrop-blur-md border border-emerald-500/40 text-emerald-300 text-xs font-bold uppercase tracking-wider rounded-full">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
          {t('liveView') || 'Live View'}
        </div>

        <div className="w-10"></div>
      </div>

      {/* ===== CENTER CAMERA PREVIEW ===== */}
      <div className="flex-1 flex items-center justify-center px-4 overflow-hidden">
        <div className="relative w-full max-w-sm bg-black rounded-3xl overflow-hidden shadow-2xl">
          {/* Video Stream */}
          <div className="relative aspect-square bg-black">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />

            {/* Dark Overlay for Better Focus */}
            <div className="absolute inset-0 bg-black/5 pointer-events-none"></div>

            {/* Scan Guide - Centered Focus Box */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="relative w-48 h-48">
                {/* Animated Corner Brackets */}
                <div className="absolute -top-4 -left-4 w-12 h-12 border-t-3 border-l-3 border-emerald-400/80"></div>
                <div className="absolute -top-4 -right-4 w-12 h-12 border-t-3 border-r-3 border-emerald-400/80"></div>
                <div className="absolute -bottom-4 -left-4 w-12 h-12 border-b-3 border-l-3 border-emerald-400/80"></div>
                <div className="absolute -bottom-4 -right-4 w-12 h-12 border-b-3 border-r-3 border-emerald-400/80"></div>

                {/* Center Dot */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-400/50"></div>
                </div>

                {/* Scanning Line */}
                <div className="absolute inset-x-0 top-1/4 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-[scan_3s_linear_infinite] shadow-lg shadow-emerald-400/30"></div>
              </div>
            </div>

            {/* Instruction Text */}
            <div className="absolute bottom-8 left-0 right-0 text-center pointer-events-none">
              <div className="inline-block px-4 py-2 bg-black/40 backdrop-blur-md rounded-full">
                <p className="text-white/90 text-sm font-medium tracking-wide">
                  {t('step3') || 'Center the leaf in frame'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== BOTTOM CONTROLS ===== */}
      <div className="px-6 py-8 z-20 flex flex-col items-center gap-4 bg-gradient-to-t from-black via-black/70 to-transparent">
        {/* Capture Button - Large Circular */}
        <div className="relative flex items-center justify-center mb-4">
          <button
            onClick={takePhoto}
            disabled={isCapturing}
            className={`
              relative flex items-center justify-center rounded-full transition-all duration-300 active:scale-95
              ${isCapturing 
                ? 'w-16 h-16 bg-emerald-500 shadow-lg shadow-emerald-500/50' 
                : 'w-20 h-20 bg-white hover:bg-slate-50 shadow-2xl hover:shadow-emerald-500/30'
              }
            `}
          >
            {isCapturing ? (
              <>
                <div className="absolute inset-0 border-4 border-emerald-300 rounded-full animate-pulse"></div>
                <svg className="w-8 h-8 text-white animate-spin" fill="currentColor" viewBox="0 0 20 20">
                  <circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.25"></circle>
                  <path fill="currentColor" d="M4 10a6 6 0 1 0 12 0 6 6 0 0 0-12 0z" opacity="0.75"></path>
                </svg>
              </>
            ) : (
              <svg className="w-10 h-10 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
              </svg>
            )}

            {/* Outer Ring Animation */}
            {!isCapturing && (
              <div className="absolute inset-0 border-3 border-white/30 rounded-full animate-pulse scale-125"></div>
            )}
          </button>
        </div>

        {/* Label */}
        <div className="text-center">
          <p className="text-white/80 font-semibold text-base">
            {isCapturing ? `${t('capturing') || 'Capturing...'}` : `${t('clickImage') || 'Click to Capture'}`}
          </p>
          <p className="text-white/50 text-xs mt-1">
            {`${t('tapLargeButton') || 'Tap the button to take a photo'}`}
          </p>
        </div>
      </div>

      {/* Canvas for capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Custom Animation */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scan {
          0%, 100% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}} />
    </div>
  );
};

export default CameraCapture;