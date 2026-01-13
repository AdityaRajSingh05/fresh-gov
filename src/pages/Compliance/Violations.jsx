import { useState, useEffect } from 'react';
import { FiAlertCircle, FiCheckCircle, FiClock } from 'react-icons/fi';

import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import SidebarToggle from '../../components/SidebarToggle';
import ViolationDetails from '../../components/violations/ViolationDetails';

function Violations() {
    const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
    const [violations, setViolations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedViolation, setSelectedViolation] = useState(null);

    // Filter violations based on search query
    const filteredViolations = violations.filter(violation => {
        if (!searchQuery) return true;

        const query = searchQuery.toLowerCase();
        return (
            violation.policyId?.toLowerCase().includes(query) ||
            violation.policyName?.toLowerCase().includes(query) ||
            violation.dataset?.toLowerCase().includes(query) ||
            violation.violationType?.toLowerCase().includes(query) ||
            violation.severity?.toLowerCase().includes(query) ||
            violation.status?.toLowerCase().includes(query)
        );
    });

    useEffect(() => {
        // Mock violations data
        setTimeout(() => {
            setViolations([
                {
                    id: 1,
                    policyId: 'POL-001',
                    policyName: 'Customer Data Access',
                    dataset: 'customer_data',
                    violationType: 'Unauthorized Access',
                    severity: 'High',
                    timestamp: '2026-01-10 18:00:00',
                    status: 'Open',
                    description: 'User accessed customer PII without proper authorization'
                },
                {
                    id: 2,
                    policyId: 'POL-002',
                    policyName: 'PII Masking',
                    dataset: 'user_profiles',
                    violationType: 'Data Exposure',
                    severity: 'Critical',
                    timestamp: '2026-01-10 15:30:00',
                    status: 'Open',
                    description: 'Unmasked PII data found in query results'
                },
                {
                    id: 3,
                    policyId: 'POL-003',
                    policyName: 'Data Retention',
                    dataset: 'archive_logs',
                    violationType: 'Retention Breach',
                    severity: 'Medium',
                    timestamp: '2026-01-09 10:00:00',
                    status: 'Resolved',
                    description: 'Data retained beyond policy-defined period'
                }
            ]);
            setLoading(false);
        }, 300);
    }, []);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
    const closeSidebar = () => setSidebarOpen(false);

    const handleResolveViolation = (violationId) => {
        // Update the violation status
        setViolations(prevViolations =>
            prevViolations.map(v =>
                v.id === violationId
                    ? {
                        ...v,
                        status: 'Resolved',
                        resolvedAt: new Date().toLocaleString('en-US', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                        }),
                        resolvedBy: 'Current User' // In real app, get from auth context
                    }
                    : v
            )
        );

        // Close the modal
        setSelectedViolation(null);
    };

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
            ? 'text-red-600 bg-red-50'
            : 'text-green-600 bg-green-50';
    };

    const openViolations = filteredViolations.filter(v => v.status === 'Open').length;
    const criticalViolations = filteredViolations.filter(v => v.severity === 'Critical').length;

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
                        searchPlaceholder="Search violations by policy, dataset, type, severity, or status..."
                    />
                </header>

                {/* Content Area */}
                <div className="p-6">
                    {/* Page Title */}
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-foreground">
                            Policy Violations
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Monitor and resolve policy compliance violations
                        </p>
                    </div>

                    {/* Stats Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-card rounded-lg p-4 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-red-50 rounded-lg">
                                    <FiAlertCircle className="text-red-600" size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Open Violations</p>
                                    <p className="text-2xl font-bold text-foreground">{openViolations}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-card rounded-lg p-4 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-orange-50 rounded-lg">
                                    <FiClock className="text-orange-600" size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Critical</p>
                                    <p className="text-2xl font-bold text-foreground">{criticalViolations}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-card rounded-lg p-4 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-50 rounded-lg">
                                    <FiCheckCircle className="text-green-600" size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Resolved</p>
                                    <p className="text-2xl font-bold text-foreground">
                                        {filteredViolations.filter(v => v.status === 'Resolved').length}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Violations Table */}
                    <div className="bg-card rounded-lg overflow-hidden shadow-sm">
                        {loading ? (
                            <div className="p-8 text-center">
                                <p className="text-muted-foreground">Loading violations...</p>
                            </div>
                        ) : filteredViolations.length === 0 ? (
                            <div className="p-8 text-center">
                                <FiCheckCircle className="mx-auto text-green-600 mb-3" size={48} />
                                <p className="text-muted-foreground">
                                    {searchQuery ? 'No violations found matching your search.' : 'No violations found. All policies are compliant!'}
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="data-table" role="table" aria-label="Policy Violations">
                                    <thead>
                                        <tr>
                                            <th scope="col" className="col-id">Policy</th>
                                            <th scope="col" className="col-name">Dataset</th>
                                            <th scope="col" className="col-type">Violation Type</th>
                                            <th scope="col" className="col-status">Severity</th>
                                            <th scope="col" className="col-date">Timestamp</th>
                                            <th scope="col" className="col-status">Status</th>
                                            <th scope="col" className="col-actions">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredViolations.map((violation) => (
                                            <tr key={violation.id}>
                                                <td className="col-id">
                                                    <div>
                                                        <p className="font-medium">{violation.policyId}</p>
                                                        <p className="text-xs text-muted-foreground">{violation.policyName}</p>
                                                    </div>
                                                </td>
                                                <td className="font-mono text-sm col-name">{violation.dataset}</td>
                                                <td className="col-type">{violation.violationType}</td>
                                                <td className="col-status">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getSeverityColor(violation.severity)}`}>
                                                        {violation.severity}
                                                    </span>
                                                </td>
                                                <td className="whitespace-nowrap text-sm col-date">{violation.timestamp}</td>
                                                <td className="col-status">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(violation.status)}`}>
                                                        {violation.status}
                                                    </span>
                                                </td>
                                                <td className="col-actions">
                                                    <button
                                                        className="text-sm text-primary hover:underline"
                                                        title="View details"
                                                        onClick={() => setSelectedViolation(violation)}
                                                    >
                                                        View Details
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                {/* Violation Details Modal */}
                {selectedViolation && (
                    <ViolationDetails
                        violation={selectedViolation}
                        onClose={() => setSelectedViolation(null)}
                        onResolve={handleResolveViolation}
                    />
                )}
            </main>
        </div>
    );
}

export default Violations;
