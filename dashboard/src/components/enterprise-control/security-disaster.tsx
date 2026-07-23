"use client";

import React, { useState } from 'react';
import {
  Shield, AlertTriangle, Lock, Key, Server, Pause, Power, RotateCcw,
  DollarSign, Check, X, Activity, Bot, Users, AlertOctagon
} from 'lucide-react';
import { SecurityEvent, DisasterControl } from './types';
import { toast } from '@/components/ui/toast';

interface Props {
  securityEvents: SecurityEvent[];
  disasterControls: DisasterControl[];
  onResolveEvent: (id: string) => void;
  onToggleDisaster: (id: string) => void;
}

const SEVERITY_STYLES: Record<string, { color: string; bg: string; border: string }> = {
  critical: { color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/30' },
  high: { color: 'text-orange-400', bg: 'bg-orange-500/20', border: 'border-orange-500/30' },
  medium: { color: 'text-amber-400', bg: 'bg-amber-500/20', border: 'border-amber-500/30' },
  low: { color: 'text-[#656565]', bg: 'bg-[#333]/30', border: 'border-[#333]' },
};

const DISASTER_SEVERITY: Record<string, string> = {
  critical: 'border-red-500/40 hover:bg-red-500/10',
  high: 'border-orange-500/30 hover:bg-orange-500/10',
  medium: 'border-amber-500/30 hover:bg-amber-500/10',
};

export function SecurityDisasterCenter({ securityEvents, disasterControls, onResolveEvent, onToggleDisaster }: Props) {
  const [sevFilter, setSevFilter] = useState<'all' | 'critical' | 'high'>('all');

  const filtered = sevFilter === 'all' ? securityEvents : securityEvents.filter(e => e.severity === sevFilter);
  const unresolvedCount = securityEvents.filter(e => !e.resolved).length;

  return (
    <div className="space-y-6 font-sans">
      {/* Security Operations */}
      <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#262626] pb-3">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <Shield className="w-4 h-4 text-red-400" /> Security Operations Center
            {unresolvedCount > 0 && (
              <span className="text-[9px] bg-red-500 text-white px-1.5 py-0.5 rounded-full font-bold animate-pulse">{unresolvedCount}</span>
            )}
          </h3>
          <div className="flex items-center gap-1.5 text-[9px] font-semibold">
            {(['all', 'critical', 'high'] as const).map(f => (
              <button key={f} onClick={() => setSevFilter(f)} className={`px-2 py-1 rounded-lg border capitalize ${sevFilter === f ? 'bg-[#2266ec] border-[#2266ec] text-white' : 'bg-[#121212] border-[#262626] text-[#656565]'}`}>
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2 max-h-[350px] overflow-y-auto">
          {filtered.map(ev => {
            const sev = SEVERITY_STYLES[ev.severity];
            return (
              <div key={ev.id} className={`bg-[#121212] border rounded-xl p-4 space-y-2 ${ev.resolved ? 'border-[#262626] opacity-50' : sev.border}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${sev.bg} ${sev.color}`}>{ev.severity}</span>
                    <span className="text-[9px] bg-[#1a1a1a] text-[#a6a6a6] px-1.5 py-0.5 rounded border border-[#262626] font-mono">{ev.category}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] text-[#656565] font-mono">{ev.timestamp}</span>
                    {!ev.resolved && (
                      <button
                        onClick={() => { onResolveEvent(ev.id); toast('Security event resolved', { type: 'success' }); }}
                        className="text-[9px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded font-bold border border-green-500/30 hover:bg-green-500/30"
                      >
                        Resolve
                      </button>
                    )}
                    {ev.resolved && <span className="text-[9px] text-green-400 font-bold">✓ Resolved</span>}
                  </div>
                </div>
                <div className="text-xs font-bold text-white">{ev.title}</div>
                <div className="text-[10px] text-[#a6a6a6]">{ev.details}</div>
                <div className="text-[9px] text-[#656565] font-mono">Actor: {ev.actor}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Disaster Center */}
      <div className="bg-[#1a1a1a] border border-red-500/20 rounded-xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#262626] pb-3">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <AlertOctagon className="w-4 h-4 text-red-400" /> 🚨 Disaster Center — Emergency Controls
          </h3>
          <span className="text-[9px] text-red-400/60 font-mono">Requires approval for activation</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {disasterControls.map(ctrl => (
            <button
              key={ctrl.id}
              onClick={() => {
                onToggleDisaster(ctrl.id);
                toast(`${ctrl.label} ${ctrl.active ? 'deactivated' : 'activated'}`, { type: ctrl.active ? 'info' : 'success' });
              }}
              className={`text-left bg-[#121212] border rounded-xl p-4 space-y-2 transition-all ${
                ctrl.active
                  ? 'border-red-500/50 shadow-lg shadow-red-500/10 ring-1 ring-red-500/20'
                  : DISASTER_SEVERITY[ctrl.severity] ?? 'border-[#262626]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xl">{ctrl.icon}</span>
                <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                  ctrl.active ? 'bg-red-500/20 text-red-400 animate-pulse' : 'bg-[#333]/30 text-[#656565]'
                }`}>
                  {ctrl.active ? 'ACTIVE' : 'Standby'}
                </span>
              </div>
              <div className="font-bold text-white text-xs">{ctrl.label}</div>
              <div className="text-[10px] text-[#656565] leading-relaxed">{ctrl.description}</div>
              <div className={`text-[9px] font-bold ${ctrl.active ? 'text-red-400' : 'text-[#656565]'}`}>
                {ctrl.active ? '⚠️ Click to deactivate' : 'Click to activate'}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
