import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import SidebarToggle from '../components/SidebarToggle';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { FiRefreshCw, FiDownload, FiAlertCircle, FiActivity, FiCheckCircle, FiLoader } from 'react-icons/fi';

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

    // 4. Function to download Excel file
    const downloadExcel = () => {
        if (rules.length === 0) {
            alert('No data to download');
            return;
        }

        // Transform the data for Excel
        const excelData = rules.map((rule) => ({
            'Rule ID': rule.id,
            'Field Name': rule.field,
            'Score': rule.score,
            'Status': rule.status,
            'Diagnostic Detail': rule.details || rule.detail,
        }));

        // Create a new workbook and worksheet
        const worksheet = XLSX.utils.json_to_sheet(excelData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Quality Rules');

        // Set column widths
        worksheet['!cols'] = [
            { wch: 12 },
            { wch: 18 },
            { wch: 12 },
            { wch: 12 },
            { wch: 30 },
        ];

        // Generate filename with timestamp
        const timestamp = new Date().toISOString().split('T')[0];
        const filename = `DataQuality_${timestamp}.xlsx`;

        // Trigger download
        XLSX.writeFile(workbook, filename);
    };

    return (
        <div className="flex min-h-screen bg-[#f8fafc] font-inter">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

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
                                    onClick={downloadExcel}
                                    disabled={loading || rules.length === 0}
                                    className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg font-semibold shadow-sm hover:bg-slate-50 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <FiDownload /> Download Excel
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