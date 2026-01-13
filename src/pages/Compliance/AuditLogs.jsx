import { useState, useEffect } from 'react';
import { FiUser, FiClock, FiFileText } from 'react-icons/fi';

import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import SidebarToggle from '../../components/SidebarToggle';

function AuditLogs() {
    const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // Filter logs based on search query
    const filteredLogs = logs.filter(log => {
        if (!searchQuery) return true;

        const query = searchQuery.toLowerCase();
        return (
            log.user?.toLowerCase().includes(query) ||
            log.action?.toLowerCase().includes(query) ||
            log.resource?.toLowerCase().includes(query) ||
            log.status?.toLowerCase().includes(query) ||
            log.timestamp?.toLowerCase().includes(query)
        );
    });

    useEffect(() => {
        // Mock audit logs data
        setTimeout(() => {
            setLogs([
                {
                    id: 1,
                    timestamp: '2026-01-10 18:30:00',
                    user: 'john.doe@datavista.com',
                    action: 'Created Policy',
                    resource: 'POL-003: Data Retention Policy',
                    status: 'success'
                },
                {
                    id: 2,
                    timestamp: '2026-01-10 16:45:00',
                    user: 'jane.smith@datavista.com',
                    action: 'Updated Policy',
                    resource: 'POL-001: Customer Data Access',
                    status: 'success'
                },
                {
                    id: 3,
                    timestamp: '2026-01-10 14:20:00',
                    user: 'admin@datavista.com',
                    action: 'Deleted Dataset Assignment',
                    resource: 'Dataset: orders_2024',
                    status: 'success'
                },
                {
                    id: 4,
                    timestamp: '2026-01-10 12:15:00',
                    user: 'officer@datavista.com',
                    action: 'Viewed Violations',
                    resource: 'Violations Dashboard',
                    status: 'success'
                },
                {
                    id: 5,
                    timestamp: '2026-01-10 10:00:00',
                    user: 'unauthorized@example.com',
                    action: 'Attempted Access',
                    resource: 'POL-002: PII Masking',
                    status: 'failed'
                }
            ]);
            setLoading(false);
        }, 300);
    }, []);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
    const closeSidebar = () => setSidebarOpen(false);

    const getStatusColor = (status) => {
        return status === 'success'
            ? 'text-green-600 bg-green-50'
            : 'text-red-600 bg-red-50';
    };

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
                        searchPlaceholder="Search logs by user, action, resource, or status..."
                    />
                </header>

                {/* Content Area */}
                <div className="p-6">
                    {/* Page Title */}
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-foreground">
                            Audit Logs
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Track all governance and compliance activities
                        </p>
                    </div>

                    {/* Logs Table */}
                    <div className="bg-card rounded-lg overflow-hidden shadow-sm">
                        {loading ? (
                            <div className="p-8 text-center">
                                <p className="text-muted-foreground">Loading audit logs...</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="data-table" role="table" aria-label="Audit Logs">
                                    <thead>
                                        <tr>
                                            <th scope="col" className="col-date">Timestamp</th>
                                            <th scope="col" className="col-name">User</th>
                                            <th scope="col" className="col-type">Action</th>
                                            <th scope="col" className="col-name">Resource</th>
                                            <th scope="col" className="col-status">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredLogs.map((log) => (
                                            <tr key={log.id}>
                                                <td className="whitespace-nowrap col-date">
                                                    <div className="flex items-center gap-2">
                                                        <FiClock size={14} className="text-muted-foreground" />
                                                        {log.timestamp}
                                                    </div>
                                                </td>
                                                <td className="col-name">
                                                    <div className="flex items-center gap-2">
                                                        <FiUser size={14} className="text-muted-foreground" />
                                                        {log.user}
                                                    </div>
                                                </td>
                                                <td className="font-medium col-type">{log.action}</td>
                                                <td className="col-name">
                                                    <div className="flex items-center gap-2">
                                                        <FiFileText size={14} className="text-muted-foreground" />
                                                        {log.resource}
                                                    </div>
                                                </td>
                                                <td className="col-status">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(log.status)}`}>
                                                        {log.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Log Statistics */}
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-card rounded-lg p-4 shadow-sm">
                            <p className="text-sm text-muted-foreground mb-1">Total Activities</p>
                            <p className="text-2xl font-bold text-foreground">127</p>
                        </div>
                        <div className="bg-card rounded-lg p-4 shadow-sm">
                            <p className="text-sm text-muted-foreground mb-1">Today's Activities</p>
                            <p className="text-2xl font-bold text-foreground">{logs.length}</p>
                        </div>
                        <div className="bg-card rounded-lg p-4 shadow-sm">
                            <p className="text-sm text-muted-foreground mb-1">Failed Actions</p>
                            <p className="text-2xl font-bold text-red-600">1</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default AuditLogs;
