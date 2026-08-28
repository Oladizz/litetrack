"use client";

import React, { useState } from 'react';
import { Bot, Check, Lock, Settings, CreditCard, ShieldAlert } from 'lucide-react';
import { toast } from '@/components/ui/toast';

interface AgentProfile {
  id: string;
  name: string;
  description: string;
  avatar: string;
  spendingLimit: number;
  requiresApproval: boolean;
  canReadData: string[];
  canUseTools: string[];
  restrictedApps: string[];
}

export function IOACAgentPermissions() {
  const [agents, setAgents] = useState<AgentProfile[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<AgentProfile | null>(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('litetrack_token');
        const headers = { Authorization: `Bearer ${token}` };
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://litetrack-api-916484331446.us-central1.run.app';
        
        const res = await fetch(`${apiUrl}/api/ioac/agents`, { headers });
        const data = await res.json();
        
        if (data.agents && data.agents.length > 0) {
          const parsed = data.agents.map((a: any) => ({
            id: a.id,
            name: a.name,
            description: a.description,
            avatar: 'Bot',
            spendingLimit: a.spendingLimit,
            requiresApproval: a.requiresApproval,
            canReadData: a.canReadData ? JSON.parse(a.canReadData) : [],
            canUseTools: a.canUseTools ? JSON.parse(a.canUseTools) : [],
            restrictedApps: a.restrictedApps ? JSON.parse(a.restrictedApps) : []
          }));
          setAgents(parsed);
          setSelectedAgent(parsed[0]);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="text-[#a6a6a6] text-xs">Loading agents...</div>;
  if (!selectedAgent) return <div className="text-[#a6a6a6] text-xs">No AI agents configured yet.</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
      <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between border-b border-[#262626] pb-3">
          <h4 className="font-bold text-white text-sm flex items-center gap-2">
            <Bot className="w-4 h-4 text-cyan-400" /> Service Agents ({agents.length})
          </h4>
          <button
            onClick={async () => {
              const name = prompt("Enter Agent Name:");
              if (!name) return;
              const token = localStorage.getItem('litetrack_token');
              const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://litetrack-api-916484331446.us-central1.run.app';
              try {
                await fetch(`${apiUrl}/api/ioac/agents`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                  body: JSON.stringify({
                    id: 'ai_' + Math.floor(Math.random() * 1000),
                    name,
                    description: 'Custom AI Agent',
                    spendingLimit: 0,
                    requiresApproval: true,
                    canReadData: JSON.stringify(['General Data']),
                    canUseTools: JSON.stringify([]),
                    restrictedApps: JSON.stringify([])
                  })
                });
                toast('Created new agent. Refreshing...', { type: 'success' });
                window.location.reload();
              } catch(e) {
                toast('Failed to create agent', { type: 'error' });
              }
            }}
            className="text-xs text-[#2266ec] hover:underline font-semibold"
          >
            + Add Agent
          </button>
        </div>

        <div className="space-y-2">
          {agents.map(a => {
            const isSelected = selectedAgent.id === a.id;
            return (
              <div
                key={a.id}
                onClick={() => setSelectedAgent(a)}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-[#2266ec]/20 border-[#2266ec] text-white shadow-md'
                    : 'bg-[#121212] border-[#262626] text-[#a6a6a6] hover:text-white'
                }`}
              >
                <div className="font-bold text-xs">{a.name}</div>
                <div className="text-[11px] text-[#656565] mt-1 line-clamp-2">{a.description}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="md:col-span-2 space-y-4">
        {/* Agent Config Header */}
        <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-5 shadow-xl flex items-center justify-between">
          <div>
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              Agent Guardrails: {selectedAgent.name}
            </h3>
            <p className="text-xs text-[#a6a6a6] mt-0.5">{selectedAgent.description}</p>
          </div>
          <button
            onClick={() => toast('Saved agent permissions', { type: 'success' })}
            className="px-4 py-1.5 bg-[#2266ec] text-white text-xs font-semibold rounded-lg"
          >
            Save Boundaries
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-5 shadow-xl space-y-3">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <Check className="w-4 h-4 text-green-400" /> Allowed Capabilities
            </h4>
            <div className="space-y-1.5 text-xs font-mono">
              <div className="text-[#a6a6a6] mb-1">Data Access:</div>
              {selectedAgent.canReadData.map(d => (
                <div key={d} className="text-green-400 bg-green-500/10 px-2 py-1 rounded">✓ {d}</div>
              ))}
              <div className="text-[#a6a6a6] mt-3 mb-1">Tools & APIs:</div>
              {selectedAgent.canUseTools.map(t => (
                <div key={t} className="text-green-400 bg-green-500/10 px-2 py-1 rounded">✓ {t}</div>
              ))}
            </div>
          </div>

          <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-5 shadow-xl space-y-3">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <Lock className="w-4 h-4 text-red-400" /> Hard Restrictions
            </h4>
            <div className="space-y-1.5 text-xs font-mono">
              <div className="text-[#a6a6a6] mb-1">Blocked Apps:</div>
              {selectedAgent.restrictedApps.map(r => (
                <div key={r} className="text-red-400 bg-red-500/10 px-2 py-1 rounded">✕ {r}</div>
              ))}
              <div className="text-[#a6a6a6] mt-3 mb-1">Operational Limits:</div>
              <div className="text-amber-400 bg-amber-500/10 px-2 py-1 rounded flex items-center justify-between">
                <span>Spending Limit:</span>
                <strong>${selectedAgent.spendingLimit}</strong>
              </div>
              <div className="text-amber-400 bg-amber-500/10 px-2 py-1 rounded flex items-center justify-between">
                <span>Human Approval:</span>
                <strong>{selectedAgent.requiresApproval ? 'REQUIRED' : 'BYPASS'}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
