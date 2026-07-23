"use client";

import React, { useState } from 'react';
import { BarChart3, DollarSign, Clock, Star, Zap, Save } from 'lucide-react';
import { AIAgent } from './types';
import { toast } from '@/components/ui/toast';

interface PerformanceProps {
  agents: AIAgent[];
}

export function AgentPerformanceStudio({ agents }: PerformanceProps) {
  const [selectedAgent, setSelectedAgent] = useState<AIAgent>(agents[0]);
  const [promptText, setPromptText] = useState(selectedAgent.systemPrompt);

  const handleSavePrompt = () => {
    toast(`Updated System Prompt for ${selectedAgent.name}`, { type: 'success' });
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Metrics Cards Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono">
        <div className="bg-[#1a1a1a] p-4 rounded-xl border border-[#262626] space-y-1">
          <div className="text-[#656565] uppercase">Total Tasks Completed</div>
          <div className="text-xl font-bold text-white">{selectedAgent.performance.tasksCompleted}</div>
        </div>
        <div className="bg-[#1a1a1a] p-4 rounded-xl border border-[#262626] space-y-1">
          <div className="text-[#656565] uppercase">Success Rate</div>
          <div className="text-xl font-bold text-green-400">{selectedAgent.performance.successRate}%</div>
        </div>
        <div className="bg-[#1a1a1a] p-4 rounded-xl border border-[#262626] space-y-1">
          <div className="text-[#656565] uppercase">Avg Latency</div>
          <div className="text-xl font-bold text-amber-400">{selectedAgent.performance.avgExecutionTimeMs} ms</div>
        </div>
        <div className="bg-[#1a1a1a] p-4 rounded-xl border border-[#262626] space-y-1">
          <div className="text-[#656565] uppercase">Token Cost (USD)</div>
          <div className="text-xl font-bold text-[#2266ec]">${selectedAgent.performance.tokenCostUsd.toFixed(2)}</div>
        </div>
      </div>

      {/* System Prompt & Behavior Studio */}
      <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#262626] pb-3">
          <div>
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" /> Prompt & Behavior Studio: {selectedAgent.name}
            </h3>
            <p className="text-xs text-[#a6a6a6] mt-0.5">Configure system prompts, escalation rules, and safety bounds.</p>
          </div>
          <button
            onClick={handleSavePrompt}
            className="px-4 py-1.5 bg-[#2266ec] hover:bg-[#1d57cc] text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow"
          >
            <Save className="w-3.5 h-3.5" /> Save Prompt Assets
          </button>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-[#656565] font-mono uppercase block">System Persona & Operational Directives</label>
          <textarea
            rows={5}
            value={promptText}
            onChange={e => setPromptText(e.target.value)}
            className="w-full bg-[#121212] border border-[#333] rounded-xl p-3 text-xs text-green-400 font-mono outline-none focus:border-[#2266ec] transition-colors leading-relaxed"
          />
        </div>
      </div>
    </div>
  );
}
