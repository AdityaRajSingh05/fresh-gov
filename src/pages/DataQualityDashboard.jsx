// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import Sidebar from '../components/Sidebar';
// import Header from '../components/Header';
// import SidebarToggle from '../components/SidebarToggle';
// import axios from 'axios';
// import * as XLSX from 'xlsx';
// import { FiRefreshCw, FiDownload, FiAlertCircle, FiActivity, FiCheckCircle, FiLoader } from 'react-icons/fi';

// const DataQualityDashboard = () => {
//     const { id } = useParams();
//     const navigate = useNavigate();
//     const [jobData, setJobData] = useState(null);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [statusFilter, setStatusFilter] = useState('ALL');
//     const [loading, setLoading] = useState(true);
//     const [isScanning, setIsScanning] = useState(false); 

//     const fetchData = async (manual = false) => {
//         if (manual) setIsScanning(true);
//         else setLoading(true);

//         try {
//             if (manual) await new Promise(r => setTimeout(r, 1200));
            
//             const response = await fetch(`http://localhost:3000/api/v1/quality_batch_job/${id}`);
//             const result = await response.json();
//             setJobData(result);
//         } catch (error) {
//             console.error("Error:", error);
//         } finally {
//             setLoading(false);
//             setIsScanning(false);
//         }
//     };

//     useEffect(() => { fetchData(); }, [id]);

//     // 4. Function to download Excel file
//     const downloadExcel = () => {
//         if (rules.length === 0) {
//             alert('No data to download');
//             return;
//         }

//         // Transform the data for Excel
//         const excelData = rules.map((rule) => ({
//             'Rule ID': rule.id,
//             'Field Name': rule.field,
//             'Score': rule.score,
//             'Status': rule.status,
//             'Diagnostic Detail': rule.details || rule.detail,
//         }));

//         // Create a new workbook and worksheet
//         const worksheet = XLSX.utils.json_to_sheet(excelData);
//         const workbook = XLSX.utils.book_new();
//         XLSX.utils.book_append_sheet(workbook, worksheet, 'Quality Rules');

//         // Set column widths
//         worksheet['!cols'] = [
//             { wch: 12 },
//             { wch: 18 },
//             { wch: 12 },
//             { wch: 12 },
//             { wch: 30 },
//         ];

//         // Generate filename with timestamp
//         const timestamp = new Date().toISOString().split('T')[0];
//         const filename = `DataQuality_${timestamp}.xlsx`;

//         // Trigger download
//         XLSX.writeFile(workbook, filename);
//     };

//     return (
//         <div className="flex min-h-screen bg-[#f8fafc] font-inter">
//             <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

//         // 1. Define CSV Headers
//         const headers = ["ID", "Field Name", "Rule Type", "Score", "Status", "Diagnostic Detail"];
        
//         // 2. Map the execution rules to CSV rows
//         const rows = jobData.execution_rules.map(rule ={'>'} [
//             `"${rule.id}"`,
//             `"${rule.field}"`,
//             `"${rule.rule_type || ''}"`,
//             `"${rule.score}%"`,
//             `"${rule.status}"`,
//             `"${rule.diagnostic_detail || ''}"`
//         ]);

//         // 3. Combine headers and rows
//         const csvContent = [
//             headers.join(","),
//             ...rows.map(row => row.join(","))
//         ].join("\n");

//         // 4. Create a Blob and trigger download
//         const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//         const url = URL.createObjectURL(blob);
//         const link = document.createElement("a");
//         link.setAttribute("href", url);
//         link.setAttribute("download", `DataQuality_Report_${id}.csv`);
//         link.style.visibility = 'hidden';
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//     };

//     const filteredRules = jobData?.execution_rules.filter(rule => {
//         const matchesStatus = statusFilter === 'ALL' || rule.status === statusFilter;
//         const matchesSearch = rule.field.toLowerCase().includes(searchTerm.toLowerCase()) || 
//                              rule.id.toLowerCase().includes(searchTerm.toLowerCase());
//         return matchesStatus && matchesSearch;
//     }) || [];

//     return (
//         <div className="flex min-h-screen bg-[#f8fafc] font-inter antialiased">
//             <Sidebar isOpen={true} />
//             <div className="flex flex-col flex-1 min-w-0">
//                 <Header />
//                 <main className="flex-1 p-6 lg:p-10">
//                     <div className="max-w-[1400px] mx-auto">
                        
//                         <button 
//                             onClick={() => navigate('/quality')} 
//                             className="flex items-center gap-2 mb-6 text-sm font-medium transition-colors text-slate-500 hover:text-blue-600"
//                         >
//                             <FiArrowLeft /> Back to Batch List
//                         </button>

//                         <div className="flex flex-col gap-6 mb-10 md:flex-row md:justify-between md:items-end">
//                             <div>
//                                 <h1 className="text-3xl font-[800] text-slate-900 tracking-tight">
//                                     {jobData?.batch_name || 'Loading Batch...'}
//                                 </h1>
//                                 <p className="mt-2 text-sm font-medium tracking-wide uppercase text-slate-500">
//                                     {jobData?.entity_type} Analysis Report
//                                 </p>
//                             </div>
//                             <div className="flex gap-3">
//                                 <button 
//                                     onClick={downloadExcel}
//                                     disabled={loading || rules.length === 0}
//                                     className="flex items-center gap-2 px-4 py-2 font-semibold transition-all bg-white border rounded-lg shadow-sm cursor-pointer border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                                 >
//                                     <FiDownload /> Download Excel
//                                 </button>
                                
//                                 {/* UPDATED BUTTON */}
//                                 <button 
//                                     onClick={handleDownloadCSV}
//                                     className="flex items-center gap-2 bg-white border border-slate-200 px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all active:scale-95"
//                                 >
//                                     <FiDownload /> DOWNLOAD CSV
//                                 </button>
//                             </div>
//                         </div>

//                         <div className="mb-10">
//                             {jobData && <QualityKpiGrid executionRules={jobData.execution_rules} />}
//                         </div>

//                         <div className="overflow-hidden bg-white border shadow-sm border-slate-200 rounded-2xl">
//                             <div className="flex flex-col justify-between gap-4 p-6 border-b border-slate-100 lg:flex-row lg:items-center">
//                                 <div>
//                                     <h2 className="text-base font-bold text-slate-900">Rule Execution Log</h2>
//                                     <p className="mt-1 text-sm font-medium text-slate-500">
//                                         Detailed breakdown of validation rules applied to this batch
//                                     </p>
//                                 </div>

//                                 <div className="flex flex-col gap-3 sm:flex-row">
//                                     <div className="flex p-1 bg-slate-100 rounded-xl">
//                                         {['ALL', 'FAIL', 'PASS'].map(s => (
//                                             <button 
//                                                 key={s} 
//                                                 onClick={() => setStatusFilter(s)} 
//                                                 className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
//                                                     statusFilter === s ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
//                                                 }`}
//                                             >
//                                                 {s}
//                                             </button>
//                                         ))}
//                                     </div>
//                                     <div className="relative">
//                                         <FiSearch className="absolute -translate-y-1/2 left-3 top-1/2 text-slate-400" size={14} />
//                                         <input 
//                                             type="text" 
//                                             placeholder="Search fields..." 
//                                             className="w-full py-2 pr-4 text-xs font-medium border outline-none pl-9 bg-slate-50 border-slate-200 rounded-xl focus:border-blue-400 sm:w-64" 
//                                             onChange={(e) => setSearchTerm(e.target.value)} 
//                                         />
//                                     </div>
//                                 </div>
//                             </div>
//                             <QualityTable data={filteredRules} />
//                         </div>
//                     </div>
//                 </main>
//             </div>
//         </div>
//     );
// };

// export default DataQualityDashboard;














// NEW CODE:- 
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import axios from 'axios';
import * as XLSX from 'xlsx/xlsx.mjs'; 
import { 
    FiRefreshCw, 
    FiDownload, 
    FiAlertCircle, 
    FiActivity, 
    FiCheckCircle, 
    FiLoader, 
    FiSearch, 
    FiArrowLeft 
} from 'react-icons/fi';

const DataQualityDashboard = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    // States
    const [jobData, setJobData] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:3000/api/v1/quality_batch_job/${id}`);
            const result = await response.json();
            
            console.log("Datavista API Response:", result); // DEBUG: Check your console!
            
            // If your API wraps data in a 'data' property, use result.data
            setJobData(result); 
        } catch (error) {
            console.error("Fetch Error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) fetchData();
    }, [id]);

    const filteredRules = jobData?.execution_rules?.filter(rule => {
        const matchesStatus = statusFilter === 'ALL' || rule.status === statusFilter;
        const matchesSearch = rule.field?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             rule.id?.toString().toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    }) || [];

    // 1. Loading State
    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#f8fafc]">
                <div className="flex flex-col items-center gap-4">
                    <FiLoader className="text-blue-600 animate-spin" size={40} />
                    <p className="font-medium tracking-tight text-slate-500">Loading Datavista Report...</p>
                </div>
            </div>
        );
    }

    // 2. Error/Empty State
    if (!jobData) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#f8fafc]">
                <div className="text-center">
                    <FiAlertCircle size={48} className="mx-auto mb-4 text-slate-300" />
                    <h2 className="text-xl font-bold text-slate-800">No Report Found</h2>
                    <p className="mb-6 text-slate-500">We couldn't find quality data for ID: {id}</p>
                    <button onClick={() => navigate('/quality')} className="font-bold text-blue-600 hover:underline">
                        Return to List
                    </button>
                </div>
            </div>
        );
    }

    // 3. Main UI
    return (
        <div className="flex min-h-screen bg-[#f8fafc] font-inter antialiased text-slate-900">
            <Sidebar isOpen={isSidebarOpen} />
            
            <div className="flex flex-col flex-1 min-w-0">
                <Header />
                <main className="flex-1 p-6 lg:p-10">
                    <div className="max-w-[1400px] mx-auto">
                        
                        <button 
                            onClick={() => navigate('/quality')} 
                            className="flex items-center gap-2 mb-8 text-sm font-bold transition-all text-slate-500 hover:text-blue-600"
                        >
                            <FiArrowLeft strokeWidth={3} /> BACK TO BATCHES
                        </button>

                        <div className="flex flex-col gap-6 mb-10 md:flex-row md:justify-between md:items-end">
                            <div>
                                <h1 className="text-4xl font-[900] text-slate-900 tracking-tight leading-none">
                                    {jobData.batch_name}
                                </h1>
                                <div className="flex items-center gap-3 mt-4">
                                    <span className="px-3 py-1 bg-blue-600 text-white text-[10px] font-black rounded-md uppercase tracking-widest">
                                        {jobData.entity_type}
                                    </span>
                                    <span className="text-sm font-bold text-slate-400">
                                        ID: {id}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Filter Section */}
                        <div className="flex flex-col items-center gap-4 p-2 mb-8 bg-white border shadow-sm border-slate-200 rounded-2xl sm:flex-row">
                            <div className="flex w-full p-1 bg-slate-100 rounded-xl sm:w-auto">
                                {['ALL', 'FAIL', 'PASS'].map(s => (
                                    <button 
                                        key={s} 
                                        onClick={() => setStatusFilter(s)} 
                                        className={`flex-1 sm:flex-none px-8 py-2 rounded-lg text-xs font-black transition-all ${
                                            statusFilter === s ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                                        }`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                            <div className="relative flex-1 w-full">
                                <FiSearch className="absolute -translate-y-1/2 left-4 top-1/2 text-slate-400" size={18} />
                                <input 
                                    type="text" 
                                    placeholder="Search by field or rule ID..." 
                                    className="w-full py-3 pl-12 pr-4 text-sm font-semibold transition-all border-none outline-none bg-slate-50 rounded-xl focus:ring-2 ring-blue-100" 
                                    onChange={(e) => setSearchTerm(e.target.value)} 
                                />
                            </div>
                        </div>

                        {/* Table / Results */}
                        <div className="overflow-hidden bg-white border shadow-sm border-slate-200 rounded-3xl">
                            <div className="p-6 border-b border-slate-100">
                                <h3 className="text-sm font-black tracking-tight uppercase text-slate-900">Execution Details</h3>
                            </div>
                            
                            {filteredRules.length > 0 ? (
                                <div className="p-6">
                                    {/* Map your table here using filteredRules */}
                                    <p className="text-sm italic text-slate-500">Displaying {filteredRules.length} results...</p>
                                </div>
                            ) : (
                                <div className="p-20 text-center">
                                    <p className="font-bold text-slate-400">No rules match your current filter.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DataQualityDashboard;