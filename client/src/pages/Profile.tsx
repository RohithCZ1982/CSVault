import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Save, Loader2, BarChart2 } from 'lucide-react';
import { api } from '../utils/api';
import { useAuthStore } from '../store/authStore';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function Profile() {
  const { user, updateUser } = useAuthStore();
  const [form, setForm] = useState({ name: user?.name || '', level: user?.level || 'EXECUTIVE' });
  const [saved, setSaved] = useState(false);

  const { data: testStats } = useQuery({
    queryKey: ['test-stats'],
    queryFn: () => api.get('/tests/stats').then(r => r.data),
  });

  const { data: testHistory = [] } = useQuery({
    queryKey: ['test-history'],
    queryFn: () => api.get('/tests/history').then(r => r.data),
  });

  const { data: progressSummary } = useQuery({
    queryKey: ['progress-summary'],
    queryFn: () => api.get('/progress/summary').then(r => r.data),
  });

  const updateMutation = useMutation({
    mutationFn: (data: typeof form) => api.put('/auth/profile', data),
    onSuccess: (res) => { updateUser(res.data); setSaved(true); setTimeout(() => setSaved(false), 2000); },
  });

  const chartData = testHistory.slice(0, 8).reverse().map((t: { subject: string; score: number }, i: number) => ({
    name: `T${i + 1}`,
    score: Math.round(t.score),
    subject: t.subject,
  }));

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-white">My Profile</h2>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="card flex flex-col items-center text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-primary-600 to-primary-800 rounded-full flex items-center justify-center text-3xl font-bold text-white mb-4">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <h3 className="text-white font-bold text-lg">{user?.name}</h3>
          <p className="text-dark-muted text-sm">{user?.email}</p>
          <div className="mt-2">
            <span className="badge badge-blue">CS {user?.level}</span>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-6 w-full">
            <div className="bg-dark-bg rounded-lg p-2 text-center">
              <div className="text-white font-bold">{testStats?.totalTests || 0}</div>
              <div className="text-xs text-dark-muted">Tests</div>
            </div>
            <div className="bg-dark-bg rounded-lg p-2 text-center">
              <div className="text-white font-bold">{progressSummary?.completed || 0}</div>
              <div className="text-xs text-dark-muted">Topics</div>
            </div>
            <div className="bg-dark-bg rounded-lg p-2 text-center">
              <div className="text-white font-bold">{testStats?.avgScore ? `${Math.round(testStats.avgScore)}%` : '--'}</div>
              <div className="text-xs text-dark-muted">Avg</div>
            </div>
          </div>
        </div>

        {/* Edit Profile */}
        <div className="card lg:col-span-2">
          <h3 className="section-title mb-4">Edit Profile</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-dark-muted text-sm mb-1.5">Full Name</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="input"
              />
            </div>
            <div>
              <label className="block text-dark-muted text-sm mb-1.5">Email</label>
              <input type="email" value={user?.email || ''} disabled className="input opacity-50 cursor-not-allowed" />
            </div>
            <div>
              <label className="block text-dark-muted text-sm mb-1.5">CS Level</label>
              <select
                value={form.level}
                onChange={e => setForm(f => ({ ...f, level: e.target.value }))}
                className="input"
              >
                <option value="FOUNDATION">Foundation</option>
                <option value="EXECUTIVE">Executive</option>
                <option value="PROFESSIONAL">Professional</option>
              </select>
            </div>
            <button
              onClick={() => updateMutation.mutate(form)}
              disabled={updateMutation.isPending}
              className="btn-primary flex items-center gap-2"
            >
              {updateMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {saved ? '✓ Saved!' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>

      {/* Performance Chart */}
      {chartData.length > 0 && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="section-title">Test Score History</h3>
            <BarChart2 className="text-primary-400" size={20} />
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1a1d27', border: '1px solid #2a2d3a', borderRadius: '8px', color: '#e2e8f0' }}
                formatter={(value: number, _: string, props: { payload?: { subject: string } }) => [`${value}%`, props?.payload?.subject || 'Score']}
              />
              <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                {chartData.map((_: unknown, i: number) => (
                  <Cell key={i} fill={chartData[i].score >= 60 ? '#059669' : '#dc2626'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <p className="text-xs text-dark-muted text-center mt-2">Green: Pass (≥60%) · Red: Fail (&lt;60%)</p>
        </div>
      )}

      {/* Subject Performance */}
      {testStats?.subjectStats && Object.keys(testStats.subjectStats).length > 0 && (
        <div className="card">
          <h3 className="section-title mb-4">Performance by Subject</h3>
          <div className="space-y-3">
            {Object.entries(testStats.subjectStats).map(([subject, scores]: [string, unknown]) => {
              const arr = scores as number[];
              const avg = arr.reduce((s: number, n: number) => s + n, 0) / arr.length;
              return (
                <div key={subject}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-dark-text">{subject}</span>
                    <span className="text-dark-muted">{Math.round(avg)}% avg · {arr.length} tests</span>
                  </div>
                  <div className="h-2 bg-dark-border rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${avg}%` }}
                      transition={{ duration: 0.8 }}
                      className={`h-full rounded-full ${avg >= 60 ? 'bg-emerald-500' : 'bg-red-500'}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Achievements */}
      <div className="card">
        <h3 className="section-title mb-4">Achievements</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { icon: '🎯', label: 'First Test', desc: 'Completed first mock test', earned: (testStats?.totalTests || 0) >= 1 },
            { icon: '📚', label: 'Scholar', desc: '10 tests completed', earned: (testStats?.totalTests || 0) >= 10 },
            { icon: '⭐', label: 'Top Scorer', desc: 'Scored 80%+ in a test', earned: (testStats?.bestScore || 0) >= 80 },
            { icon: '🏆', label: 'CS Champion', desc: '20 tests completed', earned: (testStats?.totalTests || 0) >= 20 },
          ].map(({ icon, label, desc, earned }) => (
            <div key={label} className={`rounded-xl p-4 text-center border transition-all ${earned ? 'border-gold-600/40 bg-gold-900/10' : 'border-dark-border opacity-40'}`}>
              <span className="text-3xl">{icon}</span>
              <p className={`text-sm font-semibold mt-2 ${earned ? 'text-gold-400' : 'text-dark-muted'}`}>{label}</p>
              <p className="text-xs text-dark-muted mt-0.5">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
