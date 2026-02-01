import { FiAlertCircle } from 'react-icons/fi';

function PolicyList({ policies, loading }) {
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
            ? 'text-green-600 font-medium'
            : 'text-gray-500 font-medium';
    };

    const getPolicyTypeColor = (type) => {
        const colors = {
            'RETENTION': 'text-blue-600',
            'MASKING': 'text-purple-600'
        };
        return colors[type] || 'text-gray-600';
    };

    return (
        <>
            {/* Mobile Card View (< md) */}
            <div className="md:hidden space-y-3">
                {policies.map((policy) => (
                    <div key={policy.id} className="bg-card rounded-lg p-4 shadow-sm">
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                                <div className="text-xs font-medium text-muted-foreground mb-1">
                                    {policy.policyId}
                                </div>
                                <h3 className="font-semibold text-foreground text-sm">
                                    {policy.name}
                                </h3>
                            </div>
                            <span className={`text-xs ${getStatusColor(policy.status)}`}>
                                {policy.status}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                                <div className="text-xs text-muted-foreground mb-1">Type</div>
                                <div className={`font-medium ${getPolicyTypeColor(policy.policyType)}`}>
                                    {policy.policyType}
                                </div>
                            </div>
                            <div>
                                <div className="text-xs text-muted-foreground mb-1">Datasets</div>
                                <div className="font-medium text-foreground">
                                    1
                                </div>
                            </div>
                            <div>
                                <div className="text-xs text-muted-foreground mb-1">Violations</div>
                                <div>
                                    {policy.violations > 0 ? (
                                        <span className="inline-flex items-center gap-1 text-red-600 font-medium">
                                            <FiAlertCircle size={14} />
                                            {policy.violations}
                                        </span>
                                    ) : (
                                        <span className="text-green-600 font-medium">0</span>
                                    )}
                                </div>
                            </div>
                            <div>
                                <div className="text-xs text-muted-foreground mb-1">Created At</div>
                                <div className="font-medium text-foreground text-xs">
                                    {new Date(policy.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Desktop Table View (>= md) */}
            <div className="hidden md:block bg-card rounded-lg overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left" role="table" aria-label="Governance Policies">
                        <thead className="bg-muted/50">
                            <tr>
                                <th scope="col" className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                                    Policy ID
                                </th>
                                <th scope="col" className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider min-w-[200px]">
                                    Name
                                </th>
                                <th scope="col" className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                                    Type
                                </th>
                                <th scope="col" className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                                    Status
                                </th>
                                <th scope="col" className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-center whitespace-nowrap">
                                    Datasets
                                </th>
                                <th scope="col" className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-center whitespace-nowrap">
                                    Violations
                                </th>
                                <th scope="col" className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                                    Created At
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {policies.map((policy) => (
                                <tr key={policy.id} className="hover:bg-muted/30 transition-colors">
                                    <td className="px-4 py-3 text-sm font-medium text-foreground whitespace-nowrap">
                                        {policy.policyId}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-foreground">
                                        {policy.name}
                                    </td>
                                    <td className="px-4 py-3 text-sm whitespace-nowrap">
                                        <span className={`font-medium ${getPolicyTypeColor(policy.policyType)}`}>
                                            {policy.policyType}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm whitespace-nowrap">
                                        <span className={getStatusColor(policy.status)}>
                                            {policy.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-foreground text-center whitespace-nowrap">
                                        1
                                    </td>
                                    <td className="px-4 py-3 text-sm text-center whitespace-nowrap">
                                        {policy.violations > 0 ? (
                                            <span className="inline-flex items-center gap-1 text-red-600 font-medium">
                                                <FiAlertCircle size={14} />
                                                {policy.violations}
                                            </span>
                                        ) : (
                                            <span className="text-green-600 font-medium">0</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">
                                        {new Date(policy.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default PolicyList;

