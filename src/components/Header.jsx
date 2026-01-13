// import { FiSearch, FiLogOut } from 'react-icons/fi';
// import { useAuth } from '../context/AuthContext';
// import { useNavigate } from 'react-router-dom';

// function Header () {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     navigate('/login', { replace: true });
//   };

//   return (
//     <header className="flex w-full justify-between gap-6 py-4 px-6 bg-background">
//       {/* Search */}
//       <div className="flex w-full border border-input rounded-md relative">
//         <FiSearch
//           className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
//           size={20}
//         />
//         <input
//           type="text"
//           placeholder="Search..."
//           className="search-input"
//         />
//       </div>

//       {/* User Info */}
//       <div className="flex items-center gap-4">
//         <div className="text-right">
//           <p className="text-sm font-medium text-foreground">
//             {user?.name || 'User'}
//           </p>
//           <p className="text-xs text-muted-foreground capitalize">
//             {user?.role?.replace('_', ' ') || 'Guest'}
//           </p>
//         </div>
//         <button 
//           onClick={handleLogout}
//           className="logout-btn flex items-center gap-2 hover:opacity-80 transition"
//           title="Logout"
//         >
//           <FiLogOut size={18} />
//           <span className="hidden sm:inline">Logout</span>
//         </button>
//       </div>
//     </header>
//   );
// };

// export default Header;













// NEW CODE 1:- RESPONSIVE
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
    <header className="flex w-full justify-between gap-6 py-4 px-6 bg-background">
      {/* Search Bar Section */}
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

      {/* User Actions Section */}
      <div className="flex items-center gap-4 min-w-max">
        {/* Dynamic Name and Role Display */}
        <span className="text-sm font-medium text-foreground">
          {user ? `${user.name} (${user.role || 'User'})` : 'Loading...'}
        </span>
        
        {/* Logout Button with Pointer Cursor */}
        <button 
          className="logout-btn cursor-pointer transition-colors" 
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

 