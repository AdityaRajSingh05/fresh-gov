import React from 'react';
import { FiActivity, FiCheckCircle, FiAlertCircle, FiDatabase } from 'react-icons/fi';

const QualityKpiGrid = ({ executionRules = [] }) => {
  // 1. Logic Fix: Calculate average health based on the "score" field in the JSON
  const totalRules = executionRules.length;
  const passedCount = executionRules.filter(r => r.status === 'PASS').length;
  const failedCount = executionRules.filter(r => r.status === 'FAIL').length;
  
  // We sum the 'score' property of each rule and divide by total rules
  const healthScore = totalRules > 0 
    ? Math.round(executionRules.reduce((acc, curr) => acc + (curr.score || 0), 0) / totalRules)
    : 0;

  // 2. Dynamic Color Logic
  const getHealthColor = (score) => {
    if (score >= 90) return '#10b981'; // Emerald-500
    if (score >= 70) return '#f59e0b'; // Amber-500
    return '#ef4444';                // Rose-500
  };

  const healthColor = getHealthColor(healthScore);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Health Index Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Health Index</p>
            <h3 className="text-4xl font-black text-slate-900">{healthScore}%</h3>
          </div>
          <div className="relative w-16 h-16">
            <svg className="w-full h-full" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#f1f5f9"
                strokeWidth="3"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke={healthColor}
                strokeWidth="3"
                strokeDasharray={`${healthScore}, 100`}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
          </div>
        </div>
        <div className="flex gap-4 mt-2">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <span className="text-[10px] text-slate-400 font-bold">GOOD &gt; 90%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-rose-500"></div>
            <span className="text-[10px] text-slate-400 font-bold">CRITICAL &lt; 70%</span>
          </div>
        </div>
      </div>

      {/* Batch Metrics Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-4">Batch Metrics</p>
        <div className="flex items-end justify-between">
          <div>
            <h3 className="text-3xl font-black text-slate-900">{totalRules}</h3>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-tight">Active Rules Scanned</p>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
            <FiDatabase size={24} />
          </div>
        </div>
      </div>

      {/* Validations Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-4">Validations</p>
        <div className="flex items-center gap-4">
          <div className="flex-1 flex items-center gap-3 bg-rose-50 p-3 rounded-2xl">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-rose-500 shadow-sm shrink-0">
              <FiAlertCircle size={20} />
            </div>
            <div>
              <h3 className="text-xl font-black text-rose-600">{failedCount.toString().padStart(2, '0')}</h3>
              <p className="text-rose-400 text-[10px] font-bold uppercase">Failed</p>
            </div>
          </div>
          <div className="flex-1 flex items-center gap-3 bg-emerald-50 p-3 rounded-2xl">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-emerald-500 shadow-sm shrink-0">
              <FiCheckCircle size={20} />
            </div>
            <div>
              <h3 className="text-xl font-black text-emerald-600">{passedCount.toString().padStart(2, '0')}</h3>
              <p className="text-emerald-400 text-[10px] font-bold uppercase">Passed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QualityKpiGrid;