import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, BookOpen, Brain, FileText, Calendar,
  MessageSquare, ShieldCheck, User, LogOut, X, Vault,
  ChevronRight,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import clsx from 'clsx';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', to: '/dashboard' },
  { icon: BookOpen, label: 'Law Explorer', to: '/law-explorer' },
  { icon: Brain, label: 'Practice Hub', to: '/practice' },
  { icon: MessageSquare, label: 'AI Assistant', to: '/ai-assistant' },
  { icon: FileText, label: 'Documents', to: '/documents' },
  { icon: Calendar, label: 'Study Planner', to: '/study-planner' },
  { icon: ShieldCheck, label: 'Compliance Sim', to: '/compliance-simulator' },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-dark-card border-r border-dark-border">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-dark-border">
        <div className="w-9 h-9 bg-gradient-to-br from-primary-600 to-primary-800 rounded-lg flex items-center justify-center">
          <Vault className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="font-bold text-white text-lg leading-none">CS Vault</div>
          <div className="text-xs text-dark-muted">Study Companion</div>
        </div>
      </div>

      {/* User Level Badge */}
      <div className="px-4 py-3 border-b border-dark-border">
        <div className="flex items-center justify-between bg-primary-900/30 rounded-lg px-3 py-2">
          <span className="text-xs text-primary-300">Level</span>
          <span className="text-xs font-semibold text-primary-400 badge-blue">
            {user?.level || 'FOUNDATION'}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ icon: Icon, label, to }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) => clsx(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group',
              isActive
                ? 'bg-primary-600/20 text-primary-400 border border-primary-600/30'
                : 'text-dark-muted hover:text-dark-text hover:bg-dark-border/50'
            )}
          >
            {({ isActive }) => (
              <>
                <Icon className={clsx('w-4.5 h-4.5 flex-shrink-0', isActive ? 'text-primary-400' : 'text-dark-muted group-hover:text-dark-text')} size={18} />
                <span className="flex-1">{label}</span>
                {isActive && <ChevronRight size={14} className="text-primary-400" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-dark-border p-3 space-y-1">
        <NavLink
          to="/profile"
          onClick={onClose}
          className={({ isActive }) => clsx(
            'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
            isActive ? 'bg-primary-600/20 text-primary-400' : 'text-dark-muted hover:text-dark-text hover:bg-dark-border/50'
          )}
        >
          <User size={18} />
          <span className="flex-1 truncate">{user?.name || 'Profile'}</span>
        </NavLink>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-dark-muted hover:text-red-400 hover:bg-red-900/20 transition-all duration-200"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:block w-64 flex-shrink-0">
        <SidebarContent />
      </div>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
              onClick={onClose}
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="fixed left-0 top-0 bottom-0 w-64 z-50 lg:hidden"
            >
              <div className="relative h-full">
                <SidebarContent />
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-dark-muted hover:text-dark-text"
                >
                  <X size={20} />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
