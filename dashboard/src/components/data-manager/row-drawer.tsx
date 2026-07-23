"use client";

import React, { useState } from 'react';
import { 
  X, Info, Activity, FileText, Paperclip, Share2, Code2, ShieldCheck, Clock, Check, Trash2, Edit, Sparkles 
} from 'lucide-react';
import { ColumnDef } from './types';

interface RowDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  row: Record<string, any> | null;
  columns: ColumnDef[];
  onSaveNotes?: (rowId: string, notes: string) => void;
}

export function DataManagerRowDrawer({
  isOpen,
  onClose,
  row,
  columns,
  onSaveNotes,
}: RowDrawerProps) {
  const [notes, setNotes] = useState('');

  if (!isOpen || !row) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end animate-in fade-in duration-200">
      <div className="bg-[#121212] border-l border-[#262626] w-full max-w-md h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        
        {/* Drawer Header - Clean, Industrial */}
        <div className="px-6 py-5 flex items-start justify-between border-b border-[#262626] shrink-0 bg-[#1a1a1a]">
          <div>
            <span className="text-[10px] font-mono text-[#656565] uppercase tracking-wider block mb-1">SELECTED CONTEXT</span>
            <h2 className="text-[17px] font-bold text-[#fafafa] tracking-tight">{row.name || row.title || row.email || row.id}</h2>
            <div className="text-[12px] text-[#a6a6a6] font-mono mt-1">ID: {row.id}</div>
          </div>
          <button onClick={onClose} className="text-[#656565] hover:text-[#fafafa] p-1 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Seamless Scrolling Context Body (No Tabs) */}
        <div className="flex-1 overflow-y-auto hide-scrollbar p-6 space-y-8 bg-[#121212]">
          
          {/* AI Summary Card */}
          <div className="space-y-3">
            <h3 className="text-[11px] font-bold text-[#656565] uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> AI Insights
            </h3>
            <div className="bg-[#1a1a1a] rounded-lg border border-[#262626] p-4 text-[13px] text-[#fafafa] space-y-3">
              <div className="flex items-center gap-2 text-indigo-400 font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                AI found 2 anomalies.
              </div>
              <p className="text-[#a6a6a6] leading-relaxed">
                This record's activity pattern deviates from the cohort average. Last sign-in occurred from a new IP address outside the usual geographic region.
              </p>
            </div>
          </div>

          {/* Record Attributes */}
          <div className="space-y-3">
            <h3 className="text-[11px] font-bold text-[#656565] uppercase tracking-wider flex items-center gap-2">
              <Info className="w-3.5 h-3.5" /> Details
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {columns.map(col => (
                <div key={col.id} className="bg-[#1a1a1a] p-3 rounded-md border border-[#262626]">
                  <div className="text-[10px] text-[#656565] font-mono mb-1">{col.label}</div>
                  <div className="text-[13px] text-[#fafafa] font-medium truncate">
                    {row[col.id] !== undefined && row[col.id] !== null && row[col.id] !== '' ? String(row[col.id]) : <span className="text-[#404040]">N/A</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Timeline */}
          <div className="space-y-3">
            <h3 className="text-[11px] font-bold text-[#656565] uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-3.5 h-3.5" /> Timeline
            </h3>
            <div className="space-y-0 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-[#262626] before:to-transparent">
               <div className="relative flex items-start justify-between gap-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#2266ec] ring-4 ring-[#121212] z-10 shrink-0 mt-1.5" />
                    <div>
                      <div className="text-[13px] text-[#fafafa] font-medium">Record Viewed</div>
                      <div className="text-[11px] text-[#656565]">By Admin OS Context Panel</div>
                    </div>
                  </div>
                  <div className="text-[10px] text-[#656565] font-mono shrink-0">Just now</div>
               </div>
               <div className="relative flex items-start justify-between gap-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#333] ring-4 ring-[#121212] z-10 shrink-0 mt-1.5" />
                    <div>
                      <div className="text-[13px] text-[#a6a6a6] font-medium">Record Updated</div>
                      <div className="text-[11px] text-[#656565]">System Sync</div>
                    </div>
                  </div>
                  <div className="text-[10px] text-[#656565] font-mono shrink-0">2h ago</div>
               </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-3">
            <h3 className="text-[11px] font-bold text-[#656565] uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-3.5 h-3.5" /> Notes
            </h3>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Add context or internal notes..."
              rows={3}
              className="w-full bg-[#1a1a1a] border border-[#262626] rounded-md p-3 text-[13px] text-[#fafafa] outline-none focus:border-[#fafafa] transition-colors resize-none"
            />
          </div>

          {/* Raw JSON Developer View */}
          <div className="space-y-3 pt-4">
            <h3 className="text-[11px] font-bold text-[#656565] uppercase tracking-wider flex items-center gap-2">
              <Code2 className="w-3.5 h-3.5" /> Raw Data
            </h3>
            <pre className="bg-[#1a1a1a] border border-[#262626] rounded-md p-4 text-[11px] font-mono text-[#a6a6a6] overflow-x-auto">
              {JSON.stringify(row, null, 2)}
            </pre>
          </div>

        </div>
      </div>
    </div>
  );
}
