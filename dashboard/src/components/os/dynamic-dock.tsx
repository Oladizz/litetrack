"use client";
import React from 'react';
import { Download, Upload, Cpu, Activity, ClipboardList } from 'lucide-react';

export function DynamicDock() {
  return (
    <div className="h-8 w-full bg-[#0a0a0a] border-t border-[#262626] flex items-center justify-between px-4 shrink-0 z-50">
      <div className="flex items-center gap-4 text-[10px] font-mono text-[#656565]">
        <div className="flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors">
          <Cpu className="w-3 h-3 text-green-400" /> Agents Idle
        </div>
        <div className="flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors">
          <Activity className="w-3 h-3 text-[#2266ec]" /> 12ms ping
        </div>
      </div>
      
      <div className="flex items-center gap-1">
        {/* Pinned resources or active jobs */}
      </div>

      <div className="flex items-center gap-3 text-[10px] text-[#656565] font-mono">
        <div className="flex items-center gap-1 cursor-pointer hover:text-white transition-colors">
          <ClipboardList className="w-3 h-3" /> 0 Items
        </div>
      </div>
    </div>
  );
}
