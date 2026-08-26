"use client";

import React, { useState } from 'react';
import {
  Pin, Clock, Star, FolderOpen, Search as SearchIcon, Bot,
  ChevronDown, ChevronRight, Plus, PanelLeftClose, PanelLeft
} from 'lucide-react';
import { IconRenderer } from '@/components/ui/IconRenderer';
import { NavItem, NavSection } from './types';

interface Props {
  navItems: NavItem[];
  activeWorkspaceId: string;
  onSelectItem: (item: NavItem) => void;
  onCreateWorkspace: () => void;
}

const SECTIONS: { id: NavSection; label: string; icon: React.ReactNode }[] = [
  { id: 'pinned', label: 'Pinned', icon: <Pin className="w-3 h-3" /> },
  { id: 'recent', label: 'Recent', icon: <Clock className="w-3 h-3" /> },
  { id: 'favorites', label: 'Favorites', icon: <Star className="w-3 h-3" /> },
  { id: 'collections', label: 'Collections', icon: <FolderOpen className="w-3 h-3" /> },
  { id: 'investigations', label: 'Investigations', icon: <SearchIcon className="w-3 h-3" /> },
  { id: 'ai_workspaces', label: 'AI Workspaces', icon: <Bot className="w-3 h-3" /> },
];

export function WorkspaceNavigator({ navItems, activeWorkspaceId, onSelectItem, onCreateWorkspace }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<NavSection, boolean>>({
    pinned: true, recent: true, favorites: true,
    collections: false, investigations: true, ai_workspaces: true,
  });

  const toggleSection = (section: NavSection) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  if (collapsed) {
    return (
      <div className="w-10 bg-[#0f0f0f] border-r border-[#262626] flex flex-col items-center py-3 gap-2 shrink-0">
        <button onClick={() => setCollapsed(false)} className="p-1.5 rounded-lg hover:bg-[#1a1a1a] text-[#656565] hover:text-white transition-colors" title="Expand Navigator">
          <PanelLeft className="w-4 h-4" />
        </button>
        <div className="w-5 h-px bg-[#262626] my-1" />
        {SECTIONS.map(sec => {
          const items = navItems.filter(n => n.section === sec.id);
          if (items.length === 0) return null;
          return (
            <button key={sec.id} className="p-1.5 rounded-lg hover:bg-[#1a1a1a] text-[#656565] hover:text-white transition-colors relative" title={sec.label}>
              {sec.icon}
              {items.some(i => i.badge) && <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-[#2266ec] rounded-full" />}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="w-56 bg-[#0f0f0f] border-r border-[#262626] flex flex-col shrink-0 overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-[#262626]">
        <span className="text-[10px] text-[#656565] font-semibold uppercase tracking-wider">Navigator</span>
        <div className="flex items-center gap-1">
          <button onClick={onCreateWorkspace} className="p-1 rounded text-[#656565] hover:text-[#2266ec] transition-colors" title="New Workspace">
            <Plus className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => setCollapsed(true)} className="p-1 rounded text-[#656565] hover:text-white transition-colors" title="Collapse">
            <PanelLeftClose className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-1 space-y-0.5">
        {SECTIONS.map(sec => {
          const items = navItems.filter(n => n.section === sec.id);
          if (items.length === 0) return null;
          const isExpanded = expandedSections[sec.id];
          return (
            <div key={sec.id}>
              <button onClick={() => toggleSection(sec.id)} className="w-full flex items-center gap-2 px-3 py-1.5 text-[10px] font-semibold text-[#656565] hover:text-white uppercase tracking-wider transition-colors">
                {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                {sec.icon}
                <span>{sec.label}</span>
                <span className="ml-auto text-[9px] font-mono text-[#333]">{items.length}</span>
              </button>
              {isExpanded && (
                <div className="space-y-0.5 pb-1">
                  {items.map(item => (
                    <button
                      key={item.id}
                      onClick={() => onSelectItem(item)}
                      className={`w-full flex items-center gap-2 px-4 py-1.5 text-xs transition-all ${
                        item.workspaceId === activeWorkspaceId
                          ? 'bg-[#2266ec]/10 text-white border-l-2 border-[#2266ec]'
                          : 'text-[#a6a6a6] hover:text-white hover:bg-[#1a1a1a] border-l-2 border-transparent'
                      }`}
                    >
                      <IconRenderer name={item.icon} className="w-4 h-4 shrink-0 text-[#a6a6a6]" />
                      <span className="truncate font-medium">{item.label}</span>
                      {item.badge && (
                        <span className="ml-auto text-[8px] bg-[#2266ec] text-white px-1.5 py-0.5 rounded-full font-bold shrink-0">{item.badge}</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
