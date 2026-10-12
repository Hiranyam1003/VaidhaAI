import type { Citation } from '../types';

export interface ImageExploreCard {
  id: string;
  category: string;
  title: string;
  description: string;
  imageUrl: string;
  altText: string;
  actionPrompt: string;
  targetNav?: string;
}

export const EXPLORE_IMAGE_CARDS: ImageExploreCard[] = [
  {
    id: 'exp-gov',
    category: 'Public Welfare',
    title: 'Government Schemes',
    description: 'Discover schemes and benefits available to you.',
    imageUrl: '/assets/gov-services.jpg',
    altText: 'Indian citizens accessing welfare services at a community administrative center',
    actionPrompt: 'What central and state government schemes are currently open for citizens in 2026?',
    targetNav: 'schemes',
  },
  {
    id: 'exp-edu',
    category: 'Higher Studies',
    title: 'Education & Scholarships',
    description: 'Find financial aid and educational opportunities.',
    imageUrl: '/assets/edu-students.jpg',
    altText: 'Indian university college students studying together on campus',
    actionPrompt: 'What government scholarships and fee reimbursements are available for college students?',
  },
  {
    id: 'exp-health',
    category: 'Healthcare Access',
    title: 'Healthcare',
    description: 'Explore public healthcare programmes and benefits.',
    imageUrl: '/assets/healthcare.jpg',
    altText: 'Doctor assisting an Indian patient in a healthcare clinic',
    actionPrompt: 'Tell me about government healthcare schemes like Ayushman Bharat PM-JAY and free hospital benefits.',
  },
  {
    id: 'exp-agri',
    category: 'Rural & Farming',
    title: 'Agriculture',
    description: 'Explore agricultural support and farmer schemes.',
    imageUrl: '/assets/agriculture.jpg',
    altText: 'Indian farmer in a lush green agricultural field at sunrise',
    actionPrompt: 'What agricultural subsidies and financial assistance schemes are available for farmers like PM-KISAN and Namo Shetkari?',
  },
];

export const QUICK_PROMPTS = [
  { label: 'Which schemes can I apply for?', prompt: 'Which central and state government schemes can I apply for based on my family profile?' },
  { label: 'What documents do I need?', prompt: 'What essential documents and certificates do I need to prepare before applying for a government benefit?' },
  { label: 'Find scholarships for students', prompt: 'Find scholarships and fee waiver opportunities for higher and technical education students.' },
];

export const WELCOME_SUGGESTIONS = [
  {
    id: 's-1',
    title: 'Explore Government Schemes',
    description: 'Discover benefits and assistance available to you.',
    prompt: 'What central and state government schemes are currently open for application in 2026?',
  },
  {
    id: 's-2',
    title: 'Check My Eligibility',
    description: 'Explore schemes that may match your circumstances.',
    prompt: 'I want to check which government assistance schemes I am eligible for based on my family profile.',
  },
  {
    id: 's-3',
    title: 'Find Required Documents',
    description: 'Understand which documents may be needed for an application.',
    prompt: 'What standard documents and certificates do I need to prepare before applying for state welfare benefits?',
  },
  {
    id: 's-4',
    title: 'Education & Scholarships',
    description: 'Explore potential financial assistance for students.',
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
   - Up to ₹30,000/year (Metropolitan/Pune/Mumbai) or ₹20,000/year for other districts for hostel and mess sustenance for children of registered non-salaried farmers or agricultural laborers.

3. **National Scholarship Portal (Central Sector)**:
   - ₹12,000/year for undergraduate students scoring above the 80th percentile in state higher secondary examinations.

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

  if (p.includes('health') || p.includes('medical') || p.includes('hospital') || p.includes('ayushman') || p.includes('pmjay') || p.includes('doctor')) {
    return {
      content: `### Public Healthcare Initiatives & Health Cover Benefits

Public health programs offer cashless and subsidized hospital treatments for eligible households:

1. **Ayushman Bharat PM-JAY (Pradhan Mantri Jan Arogya Yojana)**:
   - **Coverage:** Cashless health cover up to ₹5,00,000 per family per year for secondary and tertiary care hospitalization.
   - **Network:** Over 28,000 empaneled public and private hospitals across India.
   - **Portability:** Access cashless treatment in any empaneled hospital nationwide.

2. **Mahatma Jyotirao Phule Jan Arogya Yojana (MJPJAY - Maharashtra)**:
   - State health insurance program covering 1,356 medical and surgical procedures up to ₹5 Lakhs for all ration card holders.
   - Zero out-of-pocket expenditure for diagnostic and follow-up therapies.

3. **Pradhan Mantri Bhartiya Janaushadhi Pariyojana**:
   - Access generic medicines at 50% to 90% lower prices compared to branded equivalents through Kendra pharmacy outlets.`,
      citations: [
        {
          id: 'cit-health-1',
          title: 'PM-JAY National Health Benefit Package Guidelines',
          department: 'National Health Authority (NHA)',
          documentType: 'Statutory Operational Manual',
          badge: 'Official NHA',
        },
        {
          id: 'cit-health-2',
          title: 'MJPJAY Scheme Guidelines & Empaneled Hospital Directory',
          department: 'Public Health Department, Government of Maharashtra',
          documentType: 'Citizen Health Charter',
          badge: 'MahaHealth Portal',
        },
      ],
      followUps: [
        'How do I check if my name is on the Ayushman Bharat SECC list?',
        'Can I generate an Ayushman Golden Card using Aadhaar online?',
        'Which hospitals in Pune and Mumbai accept PM-JAY cashless claims?',
      ],
    };
  }

  if (p.includes('agri') || p.includes('farm') || p.includes('kisan') || p.includes('shetkari') || p.includes('crop') || p.includes('irrigation')) {
    return {
      content: `### Farmer Welfare & Agricultural Assistance Schemes

Key financial and infrastructure support schemes for Indian farmers:

1. **PM-KISAN Samman Nidhi & Namo Shetkari Mahasanman (Maharashtra)**:
   - **Combined Direct Credit:** ₹12,000 annually (₹6,000 Central + ₹6,000 State) transferred in 3 equal four-monthly installments.
   - **Prerequisites:** Verified Aadhaar DBT-linked bank account, 7/12 land registration, and active biometric e-KYC.

2. **Pradhan Mantri Fasal Bima Yojana (PMFBY)**:
   - Comprehensive crop insurance shielding against non-preventable natural risks (drought, flood, unseasonal rainfall) with minimal nominal premium (1.5% to 2%).

3. **Magel Tyala Shettale (Farm Pond Subsidy)**:
   - Subsidy up to ₹75,000 for digging plastic-lined farm ponds to secure drought-resistant irrigation.`,
      citations: [
        {
          id: 'cit-agri-1',
          title: 'Namo Shetkari Mahasanman Nidhi Operational Directives',
          department: 'Agriculture Department, Government of Maharashtra',
          documentType: 'Government Resolution',
          badge: 'Krishi Vibhag',
        },
        {
          id: 'cit-agri-2',
          title: 'PM-KISAN Operational Guidelines',
          department: 'Ministry of Agriculture and Farmers Welfare',
          documentType: 'Scheme Directives',
          badge: 'MoA&FW Official',
        },
      ],
      followUps: [
        'How do I complete e-KYC for Namo Shetkari online?',
        'What documents are needed for micro-irrigation drip subsidy?',
        'How to verify land record seeding on PM-KISAN portal?',
      ],
    };
  }

  if (p.includes('housing') || p.includes('house') || p.includes('pmay') || p.includes('flat') || p.includes('mhada')) {
    return {
      content: `### Government Housing Schemes & Subsidies

Affordable housing initiatives provide direct financial assistance and interest subsidies for urban and rural families:

1. **Pradhan Mantri Awas Yojana - Urban (PMAY-U 2.0)**:
   - **Interest Subsidy Scheme (ISS):** Beneficiaries availing home loans up to ₹25 Lakh on property values under ₹35 Lakh receive up to ₹1.80 Lakh subsidy distributed across 5 years.
   - **Income Ceiling:** EWS/LIG/MIG families with household income up to ₹18 Lakhs.

2. **State Housing Board Lotteries (e.g. MHADA / CIDCO / DDA)**:
   - Affordable tenement lotteries specifically reserved for EWS, LIG, and MIG categories.
   - Additional ₹2.5 Lakh direct central-state subsidy credited against the unit base cost if selected under affordable housing in partnership.

#### Key Eligibility Rule:
- The applicant or any immediate family member must not own a pucca (permanent) residential house anywhere in India.`,
      citations: [
        {
          id: 'cit-house-1',
          title: 'PMAY-U 2.0 Guidelines & Implementation Framework',
          department: 'Ministry of Housing and Urban Affairs (MoHUA)',
          documentType: 'Official Notification',
          badge: 'MoHUA Official',
        },
      ],
      followUps: [
        'What documents are needed for PMAY-U 2.0?',
        'How does MHADA computerized lottery work in Pune and Mumbai?',
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
   - Electricity bill in the family head's name, or registered rent agreement.

3. **Authorized Income Proof**:
   - Tahsildar-issued Income Certificate for the current financial year.
   - *Note:* Private salary slips alone are typically not accepted for government subsidies without revenue authority certification.

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

Thank you for your inquiry. Here is an overview of verified government assistance and application guidelines related to: **"${prompt}"**

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
