import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import { FiTrendingUp } from 'react-icons/fi';

/**
 * PredictionChart - Displays AI model predictions as an interactive bar chart
 * Shows confidence levels for each disease/class the model evaluated
 */
const PredictionChart = ({ predictions, diseaseHighlight }) => {
  if (!predictions || Object.keys(predictions).length === 0) {
    return null;
  }

  // Convert predictions object to array format for Recharts
  const chartData = Object.entries(predictions).map(([label, value]) => ({
    name: label,
    confidence: typeof value === 'number' ? value : parseFloat(value),
    isHighlight: label.toLowerCase() === diseaseHighlight?.toLowerCase()
  }));

  // Sort by confidence descending
  chartData.sort((a, b) => b.confidence - a.confidence);

  // Color scheme - highlight the top prediction
  const getBarColor = (isHighlight, index) => {
    if (isHighlight) return '#10b981'; // Emerald for predicted disease
    return index === 0 ? '#06b6d4' : '#8b5cf6'; // Cyan for top, purple for others
  };

  return (
    <div className="bg-[#05150e]/80 border border-emerald-900/30 rounded-[2rem] p-8 shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <FiTrendingUp className="text-emerald-400 text-xl" />
        <h3 className="text-emerald-500 text-xs font-black uppercase tracking-[0.2em]">
          Model Confidence Distribution
        </h3>
      </div>

      <div className="w-full h-[300px] overflow-hidden rounded-lg bg-black/40">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(16, 185, 129, 0.1)" />
            <XAxis
              dataKey="name"
              angle={-45}
              textAnchor="end"
              height={100}
              tick={{ fill: '#a7f3d0', fontSize: 12, fontWeight: 600 }}
            />
            <YAxis
              label={{ value: 'Confidence (%)', angle: -90, position: 'insideLeft', fill: '#a7f3d0' }}
              tick={{ fill: '#a7f3d0' }}
              domain={[0, 100]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#020d08',
                border: '2px solid #10b981',
                borderRadius: '8px',
                color: '#a7f3d0',
                fontWeight: 'bold'
              }}
              formatter={(value) => `${value.toFixed(2)}%`}
              labelStyle={{ color: '#10b981' }}
            />
            <Bar dataKey="confidence" radius={[8, 8, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.isHighlight, index)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend Info */}
      <div className="grid grid-cols-3 gap-3 mt-6 text-xs font-bold">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-emerald-500"></div>
          <span className="text-emerald-400">Predicted</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-cyan-500"></div>
          <span className="text-cyan-400">Top Match</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-purple-500"></div>
          <span className="text-purple-400">Other Class</span>
        </div>
      </div>
    </div>
  );
};

export default PredictionChart;
