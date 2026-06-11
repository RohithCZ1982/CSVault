import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ChevronRight, CheckCircle, Circle, ArrowLeft, BookOpen, AlertCircle } from 'lucide-react';
import clsx from 'clsx';

interface Step {
  title: string;
  description: string;
  section?: string;
  timeLimit?: string;
  form?: string;
  tips?: string[];
}

interface Scenario {
  id: string;
  title: string;
  icon: string;
  category: string;
  description: string;
  difficulty: string;
  steps: Step[];
}

const scenarios: Scenario[] = [
  {
    id: 'agm',
    title: 'Conducting Annual General Meeting (AGM)',
    icon: '🏛️',
    category: 'Corporate Meetings',
    description: 'Step-by-step guide to organizing and conducting a compliant AGM under Companies Act 2013',
    difficulty: 'Intermediate',
    steps: [
      {
        title: 'Board Meeting to Approve AGM Notice',
        description: 'Convene a Board Meeting to approve the AGM notice, agenda, Directors\' Report, and financial statements. Pass board resolution for calling AGM.',
        section: 'Section 173, 96',
        timeLimit: 'At least 7 days before AGM notice dispatch',
        form: 'MBP-1 (Board meeting attendance)',
        tips: ['Board meeting requires minimum 7 days notice', 'Video conferencing is permitted for board meetings', 'Quorum: 1/3rd of total directors or 2 directors, whichever is higher'],
      },
      {
        title: 'Prepare AGM Notice and Agenda',
        description: 'Draft the AGM notice with all ordinary and special business items. Attach Explanatory Statement for all special business under Section 102.',
        section: 'Section 101, 102',
        tips: ['Notice must specify day, date, time, and venue', 'Mention right to appoint proxy', 'Explanatory Statement must mention material facts for special business'],
      },
      {
        title: 'Send AGM Notice to All Stakeholders',
        description: 'Send notice to all members, directors, auditors, and debenture trustees. Minimum 21 clear days notice required.',
        section: 'Section 101(1)',
        timeLimit: 'Minimum 21 clear days before AGM',
        tips: ['Can send via email to those who consented', '95% members can consent to shorter notice', 'Deemed receipt: 48 hours after email dispatch'],
      },
      {
        title: 'Fix Record Date / Book Closure',
        description: 'Fix record date for dividend payment and member identification. Give notice of book closure/record date to stock exchange (for listed companies).',
        section: 'Section 91, SEBI LODR Reg. 42',
        timeLimit: '15-30 days\' advance notice for book closure',
        tips: ['Listed companies must notify stock exchange 15 days before record date', 'Book closure period cannot exceed 30 days', 'For dividends, record date or book closure required'],
      },
      {
        title: 'Conduct the AGM',
        description: 'Conduct the AGM at the registered office or within the city. Ensure quorum is present, appoint Chairman, transact all business items.',
        section: 'Section 96, 97, 103',
        tips: ['Quorum: 5 members for public company (if members ≤ 1000)', '15 members if members > 1000 up to 5000', 'If quorum not present in 30 mins, adjourn to next week'],
      },
      {
        title: 'Record Minutes of AGM',
        description: 'Record proceedings of AGM including all resolutions passed, attendance, voting results. Minutes to be signed by Chairman.',
        section: 'Section 118',
        timeLimit: 'Within 30 days of AGM',
        form: 'Minutes Book',
        tips: ['Minutes must record all facts required by Secretarial Standard SS-2', 'Must include names of directors, members who spoke', 'Signed by Chairman of meeting or next chairman'],
      },
      {
        title: 'File Resolutions with ROC',
        description: 'File special resolutions passed at AGM with ROC within 30 days.',
        section: 'Section 117',
        timeLimit: 'Within 30 days of passing resolution',
        form: 'MGT-14',
        tips: ['Ordinary resolutions generally not required to be filed', 'Special resolutions for alterations, borrowing, etc. must be filed', 'Late filing attracts additional fees'],
      },
      {
        title: 'Post-AGM Compliances',
        description: 'Complete all post-AGM filings: Annual Return (MGT-7), Financial Statements (AOC-4), Auditor appointment (ADT-1), dividend payment within 30 days.',
        section: 'Section 92, 137, 139, 123',
        form: 'MGT-7, AOC-4, ADT-1',
        timeLimit: 'Within 60 days of AGM (MGT-7), 30 days (AOC-4)',
        tips: ['Dividend must be paid within 30 days of declaration', 'Unclaimed dividend to IEPF after 7 years', 'Annual Return on website within 60 days'],
      },
    ],
  },
  {
    id: 'director-appointment',
    title: 'Appointment of Independent Director',
    icon: '👔',
    category: 'Corporate Governance',
    description: 'Complete process for identifying, vetting, and appointing an Independent Director',
    difficulty: 'Intermediate',
    steps: [
      {
        title: 'Check Eligibility Criteria',
        description: 'Verify the proposed Independent Director meets all eligibility criteria under Section 149(6): no pecuniary relationship, not related to promoters, not a past employee within 3 years.',
        section: 'Section 149(6)',
        tips: ['Person must not have been KMP in company/associates for 3 years', 'No material pecuniary relationship with company', 'Net worth must be > ₹25 lakh if charging fees'],
      },
      {
        title: 'Register on Data Bank',
        description: 'Person must register on Independent Directors Data Bank maintained by IICA (Indian Institute of Corporate Affairs) and pass the proficiency self-assessment test.',
        section: 'Rule 6 of Companies (Appointment) Rules',
        tips: ['Registration mandatory before appointment', 'Proficiency test must be cleared within 1 year of registration', 'Exemption for persons with 10+ years experience as CS/CA/CMA or Director'],
      },
      {
        title: 'Nomination & Remuneration Committee Approval',
        description: 'NRC to evaluate the candidate and recommend appointment to the Board. Assess independence, expertise, and suitability.',
        section: 'Section 178',
        tips: ['NRC mandatory for listed companies and certain public companies', 'Committee to lay down criteria for appointment', 'Assess independence declaration from candidate'],
      },
      {
        title: 'Board Meeting - Appointment as Additional Director',
        description: 'Pass board resolution appointing the person as Additional Director (Independent) with effect from specified date.',
        section: 'Section 161, 149',
        form: 'DIR-2 (Consent), DIR-8 (Non-disqualification)',
        tips: ['Must obtain DIR-2 (consent) and DIR-8 before appointment', 'Intimation to Stock Exchange within 24 hours (listed company)', 'Additional Director holds office till next AGM'],
      },
      {
        title: 'File DIR-12 with ROC',
        description: 'File e-form DIR-12 with ROC for appointment of director, attaching DIR-2, DIR-8, and DIN details.',
        section: 'Section 170',
        form: 'DIR-12',
        timeLimit: 'Within 30 days of appointment',
        tips: ['DIN must be obtained before appointment', 'Attach digital signature of director', 'Professional certification required'],
      },
      {
        title: 'Issue Letter of Appointment',
        description: 'Issue formal Letter of Appointment specifying terms, conditions, duties, and responsibilities as per Schedule IV.',
        section: 'Schedule IV, Section 149',
        tips: ['Letter available on company website', 'Includes role, duties, remuneration structure', 'Sitting fees and commission subject to limits'],
      },
      {
        title: 'Shareholders Approval at AGM/EGM',
        description: 'Get approval from shareholders by ordinary resolution for appointment (first term) or special resolution (second term).',
        section: 'Section 152(5), 149(10)',
        form: 'MGT-14 (if special resolution)',
        tips: ['First appointment: Ordinary resolution', 'Re-appointment for 2nd term: Special resolution', 'Disclosure in Notice required per Schedule IV'],
      },
    ],
  },
  {
    id: 'annual-return',
    title: 'Filing Annual Return (MGT-7)',
    icon: '📋',
    category: 'ROC Compliance',
    description: 'Complete process for preparing and filing the Annual Return with ROC',
    difficulty: 'Beginner',
    steps: [
      {
        title: 'Prepare Data for Annual Return',
        description: 'Collect all required information: company details, registered office, financial year details, share capital structure, list of members and debenture holders.',
        section: 'Section 92',
        tips: ['Annual Return as of the close of financial year', 'Must include changes in share capital during the year', 'Include all KMP appointments and resignations'],
      },
      {
        title: 'Compile Director Information',
        description: 'List all directors with DIN, designation, appointment/resignation dates, remuneration, attendance at meetings.',
        section: 'Section 92(1)(c)',
        tips: ['Include all directors who held office during the year', 'Mentionindependent director certification date', 'Attendance at Board and Committee meetings required'],
      },
      {
        title: 'Prepare Shareholder Details',
        description: 'Compile list of top 10 shareholders, promoter shareholding, and changes in shareholding pattern during the year.',
        section: 'Section 92(1)(g)',
        tips: ['Include transfer of shares during year', 'Mention pledged shares separately', 'Details of ESOP exercised'],
      },
      {
        title: 'Obtain Certification from PCS',
        description: 'For listed companies and others above threshold, get Annual Return certified by a Practicing Company Secretary.',
        section: 'Section 92(2)',
        form: 'MGT-7 certification',
        tips: ['PCS certification mandatory for listed companies', 'CS certifies compliance with Act provisions', 'Annual Return available on company website'],
      },
      {
        title: 'File MGT-7/MGT-7A with ROC',
        description: 'File e-Form MGT-7 (companies other than OPC/Small Companies) or MGT-7A (OPC and Small Companies) with ROC with requisite fees.',
        section: 'Section 92(4)',
        form: 'MGT-7 or MGT-7A',
        timeLimit: 'Within 60 days from date of AGM',
        tips: ['Filing fee based on authorized capital', 'Late filing fee: ₹100 per day', 'Digital signature of CS or Director required'],
      },
    ],
  },
  {
    id: 'merger',
    title: 'Merger/Amalgamation Process',
    icon: '🔀',
    category: 'Corporate Restructuring',
    description: 'End-to-end process for merging two companies under Companies Act 2013',
    difficulty: 'Advanced',
    steps: [
      {
        title: 'Board Approval and Scheme Drafting',
        description: 'Board approves concept of merger. Engage investment bankers, legal advisors. Draft Scheme of Amalgamation per Section 230-232.',
        section: 'Section 230, 232',
        tips: ['Obtain fairness opinion from independent valuers', 'Tax implications must be analyzed', 'Draft scheme must address treatment of liabilities, employees'],
      },
      {
        title: 'Application to NCLT',
        description: 'Both companies file application with NCLT (National Company Law Tribunal) for calling meetings of shareholders, creditors, and other stakeholders.',
        section: 'Section 230(1)',
        form: 'NCLT Form 1',
        tips: ['File draft scheme with NCLT', 'NCLT order for convening meetings', 'Timeline: NCLT typically takes 3-6 months'],
      },
      {
        title: 'RBI/CCI/SEBI Approvals',
        description: 'Obtain necessary regulatory approvals: RBI (if foreign elements), CCI (Competition Commission if thresholds exceeded), SEBI (if listed company).',
        section: 'Sector-specific regulations',
        tips: ['CCI filing if combined market cap > ₹2000 crore or turnover > ₹6000 crore', 'SEBI LODR requires detailed disclosures', 'Timeline for CCI approval: 30 working days (or more)'],
      },
      {
        title: 'Shareholder and Creditor Meetings',
        description: 'Conduct meetings of shareholders, secured creditors, and unsecured creditors separately. Pass resolution with 75% majority in value.',
        section: 'Section 230(3)',
        tips: ['75% in value of shareholders must approve', 'Separate class meetings for different classes of shares', 'NCLT-approved observer to be present'],
      },
      {
        title: 'NCLT Final Order',
        description: 'File petition with NCLT for final sanction of scheme. NCLT hears objections and passes final order sanctioning the scheme.',
        section: 'Section 232',
        form: 'NCLT Form 36',
        tips: ['NCLT may impose conditions', 'Official Liquidator and ROC reports required', 'Order is binding on all parties'],
      },
      {
        title: 'Effective Date and Implementation',
        description: 'File NCLT order with ROC within 30 days. Implement scheme: transfer assets/liabilities, issue shares to shareholders of transferor company.',
        section: 'Section 232(5)',
        form: 'INC-28',
        timeLimit: 'File order with ROC within 30 days of NCLT order',
        tips: ['Effective date as specified in scheme', 'Transferor company dissolved without winding up', 'Update all records: banks, MCA, SEBI, exchanges'],
      },
    ],
  },
];

export default function ComplianceSimulator() {
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const toggleStep = (i: number) => {
    setCompletedSteps(prev => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i); else next.add(i);
      return next;
    });
  };

  const progress = selectedScenario ? Math.round((completedSteps.size / selectedScenario.steps.length) * 100) : 0;

  if (selectedScenario) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
        <button onClick={() => { setSelectedScenario(null); setCompletedSteps(new Set()); }} className="flex items-center gap-2 text-dark-muted hover:text-dark-text transition-colors text-sm">
          <ArrowLeft size={16} /> Back to Scenarios
        </button>

        <div className="card">
          <div className="flex items-start gap-4">
            <span className="text-4xl">{selectedScenario.icon}</span>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white">{selectedScenario.title}</h2>
              <p className="text-dark-muted text-sm mt-1">{selectedScenario.description}</p>
              <div className="flex items-center gap-3 mt-2">
                <span className={clsx('badge', selectedScenario.difficulty === 'Beginner' ? 'badge-green' : selectedScenario.difficulty === 'Intermediate' ? 'badge-blue' : 'badge-red')}>
                  {selectedScenario.difficulty}
                </span>
                <span className="badge badge-blue">{selectedScenario.category}</span>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1.5">
              <span className="text-dark-muted">Progress</span>
              <span className="text-primary-400">{completedSteps.size}/{selectedScenario.steps.length} steps · {progress}%</span>
            </div>
            <div className="h-2 bg-dark-border rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary-500 rounded-full"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {selectedScenario.steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className={clsx('card transition-all duration-200', completedSteps.has(i) ? 'border-emerald-700/40 bg-emerald-900/5' : '')}
            >
              <div className="flex items-start gap-4">
                <button
                  onClick={() => toggleStep(i)}
                  className="flex-shrink-0 mt-0.5 transition-colors"
                >
                  {completedSteps.has(i)
                    ? <CheckCircle size={22} className="text-emerald-400" />
                    : <Circle size={22} className="text-dark-muted hover:text-primary-400" />}
                </button>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className={clsx('font-semibold text-sm', completedSteps.has(i) ? 'text-emerald-400 line-through' : 'text-white')}>
                      Step {i + 1}: {step.title}
                    </h4>
                    <span className="badge badge-blue flex-shrink-0">Step {i + 1}</span>
                  </div>
                  <p className="text-dark-muted text-sm mt-2 leading-relaxed">{step.description}</p>

                  <div className="grid sm:grid-cols-2 gap-3 mt-3">
                    {step.section && (
                      <div className="flex items-center gap-2 text-xs text-primary-300">
                        <BookOpen size={13} /> <span><strong>Section:</strong> {step.section}</span>
                      </div>
                    )}
                    {step.timeLimit && (
                      <div className="flex items-center gap-2 text-xs text-gold-400">
                        <AlertCircle size={13} /> <span><strong>Timeline:</strong> {step.timeLimit}</span>
                      </div>
                    )}
                    {step.form && (
                      <div className="flex items-center gap-2 text-xs text-emerald-400">
                        <CheckCircle size={13} /> <span><strong>Form:</strong> {step.form}</span>
                      </div>
                    )}
                  </div>

                  {step.tips && step.tips.length > 0 && (
                    <div className="mt-3 bg-dark-bg/50 rounded-lg p-3 border border-dark-border">
                      <p className="text-xs text-primary-400 font-medium mb-1.5">💡 Important Points:</p>
                      <ul className="space-y-1">
                        {step.tips.map((tip, j) => (
                          <li key={j} className="text-xs text-dark-muted flex items-start gap-1.5">
                            <span className="text-primary-500 mt-0.5">•</span> {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {progress === 100 && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card bg-emerald-900/20 border-emerald-700/40 text-center py-8">
            <CheckCircle size={48} className="text-emerald-400 mx-auto mb-3" />
            <h3 className="text-white font-bold text-lg">Scenario Completed! 🎉</h3>
            <p className="text-dark-muted text-sm mt-1">You've completed all steps. Great practice for real-world compliance!</p>
          </motion.div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-white">Compliance Simulator</h2>
        <p className="text-dark-muted text-sm mt-1">Practice real-world corporate compliance scenarios step by step</p>
      </div>

      <div className="card bg-gradient-to-r from-primary-900/40 to-primary-950">
        <div className="flex items-start gap-4">
          <ShieldCheck className="text-primary-400 flex-shrink-0 mt-1" size={28} />
          <div>
            <h3 className="text-white font-semibold">Learn by Doing</h3>
            <p className="text-dark-muted text-sm mt-1">
              Each scenario walks you through actual compliance procedures with section references, timelines, and exam tips.
              Perfect for understanding practical application of Company Law.
            </p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {scenarios.map((scenario, i) => (
          <motion.button
            key={scenario.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => { setSelectedScenario(scenario); setCompletedSteps(new Set()); }}
            className="card hover:border-primary-700/50 hover:-translate-y-0.5 transition-all duration-200 text-left group"
          >
            <div className="flex items-start gap-4">
              <span className="text-4xl">{scenario.icon}</span>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-white font-semibold text-sm group-hover:text-primary-300 transition-colors">{scenario.title}</h3>
                  <ChevronRight size={16} className="text-dark-muted group-hover:text-primary-400 transition-colors flex-shrink-0 mt-0.5" />
                </div>
                <p className="text-dark-muted text-xs mt-1 leading-relaxed">{scenario.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={clsx('badge', scenario.difficulty === 'Beginner' ? 'badge-green' : scenario.difficulty === 'Intermediate' ? 'badge-blue' : 'badge-red')}>
                    {scenario.difficulty}
                  </span>
                  <span className="text-dark-muted text-xs">{scenario.steps.length} steps</span>
                </div>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
