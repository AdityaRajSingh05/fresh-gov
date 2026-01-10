import React, { useState } from 'react';
import Sidebar from '../Sidebar';
import Header from '../Header'; // Ensure this file exists in src/components/
import { FiDatabase, FiShield, FiAlertCircle, FiActivity } from 'react-icons/fi';

const DataStewardDashboard = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Mock data for the dashboard stats
  const stats = [
    { id: 1, label: 'Total Datasets', value: '1,284', icon: <FiDatabase />, color: 'bg-blue-500' },
    { id: 2, label: 'Governance Score', value: '82%', icon: <FiShield />, color: 'bg-emerald-500' },
    { id: 3, label: 'Pending Approvals', value: '12', icon: <FiAlertCircle />, color: 'bg-amber-500' },
    { id: 4, label: 'Active Policies', value: '45', icon: <FiActivity />, color: 'bg-indigo-500' },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* 1. Sidebar - Handles its own collapsed state internally */}
      <Sidebar 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Header - Includes Mobile Toggle */}
        <Header onMenuClick={() => setIsMobileMenuOpen(true)} />
        
        {/* Scrollable Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            
            {/* Welcome Header */}
            <div>
              <h1 className="text-2xl font-black text-slate-900">Data Steward Overview</h1>
              <p className="text-slate-500 text-sm mt-1">Monitor your data catalog and governance health.</p>
            </div>

            {/* Stats Grid - Responsive (1 col on mobile, 4 on desktop) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat) => (
                <div key={stat.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                      <h3 className="text-2xl font-black text-slate-900 mt-1">{stat.value}</h3>
                    </div>
                    <div className={`${stat.color} p-3 rounded-xl text-white shadow-lg`}>
                      {stat.icon}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Content Sections Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Activity (Wider) */}
              <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="font-bold text-slate-800">Recent Dataset Registrations</h3>
                  <button className="text-blue-600 text-sm font-bold hover:underline">View All</button>
                </div>
                <div className="p-0">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50/50">
                      <tr>
                        <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Dataset Name</th>
                        <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Owner</th>
                        <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {[1, 2, 3].map((item) => (
                        <tr key={item} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-4 font-semibold text-slate-700">Customer_Churn_2026_Q1</td>
                          <td className="p-4 text-slate-500">Marketing_Team</td>
                          <td className="p-4">
                            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase">Active</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Quick Actions (Narrow) */}
              <div className="space-y-6">
                <div className="bg-indigo-900 text-white p-6 rounded-2xl shadow-xl relative overflow-hidden group">
                  <div className="relative z-10">
                    <h3 className="font-bold text-lg">Need to register data?</h3>
                    <p className="text-indigo-200 text-xs mt-2 mb-4">Quickly add new metadata and classification to the catalog.</p>
                    <button className="w-full py-3 bg-white text-indigo-900 rounded-xl font-black text-sm hover:bg-indigo-50 transition-colors">
                      Start Registration
                    </button>
                  </div>
                  <FiDatabase className="absolute -bottom-4 -right-4 text-white/10 w-32 h-32 transform group-hover:scale-110 transition-transform" />
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default DataStewardDashboard;