"use client";
import React, { useState } from 'react';
import { Sparkles, Zap, Maximize2, X, ChevronRight, ChevronLeft } from 'lucide-react';

export function AILane() {
  const [collapsed, setCollapsed] = useState(false);

  if (collapsed) {
    return (
      <div className="w-12 h-full bg-[#121212] border-l border-[#262626] flex flex-col items-center py-4 shrink-0 transition-all">
        <button onClick={() => setCollapsed(false)} className="p-2 hover:bg-[#262626] rounded-lg text-[#a6a6a6] hover:text-white mb-4">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <Sparkles className="w-4 h-4 text-amber-400 mb-4" />
        <Zap className="w-4 h-4 text-green-400" />
      </div>
    );
  }

  return (
    <div className="w-72 h-full bg-[#121212] border-l border-[#262626] flex flex-col shrink-0 transition-all">
      <div className="h-12 border-b border-[#262626] flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-2 text-xs font-bold text-white">
          <Sparkles className="w-4 h-4 text-amber-400" /> AI Context
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setCollapsed(true)} className="p-1 hover:bg-[#262626] rounded text-[#a6a6a6] hover:text-white">
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div className="space-y-2">
          <div className="text-[10px] font-bold text-[#656565] uppercase tracking-wider">Insights</div>
          <div className="bg-[#1a1a1a] p-3 rounded-lg border border-[#262626] text-xs text-[#a6a6a6] leading-relaxed">
            AI is observing your active workspace. Context will appear here as you select records or view charts.
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-[10px] font-bold text-[#656565] uppercase tracking-wider">Suggested Actions</div>
          <div className="space-y-1.5">
            <button className="w-full text-left bg-[#1a1a1a] hover:bg-[#262626] border border-[#262626] p-2.5 rounded-lg text-xs text-white transition-colors flex items-center justify-between">
              Investigate Anomalies <Zap className="w-3 h-3 text-green-400" />
            </button>
            <button className="w-full text-left bg-[#1a1a1a] hover:bg-[#262626] border border-[#262626] p-2.5 rounded-lg text-xs text-white transition-colors flex items-center justify-between">
              Generate Status Report <Sparkles className="w-3 h-3 text-amber-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
