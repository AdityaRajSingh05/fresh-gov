import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import AuditLogTimeline from '../components/compliance/AuditLogTimeline';
import ComplianceReportsList from '../components/compliance/ComplianceReportsList';
import axios from 'axios';
import toast from 'react-hot-toast';

/**
 * ComplianceReporting Page
 * System Admin interface for audit logs and compliance reports
 * Implements VISTA-11 requirements
 */
const ComplianceReporting = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('audit-logs'); // 'audit-logs' or 'reports'
    const [loading, setLoading] = useState(true);
    const [auditLogs, setAuditLogs] = useState([]);
    const [systemLogs, setSystemLogs] = useState([]);
    const [complianceReports, setComplianceReports] = useState([]);
    const [dateRange, setDateRange] = useState({
        start: '',
        end: ''
    });

    // Check if user has system_admin role
    useEffect(() => {
        if (user && user.role !== 'system_admin') {
            toast.error('Access denied. This page is only accessible to System Administrators.');
            navigate('/dashboard');
        }
    }, [user, navigate]);

    // Fetch data from API
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [auditLogsRes, systemLogsRes, reportsRes] = await Promise.all([
                    axios.get('http://localhost:3000/api/v1/audit-logs'),
                    axios.get('http://localhost:3000/api/v1/system-audit-log'),
                    axios.get('http://localhost:3000/api/v1/compliance-reports')
                ]);

                setAuditLogs(auditLogsRes.data['audit-logs'] || auditLogsRes.data || []);
                setSystemLogs(systemLogsRes.data['system-audit-log'] || systemLogsRes.data || []);
                setComplianceReports(reportsRes.data['compliance-reports'] || reportsRes.data || []);

                toast.success('Data loaded successfully');
            } catch (error) {
                console.error('Error fetching compliance data:', error);
                toast.error('Failed to load compliance data. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Filter logs by date range
    const getFilteredLogs = () => {
        let logs = activeTab === 'audit-logs' ? auditLogs : systemLogs;

        if (dateRange.start && dateRange.end) {
            const startDate = new Date(dateRange.start);
            const endDate = new Date(dateRange.end);

            logs = logs.filter(log => {
                const logDate = new Date(log.timestamp);
                return logDate >= startDate && logDate <= endDate;
            });
        }

        return logs;
    };

    // Calculate statistics
    const stats = {
        totalLogs: auditLogs.length + systemLogs.length,
        completedReports: complianceReports.filter(r => r.status === 'COMPLETED').length,
        pendingReports: complianceReports.filter(r => r.status === 'PENDING').length,
        criticalEvents: systemLogs.filter(log => log.severity === 'CRITICAL').length
    };

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    if (loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-900 font-semibold">Loading Compliance Data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">
            {/* Sidebar */}
            <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <Header toggleSidebar={toggleSidebar} />

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
                    {/* Page Title */}
                    <div className="mb-6">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                            Compliance Reporting & Audit Logs
                        </h1>
                        <p className="text-gray-600">
                            Review system activity, audit logs, and export compliance reports for regulatory evidence
                        </p>
                    </div>

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Total Audit Logs</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.totalLogs}</p>
                                </div>
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Completed Reports</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.completedReports}</p>
                                </div>
                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Pending Reports</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.pendingReports}</p>
                                </div>
                                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Critical Events</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.criticalEvents}</p>
                                </div>
                                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tab Navigation */}
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-6">
                        <div className="border-b border-gray-200">
                            <nav className="flex -mb-px">
                                <button
                                    onClick={() => setActiveTab('audit-logs')}
                                    className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'audit-logs'
                                        ? 'border-indigo-600 text-indigo-600'
                                        : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                                        }`}
                                >
                                    <span className="flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                        User Audit Logs
                                    </span>
                                </button>
                                <button
                                    onClick={() => setActiveTab('system-logs')}
                                    className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'system-logs'
                                        ? 'border-indigo-600 text-indigo-600'
                                        : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                                        }`}
                                >
                                    <span className="flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                                        </svg>
                                        System Logs
                                    </span>
                                </button>
                                <button
                                    onClick={() => setActiveTab('reports')}
                                    className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'reports'
                                        ? 'border-indigo-600 text-indigo-600'
                                        : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                                        }`}
                                >
                                    <span className="flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        Compliance Reports
                                    </span>
                                </button>
                            </nav>
                        </div>

                        {/* Date Range Filter (for logs only) */}
                        {activeTab !== 'reports' && (
                            <div className="p-4 bg-gray-50 border-b border-gray-200">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                    <label className="text-sm font-medium text-gray-700">Filter by Date Range:</label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="date"
                                            value={dateRange.start}
                                            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                        <span className="text-gray-500">to</span>
                                        <input
                                            type="date"
                                            value={dateRange.end}
                                            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                        {(dateRange.start || dateRange.end) && (
                                            <button
                                                onClick={() => setDateRange({ start: '', end: '' })}
                                                className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                            >
                                                Clear
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Tab Content */}
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                        {activeTab === 'audit-logs' && (
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">User Activity Audit Logs</h2>
                                <AuditLogTimeline logs={getFilteredLogs()} />
                            </div>
                        )}

                        {activeTab === 'system-logs' && (
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">System Event Logs</h2>
                                <AuditLogTimeline logs={getFilteredLogs()} />
                            </div>
                        )}

                        {activeTab === 'reports' && (
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Compliance Reports</h2>
                                <ComplianceReportsList reports={complianceReports} />
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ComplianceReporting;
