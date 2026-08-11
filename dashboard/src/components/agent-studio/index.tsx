"use client";

import React, { useState } from 'react';
import { Bot, Network, ListTodo, Zap, Shield } from 'lucide-react';
import { AIAgent, AutonomyLevel } from './types';
import { AgentRegistry } from './agent-registry';
import { SwarmCollaboration } from './swarm-collaboration';
import { ReasoningTaskQueue } from './reasoning-task-queue';
import { AgentPerformanceStudio } from './agent-performance';
import { toast } from '@/components/ui/toast';

export function UniversalAgentStudio() {
  const [activeTab, setActiveTab] = useState<'registry' | 'swarm' | 'tasks' | 'performance'>('registry');

  const [agents, setAgents] = useState<AIAgent[]>([
    {
      id: 'a_exec',
      name: 'CEO Executive Agent',
      role: 'Master Orchestrator',
      avatar: '👑',
      status: 'running',
      autonomyLevel: 'operator',
      model: 'gemini-2.5-pro',
      provider: 'Google AI',
      version: '2.4.0',
      systemPrompt: 'You are the CEO Executive Agent. Coordinate specialized agents, analyze cross-module findings, and compose investigation workspaces.',
      capabilities: [
        { name: 'Can Read Telemetry & Data', allowed: true },
        { name: 'Can Modify Layout & Widgets', allowed: true },
        { name: 'Can Delete Data Records', allowed: false },
        { name: 'Can Delegate to Swarms', allowed: true }
      ],
      skills: [],
      tools: [],
      performance: { tasksCompleted: 142, successRate: 98.4, avgExecutionTimeMs: 420, tokenCostUsd: 14.80, userRating: 4.9 }
    },
    {
      id: 'a_analytics',
      name: 'Analytics Agent',
      role: 'Telemetry Analyst',
      avatar: '📊',
      status: 'running',
      autonomyLevel: 'advisor',
      model: 'gemini-2.5-flash',
      provider: 'Google AI',
      version: '2.1.0',
      systemPrompt: 'You are the Analytics Agent. Inspect user conversion funnels, regional traffic heatmaps, and retention metrics.',
      capabilities: [
        { name: 'Can Read Telemetry & Data', allowed: true },
        { name: 'Can Modify Layout & Widgets', allowed: true },
        { name: 'Can Delete Data Records', allowed: false },
        { name: 'Can Delegate to Swarms', allowed: false }
      ],
      skills: [],
      tools: [],
      performance: { tasksCompleted: 380, successRate: 99.1, avgExecutionTimeMs: 280, tokenCostUsd: 8.40, userRating: 4.8 }
    },
    {
      id: 'a_fin',
      name: 'Finance Agent',
      role: 'Treasury Analyst',
      avatar: '💰',
      status: 'sleeping',
      autonomyLevel: 'observer',
      model: 'gemini-2.5-pro',
      provider: 'Google AI',
      version: '1.9.0',
      systemPrompt: 'You are the Finance Agent. Inspect ARR, MRR, auto-renewal drop-offs, and transaction logs.',
      capabilities: [
        { name: 'Can Read Telemetry & Data', allowed: true },
        { name: 'Can Modify Layout & Widgets', allowed: false },
        { name: 'Can Delete Data Records', allowed: false },
        { name: 'Can Delegate to Swarms', allowed: false }
      ],
      skills: [],
      tools: [],
      performance: { tasksCompleted: 89, successRate: 96.5, avgExecutionTimeMs: 510, tokenCostUsd: 12.10, userRating: 4.7 }
    },
    {
      id: 'a_ecommerce',
      name: 'Oladizz AI Agent',
      role: 'Store Manager',
      avatar: '🛍️',
      status: 'running',
      autonomyLevel: 'operator',
      model: 'gemini-1.5-flash',
      provider: 'Google AI',
      version: '1.0.0',
      systemPrompt: 'You are an AI Admin Assistant for Oladizz store. You have direct access to the store\'s entire live database. You can analyze data, write product descriptions, and create products using tools.',
      capabilities: [
        { name: 'Can Read Store Data', allowed: true },
        { name: 'Can Modify Products', allowed: true },
        { name: 'Can Delete Data Records', allowed: false },
        { name: 'Can Delegate to Swarms', allowed: false }
      ],
      skills: [],
      tools: [{ id: 'tool-1', name: 'create_product', description: 'Creates a new product', enabled: true }],
      performance: { tasksCompleted: 12, successRate: 100, avgExecutionTimeMs: 820, tokenCostUsd: 0.45, userRating: 5.0 }
    }
  ]);

  const handleToggleStatus = (agentId: string) => {
    setAgents(prev => prev.map(a => {
      if (a.id === agentId) {
        const nextStatus = a.status === 'running' ? 'paused' : 'running';
        toast(`Worker ${a.name} is now ${nextStatus.toUpperCase()}`, { type: 'info' });
        return { ...a, status: nextStatus };
      }
      return a;
    }));
  };

  const handleUpdateAutonomy = (agentId: string, level: AutonomyLevel) => {
    setAgents(prev => prev.map(a => {
      if (a.id === agentId) {
        toast(`Updated autonomy level for ${a.name} to ${level.toUpperCase()}`, { type: 'success' });
        return { ...a, autonomyLevel: level };
      }
      return a;
    }));
  };

  return (
    <div className="space-y-6 w-full font-sans">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#262626]">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Bot className="w-6 h-6 text-[#2266ec]" /> Tool #5: AI Agent Studio (AI-Native OS Workers)
          </h1>
          <p className="text-xs text-[#a6a6a6] mt-1">
            Create, deploy, monitor, and collaborate with AI Workers across 4 Autonomy Levels (Observer, Advisor, Operator, Autonomous) and ⭐ Swarm Delegations.
          </p>
        </div>
      </div>

      {/* 4 Navigation Tabs */}
      <div className="flex items-center gap-1.5 border-b border-[#262626] pb-3 overflow-x-auto hide-scrollbar text-xs font-semibold">
        {[
          { id: 'registry', label: '1. AI Agent Registry & Autonomy', icon: Bot },
          { id: 'swarm', label: '2. ⭐ Multi-Agent Swarm Collaboration', icon: Network },
          { id: 'tasks', label: '3. Task Queue & Reasoning Log', icon: ListTodo },
          { id: 'performance', label: '4. Token Performance & Prompt Studio', icon: Zap },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
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
      {activeTab === 'registry' && (
        <AgentRegistry
          agents={agents}
          onToggleStatus={handleToggleStatus}
          onUpdateAutonomy={handleUpdateAutonomy}
          onSelectAgent={(agent) => toast(`Selected ${agent.name} for configuration`, { type: 'info' })}
        />
      )}

      {activeTab === 'swarm' && <SwarmCollaboration agents={agents} />}

      {activeTab === 'tasks' && <ReasoningTaskQueue />}

      {activeTab === 'performance' && <AgentPerformanceStudio agents={agents} />}
    </div>
  );
}
