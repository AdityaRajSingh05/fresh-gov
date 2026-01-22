import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import SidebarToggle from '../components/SidebarToggle';
import { FiPlus } from 'react-icons/fi';

const Dashboard = () => {
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [datasets, setDatasets] = useState([]);

    // Fetch datasets from dbs.json
    useEffect(() => {
        const fetchDatasets = async () => {
            try {
                const response = await axios.get("http://localhost:3000/api/v1/datasets");
                setDatasets(response.data);
            } catch (error) {
                console.error("Error fetching datasets:", error);
            }
        };
        fetchDatasets();
    }, []);

    return (
        <div className="flex min-h-screen bg-[#f8fafc] font-inter">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <div className="flex-1 flex flex-col min-w-0">
                <header className="header-with-toggle">
                    <SidebarToggle isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
                    <Header />
                </header>

                <main className="flex-1 p-8">
                    <div className="max-w-7xl mx-auto">
                        
                        {/* Header Section with Navigation Button */}
                        <div className="flex justify-between items-center mb-8">
                            <h1 className="text-2xl font-bold text-[#1e293b]">Data Steward Dashboard</h1>
                            <button 
                                onClick={() => navigate('/register')}
                                className="flex items-center gap-2 bg-[#3b82f6] text-white px-4 py-2 rounded-lg font-semibold shadow-sm hover:bg-blue-700 transition-all cursor-pointer"
                            >
                                <FiPlus />
                                Register Dataset
                            </button>
                        </div>

                        {/* Metric Cards - Exact UI from your Screenshot */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            {/* Total Datasets Card */}
                            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-6">
                                <div className="w-14 h-14 bg-[#eff6ff] text-[#3b82f6] rounded-xl flex items-center justify-center">
                                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                                    </svg>
                                </div>
                                <div>
                                    <div className="text-4xl font-bold text-slate-800">{datasets.length}</div>
                                    <div className="text-slate-500 font-medium">Total Datasets</div>
                                </div>
                            </div>

                            {/* Active Rules Card */}
                            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-6">
                                <div className="w-14 h-14 bg-[#fffbeb] text-[#f59e0b] rounded-xl flex items-center justify-center">
                                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                                <div>
                                    <div className="text-4xl font-bold text-slate-800">3</div>
                                    <div className="text-slate-500 font-medium">Active Rules</div>
                                </div>
                            </div>

                            {/* Lineage Mapping Card */}
                            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-6">
                                <div className="w-14 h-14 bg-[#faf5ff] text-[#a855f7] rounded-xl flex items-center justify-center">
                                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                    </svg>
                                </div>
                                <div>
                                    <div className="text-4xl font-bold text-slate-800">4</div>
                                    <div className="text-slate-500 font-medium">Lineage Mapping</div>
                                </div>
                            </div>
                        </div>

                        {/* Registered Dataset Table */}
                        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm">
                            <div className="p-6 flex justify-between items-center">
                                <h2 className="text-xl font-bold text-[#1e293b]">Registered Dataset</h2>
                                <button 
                                    onClick={() => navigate('/all-datasets')}
                                    className="text-sm font-medium text-slate-500 border border-slate-200 px-4 py-1.5 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
                                >View All</button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="text-slate-400 text-sm font-semibold border-t border-b border-slate-50">
                                            <th className="px-8 py-5">Name</th>
                                            <th className="px-8 py-5">Domain</th>
                                            <th className="px-8 py-5">Classification</th>
                                            <th className="px-8 py-5">Source Type</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-slate-700">
                                        {datasets.map((ds) => (
                                            <tr key={ds.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/30 transition-colors">
                                                <td className="px-8 py-6 font-semibold text-slate-800">{ds.name}</td>
                                                <td className="px-8 py-6 text-slate-600">{ds.domain || "Sales"}</td>
                                                <td className="px-8 py-6">
                                                    {/* Classification: Pure simple text colors matching your Quality page style */}
                                                    <span className={`font-bold uppercase text-xs tracking-wider ${
                                                        ds.classification === 'SENSITIVE' ? 'text-red-500' : 
                                                        ds.classification === 'CONFIDENTIAL' ? 'text-yellow-500' : 
                                                        ds.classification === 'INTERNAL' ? 'text-green-500' : 'text-slate-500'
                                                    }`}>
                                                        {ds.classification}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6 text-slate-600">{ds.source_type || "CSV"}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;