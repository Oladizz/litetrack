"use client";

import React, { useState } from 'react';
import { Network, ArrowRight, Layers, FileText, ShoppingCart, Shield, Sparkles, Database } from 'lucide-react';
import { ResourceItem } from './types';
import { toast } from '@/components/ui/toast';

interface GraphProps {
  selectedResource: ResourceItem | null;
}

export function EntityKnowledgeGraph({ selectedResource }: GraphProps) {
  const [focusedNode, setFocusedNode] = useState<string | null>(null);

  if (!selectedResource) {
    return (
      <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-8 text-center text-xs text-[#656565]">
        Select any resource or entity from the explorer to render its 360° Knowledge Object Graph.
      </div>
    );
  }

  return (
    <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-5 shadow-xl space-y-6 font-sans">
      <div className="flex items-center justify-between border-b border-[#262626] pb-3">
        <div>
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <Network className="w-5 h-5 text-[#2266ec]" /> ⭐ Knowledge Object Graph: {selectedResource.title}
          </h3>
          <p className="text-xs text-[#a6a6a6] mt-0.5">
            This entity is treated as a unified Knowledge Object connected across Orders, Payments, Files, Tickets, and AI Memory.
          </p>
        </div>

        <span className="text-xs bg-[#2266ec]/20 text-[#2266ec] border border-[#2266ec]/30 px-3 py-1 rounded-full font-mono font-semibold">
          {selectedResource.relationships.length + 1} Graph Nodes
        </span>
      </div>

      {/* Central Node Visualizer Area */}
      <div className="bg-[#121212] border border-[#262626] rounded-xl p-6 relative overflow-hidden flex flex-col items-center justify-center space-y-6">
        {/* Core Center Node */}
        <div className="bg-[#2266ec] text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-2xl shadow-[#2266ec]/40 flex items-center gap-2 border-2 border-white/20 animate-pulse">
          <Sparkles className="w-4 h-4" /> Core Entity: {selectedResource.title}
        </div>

        {/* Connecting Graph Edges */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-4">
          {selectedResource.relationships.map((rel, idx) => (
            <div
              key={idx}
              onClick={() => { setFocusedNode(rel.targetTitle); toast(`Focused node: ${rel.targetTitle}`, { type: 'info' }); }}
              className="bg-[#1a1a1a] border border-[#262626] hover:border-[#2266ec] p-3 rounded-xl cursor-pointer space-y-1 text-xs transition-all hover:scale-105"
            >
              <div className="text-[10px] text-[#2266ec] font-mono uppercase font-bold">{rel.relationType}</div>
              <div className="font-bold text-white truncate">{rel.targetTitle}</div>
              <div className="text-[10px] text-[#656565] font-mono">{rel.targetCategory}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
