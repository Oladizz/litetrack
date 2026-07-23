"use client";

import React, { useState } from 'react';
import { Sparkles, Layers, Plus, Folder, ArrowRight } from 'lucide-react';
import { SmartCollection } from './types';
import { toast } from '@/components/ui/toast';

export function SmartCollections() {
  const [collections, setCollections] = useState<SmartCollection[]>([
    { id: 'c1', title: 'Project Atlas Assets', query: 'tags:atlas category:all', itemCount: 18, category: 'Project' },
    { id: 'c2', title: 'Everything Related to John Doe', query: 'entity:john_doe', itemCount: 24, category: 'Customer 360°' },
    { id: 'c3', title: 'High-Value Invoices & Receipts', query: 'amount>5000 category:Reports', itemCount: 7, category: 'Finance' },
    { id: 'c4', title: 'System Security & API Keys', query: 'type:dev_secret category:APIs', itemCount: 12, category: 'Security' },
  ]);

  return (
    <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-5 shadow-xl space-y-4 font-sans">
      <div className="flex items-center justify-between border-b border-[#262626] pb-3">
        <div>
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" /> Smart Collections & AI Resource Bundler
          </h3>
          <p className="text-xs text-[#a6a6a6] mt-0.5">AI automatically groups connected documents, reports, orders, and emails into dynamic collections.</p>
        </div>
        <button
          onClick={() => toast('Created smart collection', { type: 'success' })}
          className="px-3.5 py-1.5 bg-[#2266ec] hover:bg-[#1d57cc] text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 shadow"
        >
          <Plus className="w-3.5 h-3.5" /> New Smart Collection
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {collections.map(c => (
          <div key={c.id} className="bg-[#121212] border border-[#262626] hover:border-[#2266ec] p-4 rounded-xl space-y-2 text-xs transition-colors cursor-pointer">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-sm">{c.title}</span>
              <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                {c.category}
              </span>
            </div>
            <div className="text-[11px] text-[#656565] font-mono">Filter Query: <code>{c.query}</code></div>
            <div className="flex items-center justify-between pt-1 text-[11px] text-[#a6a6a6]">
              <span>{c.itemCount} Resource Items Bundled</span>
              <span className="text-[#2266ec] font-semibold flex items-center gap-1">Open Collection <ArrowRight className="w-3 h-3" /></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
