import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { FiCheck, FiArrowLeft } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const CreatePolicy = () => {
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [datasets, setDatasets] = useState([]);

    // Form data
    const [formData, setFormData] = useState({
        policyType: '',
        selectedDataset: '',
        description: '',
        retentionMonths: '',
        retentionDays: '',
        isDatasetMasked: false
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        // Fetch datasets
        axios.get('http://localhost:3000/api/v1/datasets')
            .then(res => setDatasets(res.data))
            .catch(err => console.error('Error fetching datasets:', err));
    }, []);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.policyType) {
            newErrors.policyType = 'Policy type is required';
        }

        if (!formData.selectedDataset) {
            newErrors.selectedDataset = 'Dataset selection is required';
        }

        const totalDays = (Number(formData.retentionMonths) || 0) * 30 + (Number(formData.retentionDays) || 0);
        if (totalDays <= 0) {
            newErrors.retentionPeriod = 'Retention period is required (enter months and/or days)';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        try {
            // Calculate total retention days from months and days
            const retentionDays = (Number(formData.retentionMonths) || 0) * 30 + (Number(formData.retentionDays) || 0);

            // Get current timestamp in local timezone
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            const timestamp = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

            const policyData = {
                dataset_id: Number(formData.selectedDataset),
                policy_type: formData.policyType,
                status: 'ACTIVE',
                description: formData.description || `${formData.policyType} compliance policy`,
                created_at: timestamp,
                retention_days: retentionDays,
                is_masked: formData.isDatasetMasked
            };

            await axios.post('http://localhost:3000/api/v1/governance_policy', policyData);
            toast.success('Policy created successfully!');
            navigate('/governance');
        } catch (error) {
            console.error('Error creating policy:', error);
            toast.error('Failed to create policy');
        }
    };

    return (
        <div className="flex min-h-screen bg-[#f8fafc] font-inter">
            <Sidebar isOpen={isSidebarOpen} />

            <div className="flex-1 flex flex-col min-w-0">
                <Header hideSearch hideViolations />

                <main className="flex-1 p-6 lg:p-10">
                    <div className="max-w-4xl mx-auto">

                        {/* Back Button */}
                        <button
                            onClick={() => navigate('/governance')}
                            className="flex items-center gap-2 mb-8 text-sm font-bold transition-all text-slate-500 hover:text-blue-600"
                        >
                            <FiArrowLeft strokeWidth={3} /> BACK TO GOVERNANCE
                        </button>

                        {/* Header */}
                        <div className="mb-10">
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Create New Policy</h1>
                            <p className="text-slate-500 mt-2">Define and configure a new governance policy</p>
                        </div>

                        {/* Form Content */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                            <div className="space-y-6">
                                {/* Policy Type Dropdown */}
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">
                                        Policy Type <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={formData.policyType}
                                        onChange={(e) => {
                                            setFormData({ ...formData, policyType: e.target.value });
                                            const newErrors = { ...errors };
                                            delete newErrors.policyType;
                                            setErrors(newErrors);
                                        }}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    >
                                        <option value="">Select policy type</option>
                                        <option value="GDPR">GDPR</option>
                                        <option value="ISO 27001">ISO 27001</option>
                                    </select>
                                    {errors.policyType && (
                                        <p className="text-sm text-red-500 mt-1">{errors.policyType}</p>
                                    )}
                                </div>

                                {/* Dataset Dropdown */}
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">
                                        Dataset <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={formData.selectedDataset}
                                        onChange={(e) => {
                                            setFormData({ ...formData, selectedDataset: e.target.value });
                                            const newErrors = { ...errors };
                                            delete newErrors.selectedDataset;
                                            setErrors(newErrors);
                                        }}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    >
                                        <option value="">Select dataset</option>
                                        {datasets.map((dataset) => (
                                            <option key={dataset.id} value={dataset.id}>
                                                {dataset.name} {dataset.classification ? `(${dataset.classification})` : ''}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.selectedDataset && (
                                        <p className="text-sm text-red-500 mt-1">{errors.selectedDataset}</p>
                                    )}
                                </div>

                                {/* Description (Optional) */}
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">
                                        Description <span className="text-slate-400 text-xs font-normal">(Optional)</span>
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Enter policy description..."
                                        rows={3}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                                    />
                                </div>

                                {/* Retention Period */}
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-3">
                                        Retention Period <span className="text-red-500">*</span>
                                    </label>
                                    <div className="flex items-center gap-8">
                                        {/* Months */}
                                        <div>
                                            <input
                                                type="number"
                                                min="0"
                                                placeholder="Months"
                                                value={formData.retentionMonths}
                                                onChange={(e) => {
                                                    setFormData({
                                                        ...formData,
                                                        retentionMonths: e.target.value
                                                    });
                                                    const newErrors = { ...errors };
                                                    delete newErrors.retentionPeriod;
                                                    setErrors(newErrors);
                                                }}
                                                className="w-40 px-4 py-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                            />
                                        </div>

                                        {/* Days */}
                                        <div>
                                            <input
                                                type="number"
                                                min="0"
                                                placeholder="Days"
                                                value={formData.retentionDays}
                                                onChange={(e) => {
                                                    setFormData({
                                                        ...formData,
                                                        retentionDays: e.target.value
                                                    });
                                                    const newErrors = { ...errors };
                                                    delete newErrors.retentionPeriod;
                                                    setErrors(newErrors);
                                                }}
                                                className="w-40 px-4 py-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                            />
                                        </div>

                                        {/* Dataset is Masked Checkbox */}
                                        <div className="flex items-center">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.isDatasetMasked}
                                                    onChange={(e) => setFormData({ ...formData, isDatasetMasked: e.target.checked })}
                                                    className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                                                />
                                                <span className="text-sm font-medium text-slate-700">Dataset is Masked</span>
                                            </label>
                                        </div>
                                    </div>
                                    {errors.retentionPeriod && (
                                        <p className="text-sm text-red-500 mt-2">{errors.retentionPeriod}</p>
                                    )}
                                    <p className="text-xs text-slate-500 mt-3 flex items-center gap-1">
                                        <span className="inline-block w-4 h-4 rounded-full bg-blue-100 text-blue-600 text-center leading-4 font-bold text-xs">i</span>
                                        <strong>Tip:</strong> Ensure all fields with * are filled
                                    </p>
                                </div>

                                {/* Submit Button */}
                                <div className="flex justify-end pt-6 border-t border-slate-200 mt-8">
                                    <button
                                        onClick={handleSubmit}
                                        className="px-8 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all flex items-center gap-2"
                                    >
                                        <FiCheck size={18} />
                                        Submit Policy
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default CreatePolicy;
