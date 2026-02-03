import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { pdfService } from '../services/pdfService';
import { 
  FiDownload, 
  FiAlertTriangle, 
  FiCheckCircle, 
  FiSearch, 
  FiHelpCircle, 
  FiDroplet, 
  FiShield, 
  FiClock, 
  FiInfo,
  FiActivity
} from 'react-icons/fi';

const ResultDetails = ({ prediction, onDownloadPDF }) => {
  const { t, lang } = useLanguage();

  if (!prediction) return null;

  // Severity color logic based on dark theme
  const getSeverityStyle = (severity) => {
    switch (severity) {
      case 'Low': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'Medium': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'High': return 'text-red-400 bg-red-500/10 border-red-500/20';
      default: return 'text-zinc-400 bg-zinc-500/10 border-zinc-500/20';
    }
  };

  const handleDownload = () => {
    try {
      const doc = pdfService.generateOfflineReport(prediction, lang);
      pdfService.downloadPDF(doc, `agroviz-report-${Date.now()}.pdf`);
      
      if (onDownloadPDF) {
        onDownloadPDF(prediction);
      }
    } catch (error) {
      console.error('PDF download error:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  const InfoCard = ({ icon: Icon, label, value, colorClass = "text-white" }) => (
    <div className="bg-black/40 border border-emerald-900/30 rounded-2xl p-5 backdrop-blur-sm">
      <div className="flex items-center gap-3 mb-2 text-emerald-500/60 uppercase text-[10px] font-black tracking-widest">
        <Icon className="text-sm" />
        {label}
      </div>
      <div className={`text-lg font-black tracking-tight ${colorClass}`}>
        {value}
      </div>
    </div>
  );

  const DetailSection = ({ icon: Icon, title, content, borderClass = "border-emerald-900/30" }) => (
    <div className={`bg-[#05150e]/80 border ${borderClass} rounded-[2rem] p-8 shadow-xl transition-all hover:bg-[#061d13]`}>
      <h3 className="text-emerald-500 text-xs font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-3">
        <Icon className="text-lg" />
        {title}
      </h3>
      <p className="text-emerald-100/60 leading-relaxed font-medium whitespace-pre-line">
        {content}
      </p>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
      
      {/* Primary Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <InfoCard icon={FiActivity} label="CROP TYPE" value={prediction.crop_name} />
        <InfoCard 
          icon={FiAlertTriangle} 
          label="DIAGNOSIS" 
          value={prediction.disease_name} 
          colorClass="text-red-400" 
        />
        <InfoCard 
          icon={FiCheckCircle} 
          label="CONFIDENCE" 
          value={`${prediction.confidence}`} 
          colorClass="text-emerald-400" 
        />
        <div className={`border rounded-2xl p-5 flex flex-col justify-center ${getSeverityStyle(prediction.severity)}`}>
          <div className="uppercase text-[10px] font-black tracking-widest opacity-60 mb-1">Impact Level</div>
          <div className="text-lg font-black tracking-tight uppercase">{prediction.severity}</div>
        </div>
      </div>

      {/* Clinical Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {prediction.symptoms && (
          <DetailSection icon={FiSearch} title="Visual Markers" content={prediction.symptoms} />
        )}
        {prediction.cause && (
          <DetailSection icon={FiHelpCircle} title="Root Cause" content={prediction.cause} />
        )}
      </div>

      {/* Treatment Protocol */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {prediction.organic_solution && (
          <DetailSection 
            icon={FiDroplet} 
            title="Bio-Organic Protocol" 
            content={prediction.organic_solution} 
            borderClass="border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.05)]" 
          />
        )}
        {prediction.chemical_solution && (
          <DetailSection 
            icon={FiActivity} 
            title="Targeted Treatment" 
            content={prediction.chemical_solution} 
            borderClass="border-amber-900/30" 
          />
        )}
      </div>

      {/* Recovery & Safety */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {prediction.prevention && (
          <DetailSection icon={FiShield} title="Prevention" content={prediction.prevention} />
        )}
        {prediction.recovery_time && (
          <DetailSection icon={FiClock} title="Timeline" content={prediction.recovery_time} />
        )}
        {prediction.safety_tips && (
          <DetailSection icon={FiInfo} title="Risk Mitigation" content={prediction.safety_tips} borderClass="border-red-900/30" />
        )}
      </div>

      {/* Download Action */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-[2.5rem] p-10 text-center shadow-2xl overflow-hidden relative group">
        <div className="relative z-10">
          <h3 className="text-black font-black text-2xl mb-2 tracking-tight">Diagnostic Summary Ready</h3>
          <p className="text-emerald-950 font-bold mb-8 opacity-70">Download the full technical report for offline consultation.</p>
          <button 
            onClick={handleDownload} 
            className="inline-flex items-center gap-3 bg-black text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-zinc-900 transition-all shadow-2xl active:scale-95"
          >
            <FiDownload className="text-lg" />
            Generate Report
          </button>
        </div>
        {/* Background Decorative Element */}
        <div className="absolute right-0 top-0 opacity-10 translate-x-1/4 -translate-y-1/4 pointer-events-none">
          <FiActivity size={300} className="text-black" />
        </div>
      </div>
    </div>
  );
};

export default ResultDetails;