import { FiGrid, FiDatabase, FiGitBranch, FiCheckCircle, FiX } from 'react-icons/fi';
import logo from '../../assets/logo.png';

const navItems = [
  { icon: FiGrid, label: 'Dashboard', path: '/', active: true },
  { icon: FiDatabase, label: 'Register Dataset', path: '/register' },
  { icon: FiGitBranch, label: 'Data Lineage', path: '/lineage' },
  { icon: FiCheckCircle, label: 'Data Quality', path: '/quality' },
];

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 min-h-screen bg-sidebar flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="px-4 py-4 flex items-center justify-between">
          <img src={logo} alt="DataVista" className="h-100 w-auto" />
          <button
            onClick={onClose}
            className="lg:hidden p-2 text-sidebar-muted hover:text-sidebar-foreground transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.label}>
                <a
                  href={item.path}
                  onClick={onClose}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium
                    transition-all duration-200
                    ${item.active
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                      : 'text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-border'}
                  `}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;