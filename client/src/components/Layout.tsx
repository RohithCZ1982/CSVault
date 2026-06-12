import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AlertTriangle } from 'lucide-react';
import Sidebar from './Sidebar';
import Header from './Header';
import { api } from '../utils/api';
import { useAuthStore } from '../store/authStore';
import { isPlanExpired, planDaysLeft } from '../utils/plans';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, updateUser } = useAuthStore();

  // Keep plan/role fresh so admin-assigned changes apply without re-login
  const { data: me } = useQuery({
    queryKey: ['me'],
    queryFn: () => api.get('/auth/me').then(r => r.data),
    refetchInterval: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (me) updateUser(me);
  }, [me, updateUser]);

  const expired = isPlanExpired(user);
  const daysLeft = planDaysLeft(user);
  const showTrialNotice = !expired && user?.plan === 'TRIAL' && user?.role !== 'ADMIN' && daysLeft !== null;

  return (
    <div className="flex h-screen bg-dark-bg overflow-hidden">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        {expired && (
          <div className="bg-red-900/40 border-b border-red-700/40 px-4 py-2 flex items-center gap-2 text-sm text-red-300">
            <AlertTriangle size={15} className="flex-shrink-0" />
            Your plan has expired. Contact the administrator to renew access.
          </div>
        )}
        {showTrialNotice && (
          <div className="bg-gold-600/10 border-b border-gold-600/30 px-4 py-2 flex items-center gap-2 text-sm text-gold-400">
            <AlertTriangle size={15} className="flex-shrink-0" />
            Trial plan — {daysLeft} day{daysLeft === 1 ? '' : 's'} remaining. Contact the administrator to upgrade.
          </div>
        )}
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
