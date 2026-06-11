import { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Send, Loader2, Trash2, Bot, User, Lightbulb, Vault } from 'lucide-react';
import { api } from '../utils/api';
import clsx from 'clsx';

const QUICK_PROMPTS = [
  'Explain Section 185 of Companies Act 2013 with practical example',
  'What are the requirements for holding an AGM?',
  'Draft a board resolution for appointment of Company Secretary',
  'Explain the CIRP process under IBC 2016',
  "What is the difference between MOA and AOA?",
  'What are independent director requirements under SEBI LODR?',
];

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt?: string;
}

// Simple inline markdown-ish renderer to avoid extra dependencies
function MessageContent({ content }: { content: string }) {
  return (
    <div className="prose prose-sm prose-invert max-w-none text-sm leading-relaxed">
      {content.split('\n').map((line, i) => {
        if (line.startsWith('## ')) return <h3 key={i} className="text-white font-semibold mt-3 mb-1">{line.slice(3)}</h3>;
        if (line.startsWith('# ')) return <h2 key={i} className="text-white font-bold mt-3 mb-1">{line.slice(2)}</h2>;
        if (line.startsWith('**') && line.endsWith('**')) return <p key={i} className="text-white font-semibold">{line.slice(2, -2)}</p>;
        if (line.startsWith('- ') || line.startsWith('• ')) return <li key={i} className="ml-4 text-dark-text list-disc">{line.slice(2)}</li>;
        if (line.match(/^\d+\./)) return <p key={i} className="text-dark-text">{line}</p>;
        if (line === '') return <br key={i} />;
        return <p key={i} className="text-dark-text">{line}</p>;
      })}
    </div>
  );
}

export default function AIAssistant() {
  const [input, setInput] = useState('');
  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const { data: history = [] } = useQuery<Message[]>({
    queryKey: ['chat-history'],
    queryFn: () => api.get('/ai/history').then(r => r.data),
  });

  useEffect(() => {
    if (history.length > 0 && localMessages.length === 0) {
      setLocalMessages(history);
    }
  }, [history]);

  const chatMutation = useMutation({
    mutationFn: (message: string) => api.post('/ai/chat', {
      message,
      history: localMessages.slice(-10).map(m => ({ role: m.role, content: m.content })),
    }),
    onSuccess: (res, message) => {
      const userMsg: Message = { id: Date.now().toString(), role: 'user', content: message };
      const aiMsg: Message = { id: (Date.now() + 1).toString(), role: 'assistant', content: res.data.response };
      setLocalMessages(prev => [...prev, userMsg, aiMsg]);
    },
  });

  const clearMutation = useMutation({
    mutationFn: () => api.delete('/ai/history'),
    onSuccess: () => { setLocalMessages([]); queryClient.invalidateQueries({ queryKey: ['chat-history'] }); },
  });

  const handleSend = () => {
    if (!input.trim() || chatMutation.isPending) return;
    const message = input.trim();
    setInput('');
    chatMutation.mutate(message);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [localMessages, chatMutation.isPending]);

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Bot className="text-primary-400" size={22} /> AI CS Assistant
          </h2>
          <p className="text-dark-muted text-sm">Powered by Claude AI · Expert in ICSI syllabus</p>
        </div>
        {localMessages.length > 0 && (
          <button
            onClick={() => clearMutation.mutate()}
            className="text-dark-muted hover:text-red-400 transition-colors flex items-center gap-1.5 text-sm"
          >
            <Trash2 size={16} /> Clear
          </button>
        )}
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto bg-dark-card border border-dark-border rounded-xl p-4 space-y-4 mb-4">
        {localMessages.length === 0 && !chatMutation.isPending && (
          <div className="flex flex-col items-center justify-center h-full text-center py-8">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl flex items-center justify-center mb-4">
              <Vault className="w-9 h-9 text-white" />
            </div>
            <h3 className="text-white font-semibold mb-2">CS Vault AI Assistant</h3>
            <p className="text-dark-muted text-sm max-w-xs mb-6">
              Ask me anything about Company Law, SEBI, IBC, FEMA, or get help drafting legal documents.
            </p>
            <div className="w-full max-w-lg">
              <p className="text-dark-muted text-xs mb-2 flex items-center gap-1 justify-center">
                <Lightbulb size={12} /> Try one of these:
              </p>
              <div className="grid sm:grid-cols-2 gap-2">
                {QUICK_PROMPTS.map(p => (
                  <button
                    key={p}
                    onClick={() => { setInput(p); }}
                    className="text-left text-xs bg-dark-bg border border-dark-border hover:border-primary-700/50 text-dark-muted hover:text-dark-text px-3 py-2 rounded-lg transition-all"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {localMessages.map((msg, i) => (
          <motion.div
            key={msg.id || i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={clsx('flex gap-3', msg.role === 'user' ? 'justify-end' : 'justify-start')}
          >
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-800 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <Bot size={16} className="text-white" />
              </div>
            )}
            <div className={clsx(
              'max-w-[85%] rounded-2xl px-4 py-3',
              msg.role === 'user'
                ? 'bg-primary-600 text-white rounded-tr-sm'
                : 'bg-dark-bg border border-dark-border rounded-tl-sm'
            )}>
              {msg.role === 'assistant' ? (
                <MessageContent content={msg.content} />
              ) : (
                <p className="text-sm">{msg.content}</p>
              )}
            </div>
            {msg.role === 'user' && (
              <div className="w-8 h-8 bg-dark-border rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <User size={16} className="text-dark-muted" />
              </div>
            )}
          </motion.div>
        ))}

        {chatMutation.isPending && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-800 rounded-full flex items-center justify-center flex-shrink-0">
              <Bot size={16} className="text-white" />
            </div>
            <div className="bg-dark-bg border border-dark-border rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2">
              <Loader2 size={16} className="animate-spin text-primary-400" />
              <span className="text-dark-muted text-sm">Thinking...</span>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            placeholder="Ask about any CS topic, section, or request a document draft..."
            rows={1}
            className="input resize-none pr-12 py-3"
            style={{ minHeight: '48px', maxHeight: '120px' }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || chatMutation.isPending}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-primary-600 hover:bg-primary-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg flex items-center justify-center transition-colors"
          >
            <Send size={15} className="text-white" />
          </button>
        </div>
      </div>
      <p className="text-center text-dark-muted text-xs mt-2">
        Enter to send · Shift+Enter for new line · AI may make mistakes, verify with official ICSI resources
      </p>
    </div>
  );
}
