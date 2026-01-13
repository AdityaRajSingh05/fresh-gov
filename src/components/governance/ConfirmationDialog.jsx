import { FiX } from 'react-icons/fi';

function ConfirmationDialog({ isOpen, onClose, onConfirm, policy, actionType }) {
    if (!isOpen) return null;

    const isCriticalPolicy = policy?.policyType === 'Data Masking' || policy?.policyType === 'Retention';

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            role="dialog"
            aria-modal="true"
            aria-labelledby="dialog-title"
        >
            <div className="bg-card border border-border rounded-lg shadow-xl max-w-md w-full m-4">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border">
                    <h2 id="dialog-title" className="text-lg font-semibold text-foreground">
                        Confirm {actionType}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        aria-label="Close dialog"
                    >
                        <FiX size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {isCriticalPolicy && (
                        <div className="mb-4 p-4 bg-orange-50 border border-orange-200 rounded-md">
                            <p className="text-sm text-orange-800 font-medium">
                                ⚠️ Critical Policy Action
                            </p>
                            <p className="text-sm text-orange-700 mt-1">
                                This is a {policy.policyType} policy. Please review carefully before proceeding.
                            </p>
                        </div>
                    )}

                    <p className="text-sm text-foreground mb-4">
                        Are you sure you want to {actionType.toLowerCase()} the following policy?
                    </p>

                    <div className="bg-muted rounded-md p-4 space-y-2">
                        <div>
                            <span className="text-xs text-muted-foreground">Policy Name:</span>
                            <p className="text-sm font-medium text-foreground">{policy?.name}</p>
                        </div>
                        <div>
                            <span className="text-xs text-muted-foreground">Type:</span>
                            <p className="text-sm font-medium text-foreground">{policy?.policyType}</p>
                        </div>
                        {policy?.datasets && (
                            <div>
                                <span className="text-xs text-muted-foreground">Assigned Datasets:</span>
                                <p className="text-sm font-medium text-foreground">{policy.datasets.length}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-foreground bg-muted hover:bg-muted/80 rounded-md transition-colors"
                        aria-label="Cancel action"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-md transition-colors"
                        aria-label={`Confirm ${actionType.toLowerCase()}`}
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmationDialog;
