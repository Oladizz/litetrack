"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Command, Sparkles, Calculator, Navigation, Zap, Star, X, ArrowRight, CornerDownLeft 
} from 'lucide-react';
import { CommandItem, CommandMode } from './types';
import { pluginRegistry } from './plugin-registry';
import { evaluateMathOrCurrency } from './math-engine';
import { parseNaturalLanguageQuery } from './nlp-engine';
import { CommandResultItem } from './result-item';
import { CommandSidePreview } from './side-preview';
import { toast } from '@/components/ui/toast';
import { useWorkspace } from '@/components/ui/workspace-context';

interface CommandCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UniversalCommandCenter({ isOpen, onClose }: CommandCenterProps) {
  const [query, setQuery] = useState('');
  
  const { state } = useWorkspace();
  
  // Inject real data into pluginRegistry
  useEffect(() => {
    const token = localStorage.getItem('litetrack_token');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://litetrack-api-916484331446.us-central1.run.app';
    
    if (token) {
      // 1. Fetch Real Sites (Applications)
      fetch(`${apiUrl}/api/sites`, { headers: { 'Authorization': `Bearer ${token}` } })
        .then(res => res.json())
        .then(data => {
          if (data && data.sites) {
            const siteData = data.sites.map((s: any) => ({
              id: s.site_id,
              label: s.domain,
              metadata: `Site ID: ${s.site_id}`,
              status: 'active',
              url: '/'
            }));
            pluginRegistry.injectData('Application', siteData);
          }
        })
        .catch(err => console.error("Failed to fetch sites", err));

      // 2. Fetch Real Users (If a project is selected)
      if (state.project && state.project !== 'Workspace Admin') {
        fetch(`${apiUrl}/api/admin/firebase/${state.project}/firestore/users`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
          .then(res => res.json())
          .then(resData => {
             if (resData && resData.data) {
                const userData = resData.data.map((u: any) => ({
                  id: u.id,
                  label: u.name || u.email || 'Unknown User',
                  metadata: `${u.email || ''} · ${u.role || 'user'}`,
                  status: 'active',
                  url: `/data-manager/users`
                }));
                pluginRegistry.injectData('User', userData);
             }
          })
          .catch(err => console.error("Failed to fetch users", err));
      }
    }
  }, [state.project]);
  const [activeMode, setActiveMode] = useState<CommandMode>('search');
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [hoveredItem, setHoveredItem] = useState<CommandItem | null>(null);
  const [favorites, setFavorites] = useState<string[]>(['usr_9481', 'ord_9481']);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setActiveMode('search');
    }
  }, [isOpen]);

  // Handle Mode Prefix triggers (/ for Navigation, > for Actions, ? for AI)
  useEffect(() => {
    if (query.startsWith('/')) setActiveMode('navigate');
    else if (query.startsWith('>')) setActiveMode('action');
    else if (query.startsWith('?')) setActiveMode('ai');
    else if (query.startsWith('=')) setActiveMode('calculator');
  }, [query]);

  // Global Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev < allResults.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : allResults.length - 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (allResults[selectedIndex]) {
          allResults[selectedIndex].perform();
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex]);

  if (!isOpen) return null;

  // 1. Math Evaluator
  const mathEval = evaluateMathOrCurrency(query);

  // 2. Natural Language Translator
  const nlpEval = parseNaturalLanguageQuery(query);

  // 3. Search Plugin Registry Execution
  const effectiveQuery = nlpEval.isNLP ? nlpEval.convertedQuery! : query.replace(/^[/=>?]/, '');
  const pluginResults = pluginRegistry.searchAll(effectiveQuery);

  // Combine Results based on Active Mode
  let allResults: CommandItem[] = [];

  if (mathEval.isMath) {
    allResults.push({
      id: 'math_result',
      title: `${mathEval.expression} = ${mathEval.result}`,
      subtitle: 'Built-in Calculator / Currency Evaluator',
      category: 'Calculator',
      icon: '🧮',
      perform: () => {
        navigator.clipboard.writeText(mathEval.result!);
        toast(`Copied ${mathEval.result} to clipboard`, { type: 'success' });
      }
    });
  }

  if (activeMode === 'navigate' || query.startsWith('/')) {
    const navItems: CommandItem[] = [
      { id: 'nav_home', title: 'Dashboard Overview', subtitle: 'Jumps to main dashboard (/)', category: 'Navigation', icon: '📊', perform: () => window.location.href = '/' },
      { id: 'nav_data', title: 'Universal Data Manager', subtitle: 'Jumps to DataGrid engine (/data-manager)', category: 'Navigation', icon: '📁', perform: () => window.location.href = '/data-manager' },
      { id: 'nav_builder', title: 'Dashboard Builder', subtitle: 'Jumps to no-code builder (/dashboard-builder)', category: 'Navigation', icon: '📈', perform: () => window.location.href = '/dashboard-builder' },
      { id: 'nav_users', title: 'Users Directory', subtitle: 'Jumps to user accounts (/users)', category: 'Navigation', icon: '👤', perform: () => window.location.href = '/users' },
      { id: 'nav_settings', title: 'System Settings', subtitle: 'Manage domain settings (/settings)', category: 'Navigation', icon: '⚙️', perform: () => window.location.href = '/settings' },
    ];
    allResults = [...allResults, ...navItems];
  } else if (activeMode === 'action' || query.startsWith('>')) {
    const actionItems: CommandItem[] = [
      { id: 'act_user', title: 'Create New User Account', subtitle: 'Action Command', category: 'Action', icon: '👤', perform: () => toast('Opened User Creation Modal', { type: 'info' }) },
      { id: 'act_report', title: 'Generate PDF System Report', subtitle: 'Action Command', category: 'Action', icon: '📄', perform: () => toast('PDF Report Generated', { type: 'success' }) },
      { id: 'act_sync', title: 'Sync BigQuery & Firebase', subtitle: 'Action Command', category: 'Action', icon: '🔄', perform: () => toast('Database Synced', { type: 'success' }) },
    ];
    allResults = [...allResults, ...actionItems];
  } else if (activeMode === 'ai' || query.startsWith('?')) {
    allResults.push({
      id: 'ai_prompt',
      title: `AI Analyst: "${query.replace('?', '') || 'Ask AI a question...'}"`,
      subtitle: 'Press Enter to analyze dataset natural language insights',
      category: 'AI',
      icon: '✨',
      perform: () => toast('AI Data Analysis Completed', { type: 'success' })
    });
  } else {
    allResults = [...allResults, ...pluginResults];
  }

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-start justify-center pt-20 p-4 animate-in fade-in duration-150">
      <div className="bg-[#1a1a1a] border border-[#333] rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[80vh]">
        {/* Main Search Column */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Search Bar */}
          <div className="p-4 border-b border-[#262626] flex items-center gap-3 bg-[#121212]">
            <Search className="w-5 h-5 text-[#2266ec] shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Type to search everything... (Press / for Nav, > for Actions, ? for AI, = for Math)"
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-[#656565] font-sans"
            />
            {query && (
              <button onClick={() => setQuery('')} className="text-[#656565] hover:text-white p-1 rounded">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Mode Switcher Bar */}
          <div className="flex items-center gap-1 p-2 bg-[#121212] border-b border-[#262626] overflow-x-auto hide-scrollbar text-xs">
            {[
              { id: 'search', label: 'All Results', icon: Command },
              { id: 'navigate', label: '/ Navigate', icon: Navigation },
              { id: 'action', label: '> Actions', icon: Zap },
              { id: 'ai', label: '? AI Analyst', icon: Sparkles },
              { id: 'calculator', label: '= Math & Rates', icon: Calculator },
            ].map(mode => {
              const Icon = mode.icon;
              const isActive = activeMode === mode.id;
              return (
                <button
                  key={mode.id}
                  onClick={() => setActiveMode(mode.id as any)}
                  className={`px-3 py-1 rounded-md transition-all font-medium shrink-0 flex items-center gap-1.5 ${
                    isActive ? 'bg-[#2266ec] text-white font-semibold' : 'text-[#a6a6a6] hover:text-white hover:bg-[#262626]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" /> {mode.label}
                </button>
              );
            })}
          </div>

          {/* Natural Language Conversion Banner */}
          {nlpEval.isNLP && (
            <div className="bg-[#2266ec]/10 border-b border-[#2266ec]/30 px-4 py-2 text-xs text-[#2266ec] flex items-center justify-between font-mono">
              <span>✨ NLP Query: "{nlpEval.convertedQuery}"</span>
              <span className="text-[10px] text-[#a6a6a6]">{nlpEval.explanation}</span>
            </div>
          )}

          {/* Results Stream */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 max-h-[450px]">
            {allResults.length === 0 ? (
              <div className="text-center py-12 text-[#656565] text-xs">
                No matching results found for "{query}".
              </div>
            ) : (
              allResults.map((item, idx) => (
                <CommandResultItem
                  key={item.id}
                  item={item}
                  isSelected={idx === selectedIndex}
                  onHover={() => { setSelectedIndex(idx); setHoveredItem(item); }}
                  onSelect={() => { item.perform(); onClose(); }}
                />
              ))
            )}
          </div>

          {/* Footer Shortcuts Info */}
          <div className="p-3 border-t border-[#262626] bg-[#121212] flex items-center justify-between text-[11px] text-[#656565] font-mono">
            <div className="flex items-center gap-3">
              <span><kbd className="bg-[#262626] px-1.5 py-0.5 rounded text-white">↑↓</kbd> Navigate</span>
              <span><kbd className="bg-[#262626] px-1.5 py-0.5 rounded text-white">↵</kbd> Select</span>
              <span><kbd className="bg-[#262626] px-1.5 py-0.5 rounded text-white">ESC</kbd> Close</span>
            </div>
            <span>Press <kbd className="bg-[#262626] px-1.5 py-0.5 rounded text-[#2266ec]">Cmd + K</kbd> anywhere</span>
          </div>
        </div>

        {/* Side Hover Preview Drawer */}
        <div className="hidden md:block w-72 shrink-0">
          <CommandSidePreview item={hoveredItem || allResults[selectedIndex] || null} />
        </div>
      </div>
    </div>
  );
}
