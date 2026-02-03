import { useState, useEffect } from 'react';
import { FiX, FiCheck } from 'react-icons/fi';

function PolicyWizard({ isOpen, onClose, onSubmit, datasets }) {
    const [policyData, setPolicyData] = useState({
        policyType: '',
        selectedDataset: '',
        description: '',
        retentionMonths: '',
        retentionDays: '',
        isMasked: false,
        status: 'ACTIVE'
    });

    const [errors, setErrors] = useState({});

    // Reset state when opening
    useEffect(() => {
        if (isOpen) {
            setPolicyData({
                policyType: '',
                selectedDataset: '',
                description: '',
                retentionMonths: '',
                retentionDays: '',
                isMasked: false,
                status: 'ACTIVE'
            });
            setErrors({});
        }
    }, [isOpen]);

    if (!isOpen) return null;



    const validateForm = () => {
        const newErrors = {};

        if (!policyData.policyType) {
            newErrors.policyType = 'Policy type is required';
        }

        if (!policyData.selectedDataset) {
            newErrors.selectedDataset = 'Dataset selection is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validateForm()) {
            return;
        }

        // Calculate total retention days (months * 30 + days)
        const retentionDays = (parseInt(policyData.retentionMonths) || 0) * 30 + (parseInt(policyData.retentionDays) || 0);

        // Prepare submission data
        const submissionData = {
            policyType: policyData.policyType,
            datasets: [policyData.selectedDataset],
            description: policyData.description || '',
            status: policyData.status
        };

        // Add retention days if > 0 (for GDPR policies)
        if (retentionDays > 0) {
            submissionData.retentionDays = retentionDays;
        }

        // Add is_masked boolean flag if checkbox is checked
        if (policyData.isMasked) {
            submissionData.isMasked = true;
        }

        onSubmit(submissionData);
        handleClose();
    };

    const handleClose = () => {
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-card rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 md:p-6 border-b border-border">
                    <div>
                        <h2 className="text-lg md:text-xl font-semibold text-foreground">
                            Create New Policy
                        </h2>
                        <p className="text-sm text-muted-foreground mt-1">
                            Define and configure a new governance policy
                        </p>
                    </div>
                    <button
                        onClick={handleClose}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <FiX size={24} />
                    </button>
                </div>

                {/* Form Content */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6">
                    <div className="space-y-6">
                        {/* Policy Type Dropdown */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Policy Type <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={policyData.policyType}
                                onChange={(e) => {
                                    setPolicyData({ ...policyData, policyType: e.target.value });
                                    const newErrors = { ...errors };
                                    delete newErrors.policyType;
                                    setErrors(newErrors);
                                }}
                                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
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
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Dataset <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={policyData.selectedDataset}
                                onChange={(e) => {
                                    setPolicyData({ ...policyData, selectedDataset: e.target.value });
                                    const newErrors = { ...errors };
                                    delete newErrors.selectedDataset;
                                    setErrors(newErrors);
                                }}
                                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                <option value="">Select dataset</option>
                                {datasets.map((dataset) => (
                                    <option key={dataset.id} value={dataset.id}>
                                        {dataset.name} {dataset.domain ? `(${dataset.domain})` : ''}
                                    </option>
                                ))}
                            </select>
                            {errors.selectedDataset && (
                                <p className="text-sm text-red-500 mt-1">{errors.selectedDataset}</p>
                            )}
                        </div>

                        {/* Description Field */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Description <span className="text-muted-foreground">(Optional)</span>
                            </label>
                            <textarea
                                value={policyData.description}
                                onChange={(e) => setPolicyData({ ...policyData, description: e.target.value })}
                                placeholder="Enter policy description..."
                                rows={4}
                                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                            />
                        </div>

                        {/* Retention Period */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Retention Period <span className="text-red-500">*</span>
                            </label>
                            <div className="flex gap-4 items-start">
                                <div className="flex-1">
                                    <input
                                        type="number"
                                        value={policyData.retentionMonths}
                                        onChange={(e) => setPolicyData({ ...policyData, retentionMonths: e.target.value })}
                                        placeholder="Months"
                                        min="0"
                                        className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                                <div className="flex-1">
                                    <input
                                        type="number"
                                        value={policyData.retentionDays}
                                        onChange={(e) => setPolicyData({ ...policyData, retentionDays: e.target.value })}
                                        placeholder="Days"
                                        min="0"
                                        className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="isMasked"
                                        checked={policyData.isMasked}
                                        onChange={(e) => setPolicyData({ ...policyData, isMasked: e.target.checked })}
                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-primary"
                                    />
                                    <label htmlFor="isMasked" className="text-sm text-foreground whitespace-nowrap">
                                        Dataset is Masked
                                    </label>
                                </div>
                            </div>
                            <p className="text-xs text-blue-500 mt-2 flex items-center gap-1">
                                <span>ℹ️</span>
                                <span>Tip: Ensure all fields with * are filled</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-end p-4 md:p-6 border-t border-border gap-3">
                    <button
                        onClick={handleClose}
                        className="px-4 py-2 text-sm font-medium text-foreground bg-muted hover:bg-muted/80 rounded-md transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-md transition-colors"
                    >
                        <FiCheck size={16} />
                        <span>Submit Policy</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PolicyWizard;
