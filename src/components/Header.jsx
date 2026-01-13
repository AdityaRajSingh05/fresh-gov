import { FiSearch } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    // 1. Clear the authentication state and localStorage
    logout();
    // 2. Redirect the user to the login route
    navigate('/');
  };

  return (
    <header className="flex w-full justify-between gap-2 sm:gap-6 py-3 sm:py-4 px-2 sm:px-6 bg-background">
      {/* Search Bar Section - Always visible, even on mobile */}
      <div className="flex w-full border border-input rounded-md relative">
        <FiSearch
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
          size={16}
        />
        <input
          type="text"
          placeholder="Search..."
          className="search-input pl-8 sm:pl-12 text-xs sm:text-sm"
        />
      </div>

      {/* User Actions Section */}
      <div className="flex items-center gap-1 sm:gap-4 min-w-max">
        {/* Dynamic Name and Role Display - Hidden on very small screens */}
        <span className="hidden xs:block text-xs sm:text-sm font-medium text-foreground truncate max-w-[80px] sm:max-w-none">
          {user ? `${user.first_name?.toLowerCase() || user.name} (${user.role || 'User'})` : 'Loading...'}
        </span>

        {/* Logout Button with Pointer Cursor */}
        <button
          className="logout-btn cursor-pointer transition-colors text-xs sm:text-sm whitespace-nowrap px-2 sm:px-3 py-1.5"
          onClick={handleLogout}
          title="Sign out of Datavista"
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export default Header;
