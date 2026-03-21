import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine
} from 'recharts';
import { FiTrendingUp, FiActivity, FiInfo } from 'react-icons/fi';

/**
 * PredictionChart - Enterprise-Grade AI Confidence Visualization
 * Enhanced with:
 * - Premium Glassmorphism & Depth
 * - Dynamic Reference Lines for Accuracy Thresholds
 * - Memoized Data Processing
 * - High-Contrast Accessible Typography
 * - Polished Micro-interactions
 * - Theme-aware professional color palette
 */
const PredictionChart = ({ predictions, diseaseHighlight }) => {
  // Memoize data transformation for performance optimization
  const chartData = useMemo(() => {
    if (!predictions || Object.keys(predictions).length === 0) return [];

    return Object.entries(predictions)
      .map(([label, value]) => ({
        name: label,
        confidence: typeof value === 'number' ? value : parseFloat(value),
        isHighlight: label.toLowerCase() === diseaseHighlight?.toLowerCase(),
      }))
      .sort((a, b) => b.confidence - a.confidence);
  }, [predictions, diseaseHighlight]);

  if (chartData.length === 0) return null;

  // Premium Palette System - Optimized for "Blight" / Professional Medical UI
  const colors = {
    primary: '#10b981',    // Emerald 500 (Primary Health/Success)
    secondary: '#3b82f6',  // Blue 500 (Trust/Data)
    accent: '#6366f1',     // Indigo 500 (Neural/AI)
    bg: 'rgba(5, 21, 14, 0.85)',
    border: 'rgba(16, 185, 129, 0.2)',
    textMuted: '#94a3b8',
    textHighlight: '#a7f3d0'
  };

  const getBarColor = (entry, index) => {
    if (entry.isHighlight) return colors.primary;
    return index === 0 ? colors.secondary : colors.accent;
  };

  // Custom Enhanced Tooltip Component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#020d08] border-2 border-emerald-500/50 backdrop-blur-md p-4 rounded-xl shadow-2xl">
          <p className="text-emerald-400 font-black text-xs uppercase tracking-tighter mb-1">{label}</p>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-white">
              {payload[0].value.toFixed(2)}%
            </span>
            <span className="text-[10px] text-emerald-500/70 font-mono">CONFIDENCE</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="group relative bg-[#05150e]/90 border border-emerald-900/30 rounded-[2.5rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden transition-all duration-500 hover:border-emerald-500/40">
      {/* Decorative Background Element */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/5 blur-[100px] rounded-full group-hover:bg-emerald-500/10 transition-colors" />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 rounded-2xl">
            <FiActivity className="text-emerald-400 text-2xl animate-pulse" />
          </div>
          <div>
            <h3 className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.3em] leading-none mb-1">
              Neural Network Output
            </h3>
            <p className="text-white text-lg font-bold tracking-tight">Confidence Analysis</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 bg-black/40 px-4 py-2 rounded-full border border-emerald-900/20">
          <FiInfo className="text-emerald-500/60" />
          <span className="text-[10px] text-emerald-400/80 font-medium">Model v4.2.0-Production</span>
        </div>
      </div>

      {/* Chart Container */}
      <div className="w-full h-[350px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(16, 185, 129, 1)" />
                <stop offset="100%" stopColor="rgba(16, 185, 129, 0.4)" />
              </linearGradient>
            </defs>
            
            <CartesianGrid 
              vertical={false} 
              strokeDasharray="4 4" 
              stroke="rgba(16, 185, 129, 0.08)" 
            />
            
            <XAxis
              dataKey="name"
              axisLine={{ stroke: 'rgba(16, 185, 129, 0.2)', strokeWidth: 1 }}
              tickLine={false}
              angle={-25}
              textAnchor="end"
              interval={0}
              height={80}
              tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700, letterSpacing: '0.025em' }}
              label={{ value: 'DIAGNOSIS CATEGORY', position: 'insideBottom', offset: -45, fill: '#10b981', fontSize: 10, fontWeight: 800, letterSpacing: '0.1em' }}
            />
            
            <YAxis
              axisLine={{ stroke: 'rgba(16, 185, 129, 0.2)', strokeWidth: 1 }}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }}
              domain={[0, 100]}
              tickCount={6}
              label={{ value: 'CONFIDENCE (%)', angle: -90, position: 'insideLeft', offset: 15, fill: '#10b981', fontSize: 10, fontWeight: 800, letterSpacing: '0.1em' }}
            />

            <Tooltip 
              cursor={{ fill: 'rgba(16, 185, 129, 0.05)', radius: 12 }} 
              content={<CustomTooltip />}
            />

            {/* Threshold Reference Line */}
            <ReferenceLine 
              y={85} 
              stroke="rgba(16, 185, 129, 0.3)" 
              strokeDasharray="3 3"
              label={{ position: 'right', value: 'OPTIMAL THRESHOLD', fill: 'rgba(16, 185, 129, 0.5)', fontSize: 9, fontWeight: 800, textTransform: 'uppercase' }} 
            />

            <Bar 
              dataKey="confidence" 
              radius={[10, 10, 4, 4]} 
              barSize={48}
              animationBegin={200}
              animationDuration={1500}
              animationEasing="ease-out"
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={getBarColor(entry, index)}
                  className="transition-all duration-300 hover:opacity-80"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Modern Legend Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-8 border-t border-emerald-900/20">
        <LegendItem color={colors.primary} label="High Confidence" />
        <LegendItem color={colors.secondary} label="Secondary Signal" />
        <LegendItem color={colors.accent} label="Differential Analysis" />
      </div>
    </div>
  );
};

// Internal Sub-component for Legend consistency
const LegendItem = ({ color, label }) => (
  <div className="flex items-center gap-3 group/item cursor-default">
    <div 
      className="w-3 h-3 rounded-full transition-transform duration-300 group-hover/item:scale-125" 
      style={{ backgroundColor: color, boxShadow: `0 0 15px ${color}66` }}
    />
    <div className="flex flex-col">
      <span className="text-white text-[11px] font-bold tracking-tight uppercase">{label}</span>
    </div>
  </div>
);

export default PredictionChart;