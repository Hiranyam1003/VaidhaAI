import type { Citation } from './types';

export function generateAssistantReply(userQuery: string): { content: string; citations: Citation[]; followUps: string[] } {
  const q = userQuery.toLowerCase();

  if (q.includes('scholarship') || q.includes('student') || q.includes('college') || q.includes('education') || q.includes('b.tech') || q.includes('fee')) {
    return {
      content: `### Student Support & Government Scholarship Overview

Here are the key educational scholarship schemes available for higher and technical education:

1. **Rajarshi Shahu Maharaj Tuition Fee Reimbursement (EBC)**:
   - **Benefit:** 50% waiver on tuition and exam fees for approved general/EWS students with annual family income under ₹8 Lakh.
   - **Eligibility:** Mandatory admission via Centralized Admission Process (CAP) in AICTE/UGC approved institutes.

2. **National Scholarship Portal (Central Sector Scheme)**:
   - ₹12,000/year for undergraduate students ranked above the 80th percentile in their state higher secondary examination.
   - Renewal enabled for postgraduate studies upon passing with minimum 50% marks.

3. **Pragati Scholarship Scheme for Girl Students**:
   - Up to ₹50,000 per annum towards college fees, laptop purchase, or study materials for young women entering degree/diploma technical programs.

#### Key Preparation Checklist:
- Current academic year Bonafide Certificate from the college.
- Income Certificate signed by competent revenue authority (Tahsildar/SDM).
- Aadhaar-linked Bank Account with DBT status verified.`,
      citations: [
        {
          id: 'cit-edu-1',
          title: 'National Scholarship Portal 2.0 Operational Framework',
          department: 'Ministry of Education, Government of India',
          documentType: 'Official Scheme Guidelines',
          badge: 'Verified MoE',
        },
        {
          id: 'cit-edu-2',
          title: 'MahaDBT Post-Matric Scholarship Rules',
          department: 'Directorate of Higher Education, Maharashtra',
          documentType: 'State Resolution',
          badge: 'MahaDBT Verified',
        },
      ],
      followUps: [
        'How do I obtain a Tahsildar Income Certificate?',
        'Can I apply for both Central and State scholarships together?',
        'What is the last date for submitting MahaDBT applications this term?',
      ],
    };
  }

  if (q.includes('eligibility') || q.includes('qualify') || q.includes('fit') || q.includes('criteria')) {
    return {
      content: `### Scheme Eligibility Assessment Engine

To accurately determine the government welfare schemes applicable to you or your household, eligibility is evaluated across five standard parameters:

1. **Socio-Economic & Income Tier**:
   - **BPL / Antyodaya (AAY):** Prioritized for food security (NFSA free ration), PM-Awas Gramin, and Ayushman Bharat PM-JAY ₹5 Lakh health cover.
   - **Economically Weaker Section (EWS) / Low Income Group (LIG):** Annual household income up to ₹3L – ₹6L; qualifies for PMAY subsidies and educational waivers.
   - **Middle Income Group (MIG):** Up to ₹18 Lakh annual income eligible for select urban credit linked interest subsidies.

2. **Domicile & Residence**:
   - State schemes (such as Aaple Sarkar, MahaDBT, or Rythu Bharosa) mandate a continuous state domicile period verified via a Tahsildar Domicile certificate.

3. **Occupation & Social Category**:
   - Specific programs exist for **Marginal Farmers** (PM-KISAN, Namo Shetkari), **Artisans & Craftsmen** (PM Vishwakarma collateral-free loans up to ₹3 Lakh), and **Unorganized Workers** (e-Shram social security card).

*Would you like to share your state, annual household income range, and occupation so I can narrow this down for you?*`,
      citations: [
        {
          id: 'cit-elig-1',
          title: 'Unified Beneficiary Assessment Criteria & DBT Manual',
          department: 'Direct Benefit Transfer Mission, Cabinet Secretariat',
          documentType: 'Citizen Eligibility Manual',
          badge: 'DBT Mission',
        },
      ],
      followUps: [
        'Check schemes for annual family income under 3 Lakhs',
        'What benefits are available under PM Vishwakarma?',
        'How do I register for an e-Shram card?',
      ],
    };
  }

  if (q.includes('document') || q.includes('certificate') || q.includes('aadhaar') || q.includes('pan') || q.includes('ration') || q.includes('kyc')) {
    return {
      content: `### Required Documentation & Verification Standards

To avoid application rejections on citizen service portals like **Aaple Sarkar**, **DigiLocker**, or **UMANG**, ensure your documentation meets the standard state-issued criteria:

1. **Proof of Identity (PoI)**:
   - Aadhaar Card (with biometric & active phone number updated).
   - Voter ID / Passport / Driving Licence.

2. **Proof of Address & Domicile (PoA)**:
   - Domicile Certificate issued by Revenue Sub-Division.
   - Electricity bill in the head of household's name, or registered rent agreement.

3. **Income Certification**:
   - Income Certificate issued by Tahsildar / Revenue Department based on circle officer inquiry (Valid for current FY).
   - *Note:* Private company salary slips or Form 16 alone are usually not recognized without an official Tahsildar revenue stamp.

4. **Direct Benefit Transfer (DBT) Banking Requirement**:
   - Bank passbook copy showing IFSC and Account Holder Name.
   - **Crucial:** Your bank account must be mapped to NPCI (Aadhaar seeding) to receive cash benefits directly.`,
      citations: [
        {
          id: 'cit-doc-1',
          title: 'National Digital Identity & Citizen Verification Standards',
          department: 'Unique Identification Authority of India (UIDAI)',
          documentType: 'Statutory Guidelines',
          badge: 'Official UIDAI',
        },
        {
          id: 'cit-doc-2',
          title: 'Aaple Sarkar Citizen Services Document Matrix',
          department: 'Department of Information Technology, Govt of Maharashtra',
          documentType: 'Citizen Charter',
          badge: 'MahaGov Verified',
        },
      ],
      followUps: [
        'How do I check if my bank account is mapped to NPCI?',
        'Can I submit documents verified directly via DigiLocker?',
        'What is the turnaround time for a Tahsildar income certificate?',
      ],
    };
  }

  if (q.includes('housing') || q.includes('house') || q.includes('pmay') || q.includes('flat') || q.includes('mhada')) {
    return {
      content: `### Government Housing Schemes & Subsidies

Affordable housing initiatives provide direct financial assistance and interest subsidies for urban and rural families:

1. **Pradhan Mantri Awas Yojana - Urban (PMAY-U 2.0)**:
   - **Interest Subsidy Scheme (ISS):** Beneficiaries availing home loans up to ₹25 Lakh on property values under ₹35 Lakh receive up to ₹1.8 Lakh subsidy distributed across 5 years.
   - **Affordable Housing in Partnership (AHP):** Financial assistance of ₹2.5 Lakh per house built in partnership with state development bodies.

2. **State Housing Board Lotteries (e.g. MHADA / CIDCO / DDA)**:
   - Affordable tenement lotteries specifically reserved for EWS, LIG, and MIG categories.
   - Subsidized stamp duty rates in several states when registered in the name of a female family member.

#### Eligibility Rule:
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
        'What is the carpet area limit for PMAY-U flats?',
        'How does MHADA computerized lottery work?',
      ],
    };
  }

  // Default intelligent assistant response
  return {
    content: `### Vaidha AI Guidance for: "${userQuery}"

Thank you for your inquiry. Vaidha AI (Virtual Assistant for Indian Documentation & High-level Administration) has referenced the latest citizen welfare directives and scheme repositories:

1. **Key Scheme Match & Overview**:
   - Relevant assistance schemes operate under the **Direct Benefit Transfer (DBT)** mission framework to ensure zero intermediary deductions.
   - Applications can be processed through official digital touchpoints (UMANG, State Aaple Sarkar, or dedicated department portals).

2. **Core Verification Requirements**:
   - Ensure you possess an active **Aadhaar Card** linked to your mobile number for seamless OTP e-KYC.
   - Obtain an authorized **Income Certificate** and **Domicile Certificate** from your local Tahsildar or Revenue circle office if required by the state mandate.

3. **Application & Verification Procedure**:
   - Prepare clean scanned PDFs or DigiLocker links of identity proofs.
   - Register on the official portal and link your Aadhaar-seeded bank account for timely disbursement.

*Feel free to specify your state, household category (EWS/LIG/General), or specific scheme name to receive exact step-by-step guidance.*`,
    citations: [
      {
        id: 'cit-gen-1',
        title: 'National Citizen Service Delivery Framework',
        department: 'Ministry of Electronics & Information Technology (MeitY)',
        documentType: 'Public Administrative Advisory',
        badge: 'Verified MeitY',
      },
      {
        id: 'cit-gen-2',
        title: 'Central Government DBT Portal Directory',
        department: 'Cabinet Secretariat, Government of India',
        documentType: 'Official Directory',
        badge: 'DBT Mission',
      },
    ],
    followUps: [
      'What are the eligibility limits for my state?',
      'Which documents can be fetched directly from DigiLocker?',
      'How long does verification take after submission?',
    ],
  };
}
