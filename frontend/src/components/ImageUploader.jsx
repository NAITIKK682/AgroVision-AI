import React, { useState, useRef, useCallback } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useDropzone } from 'react-dropzone';
import { FiUploadCloud, FiImage, FiXCircle, FiPlusCircle } from 'react-icons/fi';

const ImageUploader = ({ onImageSelect, className = '' }) => {
  const { t } = useLanguage();
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setPreview(URL.createObjectURL(file));
      onImageSelect(file);
    }
  }, [onImageSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1,
    maxSize: 5242880, // 5MB
  });

  const handleBrowse = (e) => {
    e.stopPropagation(); // Prevents dropzone from triggering twice
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      setPreview(URL.createObjectURL(file));
      onImageSelect(file);
    }
  };

  return (
    <div className={className}>
      {preview ? (
        <div className="bg-black/40 border border-emerald-500/20 rounded-3xl p-6 text-center shadow-2xl backdrop-blur-sm animate-in fade-in zoom-in duration-300">
          <div className="relative inline-block group">
            <img 
              src={preview} 
              alt="Preview" 
              className="max-h-64 mx-auto rounded-2xl mb-6 object-contain border-2 border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.2)]"
            />
            <div className="absolute inset-0 bg-emerald-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </div>
          
          <button
            onClick={() => {
              setPreview(null);
              onImageSelect(null);
            }}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-500/10 text-red-400 font-bold text-sm hover:bg-red-500 hover:text-white transition-all border border-red-500/30"
          >
            <FiXCircle />
            Remove and Retry
          </button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`relative group border-2 border-dashed rounded-[2rem] p-10 text-center cursor-pointer transition-all duration-500 overflow-hidden ${
            isDragActive
              ? 'border-emerald-400 bg-emerald-500/10 scale-[0.99]'
              : 'border-emerald-900/50 bg-[#020d08] hover:border-emerald-500/50 hover:bg-emerald-900/5'
          }`}
        >
          <input {...getInputProps()} ref={fileInputRef} onChange={handleFileChange} />
          
          {/* Animated Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-emerald-500/5 blur-[50px] rounded-full group-hover:bg-emerald-500/10 transition-all" />

          <div className="relative z-10">
            <div className="mb-6 relative inline-block">
              <div className="bg-emerald-500/10 text-emerald-400 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto border border-emerald-500/20 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                <FiUploadCloud size={32} />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-black p-1.5 rounded-lg shadow-lg">
                <FiPlusCircle size={14} />
              </div>
            </div>
            
            <h4 className="text-white font-black text-lg mb-2 uppercase tracking-tight">
              {isDragActive ? "Drop image here" : "Drag and Drop"}
            </h4>
            
            <p className="text-emerald-100/40 text-sm mb-6 font-medium">
              Drop your leaf capture here to start
            </p>
            
            <button 
              type="button" 
              onClick={handleBrowse} 
              className="px-8 py-3 rounded-xl bg-emerald-500 text-[#020d08] font-black text-xs uppercase tracking-widest hover:bg-emerald-400 transition-all shadow-[0_10px_20px_rgba(16,185,129,0.2)] active:scale-95"
            >
              Browse Files
            </button>
            
            <div className="mt-8 flex flex-col gap-2">
              <p className="text-[10px] text-emerald-500/40 font-bold uppercase tracking-[0.2em]">
                Capture Requirements
              </p>
              <p className="text-xs text-zinc-500 font-medium italic">
                Max 5MB • JPG, PNG, or WebP
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;