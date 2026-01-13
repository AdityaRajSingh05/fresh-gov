import React from 'react';
import { FiAlertCircle } from 'react-icons/fi';

const QualityKpiGrid = ({ healthScore, totalRecords, activeRules, failedCount }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Health Index</p>
        <p className={`text-4xl font-black tracking-tighter ${healthScore < 70 ? 'text-rose-500' : 'text-emerald-500'}`}>
          {healthScore}%
        </p>
        <div className="mt-3 space-y-1">
          <div className="flex items-center gap-2 text-[8px] font-bold text-slate-400 uppercase"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Good ≥ 90%</div>
          <div className="flex items-center gap-2 text-[8px] font-bold text-slate-400 uppercase"><span className="h-1.5 w-1.5 rounded-full bg-rose-500" /> Critical &lt; 70%</div>
        </div>
      </div>
      <div className={`w-16 h-16 rounded-full border-[6px] ${healthScore < 70 ? 'border-rose-500' : 'border-emerald-500'} border-t-slate-100 animate-spin-slow`}></div>
    </div>

    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-center">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Batch Metrics</p>
      <div className="flex justify-between items-end">
        <div><p className="text-3xl font-black text-slate-800 leading-none">{totalRecords}</p><p className="text-[10px] font-bold text-slate-400 uppercase mt-2">Records Scanned</p></div>
        <div className="text-right"><p className="text-xl font-black text-slate-800 leading-none">{activeRules}</p><p className="text-[10px] font-bold text-slate-400 uppercase mt-2">Active Rules</p></div>
      </div>
    </div>

    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-6">
      <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center"><FiAlertCircle size={32} /></div>
      <div><p className="text-3xl font-black text-rose-600 tracking-tighter">{failedCount.toString().padStart(2, '0')}</p><p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Failed Validations</p></div>
    </div>
  </div>
);

export default QualityKpiGrid;