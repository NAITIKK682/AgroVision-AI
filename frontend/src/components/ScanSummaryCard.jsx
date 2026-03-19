import React from 'react';
import PredictionChart from './PredictionChart';
import { FiImage, FiBarChart3 } from 'react-icons/fi';

/**
 * ScanSummaryCard - Displays a compact scan summary with image and chart
 * Used in Dashboard/History pages
 */
const ScanSummaryCard = ({ scan, onExpand }) => {
  return (
    <div className="bg-gradient-to-br from-emerald-900/10 to-black/40 border border-emerald-500/20 rounded-2xl overflow-hidden hover:border-emerald-500/40 transition-all">
      {/* Image Section */}
      <div className="relative h-48 bg-black/60 overflow-hidden group">
        {scan.image || scan.image_url ? (
          <>
            <img
              src={scan.image || scan.image_url}
              alt="Scan"
              className="w-full h-full object-cover grayscale-[10%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl opacity-30">🌾</div>
        )}
        
        {/* Info Badge Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-end justify-between">
            <div>
              <h3 className="text-xl font-black text-white">{scan.crop_name || 'Unknown'}</h3>
              <p className="text-emerald-300 text-sm font-bold">{scan.disease_name || 'Scanning...'}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-black text-emerald-400">{scan.confidence || 0}%</div>
              <div className={`text-xs font-black uppercase px-2 py-1 rounded ${
                scan.severity === 'High' ? 'bg-red-500/20 text-red-400' :
                scan.severity === 'Medium' ? 'bg-amber-500/20 text-amber-400' :
                'bg-emerald-500/20 text-emerald-400'
              }`}>
                {scan.severity || 'Normal'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mini Chart Section */}
      {scan.all_predictions && (
        <div className="p-4 border-t border-emerald-900/30">
          <div className="text-xs font-black text-emerald-500 uppercase tracking-widest mb-3 flex items-center gap-2">
            <FiBarChart3 className="text-sm" />
            Confidence Distribution
          </div>
          
          {/* Mini predictions display */}
          <div className="space-y-2">
            {Object.entries(scan.all_predictions)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 3)
              .map(([name, confidence]) => (
                <div key={name} className="flex items-center justify-between text-xs">
                  <span className="text-emerald-300 font-bold capitalize">{name}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1 bg-emerald-900/50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all"
                        style={{ width: `${confidence}%` }}
                      />
                    </div>
                    <span className="text-emerald-400 font-mono w-8 text-right">{confidence.toFixed(1)}%</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Details Section */}
      <div className="p-4 border-t border-emerald-900/30 space-y-2 text-xs text-emerald-200/70">
        {scan.cause && (
          <p>
            <span className="font-bold text-emerald-400">Cause: </span>
            {scan.cause.substring(0, 60)}...
          </p>
        )}
        {scan.organic_solution && (
          <p>
            <span className="font-bold text-emerald-400">Solution: </span>
            {typeof scan.organic_solution === 'string' 
              ? scan.organic_solution.substring(0, 60)
              : 'Available'}...
          </p>
        )}
      </div>

      {/* Action Button */}
      {onExpand && (
        <button
          onClick={onExpand}
          className="w-full p-3 bg-emerald-500/10 border-t border-emerald-900/30 hover:bg-emerald-500/20 text-emerald-400 font-black text-xs uppercase tracking-wider transition-all"
        >
          View Full Report
        </button>
      )}
    </div>
  );
};

export default ScanSummaryCard;
