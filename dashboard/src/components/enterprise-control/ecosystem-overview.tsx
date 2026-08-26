"use client";
import { IconRenderer } from '@/components/ui/IconRenderer';
import React from 'react';
import {
  Globe, TrendingUp, TrendingDown, Minus, ShieldCheck, Server,
  Cpu, Bot, Activity, Gauge
} from 'lucide-react';
import { EcosystemKPI, HealthScore, AppSwitchboard } from './types';

interface Props {
  kpis: EcosystemKPI[];
  health: HealthScore[];
  apps: AppSwitchboard[];
  onSelectApp: (id: string) => void;
}

const HEALTH_COLORS: Record<string, string> = {
  healthy: 'text-green-400',
  degraded: 'text-amber-400',
  critical: 'text-red-400',
};

const SCORE_BG: Record<string, string> = {
  healthy: 'bg-green-500/20 border-green-500/30',
  degraded: 'bg-amber-500/20 border-amber-500/30',
  critical: 'bg-red-500/20 border-red-500/30',
};

const STATUS_DOT: Record<string, string> = {
  online: 'bg-green-400',
  degraded: 'bg-amber-400 animate-pulse',
  offline: 'bg-red-400',
};

export function EcosystemOverview({ kpis, health, apps, onSelectApp }: Props) {
  return (
    <div className="space-y-6 font-sans">
      {/* Top-Level KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-3">
        {kpis.map(kpi => (
          <div key={kpi.label} className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-4 space-y-1.5 shadow-xl">
            <div className="text-[10px] text-[#656565] uppercase font-semibold flex items-center gap-1.5">
              <IconRenderer name={kpi.icon} className="w-3.5 h-3.5" /> {kpi.label}
            </div>
            <div className="text-xl font-bold text-white font-mono">{kpi.value}</div>
            {kpi.trend && (
              <div className={`text-[10px] font-mono flex items-center gap-1 ${
                kpi.trendDirection === 'up' ? 'text-green-400' : kpi.trendDirection === 'down' ? 'text-red-400' : 'text-[#656565]'
              }`}>
                {kpi.trendDirection === 'up' ? <TrendingUp className="w-3 h-3" /> : kpi.trendDirection === 'down' ? <TrendingDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                {kpi.trend}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Platform Health Scores */}
      <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#262626] pb-3">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-green-400" /> Platform Health
          </h3>
          <span className="text-[10px] text-green-400 font-mono font-bold">All Systems Nominal</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {health.map(h => (
            <div key={h.domain} className={`rounded-xl border p-4 text-center space-y-2 ${SCORE_BG[h.status]}`}>
              <div className="text-3xl font-bold font-mono text-white">{h.score}%</div>
              <div className={`text-xs font-bold ${HEALTH_COLORS[h.status]}`}>{h.domain}</div>
              <div className="text-[9px] text-[#a6a6a6]">{h.details}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Multi-Application Switchboard */}
      <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#262626] pb-3">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#2266ec]" /> Multi-Application Switchboard
          </h3>
          <span className="text-[10px] text-[#656565] font-mono">{apps.length} applications</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
          {apps.map(app => (
            <button
              key={app.id}
              onClick={() => onSelectApp(app.id)}
              className="text-left bg-[#121212] border border-[#262626] rounded-xl p-4 space-y-3 hover:border-[#333] transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <IconRenderer name={app.icon} className="w-6 h-6 text-gray-400" />
                  <div>
                    <div className="font-bold text-white text-sm">{app.name}</div>
                    <div className="flex items-center gap-1.5 text-[9px] text-[#656565]">
                      <div className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[app.status]}`} />
                      {app.status}
                    </div>
                  </div>
                </div>
                <div className={`text-lg font-bold font-mono ${app.health >= 95 ? 'text-green-400' : app.health >= 80 ? 'text-amber-400' : 'text-red-400'}`}>
                  {app.health}%
                </div>
              </div>

              <div className="flex items-center gap-3 text-[9px] font-mono text-[#656565]">
                <span>👤 {app.users}</span>
                <span>🤖 {app.aiAgents}</span>
                <span>⚡ {app.eventsToday}</span>
              </div>

              {/* Health bar */}
              <div className="w-full h-1 bg-[#262626] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${app.health >= 95 ? 'bg-green-400' : app.health >= 80 ? 'bg-amber-400' : 'bg-red-400'}`}
                  style={{ width: `${app.health}%` }}
                />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
