"use client";

import React, { useState } from 'react';
import { 
  Star, Share2, Copy, Download, Maximize2, Monitor, Lock, Unlock, Plus, RefreshCw, Sparkles, LayoutGrid 
} from 'lucide-react';
import { DashboardState } from './types';

interface HeaderProps {
  dashboard: DashboardState;
  onUpdateTitle: (title: string) => void;
  onToggleFavorite: () => void;
  onToggleLock: () => void;
  onAddWidget: () => void;
  onSelectTemplateModal: () => void;
  onExportPdf: () => void;
  onTogglePresentationMode: () => void;
}

export function DashboardHeader({
  dashboard,
  onUpdateTitle,
  onToggleFavorite,
  onToggleLock,
  onAddWidget,
  onSelectTemplateModal,
  onExportPdf,
  onTogglePresentationMode,
}: HeaderProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(dashboard.title);

  const handleTitleSubmit = () => {
    if (titleInput.trim()) {
      onUpdateTitle(titleInput.trim());
      setIsEditingTitle(false);
    }
  };

  return (
    <div className="space-y-4 pb-4 border-b border-[#262626]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Title & Live Status Indicator */}
        <div>
          <div className="flex items-center gap-3">
            {isEditingTitle ? (
              <input
                type="text"
                autoFocus
                value={titleInput}
                onChange={e => setTitleInput(e.target.value)}
                onBlur={handleTitleSubmit}
                onKeyDown={e => e.key === 'Enter' && handleTitleSubmit()}
                className="bg-[#121212] border border-[#2266ec] text-2xl font-bold text-white px-2 py-1 rounded outline-none"
              />
            ) : (
              <h1 
                onClick={() => setIsEditingTitle(true)}
                className="text-2xl font-bold text-white tracking-tight cursor-pointer hover:text-[#2266ec] transition-colors"
                title="Click to rename dashboard"
              >
                {dashboard.title}
              </h1>
            )}

            <button onClick={onToggleFavorite} className="p-1 rounded text-[#a6a6a6] hover:text-amber-400">
              <Star className={`w-5 h-5 ${dashboard.isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
            </button>

            {/* Live Refresh Status */}
            <span className="flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 px-2.5 py-0.5 rounded-full text-green-400 text-[11px] font-mono font-semibold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Live ●
            </span>
          </div>

          <div className="flex items-center gap-4 mt-1 text-xs text-[#a6a6a6]">
            <span>{dashboard.description}</span>
            <span className="text-[#656565]">·</span>
            <span className="font-mono text-[11px] text-[#656565]">Last updated {dashboard.lastUpdated}</span>
            <span className="text-[#656565]">·</span>
            <span className="font-mono text-[11px] text-[#656565]">Owner: {dashboard.owner}</span>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onSelectTemplateModal}
            className="px-3 py-1.5 bg-[#1a1a1a] border border-[#262626] hover:border-[#404040] text-xs font-medium text-white rounded-lg transition-colors flex items-center gap-1.5 shadow"
          >
            <LayoutGrid className="w-3.5 h-3.5 text-purple-400" /> Templates
          </button>

          <button
            onClick={onToggleLock}
            className={`p-2 border rounded-lg transition-colors ${
              dashboard.locked ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-[#1a1a1a] border-[#262626] text-[#a6a6a6] hover:text-white'
            }`}
            title={dashboard.locked ? 'Dashboard Locked' : 'Lock Layout'}
          >
            {dashboard.locked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
          </button>

          <button
            onClick={onTogglePresentationMode}
            className="p-2 bg-[#1a1a1a] border border-[#262626] hover:border-[#404040] text-[#a6a6a6] hover:text-white rounded-lg transition-colors"
            title="Presentation Mode"
          >
            <Monitor className="w-4 h-4 text-[#2266ec]" />
          </button>

          <button
            onClick={onExportPdf}
            className="px-3 py-1.5 bg-[#1a1a1a] border border-[#262626] hover:border-[#404040] text-xs font-medium text-white rounded-lg transition-colors flex items-center gap-1.5 shadow"
          >
            <Download className="w-3.5 h-3.5 text-[#a6a6a6]" /> Export
          </button>

          <button
            onClick={onAddWidget}
            className="px-4 py-1.5 bg-[#2266ec] hover:bg-[#1d57cc] text-xs font-semibold text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-lg shadow-[#2266ec]/20"
          >
            <Plus className="w-4 h-4" /> Add Widget
          </button>
        </div>
      </div>
    </div>
  );
}
