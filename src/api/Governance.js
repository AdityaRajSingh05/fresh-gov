import { Client } from './Client';

/**
 * DATA TRANSFORMERS
 * Bridge the gap between backend naming and frontend naming
 */
function transformPolicy(policy) {
    return {
        id: String(policy.id),
        policyId: `POL-${String(policy.id).padStart(3, '0')}`,
        name: policy.name || policy.description || 'Untitled Policy',
        policyType: policy.policy_type || policy.type || 'GDPR',
        status: policy.status === 'ACTIVE' || policy.status === 'Active' ? 'Active' :
            policy.status === 'VIOLATED' ? 'Violated' : 'Inactive',
        datasets: policy.dataset_id ? [String(policy.dataset_id)] : policy.dataset_ids || [],
        createdAt: policy.created_at || policy.created_date || new Date().toISOString().split('T')[0],
        violations: policy.status === 'VIOLATED' ? 1 : 0,
        retentionDays: policy.retention_days,
        maskingFields: policy.masking_fields || []
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
 * GOVERNANCE API METHODS
 */

/**
 * Fetch all governance policies
 * Server endpoint: GET /api/v1/governance_policy
 * @returns {Promise<{data: Array}>}
 */
export async function getPolicies() {
    try {
        const response = await Client.get('/governance_policy');
        const policies = Array.isArray(response.data) ? response.data : (response.data.governance_policy || []);
        return { data: policies.map(transformPolicy) };
    } catch (error) {
        console.error('Error fetching policies:', error);
        throw error;
    }
}

/**
 * Fetch all datasets (used in policy creation form)
 * Server endpoint: GET /api/v1/datasets
 * @returns {Promise<{data: Array}>}
 */
export async function getDatasets() {
    const client = Client();
    try {
        const response = await client.get('/datasets');
        const datasets = Array.isArray(response.data) ? response.data : (response.data.datasets || []);
        return { data: datasets.map(transformDataset) };
    } catch (error) {
        console.error('Error fetching datasets:', error);
        throw error;
    }
}

/**
 * Create a new policy
 * Server endpoint: POST /api/v1/governance_policy
 * @param {Object} policy - Policy data from frontend
 * @returns {Promise<{data: Object}>}
 */
export async function createPolicy(policy) {
    const client = Client();

    const serverPolicy = {
        dataset_id: policy.datasets && policy.datasets.length > 0 ? Number(policy.datasets[0]) : null,
        policy_type: policy.policyType || 'GDPR',
        status: (policy.status || 'ACTIVE').toUpperCase(),  // Convert to uppercase
        description: policy.description || policy.name || '',
        created_at: new Date().toISOString().split('T')[0] + ' ' + new Date().toTimeString().split(' ')[0]
    };

    // Add retention days if provided
    if (policy.retentionDays && policy.retentionDays > 0) {
        serverPolicy.retention_days = policy.retentionDays;
    }

    // Add is_masked boolean if provided
    if (policy.isMasked !== undefined) {
        serverPolicy.is_masked = policy.isMasked;
    }

    try {
        const response = await client.post('/governance_policy', serverPolicy);
        return { data: transformPolicy(response.data) };
    } catch (error) {
        console.error('Error creating policy:', error);
        throw error;
    }
}

/**
 * Calculate policy statistics
 * @returns {Promise<{data: Object}>}
 */
export async function getPolicyStats() {
    try {
        const { data: policies } = await getPolicies();
        const totalPolicies = policies.length;
        const activePolicies = policies.filter(p => p.status === 'Active').length;
        const totalViolations = policies.reduce((sum, p) => sum + p.violations, 0);

        const complianceRate = totalPolicies > 0
            ? (((totalPolicies - policies.filter(p => p.violations > 0).length) / totalPolicies) * 100).toFixed(1)
            : 100;

        return { data: { totalPolicies, activePolicies, totalViolations, complianceRate } };
    } catch (error) {
        console.error('Error calculating policy stats:', error);
        throw error;
    }
}

/**
 * Fetch a single dataset by ID (includes full metadata with governance info)
 * Server endpoint: GET /api/v1/datasets/:id
 * @param {string|number} id - Dataset ID
 * @returns {Promise<{data: Object}>}
 */
export async function getDatasetById(id) {
    const client = Client();
    try {
        const response = await client.get(`/datasets/${id}`);
        return { data: response.data };
    } catch (error) {
        console.error('Error fetching dataset by ID:', error);
        throw error;
    }
}

/**
 * Submit a compliance review
 * Server endpoint: POST /api/v1/compliance_reviews
 * @param {Object} reviewData - Review data
 * @returns {Promise<{data: Object}>}
 */
export async function submitComplianceReview(reviewData) {
    const client = Client();
    try {
        const response = await client.post('/compliance_reviews', reviewData);
        return { data: response.data };
    } catch (error) {
        console.error('Error submitting compliance review:', error);
        throw error;
    }
}

/**
 * Fetch all compliance reviews
 * Server endpoint: GET /api/v1/compliance_reviews
 */
export async function getComplianceReviews() {
    const client = Client();
    try {
        const response = await client.get('/compliance_reviews');
        return { data: response.data };
    } catch (error) {
        console.error('Error fetching compliance reviews:', error);
        throw error;
    }
}

/**
 * Fetch a single compliance review by ID
 * Server endpoint: GET /api/v1/compliance_reviews/:id
 */
export async function getComplianceReviewById(id) {
    const client = Client();
    try {
        const response = await client.get(`/compliance_reviews/${id}`);
        return { data: response.data };
    } catch (error) {
        console.error('Error fetching compliance review by ID:', error);
        throw error;
    }
}

/**
 * Update a compliance review
 * Server endpoint: PUT /api/v1/compliance_reviews/:id
 */
export async function updateComplianceReview(id, data) {
    const client = Client();
    try {
        const response = await client.put(`/compliance_reviews/${id}`, data);
        return { data: response.data };
    } catch (error) {
        console.error('Error updating compliance review:', error);
        throw error;
    }
}

/**
 * Update a dataset (used to sync governance data)
 * Server endpoint: PUT /api/v1/datasets/:id
 */
export async function updateDataset(id, data) {
    const client = Client();
    try {
        const response = await client.put(`/datasets/${id}`, data);
        return { data: response.data };
    } catch (error) {
        console.error('Error updating dataset:', error);
        throw error;
    }
}
