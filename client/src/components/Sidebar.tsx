import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, BookOpen, Brain, FileText, Calendar,
  MessageSquare, ShieldCheck, User, LogOut, X, Vault,
  ChevronRight, Shield, Lock,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { hasFeature, isPlanExpired, PLAN_LABELS, Feature, Plan } from '../utils/plans';
import clsx from 'clsx';

const navItems: { icon: typeof LayoutDashboard; label: string; to: string; feature?: Feature }[] = [
  { icon: LayoutDashboard, label: 'Dashboard', to: '/dashboard' },
  { icon: BookOpen, label: 'Law Explorer', to: '/law-explorer', feature: 'lawExplorer' },
  { icon: Brain, label: 'Practice Hub', to: '/practice', feature: 'practice' },
  { icon: MessageSquare, label: 'AI Assistant', to: '/ai-assistant', feature: 'ai' },
  { icon: FileText, label: 'Documents', to: '/documents', feature: 'documents' },
  { icon: Calendar, label: 'Study Planner', to: '/study-planner', feature: 'studyPlanner' },
  { icon: ShieldCheck, label: 'Compliance Sim', to: '/compliance-simulator', feature: 'compliance' },
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

      {/* User Level + Plan Badge */}
      <div className="px-4 py-3 border-b border-dark-border space-y-2">
        <div className="flex items-center justify-between bg-primary-900/30 rounded-lg px-3 py-2">
          <span className="text-xs text-primary-300">Level</span>
          <span className="text-xs font-semibold text-primary-400 badge-blue">
            {user?.level || 'FOUNDATION'}
          </span>
        </div>
        <div className="flex items-center justify-between bg-gold-600/10 rounded-lg px-3 py-2">
          <span className="text-xs text-gold-400">Plan</span>
          <span className={clsx('text-xs font-semibold', isPlanExpired(user) ? 'badge-red' : 'badge-gold')}>
            {user?.role === 'ADMIN' ? 'Admin' : isPlanExpired(user) ? 'Expired' : PLAN_LABELS[(user?.plan || 'TRIAL') as Plan] || user?.plan}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {[...navItems, ...(user?.role === 'ADMIN' ? [{ icon: Shield, label: 'Admin', to: '/admin', feature: undefined }] : [])].map(({ icon: Icon, label, to, feature }) => {
          const locked = feature !== undefined && !hasFeature(user, feature);
          if (locked) {
            return (
              <div
                key={to}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-dark-muted/50 cursor-not-allowed select-none"
                title="Not included in your plan"
              >
                <Icon className="w-4.5 h-4.5 flex-shrink-0" size={18} />
                <span className="flex-1">{label}</span>
                <Lock size={13} className="text-dark-muted/60" />
              </div>
            );
          }
          return (
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
          );
        })}
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
