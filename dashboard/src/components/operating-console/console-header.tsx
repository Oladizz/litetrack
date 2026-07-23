"use client";

import React from 'react';
import { Search, Sparkles, Zap, Command } from 'lucide-react';
import { ConsoleMode } from './types';

interface ConsoleHeaderProps {
  activeMode: ConsoleMode;
  onSelectMode: (mode: ConsoleMode) => void;
}

export function ConsoleHeader({ activeMode, onSelectMode }: ConsoleHeaderProps) {
  const modes = [
    {
      id: 'search',
      label: '🔍 Search (Find)',
      badge: 'Cmd+1',
      desc: 'Universal records, commands, navigation (/), and math (=)'
    },
    {
      id: 'copilot',
      label: '💬 Copilot (Assist)',
      badge: 'Cmd+2',
      desc: 'Read-only AI analyst, chart explainer & SQL generator'
    },
    {
      id: 'autopilot',
      label: '⚡ Autopilot (Control)',
      badge: 'Cmd+3',
      desc: 'AI-Native OS Operator that composes pages & manipulates UI'
    },
  ];

  return (
    <div className="flex flex-col space-y-2 bg-[#121212] border-b border-[#262626] p-3">
      {/* 3 Mode Switcher Bar */}
      <div className="grid grid-cols-3 gap-2">
        {modes.map(m => {
          const isActive = activeMode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => onSelectMode(m.id as any)}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                isActive
                  ? 'bg-[#2266ec]/20 border-[#2266ec] text-white shadow-lg shadow-[#2266ec]/10 font-bold'
                  : 'bg-[#1a1a1a] border-[#262626] text-[#a6a6a6] hover:text-white hover:bg-[#262626]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs">{m.label}</span>
                <span className="text-[10px] font-mono text-[#656565] bg-[#121212] px-1.5 py-0.5 rounded border border-[#262626]">
                  {m.badge}
                </span>
              </div>
              <div className="text-[10px] text-[#656565] mt-1 truncate">{m.desc}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
