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

export interface SchemeSource {
  title: string;
  department: string;
  documentType: string;
  sourceUrl: string;
  guidelinePdfUrl?: string;
  publicationDate?: string;
  lastVerifiedAt: string;
}

export interface SchemeItem {
  id: string;
  name: string;
  regionalName?: string;
  hindiName?: string;
  category: 'Housing' | 'Education' | 'Agriculture' | 'Healthcare' | 'Financial' | 'Women & Child' | 'Employment' | 'Social Security';
  level: 'Central' | 'State' | 'Central-State';
  beneficiaryGroup: 'Students' | 'Farmers' | 'Families' | 'Artisans' | 'Senior Citizens' | 'Youth & Job Seekers' | 'Women' | 'All Citizens';
  beneficiaryGroups?: string[];
  department: string;
  benefit: string;
  eligibility: string;
  documents?: string[];
  benefits?: string[];
  eligibilityCriteria?: string[];
  requiredDocuments?: {
    mandatory: string[];
    conditional?: string[];
  };
  applicationProcess?: {
    mode: 'Online' | 'Offline' | 'Online & Offline';
    description: string;
    portalName?: string;
  };
  announcementDate?: string;
  announcementSourceUrl?: string;
  lastUpdatedAt?: string;
  lastVerifiedAt?: string;
  verificationStatus?: 'Verified source' | 'Needs review' | 'Information unavailable';
  applicationStatus?: 'Open' | 'Continuous / Ongoing' | 'Closed' | 'Status unknown';
  officialSourceUrl?: string;
  officialApplicationUrl?: string;
  officialUrl?: string;
  source?: SchemeSource;
  searchKeywords?: string[];
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
