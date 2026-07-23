"use client";

import React, { useState, useCallback } from 'react';
import {
  Target, Plus, Rocket, Check, Clock, Pause, Play, BarChart3,
  Users, Bot, ClipboardList, Scale, LayoutDashboard, FileText,
  Sparkles, ChevronRight, Send
} from 'lucide-react';
import { Mission } from './types';
import { toast } from '@/components/ui/toast';

interface Props {
  missions: Mission[];
}

export function MissionControl({ missions: initialMissions }: Props) {
  const [missions, setMissions] = useState(initialMissions);
  const [selectedMission, setSelectedMission] = useState<string | null>(initialMissions[0]?.id ?? null);
  const [newMissionPrompt, setNewMissionPrompt] = useState('');
  const [creating, setCreating] = useState(false);
  const [createSteps, setCreateSteps] = useState<{ label: string; done: boolean }[]>([]);
  const [createDone, setCreateDone] = useState(false);

  const selected = missions.find(m => m.id === selectedMission);

  const statusStyles: Record<string, { color: string; bg: string; icon: React.ReactNode }> = {
    active: { color: 'text-green-400', bg: 'bg-green-500/20', icon: <Play className="w-3 h-3" /> },
    completed: { color: 'text-[#2266ec]', bg: 'bg-[#2266ec]/20', icon: <Check className="w-3 h-3" /> },
    paused: { color: 'text-amber-400', bg: 'bg-amber-500/20', icon: <Pause className="w-3 h-3" /> },
  };

  const handleCreateMission = useCallback(() => {
    if (!newMissionPrompt.trim()) return;
    setCreating(true);
    setCreateDone(false);
    const steps = [
      { label: 'Analyzing objective...', done: false },
      { label: 'Creating dedicated workspace...', done: false },
      { label: 'Building investigation timeline...', done: false },
      { label: 'Generating dashboards...', done: false },
      { label: 'Assigning team members...', done: false },
      { label: 'Deploying AI agents...', done: false },
      { label: 'Creating task board...', done: false },
      { label: 'Preparing decision log...', done: false },
    ];
    setCreateSteps(steps);

    steps.forEach((_, i) => {
      setTimeout(() => {
        setCreateSteps(prev => prev.map((s, j) => j <= i ? { ...s, done: true } : s));
        if (i === steps.length - 1) {
          setTimeout(() => {
            setCreateDone(true);
            const newMission: Mission = {
              id: `mission_new_${Date.now()}`,
              title: newMissionPrompt,
              objective: newMissionPrompt,
              status: 'active',
              progress: 0,
              members: [
                { name: 'You', type: 'user', avatar: '👤' },
                { name: 'Analytics AI', type: 'ai_agent', avatar: '📊' },
                { name: 'Finance AI', type: 'ai_agent', avatar: '💰' },
              ],
              taskCount: 8,
              decisionCount: 0,
              dashboardCount: 2,
              createdAt: 'Just now',
              timeline: [
                { event: 'Mission created', timestamp: 'Just now', done: true },
                { event: 'AI agents assigned', timestamp: 'Just now', done: true },
                { event: 'Initial analysis', timestamp: 'Pending', done: false },
              ],
            };
            setMissions(prev => [newMission, ...prev]);
            setSelectedMission(newMission.id);
            setNewMissionPrompt('');
            toast('🎯 Mission deployed successfully!', { type: 'success' });
          }, 400);
        }
      }, (i + 1) * 500);
    });
  }, [newMissionPrompt]);

  return (
    <div className="space-y-6 font-sans">
      {/* Create Mission */}
      <div className="bg-gradient-to-br from-[#2266ec]/10 to-purple-500/5 border border-[#2266ec]/20 rounded-xl p-5 shadow-xl space-y-4">
        <div className="border-b border-[#2266ec]/20 pb-3">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <Target className="w-4 h-4 text-[#2266ec]" /> ⭐ Mission Control — Create a New Mission
          </h3>
          <p className="text-[10px] text-[#a6a6a6] mt-1">
            Describe your objective in natural language. The platform will auto-generate a workspace, timeline, dashboards, tasks, AI agents, and decision log.
          </p>
        </div>

        {!creating && (
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center gap-2 bg-[#121212] border border-[#333] rounded-xl px-4 py-2.5">
              <Target className="w-4 h-4 text-[#2266ec] shrink-0" />
              <input
                type="text"
                value={newMissionPrompt}
                onChange={e => setNewMissionPrompt(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleCreateMission(); }}
                placeholder='e.g. "Investigate declining revenue in Q2" or "Launch new blockchain module"'
                className="w-full bg-transparent text-xs text-white outline-none placeholder:text-[#656565]"
              />
            </div>
            <button
              onClick={handleCreateMission}
              disabled={!newMissionPrompt.trim()}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                newMissionPrompt.trim()
                  ? 'bg-[#2266ec] text-white shadow-lg shadow-[#2266ec]/20'
                  : 'bg-[#1a1a1a] border border-[#262626] text-[#656565]'
              }`}
            >
              <Rocket className="w-3.5 h-3.5" /> Launch Mission
            </button>
          </div>
        )}

        {creating && (
          <div className="bg-[#121212] border border-[#262626] rounded-xl p-4 space-y-2">
            <div className="font-bold text-white text-sm mb-2">
              {createDone ? '🎯 Mission Deployed!' : 'Creating mission...'}
            </div>
            {createSteps.map((step, i) => (
              <div key={i} className={`flex items-center gap-2 text-xs transition-all ${step.done ? 'text-green-400' : 'text-[#656565]'}`}>
                {step.done ? <Check className="w-3.5 h-3.5" /> : <div className="w-3.5 h-3.5 border border-[#333] rounded-full animate-pulse" />}
                {step.label} {step.done && '✅'}
              </div>
            ))}
            {createDone && (
              <button
                onClick={() => { setCreating(false); setCreateSteps([]); setCreateDone(false); }}
                className="mt-2 text-xs text-[#2266ec] font-semibold hover:underline"
              >
                Create another mission →
              </button>
            )}
          </div>
        )}
      </div>

      {/* Mission Registry */}
      <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-5 shadow-xl space-y-4">
        <div className="border-b border-[#262626] pb-3">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <Target className="w-4 h-4 text-amber-400" /> Active Missions
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {missions.map(m => {
            const style = statusStyles[m.status];
            const isSelected = selectedMission === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setSelectedMission(m.id)}
                className={`text-left bg-[#121212] rounded-xl border p-4 space-y-3 transition-all ${
                  isSelected
                    ? 'border-[#2266ec] shadow-lg shadow-[#2266ec]/10 ring-1 ring-[#2266ec]/30'
                    : 'border-[#262626] hover:border-[#333]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm line-clamp-1">{m.title}</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold flex items-center gap-1 ${style.bg} ${style.color}`}>
                    {style.icon} {m.status}
                  </span>
                </div>

                {/* Progress */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[9px]">
                    <span className="text-[#656565]">Progress</span>
                    <span className="text-[#2266ec] font-mono font-bold">{m.progress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#262626] rounded-full overflow-hidden">
                    <div className="h-full bg-[#2266ec] rounded-full transition-all" style={{ width: `${m.progress}%` }} />
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-3 text-[9px] text-[#656565] font-mono">
                  <span className="flex items-center gap-1"><ClipboardList className="w-3 h-3" /> {m.taskCount} tasks</span>
                  <span className="flex items-center gap-1"><Scale className="w-3 h-3" /> {m.decisionCount} decisions</span>
                  <span className="flex items-center gap-1"><LayoutDashboard className="w-3 h-3" /> {m.dashboardCount} dashboards</span>
                </div>

                {/* Members */}
                <div className="flex items-center gap-1">
                  {m.members.slice(0, 4).map((mb, i) => (
                    <div key={i} className="w-5 h-5 rounded-full bg-[#1a1a1a] border border-[#262626] flex items-center justify-center text-[9px]" title={mb.name}>
                      {mb.avatar}
                    </div>
                  ))}
                  <span className="text-[9px] text-[#656565] ml-1">{m.members.length} members</span>
                  <span className="text-[9px] text-[#656565] ml-auto font-mono">{m.createdAt}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mission Detail */}
      {selected && (
        <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#262626] pb-3">
            <div>
              <h3 className="font-bold text-white text-sm">{selected.title}</h3>
              <p className="text-[10px] text-[#656565] mt-0.5">{selected.objective}</p>
            </div>
            <span className={`text-[10px] px-2 py-1 rounded-lg font-bold flex items-center gap-1 ${statusStyles[selected.status].bg} ${statusStyles[selected.status].color}`}>
              {statusStyles[selected.status].icon} {selected.status}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Timeline */}
            <div className="bg-[#121212] border border-[#262626] rounded-xl p-4 space-y-3">
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#2266ec]" /> Mission Timeline
              </div>
              <div className="relative space-y-0">
                <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-[#262626]" />
                {selected.timeline.map((t, i) => (
                  <div key={i} className="relative flex gap-3 py-1.5">
                    <div className={`relative z-10 w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                      t.done ? 'bg-green-500/30 text-green-400' : 'bg-[#262626] text-[#656565]'
                    }`}>
                      {t.done ? <Check className="w-2.5 h-2.5" /> : <Clock className="w-2.5 h-2.5" />}
                    </div>
                    <div>
                      <div className={`text-[10px] ${t.done ? 'text-white' : 'text-[#656565]'}`}>{t.event}</div>
                      <div className="text-[9px] text-[#656565] font-mono">{t.timestamp}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Team */}
            <div className="bg-[#121212] border border-[#262626] rounded-xl p-4 space-y-3">
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-amber-400" /> Mission Team
              </div>
              <div className="space-y-1.5">
                {selected.members.map((m, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <span className="text-sm">{m.avatar}</span>
                    <span className="text-white font-semibold">{m.name}</span>
                    {m.type === 'ai_agent' && (
                      <span className="text-[8px] bg-purple-500/20 text-purple-400 px-1 py-0.5 rounded font-bold">AI</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Assets */}
            <div className="bg-[#121212] border border-[#262626] rounded-xl p-4 space-y-3">
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Auto-Generated Assets
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center gap-2 text-green-400">
                  <Check className="w-3 h-3" /> <span>{selected.taskCount} tasks created</span>
                </div>
                <div className="flex items-center gap-2 text-green-400">
                  <Check className="w-3 h-3" /> <span>{selected.dashboardCount} dashboards generated</span>
                </div>
                <div className="flex items-center gap-2 text-green-400">
                  <Check className="w-3 h-3" /> <span>Decision log initialized</span>
                </div>
                <div className="flex items-center gap-2 text-green-400">
                  <Check className="w-3 h-3" /> <span>{selected.members.filter(m => m.type === 'ai_agent').length} AI agents deployed</span>
                </div>
                <div className="flex items-center gap-2 text-green-400">
                  <Check className="w-3 h-3" /> <span>Investigation summary ready</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
