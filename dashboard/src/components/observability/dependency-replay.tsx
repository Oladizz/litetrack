"use client";

import React, { useState } from 'react';
import { Network, History, ArrowRight, Layers, Database } from 'lucide-react';
import { DependencyNode } from './types';
import { toast } from '@/components/ui/toast';

export function DependencyAndReplay() {
  const [nodes, setNodes] = useState<DependencyNode[]>([
    { id: 'node_dash', name: 'Executive Dashboard UI', type: 'dashboard', healthScore: 99, parentIds: [] },
    { id: 'node_widget', name: 'Revenue Trend Chart Widget', type: 'widget', healthScore: 98, parentIds: ['node_dash'] },
    { id: 'node_api', name: 'Payments API (/api/v2/payments)', type: 'api', healthScore: 99, parentIds: ['node_widget'] },
    { id: 'node_db', name: 'BigQuery Telemetry Database', type: 'database', healthScore: 95, parentIds: ['node_api'] },
    { id: 'node_storage', name: 'AWS S3 Audit Logs Storage', type: 'storage', healthScore: 100, parentIds: ['node_db'] },
  ]);

  const [replayDate, setReplayDate] = useState('Today (Live)');

  return (
    <div className="space-y-6 font-sans">
      {/* Time Travel Replay Mode Controls */}
      <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-5 shadow-xl space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-[#262626] pb-3">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-[#2266ec]" />
            <h4 className="font-bold text-white text-sm font-sans">Time Travel Replay Mode</h4>
          </div>
          <span className="text-green-400 font-bold bg-green-500/10 px-3 py-1 rounded border border-green-500/20">
            Active Snapshot: {replayDate}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {['Today (Live)', 'Yesterday 14:00', '3 Days Ago', 'Last Week'].map(d => (
            <button
              key={d}
              onClick={() => { setReplayDate(d); toast(`Traveled back to platform state: ${d}`, { type: 'info' }); }}
              className={`px-3 py-1.5 rounded border transition-colors ${
                replayDate === d ? 'bg-[#2266ec] text-white border-[#2266ec] font-bold' : 'bg-[#121212] text-[#656565] border-[#262626] hover:text-white'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* System Dependency Graph Visualizer */}
      <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#262626] pb-3">
          <h4 className="font-bold text-white text-sm flex items-center gap-2">
            <Network className="w-4 h-4 text-purple-400" /> End-to-End System Dependency Graph
          </h4>
          <span className="text-xs text-[#a6a6a6] font-mono">5 Node Chains</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {nodes.map(node => (
            <div key={node.id} className="bg-[#121212] p-4 rounded-xl border border-[#262626] space-y-2 text-xs font-mono">
              <div className="text-[10px] text-purple-400 uppercase font-bold">{node.type}</div>
              <div className="font-bold text-white leading-tight">{node.name}</div>
              <div className="text-[10px] text-[#656565]">Health Score: {node.healthScore}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
