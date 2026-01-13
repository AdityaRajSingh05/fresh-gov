import { useState, useEffect } from 'react';
import { FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import PolicyAssignment from './PolicyAssignment';

function PolicyForm({ isOpen, onClose, onSubmit, editPolicy, datasets }) {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        policyType: 'Access Control',
        ruleDefinition: '',
        status: 'Active',
        datasets: []
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (editPolicy) {
            setFormData({
                name: editPolicy.name || '',
                policyType: editPolicy.policyType || 'Access Control',
                ruleDefinition: JSON.stringify(editPolicy.ruleDefinition || {}, null, 2),
                status: editPolicy.status || 'Active',
                datasets: editPolicy.datasets || []
            });
        } else {
            setFormData({
                name: '',
                policyType: 'Access Control',
                ruleDefinition: '',
                status: 'Active',
                datasets: []
            });
        }
        setCurrentStep(1);
        setErrors({});
    }, [editPolicy, isOpen]);

    const validateStep = (step) => {
        const newErrors = {};

        if (step === 1) {
            if (!formData.name.trim()) {
                newErrors.name = 'Policy name is required';
            }
        }

        if (step === 2) {
            if (!formData.ruleDefinition.trim()) {
                newErrors.ruleDefinition = 'Rule definition is required';
            } else {
                try {
                    JSON.parse(formData.ruleDefinition);
                } catch (e) {
                    newErrors.ruleDefinition = 'Invalid JSON format';
                }
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        setCurrentStep(currentStep - 1);
        setErrors({});
    };

    const handleSubmit = () => {
        if (!validateStep(currentStep)) return;

        try {
            const parsedRuleDefinition = formData.ruleDefinition
                ? JSON.parse(formData.ruleDefinition)
                : {};

            const policyData = {
                ...editPolicy,
                name: formData.name,
                policyType: formData.policyType,
                ruleDefinition: parsedRuleDefinition,
                status: formData.status,
                datasets: formData.datasets
            };

            onSubmit(policyData);
            onClose();
        } catch (e) {
            setErrors({ ruleDefinition: 'Invalid JSON format' });
        }
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error for this field
        setErrors(prev => ({ ...prev, [field]: undefined }));
    };

    if (!isOpen) return null;

    const steps = [
        { number: 1, title: 'Basic Info' },
        { number: 2, title: 'Rule Definition' },
        { number: 3, title: 'Dataset Assignment' }
    ];

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2 sm:p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="form-title"
        >
            <div className="bg-card border border-border rounded-lg shadow-xl w-full max-w-sm sm:max-w-2xl lg:max-w-3xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border">
                    <div>
                        <h2 id="form-title" className="text-lg sm:text-xl font-semibold text-foreground">
                            {editPolicy ? 'Edit Policy' : 'Create New Policy'}
                        </h2>
                        <p className="text-sm text-muted-foreground mt-1">
                            Step {currentStep} of {steps.length}: {steps[currentStep - 1].title}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        aria-label="Close form"
                    >
                        <FiX size={24} />
                    </button>
                </div>

                {/* Step Indicator */}
                <div className="px-4 pt-4 sm:px-6 sm:pt-6">
                    <div className="flex items-center justify-between">
                        {steps.map((step, index) => (
                            <div key={step.number} className="flex items-center flex-1">
                                <div className="flex flex-col items-center flex-1">
                                    <div
                                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium transition-colors ${currentStep >= step.number
                                            ? 'bg-primary text-white'
                                            : 'bg-muted text-muted-foreground'
                                            }`}
                                    >
                                        {step.number}
                                    </div>
                                    <span className="text-xs mt-1 sm:mt-2 text-center hidden sm:block">
                                        {step.title}
                                    </span>
                                </div>
                                {index < steps.length - 1 && (
                                    <div
                                        className={`h-0.5 flex-1 mx-2 transition-colors ${currentStep > step.number ? 'bg-primary' : 'bg-muted'
                                            }`}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Form Content */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                    {/* Step 1: Basic Info */}
                    {currentStep === 1 && (
                        <div className="space-y-6">
                            <div>
                                <label htmlFor="policy-name" className="block text-sm font-medium text-foreground mb-2">
                                    Policy Name *
                                </label>
                                <input
                                    id="policy-name"
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => handleChange('name', e.target.value)}
                                    className={`w-full px-4 py-2 border rounded-md bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 ${errors.name ? 'border-red-500' : 'border-input'
                                        }`}
                                    placeholder="e.g., GDPR Data Retention"
                                    aria-required="true"
                                    aria-invalid={!!errors.name}
                                    aria-describedby={errors.name ? 'name-error' : undefined}
                                />
                                {errors.name && (
                                    <p id="name-error" className="text-sm text-red-600 mt-1" role="alert">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="policy-type" className="block text-sm font-medium text-foreground mb-2">
                                    Policy Type *
                                </label>
                                <select
                                    id="policy-type"
                                    value={formData.policyType}
                                    onChange={(e) => handleChange('policyType', e.target.value)}
                                    className="w-full px-4 py-2 border border-input rounded-md bg-card focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    aria-required="true"
                                >
                                    <option value="Access Control">Access Control</option>
                                    <option value="Retention">Retention</option>
                                    <option value="Data Masking">Data Masking</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="policy-status" className="block text-sm font-medium text-foreground mb-2">
                                    Status *
                                </label>
                                <select
                                    id="policy-status"
                                    value={formData.status}
                                    onChange={(e) => handleChange('status', e.target.value)}
                                    className="w-full px-4 py-2 border border-input rounded-md bg-card focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    aria-required="true"
                                >
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Rule Definition */}
                    {currentStep === 2 && (
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="rule-definition" className="block text-sm font-medium text-foreground mb-2">
                                    Rule Definition (JSON) *
                                </label>
                                <p className="text-sm text-muted-foreground mb-3">
                                    Define the policy rules in JSON format. Example:
                                </p>
                                <div className="bg-muted p-3 rounded-md mb-3 overflow-x-auto">
                                    <pre className="text-xs text-foreground">
                                        {`{
  "retentionPeriod": "7 years",
  "autoDelete": true
}`}
                                    </pre>
                                </div>
                                <textarea
                                    id="rule-definition"
                                    value={formData.ruleDefinition}
                                    onChange={(e) => handleChange('ruleDefinition', e.target.value)}
                                    rows={10}
                                    className={`w-full px-4 py-2 border rounded-md bg-card font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 ${errors.ruleDefinition ? 'border-red-500' : 'border-input'
                                        }`}
                                    placeholder='{"key": "value"}'
                                    aria-required="true"
                                    aria-invalid={!!errors.ruleDefinition}
                                    aria-describedby={errors.ruleDefinition ? 'rule-error' : undefined}
                                />
                                {errors.ruleDefinition && (
                                    <p id="rule-error" className="text-sm text-red-600 mt-1" role="alert">
                                        {errors.ruleDefinition}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Step 3: Dataset Assignment */}
                    {currentStep === 3 && (
                        <PolicyAssignment
                            datasets={datasets}
                            assignedDatasetIds={formData.datasets}
                            onAssign={(datasetIds) => handleChange('datasets', datasetIds)}
                        />
                    )}
                </div>

                {/* Footer Actions */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-0 p-4 sm:p-6 border-t border-border">
                    <button
                        onClick={currentStep === 1 ? onClose : handleBack}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 text-sm font-medium text-foreground bg-muted hover:bg-muted/80 rounded-md transition-colors order-2 sm:order-1"
                        aria-label={currentStep === 1 ? 'Cancel' : 'Go back'}
                    >
                        {currentStep > 1 && <FiChevronLeft size={16} />}
                        {currentStep === 1 ? 'Cancel' : 'Back'}
                    </button>

                    <div className="text-sm text-muted-foreground hidden lg:block order-1 sm:order-2">
                        Step {currentStep} of {steps.length}
                    </div>

                    {currentStep < steps.length ? (
                        <button
                            onClick={handleNext}
                            className="flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-md transition-colors order-1 sm:order-3"
                            aria-label="Go to next step"
                        >
                            Next
                            <FiChevronRight size={16} />
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            className="px-4 py-2.5 sm:py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-md transition-colors order-1 sm:order-3"
                            aria-label={editPolicy ? 'Update policy' : 'Create policy'}
                        >
                            {editPolicy ? 'Update Policy' : 'Create Policy'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default PolicyForm;
