import { useState, useEffect } from 'react';
import { FiX, FiArrowRight, FiArrowLeft, FiCheck, FiSearch } from 'react-icons/fi';

function PolicyWizard({ isOpen, onClose, onSubmit, datasets }) {
    const [currentStep, setCurrentStep] = useState(1);
    const [policyData, setPolicyData] = useState({
        policyType: '',
        name: '',
        description: '',
        selectedDatasets: [],
        retentionDays: 90,
        maskingFields: [],
        status: 'ACTIVE'
    });

    // Initialize state when opening in edit mode
    // Initialize (Reset) state when opening
    useEffect(() => {
        if (isOpen) {
            // Reset for new policy
            setPolicyData({
                policyType: '',
                name: '',
                description: '',
                selectedDatasets: [],
                retentionDays: 90,
                maskingFields: [],
                status: 'ACTIVE'
            });
            setCurrentStep(1);
        }
    }, [isOpen]);

    const steps = [
        { number: 1, title: 'Policy Type', description: 'Choose policy type' },
        { number: 2, title: 'Datasets', description: 'Assign datasets' },
        { number: 3, title: 'Rules', description: 'Configure rules' },
        { number: 4, title: 'Review', description: 'Review & submit' }
    ];

    if (!isOpen) return null;

    const handleNext = () => {
        if (currentStep < 4) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit = () => {
        onSubmit(policyData);
        handleClose();
    };

    const handleClose = () => {
        setCurrentStep(1);
        onClose();
    };

    const canProceed = () => {
        switch (currentStep) {
            case 1:
                return policyData.policyType && policyData.name;
            case 2:
                return policyData.selectedDatasets && policyData.selectedDatasets.length > 0; // Datasets are mandatory now
            case 3:
                return true; // Rules are optional
            case 4:
                return true;
            default:
                return false;
        }
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
                            Step {currentStep} of 4: {steps[currentStep - 1].title}
                        </p>
                    </div>
                    <button
                        onClick={handleClose}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <FiX size={24} />
                    </button>
                </div>

                {/* Progress Steps */}
                <div className="px-4 md:px-6 py-4 border-b border-border">
                    <div className="flex items-center justify-between">
                        {steps.map((step, index) => (
                            <div key={step.number} className="flex items-center flex-1">
                                <div className="flex flex-col items-center">
                                    <div
                                        className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${currentStep > step.number
                                            ? 'bg-green-500 text-white'
                                            : currentStep === step.number
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-muted text-muted-foreground'
                                            }`}
                                    >
                                        {currentStep > step.number ? <FiCheck /> : step.number}
                                    </div>
                                    <span className="hidden md:block text-xs mt-1 text-muted-foreground">
                                        {step.title}
                                    </span>
                                </div>
                                {index < steps.length - 1 && (
                                    <div
                                        className={`flex-1 h-0.5 mx-2 ${currentStep > step.number ? 'bg-green-500' : 'bg-muted'
                                            }`}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Step Content */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6">
                    {currentStep === 1 && (
                        <Step1PolicyType policyData={policyData} setPolicyData={setPolicyData} />
                    )}
                    {currentStep === 2 && (
                        <Step2DatasetSelector
                            policyData={policyData}
                            setPolicyData={setPolicyData}
                            datasets={datasets}
                        />
                    )}
                    {currentStep === 3 && (
                        <Step3PolicyRules policyData={policyData} setPolicyData={setPolicyData} />
                    )}
                    {currentStep === 4 && <Step4Review policyData={policyData} datasets={datasets} />}
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-between p-4 md:p-6 border-t border-border gap-3">
                    <button
                        onClick={handleClose}
                        className="px-4 py-2 text-sm font-medium text-foreground bg-muted hover:bg-muted/80 rounded-md transition-colors"
                    >
                        Cancel
                    </button>
                    <div className="flex gap-3">
                        {currentStep > 1 && (
                            <button
                                onClick={handlePrevious}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-foreground bg-muted hover:bg-muted/80 rounded-md transition-colors"
                            >
                                <FiArrowLeft size={16} />
                                <span className="hidden sm:inline">Previous</span>
                            </button>
                        )}
                        {currentStep < 4 ? (
                            <button
                                onClick={handleNext}
                                disabled={!canProceed()}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span>Next</span>
                                <FiArrowRight size={16} />
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-md transition-colors"
                            >
                                <FiCheck size={16} />
                                <span>Create Policy</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Step 1: Policy Type Selection
function Step1PolicyType({ policyData, setPolicyData }) {
    const policyTypes = [
        {
            type: 'RETENTION',
            title: 'Data Retention',
            description: 'Automatically delete data after a specified period',
            icon: '🗂️'
        },
        {
            type: 'MASKING',
            title: 'Data Masking',
            description: 'Mask sensitive PII data to protect privacy',
            icon: '🔒'
        }
    ];

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-base font-semibold text-foreground mb-4">Select Policy Type</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {policyTypes.map((type) => (
                        <button
                            key={type.type}
                            onClick={() => setPolicyData({ ...policyData, policyType: type.type })}
                            className={`p-4 border-2 rounded-lg text-left transition-all ${policyData.policyType === type.type
                                ? 'border-blue-500 bg-blue-50 shadow-md'
                                : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/50'
                                }`}
                        >
                            <div className="text-3xl mb-2">{type.icon}</div>
                            <h4 className="font-semibold text-foreground mb-1">{type.title}</h4>
                            <p className="text-sm text-muted-foreground">{type.description}</p>
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                    Policy Name *
                </label>
                <input
                    type="text"
                    value={policyData.name}
                    onChange={(e) => setPolicyData({ ...policyData, name: e.target.value })}
                    placeholder="e.g., Customer PII Retention Policy"
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                    Description (Optional)
                </label>
                <textarea
                    value={policyData.description}
                    onChange={(e) => setPolicyData({ ...policyData, description: e.target.value })}
                    placeholder="Describe what this policy does..."
                    rows={3}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
            </div>
        </div>
    );
}

// Step 2: Dataset Selector (Dual-list)
function Step2DatasetSelector({ policyData, setPolicyData, datasets }) {
    const [searchTerm, setSearchTerm] = useState('');

    const availableDatasets = datasets.filter(
        (d) => !policyData.selectedDatasets.includes(d.id) &&
            (d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                d.domain?.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    const selectedDatasets = datasets.filter((d) =>
        policyData.selectedDatasets.includes(d.id)
    );

    const addDataset = (id) => {
        setPolicyData({
            ...policyData,
            selectedDatasets: [...policyData.selectedDatasets, id]
        });
    };

    const removeDataset = (id) => {
        setPolicyData({
            ...policyData,
            selectedDatasets: policyData.selectedDatasets.filter((dsId) => dsId !== id)
        });
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-base font-semibold text-foreground">Assign Datasets</h3>
                    <p className="text-sm text-muted-foreground">
                        Select which datasets this policy should apply to <span className="text-red-500">*</span>
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Available Datasets */}
                <div className="border border-border rounded-lg p-4 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-medium text-foreground">
                            Available ({availableDatasets.length})
                        </h4>
                    </div>

                    {/* Search Input */}
                    <div className="relative mb-3">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search datasets..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 text-sm border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    </div>

                    <div className="space-y-2 max-h-64 overflow-y-auto flex-1">
                        {availableDatasets.map((dataset) => (
                            <button
                                key={dataset.id}
                                onClick={() => addDataset(dataset.id)}
                                className="w-full p-2 text-left border border-border rounded hover:bg-muted transition-colors"
                            >
                                <div className="font-medium text-sm text-foreground">
                                    {dataset.name}
                                </div>
                                <div className="text-xs text-muted-foreground">{dataset.domain}</div>
                            </button>
                        ))}
                        {availableDatasets.length === 0 && (
                            <p className="text-sm text-muted-foreground text-center py-4">
                                All datasets selected
                            </p>
                        )}
                    </div>
                </div>

                {/* Selected Datasets */}
                <div className="border border-primary rounded-lg p-4 bg-primary/5">
                    <h4 className="text-sm font-medium text-foreground mb-3">
                        Selected ({selectedDatasets.length})
                    </h4>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                        {selectedDatasets.map((dataset) => (
                            <button
                                key={dataset.id}
                                onClick={() => removeDataset(dataset.id)}
                                className="w-full p-2 text-left border border-primary rounded bg-background hover:bg-muted transition-colors"
                            >
                                <div className="font-medium text-sm text-foreground">
                                    {dataset.name}
                                </div>
                                <div className="text-xs text-muted-foreground">{dataset.domain}</div>
                            </button>
                        ))}
                        {selectedDatasets.length === 0 && (
                            <p className="text-sm text-muted-foreground text-center py-4">
                                No datasets selected yet
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Step 3: Policy Rules Configuration
function Step3PolicyRules({ policyData, setPolicyData }) {
    return (
        <div className="space-y-6">
            <h3 className="text-base font-semibold text-foreground">Configure Policy Rules</h3>

            {policyData.policyType === 'RETENTION' && (
                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                        Retention Period (Days)
                    </label>
                    <input
                        type="number"
                        value={policyData.retentionDays}
                        onChange={(e) =>
                            setPolicyData({ ...policyData, retentionDays: parseInt(e.target.value) || 90 })
                        }
                        min="1"
                        className="w-full md:w-48 px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <p className="text-sm text-muted-foreground mt-2">
                        Data will be automatically deleted after {policyData.retentionDays} days
                    </p>
                </div>
            )}

            {policyData.policyType === 'MASKING' && (
                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                        Fields to Mask
                    </label>
                    <div className="space-y-2">
                        {['email', 'phone', 'ssn', 'credit_card'].map((field) => (
                            <label key={field} className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={policyData.maskingFields.includes(field)}
                                    onChange={(e) => {
                                        const fields = e.target.checked
                                            ? [...policyData.maskingFields, field]
                                            : policyData.maskingFields.filter((f) => f !== field);
                                        setPolicyData({ ...policyData, maskingFields: fields });
                                    }}
                                    className="w-4 h-4 text-primary border-input rounded focus:ring-primary"
                                />
                                <span className="text-sm text-foreground capitalize">{field.replace('_', ' ')}</span>
                            </label>
                        ))}
                    </div>
                </div>
            )}

            {policyData.policyType === 'ACCESS' && (
                <div>
                    <p className="text-sm text-muted-foreground">
                        Access control rules will be configured based on your organization's role-based access control (RBAC) settings.
                    </p>
                </div>
            )}
        </div>
    );
}

// Step 4: Review
function Step4Review({ policyData, datasets }) {
    const selectedDatasets = datasets.filter((d) => policyData.selectedDatasets.includes(d.id));

    return (
        <div className="space-y-6">
            <h3 className="text-base font-semibold text-foreground">Review Policy Details</h3>

            <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Policy Type</h4>
                    <p className="text-base font-semibold text-foreground">{policyData.policyType}</p>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Policy Name</h4>
                    <p className="text-base font-semibold text-foreground">{policyData.name}</p>
                </div>

                {policyData.description && (
                    <div className="p-4 bg-muted rounded-lg">
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Description</h4>
                        <p className="text-sm text-foreground">{policyData.description}</p>
                    </div>
                )}

                <div className="p-4 bg-muted rounded-lg">
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">
                        Assigned Datasets ({selectedDatasets.length})
                    </h4>
                    <div className="space-y-1">
                        {selectedDatasets.map((dataset) => (
                            <div key={dataset.id} className="text-sm text-foreground">
                                • {dataset.name}
                            </div>
                        ))}
                    </div>
                </div>

                {policyData.policyType === 'RETENTION' && (
                    <div className="p-4 bg-muted rounded-lg">
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Retention Period</h4>
                        <p className="text-base font-semibold text-foreground">
                            {policyData.retentionDays} days
                        </p>
                    </div>
                )}

                {policyData.policyType === 'MASKING' && policyData.maskingFields.length > 0 && (
                    <div className="p-4 bg-muted rounded-lg">
                        <h4 className="text-sm font-medium text-muted-foreground mb-2">
                            Fields to Mask
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {policyData.maskingFields.map((field) => (
                                <span
                                    key={field}
                                    className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md capitalize"
                                >
                                    {field.replace('_', ' ')}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {(policyData.policyType === 'RETENTION' || policyData.policyType === 'MASKING') && (
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <p className="text-sm text-orange-800 font-medium">⚠️ Critical Policy</p>
                    <p className="text-sm text-orange-700 mt-1">
                        This policy will have immediate effects on {selectedDatasets.length} dataset(s). Please review carefully before creating.
                    </p>
                </div>
            )}
        </div>
    );
}

export default PolicyWizard;
