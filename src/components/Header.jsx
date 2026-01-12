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
import React from 'react';
import { FiMenu, FiSearch, FiUser, FiLogOut } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 

const Header = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="h-20 bg-white border-b border-slate-100 px-4 md:px-8 flex items-center justify-between sticky top-0 z-30 w-full">
      <div className="flex items-center gap-4 flex-1">
        {/* Mobile Menu Trigger */}
        <button 
          onClick={onMenuClick} 
          className="lg:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-lg cursor-pointer"
        >
          <FiMenu size={24} />
        </button>

        {/* Large Search Bar - Responsive Scaling */}
        <div className="flex-1 max-w-[800px] hidden sm:block">
          <div className="relative group">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500" size={20} />
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full h-12 pl-12 pr-4 bg-white border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all text-base"
            />
          </div>
        </div>
      </div>

      {/* Right Side: User & Logout */}
      <div className="flex items-center gap-2 md:gap-6 ml-4 shrink-0">
        <div className="text-right hidden xs:block">
          <p className="text-sm font-black text-slate-900 leading-none">{user?.name || 'niraj'}</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Data Steward</p>
        </div>
        
        <div className="w-10 h-10 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center text-slate-400">
          <FiUser size={20} />
        </div>

        {/* Logout Button with explicit cursor-pointer */}
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#ef4444] hover:bg-red-600 text-white rounded-lg font-bold text-sm transition-all shadow-lg shadow-red-100 cursor-pointer active:scale-95"
        >
          <FiLogOut size={18} />
          <span className="hidden md:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Header;