"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Search, Clock, Sparkles, X, Tag as TagIcon, Filter } from 'lucide-react';
import { SearchOperator } from './types';

interface SearchBarProps {
  value: string;
  onChange: (val: string, operators: SearchOperator[]) => void;
  suggestions?: string[];
  placeholder?: string;
}

export function DataManagerSearchBar({
  value,
  onChange,
  suggestions = ['John', 'Jordan', 'Johnny', 'Job', 'Joined Today', 'Pending Orders', 'VIP'],
  placeholder = 'Search or filter (e.g. status:active role:admin country:nigeria email:gmail)...',
}: SearchBarProps) {
  const [query, setQuery] = useState(value);
  const [history, setHistory] = useState<string[]>([
    'status:active',
    'Pending Orders',
    'VIP',
    'role:admin',
  ]);
  const [isOpen, setIsOpen] = useState(false);
  const [operators, setOperators] = useState<SearchOperator[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // Parse operators whenever query changes
  useEffect(() => {
    const parsedOperators: SearchOperator[] = [];
    const regex = /(\b\w+):("([^"]+)"|'([^']+)'|(\S+))/g;
    let match;

    while ((match = regex.exec(query)) !== null) {
      const key = match[1].toLowerCase();
      const val = match[3] || match[4] || match[5];
      parsedOperators.push({ key, value: val, raw: match[0] });
    }

    setOperators(parsedOperators);
    onChangeRef.current(query, parsedOperators);
  }, [query]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectSuggestion = (text: string) => {
    setQuery(text);
    if (!history.includes(text)) {
      setHistory(prev => [text, ...prev.slice(0, 5)]);
    }
    setIsOpen(false);
  };

  const handleClearOperator = (raw: string) => {
    const newQuery = query.replace(raw, '').replace(/\s+/g, ' ').trim();
    setQuery(newQuery);
  };

  const filteredSuggestions = suggestions.filter(s =>
    s.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Search Input Container - Industrial, Clean */}
      <div className="relative flex items-center w-full bg-transparent border-b border-[#333] focus-within:border-[#fafafa] pb-2 transition-colors duration-200 group">
        <Search className="w-5 h-5 text-[#656565] group-focus-within:text-[#fafafa] mr-3 shrink-0 transition-colors duration-200" />
        
        {/* Render Parsed Operator Chips inside Search Bar */}
        {operators.map((op, idx) => (
          <span key={idx} className="bg-[#262626] text-[#fafafa] text-[13px] font-mono font-medium px-2 py-0.5 rounded mr-2 flex items-center gap-1 shrink-0">
            <span className="text-[#a6a6a6]">{op.key}:</span>
            <span>{op.value}</span>
            <button type="button" onClick={() => handleClearOperator(op.raw)} className="hover:text-red-400 ml-1">
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}

        <input
          type="text"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={operators.length === 0 ? 'Search anything... (records, views, commands, AI)' : ''}
          className="flex-1 bg-transparent text-[15px] text-[#fafafa] outline-none placeholder:text-[#656565] font-medium"
        />

        {query && (
          <button
            onClick={() => setQuery('')}
            className="text-[#656565] hover:text-[#fafafa] p-1 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* AI Translation - Only shows when typing complex queries */}
      {query.length > 3 && (
        <div className="absolute top-full left-0 mt-3 flex items-center gap-2 text-[13px] text-[#a6a6a6] font-medium animate-in fade-in slide-in-from-top-1">
          {/* AI Breathing Pulse */}
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </div>
          <span className="text-indigo-400 font-semibold">AI Translating:</span>
          <span>Looking for {query} records...</span>
        </div>
      )}

      {/* Autocomplete Dropdown - Elegant & Instant */}
      {isOpen && query.length === 0 && (
        <div className="absolute top-full mt-4 left-0 w-full bg-[#121212]/95 backdrop-blur-xl border border-[#262626] shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-100">
          <div className="grid grid-cols-3 gap-6">
            <div>
              <div className="text-[11px] font-bold text-[#656565] uppercase tracking-wider mb-2">Suggestions</div>
              <div className="space-y-1">
                {suggestions.slice(0, 4).map(s => (
                  <button key={s} onClick={() => handleSelectSuggestion(s)} className="block w-full text-left text-[13px] text-[#a6a6a6] hover:text-[#fafafa] py-1 transition-colors">
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="text-[11px] font-bold text-[#656565] uppercase tracking-wider mb-2">Commands</div>
              <div className="space-y-1">
                <button className="block w-full text-left text-[13px] text-[#a6a6a6] hover:text-[#fafafa] py-1 transition-colors">Compare Revenue</button>
                <button className="block w-full text-left text-[13px] text-[#a6a6a6] hover:text-[#fafafa] py-1 transition-colors">Investigate Churn</button>
                <button className="block w-full text-left text-[13px] text-[#a6a6a6] hover:text-[#fafafa] py-1 transition-colors">Export VIPs</button>
              </div>
            </div>
            <div>
              <div className="text-[11px] font-bold text-[#656565] uppercase tracking-wider mb-2">Recent</div>
              <div className="space-y-1 text-[#a6a6a6] text-[13px] font-mono">
                {history.slice(0, 3).map(h => (
                   <button key={h} onClick={() => handleSelectSuggestion(h)} className="block w-full text-left hover:text-[#fafafa] py-1 truncate">{h}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
