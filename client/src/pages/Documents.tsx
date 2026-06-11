import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { FileText, Copy, Download, Search, Check, Tag } from 'lucide-react';
import { api } from '../utils/api';
import clsx from 'clsx';

const CATEGORIES = ['All', 'RESOLUTION', 'MINUTES', 'NOTICE', 'CHECKLIST', 'AUDIT_REPORT'];

const categoryColors: Record<string, string> = {
  RESOLUTION: 'badge-blue',
  MINUTES: 'badge-green',
  NOTICE: 'badge-gold',
  CHECKLIST: 'badge-red',
  AUDIT_REPORT: 'bg-purple-900/50 text-purple-400 border-purple-800',
};

const categoryIcons: Record<string, string> = {
  RESOLUTION: '📜',
  MINUTES: '📝',
  NOTICE: '📢',
  CHECKLIST: '✅',
  AUDIT_REPORT: '🔍',
};

interface Document {
  id: string;
  title: string;
  category: string;
  description: string;
  template: string;
  tags: string;
}

export default function Documents() {
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Document | null>(null);
  const [copied, setCopied] = useState(false);

  const { data: documents = [], isLoading } = useQuery<Document[]>({
    queryKey: ['documents', category],
    queryFn: () => {
      const params = new URLSearchParams();
      if (category !== 'All') params.set('category', category);
      return api.get(`/documents?${params}`).then(r => r.data);
    },
  });

  const filtered = documents.filter(d =>
    !search || d.title.toLowerCase().includes(search.toLowerCase()) || d.tags.toLowerCase().includes(search.toLowerCase())
  );

  const handleCopy = async () => {
    if (!selected) return;
    await navigator.clipboard.writeText(selected.template);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!selected) return;
    const blob = new Blob([selected.template], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selected.title.replace(/\s+/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-white">Document Templates</h2>
        <p className="text-dark-muted text-sm mt-1">Ready-to-use corporate documents, resolutions, notices, and compliance checklists</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-muted" />
          <input
            type="text"
            placeholder="Search templates..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input pl-10"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={clsx('px-3 py-2 rounded-lg text-xs font-medium transition-colors', category === c ? 'bg-primary-600 text-white' : 'bg-dark-border text-dark-muted hover:text-dark-text')}
            >
              {c === 'All' ? 'All' : `${categoryIcons[c] || ''} ${c}`}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Document List */}
        <div className="lg:col-span-2 space-y-3">
          {isLoading ? (
            [...Array(4)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-4 bg-dark-border rounded w-3/4 mb-2" />
                <div className="h-3 bg-dark-border rounded w-1/2" />
              </div>
            ))
          ) : filtered.length === 0 ? (
            <div className="card text-center py-8">
              <FileText size={32} className="text-dark-muted mx-auto mb-2" />
              <p className="text-dark-text text-sm">No templates found</p>
            </div>
          ) : (
            filtered.map((doc, i) => (
              <motion.button
                key={doc.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                onClick={() => setSelected(doc)}
                className={clsx(
                  'w-full text-left card hover:-translate-y-0.5 transition-all duration-200',
                  selected?.id === doc.id ? 'border-primary-500 bg-primary-900/10' : 'hover:border-primary-700/40'
                )}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0">{categoryIcons[doc.category] || '📄'}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-dark-text text-sm font-medium line-clamp-2">{doc.title}</p>
                    <p className="text-dark-muted text-xs mt-0.5 line-clamp-1">{doc.description}</p>
                    <span className={clsx('badge mt-1.5', categoryColors[doc.category] || 'badge-blue')}>
                      {doc.category}
                    </span>
                  </div>
                </div>
              </motion.button>
            ))
          )}
        </div>

        {/* Template Preview */}
        <div className="lg:col-span-3">
          {selected ? (
            <div className="card h-full flex flex-col">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-white font-semibold">{selected.title}</h3>
                  <p className="text-dark-muted text-sm mt-0.5">{selected.description}</p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {selected.tags.split(',').slice(0, 5).map(t => (
                      <span key={t} className="inline-flex items-center gap-1 text-xs text-dark-muted">
                        <Tag size={10} />{t.trim()}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={handleCopy} className="btn-secondary flex items-center gap-1.5 text-xs py-2">
                    {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                  <button onClick={handleDownload} className="btn-primary flex items-center gap-1.5 text-xs py-2">
                    <Download size={14} /> Download
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-auto">
                <pre className="text-dark-text text-xs leading-relaxed whitespace-pre-wrap font-mono bg-dark-bg border border-dark-border rounded-lg p-4 h-full overflow-auto">
                  {selected.template}
                </pre>
              </div>
              <div className="mt-3 bg-primary-900/20 border border-primary-800/30 rounded-lg p-3">
                <p className="text-xs text-primary-300">
                  💡 Replace all text in [BRACKETS] with actual details. Verify compliance requirements before use.
                </p>
              </div>
            </div>
          ) : (
            <div className="card h-64 flex flex-col items-center justify-center text-center">
              <FileText size={40} className="text-dark-muted mb-3" />
              <p className="text-dark-text font-medium">Select a template</p>
              <p className="text-dark-muted text-sm">Choose a document from the left to preview and download</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
