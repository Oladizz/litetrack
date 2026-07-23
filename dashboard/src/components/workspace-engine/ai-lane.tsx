"use client";

import React, { useState } from 'react';
import {
  Sparkles, AlertTriangle, TrendingUp, Info, ChevronRight,
  Bot, Loader2, Check, Send, PanelRightClose, PanelRight,
  Lightbulb, Shield, Zap
} from 'lucide-react';
import { AIInsight, RunningAgent, AILevel } from './types';

interface Props {
  insights: AIInsight[];
  runningAgents: RunningAgent[];
  aiLevel: AILevel;
  onAILevelChange: (level: AILevel) => void;
  onExecuteSuggestion: (insightId: string) => void;
}

const SEVERITY_STYLES: Record<string, { color: string; bg: string; icon: React.ReactNode }> = {
  info: { color: 'text-[#2266ec]', bg: 'bg-[#2266ec]/10', icon: <Info className="w-3 h-3" /> },
  warning: { color: 'text-amber-400', bg: 'bg-amber-500/10', icon: <AlertTriangle className="w-3 h-3" /> },
  opportunity: { color: 'text-green-400', bg: 'bg-green-500/10', icon: <TrendingUp className="w-3 h-3" /> },
  critical: { color: 'text-red-400', bg: 'bg-red-500/10', icon: <Shield className="w-3 h-3" /> },
};

const AGENT_STATUS_STYLES: Record<string, { color: string; animation: string }> = {
  running: { color: 'text-green-400', animation: '' },
  thinking: { color: 'text-purple-400', animation: 'animate-pulse' },
  waiting: { color: 'text-amber-400', animation: '' },
  done: { color: 'text-[#656565]', animation: '' },
};

const AI_LEVEL_CONFIG: Record<AILevel, { label: string; icon: React.ReactNode; color: string; description: string }> = {
  passive: { label: 'Passive', icon: <Info className="w-3 h-3" />, color: 'text-[#656565] bg-[#333]/30 border-[#333]', description: 'Observes & surfaces insights' },
  assistive: { label: 'Assistive', icon: <Lightbulb className="w-3 h-3" />, color: 'text-[#2266ec] bg-[#2266ec]/10 border-[#2266ec]/30', description: 'Suggests actions & layouts' },
  autonomous: { label: 'Autonomous', icon: <Zap className="w-3 h-3" />, color: 'text-purple-400 bg-purple-500/10 border-purple-500/30', description: 'Acts within permissions' },
};

export function AILane({ insights, runningAgents, aiLevel, onAILevelChange, onExecuteSuggestion }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const [aiInput, setAiInput] = useState('');

  if (collapsed) {
    return (
      <div className="w-10 bg-[#0f0f0f] border-l border-[#262626] flex flex-col items-center py-3 gap-3 shrink-0">
        <button onClick={() => setCollapsed(false)} className="p-1.5 rounded-lg hover:bg-[#1a1a1a] text-[#656565] hover:text-purple-400 transition-colors" title="Expand AI Lane">
          <PanelRight className="w-4 h-4" />
        </button>
        <div className="w-5 h-px bg-[#262626]" />
        <Sparkles className="w-4 h-4 text-purple-400" />
        {insights.filter(i => i.severity === 'critical' || i.severity === 'warning').length > 0 && (
          <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
        )}
        <div className="mt-auto">
          {runningAgents.filter(a => a.status === 'running' || a.status === 'thinking').length > 0 && (
            <Loader2 className="w-3.5 h-3.5 text-purple-400 animate-spin" />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-64 bg-[#0f0f0f] border-l border-[#262626] flex flex-col shrink-0 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-[#262626]">
        <span className="text-[10px] text-purple-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3 h-3" /> AI Lane
        </span>
        <button onClick={() => setCollapsed(true)} className="p-1 rounded text-[#656565] hover:text-white transition-colors" title="Collapse">
          <PanelRightClose className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* AI Level Selector */}
      <div className="px-3 py-2 border-b border-[#262626] space-y-1.5">
        <div className="text-[9px] text-[#656565] font-semibold uppercase">AI Mode</div>
        <div className="flex gap-1">
          {(Object.keys(AI_LEVEL_CONFIG) as AILevel[]).map(level => {
            const cfg = AI_LEVEL_CONFIG[level];
            const isActive = aiLevel === level;
            return (
              <button
                key={level}
                onClick={() => onAILevelChange(level)}
                className={`flex-1 flex items-center justify-center gap-1 px-1.5 py-1 rounded-lg border text-[9px] font-semibold transition-all ${
                  isActive ? cfg.color : 'text-[#656565] bg-[#121212] border-[#262626]'
                }`}
                title={cfg.description}
              >
                {cfg.icon} {cfg.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto space-y-3 p-3">
        {/* Insights */}
        <div className="space-y-1.5">
          <div className="text-[9px] text-[#656565] font-semibold uppercase">Insights & Recommendations</div>
          {insights.map(insight => {
            const sev = SEVERITY_STYLES[insight.severity];
            return (
              <div key={insight.id} className={`rounded-lg border border-[#262626] p-2.5 space-y-1.5 ${sev.bg}`}>
                <div className="flex items-start gap-1.5">
                  <span className={`mt-0.5 shrink-0 ${sev.color}`}>{sev.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className={`text-[10px] leading-relaxed ${sev.color}`}>{insight.message}</div>
                    <div className="flex items-center gap-2 mt-1 text-[8px] text-[#656565] font-mono">
                      <span>{insight.source}</span>
                      <span>·</span>
                      <span>{insight.confidence}%</span>
                      <span>·</span>
                      <span>{insight.timestamp}</span>
                    </div>
                  </div>
                </div>
                {insight.actionable && insight.suggestedAction && (
                  <button
                    onClick={() => onExecuteSuggestion(insight.id)}
                    className="w-full text-[9px] text-[#2266ec] font-semibold flex items-center justify-center gap-1 py-1 rounded border border-[#2266ec]/20 hover:bg-[#2266ec]/10 transition-colors"
                  >
                    {insight.suggestedAction} <ChevronRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Running Agents */}
        <div className="space-y-1.5">
          <div className="text-[9px] text-[#656565] font-semibold uppercase">Running Agents</div>
          {runningAgents.map(agent => {
            const st = AGENT_STATUS_STYLES[agent.status];
            return (
              <div key={agent.id} className="bg-[#121212] border border-[#262626] rounded-lg p-2.5 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{agent.avatar}</span>
                  <span className="text-[10px] font-semibold text-white truncate">{agent.name}</span>
                  <span className={`text-[8px] font-bold capitalize ml-auto ${st.color} ${st.animation}`}>{agent.status}</span>
                </div>
                <div className="text-[9px] text-[#656565] truncate">{agent.task}</div>
                {agent.progress > 0 && agent.progress < 100 && (
                  <div className="w-full h-1 bg-[#262626] rounded-full overflow-hidden">
                    <div className="h-full bg-purple-400 rounded-full transition-all" style={{ width: `${agent.progress}%` }} />
                  </div>
                )}
                {agent.status === 'done' && (
                  <div className="flex items-center gap-1 text-[9px] text-green-400"><Check className="w-3 h-3" /> Complete</div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Quick Input */}
      <div className="px-3 py-2 border-t border-[#262626]">
        <div className="flex items-center gap-1.5 bg-[#121212] border border-[#262626] rounded-lg px-2.5 py-1.5">
          <Sparkles className="w-3 h-3 text-purple-400 shrink-0" />
          <input
            type="text"
            value={aiInput}
            onChange={e => setAiInput(e.target.value)}
            placeholder="Ask AI..."
            className="flex-1 bg-transparent text-[10px] text-white outline-none placeholder:text-[#656565]"
          />
          <button className={`shrink-0 ${aiInput ? 'text-purple-400' : 'text-[#333]'}`}>
            <Send className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
