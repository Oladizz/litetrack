export type ConsoleMode = 'search' | 'copilot' | 'autopilot';

export type UIIntentionType = 
  | 'createWidget'
  | 'removeWidget'
  | 'moveWidget'
  | 'resizeWidget'
  | 'createPage'
  | 'createSection'
  | 'changeChart'
  | 'changeFilter'
  | 'openDrawer'
  | 'focusRecord'
  | 'navigate'
  | 'pinWidget'
  | 'saveDashboard';

export interface UIIntention {
  id: string;
  type: UIIntentionType;
  targetId?: string;
  payload?: Record<string, any>;
  description: string;
  timestamp: string;
}

export interface SelfAwarenessContext {
  currentWorkspace: string;
  currentPage: string;
  currentDashboard?: string;
  userRole: string;
  userPermissions: string[];
  visibleWidgets: string[];
  activeFilters: Record<string, any>;
  currentTheme: string;
  registeredPlugins: string[];
}

export interface CopilotResponse {
  answer: string;
  sqlQuery?: string;
  emailDraft?: string;
  dataSummary?: Record<string, any>;
}

export interface AutopilotExecution {
  intentions: UIIntention[];
  summary: string;
  temporaryPageCreated?: boolean;
}
