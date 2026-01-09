import React from 'react';

export default function HeaderClean() {
  return (
    <header className="w-full bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-400 rounded-md flex items-center justify-center shadow-sm">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="3" width="18" height="6" rx="1.5" fill="white" opacity="0.9" />
              <rect x="3" y="9" width="18" height="6" rx="1.5" fill="white" opacity="0.6" />
            </svg>
          </div>
          <div>
            <div className="text-lg font-bold text-gray-900">DataVista</div>
            <div className="text-xs text-gray-500">Enterprise Data Management</div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-800 font-medium">Compliance Officer</div>
          <button className="hidden md:inline-flex items-center gap-2 px-3 py-2 bg-red-500 text-white rounded-lg shadow-sm hover:bg-red-600">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 7l-1.41-1.41L12 8.17 9.41 5.59 8 7l3 3-3 3 1.41 1.41L12 13.83l2.59 2.58L16 13l-3-3 3-3z" fill="white" />
            </svg>
            <span className="text-sm font-medium">Logout</span>
          </button>
          <button className="text-sm text-gray-600 hover:text-gray-800 md:hidden">Docs</button>
        </div>
      </div>
    </header>
  );
}
