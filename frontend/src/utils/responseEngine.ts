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
