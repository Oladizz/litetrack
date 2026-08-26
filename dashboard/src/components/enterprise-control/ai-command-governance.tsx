"use client";
import { IconRenderer } from '@/components/ui/IconRenderer';
import React, { useState } from 'react';
import {
  Bot, Play, Pause, RotateCcw, ArrowUpCircle, Brain, Eye,
  ShieldCheck, Check, X, Clock, Undo2, Sparkles, ChevronDown, ChevronRight
} from 'lucide-react';
import { AIFleetAgent, AIGovernanceEntry } from './types';
import { toast } from '@/components/ui/toast';

interface Props {
  agents: AIFleetAgent[];
  governance: AIGovernanceEntry[];
  onAgentAction: (agentId: string, action: string) => void;
}

const STATUS_STYLES: Record<string, { color: string; bg: string; dot: string }> = {
  running: { color: 'text-green-400', bg: 'bg-green-500/20', dot: 'bg-green-400' },
  paused: { color: 'text-amber-400', bg: 'bg-amber-500/20', dot: 'bg-amber-400' },
  busy: { color: 'text-[#2266ec]', bg: 'bg-[#2266ec]/20', dot: 'bg-[#2266ec] animate-pulse' },
  idle: { color: 'text-[#656565]', bg: 'bg-[#333]/30', dot: 'bg-[#656565]' },
  error: { color: 'text-red-400', bg: 'bg-red-500/20', dot: 'bg-red-400 animate-pulse' },
};

const AUTONOMY_COLORS: Record<string, string> = {
  observer: 'bg-[#333]/40 text-[#a6a6a6]',
  advisor: 'bg-[#2266ec]/20 text-[#2266ec]',
  operator: 'bg-amber-500/20 text-amber-400',
  autonomous: 'bg-purple-500/20 text-purple-400',
};

const APPROVAL_STYLES: Record<string, { color: string; bg: string }> = {
  auto_approved: { color: 'text-green-400', bg: 'bg-green-500/20' },
  pending: { color: 'text-amber-400', bg: 'bg-amber-500/20' },
  approved: { color: 'text-green-400', bg: 'bg-green-500/20' },
  rejected: { color: 'text-red-400', bg: 'bg-red-500/20' },
};

export function AICommandGovernance({ agents, governance, onAgentAction }: Props) {
  const [expandedAgent, setExpandedAgent] = useState<string | null>(null);
  const [govFilter, setGovFilter] = useState<'all' | 'pending' | 'auto_approved'>('all');

  const filteredGov = govFilter === 'all' ? governance : governance.filter(g => g.approvalStatus === govFilter);

  return (
    <div className="space-y-6 font-sans">
      {/* AI Fleet Command */}
      <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#262626] pb-3">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <Bot className="w-4 h-4 text-purple-400" /> AI Fleet Command
          </h3>
          <span className="text-[10px] text-[#656565] font-mono">
            {agents.filter(a => a.status === 'running' || a.status === 'busy').length}/{agents.length} active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
          {agents.map(agent => {
            const st = STATUS_STYLES[agent.status];
            const isExpanded = expandedAgent === agent.id;
            return (
              <div key={agent.id} className="bg-[#121212] border border-[#262626] rounded-xl p-4 space-y-3 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <IconRenderer name={agent.avatar} className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="font-bold text-white text-xs">{agent.name}</div>
                      <div className="text-[9px] text-[#656565] font-mono">{agent.model}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${st.dot}`} />
                    <span className={`text-[9px] font-bold capitalize ${st.color}`}>{agent.status}</span>
                  </div>
                </div>

                <div className="text-[10px] text-[#a6a6a6] truncate">{agent.activeTask}</div>

                <div className="flex items-center gap-2 text-[9px] font-mono text-[#656565]">
                  <span className={`px-1.5 py-0.5 rounded capitalize ${AUTONOMY_COLORS[agent.autonomyLevel]}`}>
                    {agent.autonomyLevel}
                  </span>
                  <span>{agent.decisionsToday} decisions</span>
                  <span>${agent.tokenCostUsd.toFixed(2)}</span>
                </div>

                {/* Action Bar */}
                <div className="flex items-center gap-1 pt-1 border-t border-[#262626]">
                  {agent.status === 'running' || agent.status === 'busy' ? (
                    <button onClick={() => { onAgentAction(agent.id, 'pause'); toast(`${agent.name} paused`, { type: 'info' }); }} className="p-1.5 rounded-lg bg-[#1a1a1a] border border-[#262626] text-amber-400 hover:bg-amber-500/10 text-[10px] flex items-center gap-1" title="Pause">
                      <Pause className="w-3 h-3" /> Pause
                    </button>
                  ) : (
                    <button onClick={() => { onAgentAction(agent.id, 'resume'); toast(`${agent.name} resumed`, { type: 'success' }); }} className="p-1.5 rounded-lg bg-[#1a1a1a] border border-[#262626] text-green-400 hover:bg-green-500/10 text-[10px] flex items-center gap-1" title="Resume">
                      <Play className="w-3 h-3" /> Resume
                    </button>
                  )}
                  <button onClick={() => { onAgentAction(agent.id, 'restart'); toast(`${agent.name} restarting`, { type: 'info' }); }} className="p-1.5 rounded-lg bg-[#1a1a1a] border border-[#262626] text-[#656565] hover:text-white text-[10px] flex items-center gap-1" title="Restart">
                    <RotateCcw className="w-3 h-3" />
                  </button>
                  <button onClick={() => setExpandedAgent(isExpanded ? null : agent.id)} className="p-1.5 rounded-lg bg-[#1a1a1a] border border-[#262626] text-[#656565] hover:text-[#2266ec] text-[10px] flex items-center gap-1 ml-auto" title="Inspect">
                    <Brain className="w-3 h-3" /> {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                  </button>
                </div>

                {isExpanded && (
                  <div className="bg-[#0f0f0f] border border-[#262626] rounded-lg p-3 space-y-2 text-[10px]">
                    <div className="text-[#656565] font-semibold">Memory & Inspection</div>
                    <div className="text-[#a6a6a6]">Active task: <span className="text-white">{agent.activeTask}</span></div>
                    <div className="text-[#a6a6a6]">Decisions today: <span className="text-white">{agent.decisionsToday}</span></div>
                    <div className="text-[#a6a6a6]">Token cost today: <span className="text-green-400">${agent.tokenCostUsd.toFixed(2)}</span></div>
                    <div className="text-[#a6a6a6]">Autonomy: <span className="text-purple-400 capitalize">{agent.autonomyLevel}</span></div>
                    <div className="text-[#a6a6a6]">Model: <span className="text-white">{agent.model}</span></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Governance & Audit Trail */}
      <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#262626] pb-3">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <Eye className="w-4 h-4 text-amber-400" /> AI Governance & Audit Trail
          </h3>
          <div className="flex items-center gap-1.5 text-[9px] font-semibold">
            {(['all', 'pending', 'auto_approved'] as const).map(f => (
              <button key={f} onClick={() => setGovFilter(f)} className={`px-2 py-1 rounded-lg border transition-all capitalize ${govFilter === f ? 'bg-[#2266ec] border-[#2266ec] text-white' : 'bg-[#121212] border-[#262626] text-[#656565]'}`}>
                {f.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {filteredGov.map(g => {
            const apStyle = APPROVAL_STYLES[g.approvalStatus];
            return (
              <div key={g.id} className="bg-[#121212] border border-[#262626] rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-xs">{g.agent}</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${apStyle.bg} ${apStyle.color}`}>
                      {g.approvalStatus.replace('_', ' ')}
                    </span>
                    {g.rollbackAvailable && (
                      <span className="text-[8px] bg-[#2266ec]/10 text-[#2266ec] px-1 py-0.5 rounded flex items-center gap-0.5">
                        <Undo2 className="w-2.5 h-2.5" /> Rollback
                      </span>
                    )}
                  </div>
                  <span className="text-[9px] text-[#656565] font-mono">{g.timestamp}</span>
                </div>

                <div className="text-xs text-white font-semibold">{g.action}</div>
                <div className="text-[10px] text-[#a6a6a6]">{g.reason}</div>

                <div className="flex items-center gap-3 text-[9px] text-[#656565] font-mono pt-1 border-t border-[#262626]">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-purple-400" />
                    Confidence: <span className={g.confidenceScore >= 90 ? 'text-green-400' : 'text-amber-400'}>{g.confidenceScore}%</span>
                  </span>
                  <span>Tools: {g.toolsUsed.join(', ')}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
