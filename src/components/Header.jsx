import { FiSearch, FiMenu } from 'react-icons/fi';

const Header = ({ onMenuClick }) => {
  return (
    <header className="flex items-center justify-between px-4 md:px-8 py-4 bg-card border-b border-border gap-4">
      {/* Mobile Menu Button */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 text-foreground hover:bg-muted rounded-lg transition-colors"
      >
        <FiMenu className="w-6 h-6" />
      </button>

      {/* Search Bar */}
      <div className="relative flex-1 max-w-xl">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
        <input
          type="text"
          placeholder="Search..."
          className="w-full pl-12 pr-4 py-2 md:py-3 bg-background border border-border rounded-lg
                     text-foreground placeholder:text-muted-foreground text-sm md:text-base
                     focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                     transition-all duration-200"
        />
      </div>

      {/* User Info */}
      <div className="flex items-center gap-2 md:gap-4">
        <span className="hidden sm:block text-sm text-foreground font-medium">
          Name (Role)
        </span>
        <button
          className="px-3 md:px-4 py-2 bg-destructive text-destructive-foreground rounded-lg
                     text-sm font-medium hover:opacity-90 transition-opacity duration-200"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;