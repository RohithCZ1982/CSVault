import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Bookmark, BookmarkCheck, AlertCircle, CheckCircle,
  FileText, Lightbulb, BookOpen, Loader2,
} from 'lucide-react';
import { api } from '../utils/api';
import clsx from 'clsx';

interface Topic {
  id: string;
  title: string;
  description: string;
  level: string;
  subject: string;
  section: string | null;
  act: string | null;
  content: string;
  plainEnglish: string;
  keywords: string;
  amendment: string | null;
  userProgress: string;
}

export default function TopicDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'plain' | 'detailed' | 'keywords'>('plain');
  const [bookmarked, setBookmarked] = useState(false);

  const { data: topic, isLoading } = useQuery<Topic>({
    queryKey: ['topic', id],
    queryFn: () => api.get(`/topics/${id}`).then(r => r.data),
    enabled: !!id,
  });

  const progressMutation = useMutation({
    mutationFn: (status: string) => api.post(`/progress/${id}`, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['progress-summary'] }),
  });

  const bookmarkMutation = useMutation({
    mutationFn: () => api.post(`/topics/${id}/bookmark`),
    onSuccess: (res) => setBookmarked(res.data.bookmarked),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-primary-400" size={32} />
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="card text-center py-12">
        <p className="text-dark-text">Topic not found</p>
        <Link to="/law-explorer" className="btn-primary mt-4 inline-block">Back to Explorer</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-dark-muted hover:text-dark-text transition-colors text-sm"
      >
        <ArrowLeft size={16} /> Back to Law Explorer
      </button>

      {/* Header */}
      <div className="card">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className={clsx('badge', topic.level === 'FOUNDATION' ? 'badge-green' : topic.level === 'EXECUTIVE' ? 'badge-blue' : 'badge-gold')}>
                {topic.level}
              </span>
              <span className="badge badge-blue">{topic.subject}</span>
              {topic.amendment && <span className="badge badge-gold flex items-center gap-1"><AlertCircle size={10} /> Recently Amended</span>}
            </div>
            <h1 className="text-xl font-bold text-white">{topic.title}</h1>
            {topic.section && <p className="text-dark-muted text-sm mt-1">{topic.act} · {topic.section}</p>}
            <p className="text-dark-muted text-sm mt-2">{topic.description}</p>
          </div>
          <button
            onClick={() => bookmarkMutation.mutate()}
            className={clsx('flex-shrink-0 p-2 rounded-lg transition-colors', bookmarked ? 'text-gold-400 bg-gold-900/20' : 'text-dark-muted hover:text-dark-text')}
          >
            {bookmarked ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
          </button>
        </div>

        {/* Progress buttons */}
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-dark-border">
          <span className="text-dark-muted text-sm">Mark as:</span>
          {(['IN_PROGRESS', 'COMPLETED'] as const).map(status => (
            <button
              key={status}
              onClick={() => progressMutation.mutate(status)}
              disabled={progressMutation.isPending}
              className={clsx(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                topic.userProgress === status
                  ? status === 'COMPLETED' ? 'bg-emerald-600 text-white' : 'bg-primary-600 text-white'
                  : 'bg-dark-border text-dark-muted hover:text-dark-text'
              )}
            >
              {status === 'IN_PROGRESS' ? '📖 In Progress' : '✅ Completed'}
            </button>
          ))}
          {progressMutation.isPending && <Loader2 size={14} className="animate-spin text-primary-400" />}
        </div>
      </div>

      {/* Content Tabs */}
      <div className="card">
        <div className="flex gap-2 mb-6 border-b border-dark-border pb-4">
          {[
            { key: 'plain', label: 'Plain English', icon: Lightbulb },
            { key: 'detailed', label: 'Detailed Content', icon: BookOpen },
            { key: 'keywords', label: 'Key Points', icon: FileText },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as 'plain' | 'detailed' | 'keywords')}
              className={clsx(
                'flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                activeTab === key ? 'bg-primary-600 text-white' : 'text-dark-muted hover:text-dark-text'
              )}
            >
              <Icon size={15} /> {label}
            </button>
          ))}
        </div>

        {activeTab === 'plain' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="flex items-center gap-2 text-emerald-400 mb-3">
              <Lightbulb size={18} />
              <span className="font-semibold">Plain English Explanation</span>
            </div>
            <p className="text-dark-text leading-relaxed">{topic.plainEnglish}</p>
            {topic.amendment && (
              <div className="bg-gold-900/20 border border-gold-600/30 rounded-lg p-4 mt-4">
                <div className="flex items-center gap-2 text-gold-400 mb-2">
                  <AlertCircle size={16} />
                  <span className="font-semibold text-sm">Recent Amendment</span>
                </div>
                <p className="text-dark-text text-sm leading-relaxed">{topic.amendment}</p>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'detailed' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex items-center gap-2 text-primary-400 mb-4">
              <BookOpen size={18} />
              <span className="font-semibold">Detailed Content</span>
            </div>
            <div className="prose prose-invert max-w-none">
              <pre className="whitespace-pre-wrap text-dark-text text-sm leading-relaxed font-sans bg-dark-bg/50 rounded-lg p-4 border border-dark-border overflow-auto">
                {topic.content}
              </pre>
            </div>
          </motion.div>
        )}

        {activeTab === 'keywords' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex items-center gap-2 text-primary-400 mb-4">
              <FileText size={18} />
              <span className="font-semibold">Keywords & Key Concepts</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {topic.keywords.split(',').map(kw => (
                <span key={kw} className="badge badge-blue text-sm py-1 px-3">{kw.trim()}</span>
              ))}
            </div>
            <div className="mt-6 bg-primary-900/20 border border-primary-800/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle size={16} className="text-emerald-400" />
                <span className="text-white font-medium text-sm">Exam Tips</span>
              </div>
              <ul className="space-y-2 text-sm text-dark-muted">
                <li className="flex items-start gap-2">
                  <span className="text-primary-400 mt-0.5">•</span>
                  Remember the exact section number: <strong className="text-dark-text">{topic.section}</strong>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-400 mt-0.5">•</span>
                  This topic appears frequently in <strong className="text-dark-text">{topic.level}</strong> level exams
                </li>
                {topic.amendment && (
                  <li className="flex items-start gap-2">
                    <span className="text-gold-400 mt-0.5">⚡</span>
                    Recent amendment — check the "Plain English" tab for the latest changes
                  </li>
                )}
              </ul>
            </div>
          </motion.div>
        )}
      </div>

      {/* Related Navigation */}
      <div className="flex gap-3">
        <Link to="/practice" className="btn-secondary flex-1 text-center">
          Practice Questions on This Topic
        </Link>
        <Link to="/ai-assistant" className="btn-primary flex-1 text-center">
          Ask AI About This
        </Link>
      </div>
    </div>
  );
}
