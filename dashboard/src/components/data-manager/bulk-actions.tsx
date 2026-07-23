"use client";

import React from 'react';
import { 
  Trash2, Archive, Download, UserPlus, Tag, Copy, CheckCircle2, FolderInput, X 
} from 'lucide-react';

interface BulkActionsProps {
  selectedCount: number;
  onClearSelection: () => void;
  onDeleteSelected: () => void;
  onArchiveSelected: () => void;
  onExportSelected: () => void;
  onAssignSelected: () => void;
  onTagSelected: () => void;
  onDuplicateSelected: () => void;
  onApproveSelected: () => void;
}

export function DataManagerBulkActions({
  selectedCount,
  onClearSelection,
  onDeleteSelected,
  onArchiveSelected,
  onExportSelected,
  onAssignSelected,
  onTagSelected,
  onDuplicateSelected,
  onApproveSelected,
}: BulkActionsProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#1a1a1a] border border-[#333] rounded-2xl px-5 py-3 shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-200">
      <span className="bg-[#2266ec] text-white font-mono text-xs font-bold px-2.5 py-1 rounded-full">
        {selectedCount} Selected
      </span>

      <div className="h-4 w-px bg-[#333]"></div>

      <div className="flex items-center gap-1.5 text-xs font-medium">
        <button
          onClick={onApproveSelected}
          className="px-2.5 py-1.5 bg-[#262626] hover:bg-[#333] text-green-400 hover:text-green-300 rounded-md transition-colors flex items-center gap-1"
        >
          <CheckCircle2 className="w-3.5 h-3.5" /> Approve
        </button>

        <button
          onClick={onTagSelected}
          className="px-2.5 py-1.5 bg-[#262626] hover:bg-[#333] text-white rounded-md transition-colors flex items-center gap-1"
        >
          <Tag className="w-3.5 h-3.5 text-[#2266ec]" /> Tag
        </button>

        <button
          onClick={onAssignSelected}
          className="px-2.5 py-1.5 bg-[#262626] hover:bg-[#333] text-white rounded-md transition-colors flex items-center gap-1"
        >
          <UserPlus className="w-3.5 h-3.5 text-amber-400" /> Assign
        </button>

        <button
          onClick={onDuplicateSelected}
          className="px-2.5 py-1.5 bg-[#262626] hover:bg-[#333] text-white rounded-md transition-colors flex items-center gap-1"
        >
          <Copy className="w-3.5 h-3.5 text-purple-400" /> Duplicate
        </button>

        <button
          onClick={onExportSelected}
          className="px-2.5 py-1.5 bg-[#262626] hover:bg-[#333] text-white rounded-md transition-colors flex items-center gap-1"
        >
          <Download className="w-3.5 h-3.5 text-blue-400" /> Export
        </button>

        <button
          onClick={onArchiveSelected}
          className="px-2.5 py-1.5 bg-[#262626] hover:bg-[#333] text-white rounded-md transition-colors flex items-center gap-1"
        >
          <Archive className="w-3.5 h-3.5 text-yellow-400" /> Archive
        </button>

        <button
          onClick={onDeleteSelected}
          className="px-2.5 py-1.5 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 rounded-md transition-colors flex items-center gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" /> Delete
        </button>
      </div>

      <div className="h-4 w-px bg-[#333]"></div>

      <button
        onClick={onClearSelection}
        className="text-[#656565] hover:text-white p-1 rounded-md"
        title="Clear Selection"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
