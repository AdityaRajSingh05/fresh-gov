import { FiMenu, FiX } from 'react-icons/fi';

function SidebarToggle({ isOpen, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className="sidebar-toggle"
      aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
      aria-expanded={isOpen}
    >
      {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
    </button>
  );
}

export default SidebarToggle;