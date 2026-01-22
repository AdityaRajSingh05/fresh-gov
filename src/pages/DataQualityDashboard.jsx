import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import QualityKpiGrid from '../components/quality/QualityKpiGrid'; 
import QualityTable from '../components/quality/QualityTable';
import { FiRefreshCw, FiDownload, FiSearch, FiArrowLeft } from 'react-icons/fi';

const DataQualityDashboard = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [jobData, setJobData] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [loading, setLoading] = useState(true);
    const [isScanning, setIsScanning] = useState(false); 

    const fetchData = async (manual = false) => {
        if (manual) setIsScanning(true);
        else setLoading(true);

        try {
            if (manual) await new Promise(r => setTimeout(r, 1200));
            
            const response = await fetch(`http://localhost:3000/api/v1/quality_batch_job/${id}`);
            const result = await response.json();
            setJobData(result);
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
            setIsScanning(false);
        }
    };

    useEffect(() => { fetchData(); }, [id]);

    // --- NEW DOWNLOAD LOGIC ---
    const handleDownloadCSV = () => {
        if (!jobData || !jobData.execution_rules) return;

        // 1. Define CSV Headers
        const headers = ["ID", "Field Name", "Rule Type", "Score", "Status", "Diagnostic Detail"];
        
        // 2. Map the execution rules to CSV rows
        const rows = jobData.execution_rules.map(rule => [
            `"${rule.id}"`,
            `"${rule.field}"`,
            `"${rule.rule_type || ''}"`,
            `"${rule.score}%"`,
            `"${rule.status}"`,
            `"${rule.diagnostic_detail || ''}"`
        ]);

        // 3. Combine headers and rows
        const csvContent = [
            headers.join(","),
            ...rows.map(row => row.join(","))
        ].join("\n");

        // 4. Create a Blob and trigger download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `DataQuality_Report_${id}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const filteredRules = jobData?.execution_rules.filter(rule => {
        const matchesStatus = statusFilter === 'ALL' || rule.status === statusFilter;
        const matchesSearch = rule.field.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             rule.id.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    }) || [];

    return (
        <div className="flex min-h-screen bg-[#f8fafc] font-inter antialiased">
            <Sidebar isOpen={true} />
            <div className="flex-1 flex flex-col min-w-0">
                <Header />
                <main className="flex-1 p-6 lg:p-10">
                    <div className="max-w-[1400px] mx-auto">
                        
                        <button 
                            onClick={() => navigate('/quality')} 
                            className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600 mb-6 transition-colors"
                        >
                            <FiArrowLeft /> Back to Batch List
                        </button>

                        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-10">
                            <div>
                                <h1 className="text-3xl font-[800] text-slate-900 tracking-tight">
                                    {jobData?.batch_name || 'Loading Batch...'}
                                </h1>
                                <p className="mt-2 text-sm font-medium text-slate-500 uppercase tracking-wide">
                                    {jobData?.entity_type} Analysis Report
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <button 
                                    onClick={() => fetchData(true)} 
                                    disabled={isScanning}
                                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-sm transition-all ${
                                        isScanning ? 'bg-slate-400' : 'bg-blue-600 hover:bg-blue-700'
                                    }`}
                                >
                                    <FiRefreshCw className={isScanning ? 'animate-spin' : ''} /> 
                                    {isScanning ? 'SCANNING...' : 'RE-RUN SCAN'}
                                </button>
                                
                                {/* UPDATED BUTTON */}
                                <button 
                                    onClick={handleDownloadCSV}
                                    className="flex items-center gap-2 bg-white border border-slate-200 px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all active:scale-95"
                                >
                                    <FiDownload /> DOWNLOAD CSV
                                </button>
                            </div>
                        </div>

                        <div className="mb-10">
                            {jobData && <QualityKpiGrid executionRules={jobData.execution_rules} />}
                        </div>

                        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-slate-100 flex flex-col lg:flex-row justify-between lg:items-center gap-4">
                                <div>
                                    <h2 className="text-base font-bold text-slate-900">Rule Execution Log</h2>
                                    <p className="mt-1 text-sm font-medium text-slate-500">
                                        Detailed breakdown of validation rules applied to this batch
                                    </p>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3">
                                    <div className="flex bg-slate-100 p-1 rounded-xl">
                                        {['ALL', 'FAIL', 'PASS'].map(s => (
                                            <button 
                                                key={s} 
                                                onClick={() => setStatusFilter(s)} 
                                                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                                    statusFilter === s ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
                                                }`}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="relative">
                                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                        <input 
                                            type="text" 
                                            placeholder="Search fields..." 
                                            className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-blue-400 w-full sm:w-64" 
                                            onChange={(e) => setSearchTerm(e.target.value)} 
                                        />
                                    </div>
                                </div>
                            </div>
                            <QualityTable data={filteredRules} />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DataQualityDashboard;