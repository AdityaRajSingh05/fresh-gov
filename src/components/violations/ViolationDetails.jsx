import { FiX, FiAlertCircle, FiDatabase, FiClock, FiUser, FiFileText } from 'react-icons/fi';

function ViolationDetails({ violation, onClose, onResolve }) {
    if (!violation) return null;

    const getSeverityColor = (severity) => {
        const colors = {
            'Critical': 'text-red-600 bg-red-50 border-red-200',
            'High': 'text-orange-600 bg-orange-50 border-orange-200',
            'Medium': 'text-yellow-600 bg-yellow-50 border-yellow-200',
            'Low': 'text-blue-600 bg-blue-50 border-blue-200'
        };
        return colors[severity] || 'text-gray-600 bg-gray-50 border-gray-200';
    };

    const getStatusColor = (status) => {
        return status === 'Open'
            ? 'text-red-600 bg-red-50 border-red-200'
            : 'text-green-600 bg-green-50 border-green-200';
    };

    return (
        <div
            className="fixed inset-0 bg-black/85 flex items-center justify-center z-[9999] p-4"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="violation-details-title"
        >
            <div
                className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
                style={{ backgroundColor: '#ffffff' }}
            >
                {/* Header */}
                <div className="sticky top-0 bg-white px-6 py-4 flex items-center justify-between">
                    <div>
                        <h2 id="violation-details-title" className="text-xl font-semibold text-foreground">
                            Violation Details
                        </h2>
                        <p className="text-sm text-muted-foreground mt-1">
                            {violation.policyId} - {violation.policyName}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-background rounded-md transition-colors"
                        aria-label="Close dialog"
                    >
                        <FiX size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Status and Severity */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-muted-foreground block mb-2">
                                Status
                            </label>
                            <span className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium border ${getStatusColor(violation.status)}`}>
                                {violation.status}
                            </span>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground block mb-2">
                                Severity
                            </label>
                            <span className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium border ${getSeverityColor(violation.severity)}`}>
                                <FiAlertCircle className="mr-1.5" size={14} />
                                {violation.severity}
                            </span>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-2">
                            <FiFileText size={16} />
                            Description
                        </label>
                        <div className="bg-gray-50 rounded-md p-4">
                            <p className="text-sm text-foreground">{violation.description}</p>
                        </div>
                    </div>

                    {/* Violation Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-2">
                                <FiDatabase size={16} />
                                Dataset
                            </label>
                            <p className="text-sm font-mono bg-gray-50 rounded-md px-3 py-2">
                                {violation.dataset}
                            </p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-2">
                                <FiAlertCircle size={16} />
                                Violation Type
                            </label>
                            <p className="text-sm bg-gray-50 rounded-md px-3 py-2">
                                {violation.violationType}
                            </p>
                        </div>
                    </div>

                    {/* Timestamp */}
                    <div>
                        <label className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-2">
                            <FiClock size={16} />
                            Detected At
                        </label>
                        <p className="text-sm bg-gray-50 rounded-md px-3 py-2">
                            {violation.timestamp}
                        </p>
                    </div>

                    {/* Additional Info (if available) */}
                    {violation.user && (
                        <div>
                            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-2">
                                <FiUser size={16} />
                                User
                            </label>
                            <p className="text-sm bg-background border border-border rounded-md px-3 py-2">
                                {violation.user}
                            </p>
                        </div>
                    )}

                    {/* Remediation Steps */}
                    {violation.status === 'Open' && (
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                            <h3 className="text-sm font-semibold text-orange-900 mb-2">
                                Recommended Actions
                            </h3>
                            <ul className="text-sm text-orange-800 space-y-1 list-disc list-inside">
                                <li>Review the affected dataset and access logs</li>
                                <li>Verify policy enforcement configuration</li>
                                <li>Contact the data steward if unauthorized access occurred</li>
                                <li>Update access controls if necessary</li>
                            </ul>
                        </div>
                    )}

                    {violation.status === 'Resolved' && violation.resolvedAt && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <h3 className="text-sm font-semibold text-green-900 mb-1">
                                Resolved
                            </h3>
                            <p className="text-sm text-green-800">
                                This violation was resolved on {violation.resolvedAt}
                                {violation.resolvedBy && ` by ${violation.resolvedBy}`}
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-white px-6 py-4 flex justify-end gap-3 border-t border-gray-200">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 border-2 border-slate-300 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                        Close
                    </button>
                    {violation.status === 'Open' && (
                        <button
                            className="px-5 py-2.5 bg-green-600 text-white rounded-lg text-sm font-bold hover:bg-green-700 transition-colors shadow-md"
                            onClick={() => onResolve(violation.id)}
                        >
                            Mark as Resolved
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ViolationDetails;
