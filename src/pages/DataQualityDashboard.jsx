// import { useState } from 'react';
// import { FiDownload, FiPlay, FiSearch, FiLoader } from 'react-icons/fi';
// import { useQualityData } from '../hooks/useQualityData';

// import Sidebar from '../components/Sidebar';
// import Header from '../components/Header';
// import SidebarToggle from '../components/SidebarToggle';
// import QualityKpiGrid from '../components/quality/QualityKpiGrid';
// import QualityTable from '../components/quality/QualityTable';

// const MOCK_DB = [
//     { id: "RULE-101", field: 'vendor_code', score: 45, status: 'FAIL', details: 'Duplicate vendor entries (204 rows).', date: '2026-01-08', json_response: { error: "Uniqueness Violation", count: 204, severity: "High" } },
//     { id: "RULE-102", field: 'info_json.score', score: 45, status: 'FAIL', details: null, date: '2026-01-08', json_response: null },
//     { id: "RULE-103", field: 'customer_email', score: 98, status: 'PASS', details: 'RFC standards compliant.', date: '2026-01-08', json_response: { status: "Verified", engine: "Regex_v2" } },
//     { id: "RULE-104", field: 'postal_code', score: 92, status: 'PASS', details: 'Correct length check passed.', date: '2026-01-08', json_response: { length: 5, type: "INT" } },
//     { id: "RULE-105", field: 'transaction_id', score: 100, status: 'PASS', details: 'No null values found.', date: '2026-01-08', json_response: { null_count: 0 } }
// ];

// function DataQualityDashboard() {
//     const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
//     const [searchQuery, setSearchQuery] = useState('');
//     const { filter, setFilter, filteredData, isScanning, runScan } = useQualityData(MOCK_DB);

//     const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
//     const closeSidebar = () => setSidebarOpen(false);

//     // CSV DOWNLOAD LOGIC
//     const downloadCSV = () => {
//         const headers = "ID,Field,Score,Status,Details\n";
//         const csvContent = filteredData.map(r => `${r.id},${r.field},${r.score},${r.status},${r.details || 'N/A'}`).join("\n");
//         const blob = new Blob([headers + csvContent], { type: 'text/csv' });
//         const url = window.URL.createObjectURL(blob);
//         const a = document.createElement('a');
//         a.setAttribute('href', url);
//         a.setAttribute('download', 'DQ_Quality_Report.csv');
//         a.click();
//     };

//     return (
//         <div className="flex min-h-screen">
//             {/* Sidebar */}
//             <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

//             {/* Main Content */}
//             <main className="flex-1 min-w-0 overflow-x-hidden bg-background">
//                 {/* Header with Toggle */}
//                 <header className="header-with-toggle">
//                     <SidebarToggle isOpen={sidebarOpen} onToggle={toggleSidebar} />
//                     <Header
//                         searchValue={searchQuery}
//                         onSearchChange={(e) => setSearchQuery(e.target.value)}
//                         searchPlaceholder="Search quality rules..."
//                     />
//                 </header>

//                 {/* Content Area */}
//                 <div className="p-6">
//                     {/* Page Title & Actions */}
//                     <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
//                         <div>
//                             <h1 className="text-2xl font-bold text-foreground">
//                                 Data Quality Dashboard
//                             </h1>
//                             <p className="text-sm text-primary mt-1 font-semibold">
//                                 Customer_Data_Batch_#080126
//                             </p>
//                         </div>
//                         <div className="flex gap-3 flex-shrink-0">
//                             <button
//                                 onClick={downloadCSV}
//                                 className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-slate-300 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
//                             >
//                                 <FiDownload size={16} />
//                                 <span className="whitespace-nowrap">DOWNLOAD CSV</span>
//                             </button>
//                             <button
//                                 onClick={runScan}
//                                 disabled={isScanning}
//                                 className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-bold hover:bg-green-700 disabled:opacity-50 transition-colors shadow-md"
//                             >
//                                 {isScanning ? <FiLoader size={16} className="animate-spin" /> : <FiPlay size={16} />}
//                                 <span className="whitespace-nowrap">{isScanning ? "SCANNING..." : "RE-RUN SCAN"}</span>
//                             </button>
//                         </div>
//                     </div>

//                     {/* KPI Grid */}
//                     <QualityKpiGrid
//                         healthScore={45}
//                         totalRecords="10,001"
//                         activeRules={MOCK_DB.length}
//                         failedCount={2}
//                     />

//                     {/* Quality Table */}
//                     <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden mt-6">
//                         <div className="px-6 py-4 border-b border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-50">
//                             <div className="flex items-center gap-6">
//                                 <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
//                                     Execution Table
//                                 </h3>
//                                 {/* Filter Buttons - Fixed styling for visibility */}
//                                 <div className="flex bg-white border-2 border-slate-300 rounded-lg p-1 shadow-sm">
//                                     {['ALL', 'FAIL', 'PASS'].map((type) => (
//                                         <button
//                                             key={type}
//                                             onClick={() => setFilter(type)}
//                                             className={`px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${filter === type
//                                                 ? 'bg-slate-900 text-white shadow-md'
//                                                 : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900'
//                                                 }`}
//                                         >
//                                             {type === 'ALL' ? 'SHOW ALL' : `ONLY ${type}S`}
//                                         </button>
//                                     ))}
//                                 </div>
//                             </div>
//                             <div className="relative">
//                                 <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
//                                 <input
//                                     type="text"
//                                     placeholder="Search field..."
//                                     className="pl-9 pr-4 py-2 bg-white border-2 border-slate-300 rounded-lg text-sm font-medium w-48 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
//                                     value={searchQuery}
//                                     onChange={(e) => setSearchQuery(e.target.value)}
//                                 />
//                             </div>
//                         </div>
//                         <QualityTable data={filteredData.filter(item =>
//                             item.field.toLowerCase().includes(searchQuery.toLowerCase())
//                         )} />
//                     </div>
//                 </div>
//             </main>
//         </div>
//     );
// }

// export default DataQualityDashboard;
















// NEW CODE QUALITY:-
import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import SidebarToggle from '../components/SidebarToggle';
import { FiRefreshCw, FiDownload, FiSearch, FiAlertCircle, FiActivity, FiCheckCircle } from 'react-icons/fi';

const DataQualityDashboard = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const qualityRules = [
        { id: 'RULE-101', field: 'vendor_code', score: '45%', status: 'FAIL', detail: 'Duplicate vendor entries (204 rows).' },
        { id: 'RULE-102', field: 'info_json.score', score: '45%', status: 'FAIL', detail: 'Value format mismatch in 12% of records.' },
        { id: 'RULE-103', field: 'customer_id', score: '98%', status: 'PASS', detail: 'Unique constraint satisfied.' },
        { id: 'RULE-104', field: 'creation_date', score: '100%', status: 'PASS', detail: 'No null values detected.' },
    ];

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
                        
                        {/* Header Section */}
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h1 className="text-2xl font-bold text-[#1e293b]">Data Quality Dashboard</h1>
                                <p className="text-slate-500 text-sm mt-1">Batch ID: Customer_Data_Batch_#080126</p>
                            </div>
                            <div className="flex gap-3">
                                <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg font-semibold shadow-sm hover:bg-slate-50 transition-all cursor-pointer">
                                    <FiDownload /> Download CSV
                                </button>
                                <button className="flex items-center gap-2 bg-[#22c55e] text-white px-4 py-2 rounded-lg font-semibold shadow-sm hover:bg-green-600 transition-all cursor-pointer">
                                    <FiRefreshCw /> Re-run Scan
                                </button>
                            </div>
                        </div>

                        {/* Metric Cards - Matches your Dashboard.jsx exactly */}
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

                            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-6">
                                <div className="w-14 h-14 bg-[#eff6ff] text-[#3b82f6] rounded-xl flex items-center justify-center">
                                    <FiActivity className="w-7 h-7" />
                                </div>
                                <div>
                                    <div className="text-4xl font-bold text-slate-800">10,001</div>
                                    <div className="text-slate-500 font-medium">Records Scanned</div>
                                </div>
                            </div>

                            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-6">
                                <div className="w-14 h-14 bg-[#f0fdf4] text-[#22c55e] rounded-xl flex items-center justify-center">
                                    <FiCheckCircle className="w-7 h-7" />
                                </div>
                                <div>
                                    <div className="text-4xl font-bold text-slate-800">02</div>
                                    <div className="text-slate-500 font-medium">Failed Rules</div>
                                </div>
                            </div>
                        </div>

                        {/* Execution Table - Simplified to match Dashboard table exactly */}
                        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm">
                            <div className="p-6 flex justify-between items-center">
                                <h2 className="text-xl font-bold text-[#1e293b]">Execution Table</h2>
                                <button className="text-sm font-medium text-slate-500 border border-slate-200 px-4 py-1.5 rounded-xl hover:bg-slate-50">View History</button>
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
                                        {qualityRules.map((rule, idx) => (
                                            <tr key={idx} className="border-b border-slate-50 last:border-0">
                                                <td className="px-8 py-6 text-slate-500">{rule.id}</td>
                                                <td className="px-8 py-6 font-semibold text-slate-800">{rule.field}</td>
                                                
                                                {/* Score Column - Just plain bold text */}
                                                <td className={`px-8 py-6 font-semibold ${
                                                    rule.status === 'FAIL' ? 'text-[#ef4444]' : 'text-[#22c55e]'
                                                }`}>
                                                    {rule.score}
                                                </td>

                                                {/* Status Column - Plain text matching Dashboard "Classification" style */}
                                                <td className="px-8 py-6">
                                                    <span className={`font-semibold ${
                                                        rule.status === 'FAIL' ? 'text-[#ef4444]' : 'text-[#22c55e]'
                                                    }`}>
                                                        {rule.status}
                                                    </span>
                                                </td>

                                                <td className="px-8 py-6 text-slate-600">{rule.detail}</td>
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

export default DataQualityDashboard;