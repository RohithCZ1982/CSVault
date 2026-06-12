import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Users, UserCheck, UserPlus, Brain, Shield, Clock, Pencil, Database,
} from 'lucide-react';
import { api } from '../utils/api';
import { PLAN_LABELS, Plan } from '../utils/plans';
import clsx from 'clsx';

interface AdminStats {
  totalUsers: number;
  activeToday: number;
  activeWeek: number;
  newThisWeek: number;
  totalTests: number;
  totalTopics: number;
}

interface AdminUser {
  id: string;
  name: string;
  email: string;
  level: string;
  role: string;
  plan: string;
  planStartedAt: string;
  planExpiresAt: string | null;
  createdAt: string;
  lastActiveAt: string | null;
  topicsCompleted: number;
  topicsInProgress: number;
  totalTopics: number;
  testsTaken: number;
  avgScore: number | null;
  bestScore: number | null;
}

function formatDate(iso: string | null) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatLastActive(iso: string | null) {
  if (!iso) return 'Never';
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60_000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return formatDate(iso);
}

const PLAN_BADGES: Record<string, string> = {
  TRIAL: 'badge-blue',
  FULL: 'badge-green',
  PREMIUM: 'badge-gold',
};

function PlanEditor({ user, onDone }: { user: AdminUser; onDone: () => void }) {
  const queryClient = useQueryClient();
  const [plan, setPlan] = useState<Plan>((user.plan as Plan) || 'TRIAL');
  const [trialDays, setTrialDays] = useState(7);
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));

  const mutation = useMutation({
    mutationFn: () =>
      api.put(`/admin/users/${user.id}/plan`, {
        plan,
        ...(plan === 'TRIAL' ? { trialDays } : {}),
        startDate: new Date(startDate + 'T00:00:00').toISOString(),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      onDone();
    },
  });

  return (
    <div className="flex flex-wrap items-center gap-2 mt-2 p-2 bg-dark-bg rounded-lg border border-dark-border">
      <select
        value={plan}
        onChange={e => setPlan(e.target.value as Plan)}
        className="input !py-1 !px-2 text-xs w-auto"
      >
        <option value="TRIAL">Trial</option>
        <option value="FULL">Full Access (1 year)</option>
        <option value="PREMIUM">Premium + AI (1 year)</option>
      </select>
      {plan === 'TRIAL' && (
        <label className="flex items-center gap-1 text-xs text-dark-muted">
          Days
          <input
            type="number"
            min={1}
            max={365}
            value={trialDays}
            onChange={e => setTrialDays(Number(e.target.value))}
            className="input !py-1 !px-2 text-xs w-16"
          />
        </label>
      )}
      <label className="flex items-center gap-1 text-xs text-dark-muted">
        From
        <input
          type="date"
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
          className="input !py-1 !px-2 text-xs w-auto"
        />
      </label>
      <button
        onClick={() => mutation.mutate()}
        disabled={mutation.isPending}
        className="btn-primary !py-1 !px-3 text-xs"
      >
        {mutation.isPending ? 'Saving…' : 'Save'}
      </button>
      <button onClick={onDone} className="btn-secondary !py-1 !px-3 text-xs">Cancel</button>
      {mutation.isError && <span className="text-xs text-red-400">Failed to save</span>}
    </div>
  );
}

export default function AdminDashboard() {
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data: stats } = useQuery<AdminStats>({
    queryKey: ['admin-stats'],
    queryFn: () => api.get('/admin/stats').then(r => r.data),
  });

  const { data: users, isLoading } = useQuery<AdminUser[]>({
    queryKey: ['admin-users'],
    queryFn: () => api.get('/admin/users').then(r => r.data),
  });

  const statCards = [
    { icon: Users, label: 'Total Users', value: stats?.totalUsers, color: 'text-primary-400 bg-primary-900/30' },
    { icon: UserCheck, label: 'Active Today', value: stats?.activeToday, color: 'text-emerald-400 bg-emerald-900/30' },
    { icon: Clock, label: 'Active This Week', value: stats?.activeWeek, color: 'text-purple-400 bg-purple-900/30' },
    { icon: UserPlus, label: 'New This Week', value: stats?.newThisWeek, color: 'text-gold-400 bg-gold-600/20' },
    { icon: Brain, label: 'Tests Taken', value: stats?.totalTests, color: 'text-orange-400 bg-orange-900/30' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-center gap-3"
      >
        <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-800 rounded-lg flex items-center justify-center">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-white">Admin Dashboard</h2>
          <p className="text-sm text-dark-muted">Registered users, progress and activity</p>
        </div>
        <Link to="/admin/content" className="btn-secondary flex items-center gap-2 text-sm">
          <Database size={15} /> Manage Content
        </Link>
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {statCards.map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="card">
            <div className={clsx('w-9 h-9 rounded-lg flex items-center justify-center mb-3', color)}>
              <Icon size={18} />
            </div>
            <div className="text-2xl font-bold text-white">{value ?? '—'}</div>
            <div className="text-xs text-dark-muted mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Users table */}
      <div className="card overflow-hidden">
        <div className="mb-4">
          <h3 className="section-title">Registered Users</h3>
          <p className="section-sub">{users?.length ?? 0} accounts</p>
        </div>

        {isLoading ? (
          <div className="py-12 text-center text-dark-muted">Loading users…</div>
        ) : (
          <div className="overflow-x-auto -mx-6 px-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-dark-muted uppercase tracking-wider border-b border-dark-border">
                  <th className="py-3 pr-4 font-medium">User</th>
                  <th className="py-3 pr-4 font-medium">Level</th>
                  <th className="py-3 pr-4 font-medium">Plan</th>
                  <th className="py-3 pr-4 font-medium">Registered</th>
                  <th className="py-3 pr-4 font-medium">Last Active</th>
                  <th className="py-3 pr-4 font-medium">Topic Progress</th>
                  <th className="py-3 pr-4 font-medium">Tests</th>
                  <th className="py-3 font-medium">Avg / Best Score</th>
                </tr>
              </thead>
              <tbody>
                {users?.map(u => {
                  const pct = u.totalTopics ? Math.round((u.topicsCompleted / u.totalTopics) * 100) : 0;
                  return (
                    <tr key={u.id} className="border-b border-dark-border/50 hover:bg-dark-border/20 transition-colors">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
                          <div>
                            <div className="text-dark-text font-medium flex items-center gap-2">
                              {u.name}
                              {u.role === 'ADMIN' && <span className="badge-red text-[10px]">ADMIN</span>}
                            </div>
                            <div className="text-xs text-dark-muted">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 pr-4">
                        <span className="badge-blue text-xs">{u.level}</span>
                      </td>
                      <td className="py-3 pr-4 min-w-[170px]">
                        {u.role === 'ADMIN' ? (
                          <span className="text-xs text-dark-muted">—</span>
                        ) : (
                          <>
                            <div className="flex items-center gap-2">
                              <span className={clsx('text-xs', PLAN_BADGES[u.plan] || 'badge-blue')}>
                                {PLAN_LABELS[u.plan as Plan] || u.plan}
                              </span>
                              <button
                                onClick={() => setEditingId(editingId === u.id ? null : u.id)}
                                className="text-dark-muted hover:text-primary-400 transition-colors"
                                title="Change plan"
                              >
                                <Pencil size={13} />
                              </button>
                            </div>
                            <div className={clsx(
                              'text-[10px] mt-0.5',
                              u.planExpiresAt && new Date(u.planExpiresAt).getTime() < Date.now()
                                ? 'text-red-400'
                                : 'text-dark-muted'
                            )}>
                              {u.planExpiresAt
                                ? (new Date(u.planExpiresAt).getTime() < Date.now() ? 'Expired ' : 'Expires ') + formatDate(u.planExpiresAt)
                                : 'No expiry'}
                            </div>
                            {editingId === u.id && <PlanEditor user={u} onDone={() => setEditingId(null)} />}
                          </>
                        )}
                      </td>
                      <td className="py-3 pr-4 text-dark-muted whitespace-nowrap">{formatDate(u.createdAt)}</td>
                      <td className="py-3 pr-4 whitespace-nowrap">
                        <span className={clsx(
                          u.lastActiveAt && Date.now() - new Date(u.lastActiveAt).getTime() < 24 * 60 * 60 * 1000
                            ? 'text-emerald-400'
                            : 'text-dark-muted'
                        )}>
                          {formatLastActive(u.lastActiveAt)}
                        </span>
                      </td>
                      <td className="py-3 pr-4 min-w-[140px]">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-dark-border rounded-full overflow-hidden">
                            <div className="h-full bg-primary-500 rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-xs text-dark-muted whitespace-nowrap">
                            {u.topicsCompleted}/{u.totalTopics}
                          </span>
                        </div>
                        {u.topicsInProgress > 0 && (
                          <div className="text-[10px] text-dark-muted mt-0.5">{u.topicsInProgress} in progress</div>
                        )}
                      </td>
                      <td className="py-3 pr-4 text-dark-text">{u.testsTaken}</td>
                      <td className="py-3 text-dark-text whitespace-nowrap">
                        {u.avgScore !== null ? `${Math.round(u.avgScore)}%` : '—'}
                        <span className="text-dark-muted"> / </span>
                        {u.bestScore !== null ? `${Math.round(u.bestScore)}%` : '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
