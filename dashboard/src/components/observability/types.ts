export type EventStatus = 'success' | 'warning' | 'error' | 'info';

export interface ObservabilityEvent {
  id: string;
  timestamp: string;
  event: string;
  actor: string;
  actorType: 'user' | 'admin' | 'ai_agent' | 'system';
  resource: string;
  module: string;
  status: EventStatus;
  durationMs: number;
  metadata?: Record<string, any>;
}

export interface ServiceHealth {
  name: string;
  score: number; // 0 - 100%
  status: 'healthy' | 'degraded' | 'critical';
  latencyMs: number;
  uptime: string;
}

export interface StackErrorItem {
  id: string;
  errorName: string;
  errorMessage: string;
  stackTrace: string;
  affectedEndpoint: string;
  actor: string;
  timestamp: string;
  aiExplanation: string;
  suggestedFix: string;
  status: 'unresolved' | 'resolving' | 'fixed';
}

export interface AlertTrigger {
  id: string;
  title: string;
  severity: 'high' | 'medium' | 'low';
  category: 'latency' | 'budget' | 'security' | 'anomaly';
  message: string;
  triggeredAt: string;
  status: 'active' | 'acknowledged' | 'resolved';
}

export interface CostItem {
  category: string;
  costUsd: number;
  deltaPercent: number;
  details: string;
}

export interface DependencyNode {
  id: string;
  name: string;
  type: 'dashboard' | 'widget' | 'api' | 'database' | 'storage';
  healthScore: number;
  parentIds: string[];
}

export interface InvestigationReport {
  targetTitle: string;
  probableCause: string;
  confidenceScore: number; // percentage
  evidenceList: string[];
  suggestedAction: string;
}
