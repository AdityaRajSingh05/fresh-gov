import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { FiCheck, FiArrowLeft, FiShield, FiClock, FiEyeOff, FiActivity } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { getDatasets, getDatasetById, submitComplianceReview } from '../api/Governance';

const ReviewPolicy = () => {
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [datasets, setDatasets] = useState([]);
    const [selectedDatasetId, setSelectedDatasetId] = useState('');
    const [governance, setGovernance] = useState(null);
    const [loadingGovernance, setLoadingGovernance] = useState(false);
    const [complianceStatus, setComplianceStatus] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [selectedDatasetName, setSelectedDatasetName] = useState('');

    // Fetch all datasets for dropdown
    useEffect(() => {
        getDatasets()
            .then(res => setDatasets(res.data))
            .catch(err => console.error('Error fetching datasets:', err));
    }, []);

    // When a dataset is selected, fetch its full details
    const handleDatasetSelect = async (datasetId) => {
        setSelectedDatasetId(datasetId);
        setGovernance(null);
        setComplianceStatus('');

        if (!datasetId) return;

        setLoadingGovernance(true);
        try {
            const res = await getDatasetById(datasetId);
            const dataset = res.data;
            setSelectedDatasetName(dataset.name || `Dataset #${dataset.id}`);
            setGovernance(dataset.metadata?.governance || null);
        } catch (err) {
            console.error('Error fetching dataset details:', err);
            toast.error('Failed to fetch dataset details');
        } finally {
            setLoadingGovernance(false);
        }
    };

    const handleSubmit = async () => {
        if (!selectedDatasetId) {
            toast.error('Please select a dataset');
            return;
        }
        if (!complianceStatus) {
            toast.error('Please select a compliance status');
            return;
        }

        setSubmitting(true);
        try {
            const hasMaskingPolicy = governance?.is_masked || false;
            const hasRetentionPolicy = governance?.retention_period && governance?.retention_period !== 'm d';
            const derivedPolicyStatus = (hasMaskingPolicy || hasRetentionPolicy) ? 'Active' : 'Violated';
            const derivedComplianceStatus = (hasMaskingPolicy || hasRetentionPolicy) ? 'Compliant' : 'Non-Compliant';

            await submitComplianceReview({
                dataset_id: Number(selectedDatasetId),
                masking_applied: hasMaskingPolicy,
                retention_period: governance?.retention_period || null,
                policy_status: derivedPolicyStatus,
                compliance_status: derivedComplianceStatus,
                last_reviewed: new Date().toISOString()
            });
            toast.success('Compliance review submitted successfully!');
            navigate('/governance');
        } catch (error) {
            console.error('Error submitting review:', error);
            toast.error('Failed to submit compliance review');
        } finally {
            setSubmitting(false);
        }
    };

    const hasMasking = governance?.is_masked === true;
    const hasRetention = governance?.retention_period && governance.retention_period !== 'm d';
    const policyStatus = (hasMasking || hasRetention) ? 'Active' : 'Violated';
    const isActive = policyStatus === 'Active';
    const showPolicies = selectedDatasetId && !loadingGovernance;

    return (
        <div className="flex min-h-screen bg-[#f8fafc] font-inter">
            <Sidebar isOpen={isSidebarOpen} />

            <div className="flex-1 flex flex-col min-w-0">
                <Header hideSearch />

                <main className="flex-1 p-6 lg:p-10">
                    <div className="max-w-4xl mx-auto">

                        {/* Back Button */}
                        <button
                            onClick={() => navigate('/governance')}
                            style={{ fontFamily: 'Inter, system-ui, sans-serif', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                            <FiArrowLeft strokeWidth={3} /> BACK TO DASHBOARD
                        </button>

                        {/* Header */}
                        <div style={{ marginBottom: '32px' }}>
                            <h1 style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '1.5rem', fontWeight: 700, color: '#1e293b', letterSpacing: '-0.025em' }}>Review Policy</h1>
                            <p style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '0.875rem', color: '#94a3b8', marginTop: '4px' }}>Review governance policies applied on a dataset</p>
                        </div>

                        {/* Form Content */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                            <div className="space-y-8">

                                {/* Dataset Dropdown */}
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">
                                        Select Dataset <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={selectedDatasetId}
                                        onChange={(e) => handleDatasetSelect(e.target.value)}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    >
                                        <option value="">Select a dataset</option>
                                        {datasets.map((dataset) => (
                                            <option key={dataset.id} value={dataset.id}>
                                                {dataset.name || `Dataset #${dataset.id}`} {dataset.classification ? `(${dataset.classification})` : ''}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Loading State */}
                                {loadingGovernance && (
                                    <div className="flex items-center justify-center py-8">
                                        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                        <span className="ml-3 text-slate-500 font-medium">Fetching governance policies...</span>
                                    </div>
                                )}

                                {/* Policy Review Section */}
                                {showPolicies && (
                                    <div>
                                        <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                            <FiShield className="text-blue-600" />
                                            Governance Policies for "{selectedDatasetName}"
                                        </h2>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {/* Masking Policy Card */}
                                            <div className={`rounded-xl border-2 p-5 transition-all ${hasMasking
                                                ? 'border-green-200 bg-green-50'
                                                : 'border-orange-200 bg-orange-50'
                                                }`}>
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${hasMasking ? 'bg-green-200 text-green-700' : 'bg-orange-200 text-orange-700'
                                                        }`}>
                                                        <FiEyeOff size={20} />
                                                    </div>
                                                    <h3 className="font-bold text-slate-800">Masking Policy</h3>
                                                </div>
                                                <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold ${hasMasking
                                                    ? 'bg-green-200 text-green-800'
                                                    : 'bg-orange-200 text-orange-800'
                                                    }`}>
                                                    <span className={`w-2 h-2 rounded-full ${hasMasking ? 'bg-green-600' : 'bg-orange-600'}`}></span>
                                                    {hasMasking ? 'Applied' : 'Not Applied'}
                                                </div>
                                            </div>

                                            {/* Retention Policy Card */}
                                            <div className={`rounded-xl border-2 p-5 transition-all ${hasRetention
                                                ? 'border-green-200 bg-green-50'
                                                : 'border-orange-200 bg-orange-50'
                                                }`}>
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${hasRetention ? 'bg-green-200 text-green-700' : 'bg-orange-200 text-orange-700'
                                                        }`}>
                                                        <FiClock size={20} />
                                                    </div>
                                                    <h3 className="font-bold text-slate-800">Retention Policy</h3>
                                                </div>
                                                {hasRetention ? (
                                                    <>
                                                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold bg-green-200 text-green-800">
                                                            <span className="w-2 h-2 rounded-full bg-green-600"></span>
                                                            Applied
                                                        </div>
                                                        <p className="text-sm text-slate-600 mt-2">
                                                            Retention Period: <span className="font-bold text-slate-800">{governance.retention_period}</span>
                                                        </p>
                                                    </>
                                                ) : (
                                                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold bg-orange-200 text-orange-800">
                                                        <span className="w-2 h-2 rounded-full bg-orange-600"></span>
                                                        Not Applied
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Policy Status Card */}
                                        <div className={`rounded-xl border-2 p-5 mt-4 transition-all ${isActive
                                            ? 'border-green-200 bg-green-50'
                                            : 'border-red-200 bg-red-50'
                                            }`}>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isActive ? 'bg-green-200 text-green-700' : 'bg-red-200 text-red-700'}`}>
                                                        <FiActivity size={20} />
                                                    </div>
                                                    <h3 className="font-bold text-slate-800">Policy Status</h3>
                                                </div>
                                                <div className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold ${isActive
                                                    ? 'bg-green-200 text-green-800'
                                                    : 'bg-red-200 text-red-800'
                                                    }`}>
                                                    <span className={`w-2.5 h-2.5 rounded-full ${isActive ? 'bg-green-600' : 'bg-red-600'}`}></span>
                                                    {policyStatus}
                                                </div>
                                            </div>
                                            <p className="text-sm text-slate-600 mt-2 ml-[52px]">
                                                {isActive
                                                    ? 'At least one governance policy (masking or retention) is applied.'
                                                    : 'No governance policy is applied on this dataset.'
                                                }
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Compliance Status Dropdown */}
                                {showPolicies && (
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">
                                            Compliance Status <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={complianceStatus}
                                            onChange={(e) => setComplianceStatus(e.target.value)}
                                            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                        >
                                            <option value="">Select compliance status</option>
                                            <option value="Compliant">Compliant</option>
                                            <option value="Non-Compliant">Non-Compliant</option>
                                        </select>
                                    </div>
                                )}

                                {/* Submit Button */}
                                {showPolicies && (
                                    <div className="flex justify-end pt-6 border-t border-slate-200 mt-8">
                                        <button
                                            onClick={handleSubmit}
                                            disabled={submitting || !complianceStatus}
                                            className={`px-8 py-3 rounded-lg font-bold transition-all flex items-center gap-2 ${submitting || !complianceStatus
                                                ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                                                : 'bg-blue-600 text-white hover:bg-blue-700'
                                                }`}
                                        >
                                            <FiCheck size={18} />
                                            {submitting ? 'Submitting...' : 'Submit Review'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ReviewPolicy;
