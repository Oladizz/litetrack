"use client";

import React, { useEffect, useRef } from 'react';
import { 
  Eye, Copy, Archive, Trash2, Clock, Code2, ExternalLink 
} from 'lucide-react';
import { toast } from '@/components/ui/toast';

interface ContextMenuProps {
  x: number;
  y: number;
  row: Record<string, any> | null;
  onClose: () => void;
  onOpenRow: (row: Record<string, any>) => void;
  onDeleteRow: (rowId: string) => void;
  onArchiveRow: (rowId: string) => void;
  onDuplicateRow: (row: Record<string, any>) => void;
}

export function DataManagerContextMenu({
  x,
  y,
  row,
  onClose,
  onOpenRow,
  onDeleteRow,
  onArchiveRow,
  onDuplicateRow,
}: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  if (!row) return null;

  const handleCopyId = () => {
    navigator.clipboard.writeText(row.id);
    toast(`Copied ID "${row.id}" to clipboard`, { type: 'success' });
    onClose();
  };

  return (
    <div
      ref={menuRef}
      style={{ top: y, left: x }}
      className="fixed z-50 bg-[#1a1a1a] border border-[#333] rounded-xl shadow-2xl p-1.5 w-56 text-xs animate-in fade-in zoom-in-95 duration-100 space-y-0.5"
    >
      <button
        onClick={() => { onOpenRow(row); onClose(); }}
        className="w-full text-left px-3 py-2 text-white hover:bg-[#262626] rounded-md transition-colors flex items-center gap-2 font-medium"
      >
        <Eye className="w-3.5 h-3.5 text-[#2266ec]" /> Open Record Details
      </button>

      <button
        onClick={handleCopyId}
        className="w-full text-left px-3 py-2 text-[#a6a6a6] hover:text-white hover:bg-[#262626] rounded-md transition-colors flex items-center gap-2"
      >
        <Copy className="w-3.5 h-3.5 text-amber-400" /> Copy Record ID
      </button>

      <button
        onClick={() => { onDuplicateRow(row); onClose(); }}
        className="w-full text-left px-3 py-2 text-[#a6a6a6] hover:text-white hover:bg-[#262626] rounded-md transition-colors flex items-center gap-2"
      >
        <Copy className="w-3.5 h-3.5 text-purple-400" /> Duplicate Record
      </button>

      <div className="h-px bg-[#262626] my-1"></div>

      <button
        onClick={() => { onArchiveRow(row.id); onClose(); }}
        className="w-full text-left px-3 py-2 text-[#a6a6a6] hover:text-white hover:bg-[#262626] rounded-md transition-colors flex items-center gap-2"
      >
        <Archive className="w-3.5 h-3.5 text-yellow-400" /> Archive Record
      </button>

      <button
        onClick={() => { onDeleteRow(row.id); onClose(); }}
        className="w-full text-left px-3 py-2 text-red-400 hover:bg-red-500/10 rounded-md transition-colors flex items-center gap-2"
      >
        <Trash2 className="w-3.5 h-3.5" /> Delete Record
      </button>
    </div>
  );
}
