import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { FiEdit2, FiEye, FiX, FiShield, FiActivity, FiClock, FiEyeOff, FiCheckCircle, FiAlertCircle, FiTrendingUp } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import {
    getComplianceReviews,
    getComplianceReviewById,
    updateComplianceReview,
    getDatasetById,
    updateDataset,
    getDatasets
} from '../api/Governance';

const ComplianceDashboard = () => {
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [reviews, setReviews] = useState([]);
    const [datasets, setDatasets] = useState([]);
    const [loading, setLoading] = useState(true);

    // Edit modal state
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editingReview, setEditingReview] = useState(null);
    const [editForm, setEditForm] = useState({ is_masked: false, retention_months: '', retention_days: '' });
    const [saving, setSaving] = useState(false);

    // View modal state
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [viewingReview, setViewingReview] = useState(null);
    const [viewLoading, setViewLoading] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [reviewsRes, datasetsRes] = await Promise.all([
                getComplianceReviews(),
                getDatasets()
            ]);
            setReviews(reviewsRes.data);
            setDatasets(datasetsRes.data);
        } catch (err) {
            console.error('Error fetching data:', err);
            toast.error('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    // Build dataset name map
    const datasetNameMap = {};
    datasets.forEach(d => { datasetNameMap[d.id] = d.name || `Dataset ${d.id}`; });

    // ─── Stats ───
    const totalReviews = reviews.length;
    const activeReviews = reviews.filter(r => r.policy_status === 'Active').length;
    const totalViolations = reviews.filter(r => r.policy_status === 'Violated').length;
    const complianceRate = totalReviews > 0 ? ((activeReviews / totalReviews) * 100).toFixed(1) : '0.0';

    // Derive policy type string
    const getPolicyType = (review) => {
        const types = [];
        if (review.masking_applied) types.push('Masking');
        if (review.retention_period && review.retention_period !== 'm d') types.push('Retention');
        return types.length > 0 ? types.join(', ') : 'None';
    };

    // Parse retention period string into { months, days }
    const parseRetention = (str) => {
        if (!str) return { months: '', days: '' };
        const match = str.match(/(\d*)m\s*(\d*)d/);
        if (match) return { months: match[1] || '', days: match[2] || '' };
        return { months: '', days: '' };
    };

    // ─── EDIT ───
    const handleEditClick = async (review) => {
        try {
            const res = await getDatasetById(review.dataset_id);
            const gov = res.data?.metadata?.governance || {};
            const ret = parseRetention(gov.retention_period);
            setEditingReview(review);
            setEditForm({
                is_masked: gov.is_masked || false,
                retention_months: ret.months,
                retention_days: ret.days
            });
            setEditModalOpen(true);
        } catch (err) {
            console.error('Error fetching dataset for edit:', err);
            toast.error('Failed to load dataset details');
        }
    };

    const handleEditSave = async () => {
        if (!editingReview) return;
        setSaving(true);

        const retentionPeriod = `${editForm.retention_months || ''}m ${editForm.retention_days || ''}d`;
        const isMasked = editForm.is_masked;
        const hasRetention = retentionPeriod !== 'm d' && (editForm.retention_months || editForm.retention_days);
        const newPolicyStatus = (isMasked || hasRetention) ? 'Active' : 'Violated';
        const newComplianceStatus = (isMasked || hasRetention) ? 'Compliant' : 'Non-Compliant';

        try {
            const datasetRes = await getDatasetById(editingReview.dataset_id);
            const dataset = datasetRes.data;

            await updateDataset(editingReview.dataset_id, {
                ...dataset,
                metadata: {
                    ...dataset.metadata,
                    governance: {
                        ...dataset.metadata?.governance,
                        is_masked: isMasked,
                        retention_period: retentionPeriod
                    }
                }
            });

            await updateComplianceReview(editingReview.id, {
                ...editingReview,
                masking_applied: isMasked,
                retention_period: hasRetention ? retentionPeriod : null,
                policy_status: newPolicyStatus,
                compliance_status: newComplianceStatus,
                last_reviewed: new Date().toISOString()
            });

            toast.success('Review updated successfully!');
            setEditModalOpen(false);
            setEditingReview(null);
            fetchData();
            window.dispatchEvent(new Event('compliance-updated'));
        } catch (err) {
            console.error('Error saving edit:', err);
            toast.error('Failed to save changes');
        } finally {
            setSaving(false);
        }
    };

    // ─── VIEW ───
    const handleViewClick = async (review) => {
        setViewLoading(true);
        setViewModalOpen(true);
        try {
            const res = await getComplianceReviewById(review.id);
            setViewingReview(res.data);
        } catch (err) {
            console.error('Error fetching review details:', err);
            toast.error('Failed to load review details');
            setViewModalOpen(false);
        } finally {
            setViewLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-[#f8fafc]">
            <Sidebar isOpen={isSidebarOpen} />

            <div className="flex-1 flex flex-col min-w-0">
                <Header hideSearch />

                <main className="flex-1 p-6 lg:p-8">
                    <div className="max-w-[1200px] mx-auto">

                        {/* Page Header */}
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <h1 style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '1.5rem', fontWeight: 700, color: '#1e293b', letterSpacing: '-0.025em' }}>
                                    Compliance Dashboard
                                </h1>
                                <p style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '0.875rem', color: '#94a3b8', marginTop: '4px' }}>
                                    Monitor and manage compliance reviews across datasets
                                </p>
                            </div>
                            <button
                                onClick={() => navigate('/review-policy')}
                                style={{
                                    fontFamily: 'Inter, system-ui, sans-serif',
                                    display: 'flex', alignItems: 'center', gap: '6px',
                                    padding: '8px 16px', borderRadius: '8px',
                                    backgroundColor: '#2563eb', color: '#fff',
                                    fontSize: '0.875rem', fontWeight: 600,
                                    border: 'none', cursor: 'pointer'
                                }}
                            >
                                <FiShield size={16} />
                                New Review
                            </button>
                        </div>

                        {/* Stat Cards */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
                            {/* Total Reviews */}
                            <div style={{ background: '#fff', borderRadius: '12px', padding: '20px 24px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                    <p style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '0.75rem', fontWeight: 500, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Total Reviews</p>
                                    <p style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '1.75rem', fontWeight: 700, color: '#1e293b' }}>{totalReviews}</p>
                                </div>
                                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <FiShield size={20} color="#3b82f6" />
                                </div>
                            </div>

                            {/* Active Reviews */}
                            <div style={{ background: '#fff', borderRadius: '12px', padding: '20px 24px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                    <p style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '0.75rem', fontWeight: 500, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Active Reviews</p>
                                    <p style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '1.75rem', fontWeight: 700, color: '#1e293b' }}>{activeReviews}</p>
                                </div>
                                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <FiCheckCircle size={20} color="#22c55e" />
                                </div>
                            </div>

                            {/* Total Violations */}
                            <div style={{ background: '#fff', borderRadius: '12px', padding: '20px 24px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                    <p style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '0.75rem', fontWeight: 500, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Total Violations</p>
                                    <p style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '1.75rem', fontWeight: 700, color: '#1e293b' }}>{totalViolations}</p>
                                </div>
                                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <FiAlertCircle size={20} color="#ef4444" />
                                </div>
                            </div>

                            {/* Compliance Rate */}
                            <div style={{ background: '#fff', borderRadius: '12px', padding: '20px 24px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                    <p style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '0.75rem', fontWeight: 500, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Compliance Rate</p>
                                    <p style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '1.75rem', fontWeight: 700, color: '#1e293b' }}>{complianceRate}%</p>
                                </div>
                                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#faf5ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <FiTrendingUp size={20} color="#8b5cf6" />
                                </div>
                            </div>
                        </div>

                        {/* Review Overview */}
                        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                            <div style={{ padding: '16px 24px', borderBottom: '1px solid #f1f5f9' }}>
                                <h2 style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '1rem', fontWeight: 600, color: '#1e293b' }}>Review Overview</h2>
                            </div>

                            {loading ? (
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 0' }}>
                                    <div style={{ width: '32px', height: '32px', border: '3px solid #3b82f6', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                                    <span style={{ marginLeft: '12px', color: '#94a3b8', fontFamily: 'Inter, system-ui, sans-serif' }}>Loading reviews...</span>
                                </div>
                            ) : reviews.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '48px 0' }}>
                                    <FiShield size={40} color="#cbd5e1" style={{ margin: '0 auto 12px' }} />
                                    <p style={{ color: '#94a3b8', fontFamily: 'Inter, system-ui, sans-serif' }}>No compliance reviews yet</p>
                                </div>
                            ) : (
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Inter, system-ui, sans-serif' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                                            <th style={{ textAlign: 'left', padding: '12px 24px', fontSize: '0.7rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Review ID</th>
                                            <th style={{ textAlign: 'left', padding: '12px 24px', fontSize: '0.7rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Dataset Name</th>
                                            <th style={{ textAlign: 'left', padding: '12px 24px', fontSize: '0.7rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Policy Type</th>
                                            <th style={{ textAlign: 'left', padding: '12px 24px', fontSize: '0.7rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Policy Status</th>
                                            <th style={{ textAlign: 'left', padding: '12px 24px', fontSize: '0.7rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Last Reviewed</th>
                                            <th style={{ textAlign: 'center', padding: '12px 24px', fontSize: '0.7rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reviews.map((review) => (
                                            <tr key={review.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                                                <td style={{ padding: '14px 24px', fontSize: '0.875rem', fontWeight: 500, color: '#1e293b' }}>{review.id}</td>
                                                <td style={{ padding: '14px 24px', fontSize: '0.875rem', fontWeight: 500, color: '#1e293b' }}>{datasetNameMap[review.dataset_id] || review.dataset_id}</td>
                                                <td style={{ padding: '14px 24px', fontSize: '0.875rem' }}>
                                                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                                        {review.masking_applied && (
                                                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, background: '#dbeafe', color: '#2563eb' }}>
                                                                Masking
                                                            </span>
                                                        )}
                                                        {review.retention_period && review.retention_period !== 'm d' && (
                                                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, background: '#f3e8ff', color: '#7c3aed' }}>
                                                                Retention
                                                            </span>
                                                        )}
                                                        {!review.masking_applied && (!review.retention_period || review.retention_period === 'm d') && (
                                                            <span style={{ fontSize: '0.8rem', color: '#cbd5e1', fontStyle: 'italic' }}>None</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td style={{ padding: '14px 24px' }}>
                                                    {review.policy_status === 'Active' ? (
                                                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#16a34a' }}>Active</span>
                                                    ) : (
                                                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#dc2626' }}>Violated</span>
                                                    )}
                                                </td>
                                                <td style={{ padding: '14px 24px', fontSize: '0.8rem', color: '#64748b' }}>
                                                    {new Date(review.last_reviewed).toLocaleString('en-US', {
                                                        year: 'numeric', month: 'short', day: 'numeric',
                                                        hour: '2-digit', minute: '2-digit'
                                                    })}
                                                </td>
                                                <td style={{ padding: '14px 24px', textAlign: 'center' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                                        <button
                                                            onClick={() => handleEditClick(review)}
                                                            style={{ padding: '6px', borderRadius: '6px', border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748b' }}
                                                            title="Edit"
                                                        >
                                                            <FiEdit2 size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleViewClick(review)}
                                                            style={{ padding: '6px', borderRadius: '6px', border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748b' }}
                                                            title="View"
                                                        >
                                                            <FiEye size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </main>
            </div>

            {/* ─── EDIT MODAL ─── */}
            {editModalOpen && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '16px' }}>
                    <div style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)', width: '100%', maxWidth: '480px', padding: '32px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                            <h2 style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '1.25rem', fontWeight: 700, color: '#1e293b' }}>Edit Policy</h2>
                            <button onClick={() => setEditModalOpen(false)} style={{ padding: '8px', border: 'none', background: 'transparent', cursor: 'pointer', borderRadius: '8px' }}><FiX size={20} /></button>
                        </div>

                        <p style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '0.875rem', color: '#94a3b8', marginBottom: '24px' }}>
                            Editing governance policy for <span style={{ fontWeight: 600, color: '#475569' }}>Dataset {editingReview?.dataset_id}</span>
                        </p>

                        {/* Masking Toggle */}
                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ fontFamily: 'Inter, system-ui, sans-serif', display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#475569', marginBottom: '12px' }}>Data Masking</label>
                            <div
                                onClick={() => setEditForm(f => ({ ...f, is_masked: !f.is_masked }))}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '12px',
                                    padding: '14px 16px', borderRadius: '10px', cursor: 'pointer',
                                    border: `2px solid ${editForm.is_masked ? '#bbf7d0' : '#e2e8f0'}`,
                                    background: editForm.is_masked ? '#f0fdf4' : '#f8fafc'
                                }}
                            >
                                <div style={{ width: '44px', height: '24px', borderRadius: '12px', position: 'relative', background: editForm.is_masked ? '#22c55e' : '#cbd5e1', transition: 'background 0.2s' }}>
                                    <div style={{ width: '20px', height: '20px', background: '#fff', borderRadius: '50%', position: 'absolute', top: '2px', transition: 'transform 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.15)', transform: editForm.is_masked ? 'translateX(22px)' : 'translateX(2px)' }}></div>
                                </div>
                                <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 600, color: '#475569', fontSize: '0.875rem' }}>{editForm.is_masked ? 'Enabled' : 'Disabled'}</span>
                            </div>
                        </div>

                        {/* Retention Period */}
                        <div style={{ marginBottom: '28px' }}>
                            <label style={{ fontFamily: 'Inter, system-ui, sans-serif', display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#475569', marginBottom: '12px' }}>Retention Period</label>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Months</label>
                                    <input
                                        type="number" min="0" value={editForm.retention_months}
                                        onChange={(e) => setEditForm(f => ({ ...f, retention_months: e.target.value }))}
                                        style={{ fontFamily: 'Inter, system-ui, sans-serif', width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }}
                                        placeholder="0"
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Days</label>
                                    <input
                                        type="number" min="0" value={editForm.retention_days}
                                        onChange={(e) => setEditForm(f => ({ ...f, retention_days: e.target.value }))}
                                        style={{ fontFamily: 'Inter, system-ui, sans-serif', width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }}
                                        placeholder="0"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Status preview */}
                        {(() => {
                            const hasR = editForm.retention_months || editForm.retention_days;
                            const willBeActive = editForm.is_masked || hasR;
                            return (
                                <div style={{ padding: '14px 16px', borderRadius: '10px', marginBottom: '24px', border: `2px solid ${willBeActive ? '#bbf7d0' : '#fecaca'}`, background: willBeActive ? '#f0fdf4' : '#fef2f2', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <FiActivity size={16} color={willBeActive ? '#16a34a' : '#dc2626'} />
                                    <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '0.875rem', fontWeight: 600, color: willBeActive ? '#16a34a' : '#dc2626' }}>
                                        Status will be: {willBeActive ? 'Active' : 'Violated'}
                                    </span>
                                </div>
                            );
                        })()}

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                            <button
                                onClick={() => setEditModalOpen(false)}
                                style={{ fontFamily: 'Inter, system-ui, sans-serif', padding: '8px 20px', borderRadius: '8px', border: 'none', background: '#f1f5f9', color: '#475569', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleEditSave} disabled={saving}
                                style={{ fontFamily: 'Inter, system-ui, sans-serif', padding: '8px 20px', borderRadius: '8px', border: 'none', background: saving ? '#cbd5e1' : '#2563eb', color: '#fff', fontWeight: 600, fontSize: '0.875rem', cursor: saving ? 'not-allowed' : 'pointer' }}
                            >
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ─── VIEW MODAL ─── */}
            {viewModalOpen && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '16px' }}>
                    <div style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)', width: '100%', maxWidth: '480px', padding: '32px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                            <h2 style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '1.25rem', fontWeight: 700, color: '#1e293b' }}>Review Details</h2>
                            <button onClick={() => { setViewModalOpen(false); setViewingReview(null); }} style={{ padding: '8px', border: 'none', background: 'transparent', cursor: 'pointer', borderRadius: '8px' }}><FiX size={20} /></button>
                        </div>

                        {viewLoading ? (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 0' }}>
                                <div style={{ width: '32px', height: '32px', border: '3px solid #3b82f6', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                                <span style={{ marginLeft: '12px', color: '#94a3b8', fontFamily: 'Inter, system-ui, sans-serif' }}>Loading...</span>
                            </div>
                        ) : viewingReview ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                    <div style={{ padding: '14px 16px', background: '#f8fafc', borderRadius: '10px' }}>
                                        <p style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px' }}>Review ID</p>
                                        <p style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '1.1rem', fontWeight: 700, color: '#1e293b' }}>{viewingReview.id}</p>
                                    </div>
                                    <div style={{ padding: '14px 16px', background: '#f8fafc', borderRadius: '10px' }}>
                                        <p style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px' }}>Dataset ID</p>
                                        <p style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '1.1rem', fontWeight: 700, color: '#1e293b' }}>{viewingReview.dataset_id}</p>
                                    </div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                    <div style={{ padding: '14px 16px', background: '#f8fafc', borderRadius: '10px' }}>
                                        <p style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px' }}>Masking</p>
                                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: viewingReview.masking_applied ? '#16a34a' : '#ea580c' }}>
                                            {viewingReview.masking_applied ? 'Applied' : 'Not Applied'}
                                        </span>
                                    </div>
                                    <div style={{ padding: '14px 16px', background: '#f8fafc', borderRadius: '10px' }}>
                                        <p style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px' }}>Retention</p>
                                        <p style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '0.8rem', fontWeight: 600, color: '#475569' }}>
                                            {viewingReview.retention_period && viewingReview.retention_period !== 'm d'
                                                ? viewingReview.retention_period : 'Not Applied'}
                                        </p>
                                    </div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                    <div style={{ padding: '14px 16px', background: '#f8fafc', borderRadius: '10px' }}>
                                        <p style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px' }}>Policy Status</p>
                                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: viewingReview.policy_status === 'Active' ? '#16a34a' : '#dc2626' }}>
                                            {viewingReview.policy_status}
                                        </span>
                                    </div>
                                    <div style={{ padding: '14px 16px', background: '#f8fafc', borderRadius: '10px' }}>
                                        <p style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px' }}>Compliance</p>
                                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: viewingReview.compliance_status === 'Compliant' ? '#16a34a' : '#ea580c' }}>
                                            {viewingReview.compliance_status}
                                        </span>
                                    </div>
                                </div>
                                <div style={{ padding: '14px 16px', background: '#f8fafc', borderRadius: '10px' }}>
                                    <p style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px' }}>Last Reviewed</p>
                                    <p style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '0.8rem', fontWeight: 600, color: '#475569' }}>
                                        {new Date(viewingReview.last_reviewed).toLocaleString('en-US', {
                                            year: 'numeric', month: 'long', day: 'numeric',
                                            hour: '2-digit', minute: '2-digit', second: '2-digit'
                                        })}
                                    </p>
                                </div>
                            </div>
                        ) : null}

                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                            <button
                                onClick={() => { setViewModalOpen(false); setViewingReview(null); }}
                                style={{ fontFamily: 'Inter, system-ui, sans-serif', padding: '8px 20px', borderRadius: '8px', border: 'none', background: '#f1f5f9', color: '#475569', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' }}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ComplianceDashboard;
