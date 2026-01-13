import { FiEdit2, FiTrash2, FiAlertCircle } from 'react-icons/fi';

function PolicyList({ policies, onEdit, onDelete, loading }) {
    if (loading) {
        return (
            <div className="bg-card rounded-lg p-8 text-center shadow-sm">
                <p className="text-muted-foreground">Loading policies...</p>
            </div>
        );
    }

    if (!policies || policies.length === 0) {
        return (
            <div className="bg-card rounded-lg p-8 text-center shadow-sm">
                <p className="text-muted-foreground">No policies found.</p>
            </div>
        );
    }

    const getStatusColor = (status) => {
        return status === 'Active'
            ? 'text-green-600 bg-green-50 border-green-200'
            : 'text-gray-600 bg-gray-50 border-gray-200';
    };

    const getPolicyTypeColor = (type) => {
        const colors = {
            'Retention': 'text-blue-600 bg-blue-50',
            'Data Masking': 'text-purple-600 bg-purple-50',
            'Access Control': 'text-orange-600 bg-orange-50'
        };
        return colors[type] || 'text-gray-600 bg-gray-50';
    };

    // Check if we have action handlers (for edit/delete)
    const hasActions = onEdit && onDelete;

    return (
        <div className="bg-card rounded-lg overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="data-table" role="table" aria-label="Governance Policies">
                    <thead>
                        <tr>
                            <th scope="col" className="col-id">Policy ID</th>
                            <th scope="col" className="col-name">Name</th>
                            <th scope="col" className="col-type">Type</th>
                            <th scope="col" className="col-status">Status</th>
                            <th scope="col" className="col-count">Datasets</th>
                            <th scope="col" className="col-count">Violations</th>
                            <th scope="col" className="col-date">Last Reviewed</th>
                            {hasActions && <th scope="col" className="col-actions">Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {policies.map((policy) => (
                            <tr key={policy.id}>
                                <td className="font-medium col-id">{policy.policyId}</td>
                                <td className="col-name">{policy.name}</td>
                                <td className="col-type">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPolicyTypeColor(policy.policyType)}`}>
                                        {policy.policyType}
                                    </span>
                                </td>
                                <td className="col-status">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(policy.status)}`}>
                                        {policy.status}
                                    </span>
                                </td>
                                <td className="col-count">{policy.datasets?.length || 0}</td>
                                <td className="col-count">
                                    {policy.violations > 0 ? (
                                        <span className="inline-flex items-center gap-1 text-red-600">
                                            <FiAlertCircle size={14} />
                                            {policy.violations}
                                        </span>
                                    ) : (
                                        <span className="text-green-600">0</span>
                                    )}
                                </td>
                                <td className="col-date">{new Date(policy.lastReviewed).toLocaleDateString()}</td>
                                {hasActions && (
                                    <td className="col-actions">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => onEdit(policy)}
                                                className="p-2 text-primary hover:bg-primary/10 rounded-md transition-colors"
                                                aria-label={`Edit policy ${policy.name}`}
                                                title="Edit Policy"
                                            >
                                                <FiEdit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => onDelete(policy.id)}
                                                className="p-2 text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                                                aria-label={`Delete policy ${policy.name}`}
                                                title="Delete Policy"
                                            >
                                                <FiTrash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default PolicyList;

