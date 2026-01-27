// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import Sidebar from '../components/Sidebar';
// import Header from '../components/Header';
// import SidebarToggle from '../components/SidebarToggle';
// import { FiPlus } from 'react-icons/fi';

// const Dashboard = () => {
//     const navigate = useNavigate();
//     const [isSidebarOpen, setIsSidebarOpen] = useState(true);
//     const [datasets, setDatasets] = useState([]);

//     // Fetch datasets from dbs.json
//     useEffect(() => {
//         const fetchDatasets = async () => {
//             try {
//                 const response = await axios.get("http://localhost:3000/api/v1/datasets");
//                 setDatasets(response.data);
//             } catch (error) {
//                 console.error("Error fetching datasets:", error);
//             }
//         };
//         fetchDatasets();
//     }, []);

//     return (
//         <div className="flex min-h-screen bg-[#f8fafc] font-inter">
//             <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

//             <div className="flex-1 flex flex-col min-w-0">
//                 <header className="header-with-toggle">
//                     <SidebarToggle isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
//                     <Header />
//                 </header>

//                 <main className="flex-1 p-8">
//                     <div className="max-w-7xl mx-auto">
                        
//                         {/* Header Section with Navigation Button */}
//                         <div className="flex justify-between items-center mb-8">
//                             <h1 className="text-2xl font-bold text-[#1e293b]">Data Steward Dashboard</h1>
//                             <button 
//                                 onClick={() => navigate('/register')}
//                                 className="flex items-center gap-2 bg-[#3b82f6] text-white px-4 py-2 rounded-lg font-semibold shadow-sm hover:bg-blue-700 transition-all cursor-pointer"
//                             >
//                                 <FiPlus />
//                                 Register Dataset
//                             </button>
//                         </div>

//                         {/* Metric Cards - Exact UI from your Screenshot */}
//                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//                             {/* Total Datasets Card */}
//                             <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-6">
//                                 <div className="w-14 h-14 bg-[#eff6ff] text-[#3b82f6] rounded-xl flex items-center justify-center">
//                                     <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
//                                     </svg>
//                                 </div>
//                                 <div>
//                                     <div className="text-4xl font-bold text-slate-800">{datasets.length}</div>
//                                     <div className="text-slate-500 font-medium">Total Datasets</div>
//                                 </div>
//                             </div>

//                             {/* Active Rules Card */}
//                             <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-6">
//                                 <div className="w-14 h-14 bg-[#fffbeb] text-[#f59e0b] rounded-xl flex items-center justify-center">
//                                     <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
//                                     </svg>
//                                 </div>
//                                 <div>
//                                     <div className="text-4xl font-bold text-slate-800">3</div>
//                                     <div className="text-slate-500 font-medium">Active Rules</div>
//                                 </div>
//                             </div>

//                             {/* Lineage Mapping Card */}
//                             <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-6">
//                                 <div className="w-14 h-14 bg-[#faf5ff] text-[#a855f7] rounded-xl flex items-center justify-center">
//                                     <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
//                                     </svg>
//                                 </div>
//                                 <div>
//                                     <div className="text-4xl font-bold text-slate-800">4</div>
//                                     <div className="text-slate-500 font-medium">Lineage Mapping</div>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Registered Dataset Table */}
//                         <div className="bg-white border border-slate-100 rounded-2xl shadow-sm">
//                             <div className="p-6 flex justify-between items-center">
//                                 <h2 className="text-xl font-bold text-[#1e293b]">Registered Dataset</h2>
//                                 <button 
//                                     onClick={() => navigate('/all-datasets')}
//                                     className="text-sm font-medium text-slate-500 border border-slate-200 px-4 py-1.5 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
//                                 >View All</button>
//                             </div>
//                             <div className="overflow-x-auto">
//                                 <table className="w-full text-left">
//                                     <thead>
//                                         <tr className="text-slate-400 text-sm font-semibold border-t border-b border-slate-50">
//                                             <th className="px-8 py-5">Name</th>
//                                             <th className="px-8 py-5">Domain</th>
//                                             <th className="px-8 py-5">Classification</th>
//                                             <th className="px-8 py-5">Source Type</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody className="text-slate-700">
//                                         {datasets.map((ds) => (
//                                             <tr key={ds.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/30 transition-colors">
//                                                 <td className="px-8 py-6 font-semibold text-slate-800">{ds.name}</td>
//                                                 <td className="px-8 py-6 text-slate-600">{ds.domain || "Sales"}</td>
//                                                 <td className="px-8 py-6">
//                                                     {/* Classification: Pure simple text colors matching your Quality page style */}
//                                                     <span className={`font-bold uppercase text-xs tracking-wider ${
//                                                         ds.classification === 'SENSITIVE' ? 'text-red-500' : 
//                                                         ds.classification === 'CONFIDENTIAL' ? 'text-yellow-500' : 
//                                                         ds.classification === 'INTERNAL' ? 'text-green-500' : 'text-slate-500'
//                                                     }`}>
//                                                         {ds.classification}
//                                                     </span>
//                                                 </td>
//                                                 <td className="px-8 py-6 text-slate-600">{ds.source_type || "CSV"}</td>
//                                             </tr>
//                                         ))}
//                                     </tbody>
//                                 </table>
//                             </div>
//                         </div>
//                     </div>
//                 </main>
//             </div>
//         </div>
//     );
// };

// export default Dashboard;












// NEW CODE:-
import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import SidebarToggle from '../components/SidebarToggle';
import { FiPlus, FiEye, FiTrash2, FiX, FiAlertTriangle, FiDatabase, FiShield } from 'react-icons/fi';
// ADDED: Toast for professional feedback
import toast, { Toaster } from 'react-hot-toast';

const Dashboard = () => {
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [datasets, setDatasets] = useState([]);
    
    const [searchQuery, setSearchQuery] = useState("");
    
    const [selectedDataset, setSelectedDataset] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [datasetToDelete, setDatasetToDelete] = useState(null);

    // Fetch datasets
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

    const filteredDatasets = useMemo(() => {
        return datasets.filter(ds => 
            ds.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (ds.domain && ds.domain.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (ds.classification && ds.classification.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }, [datasets, searchQuery]);

    const handleView = (dataset) => {
        setSelectedDataset(dataset);
        setIsDrawerOpen(true);
    };

    const confirmDelete = (dataset) => {
        setDatasetToDelete(dataset);
        setIsDeleteModalOpen(true);
    };

    // --- UPDATED ACTION HANDLER ---
    const handleDelete = async () => {
        if (!datasetToDelete) return;

        const loadingToast = toast.loading('Deleting dataset from server...');

        try {
            // 1. DELETE FROM BACKEND DATABASE
            // This ensures it won't show up again when you login or refresh
            await axios.delete(`http://localhost:3000/api/v1/datasets/${datasetToDelete.id}`);

            // 2. UPDATE UI STATE
            setDatasets(datasets.filter(ds => ds.id !== datasetToDelete.id));
            
            toast.success('Dataset permanently removed.', { id: loadingToast });
            setIsDeleteModalOpen(false);
            setDatasetToDelete(null);
        } catch (error) {
            console.error("Delete failed", error);
            toast.error('Could not delete from database. Check backend connection.', { id: loadingToast });
        }
    };

    return (
        <div className="flex min-h-screen bg-[#f8fafc] font-inter">
            {/* Added Toast Container */}
            <Toaster position="top-right" />

            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <div className="flex-1 flex flex-col min-w-0">
                <header className="header-with-toggle">
                    <SidebarToggle isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
                    <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                </header>

                <main className="flex-1 p-8">
                    <div className="max-w-7xl mx-auto">
                        
                        <div className="flex justify-between items-center mb-8">
                            <h1 className="text-2xl font-bold text-[#1e293b]">Data Steward Dashboard</h1>
                            <button 
                                onClick={() => navigate('/register')}
                                className="flex items-center gap-2 bg-[#3b82f6] text-white px-5 py-2.5 rounded-xl font-semibold shadow-sm hover:bg-blue-700 transition-all cursor-pointer"
                            >
                                <FiPlus /> Register Dataset
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-6">
                                <div className="w-14 h-14 bg-[#eff6ff] text-[#3b82f6] rounded-xl flex items-center justify-center">
                                    <FiDatabase size={24} />
                                </div>
                                <div>
                                    <div className="text-4xl font-bold text-slate-800">{datasets.length}</div>
                                    <div className="text-slate-500 font-medium">Total Datasets</div>
                                </div>
                            </div>
                            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-6">
                                <div className="w-14 h-14 bg-[#fffbeb] text-[#f59e0b] rounded-xl flex items-center justify-center">
                                    <FiShield size={24} />
                                </div>
                                <div>
                                    <div className="text-4xl font-bold text-slate-800">3</div>
                                    <div className="text-slate-500 font-medium">Active Rules</div>
                                </div>
                            </div>
                            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-6">
                                <div className="w-14 h-14 bg-[#faf5ff] text-[#a855f7] rounded-xl flex items-center justify-center">
                                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                                </div>
                                <div>
                                    <div className="text-4xl font-bold text-slate-800">4</div>
                                    <div className="text-slate-500 font-medium">Lineage Mapping</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
                            <div className="p-6 flex justify-between items-center bg-white">
                                <h2 className="text-xl font-bold text-[#1e293b]">Registered Dataset</h2>
                                {searchQuery && (
                                    <span className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full animate-pulse">
                                        Filtering by: "{searchQuery}"
                                    </span>
                                )}
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="text-slate-400 text-sm font-semibold border-t border-b border-slate-50 bg-slate-50/50">
                                            <th className="px-8 py-4 text-center">Name</th>
                                            <th className="px-8 py-4">Domain</th>
                                            <th className="px-8 py-4">Classification</th>
                                            <th className="px-8 py-4">Source Type</th>
                                            <th className="px-8 py-4 text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-slate-700">
                                        {filteredDatasets.length > 0 ? (
                                            filteredDatasets.map((ds) => (
                                                <tr key={ds.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/30 transition-colors">
                                                    <td className="px-8 py-5 font-semibold text-slate-800">{ds.name}</td>
                                                    <td className="px-8 py-5 text-slate-500">{ds.domain || "Sales"}</td>
                                                    <td className="px-8 py-5">
                                                        <span className={`font-bold uppercase text-[10px] tracking-widest ${
                                                            ds.classification === 'SENSITIVE' ? 'text-red-500' : 
                                                            ds.classification === 'CONFIDENTIAL' ? 'text-yellow-500' : 'text-green-500'
                                                        }`}>
                                                            {ds.classification}
                                                        </span>
                                                    </td>
                                                    <td className="px-8 py-5 text-slate-500">{ds.source_type || "CSV"}</td>
                                                    <td className="px-8 py-5">
                                                        <div className="flex justify-center items-center gap-2">
                                                            <button onClick={() => handleView(ds)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Read Details"><FiEye size={18} /></button>
                                                            <button onClick={() => confirmDelete(ds)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Delete Dataset"><FiTrash2 size={18} /></button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="px-8 py-10 text-center text-slate-400 italic">
                                                    No datasets found matching "{searchQuery}"
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            <div className={`fixed inset-0 z-[60] transition-visibility duration-300 ${isDrawerOpen ? 'visible' : 'invisible'}`}>
                <div className={`absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${isDrawerOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setIsDrawerOpen(false)} />
                <div className={`absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl transition-transform duration-300 transform ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}>
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-slate-800">Dataset Details</h2>
                        <button onClick={() => setIsDrawerOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><FiX size={20}/></button>
                    </div>
                    <div className="p-8 flex-1 overflow-y-auto space-y-8">
                        <div>
                            <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Metadata Summary</label>
                            <div className="mt-4 space-y-4">
                                <div><p className="text-xs text-slate-400">Dataset Name</p><p className="font-semibold text-slate-800 text-lg">{selectedDataset?.name}</p></div>
                                <div><p className="text-xs text-slate-400">FQN</p><p className="font-mono text-sm text-blue-600">ferrari.catalog.{selectedDataset?.name}</p></div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-slate-50 rounded-xl">
                                <p className="text-[10px] uppercase font-bold text-slate-400">Status</p>
                                <p className="font-bold text-green-600 mt-1">● ACTIVE</p>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-xl">
                                <p className="text-[10px] uppercase font-bold text-slate-400">Source</p>
                                <p className="font-bold text-slate-700 mt-1">{selectedDataset?.source_type || 'SQL'}</p>
                            </div>
                        </div>
                        <button onClick={() => navigate('/data-lineage')} className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 transition-all flex justify-center items-center gap-2">
                             Explore Lineage
                        </button>
                    </div>
                </div>
            </div>

            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsDeleteModalOpen(false)} />
                    <div className="relative bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center scale-up-center">
                        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FiAlertTriangle size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800">Delete Dataset?</h3>
                        <p className="text-slate-500 text-sm mt-2 mb-8">Are you sure you want to remove <span className="font-bold">{datasetToDelete?.name}</span>? This action cannot be undone.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200">Cancel</button>
                            <button onClick={handleDelete} className="flex-1 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 shadow-lg shadow-red-200">Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;