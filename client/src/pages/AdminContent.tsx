import { useRef, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { BookOpen, Brain, FileText, Plus, Pencil, Trash2, X, Search, Database, Upload, Download, FileSpreadsheet, CheckCircle2 } from 'lucide-react';
import * as XLSX from 'xlsx';
import { api } from '../utils/api';
import clsx from 'clsx';

type Tab = 'topics' | 'questions' | 'documents';

const LEVELS = ['FOUNDATION', 'EXECUTIVE', 'PROFESSIONAL'];
const DIFFICULTIES = ['EASY', 'MEDIUM', 'HARD'];
const SUBJECTS = ['Company Law', 'Securities Law', 'Economic Laws', 'Secretarial Practice', 'Tax Laws', 'Finance'];
const DOC_CATEGORIES = ['RESOLUTION', 'NOTICE', 'MINUTES', 'CHECKLIST', 'AUDIT_REPORT', 'OTHER'];

interface AdminTopic {
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
  _count: { questions: number; progress: number; bookmarks: number };
}

interface AdminQuestion {
  id: string;
  topicId: string;
  type: string;
  level: string;
  subject: string;
  difficulty: string;
  question: string;
  options: string;
  answer: string;
  explanation: string;
  year: number | null;
  topic: { id: string; title: string };
  _count: { testResultItems: number };
}

interface AdminDocument {
  id: string;
  title: string;
  category: string;
  description: string;
  template: string;
  tags: string;
}

function errMessage(err: unknown): string {
  const e = err as { response?: { data?: { error?: unknown } } };
  const apiErr = e?.response?.data?.error;
  if (typeof apiErr === 'string') return apiErr;
  if (Array.isArray(apiErr)) return apiErr.map((x: { message?: string }) => x.message).join('; ');
  return 'Something went wrong';
}

const inputCls = 'input text-sm';
const labelCls = 'block text-xs font-medium text-dark-muted mb-1 mt-3';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      {children}
    </div>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 overflow-y-auto p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card w-full max-w-2xl my-8"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="section-title">{title}</h3>
          <button onClick={onClose} className="text-dark-muted hover:text-dark-text"><X size={18} /></button>
        </div>
        {children}
      </motion.div>
    </div>
  );
}

// ── Topic form ─────────────────────────────────────────────────

const emptyTopic = {
  title: '', description: '', level: 'FOUNDATION', subject: SUBJECTS[0],
  section: '', act: '', content: '', plainEnglish: '', keywords: '', amendment: '',
};

function TopicForm({ initial, onDone }: { initial: AdminTopic | null; onDone: () => void }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState(() => initial ? {
    title: initial.title, description: initial.description, level: initial.level,
    subject: initial.subject, section: initial.section || '', act: initial.act || '',
    content: initial.content, plainEnglish: initial.plainEnglish,
    keywords: initial.keywords, amendment: initial.amendment || '',
  } : emptyTopic);
  const [error, setError] = useState('');

  const mutation = useMutation({
    mutationFn: () => {
      const payload = { ...form, section: form.section || null, act: form.act || null, amendment: form.amendment || null };
      return initial
        ? api.put(`/admin/content/topics/${initial.id}`, payload)
        : api.post('/admin/content/topics', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-content-topics'] });
      onDone();
    },
    onError: err => setError(errMessage(err)),
  });

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div>
      <Field label="Title"><input className={inputCls} value={form.title} onChange={e => set('title', e.target.value)} /></Field>
      <Field label="Description"><input className={inputCls} value={form.description} onChange={e => set('description', e.target.value)} /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Level">
          <select className={inputCls} value={form.level} onChange={e => set('level', e.target.value)}>
            {LEVELS.map(l => <option key={l}>{l}</option>)}
          </select>
        </Field>
        <Field label="Subject">
          <select className={inputCls} value={form.subject} onChange={e => set('subject', e.target.value)}>
            {SUBJECTS.map(s => <option key={s}>{s}</option>)}
          </select>
        </Field>
        <Field label="Section (optional)"><input className={inputCls} value={form.section} onChange={e => set('section', e.target.value)} placeholder="e.g. Section 96" /></Field>
        <Field label="Act (optional)"><input className={inputCls} value={form.act} onChange={e => set('act', e.target.value)} placeholder="e.g. Companies Act 2013" /></Field>
      </div>
      <Field label="Detailed content"><textarea className={clsx(inputCls, 'h-40 font-mono')} value={form.content} onChange={e => set('content', e.target.value)} /></Field>
      <Field label="Plain English explanation"><textarea className={clsx(inputCls, 'h-28')} value={form.plainEnglish} onChange={e => set('plainEnglish', e.target.value)} /></Field>
      <Field label="Keywords (comma separated)"><input className={inputCls} value={form.keywords} onChange={e => set('keywords', e.target.value)} /></Field>
      <Field label="Amendment notes (optional)"><textarea className={clsx(inputCls, 'h-20')} value={form.amendment} onChange={e => set('amendment', e.target.value)} /></Field>
      {error && <div className="bg-red-900/30 border border-red-800 text-red-400 text-sm rounded-lg px-3 py-2 mt-3">{error}</div>}
      <div className="flex gap-2 mt-4">
        <button className="btn-primary" disabled={mutation.isPending} onClick={() => mutation.mutate()}>
          {mutation.isPending ? 'Saving…' : initial ? 'Save Changes' : 'Create Topic'}
        </button>
        <button className="btn-secondary" onClick={onDone}>Cancel</button>
      </div>
    </div>
  );
}

// ── Question form ──────────────────────────────────────────────

function QuestionForm({ initial, topics, onDone }: { initial: AdminQuestion | null; topics: AdminTopic[]; onDone: () => void }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState(() => initial ? {
    topicId: initial.topicId, level: initial.level, subject: initial.subject,
    difficulty: initial.difficulty, question: initial.question,
    options: JSON.parse(initial.options) as string[],
    answer: initial.answer, explanation: initial.explanation,
    year: initial.year?.toString() || '',
  } : {
    topicId: topics[0]?.id || '', level: 'FOUNDATION', subject: SUBJECTS[0],
    difficulty: 'MEDIUM', question: '', options: ['', '', '', ''], answer: '', explanation: '', year: '',
  });
  const [error, setError] = useState('');

  const mutation = useMutation({
    mutationFn: () => {
      const payload = {
        topicId: form.topicId, type: 'MCQ', level: form.level, subject: form.subject,
        difficulty: form.difficulty, question: form.question,
        options: form.options.filter(o => o.trim() !== ''),
        answer: form.answer, explanation: form.explanation,
        year: form.year ? parseInt(form.year) : null,
      };
      return initial
        ? api.put(`/admin/content/questions/${initial.id}`, payload)
        : api.post('/admin/content/questions', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-content-questions'] });
      onDone();
    },
    onError: err => setError(errMessage(err)),
  });

  const setOption = (i: number, v: string) => {
    setForm(f => {
      const options = [...f.options];
      const wasAnswer = f.answer === options[i];
      options[i] = v;
      return { ...f, options, answer: wasAnswer ? v : f.answer };
    });
  };

  const filledOptions = form.options.filter(o => o.trim() !== '');

  return (
    <div>
      <Field label="Question"><textarea className={clsx(inputCls, 'h-24')} value={form.question} onChange={e => setForm(f => ({ ...f, question: e.target.value }))} /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Topic">
          <select className={inputCls} value={form.topicId} onChange={e => setForm(f => ({ ...f, topicId: e.target.value }))}>
            {topics.map(t => <option key={t.id} value={t.id}>{t.title.slice(0, 60)}</option>)}
          </select>
        </Field>
        <Field label="Subject">
          <select className={inputCls} value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}>
            {SUBJECTS.map(s => <option key={s}>{s}</option>)}
          </select>
        </Field>
        <Field label="Level">
          <select className={inputCls} value={form.level} onChange={e => setForm(f => ({ ...f, level: e.target.value }))}>
            {LEVELS.map(l => <option key={l}>{l}</option>)}
          </select>
        </Field>
        <Field label="Difficulty">
          <select className={inputCls} value={form.difficulty} onChange={e => setForm(f => ({ ...f, difficulty: e.target.value }))}>
            {DIFFICULTIES.map(d => <option key={d}>{d}</option>)}
          </select>
        </Field>
      </div>
      <label className={labelCls}>Options</label>
      <div className="space-y-2">
        {form.options.map((opt, i) => (
          <input key={i} className={inputCls} value={opt} placeholder={`Option ${i + 1}`} onChange={e => setOption(i, e.target.value)} />
        ))}
      </div>
      <Field label="Correct answer">
        <select className={inputCls} value={form.answer} onChange={e => setForm(f => ({ ...f, answer: e.target.value }))}>
          <option value="">— select the correct option —</option>
          {filledOptions.map((o, i) => <option key={i} value={o}>{o}</option>)}
        </select>
      </Field>
      <Field label="Explanation"><textarea className={clsx(inputCls, 'h-24')} value={form.explanation} onChange={e => setForm(f => ({ ...f, explanation: e.target.value }))} /></Field>
      <Field label="Exam year (optional)"><input className={inputCls} type="number" value={form.year} onChange={e => setForm(f => ({ ...f, year: e.target.value }))} placeholder="e.g. 2023" /></Field>
      {error && <div className="bg-red-900/30 border border-red-800 text-red-400 text-sm rounded-lg px-3 py-2 mt-3">{error}</div>}
      <div className="flex gap-2 mt-4">
        <button className="btn-primary" disabled={mutation.isPending} onClick={() => mutation.mutate()}>
          {mutation.isPending ? 'Saving…' : initial ? 'Save Changes' : 'Create Question'}
        </button>
        <button className="btn-secondary" onClick={onDone}>Cancel</button>
      </div>
    </div>
  );
}

// ── Document form ──────────────────────────────────────────────

function DocumentForm({ initial, onDone }: { initial: AdminDocument | null; onDone: () => void }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState(() => initial ? {
    title: initial.title, category: initial.category, description: initial.description,
    template: initial.template, tags: initial.tags,
  } : { title: '', category: DOC_CATEGORIES[0], description: '', template: '', tags: '' });
  const [error, setError] = useState('');

  const mutation = useMutation({
    mutationFn: () => initial
      ? api.put(`/admin/content/documents/${initial.id}`, form)
      : api.post('/admin/content/documents', form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-content-documents'] });
      onDone();
    },
    onError: err => setError(errMessage(err)),
  });

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div>
      <Field label="Title"><input className={inputCls} value={form.title} onChange={e => set('title', e.target.value)} /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Category">
          <select className={inputCls} value={form.category} onChange={e => set('category', e.target.value)}>
            {DOC_CATEGORIES.map(c => <option key={c}>{c}</option>)}
            {!DOC_CATEGORIES.includes(form.category) && <option>{form.category}</option>}
          </select>
        </Field>
        <Field label="Tags (comma separated)"><input className={inputCls} value={form.tags} onChange={e => set('tags', e.target.value)} /></Field>
      </div>
      <Field label="Description"><input className={inputCls} value={form.description} onChange={e => set('description', e.target.value)} /></Field>
      <Field label="Template body">
        <textarea className={clsx(inputCls, 'h-72 font-mono text-xs')} value={form.template} onChange={e => set('template', e.target.value)} placeholder="Use [PLACEHOLDERS] like [COMPANY NAME], [DATE]…" />
      </Field>
      {error && <div className="bg-red-900/30 border border-red-800 text-red-400 text-sm rounded-lg px-3 py-2 mt-3">{error}</div>}
      <div className="flex gap-2 mt-4">
        <button className="btn-primary" disabled={mutation.isPending} onClick={() => mutation.mutate()}>
          {mutation.isPending ? 'Saving…' : initial ? 'Save Changes' : 'Create Template'}
        </button>
        <button className="btn-secondary" onClick={onDone}>Cancel</button>
      </div>
    </div>
  );
}

// ── Bulk Excel import ──────────────────────────────────────────

const cell = (row: Record<string, unknown>, key: string) => String(row[key] ?? '').trim();

interface ImportSpec {
  noun: string;
  instructions: string[];
  sample: Record<string, string | number>[];
  mapRow: (row: Record<string, unknown>) => Record<string, unknown>;
}

const IMPORT_SPECS: Record<Tab, ImportSpec> = {
  topics: {
    noun: 'topics',
    instructions: [
      'Required columns: title, description, level, subject, content, plainEnglish, keywords',
      'Optional columns: section, act, amendment',
      `level must be one of: ${LEVELS.join(', ')}`,
    ],
    sample: [{
      title: 'Section 173 — Meetings of the Board',
      description: 'Frequency and notice requirements for board meetings',
      level: 'EXECUTIVE',
      subject: 'Company Law',
      section: 'Section 173',
      act: 'Companies Act 2013',
      content: 'Every company shall hold its first board meeting within 30 days of incorporation, and thereafter a minimum of 4 meetings every year…',
      plainEnglish: 'Boards must meet at least 4 times a year, with no more than 120 days between two meetings.',
      keywords: 'board meeting, notice, quorum',
      amendment: '',
    }],
    mapRow: r => ({
      title: cell(r, 'title'),
      description: cell(r, 'description'),
      level: cell(r, 'level').toUpperCase(),
      subject: cell(r, 'subject'),
      section: cell(r, 'section') || null,
      act: cell(r, 'act') || null,
      content: cell(r, 'content'),
      plainEnglish: cell(r, 'plainEnglish'),
      keywords: cell(r, 'keywords'),
      amendment: cell(r, 'amendment') || null,
    }),
  },
  questions: {
    noun: 'questions',
    instructions: [
      'Required columns: topicTitle, level, subject, difficulty, question, option1, option2, answer, explanation',
      'Optional columns: option3–option6, year',
      'topicTitle must exactly match the title of an existing topic',
      `level: ${LEVELS.join(' / ')} · difficulty: ${DIFFICULTIES.join(' / ')}`,
      'answer can be the exact option text, a number (1–6), or a letter (A–F)',
    ],
    sample: [{
      topicTitle: 'Section 96 — Annual General Meeting',
      level: 'EXECUTIVE',
      subject: 'Company Law',
      difficulty: 'MEDIUM',
      question: 'What is the maximum gap allowed between two Annual General Meetings?',
      option1: '12 months',
      option2: '15 months',
      option3: '18 months',
      option4: '6 months',
      option5: '',
      option6: '',
      answer: '15 months',
      explanation: 'Section 96 of the Companies Act 2013 allows a maximum of 15 months between two AGMs.',
      year: 2023,
    }],
    mapRow: r => {
      const year = cell(r, 'year');
      return {
        topicTitle: cell(r, 'topicTitle'),
        level: cell(r, 'level').toUpperCase(),
        subject: cell(r, 'subject'),
        difficulty: cell(r, 'difficulty').toUpperCase(),
        question: cell(r, 'question'),
        options: [1, 2, 3, 4, 5, 6].map(i => cell(r, `option${i}`)).filter(Boolean),
        answer: cell(r, 'answer'),
        explanation: cell(r, 'explanation'),
        year: /^\d{4}$/.test(year) ? parseInt(year) : null,
      };
    },
  },
  documents: {
    noun: 'templates',
    instructions: [
      'Required columns: title, category, description, template, tags',
      `Suggested categories: ${DOC_CATEGORIES.join(', ')}`,
      'Use [PLACEHOLDERS] like [COMPANY NAME], [DATE] in the template body',
    ],
    sample: [{
      title: 'Board Resolution — Change of Registered Office',
      category: 'RESOLUTION',
      description: 'Resolution for shifting the registered office within the same city',
      template: 'CERTIFIED TRUE COPY OF THE RESOLUTION PASSED BY THE BOARD OF DIRECTORS OF [COMPANY NAME] AT ITS MEETING HELD ON [DATE]…',
      tags: 'board resolution, registered office',
    }],
    mapRow: r => ({
      title: cell(r, 'title'),
      category: cell(r, 'category').toUpperCase(),
      description: cell(r, 'description'),
      template: cell(r, 'template'),
      tags: cell(r, 'tags'),
    }),
  },
};

function ImportPanel({ kind, onDone }: { kind: Tab; onDone: () => void }) {
  const queryClient = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState('');
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [error, setError] = useState('');
  const [rowErrors, setRowErrors] = useState<{ row: number; message: string }[]>([]);
  const [created, setCreated] = useState<number | null>(null);

  const spec = IMPORT_SPECS[kind];

  const downloadTemplate = () => {
    const ws = XLSX.utils.json_to_sheet(spec.sample);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Data');
    XLSX.writeFile(wb, `csvault-${kind}-template.xlsx`);
  };

  const handleFile = async (file: File) => {
    setError('');
    setRowErrors([]);
    setCreated(null);
    setRows([]);
    setFileName('');
    try {
      const buf = await file.arrayBuffer();
      const wb = XLSX.read(buf);
      const ws = wb.Sheets[wb.SheetNames[0]];
      const raw = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws, { defval: '' });
      const mapped = raw
        .filter(r => Object.values(r).some(v => String(v ?? '').trim() !== ''))
        .map(spec.mapRow);
      if (mapped.length === 0) {
        setError('No data rows found — fill in rows below the header row and try again');
        return;
      }
      setRows(mapped);
      setFileName(file.name);
    } catch {
      setError('Could not read that file — make sure it is a valid .xlsx, .xls, or .csv file');
    }
  };

  const mutation = useMutation({
    mutationFn: () => api.post(`/admin/content/${kind}/bulk`, { rows }).then(r => r.data as { created: number }),
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: [`admin-content-${kind}`] });
      if (kind === 'questions') queryClient.invalidateQueries({ queryKey: ['admin-content-topics'] });
      setCreated(data.created);
      setRows([]);
    },
    onError: (err: unknown) => {
      const e = err as { response?: { data?: { rowErrors?: { row: number; message: string }[] } } };
      setRowErrors(e?.response?.data?.rowErrors || []);
      setError(errMessage(err));
    },
  });

  return (
    <div>
      <ul className="text-xs text-dark-muted space-y-1 list-disc list-inside mb-4">
        {spec.instructions.map((line, i) => <li key={i}>{line}</li>)}
        <li>Row 1 must be the header row — download the template to get the exact column names</li>
      </ul>

      <div className="flex flex-wrap gap-2">
        <button className="btn-secondary flex items-center gap-2 text-sm" onClick={downloadTemplate}>
          <Download size={15} /> Download Template
        </button>
        <button className="btn-secondary flex items-center gap-2 text-sm" onClick={() => fileRef.current?.click()}>
          <FileSpreadsheet size={15} /> Choose Excel File
        </button>
        <input
          ref={fileRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          className="hidden"
          onChange={e => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = '';
          }}
        />
      </div>

      {rows.length > 0 && (
        <div className="flex items-center gap-3 bg-dark-border/30 border border-dark-border rounded-lg px-3 py-2 mt-4 text-sm">
          <FileSpreadsheet size={16} className="text-primary-400 shrink-0" />
          <span className="text-dark-text flex-1 truncate">
            {fileName} — <span className="font-medium">{rows.length}</span> {spec.noun} ready to import
          </span>
        </div>
      )}

      {created !== null && (
        <div className="flex items-center gap-2 bg-green-900/30 border border-green-800 text-green-400 text-sm rounded-lg px-3 py-2 mt-4">
          <CheckCircle2 size={16} className="shrink-0" />
          Imported {created} {spec.noun} successfully
        </div>
      )}

      {error && <div className="bg-red-900/30 border border-red-800 text-red-400 text-sm rounded-lg px-3 py-2 mt-4">{error}</div>}
      {rowErrors.length > 0 && (
        <div className="border border-red-800/50 rounded-lg mt-2 max-h-48 overflow-y-auto">
          {rowErrors.map((e, i) => (
            <div key={i} className="text-xs text-red-400 px-3 py-1.5 border-b border-red-800/30 last:border-b-0">
              <span className="font-semibold">Row {e.row}:</span> {e.message}
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2 mt-4">
        {rows.length > 0 && (
          <button className="btn-primary flex items-center gap-2" disabled={mutation.isPending} onClick={() => mutation.mutate()}>
            <Upload size={15} /> {mutation.isPending ? 'Importing…' : `Import ${rows.length} ${spec.noun}`}
          </button>
        )}
        <button className="btn-secondary" onClick={onDone}>{created !== null ? 'Done' : 'Cancel'}</button>
      </div>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────

export default function AdminContent() {
  const [tab, setTab] = useState<Tab>('topics');
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<{ kind: Tab; item: AdminTopic | AdminQuestion | AdminDocument | null } | null>(null);
  const [importing, setImporting] = useState<Tab | null>(null);
  const queryClient = useQueryClient();

  const { data: topics = [] } = useQuery<AdminTopic[]>({
    queryKey: ['admin-content-topics'],
    queryFn: () => api.get('/admin/content/topics').then(r => r.data),
  });
  const { data: questions = [] } = useQuery<AdminQuestion[]>({
    queryKey: ['admin-content-questions'],
    queryFn: () => api.get('/admin/content/questions').then(r => r.data),
  });
  const { data: documents = [] } = useQuery<AdminDocument[]>({
    queryKey: ['admin-content-documents'],
    queryFn: () => api.get('/admin/content/documents').then(r => r.data),
  });

  const deleteMutation = useMutation({
    mutationFn: ({ kind, id }: { kind: Tab; id: string }) => api.delete(`/admin/content/${kind}/${id}`),
    onSuccess: (_d, vars) => queryClient.invalidateQueries({ queryKey: [`admin-content-${vars.kind}`] }),
    onError: err => alert(errMessage(err)),
  });

  const handleDelete = (kind: Tab, id: string, label: string) => {
    if (confirm(`Delete "${label}"? This cannot be undone.`)) {
      deleteMutation.mutate({ kind, id });
    }
  };

  const q = search.toLowerCase();
  const filteredTopics = topics.filter(t => !q || t.title.toLowerCase().includes(q) || t.subject.toLowerCase().includes(q));
  const filteredQuestions = questions.filter(x => !q || x.question.toLowerCase().includes(q) || x.subject.toLowerCase().includes(q));
  const filteredDocuments = documents.filter(d => !q || d.title.toLowerCase().includes(q) || d.category.toLowerCase().includes(q));

  const tabs: { key: Tab; label: string; icon: typeof BookOpen; count: number }[] = [
    { key: 'topics', label: 'Topics', icon: BookOpen, count: topics.length },
    { key: 'questions', label: 'Questions', icon: Brain, count: questions.length },
    { key: 'documents', label: 'Documents', icon: FileText, count: documents.length },
  ];

  const addLabel = { topics: 'Add Topic', questions: 'Add Question', documents: 'Add Template' }[tab];

  return (
    <div className="space-y-6 animate-fade-in">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-lg flex items-center justify-center">
          <Database className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Content Management</h2>
          <p className="text-sm text-dark-muted">Add, edit, and remove topics, questions, and document templates</p>
        </div>
      </motion.div>

      {/* Tabs + actions */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex bg-dark-card border border-dark-border rounded-lg p-1">
          {tabs.map(({ key, label, icon: Icon, count }) => (
            <button
              key={key}
              onClick={() => { setTab(key); setSearch(''); }}
              className={clsx(
                'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all',
                tab === key ? 'bg-primary-600 text-white' : 'text-dark-muted hover:text-dark-text'
              )}
            >
              <Icon size={15} />
              {label}
              <span className={clsx('text-xs px-1.5 rounded', tab === key ? 'bg-primary-700' : 'bg-dark-border')}>{count}</span>
            </button>
          ))}
        </div>
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-muted" />
          <input className="input !pl-9 text-sm" placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <button className="btn-primary flex items-center gap-2 text-sm" onClick={() => setEditing({ kind: tab, item: null })}>
          <Plus size={15} /> {addLabel}
        </button>
        <button className="btn-secondary flex items-center gap-2 text-sm" onClick={() => setImporting(tab)}>
          <Upload size={15} /> Import Excel
        </button>
      </div>

      {/* Topics table */}
      {tab === 'topics' && (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-dark-muted uppercase tracking-wider border-b border-dark-border">
                <th className="py-3 pr-4 font-medium">Title</th>
                <th className="py-3 pr-4 font-medium">Subject</th>
                <th className="py-3 pr-4 font-medium">Level</th>
                <th className="py-3 pr-4 font-medium">Questions</th>
                <th className="py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTopics.map(t => (
                <tr key={t.id} className="border-b border-dark-border/50 hover:bg-dark-border/20">
                  <td className="py-3 pr-4">
                    <div className="text-dark-text font-medium">{t.title}</div>
                    <div className="text-xs text-dark-muted">{t.section || t.act || '—'}</div>
                  </td>
                  <td className="py-3 pr-4 text-dark-muted whitespace-nowrap">{t.subject}</td>
                  <td className="py-3 pr-4"><span className="badge-blue text-xs">{t.level}</span></td>
                  <td className="py-3 pr-4 text-dark-muted">{t._count.questions}</td>
                  <td className="py-3 text-right whitespace-nowrap">
                    <button className="text-dark-muted hover:text-primary-400 p-1.5" title="Edit" onClick={() => setEditing({ kind: 'topics', item: t })}><Pencil size={15} /></button>
                    <button className="text-dark-muted hover:text-red-400 p-1.5" title="Delete" onClick={() => handleDelete('topics', t.id, t.title)}><Trash2 size={15} /></button>
                  </td>
                </tr>
              ))}
              {filteredTopics.length === 0 && <tr><td colSpan={5} className="py-8 text-center text-dark-muted">No topics found</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {/* Questions table */}
      {tab === 'questions' && (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-dark-muted uppercase tracking-wider border-b border-dark-border">
                <th className="py-3 pr-4 font-medium">Question</th>
                <th className="py-3 pr-4 font-medium">Subject</th>
                <th className="py-3 pr-4 font-medium">Level</th>
                <th className="py-3 pr-4 font-medium">Difficulty</th>
                <th className="py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredQuestions.map(x => (
                <tr key={x.id} className="border-b border-dark-border/50 hover:bg-dark-border/20">
                  <td className="py-3 pr-4 max-w-md">
                    <div className="text-dark-text">{x.question.length > 100 ? x.question.slice(0, 100) + '…' : x.question}</div>
                    <div className="text-xs text-dark-muted">Topic: {x.topic.title.slice(0, 50)}{x._count.testResultItems > 0 && ` · answered ${x._count.testResultItems}×`}</div>
                  </td>
                  <td className="py-3 pr-4 text-dark-muted whitespace-nowrap">{x.subject}</td>
                  <td className="py-3 pr-4"><span className="badge-blue text-xs">{x.level}</span></td>
                  <td className="py-3 pr-4">
                    <span className={clsx('text-xs', x.difficulty === 'EASY' ? 'badge-green' : x.difficulty === 'HARD' ? 'badge-red' : 'badge-gold')}>{x.difficulty}</span>
                  </td>
                  <td className="py-3 text-right whitespace-nowrap">
                    <button className="text-dark-muted hover:text-primary-400 p-1.5" title="Edit" onClick={() => setEditing({ kind: 'questions', item: x })}><Pencil size={15} /></button>
                    <button className="text-dark-muted hover:text-red-400 p-1.5" title="Delete" onClick={() => handleDelete('questions', x.id, x.question.slice(0, 50))}><Trash2 size={15} /></button>
                  </td>
                </tr>
              ))}
              {filteredQuestions.length === 0 && <tr><td colSpan={5} className="py-8 text-center text-dark-muted">No questions found</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {/* Documents table */}
      {tab === 'documents' && (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-dark-muted uppercase tracking-wider border-b border-dark-border">
                <th className="py-3 pr-4 font-medium">Title</th>
                <th className="py-3 pr-4 font-medium">Category</th>
                <th className="py-3 pr-4 font-medium">Tags</th>
                <th className="py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocuments.map(d => (
                <tr key={d.id} className="border-b border-dark-border/50 hover:bg-dark-border/20">
                  <td className="py-3 pr-4">
                    <div className="text-dark-text font-medium">{d.title}</div>
                    <div className="text-xs text-dark-muted">{d.description.slice(0, 80)}</div>
                  </td>
                  <td className="py-3 pr-4"><span className="badge-gold text-xs">{d.category}</span></td>
                  <td className="py-3 pr-4 text-xs text-dark-muted max-w-[200px] truncate">{d.tags}</td>
                  <td className="py-3 text-right whitespace-nowrap">
                    <button className="text-dark-muted hover:text-primary-400 p-1.5" title="Edit" onClick={() => setEditing({ kind: 'documents', item: d })}><Pencil size={15} /></button>
                    <button className="text-dark-muted hover:text-red-400 p-1.5" title="Delete" onClick={() => handleDelete('documents', d.id, d.title)}><Trash2 size={15} /></button>
                  </td>
                </tr>
              ))}
              {filteredDocuments.length === 0 && <tr><td colSpan={4} className="py-8 text-center text-dark-muted">No templates found</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {/* Editor modals */}
      {editing?.kind === 'topics' && (
        <Modal title={editing.item ? 'Edit Topic' : 'New Topic'} onClose={() => setEditing(null)}>
          <TopicForm initial={editing.item as AdminTopic | null} onDone={() => setEditing(null)} />
        </Modal>
      )}
      {editing?.kind === 'questions' && (
        <Modal title={editing.item ? 'Edit Question' : 'New Question'} onClose={() => setEditing(null)}>
          <QuestionForm initial={editing.item as AdminQuestion | null} topics={topics} onDone={() => setEditing(null)} />
        </Modal>
      )}
      {editing?.kind === 'documents' && (
        <Modal title={editing.item ? 'Edit Template' : 'New Template'} onClose={() => setEditing(null)}>
          <DocumentForm initial={editing.item as AdminDocument | null} onDone={() => setEditing(null)} />
        </Modal>
      )}
      {importing && (
        <Modal title={`Import ${{ topics: 'Topics', questions: 'Questions', documents: 'Templates' }[importing]} from Excel`} onClose={() => setImporting(null)}>
          <ImportPanel kind={importing} onDone={() => setImporting(null)} />
        </Modal>
      )}
    </div>
  );
}
