import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import SidebarToggle from '../components/SidebarToggle';
import { FiArrowRight, FiHardDrive, FiClock, FiSearch, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

const QualityBatchList = () => {
  const [batches, setBatches] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3000/api/v1/quality_batch_job')
      .then(res => res.json())
      .then(data => setBatches(data))
      .catch(err => console.error("Error:", err));
  }, []); 

  const filteredBatches = batches.filter(b => 
    b.batch_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-[#F9FAFB] font-inter antialiased">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center px-6 py-4 bg-white border-b border-slate-200 sticky top-0 z-10">
          <SidebarToggle isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
          <Header />
        </header>

        <main className="flex-1 p-8 lg:p-12">
          <div className="max-w-[1400px] mx-auto">
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
              <div>
                <h1 className="text-2xl font-bold text-[#1e293b] tracking-tight">
                  Data Quality Tables
                </h1> 
                <p className="mt-2 text-sm font-medium text-slate-500">
                  Monitoring dataset integrity and validation history
                </p>
              </div>

              <div className="relative w-full md:w-72">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Search datasets..." 
                  className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-[13px] font-medium outline-none focus:border-blue-500 shadow-sm transition-all"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Grid with Subtler Curves (rounded-3xl / 1.5rem) */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredBatches.map( batch => (
                <div 
                  key={batch.id}
                  onClick={() => navigate(`/quality/${batch.id}`)}
                  className="bg-white border rounded-2xl border-slate-100 p-7 shadow-sm cursor-pointer flex flex-col hover:border-blue-400 transition-colors group"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 bg-slate-50 text-slate-600 rounded-xl flex items-center justify-center border border-slate-100">
                      <FiHardDrive size={22} />
                    </div>
                    
                    {/* Professional Health Badge */}
                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border text-[10px] font-bold tracking-tight ${
                      batch.health_score < 70 
                        ? 'bg-red-50 text-red-600 border-red-100' 
                        : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                    }`}>
                      {batch.health_score < 70 ? <FiAlertCircle size={12} /> : <FiCheckCircle size={12} />}
                      {batch.health_score}% HEALTH
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-[13px] font-[800] text-[#111827] tracking-tight mb-1 group-hover:text-blue-400 transition-colors">
                      {batch.batch_name}
                    </h3>
                    <p className="text-[13px] font-medium text-slate-500">
                      {batch.entity_type}
                    </p>
                  </div>

                  {/* Clean Stats Section */}
                  <div className="flex items-center gap-8 mb-8">
                    <div>
                      <p className="">Records</p>
                      <p className="text-sm font-bold text-slate-700">{batch.total_records.toLocaleString()}</p>
                    </div>
                    <div className="h-8 w-[1px] bg-slate-100"></div>
                    <div>
                      <p className="text-sm font-bold text-slate-700">Rules</p>
                      <p className="text-sm font-bold text-slate-700">{batch.active_rules}</p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="pt-5 border-t border-slate-100 flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-2 text-slate-400">
                      <FiClock size={14} />
                      <span className="text-[11px] font-medium">{batch.last_run}</span>
                    </div>
                    <div className="text-slate-300 group-hover:text-blue-600 transition-all transform group-hover:translate-x-1">
                      <FiArrowRight size={18} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default QualityBatchList;