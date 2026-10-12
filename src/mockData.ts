import type { ChatSession, PinnedFolder } from './types';

export const INITIAL_FOLDERS: PinnedFolder[] = [
  { id: 'schemes', name: 'Government Schemes', color: '#38bdf8', iconName: 'FolderCheck', count: 14 },
  { id: 'education', name: 'Education', color: '#fbbf24', iconName: 'GraduationCap', count: 8 },
  { id: 'healthcare', name: 'Healthcare', color: '#f43f5e', iconName: 'HeartPulse', count: 6 },
  { id: 'housing', name: 'Housing', color: '#ec4899', iconName: 'Home', count: 5 },
  { id: 'agriculture', name: 'Agriculture', color: '#10b981', iconName: 'Sprout', count: 11 },
];

export const INITIAL_CHATS: ChatSession[] = [
  {
    id: 'chat-1',
    title: 'Find housing schemes for my family',
    timeGroup: 'Today',
    preview: 'Exploring PMAY-Urban subsidy and income eligibility categories...',
    updatedAt: '10:15 AM',
    messages: [
      {
        id: 'm-1',
        sender: 'user',
        timestamp: '10:14 AM',
        content: 'Find housing schemes for my family. We are living in Pune and belong to the MIG category.',
      },
      {
        id: 'm-2',
        sender: 'assistant',
        timestamp: '10:15 AM',
        content: `### Pradhan Mantri Awas Yojana (PMAY-Urban 2.0) & Maharashtra MHADA

Based on your family profile (Middle Income Group in Pune, Maharashtra), here are the key government housing assistance avenues:

1. **PMAY-U 2.0 (Interest Subsidy Scheme)**:
   - **Eligibility:** Annual household income between ₹6 Lakh – ₹18 Lakh with no prior pucca house owned across India in the family name.
   - **Subsidy Benefit:** Up to ₹1.80 Lakh direct interest subsidy over a 5-year repayment tenure for eligible home loans.
   - **Female Co-ownership:** Mandatory or encouraged in registry documentation for urban beneficiaries.

2. **MHADA Pune Housing Lottery (PMAY Concession)**:
   - Periodical computerised draws for lottery tenements across Pune Metro region (Wakad, Hinjawadi, Chakan).
   - Additional ₹2.5 Lakh direct central-state subsidy credited against the unit base cost if selected under the affordable housing scheme.

#### Recommended Next Steps:
- Verify that Aadhaar numbers for all adult family members are linked to current bank accounts.
- Download the self-attested Income Certificate from Aaple Sarkar portal.`,
        citations: [
          {
            id: 'c-1',
            title: 'PMAY-U 2.0 Operational Guidelines',
            department: 'Ministry of Housing & Urban Affairs (MoHUA)',
            documentType: 'Official Notification (Gazette)',
            badge: 'Verified MoHUA',
          },
          {
            id: 'c-2',
            title: 'MHADA Lottery & Citizen Allotment Rules',
            department: 'Maharashtra Housing & Area Development Authority',
            documentType: 'Citizen Citizen Handbook',
            badge: 'MahaGov Portal',
          },
        ],
        followUps: [
          'What documents are needed for Aaple Sarkar income certificate?',
          'What is the maximum loan tenure under PMAY-U 2.0?',
          'How do I check if my Aadhaar is linked to NPCI mapper?',
        ],
        isDemo: true,
      },
    ],
  },
  {
    id: 'chat-2',
    title: 'Scholarships for engineering students',
    timeGroup: 'Today',
    preview: 'MahaDBT Rajarshi Shahu Maharaj fee reimbursement criteria...',
    updatedAt: '09:20 AM',
    messages: [
      {
        id: 'm-3',
        sender: 'user',
        timestamp: '09:19 AM',
        content: 'What scholarships are available for B.Tech students in Maharashtra with family income under 8 lakhs?',
      },
      {
        id: 'm-4',
        sender: 'assistant',
        timestamp: '09:20 AM',
        content: `### Scholarships for Engineering / Technical Education (Maharashtra)

For undergraduate engineering students with annual family income below ₹8,00,000, two major schemes provide substantial financial relief:

1. **Rajarshi Chhatrapati Shahu Maharaj Shikshan Shulkh Shishyavrutti Yojna (EBC)**:
   - **Coverage:** 50% Tuition Fee & 50% Exam Fee waiver for Open/General/EWS category students admitted through CAP rounds.
   - **Income Ceiling:** Up to ₹8 Lakh per annum certified by Tahsildar.
   - **Portal:** MahaDBT State Scholarship Portal.

2. **Dr. Panjabrao Deshmukh Vasatigruh Nirvah Bhatta Yojna (Hostel Allowance)**:
   - **Allowance:** ₹30,000/year (for Mumbai/Pune/Nagpur) or ₹20,000/year for other districts for hostel and mess sustenance for children of registered non-salaried farmers or low-income parents.

3. **AICTE Pragati / Saksham Scholarships (Central)**:
   - ₹50,000 per annum support for eligible female engineering students and specially-abled students admitted into technical institutions.`,
        citations: [
          {
            id: 'c-3',
            title: 'MahaDBT Technical Education Post-Matric Directive',
            department: 'Higher & Technical Education Dept, Govt of Maharashtra',
            documentType: 'Scheme GR No. 2024-ENG-08',
            badge: 'MahaDBT Official',
          },
        ],
        followUps: [
          'What is the CAP allotment letter requirement for EBC?',
          'Can private college students apply for MahaDBT?',
        ],
        isDemo: true,
      },
    ],
  },
  {
    id: 'chat-3',
    title: 'Documents needed for a government benefit',
    timeGroup: 'Yesterday',
    preview: 'Standard KYC, Domicile and Ration Card checklist...',
    updatedAt: 'Yesterday 4:10 PM',
    messages: [
      {
        id: 'm-5',
        sender: 'user',
        timestamp: 'Yesterday 4:08 PM',
        content: 'What is the standard document checklist required for general state welfare benefits?',
      },
      {
        id: 'm-6',
        sender: 'assistant',
        timestamp: 'Yesterday 4:10 PM',
        content: `### Primary Documentation Checklist for Indian Citizen Welfare Schemes

Most state and central government portals require this three-tier verification structure:

1. **Identity & Age Verification**:
   - Aadhaar Card (Must have active mobile number linked for OTP/e-KYC).
   - Voter ID / PAN Card / Birth Certificate.

2. **Proof of Residence / Domicile**:
   - Domicile Certificate issued by Revenue Authority (Sub-Divisional Magistrate / Tahsildar).
   - Electricity Bill / Registered Rent Agreement / Smart Ration Card.

3. **Financial & Socio-Economic Certification**:
   - Current Year Income Certificate issued by competent Revenue Authority (Form 16 alone is often not accepted for government subsidies).
   - Caste / Category Certificate (Non-Creamy Layer Certificate valid for current financial year if OBC/VJNT/SBC).
   - Bank Passbook with active IFSC code and NPCI Direct Benefit Transfer (DBT) enablement.`,
        citations: [
          {
            id: 'c-4',
            title: 'Standard Verification Protocols for Direct Benefit Transfer (DBT)',
            department: 'DBT Mission, Cabinet Secretariat, Govt of India',
            documentType: 'Citizen Verification Framework',
            badge: 'DBT Mission',
          },
        ],
        followUps: [
          'How do I check if my bank account has DBT active?',
          'Can DigiLocker documents be submitted directly?',
        ],
        isDemo: true,
      },
    ],
  },
  {
    id: 'chat-4',
    title: 'Maharashtra farmer assistance schemes',
    timeGroup: 'Earlier',
    preview: 'Namo Shetkari Mahasanman Nidhi and drip irrigation subsidy overview...',
    updatedAt: 'Oct 08, 2026',
    messages: [
      {
        id: 'm-7',
        sender: 'user',
        timestamp: 'Oct 08, 11:20 AM',
        content: 'Tell me about Maharashtra state farmer assistance schemes besides PM-KISAN.',
      },
      {
        id: 'm-8',
        sender: 'assistant',
        timestamp: 'Oct 08, 11:22 AM',
        content: `### Maharashtra Farmer Welfare Initiatives

1. **Namo Shetkari Mahasanman Nidhi Yojana (NSMNY)**:
   - Provides an additional ₹6,000 annual installment to eligible farmers, paired alongside the Central PM-KISAN ₹6,000, totaling ₹12,000 annually in 3 installments.
   - Credit directly into the beneficiary's Aadhaar-seeded bank account.

2. **MahaDBT Dr. Babasaheb Ambedkar / Magel Tyala Shettale (Farm Ponds)**:
   - Subsidy up to ₹75,000 for digging plastic-lined farm ponds to ensure water security during dry spells.

3. **Pradhan Mantri Krishi Sinchayee Yojana (Micro-Irrigation)**:
   - Up to 80% subsidy for small & marginal farmers for installing drip and sprinkler systems.`,
        citations: [
          {
            id: 'c-5',
            title: 'Namo Shetkari Guidelines & DBT Directives',
            department: 'Agriculture Department, Government of Maharashtra',
            documentType: 'Official Resolution',
            badge: 'Krishi Vibhag',
          },
        ],
        followUps: [
          'How do I check my 7/12 extract online for Namo Shetkari?',
          'What is the e-KYC deadline for the next installment?',
        ],
        isDemo: true,
      },
    ],
  },
];

export const WELCOME_SUGGESTIONS = [
  {
    id: 's-1',
    title: 'Explore Government Schemes',
    description: 'Discover benefits and assistance available to you.',
    prompt: 'Can you show me the most impactful central and state government schemes available for families in 2026?',
  },
  {
    id: 's-2',
    title: 'Check My Eligibility',
    description: 'Answer a few questions to explore schemes that may fit your situation.',
    prompt: 'I want to check my eligibility for government assistance. Please guide me through the criteria.',
  },
  {
    id: 's-3',
    title: 'Find Required Documents',
    description: 'Understand which documents are commonly needed for an application.',
    prompt: 'What documents do I need to prepare before applying for a government scheme or certificate?',
  },
  {
    id: 's-4',
    title: 'Education & Scholarships',
    description: 'Explore financial assistance and scholarship opportunities for students.',
    prompt: 'What government scholarships and fee-waiver programs are available for college and technical students?',
  },
];
