import schemesData from './schemes.json';

export interface SchemeSource {
  title: string;
  department: string;
  documentType: string;
  sourceUrl: string;
  guidelinePdfUrl?: string;
  publicationDate?: string; // Verified publication or revision date
  lastVerifiedAt: string;   // ISO date string e.g. "2026-10-12"
}

export interface SchemeItem {
  id: string;
  name: string;
  regionalName?: string;
  hindiName?: string;
  category: 'Healthcare' | 'Education' | 'Housing' | 'Agriculture' | 'Employment' | 'Financial' | 'Women & Child' | 'Social Security';
  level: 'Central' | 'State' | 'Central-State';
  beneficiaryGroup: 'Students' | 'Farmers' | 'Families' | 'Artisans' | 'Senior Citizens' | 'Youth & Job Seekers' | 'Women' | 'All Citizens';
  beneficiaryGroups?: string[];
  department: string;
  
  // Concise summaries for card view
  benefit: string;
  eligibility: string;
  
  // Detailed structured breakdown for modal view & future RAG retrieval
  benefits: string[];
  eligibilityCriteria: string[];
  requiredDocuments: {
    mandatory: string[];
    conditional?: string[];
  };
  applicationProcess: {
    mode: 'Online' | 'Offline' | 'Online & Offline';
    description: string;
    portalName?: string;
  };
  
  // Verification and dates
  announcementDate?: string;         // YYYY-MM-DD - official announcement / launch date
  announcementSourceUrl?: string;    // Official source URL confirming the announcement date
  lastUpdatedAt?: string;            // YYYY-MM-DD
  lastVerifiedAt: string;            // YYYY-MM-DD
  verificationStatus: 'Verified source' | 'Needs review' | 'Information unavailable';
  applicationStatus: 'Open' | 'Continuous / Ongoing' | 'Closed' | 'Status unknown';
  
  // Official URLs
  officialSourceUrl: string;
  officialApplicationUrl?: string;
  
  // Supporting documents
  source: SchemeSource;
  
  // Search terms for multi-field filtering
  searchKeywords: string[];
  
  isSaved?: boolean;
}

// The data lives in schemes.json so the backend can read the same file for eligibility search (RAG).
export const SCHEMES = schemesData as SchemeItem[];
