// import { FiGrid, FiDatabase, FiGitBranch, FiCheckCircle, FiShield } from 'react-icons/fi';
// import { useLocation, useNavigate } from 'react-router-dom';
// import logo from '../assets/logo.png';
// import { Link } from 'react-router-dom';


// const navItems = [
//   {
//     id: 'dashboard',
//     label: 'Dashboard',
//     icon: <FiGrid size={20} />,
//     path: '/dashboard',
//   },
//   {
//     id: 'register',
//     label: 'Register Dataset',
//     icon: <FiDatabase size={20} />,
//     path: '/register',
//   },
//   {
//     id: 'governance',
//     label: 'Governance',
//     icon: <FiShield size={20} />,
//     path: '/governance',
//   },
//   {
//     id: 'lineage',
//     label: 'Data Lineage',
//     icon: <FiGitBranch size={20} />,
//     path: '#',
//   },
//   {
//     id: 'quality',
//     label: 'Data Quality',
//     icon: <FiCheckCircle size={20} />,
//     path: '#',
//   },
// ];

// function Sidebar({ isOpen = true, onClose }) {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const handleNavClick = (path) => {
//     if (path !== '#') {
//       navigate(path);
//       onClose();
//     }
//   };

//   return (
//     <>
//       {/* Mobile overlay */}
//       {isOpen && (
//         <div
//           className="sidebar-overlay"
//           onClick={onClose}
//           aria-hidden="true"
//         />
//       )}
      
//       <aside className={`sidebar ${isOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
//         {/* Logo Section */}
//         <div className="sidebar-logo">
//           <img src={logo} alt="DataVista" className="h-14 w-auto" />
//         </div>

//         {/* Navigation */}
//         <nav className="sidebar-nav">
//           <ul className="space-y-3">
//             {navItems.map((item) => {
//               const isActive = location.pathname === item.path;
//               return (
//                 <li key={item.id}>
//                   <button
//                     onClick={() => handleNavClick(item.path)}
//                     className={`sidebar-nav-item w-full ${
//                       isActive ? 'active' : ''
//                     }`}
//                     title={item.label}
//                     disabled={item.path === '#'}
//                   >
//                     {item.icon}
//                     <span className="sidebar-label">{item.label}</span>
//                   </button>
//                 </li>
//               );
//             })}
//           </ul>
//         </nav>
//       </aside>
//     </>
//   );
// }

// export default Sidebar;














// NEW CODE:-
// import { FiGrid, FiDatabase, FiGitBranch, FiCheckCircle, FiShield, FiLogOut } from 'react-icons/fi';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext'; // Added this
// import logo from '../assets/logo.png';

// const navItems = [
//   { id: 'dashboard', label: 'Dashboard', icon: <FiGrid size={20} />, path: '/dashboard' },
//   { id: 'register', label: 'Register Dataset', icon: <FiDatabase size={20} />, path: '/register' },
//   { id: 'governance', label: 'Governance', icon: <FiShield size={20} />, path: '/governance' },
//   { id: 'lineage', label: 'Data Lineage', icon: <FiGitBranch size={20} />, path: '#' },
//   { id: 'quality', label: 'Data Quality', icon: <FiCheckCircle size={20} />, path: '#' },
// ];

// function Sidebar({ isOpen = true, onClose }) {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { logout } = useAuth(); // Destructure logout from your context

//   const handleNavClick = (path) => {
//     if (path !== '#') {
//       navigate(path);
//       if (typeof onClose === 'function') onClose();
//     }
//   };

//   const handleLogout = () => {
//     logout();
//     navigate('/'); // Redirect to root (LoginPage)
//   };

//   return (
//     <>
//       {isOpen && <div className="sidebar-overlay" onClick={onClose} aria-hidden="true" />}
      
//       <aside className={`sidebar ${isOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
//         <div className="sidebar-logo">
//           <img 
//             src={logo} 
//             alt="DataVista" 
//             className="h-14 w-auto cursor-pointer" 
//             onClick={() => navigate('/dashboard')}
//           />
//         </div>

//         <nav className="sidebar-nav flex flex-col justify-between h-[calc(100%-80px)]">
//           <ul className="space-y-3">
//             {navItems.map((item) => {
//               const isActive = location.pathname === item.path;
//               return (
//                 <li key={item.id}>
//                   <button
//                     onClick={() => handleNavClick(item.path)}
//                     className={`sidebar-nav-item w-full ${isActive ? 'active' : ''}`}
//                     disabled={item.path === '#'}
//                     type="button"
//                   >
//                     {item.icon}
//                     <span className="sidebar-label">{item.label}</span>
//                   </button>
//                 </li>
//               );
//             })}
//           </ul>

//           {/* Logout Button Section */}
//           <div className="mt-auto pb-4">
//             <button
//               onClick={handleLogout}
//               className="sidebar-nav-item w-full text-red-500 hover:bg-red-50"
//               type="button"
//             >
//               <FiLogOut size={20} />
//               <span className="sidebar-label font-bold">Logout</span>
//             </button>
//           </div>
//         </nav>
//       </aside>
//     </>
//   );
// }

// export default Sidebar;














// NEW CODE COLLAPSABLE VERSION:-
import { FiGrid, FiDatabase, FiGitBranch, FiCheckCircle, FiShield, FiLogOut, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';
import { useState } from 'react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: <FiGrid size={20} />, path: '/dashboard' },
  { id: 'register', label: 'Register Dataset', icon: <FiDatabase size={20} />, path: '/register' },
  { id: 'governance', label: 'Governance', icon: <FiShield size={20} />, path: '/governance' },
  { id: 'lineage', label: 'Data Lineage', icon: <FiGitBranch size={20} />, path: '#' },
  { id: 'quality', label: 'Data Quality', icon: <FiCheckCircle size={20} />, path: '#' },
];

function Sidebar({ isOpen = true, onClose }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleNavClick = (path) => {
    if (path !== '#') {
      navigate(path);
      if (window.innerWidth < 1024 && typeof onClose === 'function') onClose();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 bg-slate-900/60 z-40 backdrop-blur-sm" onClick={onClose} />
      )}
      
      {/* Sidebar Container - Added the Datavista Blue (bg-[#0f172a]) */}
      <aside 
        className={`fixed lg:static inset-y-0 left-0 z-50 bg-[#0f172a] transition-all duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${isCollapsed ? 'w-20' : 'w-64'}
        `}
      >
        {/* Collapse Toggle Button */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex absolute -right-3 top-12 w-6 h-6 bg-blue-600 border border-blue-400 rounded-full items-center justify-center text-white shadow-lg z-50 hover:bg-blue-500 transition-colors"
        >
          {isCollapsed ? <FiChevronRight size={14} /> : <FiChevronLeft size={14} />}
        </button>

        {/* Logo Section */}
        {/* Logo Section - Smart Scaling */}
        {/* Logo Section - Professional Brand Transition */}
<div className={`pt-8 pb-6 flex items-center transition-all duration-500 ${isCollapsed ? 'justify-center' : 'px-8 justify-start'}`}>
  {isCollapsed ? (
    /* Collapsed: Sleek Brand Mark */
    <div 
      onClick={() => navigate('/dashboard')}
      className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/40 cursor-pointer transform hover:rotate-12 transition-all duration-300"
    >
      <span className="text-white font-black text-xl tracking-tighter">DV</span>
    </div>
  ) : (
    /* Expanded: Full High-Res Logo */
    <img 
      src={logo} 
      alt="DataVista" 
      className="h-14 w-auto object-contain cursor-pointer drop-shadow-sm transition-all duration-500" 
      onClick={() => navigate('/dashboard')}
    />
  )}
</div>

        {/* Navigation Section */}
        <nav className="flex flex-col justify-between h-[calc(100%-140px)] px-4">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleNavClick(item.path)}
                    className={`flex items-center gap-4 w-full p-3.5 rounded-xl transition-all duration-200 group
                      ${isActive 
                        ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' 
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
                      ${isCollapsed ? 'justify-center' : 'justify-start'}
                    `}
                    title={item.label}
                  >
                    <span className={`${isActive ? 'text-blue-400' : 'group-hover:text-blue-400'}`}>
                      {item.icon}
                    </span>
                    {!isCollapsed && (
                      <span className="font-bold text-[13px] tracking-wide whitespace-nowrap">
                        {item.label}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Logout Button Section */}
          <div className="pb-6 pt-4 border-t border-slate-800">
            <button
              onClick={() => { logout(); navigate('/'); }}
              className={`flex items-center gap-4 w-full p-3.5 rounded-xl text-red-400 hover:bg-red-500/10 transition-all
                ${isCollapsed ? 'justify-center' : 'justify-start'}
              `}
            >
              <FiLogOut size={20} />
              {!isCollapsed && <span className="font-bold text-[13px]">Logout</span>}
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;