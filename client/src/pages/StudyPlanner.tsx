import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Calendar, Plus, Check, Trash2, Clock, Target, ChevronLeft, ChevronRight } from 'lucide-react';
import { api } from '../utils/api';
import { format, addDays, startOfWeek } from 'date-fns';
import clsx from 'clsx';

const SUBJECTS = ['Company Law', 'Securities Law', 'Economic Laws', 'Secretarial Practice', 'Tax Laws', 'Finance'];
const DURATIONS = [30, 45, 60, 90, 120];

export default function StudyPlanner() {
  const queryClient = useQueryClient();
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [showAdd, setShowAdd] = useState(false);
  const [newPlan, setNewPlan] = useState({ subject: 'Company Law', day: format(new Date(), 'EEEE'), duration: 60, date: format(new Date(), 'yyyy-MM-dd') });

  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const { data: plans = [] } = useQuery({
    queryKey: ['study-plans', weekStart.toISOString()],
    queryFn: () => api.get(`/study-plan?week=${weekStart.toISOString()}`).then(r => r.data),
  });

  const addMutation = useMutation({
    mutationFn: (data: typeof newPlan) => api.post('/study-plan', data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['study-plans'] }); setShowAdd(false); },
  });

  const completeMutation = useMutation({
    mutationFn: (id: string) => api.put(`/study-plan/${id}/complete`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['study-plans'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/study-plan/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['study-plans'] }),
  });

  const totalMinutes = plans.reduce((s: number, p: { duration: number }) => s + p.duration, 0);
  const completedPlans = plans.filter((p: { completed: boolean }) => p.completed).length;

  const subjectColors: Record<string, string> = {
    'Company Law': 'from-blue-600 to-blue-800',
    'Securities Law': 'from-purple-600 to-purple-800',
    'Economic Laws': 'from-emerald-600 to-emerald-800',
    'Secretarial Practice': 'from-orange-600 to-orange-800',
    'Tax Laws': 'from-red-600 to-red-800',
    'Finance': 'from-gold-600 to-yellow-700',
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Study Planner</h2>
          <p className="text-dark-muted text-sm mt-1">Plan and track your weekly study sessions</p>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Add Session
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card text-center">
          <Calendar className="text-primary-400 mx-auto mb-1" size={20} />
          <div className="text-xl font-bold text-white">{plans.length}</div>
          <div className="text-xs text-dark-muted">Sessions this week</div>
        </div>
        <div className="card text-center">
          <Clock className="text-emerald-400 mx-auto mb-1" size={20} />
          <div className="text-xl font-bold text-white">{Math.round(totalMinutes / 60)}h {totalMinutes % 60}m</div>
          <div className="text-xs text-dark-muted">Total planned</div>
        </div>
        <div className="card text-center">
          <Target className="text-gold-400 mx-auto mb-1" size={20} />
          <div className="text-xl font-bold text-white">{completedPlans}/{plans.length}</div>
          <div className="text-xs text-dark-muted">Completed</div>
        </div>
      </div>

      {/* Add Session Form */}
      {showAdd && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="card border-primary-700/40">
          <h3 className="text-white font-semibold mb-4">Add Study Session</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-dark-muted text-xs mb-1">Subject</label>
              <select value={newPlan.subject} onChange={e => setNewPlan(p => ({ ...p, subject: e.target.value }))} className="input">
                {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-dark-muted text-xs mb-1">Date</label>
              <input type="date" value={newPlan.date} onChange={e => setNewPlan(p => ({ ...p, date: e.target.value, day: format(new Date(e.target.value), 'EEEE') }))} className="input" />
            </div>
            <div>
              <label className="block text-dark-muted text-xs mb-1">Duration</label>
              <select value={newPlan.duration} onChange={e => setNewPlan(p => ({ ...p, duration: parseInt(e.target.value) }))} className="input">
                {DURATIONS.map(d => <option key={d} value={d}>{d >= 60 ? `${d / 60}h${d % 60 > 0 ? ` ${d % 60}m` : ''}` : `${d}m`}</option>)}
              </select>
            </div>
            <div className="flex items-end gap-2">
              <button onClick={() => addMutation.mutate(newPlan)} disabled={addMutation.isPending} className="btn-primary flex-1">Add</button>
              <button onClick={() => setShowAdd(false)} className="btn-secondary px-3">Cancel</button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Week Navigation */}
      <div className="flex items-center justify-between">
        <button onClick={() => setWeekStart(d => addDays(d, -7))} className="btn-secondary flex items-center gap-1 text-sm">
          <ChevronLeft size={16} /> Prev Week
        </button>
        <span className="text-dark-text text-sm font-medium">
          {format(weekStart, 'MMM d')} – {format(addDays(weekStart, 6), 'MMM d, yyyy')}
        </span>
        <button onClick={() => setWeekStart(d => addDays(d, 7))} className="btn-secondary flex items-center gap-1 text-sm">
          Next Week <ChevronRight size={16} />
        </button>
      </div>

      {/* Week Grid */}
      <div className="grid grid-cols-7 gap-2">
        {days.map(day => {
          const dayPlans = plans.filter((p: { date: string }) => format(new Date(p.date), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd'));
          const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
          return (
            <div key={day.toISOString()} className={clsx('rounded-xl p-2 min-h-[100px]', isToday ? 'bg-primary-900/20 border border-primary-700/40' : 'bg-dark-card border border-dark-border')}>
              <div className={clsx('text-center mb-2', isToday ? 'text-primary-400 font-bold' : 'text-dark-muted')}>
                <div className="text-xs uppercase">{format(day, 'EEE')}</div>
                <div className={clsx('text-sm font-semibold mt-0.5', isToday ? 'text-primary-300' : 'text-dark-text')}>{format(day, 'd')}</div>
              </div>
              <div className="space-y-1">
                {dayPlans.map((plan: { id: string; subject: string; duration: number; completed: boolean }) => (
                  <div
                    key={plan.id}
                    className={clsx('rounded p-1 text-center relative group', plan.completed ? 'opacity-60' : '')}
                  >
                    <div className={clsx('absolute inset-0 rounded bg-gradient-to-br opacity-20', subjectColors[plan.subject] || 'from-primary-600 to-primary-800')} />
                    <p className="text-xs text-dark-text relative leading-tight line-clamp-1">{plan.subject.split(' ')[0]}</p>
                    <p className="text-xs text-dark-muted relative">{plan.duration}m</p>
                    <div className="absolute -top-1 -right-1 hidden group-hover:flex gap-0.5">
                      {!plan.completed && (
                        <button onClick={() => completeMutation.mutate(plan.id)} className="w-4 h-4 bg-emerald-600 rounded-full flex items-center justify-center">
                          <Check size={10} className="text-white" />
                        </button>
                      )}
                      <button onClick={() => deleteMutation.mutate(plan.id)} className="w-4 h-4 bg-red-600 rounded-full flex items-center justify-center">
                        <Trash2 size={10} className="text-white" />
                      </button>
                    </div>
                    {plan.completed && <div className="absolute inset-0 flex items-center justify-center"><Check size={12} className="text-emerald-400" /></div>}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Sessions List */}
      {plans.length > 0 && (
        <div className="card">
          <h3 className="section-title mb-4">This Week's Sessions</h3>
          <div className="space-y-2">
            {plans.map((plan: { id: string; subject: string; date: string; duration: number; completed: boolean }) => (
              <div key={plan.id} className={clsx('flex items-center gap-4 p-3 rounded-lg transition-colors', plan.completed ? 'opacity-60 bg-dark-bg/30' : 'hover:bg-dark-bg/50')}>
                <div className={clsx('w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-gradient-to-br', subjectColors[plan.subject] || 'from-primary-600 to-primary-800')}>
                  <span className="text-white text-xs font-bold">{plan.subject.split(' ').map((w: string) => w[0]).join('').slice(0, 2)}</span>
                </div>
                <div className="flex-1">
                  <p className="text-dark-text text-sm font-medium">{plan.subject}</p>
                  <p className="text-dark-muted text-xs">{format(new Date(plan.date), 'EEEE, MMM d')} · {plan.duration} minutes</p>
                </div>
                <div className="flex items-center gap-2">
                  {plan.completed ? (
                    <span className="badge badge-green flex items-center gap-1"><Check size={10} /> Done</span>
                  ) : (
                    <button onClick={() => completeMutation.mutate(plan.id)} className="btn-secondary text-xs py-1.5 flex items-center gap-1">
                      <Check size={12} /> Done
                    </button>
                  )}
                  <button onClick={() => deleteMutation.mutate(plan.id)} className="text-dark-muted hover:text-red-400 transition-colors p-1.5">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Study Tips */}
      <div className="card bg-gradient-to-br from-dark-card to-emerald-950/20">
        <h3 className="section-title mb-3">Study Schedule Recommendations</h3>
        <div className="grid sm:grid-cols-2 gap-3 text-sm text-dark-muted">
          {[
            { tip: 'Study 4-5 hours daily for 3 months before exams', icon: '⏰' },
            { tip: 'Dedicate weekends for mock tests and revision', icon: '📝' },
            { tip: 'Company Law needs 40% of your study time', icon: '⚖️' },
            { tip: 'Review amendments weekly in last month', icon: '🔄' },
          ].map(({ tip, icon }) => (
            <div key={tip} className="flex items-start gap-2">
              <span className="text-lg flex-shrink-0">{icon}</span>
              <span>{tip}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
