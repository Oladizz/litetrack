"use client";

import React, { useState } from 'react';
import { Bot, Play, Pause, Shield, Check, Lock, Cpu, Sparkles, Sliders } from 'lucide-react';
import { AIAgent, AutonomyLevel, AgentStatus } from './types';
import { toast } from '@/components/ui/toast';

interface AgentRegistryProps {
  agents: AIAgent[];
  onToggleStatus: (agentId: string) => void;
  onUpdateAutonomy: (agentId: string, level: AutonomyLevel) => void;
  onSelectAgent: (agent: AIAgent) => void;
}

export function AgentRegistry({
  agents,
  onToggleStatus,
  onUpdateAutonomy,
  onSelectAgent,
}: AgentRegistryProps) {
  return (
    <div className="space-y-4 font-sans">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map(agent => {
          const isRunning = agent.status === 'running';

          return (
            <div
              key={agent.id}
              className="bg-[#1a1a1a] border border-[#262626] hover:border-[#404040] rounded-xl p-5 shadow-xl space-y-4 transition-colors relative"
            >
              {/* Top Avatar & Status Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#2266ec]/20 border border-[#2266ec]/40 flex items-center justify-center text-2xl shrink-0">
                    {agent.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
                      {agent.name}
                    </h4>
                    <span className="text-[11px] text-[#2266ec] font-mono font-medium block">
                      {agent.role} · v{agent.version}
                    </span>
                  </div>
                </div>

                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border uppercase ${
                  isRunning ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                }`}>
                  ● {agent.status}
                </span>
              </div>

              {/* Autonomy Level Selector Bar */}
              <div className="space-y-1.5">
                <div className="text-[10px] text-[#656565] font-mono uppercase">Human Autonomy Mode</div>
                <div className="grid grid-cols-4 gap-1 text-[10px] font-mono">
                  {(['observer', 'advisor', 'operator', 'autonomous'] as AutonomyLevel[]).map(level => {
                    const isActive = agent.autonomyLevel === level;
                    return (
                      <button
                        key={level}
                        onClick={() => onUpdateAutonomy(agent.id, level)}
                        className={`py-1 rounded border capitalize transition-all ${
                          isActive
                            ? 'bg-[#2266ec] text-white border-[#2266ec] font-bold shadow'
                            : 'bg-[#121212] text-[#656565] border-[#262626] hover:text-white'
                        }`}
                      >
                        {level}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Capability Matrix Preview */}
              <div className="bg-[#121212] p-3 rounded-lg border border-[#262626] text-xs space-y-1.5 font-mono">
                {agent.capabilities.map(cap => (
                  <div key={cap.name} className="flex justify-between items-center text-[11px]">
                    <span className="text-[#a6a6a6]">{cap.name}</span>
                    <span className={cap.allowed ? 'text-green-400 font-bold' : 'text-red-400'}>
                      {cap.allowed ? '✓ ALLOWED' : '✗ RESTRICTED'}
                    </span>
                  </div>
                ))}
              </div>

              {/* Action Toolbar */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => onToggleStatus(agent.id)}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow ${
                    isRunning
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30'
                      : 'bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30'
                  }`}
                >
                  {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  {isRunning ? 'Pause Worker' : 'Start Worker'}
                </button>

                <button
                  onClick={() => onSelectAgent(agent)}
                  className="px-3 py-1.5 bg-[#262626] hover:bg-[#333] text-white text-xs rounded-lg transition-colors font-medium"
                >
                  Configure
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
