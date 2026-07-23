// ============================================================
// WORKSPACE ENGINE — Type Contracts
// The core type system for the Admin OS Workspace Engine.
// Every panel, workspace, and region obeys these contracts.
// ============================================================

// --- Panel System ---

export type PanelType =
  | 'data_grid' | 'schema' | 'relationship' | 'record_inspector' | 'bulk_actions' | 'import_export'
  | 'chart' | 'kpi_card' | 'widget_composer' | 'layout_grid' | 'realtime_feed'
  | 'command_palette' | 'search_results' | 'quick_actions' | 'history'
  | 'identity_inspector' | 'org_tree' | 'role_matrix' | 'permission_grid' | 'session_monitor'
  | 'agent_registry' | 'prompt_editor' | 'memory_inspector' | 'decision_log' | 'autonomy_config'
  | 'resource_explorer' | 'preview' | 'metadata' | 'version_history' | 'tag_cloud'
  | 'event_stream' | 'log_viewer' | 'trace_map' | 'alert_panel' | 'metric_chart'
  | 'app_registry' | 'nav_tree' | 'theme_editor' | 'flag_manager' | 'blueprint_picker'
  | 'activity_feed' | 'comment_thread' | 'task_board' | 'approval_chain' | 'mission_card'
  | 'ecosystem_kpi' | 'health_score' | 'ai_fleet' | 'security_alert' | 'digital_twin'
  | 'ai_insight' | 'ai_summary' | 'notes' | 'timeline' | 'kanban' | 'calendar' | 'map' | 'gallery'
  | 'custom';

export type PanelSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface PanelDefinition {
  id: string;
  type: PanelType;
  title: string;
  icon: string;
  toolOrigin: string; // Which of the 10 tools contributes this panel
  description: string;
  defaultSize: PanelSize;
  minWidth?: number;
  minHeight?: number;
  resizable: boolean;
  closable: boolean;
  floatable: boolean;
  duplicatable: boolean;
}

export interface PanelInstance {
  id: string;
  definitionId: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  state: 'docked' | 'floating' | 'minimized' | 'maximized' | 'tabbed';
  zIndex: number;
  isPinned: boolean;
  tabGroup?: string;
}

// --- Workspace System ---

export type WorkspaceStatus = 'active' | 'saved' | 'archived' | 'temporary';

export interface Workspace {
  id: string;
  title: string;
  description: string;
  icon: string;
  status: WorkspaceStatus;
  panels: PanelInstance[];
  context: WorkspaceContext;
  createdAt: string;
  lastAccessedAt: string;
  createdBy: 'user' | 'ai' | 'system';
}

export interface WorkspaceContext {
  filters: Record<string, string>;
  selection: string[];
  scrollPositions: Record<string, number>;
  aiContext: string;
  recentHistory: string[];
  activeGoal?: string;
}

// --- AI Lane ---

export type AIInsightSeverity = 'info' | 'warning' | 'opportunity' | 'critical';
export type AILevel = 'passive' | 'assistive' | 'autonomous';

export interface AIInsight {
  id: string;
  message: string;
  severity: AIInsightSeverity;
  source: string;
  confidence: number;
  timestamp: string;
  actionable: boolean;
  suggestedAction?: string;
}

export interface RunningAgent {
  id: string;
  name: string;
  avatar: string;
  task: string;
  status: 'running' | 'thinking' | 'waiting' | 'done';
  progress: number;
}

// --- Dynamic Dock ---

export interface DockItem {
  id: string;
  label: string;
  icon: string;
  type: 'clipboard' | 'pinned' | 'selection' | 'job' | 'ai_task' | 'download' | 'notification';
  status?: 'running' | 'complete' | 'error';
  progress?: number;
}

// --- Workspace Navigator ---

export type NavSection = 'pinned' | 'recent' | 'favorites' | 'collections' | 'investigations' | 'ai_workspaces';

export interface NavItem {
  id: string;
  label: string;
  icon: string;
  section: NavSection;
  workspaceId?: string;
  badge?: string;
}

// --- Command Bar ---

export interface CommandAction {
  id: string;
  label: string;
  shortcut?: string;
  icon: string;
  category: 'navigation' | 'action' | 'ai' | 'workspace' | 'panel';
  handler?: () => void;
}
