"use client";

import React from 'react';
import {
  Clipboard, Pin, MousePointer, Cpu, Bot, Download,
  Bell, Check, AlertTriangle, Loader2, X
} from 'lucide-react';
import { DockItem } from './types';

interface Props {
  items: DockItem[];
  onDismissItem: (id: string) => void;
}

const TYPE_ICON: Record<string, React.ReactNode> = {
  clipboard: <Clipboard className="w-3 h-3" />,
  pinned: <Pin className="w-3 h-3" />,
  selection: <MousePointer className="w-3 h-3" />,
  job: <Cpu className="w-3 h-3" />,
  ai_task: <Bot className="w-3 h-3" />,
  download: <Download className="w-3 h-3" />,
  notification: <Bell className="w-3 h-3" />,
};

const STATUS_ICON: Record<string, React.ReactNode> = {
  running: <Loader2 className="w-2.5 h-2.5 animate-spin text-[#2266ec]" />,
  complete: <Check className="w-2.5 h-2.5 text-green-400" />,
  error: <AlertTriangle className="w-2.5 h-2.5 text-red-400" />,
};

export function DynamicDock({ items, onDismissItem }: Props) {
  if (items.length === 0) return null;

  const runningCount = items.filter(i => i.status === 'running').length;

  return (
    <div className="h-9 bg-[#0f0f0f] border-t border-[#262626] flex items-center px-3 gap-1.5 shrink-0 overflow-x-auto hide-scrollbar">
      {/* Running indicator */}
      {runningCount > 0 && (
        <div className="flex items-center gap-1.5 text-[9px] text-[#2266ec] font-mono font-semibold pr-2 border-r border-[#262626] mr-1 shrink-0">
          <Loader2 className="w-3 h-3 animate-spin" />
          {runningCount} running
        </div>
      )}

      {/* Dock Items */}
      {items.map(item => (
        <div
          key={item.id}
          className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[#1a1a1a] border border-[#262626] text-[9px] text-[#a6a6a6] hover:text-white transition-colors shrink-0 group"
        >
          <span className="text-[#656565]">{TYPE_ICON[item.type]}</span>
          <span className="text-xs">{item.icon}</span>
          <span className="font-medium max-w-[100px] truncate">{item.label}</span>

          {item.status && STATUS_ICON[item.status]}

          {item.progress !== undefined && item.progress > 0 && item.progress < 100 && (
            <div className="w-12 h-1 bg-[#262626] rounded-full overflow-hidden">
              <div className="h-full bg-[#2266ec] rounded-full" style={{ width: `${item.progress}%` }} />
            </div>
          )}

          <button
            onClick={() => onDismissItem(item.id)}
            className="opacity-0 group-hover:opacity-100 text-[#656565] hover:text-red-400 transition-all"
          >
            <X className="w-2.5 h-2.5" />
          </button>
        </div>
      ))}

      {/* Right section - keyboard hint */}
      <div className="ml-auto flex items-center gap-2 text-[8px] text-[#333] font-mono shrink-0">
        <span>⌘K Search</span>
        <span>⌘J AI</span>
        <span>Esc Back</span>
      </div>
    </div>
  );
}
