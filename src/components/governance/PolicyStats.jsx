import { FiAlertCircle, FiCheckCircle, FiShield, FiTrendingUp } from 'react-icons/fi';

function PolicyStats({ stats }) {
    const metrics = [
        {
            icon: <FiShield size={24} />,
            value: stats?.totalPolicies || 0,
            label: 'Total Policies',
            colorClass: 'blue'
        },
        {
            icon: <FiCheckCircle size={24} />,
            value: stats?.activePolicies || 0,
            label: 'Active Policies',
            colorClass: 'yellow'
        },
        {
            icon: <FiAlertCircle size={24} />,
            value: stats?.totalViolations || 0,
            label: 'Total Violations',
            colorClass: 'purple'
        },
        {
            icon: <FiTrendingUp size={24} />,
            value: `${stats?.complianceRate || 0}%`,
            label: 'Compliance Rate',
            colorClass: 'blue'
        }
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {metrics.map((metric, index) => (
                <div key={index} className="metric-card">
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <p className="text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2">{metric.label}</p>
                            <p className="text-2xl sm:text-3xl font-bold text-foreground">{metric.value}</p>
                        </div>
                        <div className={`metric-icon ${metric.colorClass}`}>
                            {metric.icon}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default PolicyStats;
