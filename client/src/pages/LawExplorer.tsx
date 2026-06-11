import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, BookOpen, ArrowRight, AlertCircle } from 'lucide-react';
import { api } from '../utils/api';
import { useAuthStore } from '../store/authStore';
import clsx from 'clsx';

const SUBJECTS = ['All', 'Company Law', 'Securities Law', 'Economic Laws', 'Secretarial Practice', 'Tax Laws'];
const LEVELS = ['All', 'FOUNDATION', 'EXECUTIVE', 'PROFESSIONAL'];

interface Topic {
  id: string;
  title: string;
  description: string;
  level: string;
  subject: string;
  section: string | null;
  act: string | null;
  keywords: string;
  amendment: string | null;
}

export default function LawExplorer() {
  const [search, setSearch] = useState('');
  const [subject, setSubject] = useState('All');
  const [level, setLevel] = useState('All');
  const { user } = useAuthStore();

  const { data: topics = [], isLoading } = useQuery<Topic[]>({
    queryKey: ['topics', search, subject, level],
    queryFn: () => {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (subject !== 'All') params.set('subject', subject);
      if (level !== 'All') params.set('level', level);
      return api.get(`/topics?${params}`).then(r => r.data);
    },
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-white">Law & Concept Explorer</h2>
        <p className="text-dark-muted text-sm mt-1">Search any section, rule, or provision for plain-English explanations with examples</p>
      </div>

      {/* Search & Filters */}
      <div className="card space-y-4">
        <div className="relative">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-muted" />
          <input
            type="text"
            placeholder="Search section, topic, keyword... (e.g. 'Section 185', 'AGM', 'CSR')"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input pl-10"
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-dark-muted" />
            <span className="text-dark-muted text-sm">Level:</span>
          </div>
          {LEVELS.map(l => (
            <button
              key={l}
              onClick={() => setLevel(l)}
              className={clsx('px-3 py-1 rounded-full text-xs font-medium transition-colors', level === l ? 'bg-primary-600 text-white' : 'bg-dark-border text-dark-muted hover:text-dark-text')}
            >
              {l}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-3">
          <span className="text-dark-muted text-sm flex items-center">Subject:</span>
          {SUBJECTS.map(s => (
            <button
              key={s}
              onClick={() => setSubject(s)}
              className={clsx('px-3 py-1 rounded-full text-xs font-medium transition-colors', subject === s ? 'bg-primary-600 text-white' : 'bg-dark-border text-dark-muted hover:text-dark-text')}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Default level suggestion */}
      {level === 'All' && (
        <div className="flex items-center gap-2 text-sm text-primary-300 bg-primary-900/20 border border-primary-800/30 rounded-lg px-4 py-2.5">
          <AlertCircle size={15} />
          <span>Showing all levels. <button onClick={() => setLevel(user?.level || 'EXECUTIVE')} className="underline">Filter to your {user?.level} level</button></span>
        </div>
      )}

      {/* Results */}
      {isLoading ? (
        <div className="grid md:grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-4 bg-dark-border rounded w-3/4 mb-2" />
              <div className="h-3 bg-dark-border rounded w-1/2 mb-3" />
              <div className="h-3 bg-dark-border rounded w-full" />
            </div>
          ))}
        </div>
      ) : topics.length === 0 ? (
        <div className="card text-center py-12">
          <BookOpen size={40} className="text-dark-muted mx-auto mb-3" />
          <p className="text-dark-text font-medium">No topics found</p>
          <p className="text-dark-muted text-sm">Try adjusting your search or filters</p>
        </div>
      ) : (
        <>
          <p className="text-dark-muted text-sm">{topics.length} topics found</p>
          <div className="grid md:grid-cols-2 gap-4">
            {topics.map((topic, i) => (
              <motion.div
                key={topic.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  to={`/law-explorer/${topic.id}`}
                  className="card hover:border-primary-700/50 hover:-translate-y-0.5 transition-all duration-200 group flex flex-col gap-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-semibold text-sm group-hover:text-primary-300 transition-colors line-clamp-2">
                        {topic.title}
                      </h3>
                      {topic.section && (
                        <p className="text-dark-muted text-xs mt-0.5">{topic.act} · {topic.section}</p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                      <span className={clsx('badge', topic.level === 'FOUNDATION' ? 'badge-green' : topic.level === 'EXECUTIVE' ? 'badge-blue' : 'badge-gold')}>
                        {topic.level}
                      </span>
                    </div>
                  </div>
                  <p className="text-dark-muted text-xs line-clamp-2">{topic.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="badge badge-blue">{topic.subject}</span>
                    <div className="flex items-center gap-2">
                      {topic.amendment && (
                        <span className="text-xs text-gold-400 flex items-center gap-1">
                          <AlertCircle size={12} /> Amended
                        </span>
                      )}
                      <span className="text-primary-400 group-hover:text-primary-300 flex items-center gap-1 text-xs transition-colors">
                        Read more <ArrowRight size={12} />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
