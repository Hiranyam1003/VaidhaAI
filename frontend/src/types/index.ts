export interface Citation {
  id: string;
  title: string;
  department: string;
  documentType: string;
  badge?: string;
}

export interface Message {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  content: string;
  citations?: Citation[];
  followUps?: string[];
  isDemo?: boolean;
}

export interface SchemeItem {
  id: string;
  name: string;
  hindiName?: string;
  category: 'Housing' | 'Education' | 'Agriculture' | 'Healthcare' | 'Financial' | 'Women & Child';
  level: 'Central' | 'State' | 'Central-State';
  beneficiaryGroup: 'Students' | 'Farmers' | 'Families' | 'Artisans' | 'Senior Citizens' | 'All Citizens';
  benefit: string;
  eligibility: string;
  documents: string[];
  department: string;
  officialUrl?: string;
  isSaved?: boolean;
}

export type UpdateType = 
  | 'Policy Announcement' 
  | 'Scheme Update' 
  | 'Eligibility Change' 
  | 'Application Deadline' 
  | 'Public Notification';

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  details?: string;
  category: 'Central Government' | 'Maharashtra' | 'Education' | 'Healthcare' | 'Agriculture' | 'Employment';
  authority: string;
  publishedAt: string;
  updateType: UpdateType;
  sourceUrl?: string;
  isDemo: boolean;
  featured?: boolean;
  isBookmarked?: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  state: string;
  district: string;
  category: string;
  incomeRange: string;
  aadhaarLinked: boolean;
  dbtActive: boolean;
}

export type NavTab = 
  | 'home'
  | 'news'
  | 'schemes' 
  | 'eligibility' 
  | 'documents' 
  | 'saved'
  | 'profile'
  | 'settings';

export type Language = 'English' | 'Hindi' | 'Marathi';

export type TextSize = 'normal' | 'large' | 'larger';
