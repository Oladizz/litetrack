"use client";
import React from 'react';
import { Search, Bell, Activity, User, Zap } from 'lucide-react';
import { useWorkspace } from '@/components/ui/workspace-context';

export function CommandBar() {
  const { state } = useWorkspace();

  return (
    <div className="h-12 w-full bg-[#0a0a0a] border-b border-[#262626] flex items-center justify-between px-4 shrink-0 z-50">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-white font-bold tracking-tight">
          <Zap className="w-4 h-4 text-[#2266ec]" />
          Admin OS
        </div>
        <div className="h-4 w-px bg-[#262626]" />
        <div className="text-[11px] text-[#a6a6a6] font-medium tracking-wide uppercase">
          Workspace: <span className="text-white ml-1">{state.projectName || 'Global'}</span>
        </div>
      </div>
      
      <div className="flex-1 max-w-xl mx-8">
        <button 
          onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}
          className="w-full flex items-center justify-between bg-[#121212] border border-[#262626] hover:border-[#333] transition-colors rounded-md px-3 py-1.5 text-xs text-[#656565]"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5" />
            <span>Search records, commands (&gt;), navigation (/)...</span>
          </div>
          <div className="flex items-center gap-1">
            <kbd className="bg-[#262626] px-1.5 py-0.5 rounded text-[10px] text-[#a6a6a6] font-mono">Cmd</kbd>
            <kbd className="bg-[#262626] px-1.5 py-0.5 rounded text-[10px] text-[#a6a6a6] font-mono">K</kbd>
          </div>
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 text-[#a6a6a6]">
          <Activity className="w-4 h-4 hover:text-white cursor-pointer" />
          <Bell className="w-4 h-4 hover:text-white cursor-pointer" />
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#2266ec] to-purple-500 flex items-center justify-center text-white text-[10px] font-bold shadow-lg cursor-pointer">
            LT
          </div>
        </div>
      </div>
    </div>
  );
}
