import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import SidebarToggle from './SidebarToggle';
import { FiArrowLeft } from 'react-icons/fi';

const AllDatasetsView = () => {
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [datasets, setDatasets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch all datasets
    useEffect(() => {
        const fetchDatasets = async () => {
            try {
                setLoading(true);
                const response = await axios.get("http://localhost:3000/api/v1/datasets");
                setDatasets(response.data);
            } catch (err) {
                console.error("Error fetching datasets:", err);
                setError("Failed to load datasets");
            } finally {
                setLoading(false);
            }
        };
        fetchDatasets();
    }, []);



    return (
        <div className="flex min-h-screen bg-[#f8fafc]">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <div className="flex-1 flex flex-col min-w-0">
                <header className="header-with-toggle">
                    <SidebarToggle isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
                    <Header />
                </header>

                <main className="flex-1 p-8">
                    <div className="max-w-7xl mx-auto">
                        {/* Header Section with Back Button */}
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate(-1)}
                                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
                            >
                                <FiArrowLeft className="w-5 h-5" />
                                Back
                            </button>
                            
                        </div>
                        <div className='p-3 mb-1'>
                            <h1 className="text-2xl inline font-bold text-[#1e293b]">All Datasets</h1>
                            <span className="text-slate-500 font-medium inline-block ml-2">({datasets.length} datasets)</span>
                        </div>

                        {loading ? (
                            <div className="p-8 text-center text-slate-500">
                                <p>Loading datasets...</p>
                            </div>
                        ) : error ? (
                            <div className="p-8 text-center text-red-500">
                                <p>{error}</p>
                            </div>
                        ) : datasets.length === 0 ? (
                            <div className="p-8 text-center text-slate-500">
                                <p>No datasets found</p>
                            </div>
                        ) : (
                            <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="text-slate-400 text-sm font-semibold border-b border-slate-50">
                                            <th className="px-8 py-5">Name</th>
                                            <th className="px-8 py-5">Domain</th>
                                            <th className="px-8 py-5">Classification</th>
                                            <th className="px-8 py-5">Source Type</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-slate-700">
                                        {datasets.map((ds) => (
                                            <tr key={ds.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/30 transition-colors cursor-pointer">
                                                <td className="px-8 py-6 font-semibold text-slate-800">{ds.name}</td>
                                                <td className="px-8 py-6 text-slate-600">{ds.domain || "Sales"}</td>
                                                <td className="px-8 py-6">
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
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AllDatasetsView;
