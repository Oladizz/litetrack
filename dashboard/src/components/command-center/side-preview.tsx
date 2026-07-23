"use client";

import React from 'react';
import { CommandItem } from './types';
import { User, Mail, Globe, Shield, Clock, ExternalLink } from 'lucide-react';

interface SidePreviewProps {
  item: CommandItem | null;
}

export function CommandSidePreview({ item }: SidePreviewProps) {
  if (!item) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center text-[#656565] text-xs">
        <span className="text-2xl mb-2">👁️</span>
        Hover over any search result or command to view quick metadata inspection.
      </div>
    );
  }

  const meta = item.metadata || {};

  return (
    <div className="h-full p-5 space-y-4 text-xs bg-[#121212] border-l border-[#262626]">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-[#262626] pb-3">
        <div className="w-10 h-10 rounded-full bg-[#2266ec]/20 border border-[#2266ec]/40 flex items-center justify-center text-lg shrink-0">
          {item.icon || '👤'}
        </div>
        <div>
          <h4 className="font-bold text-white text-sm">{item.title}</h4>
          <span className="text-[10px] font-mono text-[#2266ec] bg-[#2266ec]/10 px-2 py-0.5 rounded border border-[#2266ec]/30 uppercase">
            {item.category}
          </span>
        </div>
      </div>

      {/* Details List */}
      <div className="space-y-3">
        <div className="bg-[#1a1a1a] p-3 rounded-lg border border-[#262626] space-y-2">
          <div className="text-[10px] text-[#656565] font-mono uppercase">Entity Quick Overview</div>
          {meta.email && (
            <div className="flex items-center gap-2 text-[#a6a6a6]">
              <Mail className="w-3.5 h-3.5 text-[#2266ec]" /> <span>{meta.email}</span>
            </div>
          )}
          {meta.country && (
            <div className="flex items-center gap-2 text-[#a6a6a6]">
              <Globe className="w-3.5 h-3.5 text-purple-400" /> <span>{meta.country}</span>
            </div>
          )}
          {meta.role && (
            <div className="flex items-center gap-2 text-[#a6a6a6]">
              <Shield className="w-3.5 h-3.5 text-amber-400" /> <span>Role: {meta.role}</span>
            </div>
          )}
        </div>

        {/* Action Button Prompts */}
        <button
          onClick={item.perform}
          className="w-full py-2 bg-[#2266ec] hover:bg-[#1d57cc] text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-lg shadow-[#2266ec]/20"
        >
          Execute Command / Open <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
