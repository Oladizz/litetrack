"use client";

import React, { useState } from 'react';
import { Network, Sparkles, ArrowRight, CornerDownLeft, CheckCircle2, Shield, Layers } from 'lucide-react';
import { SwarmReport, AIAgent } from './types';
import { toast } from '@/components/ui/toast';

interface SwarmProps {
  agents: AIAgent[];
}

export function SwarmCollaboration({ agents }: SwarmProps) {
  const [prompt, setPrompt] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [report, setReport] = useState<SwarmReport | null>(null);

  const handleRunSwarm = () => {
    if (!prompt.trim()) return;

    setIsExecuting(true);
    toast('CEO Agent spawned parallel swarm delegation...', { type: 'info' });

    setTimeout(() => {
      setIsExecuting(false);
      setReport({
        prompt: prompt,
        ceoSummary: 'Executive Synthesis Brief: User retention dipped 8.4% over the last 60 days. The drop is concentrated among low-tier plans in West Africa following the recent checkout API migration and pricing updates.',
        subAgentFindings: [
          {
            agentName: 'Analytics Agent',
            role: 'Usage Telemetry',
            finding: 'Lagos regional retention dropped from 74% to 61% post-migration.',
            metrics: { retentionDelta: '-13%', activeUsers: '14,200' }
          },
          {
            agentName: 'Finance Agent',
            role: 'Revenue & Pricing',
            finding: 'Monthly Recurring Revenue (MRR) fell $4,200 due to failed auto-renewals.',
            metrics: { mrrLoss: '-$4,200', failedRenewals: '114' }
          },
          {
            agentName: 'Support Agent',
            role: 'Customer Complaints',
            finding: 'Tickets related to "Payment Timeout" spiked 340% between 2:00 PM - 5:00 PM.',
            metrics: { ticketSpike: '+340%', primaryCategory: 'Payment Timeout' }
          },
          {
            agentName: 'Developer Agent',
            role: 'System Logs',
            finding: 'Stripe webhook endpoint returned HTTP 504 Gateway Timeout during peak hours.',
            metrics: { error504Count: '482', affectedRoute: '/api/v2/webhooks/stripe' }
          }
        ],
        uiIntentionsProposed: [
          'Created Temporary Retention Investigation Workspace',
          'Inserted Payment Gateway Latency Chart',
          'Inserted Regional Failure Heatmap',
          'Pinned Support Ticket Stream Widget'
        ]
      });

      toast('Swarm synthesis complete!', { type: 'success' });
    }, 1200);
  };

  return (
    <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-5 shadow-xl space-y-6 font-sans">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-[#262626] pb-4">
        <div>
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <Network className="w-5 h-5 text-purple-400" /> ⭐ Multi-Agent AI Organization & Swarm Collaboration
          </h3>
          <p className="text-xs text-[#a6a6a6] mt-0.5">
            CEO Agent delegates complex prompts across specialized AI agents in parallel, merging their findings into a single report.
          </p>
        </div>

        <span className="text-xs bg-purple-500/10 text-purple-400 border border-purple-500/20 px-3 py-1 rounded-full font-mono font-semibold">
          5 Active Swarm Workers
        </span>
      </div>

      {/* Swarm Prompt Input */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-[#656565] uppercase font-mono block">Submit Complex Executive Prompt to AI Swarm</label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleRunSwarm(); }}
            placeholder="e.g. Why has user retention dropped over the last two months, and what should we do?"
            className="flex-1 bg-[#121212] border border-[#333] rounded-xl px-4 py-2.5 text-xs text-white outline-none placeholder:text-[#656565] font-sans focus:border-purple-500 transition-colors"
          />
          <button
            onClick={handleRunSwarm}
            disabled={isExecuting}
            className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 shadow-lg shadow-purple-600/20 disabled:opacity-50"
          >
            {isExecuting ? 'Delegating Swarm...' : 'Delegate Swarm'} <CornerDownLeft className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Live Swarm Delegation Report */}
      {report && (
        <div className="bg-[#121212] border border-purple-500/30 rounded-xl p-5 space-y-5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-[#262626] pb-3">
            <div className="flex items-center gap-2 text-xs font-bold text-purple-400">
              <Sparkles className="w-4 h-4" /> CEO Agent Synthesized Swarm Report
            </div>
            <span className="text-[10px] text-[#656565] font-mono">Parallel Execution: 4 Sub-Agents</span>
          </div>

          {/* CEO Executive Summary */}
          <div className="bg-[#1a1a1a] p-4 rounded-xl border border-[#262626]">
            <p className="text-xs text-white font-medium leading-relaxed">{report.ceoSummary}</p>
          </div>

          {/* 4 Specialized Sub-Agent Findings */}
          <div className="space-y-2">
            <label className="text-[10px] text-[#656565] font-mono uppercase block">Specialized Agent Findings Grid</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {report.subAgentFindings.map(f => (
                <div key={f.agentName} className="bg-[#1a1a1a] p-3.5 rounded-xl border border-[#262626] space-y-2 text-xs font-mono">
                  <div className="flex items-center justify-between">
                    <span className="text-purple-400 font-bold">{f.agentName}</span>
                    <span className="text-[10px] text-[#656565] bg-[#121212] px-1.5 py-0.5 rounded border border-[#262626]">
                      {f.role}
                    </span>
                  </div>
                  <p className="text-white text-[11px] leading-snug">{f.finding}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Autonomous UI Actions Proposed */}
          <div className="space-y-2 border-t border-[#262626] pt-3">
            <label className="text-[10px] text-[#656565] font-mono uppercase block">Proposed UI Intentions Executed</label>
            <div className="flex flex-wrap gap-2">
              {report.uiIntentionsProposed.map(intent => (
                <span key={intent} className="bg-green-500/10 text-green-400 border border-green-500/20 px-2.5 py-1 rounded text-[11px] font-mono flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {intent}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
