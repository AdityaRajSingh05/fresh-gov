import { useState, useEffect } from 'react';
import { FiSearch, FiAlertCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/v1';

function Header({ searchValue, onSearchChange, searchPlaceholder }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [violationCount, setViolationCount] = useState(0);

  // Fetch violation count for compliance officers
  useEffect(() => {
    if (user?.role === 'compliance_officer') {
      fetchViolationCount();
    }
  }, [user]);

  const fetchViolationCount = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/governance_policy`);
      const policies = response.data || [];
      const violations = policies.filter(policy => policy.status === 'VIOLATED');
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
    <header className="flex w-full justify-between gap-6 py-4 px-6 bg-background">
      {/* Search Bar Section */}
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

      {/* User Actions Section */}
      <div className="flex items-center gap-4 min-w-max">
        {/* Violation Count Badge - Only for Compliance Officers */}
        {/* Violation Count Badge - Only for Compliance Officers */}
        {user?.role === 'compliance_officer' && violationCount > 0 && (
          <div
            className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-700 rounded-lg border border-red-200"
            title="Active violations"
          >
            <FiAlertCircle size={16} />
            <span className="hidden sm:inline text-sm font-semibold">{violationCount} Violation{violationCount > 1 ? 's' : ''}</span>
            <span className="sm:hidden text-sm font-semibold">{violationCount}</span>
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
