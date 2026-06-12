import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  BookOpen, Brain, MessageSquare, TrendingUp, Target,
  Award, Clock, ArrowRight, CheckCircle, AlertCircle,
  Flame, Calendar,
} from 'lucide-react';
import { api } from '../utils/api';
import { useAuthStore } from '../store/authStore';

const quickLinks = [
  { icon: BookOpen, label: 'Law Explorer', to: '/law-explorer', desc: 'Browse sections & provisions', color: 'from-blue-600 to-blue-800' },
  { icon: Brain, label: 'Take a Test', to: '/practice', desc: 'Practice questions', color: 'from-purple-600 to-purple-800' },
  { icon: MessageSquare, label: 'Ask AI', to: '/ai-assistant', desc: 'Get instant answers', color: 'from-emerald-600 to-emerald-800' },
  { icon: Calendar, label: 'Study Plan', to: '/study-planner', desc: 'Plan your week', color: 'from-orange-600 to-orange-800' },
];

const SUBJECT_COLORS = ['bg-primary-500', 'bg-purple-500', 'bg-emerald-500', 'bg-orange-500', 'bg-pink-500', 'bg-cyan-500'];

const importantTopics = [
  { title: 'AGM Requirements', section: 'S. 96', subject: 'Company Law', priority: 'high' },
  { title: 'Board Composition', section: 'S. 149', subject: 'Company Law', priority: 'high' },
  { title: 'CSR Obligations', section: 'S. 135', subject: 'Company Law', priority: 'medium' },
  { title: 'SEBI LODR', section: 'LODR 2015', subject: 'Securities Law', priority: 'high' },
  { title: 'IBC - CIRP Process', section: 'IBC 2016', subject: 'Economic Laws', priority: 'medium' },
  { title: 'Secretarial Audit', section: 'S. 204', subject: 'Sec. Practice', priority: 'high' },
];

export default function Dashboard() {
  const { user } = useAuthStore();

  const { data: progressSummary } = useQuery({
    queryKey: ['progress-summary'],
    queryFn: () => api.get('/progress/summary').then(r => r.data),
  });

  const { data: testStats } = useQuery({
    queryKey: ['test-stats'],
    queryFn: () => api.get('/tests/stats').then(r => r.data),
  });

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary-900/60 to-primary-950 border border-primary-700/30 rounded-xl p-6"
      >
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">
              {greeting()}, {user?.name?.split(' ')[0]}! 👋
            </h2>
            <p className="text-primary-300 text-sm mt-1">
              CS {user?.level} Level · Keep up the great work!
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 bg-primary-800/40 rounded-lg px-3 py-2">
            <Flame className="w-5 h-5 text-orange-400" />
            <span className="text-white text-sm font-semibold">Study Streak</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-5">
          <div className="bg-primary-900/40 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-white">{progressSummary?.completed || 0}</div>
            <div className="text-xs text-primary-300">Topics Done</div>
          </div>
          <div className="bg-primary-900/40 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-white">{testStats?.totalTests || 0}</div>
            <div className="text-xs text-primary-300">Tests Taken</div>
          </div>
          <div className="bg-primary-900/40 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-white">
              {testStats?.avgScore ? `${Math.round(testStats.avgScore)}%` : '--'}
            </div>
            <div className="text-xs text-primary-300">Avg Score</div>
          </div>
        </div>
      </motion.div>

      {/* Quick Access */}
      <div>
        <h3 className="text-sm font-semibold text-dark-muted uppercase tracking-wider mb-3">Quick Access</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickLinks.map(({ icon: Icon, label, to, desc, color }, i) => (
            <motion.div
              key={to}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <Link
                to={to}
                className="card hover:border-primary-700/50 hover:-translate-y-0.5 transition-all duration-200 group flex flex-col gap-3"
              >
                <div className={`w-10 h-10 bg-gradient-to-br ${color} rounded-lg flex items-center justify-center`}>
                  <Icon size={20} className="text-white" />
                </div>
                <div>
                  <div className="text-white text-sm font-semibold group-hover:text-primary-300 transition-colors">{label}</div>
                  <div className="text-dark-muted text-xs">{desc}</div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Important Topics */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="section-title">High-Priority Topics</h3>
              <p className="section-sub">Focus on these for your exams</p>
            </div>
            <Link to="/law-explorer" className="text-primary-400 hover:text-primary-300 text-xs flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="space-y-2">
            {importantTopics.map(({ title, section, subject, priority }) => (
              <Link
                key={title}
                to="/law-explorer"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-dark-border/30 transition-colors group"
              >
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${priority === 'high' ? 'bg-red-400' : 'bg-yellow-400'}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-dark-text font-medium group-hover:text-primary-300 transition-colors truncate">{title}</div>
                  <div className="text-xs text-dark-muted">{subject} · {section}</div>
                </div>
                {priority === 'high' && (
                  <AlertCircle size={14} className="text-red-400 flex-shrink-0" />
                )}
              </Link>
            ))}
          </div>
        </div>

        {/* Progress Overview */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="section-title">Study Progress</h3>
              <p className="section-sub">Your learning journey</p>
            </div>
            <TrendingUp className="text-primary-400" size={20} />
          </div>

          <div className="space-y-4">
            {(progressSummary?.bySubject || []).map(({ subject, percent, completed, totalTopics }: { subject: string; percent: number; completed: number; totalTopics: number }, i: number) => (
              <div key={subject}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-dark-text">{subject}</span>
                  <span className="text-dark-muted">{completed}/{totalTopics} · {percent}%</span>
                </div>
                <div className="h-2 bg-dark-border rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percent}%` }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className={`h-full ${SUBJECT_COLORS[i % SUBJECT_COLORS.length]} rounded-full`}
                  />
                </div>
              </div>
            ))}
            {progressSummary && progressSummary.bySubject?.length === 0 && (
              <p className="text-sm text-dark-muted">No topics available yet.</p>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3 mt-5">
            <div className="bg-emerald-900/20 border border-emerald-800/30 rounded-lg p-3 text-center">
              <CheckCircle size={18} className="text-emerald-400 mx-auto mb-1" />
              <div className="text-white text-lg font-bold">{progressSummary?.completed || 0}</div>
              <div className="text-xs text-dark-muted">Completed</div>
            </div>
            <div className="bg-primary-900/20 border border-primary-800/30 rounded-lg p-3 text-center">
              <Clock size={18} className="text-primary-400 mx-auto mb-1" />
              <div className="text-white text-lg font-bold">{progressSummary?.inProgress || 0}</div>
              <div className="text-xs text-dark-muted">In Progress</div>
            </div>
            <div className="bg-orange-900/20 border border-orange-800/30 rounded-lg p-3 text-center">
              <Target size={18} className="text-orange-400 mx-auto mb-1" />
              <div className="text-white text-lg font-bold">{testStats?.bestScore ? `${Math.round(testStats.bestScore)}%` : '--'}</div>
              <div className="text-xs text-dark-muted">Best Score</div>
            </div>
          </div>
        </div>
      </div>

      {/* Exam Countdown + Tips */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card bg-gradient-to-br from-dark-card to-primary-950/30">
          <div className="flex items-center gap-3 mb-4">
            <Award className="text-gold-400" size={22} />
            <h3 className="section-title">Exam Tips for {user?.level} Level</h3>
          </div>
          <ul className="space-y-2.5 text-sm text-dark-muted">
            {user?.level === 'FOUNDATION' ? [
              'Focus on definitions - Section 2 is asked frequently',
              'Memorize minimum director/member requirements',
              'Understand basic financial concepts',
              'Practice MCQs from previous year papers',
            ] : user?.level === 'EXECUTIVE' ? [
              'Master Section 96 (AGM) and Section 149 (Board) thoroughly',
              'Understand Section 185 loan restrictions with exceptions',
              'Practice case studies for Company Law',
              'Cover SEBI LODR basic requirements',
            ] : [
              'Secretarial Audit (MR-3) is heavily tested',
              'SEBI LODR compliance requirements are crucial',
              'IBC CIRP timelines must be memorized',
              'Practice drafting resolutions and minutes',
            ].map((tip, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle size={14} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                {tip}
              </li>
            ))}
          </ul>
        </div>

        <div className="card">
          <h3 className="section-title mb-1">Recent Updates</h3>
          <p className="section-sub mb-4">Important law changes affecting your syllabus</p>
          <div className="space-y-3">
            {[
              { text: 'MCA: Companies (Amendment) Act 2023 key changes', date: 'Dec 2023', type: 'new' },
              { text: 'SEBI LODR: Enhanced disclosure requirements for listed entities', date: 'Nov 2023', type: 'update' },
              { text: 'IBC: Pre-packaged insolvency for MSMEs expanded', date: 'Oct 2023', type: 'update' },
              { text: 'CSR Amendment: Impact assessment now mandatory', date: 'Sep 2023', type: 'new' },
            ].map(({ text, date, type }, i) => (
              <div key={i} className="flex items-start gap-3 pb-3 border-b border-dark-border last:border-0 last:pb-0">
                <span className={`badge mt-0.5 ${type === 'new' ? 'badge-green' : 'badge-blue'}`}>{type}</span>
                <div className="flex-1">
                  <p className="text-sm text-dark-text">{text}</p>
                  <p className="text-xs text-dark-muted mt-0.5">{date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
