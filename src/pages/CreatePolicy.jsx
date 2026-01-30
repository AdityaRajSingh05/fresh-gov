import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { FiCheck, FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const CreatePolicy = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [datasets, setDatasets] = useState([]);

    // Form data
    const [formData, setFormData] = useState({
        name: '',
        type: 'RETENTION',
        description: '',
        selectedDatasets: [],
        rules: '',
        retention_days: 90,
        maskingFields: []
    });

    const steps = [
        { number: 1, title: 'Policy Details' },
        { number: 2, title: 'Dataset Selection' },
        { number: 3, title: 'Rules & Conditions' },
        { number: 4, title: 'Review & Submit' }
    ];

    useEffect(() => {
        // Fetch datasets for step 2
        axios.get('http://localhost:3000/api/v1/datasets')
            .then(res => setDatasets(res.data))
            .catch(err => console.error('Error fetching datasets:', err));
    }, []);

    const handleNext = () => {
        if (validateStep()) {
            setCurrentStep(prev => Math.min(prev + 1, 4));
        }
    };

    const handlePrevious = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const validateStep = () => {
        switch (currentStep) {
            case 1:
                if (!formData.name.trim()) {
                    toast.error('Policy name is required');
                    return false;
                }
                return true;
            case 2:
                if (formData.selectedDatasets.length === 0) {
                    toast.error('Please select at least one dataset');
                    return false;
                }
                return true;
            case 3:
                return true; // Rules are optional
            default:
                return true;
        }
    };

    const handleSubmit = async () => {
        try {
            const policyData = {
                name: formData.name,
                type: formData.type,
                description: formData.description,
                dataset_ids: formData.selectedDatasets,
                status: 'Active',
                created_date: new Date().toISOString().split('T')[0]
            };

            // Add type-specific fields
            if (formData.type === 'RETENTION') {
                policyData.retention_days = formData.retention_days;
                policyData.rules = `Data will be automatically deleted after ${formData.retention_days} days`;
            } else if (formData.type === 'MASKING') {
                policyData.masking_fields = formData.maskingFields;
                policyData.rules = formData.maskingFields.join(', ');
            }

            await axios.post('http://localhost:3000/api/v1/governance_policy', policyData);
            toast.success('Policy created successfully!');
            navigate('/governance');
        } catch (error) {
            console.error('Error creating policy:', error);
            toast.error('Failed to create policy');
        }
    };

    const toggleDataset = (datasetId) => {
        setFormData(prev => ({
            ...prev,
            selectedDatasets: prev.selectedDatasets.includes(datasetId)
                ? prev.selectedDatasets.filter(id => id !== datasetId)
                : [...prev.selectedDatasets, datasetId]
        }));
    };

    return (
        <div className="flex min-h-screen bg-[#f8fafc] font-inter">
            <Sidebar isOpen={isSidebarOpen} />

            <div className="flex-1 flex flex-col min-w-0">
                <Header />

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

                        {/* Step Indicator */}
                        <div className="mb-10">
                            <div className="flex items-center justify-between">
                                {steps.map((step, index) => (
                                    <React.Fragment key={step.number}>
                                        <div className="flex flex-col items-center">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${currentStep > step.number
                                                ? 'bg-green-500 text-white'
                                                : currentStep === step.number
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-slate-200 text-slate-400'
                                                }`}>
                                                {currentStep > step.number ? <FiCheck /> : step.number}
                                            </div>
                                            <span className={`mt-2 text-xs font-semibold ${currentStep >= step.number ? 'text-slate-900' : 'text-slate-400'
                                                }`}>
                                                {step.title}
                                            </span>
                                        </div>
                                        {index < steps.length - 1 && (
                                            <div className={`flex-1 h-1 mx-4 rounded transition-all ${currentStep > step.number ? 'bg-green-500' : 'bg-slate-200'
                                                }`} />
                                        )}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>

                        {/* Form Content */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">

                            {/* Step 1: Policy Details */}
                            {currentStep === 1 && (
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Policy Name *</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="e.g., Customer Data Retention Policy"
                                            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Policy Type *</label>
                                        <select
                                            value={formData.type}
                                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                        >
                                            <option value="RETENTION">Retention</option>
                                            <option value="MASKING">Masking</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            placeholder="Describe the purpose and scope of this policy..."
                                            rows={4}
                                            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                                        />
                                    </div>

                                    {formData.type === 'RETENTION' && (
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Retention Period (days)</label>
                                            <input
                                                type="number"
                                                value={formData.retention_days}
                                                onChange={(e) => setFormData({ ...formData, retention_days: parseInt(e.target.value) })}
                                                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                            />
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Step 2: Dataset Selection */}
                            {currentStep === 2 && (
                                <div className="space-y-4">
                                    <p className="text-sm text-slate-600 mb-4">Select the datasets this policy will apply to:</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                                        {datasets.map(dataset => (
                                            <div
                                                key={dataset.id}
                                                onClick={() => toggleDataset(dataset.id)}
                                                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${formData.selectedDatasets.includes(dataset.id)
                                                    ? 'border-blue-600 bg-blue-50'
                                                    : 'border-slate-200 hover:border-blue-300'
                                                    }`}
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <h4 className="font-bold text-slate-900">{dataset.name}</h4>
                                                        <p className="text-xs text-slate-500 mt-1">{dataset.classification}</p>
                                                    </div>
                                                    {formData.selectedDatasets.includes(dataset.id) && (
                                                        <FiCheck className="text-blue-600" size={20} />
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-xs text-slate-500 mt-4">
                                        {formData.selectedDatasets.length} dataset(s) selected
                                    </p>
                                </div>
                            )}

                            {/* Step 3: Rules & Conditions */}
                            {currentStep === 3 && (
                                <div className="space-y-6">
                                    <h3 className="text-lg font-bold text-slate-900">Configure Policy Rules</h3>

                                    {formData.type === 'RETENTION' && (
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                                Retention Period (Days)
                                            </label>
                                            <input
                                                type="number"
                                                value={formData.retention_days}
                                                onChange={(e) => setFormData({ ...formData, retention_days: parseInt(e.target.value) || 90 })}
                                                min="1"
                                                className="w-full md:w-48 px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                            />
                                            <p className="text-sm text-slate-500 mt-2">
                                                Data will be automatically deleted after {formData.retention_days} days
                                            </p>
                                        </div>
                                    )}

                                    {formData.type === 'MASKING' && (
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                                Fields to Mask
                                            </label>
                                            <div className="space-y-3">
                                                {['email', 'phone', 'ssn', 'credit_card'].map((field) => (
                                                    <label key={field} className="flex items-center gap-3">
                                                        <input
                                                            type="checkbox"
                                                            checked={formData.maskingFields?.includes(field)}
                                                            onChange={(e) => {
                                                                const fields = e.target.checked
                                                                    ? [...(formData.maskingFields || []), field]
                                                                    : (formData.maskingFields || []).filter((f) => f !== field);
                                                                setFormData({ ...formData, maskingFields: fields, rules: fields.join(', ') });
                                                            }}
                                                            className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                                                        />
                                                        <span className="text-sm text-slate-700 capitalize font-medium">
                                                            {field.replace('_', ' ')}
                                                        </span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Step 4: Review & Submit */}
                            {currentStep === 4 && (
                                <div className="space-y-6">
                                    <h3 className="text-lg font-bold text-slate-900 mb-4">Review Policy Details</h3>

                                    <div className="space-y-4">
                                        <div className="bg-slate-50 rounded-lg p-4">
                                            <p className="text-xs font-bold text-slate-500 uppercase mb-1">Policy Name</p>
                                            <p className="text-slate-900 font-semibold">{formData.name}</p>
                                        </div>

                                        <div className="bg-slate-50 rounded-lg p-4">
                                            <p className="text-xs font-bold text-slate-500 uppercase mb-1">Type</p>
                                            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm font-bold">
                                                {formData.type}
                                            </span>
                                        </div>

                                        <div className="bg-slate-50 rounded-lg p-4">
                                            <p className="text-xs font-bold text-slate-500 uppercase mb-1">Description</p>
                                            <p className="text-slate-700 text-sm">{formData.description}</p>
                                        </div>

                                        <div className="bg-slate-50 rounded-lg p-4">
                                            <p className="text-xs font-bold text-slate-500 uppercase mb-1">Selected Datasets</p>
                                            <p className="text-slate-900 font-semibold">{formData.selectedDatasets.length} dataset(s)</p>
                                        </div>

                                        {formData.type === 'RETENTION' && (
                                            <div className="bg-slate-50 rounded-lg p-4">
                                                <p className="text-xs font-bold text-slate-500 uppercase mb-1">Retention Period</p>
                                                <p className="text-slate-900 font-semibold">{formData.retention_days} days</p>
                                            </div>
                                        )}

                                        {formData.type === 'MASKING' && formData.maskingFields.length > 0 && (
                                            <div className="bg-slate-50 rounded-lg p-4">
                                                <p className="text-xs font-bold text-slate-500 uppercase mb-1">Fields to Mask</p>
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    {formData.maskingFields.map((field) => (
                                                        <span
                                                            key={field}
                                                            className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-md capitalize font-semibold"
                                                        >
                                                            {field.replace('_', ' ')}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Navigation Buttons */}
                            <div className="flex justify-between mt-8 pt-6 border-t border-slate-200">
                                <button
                                    onClick={handlePrevious}
                                    disabled={currentStep === 1}
                                    className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-bold hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    <FiArrowLeft className="inline mr-2" /> Previous
                                </button>

                                {currentStep < 4 ? (
                                    <button
                                        onClick={handleNext}
                                        className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all"
                                    >
                                        Next <FiArrowRight className="inline ml-2" />
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleSubmit}
                                        className="px-6 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-all"
                                    >
                                        <FiCheck className="inline mr-2" /> Submit Policy
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default CreatePolicy;
