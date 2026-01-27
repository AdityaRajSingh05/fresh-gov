// import { FiSearch } from 'react-icons/fi';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';

// function Header() {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     // 1. Clear the authentication state and localStorage
//     logout(); 
//     // 2. Redirect the user to the login route
//     navigate('/'); 
//   };

//   return (
//     <header className="flex w-full justify-between gap-6 py-4 px-6 bg-background">
//       {/* Search Bar Section */}
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

//       {/* User Actions Section */}
//       <div className="flex items-center gap-4 min-w-max">
//         {/* Dynamic Name and Role Display */}
//         <span className="text-sm font-medium text-foreground">
//           {user ? `${user.name} (${user.role || 'User'})` : 'Loading...'}
//         </span>
        
//         {/* Logout Button with Pointer Cursor */}
//         <button 
//           className="logout-btn cursor-pointer transition-colors" 
//           onClick={handleLogout}
//           title="Sign out of Datavista"
//         >
//           Logout
//         </button>
//       </div>
//     </header>
//   );
// }

// export default Header;














// NEW CODE:- 
import { FiSearch, FiX } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Accept search props from the parent (Dashboard)
function Header({ searchQuery, setSearchQuery }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); 
    navigate('/'); 
  };

  return (
    <header className="flex w-full justify-between gap-6 py-4 px-6 bg-background">
      {/* Search Bar Section */}
      <div className="flex w-full border border-input rounded-md relative max-w-2xl">
        <FiSearch
          className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
          size={20}
        />
        <input
          type="text"
          placeholder="Search datasets, domains, or classifications..."
          className="search-input w-full pl-12 pr-10 py-2 outline-none rounded-md bg-transparent"
          // --- LINK STATE HERE ---
          value={searchQuery || ""} 
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        
        {/* --- OPTIONAL: CLEAR BUTTON --- */}
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <FiX size={16} />
          </button>
        )}
      </div>

      {/* User Actions Section */}
      <div className="flex items-center gap-4 min-w-max">
        <span className="text-sm font-medium text-foreground">
          {user ? `${user.name} (${user.role || 'User'})` : 'Enzo Ferrari (Data Steward)'}
        </span>
        
        <button 
          className="logout-btn cursor-pointer transition-colors bg-red-500 text-white px-4 py-1.5 rounded-lg hover:bg-red-600 font-semibold text-sm" 
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
