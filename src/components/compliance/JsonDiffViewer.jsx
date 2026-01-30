import React from 'react';

/**
 * JsonDiffViewer Component
 * Displays before/after JSON diffs with syntax highlighting
 * 
 * @param {Object} before - The "before" state (can be null)
 * @param {Object} after - The "after" state (can be null)
 */
const JsonDiffViewer = ({ before, after }) => {
    if (!before && !after) {
        return (
            <div className="text-sm text-gray-500 italic">
                No changes to display
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            {/* Before State */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="text-xs font-semibold text-red-700 uppercase mb-2 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                    Before
                </h4>
                {before ? (
                    <pre className="text-xs text-red-900 overflow-x-auto whitespace-pre-wrap break-words">
                        {JSON.stringify(before, null, 2)}
                    </pre>
                ) : (
                    <div className="text-xs text-red-600 italic">No previous state</div>
                )}
            </div>

            {/* After State */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="text-xs font-semibold text-green-700 uppercase mb-2 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    After
                </h4>
                {after ? (
                    <pre className="text-xs text-green-900 overflow-x-auto whitespace-pre-wrap break-words">
                        {JSON.stringify(after, null, 2)}
                    </pre>
                ) : (
                    <div className="text-xs text-green-600 italic">No new state</div>
                )}
            </div>
        </div>
    );
};

export default JsonDiffViewer;
