"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
  Search, Command, Layers, Bell, User, Activity, ChevronDown,
  Sparkles, Cpu, ArrowRight, X, Zap, Settings, Moon, LogOut, Plus
} from 'lucide-react';
import { IconRenderer } from '@/components/ui/IconRenderer';
import { Workspace, CommandAction } from './types';

interface Props {
  workspaces: Workspace[];
  activeWorkspaceId: string;
  onSwitchWorkspace: (id: string) => void;
  onCreateWorkspace: () => void;
  onCommandExecute: (command: string) => void;
  runningTaskCount: number;
  notificationCount: number;
}

export function CommandBar({
  workspaces, activeWorkspaceId, onSwitchWorkspace, onCreateWorkspace,
  onCommandExecute, runningTaskCount, notificationCount
}: Props) {
  const [showPalette, setShowPalette] = useState(false);
  const [showWorkspaceSwitcher, setShowWorkspaceSwitcher] = useState(false);
  const [commandInput, setCommandInput] = useState('');
  const [paletteMode, setPaletteMode] = useState<'search' | 'ai'>('search');
  const inputRef = useRef<HTMLInputElement>(null);

  const activeWs = workspaces.find(w => w.id === activeWorkspaceId);

  // Global keyboard shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setPaletteMode('search');
        setShowPalette(true);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'j') {
        e.preventDefault();
        setPaletteMode('ai');
        setShowPalette(true);
      }
      if (e.key === 'Escape') {
        setShowPalette(false);
        setShowWorkspaceSwitcher(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    if (showPalette && inputRef.current) inputRef.current.focus();
  }, [showPalette]);

  const QUICK_COMMANDS: CommandAction[] = [
    { id: 'cmd_1', label: 'Open Data Manager', shortcut: 'Alt+1', icon: '📊', category: 'navigation' },
    { id: 'cmd_2', label: 'Create New Dashboard', shortcut: 'Alt+N', icon: '📈', category: 'action' },
    { id: 'cmd_3', label: 'Investigate Anomaly', icon: '🔍', category: 'ai' },
    { id: 'cmd_4', label: 'New Workspace', shortcut: 'Ctrl+Shift+N', icon: '📁', category: 'workspace' },
    { id: 'cmd_5', label: 'Open AI Agent Studio', icon: '🤖', category: 'navigation' },
    { id: 'cmd_6', label: 'View Security Alerts', icon: '🛡️', category: 'navigation' },
    { id: 'cmd_7', label: 'Generate Executive Report', icon: '📋', category: 'ai' },
    { id: 'cmd_8', label: 'Split Panel Horizontally', shortcut: 'Ctrl+Shift+H', icon: '⬜', category: 'panel' },
  ];

  const filteredCommands = commandInput
    ? QUICK_COMMANDS.filter(c => c.label.toLowerCase().includes(commandInput.toLowerCase()))
    : QUICK_COMMANDS;

  const handleExecute = () => {
    if (!commandInput.trim()) return;
    onCommandExecute(commandInput);
    setCommandInput('');
    setShowPalette(false);
  };

  return (
    <>
      {/* Command Bar */}
      <div className="h-12 bg-[#0f0f0f] border-b border-[#262626] flex items-center px-4 gap-3 shrink-0 z-50">
        {/* Workspace Switcher */}
        <button
          onClick={() => setShowWorkspaceSwitcher(!showWorkspaceSwitcher)}
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[#1a1a1a] border border-[#262626] hover:border-[#333] transition-all text-xs group"
        >
          <Layers className="w-3.5 h-3.5 text-[#2266ec]" />
          <span className="font-semibold text-white max-w-[140px] truncate">{activeWs?.title ?? 'No Workspace'}</span>
          <ChevronDown className="w-3 h-3 text-[#656565] group-hover:text-white transition-colors" />
        </button>

        {/* Universal Search Trigger */}
        <button
          onClick={() => { setPaletteMode('search'); setShowPalette(true); }}
          className="flex-1 max-w-md flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1a1a1a] border border-[#262626] hover:border-[#333] transition-all cursor-text"
        >
          <Search className="w-3.5 h-3.5 text-[#656565]" />
          <span className="text-[11px] text-[#656565]">Search everything or type a command...</span>
          <div className="ml-auto flex items-center gap-1">
            <kbd className="text-[9px] text-[#656565] bg-[#121212] px-1.5 py-0.5 rounded border border-[#333] font-mono">⌘K</kbd>
          </div>
        </button>

        {/* AI Command Trigger */}
        <button
          onClick={() => { setPaletteMode('ai'); setShowPalette(true); }}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20 hover:border-purple-500/40 transition-all text-xs text-purple-400"
          title="AI Command (⌘J)"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="font-semibold hidden md:inline">AI</span>
          <kbd className="text-[9px] bg-purple-500/10 px-1 py-0.5 rounded font-mono hidden md:inline">⌘J</kbd>
        </button>

        <div className="flex-1" />

        {/* Running Tasks */}
        {runningTaskCount > 0 && (
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[#2266ec]/10 border border-[#2266ec]/20 text-[10px] text-[#2266ec] font-semibold">
            <Cpu className="w-3 h-3 animate-pulse" />
            {runningTaskCount} running
          </div>
        )}

        {/* System Status */}
        <div className="flex items-center gap-1.5 text-[10px] text-green-400 font-mono">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
          <span className="hidden lg:inline">All Systems Nominal</span>
        </div>

        {/* Notifications */}
        <button className="relative p-1.5 rounded-lg hover:bg-[#1a1a1a] transition-colors">
          <Bell className="w-4 h-4 text-[#656565]" />
          {notificationCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-red-500 rounded-full text-[8px] text-white font-bold flex items-center justify-center">
              {notificationCount}
            </span>
          )}
        </button>

        {/* User */}
        <button className="w-7 h-7 rounded-full bg-[#2266ec] flex items-center justify-center text-white text-xs font-bold">
          A
        </button>
      </div>

      {/* Command Palette Overlay */}
      {showPalette && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]" onClick={() => setShowPalette(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="relative w-full max-w-xl bg-[#1a1a1a] border border-[#333] rounded-2xl shadow-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-[#262626]">
              {paletteMode === 'ai' ? (
                <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
              ) : (
                <Search className="w-4 h-4 text-[#656565] shrink-0" />
              )}
              <input
                ref={inputRef}
                type="text"
                value={commandInput}
                onChange={e => setCommandInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleExecute(); }}
                placeholder={paletteMode === 'ai' ? 'Ask AI anything... "Investigate revenue drop"' : 'Search or type a command...'}
                className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-[#656565]"
              />
              {commandInput && (
                <button onClick={() => setCommandInput('')} className="text-[#656565] hover:text-white">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPaletteMode('search')}
                  className={`px-2 py-0.5 rounded text-[9px] font-semibold ${paletteMode === 'search' ? 'bg-[#2266ec] text-white' : 'text-[#656565]'}`}
                >
                  Search
                </button>
                <button
                  onClick={() => setPaletteMode('ai')}
                  className={`px-2 py-0.5 rounded text-[9px] font-semibold ${paletteMode === 'ai' ? 'bg-purple-500 text-white' : 'text-[#656565]'}`}
                >
                  AI
                </button>
              </div>
            </div>

            {/* Results */}
            <div className="max-h-[320px] overflow-y-auto py-2">
              {paletteMode === 'ai' && commandInput && (
                <button
                  onClick={handleExecute}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-purple-500/10 transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <div className="text-left">
                    <div className="text-xs text-white font-semibold">Ask Strategic AI</div>
                    <div className="text-[10px] text-[#656565]">"{commandInput}"</div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-purple-400 ml-auto" />
                </button>
              )}

              {filteredCommands.map(cmd => (
                <button
                  key={cmd.id}
                  onClick={() => { onCommandExecute(cmd.label); setShowPalette(false); setCommandInput(''); }}
                  className="w-full flex items-center gap-3 px-4 py-2 hover:bg-[#262626] transition-colors"
                >
                  <IconRenderer name={cmd.icon} className="w-4 h-4 text-[#a6a6a6]" />
                  <span className="text-xs text-white">{cmd.label}</span>
                  {cmd.shortcut && (
                    <kbd className="ml-auto text-[9px] text-[#656565] bg-[#121212] px-1.5 py-0.5 rounded border border-[#333] font-mono">
                      {cmd.shortcut}
                    </kbd>
                  )}
                </button>
              ))}

              {filteredCommands.length === 0 && !commandInput && (
                <div className="px-4 py-6 text-center text-[#656565] text-xs">No commands found</div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-4 py-2 border-t border-[#262626] text-[9px] text-[#656565] font-mono">
              <span>↑↓ Navigate · Enter Select · Esc Close</span>
              <span>{paletteMode === 'ai' ? '⌘J AI Mode' : '⌘K Search Mode'}</span>
            </div>
          </div>
        </div>
      )}

      {/* Workspace Switcher Dropdown */}
      {showWorkspaceSwitcher && (
        <div className="fixed left-4 top-12 z-[90] w-72 bg-[#1a1a1a] border border-[#333] rounded-xl shadow-2xl py-2" onClick={e => e.stopPropagation()}>
          <div className="px-3 pb-2 mb-1 border-b border-[#262626]">
            <div className="text-[10px] text-[#656565] font-semibold uppercase">Workspaces</div>
          </div>
          {workspaces.map(ws => (
            <button
              key={ws.id}
              onClick={() => { onSwitchWorkspace(ws.id); setShowWorkspaceSwitcher(false); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-[#262626] transition-colors ${
                ws.id === activeWorkspaceId ? 'bg-[#2266ec]/10' : ''
              }`}
            >
              <IconRenderer name={ws.icon} className="w-4 h-4 text-[#a6a6a6]" />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-white truncate">{ws.title}</div>
                <div className="text-[9px] text-[#656565] truncate">{ws.description}</div>
              </div>
              {ws.id === activeWorkspaceId && <div className="w-1.5 h-1.5 rounded-full bg-[#2266ec]" />}
            </button>
          ))}
          <div className="px-2 pt-2 mt-1 border-t border-[#262626]">
            <button
              onClick={() => { onCreateWorkspace(); setShowWorkspaceSwitcher(false); }}
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-[10px] text-[#2266ec] font-semibold hover:bg-[#2266ec]/10 transition-colors"
            >
              <Plus className="w-3 h-3" /> New Workspace
            </button>
          </div>
        </div>
      )}
    </>
  );
}
