"use client";

import React, { useState } from 'react';
import { Search, Map, Network, ArrowRight, User, Shield, Key } from 'lucide-react';
import { toast } from '@/components/ui/toast';

export function IOACAccessExplorer() {
  const [searchQuery, setSearchQuery] = useState('');
  
  return (
    <div className="space-y-6 font-sans">
      <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-5 shadow-xl space-y-5">
        <div className="flex items-center justify-between border-b border-[#262626] pb-3">
          <div>
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Map className="w-5 h-5 text-cyan-400" /> Access Graph Explorer
            </h3>
            <p className="text-xs text-[#a6a6a6] mt-0.5">Answer the question: "Who has access to what, and why?" Resolves inherited vs direct roles.</p>
          </div>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-[#656565] absolute left-3 top-2.5" />
          <input 
            type="text" 
            placeholder="Search for a User, Role, or Resource (e.g., 'John Doe' or 'Treasury Wallet')..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#121212] border border-[#262626] rounded-lg py-2 pl-9 pr-4 text-xs text-white outline-none focus:border-[#2266ec] transition-colors font-mono"
          />
        </div>

        {/* Search Results / Graph Path */}
        <div className="bg-[#121212] border border-[#262626] rounded-xl p-6 text-center space-y-6">
          {searchQuery ? (
            <div className="text-[#a6a6a6] text-xs py-10">
              Querying live access graph for: <strong className="text-white">{searchQuery}</strong>...
              <div className="mt-2 text-[10px]">Graph resolution engine requires additional API setup.</div>
            </div>
          ) : (
            <div className="text-[#a6a6a6] text-xs py-10">
              Enter a User, Role, or Resource above to resolve effective permissions and inherited chains.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

function UsersIcon() {
  return (
    <svg className="w-6 h-6 text-amber-400 mx-auto mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  );
}
