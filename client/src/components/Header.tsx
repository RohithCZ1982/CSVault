import { Menu, Bell, Search } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useLocation } from 'react-router-dom';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/law-explorer': 'Law Explorer',
  '/practice': 'Practice Hub',
  '/ai-assistant': 'AI CS Assistant',
  '/documents': 'Document Templates',
  '/study-planner': 'Study Planner',
  '/compliance-simulator': 'Compliance Simulator',
  '/profile': 'My Profile',
  '/admin': 'Admin Dashboard',
};

export default function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const { user } = useAuthStore();
  const location = useLocation();
  const title = Object.entries(pageTitles).find(([path]) => location.pathname.startsWith(path))?.[1] || 'CS Vault';

  return (
    <header className="flex-shrink-0 h-16 bg-dark-card border-b border-dark-border flex items-center px-4 sm:px-6 gap-4">
      <button
        onClick={onMenuClick}
        className="lg:hidden text-dark-muted hover:text-dark-text transition-colors"
      >
        <Menu size={22} />
      </button>

      <div className="flex-1">
        <h1 className="text-base font-semibold text-dark-text">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <button className="text-dark-muted hover:text-dark-text transition-colors">
          <Search size={20} />
        </button>
        <button className="text-dark-muted hover:text-dark-text transition-colors relative">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary-500 rounded-full"></span>
        </button>
        <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-800 rounded-full flex items-center justify-center text-white text-sm font-semibold">
          {user?.name?.charAt(0).toUpperCase() || 'U'}
        </div>
      </div>
    </header>
  );
}
