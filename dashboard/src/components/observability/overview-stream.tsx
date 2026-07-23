"use client";

import React, { useState, useEffect } from 'react';
import { Activity, ShieldCheck, Cpu, Database, Sparkles, Zap, AlertTriangle, ArrowUpRight, Search } from 'lucide-react';
import { ObservabilityEvent, ServiceHealth } from './types';
import { toast } from '@/components/ui/toast';

interface OverviewProps {
  events: ObservabilityEvent[];
  services: ServiceHealth[];
  onInvestigate: (title: string, cause: string) => void;
}

export function ObservabilityOverview({ events, services, onInvestigate }: OverviewProps) {
  return (
    <div className="space-y-6 font-sans">
      {/* Overview KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-xs font-mono">
        <div className="bg-[#1a1a1a] p-4 rounded-xl border border-[#262626] space-y-1">
          <div className="text-[#656565] uppercase">System Overall Health</div>
          <div className="text-xl font-bold text-green-400">99.99%</div>
        </div>
        <div className="bg-[#1a1a1a] p-4 rounded-xl border border-[#262626] space-y-1">
          <div className="text-[#656565] uppercase">Event Throughput</div>
          <div className="text-xl font-bold text-white">4,820 ev/s</div>
        </div>
        <div className="bg-[#1a1a1a] p-4 rounded-xl border border-[#262626] space-y-1">
          <div className="text-[#656565] uppercase">Avg API Latency</div>
          <div className="text-xl font-bold text-[#2266ec]">24 ms</div>
        </div>
        <div className="bg-[#1a1a1a] p-4 rounded-xl border border-[#262626] space-y-1">
          <div className="text-[#656565] uppercase">Error Rate</div>
          <div className="text-xl font-bold text-amber-400">0.02%</div>
        </div>
        <div className="bg-[#1a1a1a] p-4 rounded-xl border border-[#262626] space-y-1">
          <div className="text-[#656565] uppercase">Daily AI Token Expense</div>
          <div className="text-xl font-bold text-purple-400">$34.20</div>
        </div>
      </div>

      {/* Multi-Service Health Monitors */}
      <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between border-b border-[#262626] pb-3">
          <h4 className="font-bold text-white text-sm flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-green-400" /> Multi-Service Infrastructure Health
          </h4>
          <span className="text-xs text-[#a6a6a6] font-mono">All Systems Operational</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          {services.map(s => (
            <div key={s.name} className="bg-[#121212] p-3 rounded-lg border border-[#262626] space-y-1.5 text-xs font-mono">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">{s.name}</span>
                <span className="text-[9px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded font-bold">
                  {s.score}%
                </span>
              </div>
              <div className="text-[10px] text-[#656565]">Latency: {s.latencyMs} ms · Uptime {s.uptime}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Real-Time Live Activity Stream */}
      <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#262626] pb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#2266ec]" />
            <h4 className="font-bold text-white text-sm">Real-Time Event Stream</h4>
            <span className="w-2 h-2 rounded-full bg-green-400 animate-ping"></span>
          </div>
          <span className="text-xs text-[#656565] font-mono">Streaming 100% telemetry</span>
        </div>

        <div className="space-y-2 max-h-[350px] overflow-y-auto">
          {events.map(ev => (
            <div key={ev.id} className="bg-[#121212] p-3 rounded-lg border border-[#262626] flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-3">
                <span className={`w-2 h-2 rounded-full ${
                  ev.status === 'success' ? 'bg-green-400' : ev.status === 'warning' ? 'bg-amber-400' : 'bg-red-400'
                }`}></span>
                <div>
                  <span className="font-bold text-white">{ev.actor}</span>
                  <span className="text-[#a6a6a6]"> {ev.event} on </span>
                  <span className="text-[#2266ec]">{ev.resource}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[10px] text-[#656565]">{ev.timestamp} · {ev.durationMs}ms</span>
                
                {/* ⭐ Universal Investigate Button */}
                <button
                  onClick={() => onInvestigate(ev.event, `Event triggered by ${ev.actor} on ${ev.resource}`)}
                  className="bg-[#2266ec]/20 hover:bg-[#2266ec] text-[#2266ec] hover:text-white px-2.5 py-1 rounded text-[10px] font-bold border border-[#2266ec]/30 transition-all flex items-center gap-1"
                >
                  <Search className="w-3 h-3" /> Investigate
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
