"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, LayoutDashboard, Settings, Users, FileText, 
  ArrowRight, Download, UserPlus, ShoppingCart 
} from 'lucide-react';
import { useDashboardsStore } from '@/components/dashboards/store';
import { useWorkspace } from '@/components/ui/workspace-context';

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const { dashboards } = useDashboardsStore();
  const { state, setProject } = useWorkspace();
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
      if (e.key === 'Escape' && open) {
        setOpen(false);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [open]);

  // All possible commands
  const rawItems = [
    { id: 'nav-overview', type: 'Navigation', icon: LayoutDashboard, label: 'Analytics Overview', action: () => router.push('/') },
    { id: 'nav-users', type: 'Navigation', icon: Users, label: 'Users & Customers', action: () => router.push('/users') },
    { id: 'nav-finances', type: 'Navigation', icon: ShoppingCart, label: 'Commerce & Finances', action: () => router.push('/finances') },
    { id: 'nav-settings', type: 'Navigation', icon: Settings, label: 'Project Settings', action: () => router.push('/settings') },
    { id: 'act-invite', type: 'Actions', icon: UserPlus, label: 'Invite User', action: () => alert('Invite user modal') },
    { id: 'act-export', type: 'Actions', icon: Download, label: 'Export Current View', action: () => alert('Exporting data...') },
    ...dashboards.map(d => ({
      id: `dash-${d.id}`,
      type: 'Dashboards',
      icon: FileText,
      label: d.name,
      action: () => router.push(`/dashboards/${d.id}`)
    }))
  ];

  // Filter based on query
  const filteredItems = rawItems.filter(item => 
    item.label.toLowerCase().includes(query.toLowerCase()) || 
    item.type.toLowerCase().includes(query.toLowerCase())
  );

  // Handle keyboard navigation
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev < filteredItems.length - 1 ? prev + 1 : prev));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
      } else if (e.key === 'Enter' && filteredItems.length > 0) {
        e.preventDefault();
        const selected = filteredItems[selectedIndex];
        setOpen(false);
        setQuery('');
        selected.action();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, filteredItems, selectedIndex]);

  // Scroll active item into view
  useEffect(() => {
    if (listRef.current && open) {
      const activeEl = listRef.current.querySelector('[data-active="true"]');
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex, open]);


  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
      
      <div className="relative w-full max-w-[650px] bg-[#121212] border border-[#333] rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        <div className="flex items-center px-4 py-3 border-b border-[#333]">
          <Search className="w-5 h-5 text-[#656565] mr-3" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent border-0 text-[15px] text-white outline-none placeholder:text-[#656565]"
            placeholder="Search everything... (Users, Dashboards, Actions)"
          />
          <div className="text-[10px] text-[#656565] bg-[#262626] px-1.5 py-0.5 rounded font-mono font-medium">ESC</div>
        </div>

        <div ref={listRef} className="max-h-[350px] overflow-y-auto p-2 hide-scrollbar">
          {filteredItems.length === 0 ? (
            <div className="text-center py-8 text-[#656565] text-[13px]">
              No results found for &quot;{query}&quot;
            </div>
          ) : (
            // Group the items by type
            Object.entries(
              filteredItems.reduce((acc, item) => {
                acc[item.type] = acc[item.type] || [];
                acc[item.type].push(item);
                return acc;
              }, {} as Record<string, typeof filteredItems>)
            ).map(([type, items]) => (
              <div key={type} className="mb-2 last:mb-0">
                <div className="px-3 py-1.5 mt-1 text-[10px] font-bold text-[#656565] uppercase tracking-wider">
                  {type}
                </div>
                {items.map((item) => {
                  const index = filteredItems.findIndex(i => i.id === item.id);
                  const isActive = index === selectedIndex;
                  return (
                    <button
                      key={item.id}
                      data-active={isActive}
                      onClick={() => {
                        setOpen(false);
                        setQuery('');
                        item.action();
                      }}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left text-[13px] transition-colors ${
                        isActive ? 'bg-[#2266ec] text-white' : 'text-[#a6a6a6] hover:bg-[#1a1a1a] hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#656565]'}`} />
                        {item.label}
                      </div>
                      {isActive && (
                        <ArrowRight className="w-3.5 h-3.5 text-white" />
                      )}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        <div className="px-4 py-2 border-t border-[#262626] bg-[#0a0a0f] flex items-center justify-between text-[11px] text-[#656565]">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><span className="px-1 py-0.5 rounded bg-[#262626] text-[#a6a6a6]">↑↓</span> to navigate</span>
            <span className="flex items-center gap-1"><span className="px-1 py-0.5 rounded bg-[#262626] text-[#a6a6a6]">↵</span> to select</span>
          </div>
          <div>
            Workspace: <span className="text-[#a6a6a6] font-medium">{state.projectName}</span>
          </div>
        </div>

      </div>
    </div>
  );
}
