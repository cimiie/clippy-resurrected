export interface QuickAction {
  id: string;
  label: string;
  icon: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  quickActions?: QuickAction[];
  context?: string;
}

export type ClippyAnimation = 'idle' | 'thinking' | 'speaking';
