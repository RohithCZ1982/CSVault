import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const topics = [
  {
    title: 'Section 2 - Definitions under Companies Act 2013',
    description: 'Key definitions including company, director, member, share, debenture, financial year',
    level: 'FOUNDATION',
    subject: 'Company Law',
    section: 'Section 2',
    act: 'Companies Act 2013',
    plainEnglish: 'This section defines all important terms used throughout the Companies Act. Understanding these definitions is crucial as they form the basis for interpreting all other provisions.',
    content: `Section 2 of the Companies Act, 2013 contains 93 definitions that are fundamental to the entire Act.

Key Definitions:
1. Company [Section 2(20)]: A company incorporated under this Act or any previous company law.
2. Private Company [Section 2(68)]: A company with paid-up capital not exceeding ₹50 crore, restricts right to transfer shares, limits members to 200, prohibits invitation to public.
3. Public Company [Section 2(71)]: A company that is not a private company. Minimum 7 members, minimum 3 directors.
4. Director [Section 2(34)]: A director appointed to the Board of Directors of a company.
5. Financial Year [Section 2(41)]: Period ending on 31st March every year (exceptions require NCLT approval).
6. Share [Section 2(84)]: A share in the share capital of a company, including stock.
7. Debenture [Section 2(30)]: Includes debenture stock, bonds, or any other instrument of a company evidencing a debt.
8. Member [Section 2(55)]: Subscriber to memorandum, person agreeing in writing to become member, person holding shares.
9. Holding Company [Section 2(46)]: Company that controls the composition of board, or holds more than half of total voting power.
10. Subsidiary Company [Section 2(87)]: A company controlled by a holding company.`,
    keywords: 'definitions, company, private company, public company, director, financial year, share, debenture, member, holding company, subsidiary',
    amendment: 'Companies (Amendment) Act 2017 modified several definitions including One Person Company and Small Company.',
  },
  {
    title: 'Section 96 - Annual General Meeting (AGM)',
    description: 'Requirements for holding AGM, notice period, agenda, and consequences of non-compliance',
    level: 'EXECUTIVE',
    subject: 'Company Law',
    section: 'Section 96',
    act: 'Companies Act 2013',
    plainEnglish: 'Every company (except OPC) must hold an AGM every year. The first AGM must be within 9 months of first financial year end; subsequent ones within 6 months. Maximum gap between two AGMs cannot exceed 15 months.',
    content: `Section 96 - Annual General Meeting

Applicability: Every company other than a One Person Company must hold an AGM.

Timing Requirements:
- First AGM: Within 9 months from close of first financial year
- Subsequent AGMs: Within 6 months from close of financial year
- Maximum gap: 15 months between two consecutive AGMs
- ROC can extend time by 3 months in special cases

Day, Time and Place:
- Must be held during business hours (9 AM to 6 PM)
- Not on a national holiday
- At registered office or within the city/town where registered office is situated

Notice Requirements [Section 101]:
- Minimum 21 clear days notice
- Can be reduced to shorter notice if 95% of members in paid-up capital agree
- Must be sent to all members, directors, and auditors

AGM Agenda (Ordinary Business) [Section 102]:
1. Consideration of financial statements
2. Declaration of dividend
3. Appointment/re-appointment of directors
4. Appointment of auditors and fixing their remuneration

Special Business: All business except ordinary business must be accompanied by an Explanatory Statement.

Consequences of Non-holding:
- Default: Company and every officer in default punishable with fine up to ₹1 lakh
- Continuing default: ₹5,000 per day
- NCLT can call AGM on application by any member`,
    keywords: 'AGM, annual general meeting, notice, agenda, business hours, ordinary business, special business, NCLT',
    amendment: 'MCA allowed virtual/hybrid AGMs during COVID. Companies (Amendment) Rules 2021 permit companies to send notice via email.',
  },
  {
    title: 'Section 149 - Company to have Board of Directors',
    description: 'Composition of Board, minimum and maximum directors, independent directors requirements',
    level: 'EXECUTIVE',
    subject: 'Company Law',
    section: 'Section 149',
    act: 'Companies Act 2013',
    plainEnglish: 'Every company needs a Board of Directors. Private companies need at least 2 directors, public companies at least 3, and OPCs at least 1. Listed companies must have at least 1/3rd independent directors.',
    content: `Section 149 - Company to have Board of Directors

Minimum Directors:
- Public Company: Minimum 3 directors
- Private Company: Minimum 2 directors
- One Person Company: Minimum 1 director
- Maximum: 15 directors (can be increased by special resolution)

Woman Director Requirement:
Mandatory for:
- Listed companies
- Public companies with paid-up capital of ₹100 crore or more, OR turnover of ₹300 crore or more

Resident Director: At least 1 director must have stayed in India for total period of not less than 182 days in previous calendar year.

Independent Directors [Section 149(6)]:
Requirements for Listed Companies: At least 1/3rd of total directors
Requirements for certain Public Companies:
- Paid-up capital ≥ ₹10 crore, OR
- Turnover ≥ ₹100 crore, OR
- Outstanding loans/deposits/debentures ≥ ₹50 crore

Eligibility for Independent Director:
- Not related to promoters or directors
- No material/pecuniary relationship with company
- Not director in more than 20 companies (maximum 10 public companies)
- Holds office for 5 years, renewable once

Schedule IV: Code for Independent Directors (duties, rights, manner of appointment)`,
    keywords: 'board of directors, independent directors, woman director, resident director, schedule IV, listed companies',
    amendment: 'Companies (Amendment) Act 2019: Independent Directors can receive stock options in certain cases. SEBI mandated 50% independent directors for top 500 listed companies.',
  },
  {
    title: 'Section 135 - Corporate Social Responsibility',
    description: 'CSR obligations, eligible activities, CSR committee, and reporting requirements',
    level: 'EXECUTIVE',
    subject: 'Company Law',
    section: 'Section 135',
    act: 'Companies Act 2013',
    plainEnglish: 'Companies with certain financial thresholds must spend 2% of average net profits on CSR activities. They must form a CSR committee, make a CSR policy, and report on CSR activities in their Annual Report.',
    content: `Section 135 - Corporate Social Responsibility

Applicability (Any one criterion in preceding financial year):
- Net worth ≥ ₹500 crore, OR
- Turnover ≥ ₹1000 crore, OR
- Net profit ≥ ₹5 crore

CSR Obligation: Spend at least 2% of average net profits of 3 immediately preceding financial years.

CSR Committee [Section 135(1)]:
Composition:
- 3 or more directors (at least 1 independent director)
- Exception: Private companies not required to appoint independent director

Functions of CSR Committee:
1. Formulate and recommend CSR Policy
2. Recommend amount of expenditure
3. Monitor CSR Policy implementation

CSR Activities (Schedule VII):
- Eradicating hunger, poverty, malnutrition
- Promoting education
- Promoting gender equality
- Ensuring environmental sustainability
- Protection of national heritage
- Contribution to PM National Relief Fund
- Promotion of sports

Important Provisions (Post 2021 Amendment):
- Unspent CSR amount must be transferred to Schedule VII fund or Unspent CSR Account
- Ongoing projects: Transfer to Unspent CSR Account within 30 days of financial year end
- Non-ongoing projects: Transfer to fund specified in Schedule VII within 6 months

Penalty for Non-compliance:
- Company: Fine of ₹1 crore to ₹10 lakh (minimum)
- Officers in default: Fine + Imprisonment up to 3 years`,
    keywords: 'CSR, corporate social responsibility, Schedule VII, CSR committee, 2% net profit, unspent CSR',
    amendment: 'Companies (CSR Policy) Amendment Rules 2021 introduced mandatory transfer of unspent amounts. Impact assessment mandatory for projects ≥₹1 crore.',
  },
  {
    title: 'Section 177 - Audit Committee',
    description: 'Constitution, composition, powers and role of Audit Committee in companies',
    level: 'PROFESSIONAL',
    subject: 'Company Law',
    section: 'Section 177',
    act: 'Companies Act 2013',
    plainEnglish: 'Certain companies must have an Audit Committee as part of their Board. The committee oversees financial reporting, internal controls, audit processes, and related party transactions.',
    content: `Section 177 - Audit Committee

Applicability:
Every listed company + Unlisted public company with:
- Paid-up capital ≥ ₹10 crore, OR
- Turnover ≥ ₹100 crore, OR
- Outstanding loans/deposits ≥ ₹50 crore

Composition:
- Minimum 3 directors
- Majority must be independent directors
- Majority (including chairperson) must be able to read financial statements
- Chairperson present at AGM to answer shareholder queries

Powers of Audit Committee:
1. Call for comments of auditors about internal control systems
2. Discuss issues with internal and statutory auditors
3. Investigate any matter referred by Board
4. Seek information from employees
5. Obtain outside legal/professional advice
6. Secure attendance of outside experts

Mandatory Review Items:
1. Quarterly financial results
2. Related party transactions
3. Management discussion and analysis
4. Internal audit reports
5. Adequacy of internal financial controls
6. Utilization of IPO/FPO funds

Role in Auditor Appointment:
- Recommend appointment, remuneration, and terms of statutory auditors
- Approve related party transactions

Vigil Mechanism [Section 177(9)]:
Companies with audit committees must establish vigil mechanism (whistle blower policy)`,
    keywords: 'audit committee, independent directors, vigil mechanism, whistle blower, related party transactions, statutory auditor',
    amendment: 'SEBI LODR 2018 enhanced requirements for audit committees in listed companies including quarterly meetings and specific disclosures.',
  },
  {
    title: 'Section 185 - Loan to Directors',
    description: 'Prohibition and conditions for giving loans, guarantees, or security to directors and related parties',
    level: 'EXECUTIVE',
    subject: 'Company Law',
    section: 'Section 185',
    act: 'Companies Act 2013',
    plainEnglish: 'A company generally cannot give loans or provide security/guarantees to its directors or their relatives, or companies where directors have interest. This protects shareholders from directors misusing company funds.',
    content: `Section 185 - Loan to Directors (as amended by Companies Amendment Act 2017)

PROHIBITION: No company shall directly or indirectly advance any loan, guarantee, or security to:
- Any director of the company or its holding company
- Any partner or relative of such director
- Any firm in which such director or relative is a partner
- Any private company where such director is a director or member
- Any body corporate whose board is accustomed to act in accordance with director's directions

EXCEPTIONS (Permitted Transactions):
1. Ordinary Business: Loans in the ordinary course of business at rate not less than bank rate
2. Managing Director/Whole-time Director: As part of conditions of service (by special resolution or company policy)
3. Employees: Loans to employees under employees' scheme

PROCEDURE (After 2017 Amendment for Permitted Loans):
1. Pass special resolution in general meeting
2. Loans must be utilized by borrowing company for its principal business activity
3. Board resolution required
4. Register of Loans to be maintained

PUNISHMENT:
- Company: Fine ₹5 lakh to ₹25 lakh
- Directors/Officer in default: Imprisonment up to 6 months AND/OR fine ₹5 lakh to ₹25 lakh
- Director to whom loan is given: Imprisonment up to 6 months AND/OR fine ₹5 lakh to ₹25 lakh`,
    keywords: 'loan to directors, section 185, prohibition, guarantees, security, special resolution, managing director',
    amendment: 'Companies Amendment Act 2017 significantly liberalized Section 185 - reduced prohibition and allowed loans to WTD/MD under certain conditions.',
  },
  {
    title: 'Memorandum of Association (MOA)',
    description: 'Constitution, clauses, alteration procedures, and importance of MOA in company law',
    level: 'FOUNDATION',
    subject: 'Company Law',
    section: 'Section 4',
    act: 'Companies Act 2013',
    plainEnglish: "The MOA is the company's constitution - it defines the company's relationship with the outside world. It contains the company's name, state of registration, objectives, liability of members, and share capital.",
    content: `Memorandum of Association (MOA) - Section 4

The MOA is the charter/constitution of the company. It defines the company's relationship with the external world.

Clauses of MOA:
1. NAME CLAUSE:
   - Company name with Ltd/Pvt Ltd at end
   - Cannot be identical/similar to existing company
   - Cannot use prohibited words

2. REGISTERED OFFICE CLAUSE (SITUATION CLAUSE):
   - State where registered office is situated
   - Within 30 days of incorporation, actual address to be filed

3. OBJECTS CLAUSE:
   - Main objects of the company
   - Matters considered necessary in furtherance of objects
   Post-2013: Ultra Vires doctrine - acts beyond objects clause are void

4. LIABILITY CLAUSE:
   - Nature of liability of members
   - Limited by shares / Limited by guarantee / Unlimited

5. CAPITAL CLAUSE:
   - Authorized share capital
   - Division into shares of fixed amount

6. ASSOCIATION CLAUSE (Subscription Clause):
   - Declaration by subscribers
   - Minimum 2 subscribers (7 for public company)

ALTERATION OF MOA:
- Name: Special resolution + Central Government approval [Section 13]
- Registered Office:
  * Within city: Board resolution
  * Within state: Special resolution
  * Different state: Special resolution + NCLT approval
- Objects: Special resolution + File MGT-14 with ROC
- Capital: Ordinary resolution (increase) / Special resolution (reduce)`,
    keywords: 'MOA, memorandum of association, name clause, objects clause, liability clause, capital clause, alteration, ultra vires',
  },
  {
    title: 'SEBI LODR - Listing Obligations and Disclosure Requirements',
    description: 'Corporate governance requirements, disclosures, and compliance for listed companies under SEBI',
    level: 'PROFESSIONAL',
    subject: 'Securities Law',
    section: 'SEBI LODR 2015',
    act: 'SEBI (Listing Obligations and Disclosure Requirements) Regulations 2015',
    plainEnglish: 'SEBI LODR governs listed companies. It requires timely disclosures of material events, quarterly financial results, corporate governance reports, and sets standards for board composition and committee requirements.',
    content: `SEBI (Listing Obligations and Disclosure Requirements) Regulations, 2015

Key Governance Requirements:

BOARD COMPOSITION [Regulation 17]:
- Minimum 6 directors
- At least 1 woman director
- Non-executive directors: ≥50% of total directors
- Independent directors: ≥1/3rd (if non-executive chairperson), ≥50% (if executive/promoter chairperson)
- Top 500 companies (by market cap): Chairperson and MD/CEO must be separate persons

COMMITTEES:
1. Audit Committee [Regulation 18]: ≥3 directors, 2/3rd independent
2. Nomination & Remuneration Committee [Regulation 19]: ≥3 directors, 2/3rd independent
3. Stakeholders Relationship Committee [Regulation 20]: 1 independent director as chairperson
4. Risk Management Committee [Regulation 21]: For top 1000 companies

DISCLOSURES:
Continuous Disclosure [Regulation 30]:
- Material events/information within 24 hours
- Board meeting outcomes within 30 minutes

Quarterly Disclosures:
- Financial results within 45 days (quarterly) / 60 days (annual)
- Corporate Governance Report within 15 days from quarter end

RELATED PARTY TRANSACTIONS [Regulation 23]:
- Material RPTs require shareholders' approval (majority of public shareholders)
- All RPTs on arm's length basis
- Audit Committee prior approval

INSIDER TRADING: SEBI Prohibition of Insider Trading Regulations 2015
- Trading window closure during unpublished price sensitive information
- Designated persons must pre-clear trades`,
    keywords: 'SEBI, LODR, listed companies, corporate governance, independent directors, disclosures, related party transactions, insider trading',
    amendment: 'SEBI LODR Amendment 2018 and 2021 enhanced disclosure requirements and introduced virtual board meetings.',
  },
  {
    title: 'Insolvency and Bankruptcy Code 2016 (IBC) - Overview',
    description: 'Corporate Insolvency Resolution Process (CIRP), liquidation, and key stakeholders under IBC',
    level: 'PROFESSIONAL',
    subject: 'Economic Laws',
    section: 'IBC 2016',
    act: 'Insolvency and Bankruptcy Code 2016',
    plainEnglish: 'IBC provides a time-bound process (180 days) to resolve insolvency of companies. A financial/operational creditor or corporate debtor can initiate CIRP. The Resolution Professional manages the company during the process.',
    content: `Insolvency and Bankruptcy Code, 2016

KEY DEFINITIONS:
- Financial Creditor: Banks, debenture holders, bondholders
- Operational Creditor: Suppliers, employees, government dues
- Corporate Debtor: Company that owes money
- Resolution Professional (RP): Manages company during CIRP
- Committee of Creditors (CoC): Financial creditors who vote on resolution plan

CORPORATE INSOLVENCY RESOLUTION PROCESS (CIRP):

Initiation:
- Financial Creditor: Default of ₹1 crore [Section 7]
- Operational Creditor: Default of ₹1 crore after demand notice [Section 9]
- Corporate Debtor itself [Section 10]

CIRP Timeline:
- Admission by NCLT: 14 days
- CIRP Period: 180 days (extendable by 90 days with 66% CoC approval)
- Maximum time including litigation: 330 days (2019 amendment)

During CIRP - Moratorium [Section 14]:
- No suits/proceedings against corporate debtor
- No transfer/disposal of assets
- No enforcement of security interest
- Utilities cannot be cut off

Resolution Plan Approval:
- CoC approves with 66% voting share
- NCLT approval required
- If no plan: Liquidation order

LIQUIDATION:
- Assets distributed in priority:
  1. CIRP costs
  2. Secured creditors (financial)
  3. Employee wages (24 months)
  4. Unsecured financial creditors
  5. Government dues
  6. Other creditors
  7. Equity shareholders

NCLT: Adjudicating authority for corporates
NCLAT: Appellate authority`,
    keywords: 'IBC, insolvency, bankruptcy, CIRP, NCLT, moratorium, resolution plan, liquidation, Committee of Creditors, Resolution Professional',
    amendment: 'IBC Amendment 2019: Section 29A expanded, 330-day cap introduced. IBC Amendment 2020: Pre-packaged insolvency for MSMEs introduced.',
  },
  {
    title: 'Secretarial Audit Report - Form MR-3',
    description: 'Scope, applicability, procedure, and format of Secretarial Audit under Companies Act 2013',
    level: 'PROFESSIONAL',
    subject: 'Secretarial Practice',
    section: 'Section 204',
    act: 'Companies Act 2013',
    plainEnglish: 'Secretarial Audit is an independent verification of whether a company has complied with all applicable laws. It is done by a Company Secretary in Practice and reported in Form MR-3.',
    content: `Secretarial Audit - Section 204 of Companies Act, 2013

APPLICABILITY:
Mandatory for:
1. Every listed company
2. Every public company with paid-up share capital ≥ ₹50 crore
3. Every public company with turnover ≥ ₹250 crore
4. Every company having outstanding loans/borrowings ≥ ₹100 crore

SCOPE OF SECRETARIAL AUDIT:
Laws checked by Secretarial Auditor:
1. Companies Act 2013 and rules
2. SEBI Act and regulations (LODR, ICDR, Insider Trading, Takeover Code)
3. Depositories Act
4. FEMA (relating to FDI, ODI, External Commercial Borrowings)
5. Regulations under specific sectoral regulators (RBI, IRDAI, SEBI)

WHO CAN CONDUCT:
- Only a Company Secretary in Practice (PCS/ACS holding Certificate of Practice)
- Cannot be the same as the company's Whole-time CS

REPORTING (Form MR-3):
The report covers compliance with:
- Maintenance of registers and records
- Filing of forms and returns with ROC/RBI/SEBI
- Board meetings, committee meetings, AGM
- Issue of shares, debentures, securities
- Corporate actions (mergers, acquisitions, spin-offs)
- Related party transactions
- Directors' appointments and remunerations

QUALIFICATION IN REPORT:
- Auditor can give qualified/adverse opinion
- Must report any non-compliance with specific observation
- Attached to Directors' Report

PENALTY for Non-compliance:
- Company: Fine ₹1 lakh to ₹5 lakh
- Officers in default: Fine ₹1 lakh to ₹5 lakh`,
    keywords: 'secretarial audit, MR-3, Section 204, PCS, company secretary in practice, compliance, listed company',
    amendment: 'ICSI issued revised Guidance Note on Secretarial Audit in 2020. SEBI mandated Annual Secretarial Compliance Report for listed entities.',
  },
];

const questions = [
  {
    type: 'MCQ',
    level: 'FOUNDATION',
    subject: 'Company Law',
    difficulty: 'EASY',
    question: 'What is the minimum number of members required to form a Private Company?',
    options: JSON.stringify(['1', '2', '7', '10']),
    answer: '2',
    explanation: 'A Private Company requires a minimum of 2 members (subscribers to Memorandum of Association) under Section 3 of Companies Act, 2013. Maximum is 200 members.',
    year: 2022,
  },
  {
    type: 'MCQ',
    level: 'FOUNDATION',
    subject: 'Company Law',
    difficulty: 'EASY',
    question: 'What is the maximum number of members in a Private Company?',
    options: JSON.stringify(['50', '100', '200', 'Unlimited']),
    answer: '200',
    explanation: 'Section 2(68) of Companies Act, 2013 defines Private Company as one that restricts its membership to 200. However, employees/former employees who are members are excluded from this count.',
    year: 2022,
  },
  {
    type: 'MCQ',
    level: 'EXECUTIVE',
    subject: 'Company Law',
    difficulty: 'MEDIUM',
    question: 'Under Section 96, the Annual General Meeting of a company must be held within how many months from the end of the first financial year?',
    options: JSON.stringify(['6 months', '9 months', '12 months', '18 months']),
    answer: '9 months',
    explanation: 'Section 96(1) of Companies Act, 2013 provides that every company must hold its first AGM within 9 months from the close of its first financial year. For subsequent years, it is 6 months.',
    year: 2021,
  },
  {
    type: 'MCQ',
    level: 'EXECUTIVE',
    subject: 'Company Law',
    difficulty: 'MEDIUM',
    question: 'Which of the following is NOT an ordinary business at an Annual General Meeting?',
    options: JSON.stringify([
      'Consideration of financial statements',
      'Declaration of dividend',
      'Appointment of auditors',
      'Alteration of Memorandum of Association',
    ]),
    answer: 'Alteration of Memorandum of Association',
    explanation: 'Section 102 defines ordinary business at AGM as: (1) financial statements, (2) declaration of dividend, (3) appointment/re-appointment of directors, (4) appointment of auditors. Alteration of MOA is special business.',
    year: 2020,
  },
  {
    type: 'MCQ',
    level: 'EXECUTIVE',
    subject: 'Company Law',
    difficulty: 'HARD',
    question: 'Under Section 135, a company must spend CSR amount if its net profit exceeds:',
    options: JSON.stringify(['₹1 crore', '₹5 crore', '₹10 crore', '₹50 crore']),
    answer: '₹5 crore',
    explanation: 'Section 135(1) applies to companies with net profit of ₹5 crore or more (OR net worth ≥ ₹500 crore OR turnover ≥ ₹1000 crore). Such companies must spend 2% of average net profit of preceding 3 years on CSR.',
    year: 2023,
  },
  {
    type: 'MCQ',
    level: 'PROFESSIONAL',
    subject: 'Securities Law',
    difficulty: 'HARD',
    question: 'Under SEBI LODR, material events must be disclosed within:',
    options: JSON.stringify(['12 hours', '24 hours', '48 hours', '7 days']),
    answer: '24 hours',
    explanation: 'Regulation 30 of SEBI LODR 2015 requires listed companies to disclose material events/information to stock exchanges within 24 hours of occurrence. For certain events like board meeting outcomes, the timeline is 30 minutes.',
    year: 2022,
  },
  {
    type: 'MCQ',
    level: 'PROFESSIONAL',
    subject: 'Economic Laws',
    difficulty: 'HARD',
    question: 'What is the maximum time limit for CIRP under IBC including litigation time?',
    options: JSON.stringify(['180 days', '270 days', '330 days', '365 days']),
    answer: '330 days',
    explanation: 'Per the IBC Amendment Act 2019, the total time for CIRP including litigation period cannot exceed 330 days. The base period is 180 days, extendable by 90 days with 66% CoC approval.',
    year: 2023,
  },
  {
    type: 'MCQ',
    level: 'FOUNDATION',
    subject: 'Company Law',
    difficulty: 'EASY',
    question: 'The Memorandum of Association is also known as:',
    options: JSON.stringify([
      "Charter of the company",
      "Internal constitution",
      "Articles of Association",
      "Prospectus",
    ]),
    answer: 'Charter of the company',
    explanation: "MOA is called the 'Charter' of the company as it defines the company's relationship with the outside world and its fundamental objectives. Articles of Association is called the internal constitution governing members inter se.",
    year: 2021,
  },
  {
    type: 'MCQ',
    level: 'EXECUTIVE',
    subject: 'Company Law',
    difficulty: 'MEDIUM',
    question: 'For Secretarial Audit under Section 204, a public company is required if its paid-up capital is:',
    options: JSON.stringify(['≥ ₹10 crore', '≥ ₹25 crore', '≥ ₹50 crore', '≥ ₹100 crore']),
    answer: '≥ ₹50 crore',
    explanation: 'Section 204(1) read with Rule 9 of Companies (Appointment and Remuneration) Rules 2014 requires Secretarial Audit for every public company with paid-up share capital ≥ ₹50 crore OR turnover ≥ ₹250 crore.',
    year: 2022,
  },
  {
    type: 'MCQ',
    level: 'EXECUTIVE',
    subject: 'Company Law',
    difficulty: 'MEDIUM',
    question: 'Under Section 149, which type of company is exempt from appointing an Independent Director?',
    options: JSON.stringify([
      'Public company with ₹10 crore paid-up capital',
      'Listed company',
      'Private company',
      'OPC'
    ]),
    answer: 'Private company',
    explanation: 'Section 149(4) requires independent directors only for listed companies and certain public companies (₹10 crore paid-up capital/₹100 crore turnover/₹50 crore loans). Private companies and OPCs are generally exempt.',
    year: 2021,
  },
];

const documents = [
  {
    title: 'Board Resolution - Appointment of Company Secretary',
    category: 'RESOLUTION',
    description: 'Standard board resolution for appointing a Whole-Time Company Secretary',
    tags: 'appointment, company secretary, CS, whole-time, board resolution',
    template: `CERTIFIED TRUE COPY OF THE RESOLUTION PASSED AT THE MEETING OF THE BOARD OF DIRECTORS OF [COMPANY NAME] HELD ON [DATE] AT [TIME] AT [PLACE]

RESOLVED THAT pursuant to the provisions of Section 203 of the Companies Act, 2013 read with Rule 8 of the Companies (Appointment and Remuneration of Managerial Personnel) Rules, 2014, and other applicable provisions, if any, the Board of Directors hereby appoints Mr./Ms. [NAME], [Membership No.], a member of the Institute of Company Secretaries of India, as the Whole-Time Company Secretary of the Company, with effect from [DATE], on the following terms and conditions:

a) Designation: Company Secretary & Compliance Officer
b) Remuneration: ₹[AMOUNT] per month (CTC)
c) Notice Period: [PERIOD]
d) Other Terms: As per Company's HR policy

RESOLVED FURTHER THAT the Board of Directors hereby authorizes Mr./Ms. [NAME], Company Secretary, to file the necessary e-form with the Ministry of Corporate Affairs within the prescribed time limit.

FOR AND ON BEHALF OF THE BOARD
[COMPANY NAME]

[DIRECTOR NAME]          [DIRECTOR NAME]
Director                  Director
DIN: XXXXXXXX            DIN: XXXXXXXX
Date: [DATE]
Place: [PLACE]

Certified that the above is a true copy of the resolution passed by the Board of Directors of the Company.

[COMPANY SECRETARY NAME]
Company Secretary
Membership No.: [NUMBER]`,
  },
  {
    title: 'Notice of Annual General Meeting',
    category: 'NOTICE',
    description: 'Standard AGM notice with ordinary and special business items',
    tags: 'AGM, annual general meeting, notice, ordinary business, special business',
    template: `[COMPANY NAME LIMITED]
[CIN: XXXXXXXXXXXXXXXXXX]
[Registered Office: ADDRESS]

NOTICE

NOTICE is hereby given that the [Xth] Annual General Meeting of the members of [COMPANY NAME LIMITED] will be held on [DAY], [DATE] at [TIME] at [VENUE / through Video Conferencing (VC)/ Other Audio Visual Means (OAVM)] to transact the following businesses:

ORDINARY BUSINESS:

1. ADOPTION OF FINANCIAL STATEMENTS
To receive, consider and adopt the Audited Financial Statements (including Audited Consolidated Financial Statements) of the Company for the financial year ended [DATE], together with the Reports of the Board of Directors and Auditors thereon.

2. DECLARATION OF DIVIDEND
To declare a final dividend of ₹[AMOUNT] per equity share of ₹[FACE VALUE] each for the financial year ended [DATE].

3. RE-APPOINTMENT OF DIRECTOR
To appoint a Director in place of [DIRECTOR NAME] (DIN: XXXXXXXX), who retires by rotation and being eligible, offers himself/herself for re-appointment.

4. RATIFICATION OF AUDITORS' REMUNERATION
To ratify the remuneration of M/s. [AUDITOR FIRM], Chartered Accountants (FRN: XXXXXX), as Statutory Auditors for FY [YEAR-YEAR].

SPECIAL BUSINESS:

5. APPOINTMENT OF INDEPENDENT DIRECTOR
To consider and, if thought fit, to pass with or without modification(s), the following resolution as an Ordinary Resolution:
"RESOLVED THAT [NAME] (DIN: XXXXXXXX), who was appointed as an Additional Director...

By Order of the Board
For [COMPANY NAME LIMITED]

[COMPANY SECRETARY NAME]
Company Secretary
Membership No.: [NUMBER]
Date: [DATE]
Place: [PLACE]

NOTES:
1. A MEMBER ENTITLED TO ATTEND AND VOTE AT THE AGM IS ENTITLED TO APPOINT A PROXY...
2. Corporate Members are requested to send a certified copy of Board Resolution...
3. Register of Members will be closed from [DATE] to [DATE]...`,
  },
  {
    title: 'Minutes of Board Meeting',
    category: 'MINUTES',
    description: 'Standard format for recording minutes of a Board of Directors meeting',
    tags: 'minutes, board meeting, directors, resolution, attendance',
    template: `MINUTES OF THE [Xth] MEETING OF THE BOARD OF DIRECTORS OF [COMPANY NAME LIMITED] HELD ON [DATE] AT [TIME] AT THE REGISTERED OFFICE / [VENUE]

DIRECTORS PRESENT:
1. Mr./Ms. [NAME]  - Chairperson/Managing Director (DIN: XXXXXXXX)
2. Mr./Ms. [NAME]  - Independent Director (DIN: XXXXXXXX)
3. Mr./Ms. [NAME]  - Non-Executive Director (DIN: XXXXXXXX)

IN ATTENDANCE:
1. Mr./Ms. [NAME]  - Company Secretary
2. Mr./Ms. [NAME]  - Chief Financial Officer

[Note: Meeting was attended through Video Conferencing by: Mr./Ms. [NAME]]

LEAVE OF ABSENCE:
Mr./Ms. [NAME] - Director (sought leave of absence)

The Chairperson confirmed that requisite quorum was present and called the meeting to order at [TIME].

ITEM 1: CONFIRMATION OF MINUTES OF PREVIOUS BOARD MEETING
The Minutes of the [X-1th] Board Meeting held on [PREVIOUS DATE] were read and confirmed by the Board.

RESOLUTION:
"RESOLVED THAT the minutes of the [X-1th] meeting of the Board of Directors held on [DATE] be and are hereby confirmed and signed."

ITEM 2: REVIEW OF FINANCIAL PERFORMANCE
The CFO presented the quarterly financial results. The Board reviewed and discussed the same in detail.

[Add more items as required]

There being no other business, the Meeting concluded at [TIME].

[CHAIRPERSON SIGNATURE]
Chairperson
[NAME]
DIN: XXXXXXXX

[COMPANY SECRETARY]
Company Secretary
Membership No.: [NUMBER]`,
  },
  {
    title: 'Annual Return - Secretarial Compliance Checklist',
    category: 'CHECKLIST',
    description: 'Comprehensive checklist for annual compliance under Companies Act 2013',
    tags: 'annual return, compliance, checklist, ROC filing, MGT-7, AOC-4',
    template: `ANNUAL COMPLIANCE CHECKLIST - COMPANIES ACT 2013

COMPANY: [NAME]  |  CIN: [NUMBER]  |  FY: [YEAR]

═══════════════════════════════════════════
SECTION A: MANDATORY ROC FILINGS
═══════════════════════════════════════════

□ MGT-7A / MGT-7: Annual Return
  Due Date: Within 60 days of AGM
  Status: [ ] Filed  [ ] Pending
  Filing Date: ________

□ AOC-4 / AOC-4 XBRL: Financial Statements
  Due Date: Within 30 days of AGM (OPC: 180 days)
  Status: [ ] Filed  [ ] Pending

□ ADT-1: Auditor Appointment
  Due Date: 15 days from AGM
  Status: [ ] Filed  [ ] Pending

□ DIR-12: Changes in Directors
  Due Date: Within 30 days of change
  Status: [ ] Filed  [ ] Pending

□ MGT-14: Resolution Filing (Special/Ordinary)
  Due Date: Within 30 days of passing
  Status: [ ] Filed  [ ] Pending

═══════════════════════════════════════════
SECTION B: BOOKS AND REGISTERS
═══════════════════════════════════════════

□ Register of Members (MGT-1) - Updated
□ Register of Directors (MBP-1) - Updated
□ Register of Loans (MBP-2) - Updated
□ Register of Charges (CHG-7) - Updated
□ Minutes Book - Board Meetings - Signed
□ Minutes Book - General Meetings - Signed
□ Attendance Registers - Maintained

═══════════════════════════════════════════
SECTION C: BOARD MEETINGS
═══════════════════════════════════════════

□ Minimum 4 Board Meetings held
□ Gap between meetings ≤ 120 days
□ Proper notice given (7 days minimum)
□ Quorum maintained
□ Minutes signed within 30 days

═══════════════════════════════════════════
SECTION D: AUDIT COMPLIANCE
═══════════════════════════════════════════

□ Statutory Audit completed
□ Secretarial Audit (if applicable) - Form MR-3
□ Internal Audit conducted
□ Annual Report prepared and sent

Prepared by: _______________
Date: _______________`,
  },
  {
    title: 'Board Resolution - Opening of Bank Account',
    category: 'RESOLUTION',
    description: 'Board resolution for opening a new bank account for the company',
    tags: 'bank account, board resolution, banking, signatory',
    template: `CERTIFIED TRUE COPY OF THE RESOLUTION PASSED AT THE MEETING OF THE BOARD OF DIRECTORS OF [COMPANY NAME] HELD ON [DATE]

RESOLVED THAT pursuant to Section 179 of the Companies Act, 2013, the Company be and is hereby authorized to open a Current Account / Savings Account / Overdraft Account with [BANK NAME], [BRANCH NAME & ADDRESS].

RESOLVED FURTHER THAT the account shall be operated by the following authorized signatories:

Single Signatory (for transactions up to ₹[AMOUNT]):
- Mr./Ms. [NAME], [Designation]

Joint Signatories (for transactions above ₹[AMOUNT]):
- Any two of the following jointly:
  1. Mr./Ms. [NAME], [Designation]
  2. Mr./Ms. [NAME], [Designation]
  3. Mr./Ms. [NAME], [Designation]

RESOLVED FURTHER THAT the Company Secretary be and is hereby authorized to provide certified copy of this resolution along with the required documents to the Bank for the purpose of opening the account.

FOR AND ON BEHALF OF THE BOARD
[COMPANY NAME]

[DIRECTOR NAME]              [DIRECTOR NAME]
Director                      Director
DIN: XXXXXXXX                DIN: XXXXXXXX

[COMPANY SECRETARY]
Company Secretary
Membership No.: [NUMBER]`,
  },
  {
    title: 'Secretarial Audit Report - Form MR-3',
    category: 'AUDIT_REPORT',
    description: 'Template for Secretarial Audit Report in Form MR-3',
    tags: 'secretarial audit, MR-3, Section 204, PCS, compliance report',
    template: `FORM NO. MR - 3
SECRETARIAL AUDIT REPORT
FOR THE FINANCIAL YEAR ENDED [DATE]
[Pursuant to Section 204(1) of the Companies Act, 2013 and Rule 9 of the Companies (Appointment and Remuneration Personnel) Rules, 2014]

To,
The Members,
[COMPANY NAME LIMITED]
[REGISTERED OFFICE ADDRESS]

We have conducted the secretarial audit of the compliance of applicable statutory provisions and the adherence to good corporate practices by [COMPANY NAME LIMITED] (hereinafter called the Company). Secretarial Audit was conducted in a manner that provided us a reasonable basis for evaluating the corporate conducts/statutory compliances and expressing our opinion thereon.

Based on our verification of the Company's books, papers, minute books, forms and returns filed and other records maintained by the Company and also the information provided by the Company, its officers, agents and authorized representatives during the conduct of secretarial audit, we hereby report that in our opinion, the Company has, during the audit period covering the financial year ended [DATE], complied with the statutory provisions listed hereunder and also that the Company has proper Board-processes and compliance-mechanism in place to the extent, in the manner and subject to the reporting made hereinafter:

We have examined the books, papers, minute books, forms and returns filed and other records maintained by [COMPANY NAME LIMITED] for the financial year ended on [DATE] according to the provisions of:

(i) The Companies Act, 2013 (the Act) and the rules made thereunder;
(ii) The Securities Contracts (Regulation) Act, 1956 and the rules made thereunder;
(iii) The Depositories Act, 1996 and the Regulations and Bye-laws framed thereunder;
(iv) Foreign Exchange Management Act, 1999 and the rules and regulations made thereunder to the extent of Foreign Direct Investment and Overseas Direct Investment and External Commercial Borrowings;
(v) The following Regulations and Guidelines prescribed under the Securities and Exchange Board of India Act, 1992:
    a. SEBI (LODR) Regulations, 2015
    b. SEBI (Prohibition of Insider Trading) Regulations, 2015
    c. SEBI (Issue of Capital and Disclosure Requirements) Regulations, 2018
    d. SEBI (Substantial Acquisition of Shares and Takeovers) Regulations, 2011

We have also examined compliance with the applicable clauses of the following:
(i) Secretarial Standards issued by The Institute of Company Secretaries of India.

During the period under review the Company has complied with the provisions of the Act, Rules, Regulations, Guidelines, Standards, etc. mentioned above.

[OBSERVATIONS / QUALIFICATIONS, if any:]

We further report that:
The Board of Directors of the Company is duly constituted with proper balance of Executive Directors, Non-Executive Directors and Independent Directors. The changes in the composition of the Board of Directors that took place during the period under review were carried out in compliance with the provisions of the Act.

Adequate notice is given to all directors to schedule the Board Meetings, agenda and detailed notes on agenda were sent at least seven days in advance, and a system exists for seeking and obtaining further information and clarifications on the agenda items before the meeting and for meaningful participation at the meeting.

Majority decision is carried through while the dissenting members' views are captured and recorded as part of the minutes.

We further report that there are adequate systems and processes in the company commensurate with the size and operations of the company to monitor and ensure compliance with applicable laws, rules, regulations and guidelines.

For [PCS FIRM NAME]
Company Secretaries

[NAME]
Partner/Proprietor
FCS/ACS: XXXXXXXX
CP No.: XXXXXXXX
Date: [DATE]
Place: [PLACE]

Note: This report is to be read with our letter of even date which is annexed as Annexure A and Forms an integral part of this report.`,
  },
];

async function main() {
  console.log('Seeding database...');

  await prisma.topic.deleteMany();
  await prisma.question.deleteMany();
  await prisma.document.deleteMany();

  const createdTopics = await Promise.all(
    topics.map(t => prisma.topic.create({ data: t }))
  );
  console.log(`Created ${createdTopics.length} topics`);

  const createdQuestions = await Promise.all(
    questions.map(q =>
      prisma.question.create({
        data: {
          ...q,
          topicId: createdTopics[Math.floor(Math.random() * createdTopics.length)].id,
        },
      })
    )
  );
  console.log(`Created ${createdQuestions.length} questions`);

  const createdDocs = await Promise.all(
    documents.map(d => prisma.document.create({ data: d }))
  );
  console.log(`Created ${createdDocs.length} documents`);

  console.log('Seeding complete!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
