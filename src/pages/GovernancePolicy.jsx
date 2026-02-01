import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiAlertCircle } from 'react-icons/fi';

import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import SidebarToggle from '../components/SidebarToggle';
import PolicyStats from '../components/governance/PolicyStats';
import PolicyList from '../components/governance/PolicyList';
import PolicyWizard from '../components/governance/PolicyWizard';

import {
    getPolicies,
    getDatasets,
    createPolicy,
    getPolicyStats
} from '../services/governanceApi';

function GovernancePolicy() {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
    const [policies, setPolicies] = useState([]);
    const [datasets, setDatasets] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');



    // Wizard state
    const [isWizardOpen, setIsWizardOpen] = useState(false);



    // Filter policies based on search query (wrapped in useMemo to prevent re-render issues)
    const filteredPolicies = useMemo(() => {
        if (!Array.isArray(policies)) return [];
        if (!searchQuery) return policies;

        const query = searchQuery.toLowerCase().trim();
        return policies.filter(policy => {
            // Convert all fields to searchable strings
            const searchableFields = [
                String(policy.id || ''),
                String(policy.policyId || ''),
                String(policy.name || ''),
                String(policy.policyType || ''),
                String(policy.status || '')
            ].map(field => field.toLowerCase());

            // Simple substring match for all fields
            return searchableFields.some(field => field.includes(query));
        });
    }, [policies, searchQuery]);

    // Load data on mount
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        setError(null);

        try {
            const [policiesRes, datasetsRes, statsRes] = await Promise.all([
                getPolicies(),
                getDatasets(),
                getPolicyStats()
            ]);

            setPolicies(policiesRes.data);
            setDatasets(datasetsRes.data);
            setStats(statsRes.data);
        } catch (err) {
            console.error('Error loading data:', err);

            // Handle 403 Forbidden
            if (err.status === 403) {
                setError({
                    type: 'forbidden',
                    message: 'Insufficient Permissions',
                    description: 'You do not have permission to view governance policies. Please contact your administrator.'
                });
            } else {
                setError({
                    type: 'error',
                    message: 'Failed to Load Data',
                    description: err.message || 'An unexpected error occurred while loading policies.'
                });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleWizardSubmit = async (wizardData) => {
        try {
            // Transform wizard data to API format (Frontend Model)
            const policyPayload = {
                name: wizardData.name,
                policyType: wizardData.policyType,
                // If editing, preserve existing status.
                // Status is ALWAYS Active for new policies (Datasets are mandatory)
                status: 'Active',
                datasets: wizardData.selectedDatasets,
                retentionDays: wizardData.retentionDays,
                maskingFields: wizardData.maskingFields
            };

            await createPolicy(policyPayload);

            await loadData(); // Reload data to show changes
            setIsWizardOpen(false);
        } catch (error) {
            console.error('Error saving policy:', error);
            setError({ message: 'Failed to create policy. Please try again.' });
        }
    };

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
    const closeSidebar = () => setSidebarOpen(false);

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

            {/* Main Content */}
            <main className="flex-1 min-w-0 overflow-x-hidden bg-background">
                {/* Header */}
                <header className="header-with-toggle">
                    <SidebarToggle isOpen={sidebarOpen} onToggle={toggleSidebar} />

                    <Header
                        searchValue={searchQuery}
                        onSearchChange={(e) => setSearchQuery(e.target.value)}
                        searchPlaceholder="Search policies by ID, name, type, or status..."
                    />
                </header>

                {/* Content Area */}
                <div className="p-3 sm:p-4 lg:p-6">
                    {/* Page Title and Actions */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">
                                Governance & Policy Enforcement
                            </h1>
                            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                                Monitor GDPR/ISO policies and compliance across datasets
                            </p>
                        </div>
                        <button
                            onClick={() => navigate('/create')}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-sm shadow-sm"
                        >
                            <FiPlus size={20} />
                            <span>Create Policy</span>
                        </button>
                    </div>

                    {/* Error State */}
                    {error && (
                        <div className="bg-card border border-border rounded-lg p-6 sm:p-8 text-center">
                            <div className="max-w-md mx-auto">
                                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FiAlertCircle className="text-red-600" size={32} />
                                </div>
                                <h3 className="text-lg font-semibold text-foreground mb-2">
                                    {error.message}
                                </h3>
                                <p className="text-sm text-muted-foreground mb-6">
                                    {error.description}
                                </p>
                                {error.type === 'forbidden' ? (
                                    <div className="bg-orange-50 border border-orange-200 rounded-md p-4">
                                        <p className="text-sm text-orange-800">
                                            <strong>Required Permissions:</strong> Governance Admin or Compliance Officer role
                                        </p>
                                    </div>
                                ) : (
                                    <button
                                        onClick={loadData}
                                        className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                                    >
                                        Try Again
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Stats and Content */}
                    {!error && (
                        <>
                            {/* Policy Stats */}
                            <div className="mb-4 sm:mb-6 lg:mb-8">
                                <PolicyStats stats={stats} />
                            </div>

                            {/* Policy List */}
                            <div>
                                <h2 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">
                                    Policy Overview
                                </h2>
                                <PolicyList
                                    policies={filteredPolicies}
                                    loading={loading}
                                />
                            </div>
                        </>
                    )}
                </div>
            </main>

            {/* Policy Wizard (used for both create and edit) */}
            <PolicyWizard
                isOpen={isWizardOpen}
                onClose={() => {
                    setIsWizardOpen(false);
                }}
                onSubmit={handleWizardSubmit}
                datasets={datasets}
            />

        </div>
    );
}

export default GovernancePolicy;

