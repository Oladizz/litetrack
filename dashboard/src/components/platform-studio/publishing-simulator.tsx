"use client";

import React, { useState } from 'react';
import {
  GitBranch, ArrowRight, Check, RotateCcw, Eye, ChevronRight,
  FileText, Shield, Palette, Bot, PanelLeft, Sparkles
} from 'lucide-react';
import { PublishingPipeline } from './types';
import { toast } from '@/components/ui/toast';

const STAGES = ['draft', 'review', 'approved', 'published'] as const;
const STAGE_LABELS: Record<string, string> = {
  draft: 'Draft',
  review: 'Review',
  approved: 'Approved',
  published: 'Published',
};
const STAGE_COLORS: Record<string, string> = {
  draft: 'bg-amber-500/20 text-amber-400',
  review: 'bg-[#2266ec]/20 text-[#2266ec]',
  approved: 'bg-green-500/20 text-green-400',
  published: 'bg-green-500/20 text-green-400',
};

export function PublishingSimulator() {
  const [versions, setVersions] = useState<PublishingPipeline[]>([
    { version: 'v2.4.0', status: 'draft', author: 'Sarah Chen', changesSummary: 'Add blockchain module and crypto wallet integration', timestamp: '2 hours ago' },
    { version: 'v2.3.1', status: 'review', author: 'James Wright', changesSummary: 'Hotfix: Payment gateway timeout threshold adjustment', timestamp: '1 day ago' },
    { version: 'v2.3.0', status: 'approved', author: 'Admin AI', changesSummary: 'AI Agent Studio v2 with swarm collaboration engine', timestamp: '3 days ago' },
    { version: 'v2.2.0', status: 'published', author: 'Sarah Chen', changesSummary: 'Universal Resource Manager and Knowledge Graph', timestamp: '1 week ago' },
    { version: 'v2.1.0', status: 'published', author: 'James Wright', changesSummary: 'IOAC permission simulator and policy engine', timestamp: '2 weeks ago' },
  ]);

  const [simulatorActive, setSimulatorActive] = useState(false);

  const promote = (version: string) => {
    setVersions(prev => prev.map(v => {
      if (v.version !== version) return v;
      const idx = STAGES.indexOf(v.status as typeof STAGES[number]);
      if (idx < STAGES.length - 1) {
        const next = STAGES[idx + 1];
        toast(`${version} promoted to ${STAGE_LABELS[next]}`, { type: 'success' });
        return { ...v, status: next };
      }
      return v;
    }));
  };

  const rollback = (version: string) => {
    toast(`Rolled back to ${version}`, { type: 'info' });
  };

  const latestVersion = versions[0];
  const latestStageIdx = STAGES.indexOf(latestVersion.status as typeof STAGES[number]);

  const currentNav = ['Dashboard', 'Users', 'Orders', 'Reports', 'Settings'];
  const nextNav = ['Dashboard', 'Users', 'Orders', 'Reports', 'Blockchain', 'Settings'];

  return (
    <div className="space-y-6 font-sans">
      {/* Pipeline Stage Visualizer */}
      <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-5 shadow-xl space-y-4">
        <div className="border-b border-[#262626] pb-3">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-[#2266ec]" /> Publishing Pipeline
          </h3>
          <p className="text-[10px] text-[#656565] mt-1">Visual deployment workflow: Draft → Review → Approve → Publish</p>
        </div>

        {/* Horizontal Pipeline */}
        <div className="flex items-center justify-center gap-0 py-4">
          {STAGES.map((stage, i) => {
            const isActive = i <= latestStageIdx;
            const isCurrent = i === latestStageIdx;
            return (
              <React.Fragment key={stage}>
                <div className="flex flex-col items-center gap-1.5">
                  {isCurrent && (
                    <span className="text-[9px] text-[#2266ec] font-mono font-bold">{latestVersion.version}</span>
                  )}
                  {!isCurrent && <span className="text-[9px] text-transparent">.</span>}
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold border-2 transition-all ${
                      isCurrent
                        ? 'bg-[#2266ec] border-[#2266ec] text-white shadow-lg shadow-[#2266ec]/30 scale-110'
                        : isActive
                          ? 'bg-green-500/20 border-green-500/40 text-green-400'
                          : 'bg-[#121212] border-[#262626] text-[#656565]'
                    }`}
                  >
                    {isActive && i < latestStageIdx ? <Check className="w-4 h-4" /> : (i + 1)}
                  </div>
                  <span className={`text-[10px] font-semibold ${isCurrent ? 'text-[#2266ec]' : isActive ? 'text-green-400' : 'text-[#656565]'}`}>
                    {STAGE_LABELS[stage]}
                  </span>
                </div>
                {i < STAGES.length - 1 && (
                  <div className={`w-12 h-0.5 mx-1 mt-[-8px] rounded-full ${i < latestStageIdx ? 'bg-green-400' : 'bg-[#262626]'}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Version History Timeline */}
      <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-5 shadow-xl space-y-4">
        <div className="border-b border-[#262626] pb-3">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-purple-400" /> Version History
          </h3>
        </div>

        <div className="relative space-y-0">
          {/* Vertical timeline line */}
          <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-[#262626]" />

          {versions.map((v, i) => {
            const st = STAGE_COLORS[v.status] ?? 'bg-[#333] text-[#a6a6a6]';
            const canPromote = v.status !== 'published';
            const canRollback = v.status === 'published';
            return (
              <div key={v.version} className="relative flex gap-4 py-3">
                {/* Timeline dot */}
                <div className={`relative z-10 w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold border ${
                  i === 0
                    ? 'bg-[#2266ec] border-[#2266ec] text-white'
                    : v.status === 'published'
                      ? 'bg-green-500/20 border-green-500/30 text-green-400'
                      : 'bg-[#121212] border-[#262626] text-[#a6a6a6]'
                }`}>
                  {v.status === 'published' ? <Check className="w-4 h-4" /> : <GitBranch className="w-4 h-4" />}
                </div>

                <div className="flex-1 bg-[#121212] border border-[#262626] rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm font-mono">{v.version}</span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${st}`}>
                        {v.status === 'published' && '✓ '}{STAGE_LABELS[v.status]}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {canPromote && (
                        <button
                          onClick={() => promote(v.version)}
                          className="text-[10px] bg-[#2266ec] text-white px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1 hover:bg-[#1a55d4] transition-colors"
                        >
                          Promote <ChevronRight className="w-3 h-3" />
                        </button>
                      )}
                      {canRollback && (
                        <button
                          onClick={() => rollback(v.version)}
                          className="text-[10px] bg-[#1a1a1a] border border-[#333] text-amber-400 px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1 hover:bg-[#262626] transition-colors"
                        >
                          <RotateCcw className="w-3 h-3" /> Rollback
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="text-xs text-[#a6a6a6]">{v.changesSummary}</div>
                  <div className="text-[10px] text-[#656565] font-mono">
                    by {v.author} · {v.timestamp}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Change Simulator */}
      <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#262626] pb-3">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <Eye className="w-4 h-4 text-cyan-400" /> 🧪 Change Simulator — Preview Before Publishing
          </h3>
          <button
            onClick={() => setSimulatorActive(!simulatorActive)}
            className={`text-[10px] px-3 py-1.5 rounded-lg font-semibold border transition-all flex items-center gap-1.5 ${
              simulatorActive
                ? 'bg-[#2266ec] border-[#2266ec] text-white'
                : 'bg-[#121212] border-[#262626] text-[#a6a6a6] hover:text-white'
            }`}
          >
            <Sparkles className="w-3 h-3" /> {simulatorActive ? 'Simulator Active' : 'Simulate v2.4.0'}
          </button>
        </div>

        {simulatorActive && (
          <div className="space-y-4">
            {/* Split Pane Comparison */}
            <div className="grid grid-cols-2 gap-4">
              {/* Current */}
              <div className="bg-[#121212] border border-[#262626] rounded-xl p-4 space-y-2">
                <div className="text-[10px] text-[#656565] font-semibold uppercase mb-2">Current (v2.3.0)</div>
                <div className="space-y-1">
                  {currentNav.map(item => (
                    <div key={item} className="bg-[#1a1a1a] border border-[#262626] rounded-lg px-3 py-2 text-xs text-[#a6a6a6] flex items-center gap-2">
                      <PanelLeft className="w-3 h-3 text-[#656565]" /> {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* After */}
              <div className="bg-[#121212] border border-[#2266ec]/20 rounded-xl p-4 space-y-2">
                <div className="text-[10px] text-[#2266ec] font-semibold uppercase mb-2">After v2.4.0</div>
                <div className="space-y-1">
                  {nextNav.map(item => {
                    const isNew = item === 'Blockchain';
                    return (
                      <div
                        key={item}
                        className={`rounded-lg px-3 py-2 text-xs flex items-center gap-2 border ${
                          isNew
                            ? 'bg-green-500/10 border-green-500/30 text-green-400 font-bold'
                            : 'bg-[#1a1a1a] border-[#262626] text-[#a6a6a6]'
                        }`}
                      >
                        <PanelLeft className={`w-3 h-3 ${isNew ? 'text-green-400' : 'text-[#656565]'}`} />
                        {item} {isNew && <span className="text-[8px] bg-green-500/20 px-1 py-0.5 rounded ml-auto">NEW</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Changes Summary */}
            <div className="bg-[#121212] border border-[#262626] rounded-xl p-4 space-y-2 text-xs">
              <div className="font-bold text-white text-sm mb-2">Changes Summary</div>
              <div className="flex items-center gap-2 text-green-400">
                <FileText className="w-3.5 h-3.5" /> + 1 new module: Blockchain
              </div>
              <div className="flex items-center gap-2 text-green-400">
                <PanelLeft className="w-3.5 h-3.5" /> + 2 new navigation items
              </div>
              <div className="flex items-center gap-2 text-amber-400">
                <Shield className="w-3.5 h-3.5" /> ~ 3 permission rules updated
              </div>
              <div className="flex items-center gap-2 text-amber-400">
                <Palette className="w-3.5 h-3.5" /> ~ Theme accent color changed
              </div>
              <div className="flex items-center gap-2 text-purple-400">
                <Bot className="w-3.5 h-3.5" /> + 1 AI agent assigned (Crypto Analyst)
              </div>
            </div>

            {/* Promote CTA */}
            <button
              onClick={() => { promote('v2.4.0'); setSimulatorActive(false); }}
              className="w-full py-2.5 rounded-xl bg-[#2266ec] text-white text-sm font-bold hover:bg-[#1a55d4] transition-colors shadow-lg shadow-[#2266ec]/20 flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" /> Looks Good — Promote to Review
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
