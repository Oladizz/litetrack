"use client";

import React from 'react';
import { Database, FilterX, Sparkles, XCircle } from 'lucide-react';

interface EmptyStateProps {
  entityTitle: string;
  onCreateClick?: () => void;
  onClearFilters?: () => void;
}

export function DataManagerEmptyState({
  entityTitle,
  onCreateClick,
  onClearFilters,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-start justify-center h-full w-full max-w-lg mx-auto space-y-6">
      <div className="w-10 h-10 rounded border border-[#333] flex items-center justify-center text-[#656565] bg-[#1a1a1a]">
        <Database className="w-5 h-5" />
      </div>

      <div className="space-y-2">
        <h3 className="text-[15px] font-bold text-[#fafafa] tracking-tight">No {entityTitle.toLowerCase()} match your current filters.</h3>
        <p className="text-[13px] text-[#a6a6a6]">
          The workspace is currently empty based on your search and filter parameters.
        </p>
      </div>

      <div className="w-full space-y-2 border-t border-[#262626] pt-6">
        <button 
          onClick={onClearFilters}
          className="w-full flex items-center justify-between px-4 py-2.5 rounded bg-[#1a1a1a] border border-[#262626] hover:bg-[#222] hover:border-[#333] text-[13px] text-[#fafafa] font-medium transition-colors"
        >
          <span className="flex items-center gap-2 text-[#a6a6a6]"><FilterX className="w-4 h-4" /> Clear active filters</span>
          <span className="text-[#656565] font-mono text-[10px]">ESC</span>
        </button>

        <button 
          className="w-full flex items-center justify-between px-4 py-2.5 rounded bg-[#1a1a1a] border border-[#262626] hover:bg-[#222] hover:border-[#333] text-[13px] text-[#fafafa] font-medium transition-colors"
        >
          <span className="flex items-center gap-2 text-indigo-400"><Sparkles className="w-4 h-4" /> Ask AI to broaden search</span>
          <span className="text-[#656565] font-mono text-[10px]">⌘ J</span>
        </button>

        {onCreateClick && (
          <button
            onClick={onCreateClick}
            className="w-full flex items-center justify-between px-4 py-2.5 rounded bg-[#2266ec]/10 border border-[#2266ec]/20 hover:bg-[#2266ec]/20 hover:border-[#2266ec]/30 text-[13px] text-[#2266ec] font-medium transition-colors"
          >
            <span className="flex items-center gap-2">Create new {entityTitle.slice(0, -1).toLowerCase()}</span>
            <span className="text-[#2266ec]/60 font-mono text-[10px]">N</span>
          </button>
        )}
      </div>
    </div>
  );
}
