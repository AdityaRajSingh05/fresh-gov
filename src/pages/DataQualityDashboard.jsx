import React, { useState, useEffect } from 'react'; // Added useEffect
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import SidebarToggle from '../components/SidebarToggle';
import axios from 'axios';
import { FiRefreshCw, FiDownload, FiAlertCircle, FiActivity, FiCheckCircle, FiLoader } from 'react-icons/fi';

const DataQualityDashboard = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    // 1. New states for data management
    const [rules, setRules] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // 2. Function to fetch data
    const fetchQualityRules = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get('http://localhost:3000/api/v1/quality');
            setRules(response.data); // Store the actual array in state
        } catch (err) {
            console.error('Error fetching quality rules:', err);
            setError('Failed to load quality data.');
        } finally {
            setLoading(false);
        }
    };

    // 3. Fetch data on component mount
    useEffect(() => {
        fetchQualityRules();
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
                        
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h1 className="text-2xl font-bold text-[#1e293b]">Data Quality Dashboard</h1>
                                <p className="text-slate-500 text-sm mt-1">Batch ID: Customer_Data_Batch_#080126</p>
                            </div>
                            <div className="flex gap-3">
                                <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg font-semibold shadow-sm hover:bg-slate-50 transition-all cursor-pointer">
                                    <FiDownload /> Download CSV
                                </button>
                                {/* 4. Added onClick and loading state to button */}
                                <button 
                                    onClick={fetchQualityRules}
                                    disabled={loading}
                                    className="flex items-center gap-2 bg-[#22c55e] text-white px-4 py-2 rounded-lg font-semibold shadow-sm hover:bg-green-600 transition-all cursor-pointer disabled:opacity-50"
                                >
                                    {loading ? <FiLoader className="animate-spin" /> : <FiRefreshCw />}
                                    {loading ? "Scanning..." : "Re-run Scan"}
                                </button>
                            </div>
                        </div>

                        {/* Metric Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-6">
                                <div className="w-14 h-14 bg-[#fff1f2] text-[#f43f5e] rounded-xl flex items-center justify-center">
                                    <FiAlertCircle className="w-7 h-7" />
                                </div>
                                <div>
                                    <div className="text-4xl font-bold text-slate-800">45%</div>
                                    <div className="text-slate-500 font-medium">Health Index</div>
                                </div>
                            </div>
                            {/* ... other cards ... */}
                        </div>

                        {/* Execution Table */}
                        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm">
                            <div className="p-6 flex justify-between items-center">
                                <h2 className="text-xl font-bold text-[#1e293b]">Execution Table</h2>
                                {error && <span className="text-red-500 text-sm">{error}</span>}
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="text-slate-400 text-sm font-semibold border-t border-b border-slate-50">
                                            <th className="px-8 py-5">Rule ID</th>
                                            <th className="px-8 py-5">Field Name</th>
                                            <th className="px-8 py-5">Score</th>
                                            <th className="px-8 py-5">Status</th>
                                            <th className="px-8 py-5">Diagnostic Detail</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-slate-700">
                                        {/* 5. Map over the 'rules' state array */}
                                        {!loading && rules.map((rule, idx) => (
                                            <tr key={rule.id || idx} className="border-b border-slate-50 last:border-0">
                                                <td className="px-8 py-6 text-slate-500">{rule.id}</td>
                                                <td className="px-8 py-6 font-semibold text-slate-800">{rule.field}</td>
                                                <td className={`px-8 py-6 font-semibold ${rule.status === 'FAIL' ? 'text-[#ef4444]' : 'text-[#22c55e]'}`}>
                                                    {rule.score}
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className={`font-semibold ${rule.status === 'FAIL' ? 'text-[#ef4444]' : 'text-[#22c55e]'}`}>
                                                        {rule.status}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6 text-slate-600">{rule.details || rule.detail}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {/* 6. Loading UI */}
                                {loading && (
                                    <div className="p-10 text-center text-slate-400">Loading quality data...</div>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DataQualityDashboard;