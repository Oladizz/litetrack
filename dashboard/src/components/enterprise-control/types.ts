export interface EcosystemKPI {
  label: string;
  value: string;
  icon: string;
  trend?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
}

export interface HealthScore {
  domain: string;
  score: number;
  status: 'healthy' | 'degraded' | 'critical';
  details: string;
}

export interface AppSwitchboard {
  id: string;
  name: string;
  icon: string;
  health: number;
  status: 'online' | 'degraded' | 'offline';
  users: number;
  aiAgents: number;
  eventsToday: string;
}

export interface AIFleetAgent {
  id: string;
  name: string;
  avatar: string;
  status: 'running' | 'paused' | 'busy' | 'idle' | 'error';
  model: string;
  activeTask: string;
  decisionsToday: number;
  tokenCostUsd: number;
  autonomyLevel: 'observer' | 'advisor' | 'operator' | 'autonomous';
}

export interface AIGovernanceEntry {
  id: string;
  agent: string;
  action: string;
  reason: string;
  confidenceScore: number;
  toolsUsed: string[];
  approvalStatus: 'auto_approved' | 'pending' | 'approved' | 'rejected';
  rollbackAvailable: boolean;
  timestamp: string;
}

export interface SecurityEvent {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: string;
  title: string;
  details: string;
  actor: string;
  timestamp: string;
  resolved: boolean;
}

export interface DisasterControl {
  id: string;
  label: string;
  description: string;
  icon: string;
  severity: 'critical' | 'high' | 'medium';
  active: boolean;
}

export interface CostBreakdown {
  category: string;
  icon: string;
  costUsd: number;
  budgetUsd: number;
  trend: number;
}

export interface Organization {
  id: string;
  name: string;
  appCount: number;
  userCount: number;
  aiAgentCount: number;
  plan: string;
  health: 'healthy' | 'degraded' | 'critical';
  mrr: number;
}

export interface BriefingItem {
  icon: string;
  message: string;
  type: 'positive' | 'warning' | 'action' | 'neutral';
}

export interface DigitalTwinNode {
  id: string;
  label: string;
  type: 'organization' | 'application' | 'ai_agent' | 'resource' | 'user_group' | 'infrastructure';
  icon: string;
  health: number;
  children?: DigitalTwinNode[];
  stats?: { label: string; value: string }[];
}
