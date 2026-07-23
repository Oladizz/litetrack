"use client";

import React, { useState, useEffect, useCallback } from 'react';
import {
  Users, Bot, Plus, FolderOpen, Archive, Sparkles, ArrowDown,
  FileText, Send, MessageSquare
} from 'lucide-react';
import { SharedWorkspace } from './types';
import { toast } from '@/components/ui/toast';

interface AIChatMessage {
  id: string;
  agent: string;
  agentAvatar: string;
  role: string;
  content: string;
  timestamp: string;
}

interface Props {
  workspaces: SharedWorkspace[];
}

export function WorkspacesAICollab({ workspaces }: Props) {
  const [selectedWs, setSelectedWs] = useState<string | null>(workspaces[0]?.id ?? null);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiThread, setAiThread] = useState<AIChatMessage[]>([
    { id: 'ai_1', agent: 'John', agentAvatar: '👤', role: 'Operations Lead', content: 'Why is churn increasing this quarter? Can the team investigate?', timestamp: '10:00 AM' },
    { id: 'ai_2', agent: 'Analytics AI', agentAvatar: '📊', role: 'Data Analyst', content: 'I analyzed the retention data. Churn increased 18% in the last 30 days, concentrated in the SMB segment. The primary drop-off point is Day 14 post-signup, which correlates with the end of the free trial period. I found 3 cohorts with significantly higher churn rates.', timestamp: '10:01 AM' },
    { id: 'ai_3', agent: 'Marketing AI', agentAvatar: '📢', role: 'Campaign Strategist', content: 'I checked our recent campaigns. The Q2 acquisition campaign shifted focus to enterprise leads, reducing SMB-targeted onboarding emails by 40%. The welcome sequence completion rate dropped from 72% to 51%. This likely contributed to higher churn in the SMB segment.', timestamp: '10:02 AM' },
    { id: 'ai_4', agent: 'Support AI', agentAvatar: '🎧', role: 'Customer Success', content: 'I reviewed 847 support tickets from churned users. Top complaints: (1) Pricing confusion after trial ends — 34%, (2) Missing integration with Slack — 22%, (3) Onboarding too complex — 18%. I recommend prioritizing a pricing page redesign and simplified onboarding flow.', timestamp: '10:03 AM' },
    { id: 'ai_5', agent: 'Developer AI', agentAvatar: '💻', role: 'Engineering Lead', content: 'I checked the last 3 releases. v2.3.0 introduced a breaking change to the webhook API that affected 12% of integrations. Additionally, the Slack integration was deprioritized in Sprint 14. I can prepare a hotfix and re-prioritize the Slack integration for Sprint 16.', timestamp: '10:04 AM' },
  ]);
  const [showReport, setShowReport] = useState(false);

  const handleSendPrompt = () => {
    if (!aiPrompt.trim()) return;
    const newMsg: AIChatMessage = {
      id: `ai_user_${Date.now()}`,
      agent: 'You',
      agentAvatar: '👤',
      role: 'Admin',
      content: aiPrompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setAiThread(prev => [...prev, newMsg]);
    setAiPrompt('');
    toast('Message sent to AI team', { type: 'info' });
  };

  const generateReport = () => {
    setShowReport(true);
    toast('Shared investigation report generated', { type: 'success' });
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Shared Workspaces */}
      <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#262626] pb-3">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <FolderOpen className="w-4 h-4 text-[#2266ec]" /> Shared Workspaces
          </h3>
          <button
            onClick={() => toast('Create new workspace', { type: 'info' })}
            className="text-[10px] bg-[#2266ec] text-white px-3 py-1 rounded-lg font-semibold flex items-center gap-1"
          >
            <Plus className="w-3 h-3" /> New Workspace
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {workspaces.map(ws => {
            const isSelected = selectedWs === ws.id;
            return (
              <button
                key={ws.id}
                onClick={() => setSelectedWs(ws.id)}
                className={`text-left bg-[#121212] rounded-xl border p-4 space-y-3 transition-all ${
                  isSelected
                    ? 'border-[#2266ec] shadow-lg shadow-[#2266ec]/10 ring-1 ring-[#2266ec]/30'
                    : 'border-[#262626] hover:border-[#333]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">{ws.name}</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                    ws.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-[#333]/40 text-[#656565]'
                  }`}>
                    {ws.status}
                  </span>
                </div>
                <div className="text-[10px] text-[#656565] line-clamp-2">{ws.description}</div>

                {/* Members */}
                <div className="flex items-center gap-1">
                  {ws.members.slice(0, 5).map((m, i) => (
                    <div
                      key={i}
                      className="w-6 h-6 rounded-full bg-[#1a1a1a] border border-[#262626] flex items-center justify-center text-[10px]"
                      title={`${m.name} (${m.type})`}
                    >
                      {m.avatar}
                    </div>
                  ))}
                  {ws.members.length > 5 && (
                    <span className="text-[9px] text-[#656565]">+{ws.members.length - 5}</span>
                  )}
                  <span className="text-[9px] text-[#656565] ml-auto font-mono">{ws.resourceCount} resources</span>
                </div>

                <div className="text-[9px] text-[#656565] font-mono">Created {ws.createdAt}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Multi-Agent AI Collaboration */}
      <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#262626] pb-3">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" /> Multi-Agent AI Collaboration
          </h3>
          <span className="text-[10px] text-[#656565]">One conversation. Multiple AI experts.</span>
        </div>

        {/* AI Thread */}
        <div className="space-y-3 max-h-[450px] overflow-y-auto">
          {aiThread.map(msg => {
            const isUser = msg.agent === 'You';
            const isAI = !isUser && msg.agent !== 'John';
            return (
              <div key={msg.id} className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
                <div className="w-8 h-8 rounded-full bg-[#121212] border border-[#262626] flex items-center justify-center text-sm shrink-0">
                  {msg.agentAvatar}
                </div>
                <div className={`flex-1 max-w-[80%] rounded-xl p-3 space-y-1 ${
                  isUser
                    ? 'bg-[#2266ec] border border-[#2266ec]'
                    : 'bg-[#121212] border border-[#262626]'
                }`}>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-xs font-bold ${isUser ? 'text-white' : 'text-white'}`}>{msg.agent}</span>
                    {isAI && <span className="text-[8px] bg-purple-500/20 text-purple-400 px-1 py-0.5 rounded font-bold">AI</span>}
                    <span className={`text-[9px] font-mono ${isUser ? 'text-white/60' : 'text-[#656565]'}`}>{msg.role}</span>
                  </div>
                  <div className={`text-[11px] leading-relaxed ${isUser ? 'text-white/90' : 'text-[#a6a6a6]'}`}>
                    {msg.content}
                  </div>
                  <div className={`text-[9px] font-mono ${isUser ? 'text-white/40' : 'text-[#656565]'}`}>{msg.timestamp}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Generate Report */}
        {!showReport && (
          <button
            onClick={generateReport}
            className="w-full py-2.5 rounded-xl border border-purple-500/30 bg-purple-500/10 text-purple-400 text-xs font-bold flex items-center justify-center gap-2 hover:bg-purple-500/20 transition-colors"
          >
            <FileText className="w-4 h-4" /> Generate Shared Investigation Report
          </button>
        )}

        {showReport && (
          <div className="bg-purple-500/5 border border-purple-500/20 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-400" />
              <span className="font-bold text-white text-sm">AI Investigation Report — Q2 Churn Analysis</span>
            </div>
            <div className="text-[11px] text-[#a6a6a6] space-y-2 leading-relaxed">
              <div><span className="font-bold text-white">Root Cause:</span> SMB churn increased 18% due to reduced onboarding emails, pricing confusion, and a breaking webhook API change in v2.3.0.</div>
              <div><span className="font-bold text-white">Key Findings:</span> Trial-to-paid conversion dropped 21pp. Slack integration deprioritization affected 22% of churned users. Welcome sequence completion rate fell from 72% to 51%.</div>
              <div><span className="font-bold text-white">Recommendations:</span> (1) Hotfix webhook API, (2) Redesign pricing page, (3) Re-prioritize Slack integration for Sprint 16, (4) Restore SMB onboarding email sequence.</div>
            </div>
            <div className="flex items-center gap-2 text-[9px] text-[#656565] font-mono pt-2 border-t border-purple-500/20">
              <span>Contributors: Analytics AI, Marketing AI, Support AI, Developer AI</span>
            </div>
          </div>
        )}

        {/* Input */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={aiPrompt}
            onChange={e => setAiPrompt(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleSendPrompt(); }}
            placeholder="Ask the AI team anything..."
            className="flex-1 bg-[#121212] border border-[#262626] rounded-lg px-3 py-2 text-xs text-white outline-none placeholder:text-[#656565]"
          />
          <button
            onClick={handleSendPrompt}
            disabled={!aiPrompt.trim()}
            className={`p-2 rounded-lg transition-all ${
              aiPrompt.trim() ? 'bg-[#2266ec] text-white' : 'bg-[#121212] border border-[#262626] text-[#656565]'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
