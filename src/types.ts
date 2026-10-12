export interface Citation {
  id: string;
  title: string;
  department: string;
  documentType: string;
  docUrl?: string;
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

export interface ChatSession {
  id: string;
  title: string;
  timeGroup: 'Today' | 'Yesterday' | 'Earlier';
  preview: string;
  messages: Message[];
  pinnedFolder?: string;
  updatedAt: string;
}

export interface PinnedFolder {
  id: string;
  name: string;
  color: string;
  iconName: string;
  count: number;
}
