"use client";

import React, { useState } from 'react';
import {
  Globe, Bot, Shield, DollarSign, Sparkles, Network, Crown
} from 'lucide-react';
import {
  EcosystemKPI, HealthScore, AppSwitchboard, AIFleetAgent, AIGovernanceEntry,
  SecurityEvent, DisasterControl, CostBreakdown, Organization, BriefingItem
} from './types';
import { EcosystemOverview } from './ecosystem-overview';
import { AICommandGovernance } from './ai-command-governance';
import { SecurityDisasterCenter } from './security-disaster';
import { CostOrganizations } from './cost-organizations';
import { ExecutiveBriefingAI } from './executive-briefing';
import { DigitalTwinEngine } from './digital-twin';
import { toast } from '@/components/ui/toast';

export function UniversalEnterpriseControl() {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'ai_command' | 'security' | 'cost_orgs' | 'briefing' | 'digital_twin'
  >('overview');

  // === Section 1: Ecosystem KPIs ===
  const kpis: EcosystemKPI[] = [
    { label: 'Applications', value: '12', icon: '📱', trend: '+2 this month', trendDirection: 'up' },
    { label: 'Organizations', value: '4', icon: '🏢', trend: 'Stable', trendDirection: 'neutral' },
    { label: 'Users', value: '2,493', icon: '👤', trend: '+12%', trendDirection: 'up' },
    { label: 'AI Agents', value: '38', icon: '🤖', trend: '+5 this week', trendDirection: 'up' },
    { label: 'Automations', value: '91', icon: '⚡', trend: '+8%', trendDirection: 'up' },
    { label: 'Events Today', value: '12M', icon: '📊', trend: '+18%', trendDirection: 'up' },
    { label: 'Uptime', value: '99.99%', icon: '🟢', trend: 'SLA Met', trendDirection: 'up' },
  ];

  const health: HealthScore[] = [
    { domain: 'Platform', score: 98, status: 'healthy', details: 'All core services nominal' },
    { domain: 'Applications', score: 96, status: 'healthy', details: 'CRM latency slightly elevated' },
    { domain: 'AI Engine', score: 94, status: 'healthy', details: '2 agents near budget limit' },
    { domain: 'Infrastructure', score: 99, status: 'healthy', details: '3 regions, 99.99% uptime' },
    { domain: 'Security', score: 100, status: 'healthy', details: 'No active threats detected' },
  ];

  const apps: AppSwitchboard[] = [
    { id: 'sw_1', name: 'Analytics Pro', icon: '📊', health: 99, status: 'online', users: 340, aiAgents: 4, eventsToday: '3.2M' },
    { id: 'sw_2', name: 'Admin OS', icon: '⚙️', health: 98, status: 'online', users: 82, aiAgents: 8, eventsToday: '1.4M' },
    { id: 'sw_3', name: 'SchoolTrack', icon: '🎓', health: 97, status: 'online', users: 840, aiAgents: 3, eventsToday: '2.1M' },
    { id: 'sw_4', name: 'CRM Engine', icon: '🤝', health: 92, status: 'degraded', users: 420, aiAgents: 5, eventsToday: '1.8M' },
    { id: 'sw_5', name: 'InventoryHub', icon: '📦', health: 96, status: 'online', users: 180, aiAgents: 2, eventsToday: '680K' },
    { id: 'sw_6', name: 'RepairDesk', icon: '🔧', health: 88, status: 'degraded', users: 95, aiAgents: 2, eventsToday: '240K' },
    { id: 'sw_7', name: 'BlockVault', icon: '⛓️', health: 78, status: 'degraded', users: 12, aiAgents: 1, eventsToday: '42K' },
    { id: 'sw_8', name: 'SupportOS', icon: '💬', health: 99, status: 'online', users: 524, aiAgents: 4, eventsToday: '1.9M' },
  ];

  // === Section 2: AI Fleet ===
  const [aiAgents, setAiAgents] = useState<AIFleetAgent[]>([
    { id: 'fleet_1', name: 'Analytics AI', avatar: '📊', status: 'running', model: 'Gemini 2.5 Pro', activeTask: 'Generating Q2 churn cohort analysis', decisionsToday: 142, tokenCostUsd: 12.40, autonomyLevel: 'operator' },
    { id: 'fleet_2', name: 'Finance AI', avatar: '💰', status: 'paused', model: 'Gemini 2.5 Pro', activeTask: 'Monthly reconciliation paused', decisionsToday: 38, tokenCostUsd: 8.20, autonomyLevel: 'advisor' },
    { id: 'fleet_3', name: 'Support AI', avatar: '🎧', status: 'busy', model: 'Gemini 2.5 Flash', activeTask: 'Processing 12 open tickets', decisionsToday: 89, tokenCostUsd: 4.60, autonomyLevel: 'autonomous' },
    { id: 'fleet_4', name: 'Developer AI', avatar: '💻', status: 'idle', model: 'Gemini 2.5 Pro', activeTask: 'Awaiting assignment', decisionsToday: 24, tokenCostUsd: 6.80, autonomyLevel: 'operator' },
    { id: 'fleet_5', name: 'Marketing AI', avatar: '📢', status: 'running', model: 'Gemini 2.5 Flash', activeTask: 'Analyzing campaign performance', decisionsToday: 56, tokenCostUsd: 3.40, autonomyLevel: 'advisor' },
    { id: 'fleet_6', name: 'Security AI', avatar: '🔒', status: 'running', model: 'Gemini 2.5 Pro', activeTask: 'Continuous threat monitoring', decisionsToday: 210, tokenCostUsd: 14.20, autonomyLevel: 'autonomous' },
    { id: 'fleet_7', name: 'Sales AI', avatar: '💼', status: 'running', model: 'Gemini 2.5 Flash', activeTask: 'Scoring 2,891 leads', decisionsToday: 2891, tokenCostUsd: 9.80, autonomyLevel: 'operator' },
    { id: 'fleet_8', name: 'Education AI', avatar: '📚', status: 'running', model: 'Gemini 2.5 Flash', activeTask: 'Grading 430 assessments', decisionsToday: 430, tokenCostUsd: 5.10, autonomyLevel: 'advisor' },
  ]);

  const governance: AIGovernanceEntry[] = [
    { id: 'gov_1', agent: 'Security AI', action: 'Blocked IP 45.33.x.x from API access', reason: 'Detected 4,200 requests/min from single IP — 4.2× above rate limit threshold. Pattern matches credential stuffing attack.', confidenceScore: 97, toolsUsed: ['IP Analyzer', 'Rate Limiter', 'Threat DB'], approvalStatus: 'auto_approved', rollbackAvailable: true, timestamp: '12 mins ago' },
    { id: 'gov_2', agent: 'Finance AI', action: 'Flagged transaction #TXN-4892 for review', reason: 'Transaction amount ($24,800) exceeds 3σ threshold for this merchant category. Potential fraud or miscategorization.', confidenceScore: 84, toolsUsed: ['Transaction Analyzer', 'Fraud Scorer'], approvalStatus: 'pending', rollbackAvailable: false, timestamp: '28 mins ago' },
    { id: 'gov_3', agent: 'Analytics AI', action: 'Generated 4 executive dashboards automatically', reason: 'Q2 close detected. Historical pattern shows executive team requests dashboards within 48h of quarter close.', confidenceScore: 92, toolsUsed: ['Calendar Analyzer', 'Dashboard Builder', 'Data Aggregator'], approvalStatus: 'auto_approved', rollbackAvailable: true, timestamp: '1 hour ago' },
    { id: 'gov_4', agent: 'Support AI', action: 'Escalated ticket #T-2041 to human agent', reason: 'Customer sentiment score dropped to 12/100. Three failed resolution attempts detected. Escalation policy triggered.', confidenceScore: 95, toolsUsed: ['Sentiment Analyzer', 'Escalation Engine'], approvalStatus: 'auto_approved', rollbackAvailable: false, timestamp: '2 hours ago' },
    { id: 'gov_5', agent: 'Developer AI', action: 'Proposed database index on orders.stripe_payment_id', reason: 'Query plan analysis shows full table scan on 1.2M rows. Index would reduce p99 latency from 840ms to ~24ms.', confidenceScore: 98, toolsUsed: ['Query Analyzer', 'Index Optimizer'], approvalStatus: 'approved', rollbackAvailable: true, timestamp: '3 hours ago' },
  ];

  // === Section 3: Security ===
  const [secEvents, setSecEvents] = useState<SecurityEvent[]>([
    { id: 'sec_1', severity: 'critical', category: 'Brute Force', title: 'Credential stuffing attack detected', details: '4,200 req/min from IP 45.33.x.x targeting /api/auth/login. Auto-blocked by Security AI.', actor: 'External (45.33.x.x)', timestamp: '12 mins ago', resolved: true },
    { id: 'sec_2', severity: 'high', category: 'Permission Change', title: 'Admin role assigned to new user', details: 'User david.k@partner.io was granted Super Admin role by john@cirlo.io.', actor: 'john@cirlo.io', timestamp: '1 hour ago', resolved: false },
    { id: 'sec_3', severity: 'medium', category: 'Failed Login', title: '14 failed login attempts', details: 'User sarah@cirlo.io failed authentication 14 times in 5 minutes. Account temporarily locked.', actor: 'sarah@cirlo.io', timestamp: '3 hours ago', resolved: true },
    { id: 'sec_4', severity: 'high', category: 'API Abuse', title: 'Unusual API key usage pattern', details: 'API key sk_live_xxx used from 3 new geographic locations within 1 hour. Potential key compromise.', actor: 'API Key: sk_live_xxx', timestamp: '4 hours ago', resolved: false },
    { id: 'sec_5', severity: 'low', category: 'Compliance', title: 'GDPR data export request', details: 'Customer #C-2041 submitted a data export request under GDPR Article 15. 30-day deadline.', actor: 'Customer #C-2041', timestamp: '1 day ago', resolved: false },
  ]);

  const [disasters, setDisasters] = useState<DisasterControl[]>([
    { id: 'dis_1', label: 'Disable All AI Agents', description: 'Immediately halt all AI agent operations across all applications.', icon: '🤖', severity: 'critical', active: false },
    { id: 'dis_2', label: 'Lock All Logins', description: 'Block all user authentication. Only Super Admins can access.', icon: '🔒', severity: 'critical', active: false },
    { id: 'dis_3', label: 'Rotate API Keys', description: 'Invalidate and regenerate all production API keys.', icon: '🔑', severity: 'high', active: false },
    { id: 'dis_4', label: 'Maintenance Mode', description: 'Show maintenance page to all users. Disable all writes.', icon: '🚧', severity: 'high', active: false },
    { id: 'dis_5', label: 'Freeze Billing', description: 'Pause all billing operations, subscriptions, and charges.', icon: '💳', severity: 'medium', active: false },
    { id: 'dis_6', label: 'Pause All Automations', description: 'Halt all automated workflows, triggers, and scheduled jobs.', icon: '⏸️', severity: 'medium', active: false },
  ]);

  // === Section 4: Costs & Orgs ===
  const costs: CostBreakdown[] = [
    { category: 'AI Models', icon: '🤖', costUsd: 64.50, budgetUsd: 80.00, trend: 12 },
    { category: 'Database & Storage', icon: '🗄️', costUsd: 42.10, budgetUsd: 60.00, trend: 3 },
    { category: 'Compute & Cloud Run', icon: '☁️', costUsd: 32.30, budgetUsd: 50.00, trend: -2 },
    { category: 'API & Third-Party', icon: '🔌', costUsd: 18.40, budgetUsd: 25.00, trend: 8 },
    { category: 'CDN & Bandwidth', icon: '🌐', costUsd: 12.80, budgetUsd: 20.00, trend: -5 },
    { category: 'Support & Tooling', icon: '🛠️', costUsd: 8.20, budgetUsd: 15.00, trend: 0 },
  ];

  const organizations: Organization[] = [
    { id: 'org_1', name: 'OLADIZZ Corp', appCount: 8, userCount: 2493, aiAgentCount: 38, plan: 'Enterprise', health: 'healthy', mrr: 48200 },
    { id: 'org_2', name: 'TechStart Inc', appCount: 3, userCount: 142, aiAgentCount: 5, plan: 'Growth', health: 'healthy', mrr: 4800 },
    { id: 'org_3', name: 'EduGlobal', appCount: 2, userCount: 8400, aiAgentCount: 8, plan: 'Enterprise', health: 'degraded', mrr: 12600 },
    { id: 'org_4', name: 'RepairNet', appCount: 1, userCount: 95, aiAgentCount: 2, plan: 'Starter', health: 'healthy', mrr: 990 },
  ];

  // === Section 5: Briefing ===
  const briefingItems: BriefingItem[] = [
    { icon: '📈', message: 'Revenue increased 8% month-over-month. Total MRR is now $66,590 across 4 organizations.', type: 'positive' },
    { icon: '⚠️', message: 'Two AI agents (Finance AI, Analytics AI) exceeded their daily token budget this week. Combined overage: $14.20.', type: 'warning' },
    { icon: '🔴', message: 'CRM Engine has elevated error rates (0.08%) — 4× above baseline. Root cause: unindexed query on contacts table.', type: 'warning' },
    { icon: '🛡️', message: 'Three critical security alerts need review: credential stuffing attempt (resolved), suspicious API key usage, and unauthorized admin role assignment.', type: 'warning' },
    { icon: '✅', message: 'Support resolution time improved 11% this week. Support AI resolved 89 tickets autonomously with 96% satisfaction.', type: 'positive' },
    { icon: '🎓', message: 'SchoolTrack onboarded 420 new students this week. Education AI graded 430 assessments with 99.2% accuracy.', type: 'positive' },
  ];

  // === Handlers ===
  const handleAgentAction = (agentId: string, action: string) => {
    setAiAgents(prev => prev.map(a => {
      if (a.id !== agentId) return a;
      if (action === 'pause') return { ...a, status: 'paused' as const };
      if (action === 'resume') return { ...a, status: 'running' as const };
      if (action === 'restart') return { ...a, status: 'running' as const };
      return a;
    }));
  };

  const handleResolveEvent = (id: string) => {
    setSecEvents(prev => prev.map(e => e.id === id ? { ...e, resolved: true } : e));
  };

  const handleToggleDisaster = (id: string) => {
    setDisasters(prev => prev.map(d => d.id === id ? { ...d, active: !d.active } : d));
  };

  const tabs = [
    { id: 'overview' as const, label: '1. Ecosystem & Health', icon: Globe },
    { id: 'ai_command' as const, label: '2. AI Command & Governance', icon: Bot },
    { id: 'security' as const, label: '3. Security & Disaster', icon: Shield },
    { id: 'cost_orgs' as const, label: '4. Cost & Organizations', icon: DollarSign },
    { id: 'briefing' as const, label: '5. Executive Briefing & AI', icon: Sparkles },
    { id: 'digital_twin' as const, label: '6. ⭐ Digital Twin', icon: Network },
  ];

  return (
    <div className="space-y-6 w-full font-sans">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#262626]">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Crown className="w-6 h-6 text-[#2266ec]" /> Tool #10: Enterprise Control Center
          </h1>
          <p className="text-xs text-[#a6a6a6] mt-1">
            The brain of the Admin OS. Executive command center for the entire ecosystem — platform health, AI governance, security, cost intelligence, and the ⭐ Digital Twin.
          </p>
        </div>
      </div>

      {/* 6 Navigation Tabs */}
      <div className="flex items-center gap-1.5 border-b border-[#262626] pb-3 overflow-x-auto hide-scrollbar text-xs font-semibold">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl border transition-all shrink-0 flex items-center gap-2 ${
                isActive
                  ? 'bg-[#2266ec] border-[#2266ec] text-white shadow-lg shadow-[#2266ec]/20'
                  : 'bg-[#1a1a1a] border-[#262626] text-[#a6a6a6] hover:text-white hover:bg-[#262626]'
              }`}
            >
              <Icon className="w-4 h-4" /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Renderers */}
      {activeTab === 'overview' && (
        <EcosystemOverview kpis={kpis} health={health} apps={apps} onSelectApp={(id) => toast(`Selected app: ${id}`, { type: 'info' })} />
      )}
      {activeTab === 'ai_command' && (
        <AICommandGovernance agents={aiAgents} governance={governance} onAgentAction={handleAgentAction} />
      )}
      {activeTab === 'security' && (
        <SecurityDisasterCenter securityEvents={secEvents} disasterControls={disasters} onResolveEvent={handleResolveEvent} onToggleDisaster={handleToggleDisaster} />
      )}
      {activeTab === 'cost_orgs' && (
        <CostOrganizations costs={costs} organizations={organizations} />
      )}
      {activeTab === 'briefing' && (
        <ExecutiveBriefingAI briefingItems={briefingItems} />
      )}
      {activeTab === 'digital_twin' && <DigitalTwinEngine />}
    </div>
  );
}
