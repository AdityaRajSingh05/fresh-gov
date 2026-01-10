import { FiSearch, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Header () {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="flex w-full justify-between gap-6 py-4 px-6 bg-background">
      {/* Search */}
      <div className="flex w-full border border-input rounded-md relative">
        <FiSearch
          className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
          size={20}
        />
        <input
          type="text"
          placeholder="Search..."
          className="search-input"
        />
      </div>

      {/* User Info */}
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium text-foreground">
            {user?.name || 'User'}
          </p>
          <p className="text-xs text-muted-foreground capitalize">
            {user?.role?.replace('_', ' ') || 'Guest'}
          </p>
        </div>
        <button 
          onClick={handleLogout}
          className="logout-btn flex items-center gap-2 hover:opacity-80 transition"
          title="Logout"
        >
          <FiLogOut size={18} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Header;