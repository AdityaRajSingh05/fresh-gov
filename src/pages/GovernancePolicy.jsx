import { useState, useEffect, useMemo } from 'react';
import { FiPlus, FiAlertCircle } from 'react-icons/fi';

import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import SidebarToggle from '../components/SidebarToggle';
import PolicyStats from '../components/governance/PolicyStats';
import PolicyList from '../components/governance/PolicyList';
import PolicyForm from '../components/governance/PolicyForm';
import ConfirmationDialog from '../components/governance/ConfirmationDialog';

import {
    getPolicies,
    getDatasets,
    createPolicy,
    updatePolicy,
    deletePolicy,
    enforcePolicy,
    getPolicyStats
} from '../services/governanceApi';

function GovernancePolicy() {
    const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
    const [policies, setPolicies] = useState([]);
    const [datasets, setDatasets] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Form state
    const [showForm, setShowForm] = useState(false);
    const [editingPolicy, setEditingPolicy] = useState(null);

    // Confirmation dialog state
    const [confirmDialog, setConfirmDialog] = useState({
        isOpen: false,
        policy: null,
        actionType: '',
        onConfirm: null
    });

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

            // For the status field specifically, do exact word matching
            // This prevents "Active" from matching "Inactive"
            const statusValue = String(policy.status || '').toLowerCase();
            if (statusValue === query) {
                return true; // Exact match on status
            }

            // For other fields, use substring matching but with word boundary awareness
            return searchableFields.some(field => {
                // Exact match
                if (field === query) return true;

                // Contains as substring (for IDs, names with multiple words)
                if (field.includes(query)) {
                    // But avoid matching "active" within "inactive"
                    // Check if it's at a word boundary
                    const words = field.split(/\W+/); // Split by non-word characters
                    const queryWords = query.split(/\s+/);

                    // If query is a single word, check if it exists as a complete word
                    if (queryWords.length === 1) {
                        return words.some(word => word === query || field.startsWith(query));
                    }

                    // For multi-word queries, use substring match
                    return true;
                }

                return false;
            });
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

    const handleCreatePolicy = () => {
        setEditingPolicy(null);
        setShowForm(true);
    };

    const handleEditPolicy = (policy) => {
        setEditingPolicy(policy);
        setShowForm(true);
    };

    const handleDeletePolicy = (policyId) => {
        const policy = policies.find(p => p.id === policyId);

        setConfirmDialog({
            isOpen: true,
            policy,
            actionType: 'Delete Policy',
            onConfirm: async () => {
                try {
                    await deletePolicy(policyId);
                    await loadData();
                    setConfirmDialog({ isOpen: false, policy: null, actionType: '', onConfirm: null });
                } catch (err) {
                    console.error('Error deleting policy:', err);
                    alert('Failed to delete policy: ' + (err.message || 'Unknown error'));
                }
            }
        });
    };

    const handleSubmitPolicy = async (policyData) => {
        const isCriticalPolicy = policyData.policyType === 'Data Masking' ||
            policyData.policyType === 'Retention';

        const executeSubmit = async () => {
            try {
                if (editingPolicy) {
                    await updatePolicy(editingPolicy.id, policyData);
                } else {
                    const newPolicy = await createPolicy(policyData);

                    // Enforce policy if datasets are assigned
                    if (policyData.datasets && policyData.datasets.length > 0) {
                        await enforcePolicy({
                            policyId: newPolicy.data.id,
                            datasetIds: policyData.datasets
                        });
                    }
                }

                await loadData();
                setShowForm(false);
                setConfirmDialog({ isOpen: false, policy: null, actionType: '', onConfirm: null });
            } catch (err) {
                console.error('Error saving policy:', err);
                alert('Failed to save policy: ' + (err.message || 'Unknown error'));
            }
        };

        // Show confirmation for critical policies
        if (isCriticalPolicy && !editingPolicy) {
            setConfirmDialog({
                isOpen: true,
                policy: policyData,
                actionType: 'Apply Policy',
                onConfirm: executeSubmit
            });
        } else {
            await executeSubmit();
        }
    };

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
    const closeSidebar = () => setSidebarOpen(false);

    // Calculate violation count for header
    const violationCount = stats?.totalViolations || 0;

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

                    {/* Violation Count Badge */}
                    {violationCount > 0 && (
                        <div
                            className="flex items-center gap-2 px-3 py-1.5 bg-red-50 border border-red-200 rounded-md whitespace-nowrap flex-shrink-0"
                            role="status"
                            aria-live="polite"
                        >
                            <FiAlertCircle className="text-red-600" size={16} />
                            <span className="text-sm font-medium text-red-700">
                                {violationCount} violation{violationCount !== 1 ? 's' : ''}
                            </span>
                        </div>
                    )}
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

            {/* Policy Form Modal */}
            <PolicyForm
                isOpen={showForm}
                onClose={() => setShowForm(false)}
                onSubmit={handleSubmitPolicy}
                editPolicy={editingPolicy}
                datasets={datasets}
            />

            {/* Confirmation Dialog */}
            <ConfirmationDialog
                isOpen={confirmDialog.isOpen}
                onClose={() => setConfirmDialog({ isOpen: false, policy: null, actionType: '', onConfirm: null })}
                onConfirm={confirmDialog.onConfirm}
                policy={confirmDialog.policy}
                actionType={confirmDialog.actionType}
            />
        </div>
    );
}

export default GovernancePolicy;
