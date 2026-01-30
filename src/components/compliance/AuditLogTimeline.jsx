import React, { useState } from 'react';
import JsonDiffViewer from './JsonDiffViewer';

/**
 * AuditLogTimeline Component
 * Mobile-first timeline view for audit logs with expandable JSON diffs
 * 
 * @param {Array} logs - Array of audit log entries
 */
const AuditLogTimeline = ({ logs }) => {
    const [expandedLogId, setExpandedLogId] = useState(null);

    const toggleExpand = (logId) => {
        setExpandedLogId(expandedLogId === logId ? null : logId);
    };

    const getActionIcon = (action) => {
        switch (action) {
            case 'LOGIN':
            case 'LOGOUT':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                );
            case 'CREATE':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                );
            case 'UPDATE':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                );
            case 'DELETE':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                );
            case 'VIEW':
            case 'EXPORT':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                );
            default:
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
        }
    };

    const getActionColor = (action) => {
        switch (action) {
            case 'CREATE':
                return 'bg-green-100 text-green-700 border-green-300';
            case 'UPDATE':
                return 'bg-blue-100 text-blue-700 border-blue-300';
            case 'DELETE':
                return 'bg-red-100 text-red-700 border-red-300';
            case 'LOGIN':
            case 'LOGOUT':
                return 'bg-purple-100 text-purple-700 border-purple-300';
            case 'VIEW':
            case 'EXPORT':
                return 'bg-yellow-100 text-yellow-700 border-yellow-300';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-300';
        }
    };

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        return {
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        };
    };

    if (!logs || logs.length === 0) {
        return (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
                <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-600 font-medium">No audit logs found</p>
                <p className="text-gray-500 text-sm mt-1">Audit logs will appear here as users perform actions</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {logs.map((log, index) => {
                const { date, time } = formatTimestamp(log.timestamp);
                const isExpanded = expandedLogId === log.id;
                const hasChanges = log.before || log.after;

                return (
                    <div
                        key={log.id}
                        className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                    >
                        {/* Timeline Entry Header */}
                        <div className="p-4">
                            <div className="flex items-start gap-4">
                                {/* Timeline Icon */}
                                <div className={`flex-shrink-0 w-10 h-10 rounded-full border-2 flex items-center justify-center ${getActionColor(log.action)}`}>
                                    {getActionIcon(log.action)}
                                </div>

                                {/* Log Details */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2 mb-1">
                                        <div>
                                            <h4 className="text-sm font-semibold text-gray-900">{log.description}</h4>
                                            <p className="text-xs text-gray-600 mt-1">
                                                by <span className="font-medium text-gray-900">{log.user_name}</span>
                                                <span className="text-gray-400 mx-1">•</span>
                                                <span className="text-gray-500">{log.user_email}</span>
                                            </p>
                                        </div>
                                        <div className="flex-shrink-0 text-right">
                                            <div className="text-xs font-medium text-gray-900">{time}</div>
                                            <div className="text-xs text-gray-500">{date}</div>
                                        </div>
                                    </div>

                                    {/* Resource Info */}
                                    <div className="flex flex-wrap items-center gap-2 mt-2">
                                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${getActionColor(log.action)}`}>
                                            {log.action}
                                        </span>
                                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                                            {log.resource_type}
                                        </span>
                                        {log.resource_id && (
                                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-indigo-50 text-indigo-700">
                                                ID: {log.resource_id}
                                            </span>
                                        )}
                                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${log.status === 'SUCCESS' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                                            }`}>
                                            {log.status}
                                        </span>
                                    </div>

                                    {/* IP Address */}
                                    {log.ip_address && (
                                        <div className="text-xs text-gray-500 mt-2">
                                            IP: {log.ip_address}
                                        </div>
                                    )}

                                    {/* Expand Button for Changes */}
                                    {hasChanges && (
                                        <button
                                            onClick={() => toggleExpand(log.id)}
                                            className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
                                        >
                                            <svg
                                                className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                            {isExpanded ? 'Hide Changes' : 'View Changes'}
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Expandable JSON Diff */}
                            {isExpanded && hasChanges && (
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <JsonDiffViewer before={log.before} after={log.after} />
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default AuditLogTimeline;
