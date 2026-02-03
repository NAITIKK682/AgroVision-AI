import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const CameraCapture = ({ onCapture, onClose }) => {
  const { t } = useLanguage();
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        
        if (mounted && videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          setStream(mediaStream);
        }
      } catch (err) {
        console.error('Camera error:', err);
        setError(err.message);
      }
    };

    startCamera();

    return () => {
      mounted = false;
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const takePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Set canvas dimensions
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw current video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert to blob
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], 'capture.jpg', { type: 'image/jpeg' });
        onCapture(file);
      }
    }, 'image/jpeg', 0.95);
  };

  if (error) {
    return (
      <div className="agro-card text-center">
        <div className="text-red-500 text-4xl mb-4">⚠️</div>
        <p className="text-farmer font-semibold mb-2">Camera Access Denied</p>
        <p className="text-gray-600 mb-4">{error}</p>
        <button onClick={onClose} className="agro-btn">
          Close
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">
      <div className="w-full max-w-md relative">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full aspect-video bg-black rounded-lg"
        />
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="border-2 border-red-500 rounded-full w-16 h-16 opacity-50"></div>
        </div>
      </div>

      <div className="mt-6 flex space-x-4">
        <button
          onClick={takePhoto}
          className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
        >
          <div className="w-16 h-16 bg-white rounded-full"></div>
        </button>
      </div>

      <p className="text-white text-center mt-4 text-sm">
        {t('step3')}
      </p>

      <button
        onClick={onClose}
        className="mt-6 px-6 py-2 bg-agro-green text-white rounded-lg hover:bg-opacity-80"
      >
        Cancel
      </button>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default CameraCapture;