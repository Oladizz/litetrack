"use client";

import React, { useState } from 'react';
import { OperatingConsole } from '@/components/operating-console';
import { Search, Command, Zap, Sparkles, Calculator } from 'lucide-react';

export default function UniversalOperatingConsolePage() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>      
        <div className="p-8 max-w-[1200px] mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <Zap className="w-6 h-6 text-green-400" /> Tool #3: Operating Console (AI-Native OS)
              </h1>
              <p className="text-xs text-[#a6a6a6] mt-1">
                Unified AI-Native Console featuring 3 Operating Paradigms: <strong>🔍 Search (Find)</strong>, <strong>💬 Copilot (Assist)</strong>, and <strong>⚡ Autopilot (Control)</strong>. Press <kbd className="bg-[#262626] px-1.5 py-0.5 rounded text-[#2266ec] font-mono">Cmd + K</kbd> anywhere!
              </p>
            </div>

            <button
              onClick={() => setIsOpen(true)}
              className="px-4 py-2 bg-[#2266ec] hover:bg-[#1d57cc] text-xs font-semibold text-white rounded-lg transition-colors flex items-center gap-2 shadow-lg shadow-[#2266ec]/20"
            >
              <Zap className="w-4 h-4 text-green-400" /> Open Operating Console (Cmd+K)
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-[#1a1a1a] p-4 rounded-xl border border-[#262626] space-y-2">
              <div className="font-bold text-white flex items-center gap-1.5">
                <Search className="w-4 h-4 text-[#2266ec]" /> 1. 🔍 Search (Find)
              </div>
              <p className="text-[#a6a6a6]">
                Universal spotlight search across all entities, navigation (/), action commands (&gt;), and math (=).
              </p>
            </div>

            <div className="bg-[#1a1a1a] p-4 rounded-xl border border-[#262626] space-y-2">
              <div className="font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" /> 2. 💬 Copilot (Assist)
              </div>
              <p className="text-[#a6a6a6]">
                Read-only platform AI analyst. Explains charts, generates SQL queries, writes email briefs, and inspects data.
              </p>
            </div>

            <div className="bg-[#1a1a1a] p-4 rounded-xl border border-[#262626] space-y-2">
              <div className="font-bold text-white flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-green-400" /> 3. ⚡ Autopilot (Control)
              </div>
              <p className="text-[#a6a6a6]">
                Interface-aware AI OS Operator. Composes pages ("Show John Doe"), rearranges dashboards ("Why are sales dropping?"), builds fraud sections, and executes UI intentions.
              </p>
            </div>
          </div>

          <OperatingConsole isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </div>
      
    </>
  );
}

