import type { SchemeItem, Citation } from '../types';

export const SCHEMES_DATA: SchemeItem[] = [
  {
    id: 'sch-1',
    name: 'Pradhan Mantri Awas Yojana (PMAY-U 2.0)',
    hindiName: 'प्रधानमंत्री आवास योजना (शहरी)',
    category: 'Housing',
    level: 'Central-State',
    benefit: 'Up to ₹1.80 Lakh interest subsidy over 5 years on housing loans',
    eligibility: 'EWS/LIG/MIG families with annual income up to ₹18 Lakhs. No existing pucca house.',
    documents: ['Aadhaar Card', 'Tahsildar Income Certificate', 'Bank Passbook (NPCI linked)', 'Affidavit of No Pucca House'],
    department: 'Ministry of Housing and Urban Affairs (MoHUA)',
  },
  {
    id: 'sch-2',
    name: 'Rajarshi Chhatrapati Shahu Maharaj EBC Scholarship',
    hindiName: 'राजर्षी छत्रपती शाहू महाराज शिक्षण शुल्क शिष्यवृत्ती',
    category: 'Education',
    level: 'State',
    benefit: '50% Tuition Fee & 50% Exam Fee waiver for higher/technical education',
    eligibility: 'Open/General/EWS category students admitted through CAP round. Family income under ₹8 Lakh.',
    documents: ['CAP Allotment Letter', 'Tahsildar Income Certificate', 'Domicile Certificate', 'College Bonafide'],
    department: 'Higher & Technical Education Department, Maharashtra',
  },
  {
    id: 'sch-3',
    name: 'Ayushman Bharat PM-JAY',
    hindiName: 'आयुष्मान भारत प्रधानमंत्री जन आरोग्य योजना',
    category: 'Healthcare',
    level: 'Central',
    benefit: 'Cashless hospitalisation coverage up to ₹5,00,000 per family per year',
    eligibility: 'Identified families based on Socio-Economic Caste Census (SECC) deprivation criteria.',
    documents: ['Ayushman Golden Card', 'Aadhaar Card', 'Ration Card'],
    department: 'National Health Authority (NHA)',
  },
  {
    id: 'sch-4',
    name: 'Namo Shetkari Mahasanman Nidhi Yojana',
    hindiName: 'नमो शेतकरी महासन्मान निधी योजना',
    category: 'Agriculture',
    level: 'State',
    benefit: 'Direct transfer of ₹6,000 per year (added on top of Central PM-KISAN ₹6,000)',
    eligibility: 'All landholder farmer families having cultivable landholding in Maharashtra with verified e-KYC.',
    documents: ['7/12 & 8A Land Extract', 'Aadhaar Card', 'DBT Enabled Bank Account'],
    department: 'Agriculture Department, Government of Maharashtra',
  },
  {
    id: 'sch-5',
    name: 'PM Vishwakarma Yojana',
    hindiName: 'पीएम विश्वकर्मा योजना',
    category: 'Financial',
    level: 'Central',
    benefit: 'Collateral-free enterprise credit up to ₹3 Lakh at 5% interest + ₹15,000 toolkit grant',
    eligibility: 'Traditional artisans and craftspeople working with their hands (18 specified trades).',
    documents: ['Aadhaar Card', 'Trade Skill Certificate', 'Bank Account Details', 'Ration Card'],
    department: 'Ministry of Micro, Small and Medium Enterprises (MSME)',
  },
  {
    id: 'sch-6',
    name: 'Dr. Panjabrao Deshmukh Vasatigruh Nirvah Bhatta',
    hindiName: 'डॉ. पंजाबराव देशमुख वसतिगृह निर्वाह भत्ता योजना',
    category: 'Education',
    level: 'State',
    benefit: 'Hostel sustenance allowance of up to ₹30,000/year for professional courses',
    eligibility: 'Children of registered small landholder farmers or registered agricultural laborers.',
    documents: ['Alpabhudharak Farmer Certificate / Labour Certificate', 'Hostel Admission Receipt', 'Income Proof'],
    department: 'Directorate of Technical Education, Maharashtra',
  },
];

export const WELCOME_SUGGESTIONS = [
  {
    id: 's-1',
    title: 'Explore Government Schemes',
    description: 'Discover benefits and assistance programs available to Indian citizens.',
    prompt: 'What central and state government schemes are currently open for application in 2026?',
  },
  {
    id: 's-2',
    title: 'Check My Eligibility',
    description: 'Answer a few simple questions to discover schemes matching your income and region.',
    prompt: 'I want to check which government assistance schemes I am eligible for based on my family profile.',
  },
  {
    id: 's-3',
    title: 'Find Required Documents',
    description: 'Review common documentation checklists to prepare verified applications.',
    prompt: 'What standard documents and certificates do I need to prepare before applying for state welfare benefits?',
  },
  {
    id: 's-4',
    title: 'Education & Scholarships',
    description: 'Explore fee-waivers and financial assistance opportunities for higher education.',
    prompt: 'What government scholarships and fee reimbursements are available for college students in Maharashtra?',
  },
];

export function getAssistantResponse(prompt: string): { content: string; citations: Citation[]; followUps: string[] } {
  const p = prompt.toLowerCase();

  if (p.includes('scholarship') || p.includes('education') || p.includes('student') || p.includes('college') || p.includes('fee')) {
    return {
      content: `### Higher Education Scholarships & Assistance Programs

Here are the primary financial aid programs available for students in higher and technical courses:

1. **Rajarshi Shahu Maharaj Tuition Fee Reimbursement (EBC)**:
   - **Benefit:** 50% waiver on tuition and exam fees for approved general/EWS students with annual family income under ₹8 Lakh.
   - **Eligibility:** Mandatory admission via Centralized Admission Process (CAP) in AICTE/UGC approved institutes.

2. **Dr. Panjabrao Deshmukh Hostel Allowance**:
   - Up to ₹30,000/year (Metro/Pune/Mumbai) or ₹20,000/year for rural districts for hostel and mess accommodation for children of marginal farmers.

3. **National Scholarship Portal (Central Sector)**:
   - ₹12,000/year for undergraduate students scoring above the 80th percentile in Class 12 board examinations.

#### Essential Document Checklist:
- Current academic year Bonafide Certificate and CAP Allotment letter.
- Income Certificate signed by competent revenue authority (Tahsildar/SDM).
- Aadhaar-linked Bank Account with DBT status enabled on NPCI mapper.`,
      citations: [
        {
          id: 'cit-1',
          title: 'MahaDBT Post-Matric Scholarship Guidelines',
          department: 'Higher & Technical Education Dept, Maharashtra',
          documentType: 'Official Government Resolution',
          badge: 'MahaDBT Verified',
        },
        {
          id: 'cit-2',
          title: 'National Scholarship Portal 2.0 Framework',
          department: 'Ministry of Education, Government of India',
          documentType: 'Operational Guidelines',
          badge: 'MoE Portal',
        },
      ],
      followUps: [
        'How do I obtain a Tahsildar Income Certificate?',
        'Can I apply for both Central and State scholarships together?',
        'What is the last date for submitting MahaDBT applications?',
      ],
    };
  }

  if (p.includes('eligibility') || p.includes('eligible') || p.includes('qualify') || p.includes('criteria')) {
    return {
      content: `### Citizen Eligibility Criteria & Parameters

Government welfare scheme eligibility across Indian central and state departments is structured around these primary parameters:

1. **Annual Household Income Range**:
   - **BPL / Antyodaya (AAY):** Priority assistance for NFSA subsidized grains, PMAY-Gramin, and Ayushman Bharat ₹5 Lakh health cover.
   - **EWS / LIG:** Income up to ₹3 Lakh (EWS) or ₹6 Lakh (LIG); qualifies for fee waivers and credit-linked housing subsidies.
   - **MIG:** Income up to ₹18 Lakh; eligible for specific urban interest subsidies.

2. **Domicile & Continuous Residence**:
   - State benefits require a verified continuous domicile certificate issued by the Sub-Divisional Revenue Officer / Tahsildar.

3. **Occupation & Social Category**:
   - Dedicated initiatives exist for **Marginal Farmers** (PM-KISAN, Namo Shetkari), **Artisans** (PM Vishwakarma), and **Unorganized Workers** (e-Shram card benefits).

*Would you like to check eligibility for a specific domain such as Housing, Education, or Agriculture?*`,
      citations: [
        {
          id: 'cit-3',
          title: 'Standard Beneficiary Identification Norms',
          department: 'DBT Mission, Cabinet Secretariat, Govt of India',
          documentType: 'Administrative Framework',
          badge: 'DBT Mission',
        },
      ],
      followUps: [
        'Check housing eligibility for Middle Income Group',
        'What benefits are available under PM Vishwakarma?',
        'How to verify if bank account is seeded with Aadhaar?',
      ],
    };
  }

  if (p.includes('document') || p.includes('certificate') || p.includes('aadhaar') || p.includes('ration') || p.includes('tahsildar')) {
    return {
      content: `### Required Documentation & Verification Standards

To prevent application rejection on government portals (such as Aaple Sarkar, UMANG, or ServicePlus), make sure you have:

1. **Proof of Identity (PoI)**:
   - Aadhaar Card (ensure your active phone number is linked for OTP verification).
   - Voter ID / Passport.

2. **Proof of Residence (PoA)**:
   - Domicile Certificate issued by the Tahsildar / Revenue Department.
   - Electricity bill in the family head's name, or registered agreement.

3. **Authorized Income Proof**:
   - Tahsildar-issued Income Certificate for the current financial year.
   - *Note:* Private pay slips alone are typically not accepted for government subsidies.

4. **Direct Benefit Transfer (DBT) Readiness**:
   - Bank account mapped on the **NPCI mapper** to receive cash benefits directly without bank delays.`,
      citations: [
        {
          id: 'cit-4',
          title: 'Aaple Sarkar Citizen Services Document Manual',
          department: 'Govt of Maharashtra IT Directorate',
          documentType: 'Citizen Service Charter',
          badge: 'MahaGov Portal',
        },
      ],
      followUps: [
        'How do I check if my bank account has DBT active?',
        'Can DigiLocker documents be submitted directly?',
        'How long does an income certificate remain valid?',
      ],
    };
  }

  // Default Guidance
  return {
    content: `### Vaidha AI Citizen Assistance

Thank you for your question. Here is an overview of verified government assistance and application guidelines related to: **"${prompt}"**

1. **Application Method**:
   - Most welfare schemes now process applications directly through official single-window portals (**Aaple Sarkar**, **UMANG**, or **National Portal of India**).
   - Direct Benefit Transfer (DBT) ensures benefits are credited straight into your Aadhaar-linked account.

2. **Prerequisites Checklist**:
   - Valid **Aadhaar** linked to an active mobile number.
   - Official **Income Certificate** issued by the local Revenue Authority / Tahsildar.
   - Active bank passbook with NPCI Aadhaar seeding.

3. **Support & Assistance**:
   - You can visit your nearest **Aaple Sarkar Seva Kendra** or **Common Service Centre (CSC)** for physical verification assistance.

*Please feel free to ask about any specific scheme, requirement, or document clarification.*`,
    citations: [
      {
        id: 'cit-5',
        title: 'National Citizen Service Delivery Framework',
        department: 'Ministry of Electronics & Information Technology (MeitY)',
        documentType: 'Public Advisory',
        badge: 'Verified MeitY',
      },
    ],
    followUps: [
      'What are the eligibility limits for my state?',
      'Which documents can be fetched directly from DigiLocker?',
      'How to apply via Common Service Centre (CSC)?',
    ],
  };
}
