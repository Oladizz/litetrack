"use client";
import { IconRenderer } from '@/components/ui/IconRenderer';
import React, { useState } from 'react';
import {
  GripVertical, X, Pin, Maximize2, Minimize2, Copy,
  Layers
} from 'lucide-react';
import { PanelInstance, PanelDefinition } from './types';

interface Props {
  panels: PanelInstance[];
  definitions: PanelDefinition[];
  onClosePanel: (id: string) => void;
  onPinPanel: (id: string) => void;
  onMaximizePanel: (id: string) => void;
  onDuplicatePanel: (id: string) => void;
}

const TOOL_COLORS: Record<string, string> = {
  'Data Manager': 'border-t-blue-500',
  'Dashboard Builder': 'border-t-emerald-500',
  'Operating Console': 'border-t-amber-500',
  'IOAC': 'border-t-red-500',
  'AI Agent Studio': 'border-t-purple-500',
  'Resource Manager': 'border-t-cyan-500',
  'Observability': 'border-t-pink-500',
  'Platform Studio': 'border-t-orange-500',
  'Collaboration Hub': 'border-t-teal-500',
  'Enterprise Control': 'border-t-indigo-500',
};

const PANEL_PREVIEWS: Record<string, { lines: string[]; accent: string }> = {
  data_grid: { lines: ['id │ name │ email │ status │ created_at', '001 │ OLADIZZ Corp │ admin@cirlo.io │ active │ 2026-01-15', '002 │ TechStart Inc │ ceo@techstart.io │ active │ 2026-03-20', '003 │ EduGlobal │ ops@eduglobal.co │ degraded │ 2026-02-08', '─── 2,493 records │ 5 columns │ Filtered: Active'], accent: 'bg-blue-500/10 text-blue-400' },
  chart: { lines: ['Revenue │ MoM Growth', '████████████████ $148,200 (+12%)', '███████████████░ $132,300 (+8%)', '██████████████░░ $122,500 (+5%)', '─── Q2 2026 │ Trend: Accelerating'], accent: 'bg-emerald-500/10 text-emerald-400' },
  activity_feed: { lines: ['10:22 ▸ John assigned Sarah → Customer #C-4021', '10:18 ▸ Analytics AI summarized Q2 churn report', '10:15 ▸ System generated Invoice #INV-892', '10:08 ▸ Sarah approved refund → Order #ORD-267', '─── 8 events today │ Filter: All'], accent: 'bg-amber-500/10 text-amber-400' },
  ai_insight: { lines: ['⚠ Churn increased 18% in SMB segment', '  Root cause: Trial-to-paid drop at Day 14', '  Confidence: 92% │ Source: Analytics AI', '  Suggested: Redesign pricing page', '─── 3 active insights │ 1 critical'], accent: 'bg-purple-500/10 text-purple-400' },
  task_board: { lines: ['Backlog (3) │ In Progress (5) │ Review (2) │ Done (12)', '┌─────────┐ ┌──────────────┐ ┌────────┐ ┌──────┐', '│ Redesign │ │ Fix Webhook  │ │ Email  │ │ ✓    │', '│ Pricing  │ │ Investigate  │ │ Seq.   │ │ Done │', '─── 22 tasks │ 4 critical │ 2 overdue'], accent: 'bg-amber-500/10 text-amber-400' },
  timeline: { lines: ['09:00 ── Mission created', '09:05 ── AI agents assigned (3)', '10:00 ── Initial analysis complete ✓', '10:45 ── Root cause identified ✓', '11:30 ── Fix implementation ◉ In Progress'], accent: 'bg-cyan-500/10 text-cyan-400' },
  ecosystem_kpi: { lines: ['Applications: 12 (+2)  │  Organizations: 4', 'Users: 2,493 (+12%)   │  AI Agents: 38 (+5)', 'Automations: 91 (+8%) │  Events Today: 12M', 'Platform Uptime: 99.99% │ SLA: Met', '─── All Systems Nominal'], accent: 'bg-indigo-500/10 text-indigo-400' },
  digital_twin: { lines: ['Globe Enterprise Ecosystem ─── 98%', '  Building OLADIZZ Corp ─── 98%', '    BarChart2 Analytics Pro ─── 99%', '    Handshake CRM Engine ─── 92% ⚠', '    Monitor Infrastructure ─── 99%'], accent: 'bg-pink-500/10 text-pink-400' },
  notes: { lines: ['# Investigation Notes — Q2 Revenue', '- Revenue dropped 18% in SMB segment', '- Correlates with onboarding email changes in March', '- Action: Restore original welcome sequence', '─── Last edited: 2 mins ago'], accent: 'bg-[#333]/30 text-[#a6a6a6]' },
  approval_chain: { lines: ['Created ✓ → AI Summary ✓ → Manager ◉ → Finance ○ → Done ○', 'Stage: Manager Approval (pending)', 'AI Summary: Duplicate charge confirmed, $149.99 refund recommended', 'Confidence: 95% │ Risk: Low', '─── Waiting for Sarah Chen'], accent: 'bg-green-500/10 text-green-400' },
  agent_registry: { lines: ['BarChart2 Analytics AI ─── Running │ 142 decisions │ $12.40', 'CircleDollarSign Finance AI ─── Paused │ 38 decisions │ $8.20', 'Headphones Support AI ─── Busy │ 89 decisions │ $4.60', 'Laptop Developer AI ─── Idle │ 24 decisions │ $6.80', '─── 8 agents │ 6 active │ $64.50 today'], accent: 'bg-purple-500/10 text-purple-400' },
  security_alert: { lines: ['AlertCircle CRITICAL │ Credential stuffing from 45.33.x.x │ Resolved', '🟠 HIGH │ Admin role assigned to new user │ Unresolved', '🟠 HIGH │ Unusual API key usage pattern │ Unresolved', '🟡 MEDIUM │ 14 failed login attempts │ Resolved', '─── 2 unresolved │ 3 resolved │ Score: 100%'], accent: 'bg-red-500/10 text-red-400' },
};

export function ActiveCanvas({ panels, definitions, onClosePanel, onPinPanel, onMaximizePanel, onDuplicatePanel }: Props) {
  if (panels.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#121212]">
        <div className="text-center space-y-3 max-w-xs">
          <Layers className="w-12 h-12 text-[#262626] mx-auto" />
          <div className="text-sm text-[#656565] font-semibold">No panels open</div>
          <div className="text-[10px] text-[#333] leading-relaxed">
            Press <kbd className="bg-[#1a1a1a] px-1.5 py-0.5 rounded border border-[#333] font-mono">⌘K</kbd> to open a panel, or describe your intent with <kbd className="bg-[#1a1a1a] px-1.5 py-0.5 rounded border border-[#333] font-mono">⌘J</kbd>
          </div>
        </div>
      </div>
    );
  }

  const layoutClass = panels.length === 1
    ? 'grid grid-cols-1'
    : panels.length === 2
      ? 'grid grid-cols-2 gap-1'
      : panels.length <= 4
        ? 'grid grid-cols-2 grid-rows-2 gap-1'
        : 'grid grid-cols-3 gap-1 auto-rows-fr';

  return (
    <div className={`flex-1 ${layoutClass} bg-[#0a0a0a] p-1 overflow-hidden min-h-0`}>
      {panels.map(panel => {
        const def = definitions.find(d => d.id === panel.definitionId);
        if (!def) return null;
        const toolColor = TOOL_COLORS[def.toolOrigin] ?? 'border-t-[#333]';
        const isMaximized = panel.state === 'maximized';
        const preview = PANEL_PREVIEWS[def.type] ?? PANEL_PREVIEWS.notes;

        return (
          <div
            key={panel.id}
            className={`bg-[#121212] border border-[#262626] rounded-lg overflow-hidden flex flex-col transition-all border-t-2 ${toolColor} ${
              isMaximized ? 'col-span-full row-span-full' : ''
            }`}
          >
            {/* Title Bar */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#0f0f0f] border-b border-[#262626] shrink-0 group">
              <GripVertical className="w-3 h-3 text-[#333] cursor-grab active:cursor-grabbing shrink-0" />
              <IconRenderer name={def.icon} className="w-4 h-4 shrink-0 text-white" />
              <span className="text-[11px] font-semibold text-white truncate">{def.title}</span>
              <span className="text-[8px] text-[#656565] bg-[#1a1a1a] px-1.5 py-0.5 rounded border border-[#262626] font-mono shrink-0 hidden lg:inline">{def.toolOrigin}</span>

              <div className="ml-auto flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                {panel.isPinned && <Pin className="w-3 h-3 text-[#2266ec]" />}
                <button onClick={() => onPinPanel(panel.id)} className="p-1 rounded hover:bg-[#1a1a1a] text-[#656565] hover:text-[#2266ec]" title="Pin"><Pin className="w-3 h-3" /></button>
                <button onClick={() => onDuplicatePanel(panel.id)} className="p-1 rounded hover:bg-[#1a1a1a] text-[#656565] hover:text-white" title="Duplicate"><Copy className="w-3 h-3" /></button>
                <button onClick={() => onMaximizePanel(panel.id)} className="p-1 rounded hover:bg-[#1a1a1a] text-[#656565] hover:text-white" title={isMaximized ? 'Restore' : 'Maximize'}>
                  {isMaximized ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
                </button>
                {def.closable && (
                  <button onClick={() => onClosePanel(panel.id)} className="p-1 rounded hover:bg-red-500/20 text-[#656565] hover:text-red-400" title="Close"><X className="w-3 h-3" /></button>
                )}
              </div>
            </div>

            {/* Panel Content */}
            <div className="flex-1 p-3 overflow-auto min-h-0">
              <div className={`rounded-lg p-3 space-y-1 font-mono ${preview.accent}`}>
                {preview.lines.map((line, i) => (
                  <div key={i} className="text-[10px] leading-relaxed whitespace-pre">{line}</div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
