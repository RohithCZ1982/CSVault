import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, Target, Clock, Award, TrendingUp, Play, BarChart2, ChevronRight } from 'lucide-react';
import { api } from '../utils/api';
import { useAuthStore } from '../store/authStore';
import clsx from 'clsx';

const subjects = [
  { name: 'Company Law', icon: '⚖️', description: 'Companies Act 2013, MOA, AOA, Meetings' },
  { name: 'Securities Law', icon: '📈', description: 'SEBI, LODR, Insider Trading, Takeover Code' },
  { name: 'Economic Laws', icon: '🏛️', description: 'IBC, FEMA, Competition Act, Consumer Protection' },
  { name: 'Secretarial Practice', icon: '📋', description: 'Secretarial Audit, Compliance, Drafting' },
  { name: 'Tax Laws', icon: '💰', description: 'Income Tax, GST, Customs, International Tax' },
  { name: 'Finance', icon: '💹', description: 'Financial Management, Treasury, Risk Management' },
];

export default function PracticeHub() {
  const { user } = useAuthStore();
  const [selectedSubject] = useState('');

  const { data: testHistory = [] } = useQuery({
    queryKey: ['test-history'],
    queryFn: () => api.get('/tests/history').then(r => r.data),
  });

  const { data: testStats } = useQuery({
    queryKey: ['test-stats'],
    queryFn: () => api.get('/tests/stats').then(r => r.data),
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-white">Practice Hub</h2>
        <p className="text-dark-muted text-sm mt-1">ICSI-pattern questions, mock tests, and adaptive learning</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Brain, label: 'Tests Taken', value: testStats?.totalTests || 0, color: 'text-primary-400' },
          { icon: Award, label: 'Best Score', value: testStats?.bestScore ? `${Math.round(testStats.bestScore)}%` : '--', color: 'text-gold-400' },
          { icon: TrendingUp, label: 'Avg Score', value: testStats?.avgScore ? `${Math.round(testStats.avgScore)}%` : '--', color: 'text-emerald-400' },
          { icon: Target, label: 'Questions Done', value: testHistory.reduce((s: number, t: { totalQ: number }) => s + t.totalQ, 0), color: 'text-purple-400' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="card flex items-center gap-3">
            <Icon className={clsx('w-8 h-8', color)} />
            <div>
              <div className="text-xl font-bold text-white">{value}</div>
              <div className="text-xs text-dark-muted">{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Start Test */}
      <div className="card bg-gradient-to-r from-primary-900/50 to-primary-950">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="text-white font-bold text-lg">Quick Mock Test</h3>
            <p className="text-primary-300 text-sm mt-1">10 random questions · 15 minutes · Your current level</p>
          </div>
          <Link
            to="/practice/test"
            state={{ subject: selectedSubject, level: user?.level, count: 10 }}
            className="btn-primary flex items-center gap-2"
          >
            <Play size={16} /> Start Now
          </Link>
        </div>
      </div>

      {/* Subject Selection */}
      <div>
        <h3 className="text-sm font-semibold text-dark-muted uppercase tracking-wider mb-3">Practice by Subject</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.map((sub, i) => (
            <motion.div
              key={sub.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <Link
                to="/practice/test"
                state={{ subject: sub.name, level: user?.level, count: 15 }}
                className={clsx(
                  'card hover:border-primary-700/50 hover:-translate-y-0.5 transition-all duration-200 group flex items-start gap-3',
                )}
              >
                <div className="text-3xl flex-shrink-0">{sub.icon}</div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-semibold text-sm group-hover:text-primary-300 transition-colors">{sub.name}</h4>
                  <p className="text-dark-muted text-xs mt-0.5">{sub.description}</p>
                </div>
                <ChevronRight size={16} className="text-dark-muted group-hover:text-primary-400 transition-colors flex-shrink-0 mt-0.5" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Test History */}
      {testHistory.length > 0 && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="section-title">Recent Tests</h3>
            <BarChart2 className="text-primary-400" size={20} />
          </div>
          <div className="space-y-3">
            {testHistory.slice(0, 5).map((test: { id: string; subject: string; score: number; totalQ: number; correctQ: number; timeTaken: number; createdAt: string }) => (
              <div key={test.id} className="flex items-center gap-4 p-3 rounded-lg bg-dark-bg/50 hover:bg-dark-bg transition-colors">
                <div className={clsx(
                  'w-12 h-12 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0',
                  test.score >= 60 ? 'bg-emerald-900/50 text-emerald-400' : 'bg-red-900/50 text-red-400'
                )}>
                  {Math.round(test.score)}%
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-dark-text text-sm font-medium">{test.subject}</p>
                  <p className="text-dark-muted text-xs">
                    {test.correctQ}/{test.totalQ} correct · {Math.round(test.timeTaken / 60)}m
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={clsx('badge', test.score >= 60 ? 'badge-green' : 'badge-red')}>
                    {test.score >= 80 ? 'Excellent' : test.score >= 60 ? 'Pass' : 'Fail'}
                  </span>
                  <Clock size={14} className="text-dark-muted" />
                  <span className="text-dark-muted text-xs">{new Date(test.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Previous Year Papers */}
      <div className="card">
        <h3 className="section-title mb-1">Previous Year Papers</h3>
        <p className="section-sub mb-4">Practice with actual ICSI exam questions</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {['June 2023', 'December 2022', 'June 2022', 'December 2021', 'June 2021', 'December 2020'].map(period => (
            <Link
              key={period}
              to="/practice/test"
              state={{ subject: 'Company Law', level: user?.level, count: 20 }}
              className="flex items-center gap-3 p-3 rounded-lg border border-dark-border hover:border-primary-700/50 hover:bg-dark-border/30 transition-all group"
            >
              <div className="w-8 h-8 bg-primary-900/40 rounded-lg flex items-center justify-center flex-shrink-0">
                <Award size={16} className="text-primary-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-dark-text text-sm font-medium">{period}</p>
                <p className="text-dark-muted text-xs">CS Executive</p>
              </div>
              <ChevronRight size={14} className="text-dark-muted group-hover:text-primary-400 transition-colors" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
