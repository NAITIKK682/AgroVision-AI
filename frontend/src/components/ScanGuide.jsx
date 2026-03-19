import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { FiBookOpen, FiSun, FiAperture, FiMaximize2 } from 'react-icons/fi';

const ScanGuide = () => {
  const { t } = useLanguage();

 
  const steps = [
    {
      icon: <FiSun className="text-xl text-emerald-400" />,
      title: "Step 1: Surface & Light",
      description: 'Place the leaf on a flat surface with natural, bright lighting',
    },
    {
      icon: <FiAperture className="text-xl text-emerald-400" />,
      title: "Step 2: Shadow Control",
      description: 'Ensure no harsh shadows or obstructions fall on the leaf texture',
    },
    {
      icon: <FiMaximize2 className="text-xl text-emerald-400" />,
      title: "Step 3: Precision Focus",
      description: 'Maintain a distance of 15cm and wait for the camera to lock focus',
    },
  ];

  return (
    <div className="bg-[#05150e]/80 backdrop-blur-xl rounded-[2.5rem] p-8 border border-emerald-900/30 shadow-2xl">
      <h3 className="text-xs font-black text-emerald-500 mb-8 uppercase tracking-[0.2em] flex items-center gap-3">
        <FiBookOpen className="text-lg" />
        Scanning Protocol
      </h3>
      
      <div className="space-y-6">
        {steps.map((step, index) => (
          <div key={index} className="flex gap-6 group">
            <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shadow-lg group-hover:bg-emerald-500 group-hover:text-[#020d08] transition-all duration-300">
              <div className="group-hover:text-[#020d08]">
                {step.icon}
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <h4 className="font-black text-white text-sm uppercase tracking-wider mb-1">
                {step.title}
              </h4>
              <p className="text-emerald-100/40 text-sm font-medium leading-relaxed group-hover:text-emerald-100/70 transition-colors">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      
    </div>
  );
};

export default ScanGuide;