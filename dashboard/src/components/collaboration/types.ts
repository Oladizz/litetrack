export type ActivityType = 'assignment' | 'ai_action' | 'comment' | 'approval' | 'task_update' | 'system' | 'decision';

export interface ActivityEvent {
  id: string;
  type: ActivityType;
  actor: string;
  actorType: 'user' | 'ai_agent' | 'system';
  actorAvatar: string;
  action: string;
  target: string;
  timestamp: string;
}

export interface Comment {
  id: string;
  author: string;
  authorAvatar: string;
  authorType: 'user' | 'ai_agent';
  content: string;
  timestamp: string;
  reactions: { emoji: string; count: number }[];
  mentions: string[];
  hasCode: boolean;
}

export type TaskStatus = 'backlog' | 'in_progress' | 'review' | 'done';
export type TaskPriority = 'critical' | 'high' | 'medium' | 'low';

export interface TaskItem {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: string;
  assigneeType: 'user' | 'team' | 'ai_agent';
  assigneeAvatar: string;
  dueDate: string;
  tags: string[];
}

export interface ApprovalStage {
  id: string;
  label: string;
  approver: string;
  approverType: 'user' | 'ai_agent';
  status: 'pending' | 'approved' | 'rejected' | 'waiting';
  timestamp?: string;
  aiSummary?: string;
}

export interface Decision {
  id: string;
  title: string;
  reason: string;
  approvedBy: string;
  suggestedBy: string;
  suggestedByType: 'user' | 'ai_agent';
  timestamp: string;
  category: string;
}

export interface SharedWorkspace {
  id: string;
  name: string;
  description: string;
  members: { name: string; type: 'user' | 'ai_agent'; avatar: string }[];
  resourceCount: number;
  status: 'active' | 'archived';
  createdAt: string;
}

export interface Notification {
  id: string;
  type: 'mention' | 'task' | 'ai_suggestion' | 'approval' | 'alert' | 'comment' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actor: string;
  actorAvatar: string;
}

export interface WatchlistItem {
  id: string;
  resourceName: string;
  resourceType: string;
  conditions: string[];
  triggered: boolean;
  lastChecked: string;
}

export interface Mission {
  id: string;
  title: string;
  objective: string;
  status: 'active' | 'completed' | 'paused';
  progress: number;
  members: { name: string; type: 'user' | 'ai_agent'; avatar: string }[];
  taskCount: number;
  decisionCount: number;
  dashboardCount: number;
  createdAt: string;
  timeline: { event: string; timestamp: string; done: boolean }[];
}
