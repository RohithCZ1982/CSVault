import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ChevronLeft, ChevronRight, CheckCircle, XCircle, Loader2, Flag, Home } from 'lucide-react';
import { api } from '../utils/api';
import { useAuthStore } from '../store/authStore';
import clsx from 'clsx';

interface Question {
  id: string;
  question: string;
  options: string;
  answer: string;
  explanation: string;
  type: string;
  subject: string;
}

interface TestResult {
  score: number;
  correctQ: number;
  totalQ: number;
  timeTaken: number;
  items: { questionId: string; isCorrect: boolean; userAnswer: string; question: Question }[];
}

export default function MockTest() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { subject, level, count = 10 } = (location.state || {}) as { subject?: string; level?: string; count?: number };

  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<TestResult | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [showReview, setShowReview] = useState(false);

  const { data: questions = [], isLoading } = useQuery<Question[]>({
    queryKey: ['test-questions', subject, level, count],
    queryFn: () => {
      const params = new URLSearchParams({ count: String(count) });
      if (subject) params.set('subject', subject);
      if (level || user?.level) params.set('level', level || user?.level || '');
      return api.get(`/questions/random?${params}`).then(r => r.data);
    },
  });

  useEffect(() => {
    if (submitted) return;
    const timer = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(timer);
  }, [submitted]);

  const submitMutation = useMutation({
    mutationFn: (data: { answers: { questionId: string; userAnswer: string }[]; timeTaken: number }) =>
      api.post('/tests/submit', {
        subject: subject || 'Mixed',
        level: level || user?.level || 'EXECUTIVE',
        answers: data.answers,
        timeTaken: data.timeTaken,
      }),
    onSuccess: (res) => {
      setResult(res.data);
      setSubmitted(true);
    },
  });

  const handleSubmit = useCallback(() => {
    const answerList = questions.map(q => ({ questionId: q.id, userAnswer: answers[q.id] || '' }));
    submitMutation.mutate({ answers: answerList, timeTaken: elapsed });
  }, [questions, answers, elapsed, submitMutation]);

  const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <Loader2 className="animate-spin text-primary-400" size={36} />
        <p className="text-dark-muted">Preparing your questions...</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="card text-center py-12">
        <p className="text-dark-text font-medium">No questions available for this selection</p>
        <button onClick={() => navigate('/practice')} className="btn-primary mt-4">Back to Practice Hub</button>
      </div>
    );
  }

  if (submitted && result) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="card text-center"
        >
          <div className={clsx(
            'w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4',
            result.score >= 60 ? 'bg-emerald-900/30 text-emerald-400 border-2 border-emerald-600' : 'bg-red-900/30 text-red-400 border-2 border-red-600'
          )}>
            {Math.round(result.score)}%
          </div>
          <h2 className="text-2xl font-bold text-white mb-1">
            {result.score >= 80 ? '🎉 Excellent!' : result.score >= 60 ? '✅ Good Pass!' : '❌ Need More Practice'}
          </h2>
          <p className="text-dark-muted">{result.correctQ} correct out of {result.totalQ} questions</p>
          <p className="text-dark-muted text-sm">Time taken: {formatTime(result.timeTaken)}</p>

          <div className="grid grid-cols-3 gap-3 mt-6">
            <div className="bg-emerald-900/20 rounded-lg p-3">
              <div className="text-emerald-400 text-xl font-bold">{result.correctQ}</div>
              <div className="text-xs text-dark-muted">Correct</div>
            </div>
            <div className="bg-red-900/20 rounded-lg p-3">
              <div className="text-red-400 text-xl font-bold">{result.totalQ - result.correctQ}</div>
              <div className="text-xs text-dark-muted">Wrong</div>
            </div>
            <div className="bg-primary-900/20 rounded-lg p-3">
              <div className="text-primary-400 text-xl font-bold">{formatTime(result.timeTaken)}</div>
              <div className="text-xs text-dark-muted">Time</div>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button onClick={() => setShowReview(!showReview)} className="btn-secondary flex-1">
              {showReview ? 'Hide Review' : 'Review Answers'}
            </button>
            <button onClick={() => navigate('/practice')} className="btn-primary flex-1 flex items-center justify-center gap-2">
              <Home size={16} /> Back to Hub
            </button>
          </div>
        </motion.div>

        {showReview && (
          <div className="space-y-4">
            {result.items?.map((item, i) => {
              const q = questions.find(q => q.id === item.questionId);
              if (!q) return null;
              const opts = JSON.parse(q.options || '[]') as string[];
              return (
                <div key={item.questionId} className={clsx('card border-l-4', item.isCorrect ? 'border-l-emerald-500' : 'border-l-red-500')}>
                  <div className="flex items-start gap-2 mb-3">
                    {item.isCorrect ? <CheckCircle size={16} className="text-emerald-400 flex-shrink-0 mt-0.5" /> : <XCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />}
                    <p className="text-dark-text text-sm font-medium">Q{i + 1}. {q.question}</p>
                  </div>
                  <div className="space-y-1.5 ml-5">
                    {opts.map(opt => (
                      <div key={opt} className={clsx(
                        'px-3 py-1.5 rounded text-xs',
                        opt === q.answer ? 'bg-emerald-900/30 text-emerald-300 border border-emerald-700/40' :
                          opt === item.userAnswer && !item.isCorrect ? 'bg-red-900/30 text-red-300 border border-red-700/40' :
                            'text-dark-muted'
                      )}>
                        {opt === q.answer && '✓ '}{opt === item.userAnswer && opt !== q.answer && '✗ '}{opt}
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 ml-5 p-3 bg-dark-bg/50 rounded-lg">
                    <p className="text-xs text-dark-muted"><span className="text-primary-400 font-medium">Explanation:</span> {q.explanation}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  const currentQ = questions[currentIdx];
  const opts = JSON.parse(currentQ?.options || '[]') as string[];
  const answered = Object.keys(answers).length;

  return (
    <div className="max-w-2xl mx-auto space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button onClick={() => navigate('/practice')} className="text-dark-muted hover:text-dark-text transition-colors">
          <ChevronLeft size={20} />
        </button>
        <div className="flex items-center gap-2 text-dark-muted text-sm">
          <Clock size={16} className={elapsed > 600 ? 'text-red-400' : 'text-emerald-400'} />
          <span className={elapsed > 600 ? 'text-red-400 font-mono' : 'text-emerald-400 font-mono'}>{formatTime(elapsed)}</span>
        </div>
        <span className="text-dark-muted text-sm">{answered}/{questions.length} answered</span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-dark-border rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-primary-500 rounded-full"
          animate={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIdx}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="card"
        >
          <div className="flex items-start gap-3 mb-5">
            <span className="badge badge-blue flex-shrink-0">Q {currentIdx + 1}/{questions.length}</span>
            <p className="text-dark-text font-medium leading-relaxed">{currentQ.question}</p>
          </div>

          <div className="space-y-2.5">
            {opts.map((opt) => (
              <button
                key={opt}
                onClick={() => setAnswers(prev => ({ ...prev, [currentQ.id]: opt }))}
                className={clsx(
                  'w-full text-left px-4 py-3 rounded-lg border text-sm transition-all duration-150',
                  answers[currentQ.id] === opt
                    ? 'bg-primary-600/20 border-primary-500 text-primary-300'
                    : 'border-dark-border text-dark-text hover:bg-dark-border/40 hover:border-primary-700/30'
                )}
              >
                {opt}
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentIdx(i => Math.max(0, i - 1))}
          disabled={currentIdx === 0}
          className="btn-secondary flex items-center gap-1 disabled:opacity-40"
        >
          <ChevronLeft size={16} /> Prev
        </button>

        <div className="flex gap-1">
          {questions.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIdx(i)}
              className={clsx(
                'w-6 h-6 rounded text-xs font-medium transition-colors',
                i === currentIdx ? 'bg-primary-600 text-white' :
                  answers[questions[i].id] ? 'bg-emerald-700/40 text-emerald-300' : 'bg-dark-border text-dark-muted hover:bg-dark-border/70'
              )}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {currentIdx < questions.length - 1 ? (
          <button onClick={() => setCurrentIdx(i => i + 1)} className="btn-primary flex items-center gap-1">
            Next <ChevronRight size={16} />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={submitMutation.isPending}
            className="btn-primary flex items-center gap-2"
          >
            {submitMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <Flag size={16} />}
            Submit
          </button>
        )}
      </div>
    </div>
  );
}
