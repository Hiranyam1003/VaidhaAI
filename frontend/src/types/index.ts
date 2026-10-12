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
  category: 'Housing' | 'Education' | 'Agriculture' | 'Healthcare' | 'Financial';
  level: 'Central' | 'State' | 'Central-State';
  benefit: string;
  eligibility: string;
  documents: string[];
  department: string;
  isSaved?: boolean;
}

export type NavTab = 
  | 'home' 
  | 'schemes' 
  | 'eligibility' 
  | 'documents' 
  | 'saved';
