import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen, Brain, MessageSquare, FileText, ShieldCheck,
  Calendar, CheckCircle, ArrowRight, Vault, Star, Users,
  TrendingUp, Award,
} from 'lucide-react';

const features = [
  {
    icon: BookOpen,
    title: 'Smart Law Explorer',
    desc: 'Search any section instantly — plain English explanations, original text, amendments, and case laws.',
    color: 'from-blue-600 to-blue-800',
  },
  {
    icon: Brain,
    title: 'Practice Hub',
    desc: 'ICSI-pattern MCQs, previous year papers, AI-adaptive mock tests, and spaced-repetition flashcards.',
    color: 'from-purple-600 to-purple-800',
  },
  {
    icon: MessageSquare,
    title: 'AI CS Assistant',
    desc: 'Chat with an AI trained on Companies Act, SEBI, FEMA, and IBC. Instant answers, draft resolutions.',
    color: 'from-emerald-600 to-emerald-800',
  },
  {
    icon: FileText,
    title: 'Document Templates',
    desc: 'Ready-to-use board resolutions, minutes, notices, secretarial audit reports, and compliance checklists.',
    color: 'from-orange-600 to-orange-800',
  },
  {
    icon: ShieldCheck,
    title: 'Compliance Simulator',
    desc: 'Practice real-world scenarios: drafting, ROC filings, secretarial compliance step-by-step guides.',
    color: 'from-red-600 to-red-800',
  },
  {
    icon: Calendar,
    title: 'Study Planner',
    desc: 'AI-generated weekly study plans, exam countdown, and smart scheduling based on your weak areas.',
    color: 'from-gold-600 to-yellow-700',
  },
];

const stats = [
  { icon: BookOpen, label: 'Topics Covered', value: '500+' },
  { icon: Brain, label: 'Practice Questions', value: '2,000+' },
  { icon: FileText, label: 'Document Templates', value: '50+' },
  { icon: Users, label: 'CS Students', value: '10,000+' },
];

const levels = [
  { name: 'Foundation', subjects: ['Business Environment', 'Business Management', 'Business Economics', 'Fundamentals of Accounting'], color: 'border-emerald-600/40 bg-emerald-900/10' },
  { name: 'Executive', subjects: ['Company Law', 'Economic Laws', 'Securities Laws', 'Financial Management', 'Ethics'], color: 'border-primary-600/40 bg-primary-900/10' },
  { name: 'Professional', subjects: ['Advanced Company Law', 'Corporate Governance', 'Secretarial Audit', 'Due Diligence', 'Drafting'], color: 'border-gold-500/40 bg-gold-900/10' },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-dark-bg text-dark-text">
      {/* Navbar */}
      <nav className="border-b border-dark-border bg-dark-card/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-600 to-primary-800 rounded-lg flex items-center justify-center">
              <Vault className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-white text-xl">CS Vault</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/auth" className="text-dark-muted hover:text-dark-text transition-colors text-sm font-medium">Login</Link>
            <Link to="/auth" className="btn-primary text-sm">Get Started Free</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-950/50 via-dark-bg to-dark-bg pointer-events-none" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 bg-primary-900/40 border border-primary-700/40 rounded-full px-4 py-1.5 text-sm text-primary-300 mb-6">
              <Star size={14} className="text-gold-400" />
              <span>India's #1 Platform for CS Aspirants</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Your Intelligent Companion for
              <span className="text-gradient block">Company Secretary Studies</span>
            </h1>
            <p className="text-lg text-dark-muted max-w-2xl mx-auto mb-10">
              Master Companies Act, SEBI regulations, IBC, and ICSI syllabus with AI-powered explanations,
              practice tests, and real-world compliance simulators.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth" className="btn-primary text-base px-8 py-3 flex items-center justify-center gap-2">
                Start Learning Free <ArrowRight size={18} />
              </Link>
              <a href="#features" className="btn-secondary text-base px-8 py-3 flex items-center justify-center gap-2">
                Explore Features
              </a>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-16"
          >
            {stats.map(({ icon: Icon, label, value }) => (
              <div key={label} className="card text-center">
                <Icon className="w-8 h-8 text-primary-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{value}</div>
                <div className="text-sm text-dark-muted">{label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Everything You Need to Crack CS Exams</h2>
            <p className="text-dark-muted max-w-2xl mx-auto">
              From Foundation to Professional level, CS Vault covers all modules with cutting-edge learning tools.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc, color }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="card hover:border-primary-700/50 transition-all duration-300 group"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-semibold mb-2">{title}</h3>
                <p className="text-dark-muted text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Levels */}
      <section className="py-20 bg-dark-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">All Three CS Levels Covered</h2>
            <p className="text-dark-muted">Comprehensive content for Foundation, Executive, and Professional exams</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {levels.map(({ name, subjects, color }) => (
              <div key={name} className={`rounded-xl border p-6 ${color}`}>
                <div className="flex items-center gap-2 mb-4">
                  <Award className="w-5 h-5 text-primary-400" />
                  <h3 className="text-white font-bold text-lg">CS {name}</h3>
                </div>
                <ul className="space-y-2">
                  {subjects.map(s => (
                    <li key={s} className="flex items-center gap-2 text-sm text-dark-muted">
                      <CheckCircle size={14} className="text-emerald-400 flex-shrink-0" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-primary-900/60 to-primary-950 border border-primary-700/40 rounded-2xl p-10"
          >
            <TrendingUp className="w-12 h-12 text-primary-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Ace Your CS Exams?</h2>
            <p className="text-dark-muted mb-8">
              Join thousands of CS aspirants who are already using CS Vault to prepare smarter.
            </p>
            <Link to="/auth" className="btn-primary text-base px-10 py-3 inline-flex items-center gap-2">
              Create Free Account <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      <footer className="border-t border-dark-border py-8 text-center text-dark-muted text-sm">
        <p>© 2024 CS Vault. Built for ICSI CS aspirants. All rights reserved.</p>
        <p className="mt-1 text-xs">Not affiliated with ICSI. For educational purposes only.</p>
      </footer>
    </div>
  );
}
