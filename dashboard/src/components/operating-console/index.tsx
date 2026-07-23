"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Sparkles, Zap, Command, X, ArrowRight, CornerDownLeft, RefreshCw, Layers 
} from 'lucide-react';
import { ConsoleMode, SelfAwarenessContext, CopilotResponse, AutopilotExecution } from './types';
import { ConsoleHeader } from './console-header';
import { pluginRegistry } from '../command-center/plugin-registry';
import { evaluateMathOrCurrency } from '../command-center/math-engine';
import { parseNaturalLanguageQuery } from '../command-center/nlp-engine';
import { CommandResultItem } from '../command-center/result-item';
import { CommandSidePreview } from '../command-center/side-preview';
import { runCopilotQuery } from './copilot-engine';
import { runAutopilotInstruction } from './autopilot-composer';
import { toast } from '@/components/ui/toast';

interface OperatingConsoleProps {
  isOpen: boolean;
  onClose: () => void;
}

export function OperatingConsole({ isOpen, onClose }: OperatingConsoleProps) {
  const [activeMode, setActiveMode] = useState<ConsoleMode>('search');
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [hoveredItem, setHoveredItem] = useState<any>(null);

  // Copilot & Autopilot Results
  const [copilotOutput, setCopilotOutput] = useState<CopilotResponse | null>(null);
  const [autopilotOutput, setAutopilotOutput] = useState<AutopilotExecution | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  // Self Awareness State Context Provider
  const selfAwarenessContext: SelfAwarenessContext = {
    currentWorkspace: 'Main Enterprise Workspace',
    currentPage: '/dashboards/exec',
    currentDashboard: 'Sales & Executive Performance',
    userRole: 'admin',
    userPermissions: ['read', 'write', 'export', 'admin_override'],
    visibleWidgets: ['w_kpi_rev', 'w_kpi_users', 'w_ai_summary', 'w_rev_chart'],
    activeFilters: { dateRange: '24h', region: 'global' },
    currentTheme: 'dark',
    registeredPlugins: ['Users Engine', 'Orders Engine', 'Analytics Engine']
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setCopilotOutput(null);
      setAutopilotOutput(null);
    }
  }, [isOpen]);

  // Mode Keybindings (Cmd+1, Cmd+2, Cmd+3)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if ((e.metaKey || e.ctrlKey) && e.key === '1') { e.preventDefault(); setActiveMode('search'); }
      if ((e.metaKey || e.ctrlKey) && e.key === '2') { e.preventDefault(); setActiveMode('copilot'); }
      if ((e.metaKey || e.ctrlKey) && e.key === '3') { e.preventDefault(); setActiveMode('autopilot'); }

      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Search Engine logic
  const mathEval = evaluateMathOrCurrency(query);
  const nlpEval = parseNaturalLanguageQuery(query);
  const searchResults = pluginRegistry.searchAll(nlpEval.isNLP ? nlpEval.convertedQuery! : query);

  const handleCopilotSubmit = () => {
    if (query.trim()) {
      const res = runCopilotQuery(query.trim());
      setCopilotOutput(res);
    }
  };

  const handleAutopilotSubmit = () => {
    if (query.trim()) {
      const res = runAutopilotInstruction(query.trim(), selfAwarenessContext);
      setAutopilotOutput(res);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-start justify-center pt-16 p-4 animate-in fade-in duration-150">
      <div className="bg-[#1a1a1a] border border-[#333] rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[85vh]">
        {/* Main Operating Console Column */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header 3-Mode Selector */}
          <ConsoleHeader activeMode={activeMode} onSelectMode={setActiveMode} />

          {/* Search Input Bar */}
          <div className="p-4 border-b border-[#262626] flex items-center gap-3 bg-[#121212]">
            {activeMode === 'search' && <Search className="w-5 h-5 text-[#2266ec] shrink-0" />}
            {activeMode === 'copilot' && <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />}
            {activeMode === 'autopilot' && <Zap className="w-5 h-5 text-green-400 shrink-0" />}

            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  if (activeMode === 'copilot') handleCopilotSubmit();
                  if (activeMode === 'autopilot') handleAutopilotSubmit();
                }
              }}
              placeholder={
                activeMode === 'search' ? 'Search records, commands (>), navigation (/), or math (=)...' :
                activeMode === 'copilot' ? 'Ask Copilot to analyze data, write SQL, or explain charts...' :
                'Tell Autopilot: "Why are sales dropping?", "Show everything about John Doe", "Fraud Analysis"...'
              }
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-[#656565] font-sans"
            />

            {(activeMode === 'copilot' || activeMode === 'autopilot') && (
              <button
                onClick={activeMode === 'copilot' ? handleCopilotSubmit : handleAutopilotSubmit}
                className="px-3 py-1.5 bg-[#2266ec] hover:bg-[#1d57cc] text-white text-xs font-semibold rounded-lg flex items-center gap-1 shrink-0"
              >
                Execute <CornerDownLeft className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* MODE 1: SEARCH RESULTS */}
          {activeMode === 'search' && (
            <div className="flex-1 overflow-y-auto p-3 space-y-2 max-h-[420px]">
              {searchResults.length === 0 ? (
                <div className="text-center py-12 text-[#656565] text-xs">No matching records found.</div>
              ) : (
                searchResults.map((item, idx) => (
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
          )}

          {/* MODE 2: COPILOT ASSIST */}
          {activeMode === 'copilot' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[420px]">
              {copilotOutput ? (
                <div className="space-y-3 bg-[#121212] p-4 rounded-xl border border-[#262626]">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                    <Sparkles className="w-4 h-4" /> Copilot Platform Brief
                  </div>
                  <p className="text-xs text-white leading-relaxed">{copilotOutput.answer}</p>
                  
                  {copilotOutput.sqlQuery && (
                    <div className="space-y-1">
                      <div className="text-[10px] text-[#656565] font-mono uppercase">Generated SQL Query</div>
                      <pre className="bg-[#1a1a1a] p-3 rounded text-[11px] font-mono text-green-400 border border-[#333]">
                        {copilotOutput.sqlQuery}
                      </pre>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 text-[#656565] text-xs space-y-2">
                  <Sparkles className="w-8 h-8 text-amber-400 mx-auto opacity-50" />
                  <div>Ask Copilot any question about platform telemetry, SQL, or chart metrics.</div>
                </div>
              )}
            </div>
          )}

          {/* MODE 3: AUTOPILOT CONTROL */}
          {activeMode === 'autopilot' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[420px]">
              {autopilotOutput ? (
                <div className="space-y-3 bg-[#121212] p-4 rounded-xl border border-green-500/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-green-400">
                      <Zap className="w-4 h-4" /> Autopilot Intent Execution Report
                    </div>
                    {autopilotOutput.temporaryPageCreated && (
                      <span className="text-[10px] bg-[#2266ec]/20 text-[#2266ec] px-2 py-0.5 rounded font-mono border border-[#2266ec]/30">
                        Temporary Page Created
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-white leading-relaxed font-medium">{autopilotOutput.summary}</p>

                  <div className="space-y-2 border-t border-[#262626] pt-3">
                    <div className="text-[10px] text-[#656565] uppercase font-mono">Executed UI Intentions ({autopilotOutput.intentions.length}):</div>
                    {autopilotOutput.intentions.map(intent => (
                      <div key={intent.id} className="flex items-center gap-2 bg-[#1a1a1a] p-2 rounded border border-[#262626] text-xs font-mono text-white">
                        <span className="text-green-400 font-bold">✓</span>
                        <span className="text-[#a6a6a6]">{intent.type}:</span>
                        <span>{intent.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-[#656565] text-xs space-y-2">
                  <Zap className="w-8 h-8 text-green-400 mx-auto opacity-50" />
                  <div>Type an instruction to let Autopilot compose pages, rearrange dashboards, or build custom workspaces.</div>
                  <div className="flex flex-wrap justify-center gap-1.5 pt-2">
                    {[
                      'Why are sales dropping?',
                      'Show me everything about John Doe',
                      'Create a Fraud Analysis section',
                      'Compare Lagos and Abuja customers'
                    ].map(sample => (
                      <button
                        key={sample}
                        onClick={() => { setQuery(sample); runAutopilotInstruction(sample, selfAwarenessContext); }}
                        className="bg-[#121212] hover:bg-[#262626] text-[#a6a6a6] hover:text-white px-2.5 py-1 rounded border border-[#262626] transition-colors"
                      >
                        "{sample}"
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Footer Shortcuts Info */}
          <div className="p-3 border-t border-[#262626] bg-[#121212] flex items-center justify-between text-[11px] text-[#656565] font-mono">
            <div className="flex items-center gap-3">
              <span><kbd className="bg-[#262626] px-1.5 py-0.5 rounded text-white">Cmd+1</kbd> Search</span>
              <span><kbd className="bg-[#262626] px-1.5 py-0.5 rounded text-white">Cmd+2</kbd> Copilot</span>
              <span><kbd className="bg-[#262626] px-1.5 py-0.5 rounded text-white">Cmd+3</kbd> Autopilot</span>
            </div>
            <span>Operating Console OS v2.0</span>
          </div>
        </div>

        {/* Side Hover Preview Drawer */}
        <div className="hidden md:block w-72 shrink-0">
          <CommandSidePreview item={hoveredItem || searchResults[selectedIndex] || null} />
        </div>
      </div>
    </div>
  );
}
