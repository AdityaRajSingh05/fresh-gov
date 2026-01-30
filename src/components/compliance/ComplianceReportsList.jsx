import React from 'react';

/**
 * ComplianceReportsList Component
 * Displays compliance reports with download links and status indicators
 * 
 * @param {Array} reports - Array of compliance report objects
 */
const ComplianceReportsList = ({ reports }) => {
    const getStatusBadge = (status) => {
        if (status === 'COMPLETED') {
            return (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Completed
                </span>
            );
        } else if (status === 'PENDING') {
            return (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                    <svg className="w-3 h-3 mr-1 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Pending
                </span>
            );
        }
        return (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
                {status}
            </span>
        );
    };

    const getReportTypeIcon = (reportType) => {
        switch (reportType) {
            case 'QUARTERLY_AUDIT':
                return (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                );
            case 'GDPR_COMPLIANCE':
                return (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                );
            case 'ACCESS_AUDIT':
                return (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                );
            case 'SECURITY_INCIDENT':
                return (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                );
            default:
                return (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                );
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleDownload = (report) => {
        if (report.status === 'PENDING') {
            // Silently return for pending reports - button is already disabled
            return;
        }

        if (!report.download_url) {
            // Silently return for missing download links - could add toast notification if needed
            console.error('Download link not available for report:', report.id);
            return;
        }

        // Create a temporary anchor element to trigger download
        const link = document.createElement('a');
        link.href = report.download_url;
        link.download = `${report.id}_${report.name.replace(/\s+/g, '_')}.${report.file_format.toLowerCase()}`;
        link.target = '_blank';

        // Append to body, click, and remove
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Optional: Log download for analytics
        console.log(`Downloaded report: ${report.name} (${report.file_format}, ${report.file_size})`);
    };

    if (!reports || reports.length === 0) {
        return (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
                <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-600 font-medium">No compliance reports available</p>
                <p className="text-gray-500 text-sm mt-1">Generate a new report to get started</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report) => (
                <div
                    key={report.id}
                    className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden"
                >
                    {/* Report Header */}
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4">
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center text-white">
                                {getReportTypeIcon(report.report_type)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-white font-semibold text-sm truncate">{report.name}</h3>
                                <p className="text-indigo-100 text-xs mt-1">{report.id}</p>
                            </div>
                        </div>
                    </div>

                    {/* Report Body */}
                    <div className="p-4">
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{report.description}</p>

                        {/* Status */}
                        <div className="mb-4">
                            {getStatusBadge(report.status)}
                        </div>

                        {/* Metadata */}
                        <div className="space-y-2 mb-4">
                            {report.status === 'COMPLETED' && (
                                <>
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-gray-500">Format:</span>
                                        <span className="font-medium text-gray-900">{report.file_format}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-gray-500">Size:</span>
                                        <span className="font-medium text-gray-900">{report.file_size}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-gray-500">Generated:</span>
                                        <span className="font-medium text-gray-900">{formatDate(report.generated_at)}</span>
                                    </div>
                                </>
                            )}
                            {report.status === 'PENDING' && report.metadata?.progress && (
                                <div className="space-y-1">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-gray-500">Progress:</span>
                                        <span className="font-medium text-gray-900">{report.metadata.progress}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${report.metadata.progress}%` }}
                                        ></div>
                                    </div>
                                </div>
                            )}
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-500">Generated by:</span>
                                <span className="font-medium text-gray-900">{report.generated_by.user_name}</span>
                            </div>
                        </div>

                        {/* Download Button */}
                        <button
                            onClick={() => handleDownload(report)}
                            disabled={report.status === 'PENDING'}
                            className={`w-full py-2 px-4 rounded-lg font-medium text-sm transition-all duration-200 ${report.status === 'COMPLETED'
                                ? 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                }`}
                        >
                            {report.status === 'COMPLETED' ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                    Download Report
                                </span>
                            ) : (
                                'Generating...'
                            )}
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ComplianceReportsList;
