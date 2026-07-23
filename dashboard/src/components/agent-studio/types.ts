export type AgentStatus = 'running' | 'paused' | 'sleeping' | 'idle';

export type AutonomyLevel = 'observer' | 'advisor' | 'operator' | 'autonomous';

export interface AgentCapability {
  name: string;
  allowed: boolean;
}

export interface AgentSkill {
  id: string;
  name: string;
  category: string;
  enabled: boolean;
}

export interface AgentTool {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

export interface AgentPerformance {
  tasksCompleted: number;
  successRate: number; // percentage
  avgExecutionTimeMs: number;
  tokenCostUsd: number;
  userRating: number; // 1.0 - 5.0
}

export interface AIAgent {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: AgentStatus;
  autonomyLevel: AutonomyLevel;
  model: string;
  provider: string;
  version: string;
  systemPrompt: string;
  capabilities: AgentCapability[];
  skills: AgentSkill[];
  tools: AgentTool[];
  performance: AgentPerformance;
  reportsToAgentId?: string;
}

export interface ReasoningStep {
  step: number;
  observation: string;
  deduction: string;
  actionTaken: string;
}

export interface AgentTask {
  id: string;
  agentId: string;
  agentName: string;
  prompt: string;
  status: 'pending' | 'running' | 'waiting' | 'completed' | 'failed';
  reasoningSteps: ReasoningStep[];
  timestamp: string;
}

export interface SwarmReport {
  prompt: string;
  ceoSummary: string;
  subAgentFindings: {
    agentName: string;
    role: string;
    finding: string;
    metrics: Record<string, any>;
  }[];
  uiIntentionsProposed: string[];
}
