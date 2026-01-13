import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/v1';

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    timeout: 10000,
});

/**
 * Request Interceptor
 * Automatically attaches the JWT token to every request if it exists in storage.
 */
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

/**
 * Response Interceptor
 * Standardizes error objects so the UI can always rely on err.message.
 */
api.interceptors.response.use(
    (response) => response,
    (error) => {
        let customError = {
            status: error.response?.status || 500,
            message: 'An unexpected error occurred'
        };

        if (error.response) {
            customError.message = error.response.data?.message || `Error: ${error.response.status}`;
        } else if (error.request) {
            customError.message = 'Network error. Please check if the server is running.';
        } else {
            customError.message = error.message;
        }

        // We throw the custom object so catch(err) in UI works correctly
        throw customError;
    }
);

/**
 * DATA TRANSFORMERS
 * These bridge the gap between backend naming and frontend naming.
 */
function transformPolicy(policy) {
    return {
        id: String(policy.id),
        policyId: `POL-${String(policy.id).padStart(3, '0')}`,
        name: policy.description || 'Untitled Policy',
        policyType: policy.policy_type || 'GENERAL',
        status: policy.status === 'ACTIVE' ? 'Active' :
            policy.status === 'VIOLATED' ? 'Violated' : 'Inactive',
        // Convert backend dataset_id (int) to frontend datasets (array of strings)
        datasets: policy.dataset_id ? [String(policy.dataset_id)] : [],
        lastReviewed: policy.last_reviewed || new Date().toISOString().split('T')[0],
        violations: policy.status === 'VIOLATED' ? 1 : 0
    };
}

function transformDataset(dataset) {
    return {
        id: String(dataset.id),
        name: dataset.name,
        classification: dataset.classification || 'INTERNAL',
        sourceType: dataset.source_type || 'N/A'
    };
}

/**
 * API METHODS
 */

export async function getPolicies() {
    const response = await api.get('/governance_policy');
    // JSON Server might return the array directly or wrapped in an object
    const policies = Array.isArray(response.data) ? response.data : (response.data.governance_policy || []);
    return { data: policies.map(transformPolicy) };
}

export async function getDatasets() {
    const response = await api.get('/datasets');
    const datasets = Array.isArray(response.data) ? response.data : (response.data.datasets || []);
    return { data: datasets.map(transformDataset) };
}

export async function createPolicy(policy) {
    const serverPolicy = {
        dataset_id: policy.datasets && policy.datasets.length > 0 ? Number(policy.datasets[0]) : null,
        policy_type: policy.policyType || 'RETENTION',
        status: policy.status === 'Active' ? 'ACTIVE' : 'INACTIVE',
        last_reviewed: new Date().toISOString().split('T')[0],
        description: policy.name,
        created_at: new Date().toISOString()
    };

    const response = await api.post('/governance_policy', serverPolicy);
    return { data: transformPolicy(response.data) };
}

export async function updatePolicy(id, updates) {
    const serverPolicy = {
        dataset_id: updates.datasets && updates.datasets.length > 0 ? Number(updates.datasets[0]) : null,
        policy_type: updates.policyType,
        status: updates.status === 'Active' ? 'ACTIVE' : 'INACTIVE',
        description: updates.name,
        last_reviewed: new Date().toISOString().split('T')[0]
    };

    const response = await api.put(`/governance_policy/${id}`, serverPolicy);
    return { data: transformPolicy(response.data) };
}

export async function deletePolicy(id) {
    await api.delete(`/governance_policy/${id}`);
    return { success: true };
}

export async function getPolicyStats() {
    const { data: policies } = await getPolicies();
    const totalPolicies = policies.length;
    const activePolicies = policies.filter(p => p.status === 'Active').length;
    const totalViolations = policies.reduce((sum, p) => sum + p.violations, 0);

    const complianceRate = totalPolicies > 0
        ? (((totalPolicies - policies.filter(p => p.violations > 0).length) / totalPolicies) * 100).toFixed(1)
        : 100;

    return { data: { totalPolicies, activePolicies, totalViolations, complianceRate } };
}

export async function enforcePolicy(enforcement) {
    const { policyId, datasetIds } = enforcement;
    // We send the array of dataset IDs to the update function
    const updates = { datasets: datasetIds };
    return await updatePolicy(policyId, updates);
}
