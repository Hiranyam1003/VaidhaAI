import documentsData from './documents.json';

// Documents citizens can apply for online, with how to apply. English is the source;
// Hindi and Marathi text lives in src/data/documentTranslations.ts. Pictures are /assets/documents/<id>.jpg.

export type DocumentId =
  | 'aadhaar'
  | 'pan'
  | 'voter-id'
  | 'passport'
  | 'driving-licence'
  | 'abha'
  | 'birth-certificate'
  | 'death-certificate'
  | 'marriage-certificate'
  | 'income-certificate'
  | 'domicile-certificate'
  | 'caste-certificate'
  | 'ncl-certificate'
  | 'ews-certificate'
  | 'senior-citizen-certificate'
  | 'ration-card'
  | 'ayushman-card'
  | 'eshram-card'
  | 'udid-card'
  | 'vehicle-rc'
  | 'police-clearance'
  | 'satbara'
  | 'property-card'
  | 'udyam'
  | 'gst'
  | 'fssai'
  | 'digilocker';

export type DocumentCategory =
  | 'identity'
  | 'civil'
  | 'certificates'
  | 'welfare'
  | 'transport'
  | 'land'
  | 'business'
  | 'education';

export const DOCUMENT_CATEGORIES: DocumentCategory[] = [
  'identity',
  'civil',
  'certificates',
  'welfare',
  'transport',
  'land',
  'business',
  'education',
];

export interface DocumentText {
  name: string;
  summary: string;
  issuedBy: string;
  portalName: string;
  whoCanApply: string;
  papers: string[];
  steps: string[];
  tip: string;
}

export interface DocumentGuide extends DocumentText {
  id: DocumentId;
  category: DocumentCategory;
  portalUrl: string;
}

// The data lives in documents.json so the backend can read the same file for eligibility search (RAG).
export const DOCUMENTS = documentsData as DocumentGuide[];
