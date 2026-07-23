"use client";

import React from 'react';
import { CommandItem } from './types';
import { ChevronRight } from 'lucide-react';

interface ResultItemProps {
  item: CommandItem;
  isSelected: boolean;
  onHover: () => void;
  onSelect: () => void;
}

export function CommandResultItem({
  item,
  isSelected,
  onHover,
  onSelect,
}: ResultItemProps) {
  return (
    <div
      onMouseEnter={onHover}
      onClick={onSelect}
      className={`group flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
        isSelected
          ? 'bg-[#2266ec]/15 border-[#2266ec]/50 text-white shadow-md'
          : 'bg-[#1a1a1a] border-[#262626] text-[#a6a6a6] hover:bg-[#262626]/50'
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-8 h-8 rounded-lg bg-[#121212] border border-[#262626] flex items-center justify-center text-sm shrink-0">
          {item.icon || '🔍'}
        </div>
        <div className="min-w-0">
          <div className="font-semibold text-white text-xs truncate flex items-center gap-2">
            {item.title}
            {item.status && (
              <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded capitalize ${
                item.status === 'active' || item.status === 'completed'
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-amber-500/20 text-amber-400'
              }`}>
                {item.status}
              </span>
            )}
          </div>
          {item.subtitle && (
            <div className="text-[11px] text-[#656565] truncate font-mono">{item.subtitle}</div>
          )}
        </div>
      </div>

      {/* Quick Action Chips & Category */}
      <div className="flex items-center gap-2 shrink-0">
        {item.quickActions?.slice(0, 2).map((qa, i) => (
          <button
            key={i}
            onClick={(e) => { e.stopPropagation(); qa.action(); }}
            className="opacity-0 group-hover:opacity-100 bg-[#262626] hover:bg-[#333] text-white text-[10px] px-2 py-0.5 rounded transition-opacity"
          >
            {qa.label}
          </button>
        ))}

        <span className="text-[10px] font-mono text-[#656565] uppercase bg-[#121212] px-2 py-0.5 rounded border border-[#262626]">
          {item.category}
        </span>
        <ChevronRight className="w-3.5 h-3.5 text-[#656565] group-hover:text-white transition-colors" />
      </div>
    </div>
  );
}
