import { useState, useEffect } from 'react';
import { FiSearch, FiAlertCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/v1';

function Header({ searchValue, onSearchChange, searchPlaceholder, hideSearch }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [violationCount, setViolationCount] = useState(0);

  // Fetch violation count for compliance officers
  useEffect(() => {
    if (user?.role === 'compliance_officer') {
      fetchViolationCount();
    }

    // Re-fetch when a review is edited in the dashboard
    const handler = () => fetchViolationCount();
    window.addEventListener('compliance-updated', handler);
    return () => window.removeEventListener('compliance-updated', handler);
  }, [user]);

  const fetchViolationCount = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/compliance_reviews`);
      const reviews = response.data || [];
      const violations = reviews.filter(r => r.policy_status === 'Violated');
      setViolationCount(violations.length);
    } catch (error) {
      console.error('Error fetching violation count:', error);
    }
  };

  const handleLogout = () => {
    // 1. Clear the authentication state and localStorage
    logout();
    // 2. Redirect the user to the login route
    navigate('/');
  };



  return (
    <header className={`flex w-full gap-6 py-6 px-6 bg-background ${hideSearch ? 'justify-end' : 'justify-between'}`} style={{ borderBottom: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
      {/* Search Bar Section - Conditionally rendered */}
      {!hideSearch && (
        <div className="flex w-full border border-input rounded-md relative">
          <FiSearch
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={20}
          />
          <input
            type="text"
            value={searchValue || ''}
            onChange={onSearchChange}
            placeholder={searchPlaceholder || "Search..."}
            className="search-input"
          />
        </div>
      )}

      {/* User Actions Section */}
      <div className="flex items-center gap-4 min-w-max">
        {/* Violation Count Badge - Only for Compliance Officers */}
        {/* Violation Count Badge - Only for Compliance Officers */}
        {user?.role === 'compliance_officer' && (
          <div
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '6px 14px', borderRadius: '20px',
              border: '1.5px solid #fca5a5', background: '#fff',
              color: '#dc2626', fontSize: '0.8rem', fontWeight: 600,
              fontFamily: 'Inter, system-ui, sans-serif'
            }}
            title="Active violations"
          >
            <FiAlertCircle size={15} />
            <span>{violationCount} Violation{violationCount > 1 ? 's' : ''}</span>
          </div>
        )}

        {/* Dynamic Name and Role Display */}
        <span className="hidden md:inline-block text-sm font-medium text-foreground">
          {user ? `${user.name} (${user.role === 'compliance_officer' ? 'Compliance Officer' : 'Data Steward'})` : 'Loading...'}
        </span>

        {/* Logout Button - Always Visible */}
        <button
          className="logout-btn cursor-pointer transition-colors flex items-center gap-2"
          onClick={handleLogout}
          title="Sign out of Datavista"
        >
          <span className="hidden sm:inline">Logout</span>
          <span className="sm:hidden">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </span>
        </button>
      </div>
    </header>
  );
}

export default Header;
