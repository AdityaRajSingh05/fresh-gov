import { useState, useEffect } from 'react';
import { FiShield, FiAlertCircle, FiCheckCircle, FiTrendingUp } from 'react-icons/fi';

import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import SidebarToggle from '../../components/SidebarToggle';

function ComplianceDashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
    const [searchQuery, setSearchQuery] = useState('');
    const [stats, setStats] = useState({
        totalPolicies: 0,
        activePolicies: 0,
        totalViolations: 0,
        complianceRate: 0
    });
    const [activities, setActivities] = useState([]);

    useEffect(() => {
        // Load dashboard stats (mock data for now)
        setStats({
            totalPolicies: 3,
            activePolicies: 2,
            totalViolations: 2,
            complianceRate: 66.7
        });

        // Load recent activities
        setActivities([
            {
                id: 1,
                type: 'violation',
                icon: 'alert',
                iconColor: 'text-red-600',
                title: 'Policy Violation Detected',
                description: 'Customer Data Access - POL-001',
                time: '2 hours ago'
            },
            {
                id: 2,
                type: 'policy',
                icon: 'check',
                iconColor: 'text-green-600',
                title: 'New Policy Activated',
                description: 'Data Retention Policy - POL-003',
                time: '5 hours ago'
            },
            {
                id: 3,
                type: 'audit',
                icon: 'shield',
                iconColor: 'text-blue-600',
                title: 'Compliance Audit Completed',
                description: 'Q4 2025 GDPR Audit',
                time: '1 day ago'
            }
        ]);
    }, []);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
    const closeSidebar = () => setSidebarOpen(false);

    const metrics = [
        {
            icon: <FiShield size={24} />,
            value: stats.totalPolicies,
            label: 'Total Policies',
            colorClass: 'blue'
        },
        {
            icon: <FiCheckCircle size={24} />,
            value: stats.activePolicies,
            label: 'Active Policies',
            colorClass: 'yellow'
        },
        {
            icon: <FiAlertCircle size={24} />,
            value: stats.totalViolations,
            label: 'Total Violations',
            colorClass: 'purple'
        },
        {
            icon: <FiTrendingUp size={24} />,
            value: `${stats.complianceRate}%`,
            label: 'Compliance Rate',
            colorClass: 'blue'
        }
    ];

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

            {/* Main Content */}
            <main className="flex-1 min-w-0 overflow-x-hidden bg-background">
                {/* Header with Toggle */}
                <header className="header-with-toggle">
                    <SidebarToggle isOpen={sidebarOpen} onToggle={toggleSidebar} />
                    <Header
                        searchValue={searchQuery}
                        onSearchChange={(e) => setSearchQuery(e.target.value)}
                        searchPlaceholder="Search recent activity..."
                    />
                </header>

                {/* Content Area */}
                <div className="p-4 sm:p-6">
                    {/* Page Title */}
                    <div className="mb-4 sm:mb-6">
                        <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                            Compliance Dashboard
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Monitor governance policies and compliance metrics
                        </p>
                    </div>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
                        {metrics.map((metric, index) => (
                            <div key={index} className="metric-card">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <p className="text-sm text-muted-foreground mb-2">{metric.label}</p>
                                        <p className="text-3xl font-bold text-foreground">{metric.value}</p>
                                    </div>
                                    <div className={`metric-icon ${metric.colorClass}`}>
                                        {metric.icon}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-card rounded-lg p-6 shadow-sm">
                        <h2 className="text-lg font-semibold text-foreground mb-4">
                            Recent Activity
                        </h2>
                        <div className="space-y-3">
                            {activities.length === 0 ? (
                                <p className="text-center text-muted-foreground py-8">
                                    No recent activity
                                </p>
                            ) : (
                                activities.map((activity) => {
                                    const IconComponent = activity.icon === 'alert' ? FiAlertCircle :
                                        activity.icon === 'check' ? FiCheckCircle : FiShield;

                                    return (
                                        <div key={activity.id} className="flex items-center gap-3 p-3 bg-background rounded-md">
                                            <IconComponent className={activity.iconColor} size={20} />
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-foreground">{activity.title}</p>
                                                <p className="text-xs text-muted-foreground">{activity.description}</p>
                                            </div>
                                            <span className="text-xs text-muted-foreground">{activity.time}</span>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default ComplianceDashboard;
