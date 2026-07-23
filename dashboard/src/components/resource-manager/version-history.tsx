"use client";

import React from 'react';
import { History, RotateCcw, Check, Clock } from 'lucide-react';
import { ResourceItem } from './types';
import { toast } from '@/components/ui/toast';

interface VersionProps {
  resource: ResourceItem | null;
}

export function VersionHistoryStack({ resource }: VersionProps) {
  if (!resource) return null;

  const handleRollback = (ver: string) => {
    toast(`Restored resource version to ${ver}`, { type: 'success' });
  };

  return (
    <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-5 shadow-xl space-y-4 font-sans">
      <div className="flex items-center justify-between border-b border-[#262626] pb-3">
        <h3 className="font-bold text-white text-base flex items-center gap-2">
          <History className="w-4 h-4 text-[#2266ec]" /> Version History: {resource.title}
        </h3>
        <span className="text-xs text-[#a6a6a6] font-mono">Current Version: {resource.version}</span>
      </div>

      <div className="space-y-2">
        {resource.versionHistory.map((v, i) => (
          <div key={v.version} className="bg-[#121212] p-3 rounded-xl border border-[#262626] flex items-center justify-between text-xs font-mono">
            <div>
              <div className="text-white font-bold flex items-center gap-2">
                <span>{v.version}</span>
                {i === 0 && <span className="bg-green-500/20 text-green-400 text-[9px] px-1.5 py-0.5 rounded">CURRENT</span>}
              </div>
              <div className="text-[10px] text-[#656565]">{v.summary} · {v.createdAt} by {v.createdBy}</div>
            </div>

            {i !== 0 && (
              <button
                onClick={() => handleRollback(v.version)}
                className="px-3 py-1 bg-[#262626] hover:bg-[#333] text-white text-xs rounded-lg transition-colors flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3 text-[#2266ec]" /> Restore
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
