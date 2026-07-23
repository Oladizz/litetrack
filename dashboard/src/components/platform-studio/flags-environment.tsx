"use client";

import React, { useState } from 'react';
import {
  Flag, ToggleRight, ToggleLeft, Server, Globe, Languages, Clock, DollarSign,
  Terminal, Bug, Cloud, Gauge
} from 'lucide-react';
import { FeatureFlag, EnvironmentType } from './types';
import { toast } from '@/components/ui/toast';

const ROLES = ['All Users', 'Admin', 'Super Admin', 'Developer'];
const REGIONS = ['Global', 'US', 'EU', 'APAC', 'LATAM'];

interface EnvCard {
  env: EnvironmentType;
  label: string;
  status: string;
  statusColor: string;
  endpoint: string;
  debug: boolean;
  lastDeployed: string;
  icon: string;
}

const ENVS: EnvCard[] = [
  { env: 'development', label: 'Development', status: 'Active', statusColor: 'bg-green-500/20 text-green-400', endpoint: 'http://localhost:3000/api', debug: true, lastDeployed: '2 mins ago', icon: '🟢' },
  { env: 'staging', label: 'Staging', status: 'Syncing', statusColor: 'bg-amber-500/20 text-amber-400', endpoint: 'https://staging-api.cirlo.io', debug: true, lastDeployed: '4 hours ago', icon: '🟡' },
  { env: 'production', label: 'Production', status: 'Live', statusColor: 'bg-[#2266ec]/20 text-[#2266ec]', endpoint: 'https://api.cirlo.io', debug: false, lastDeployed: '1 day ago', icon: '🔵' },
  { env: 'sandbox', label: 'Sandbox', status: 'Idle', statusColor: 'bg-[#333]/40 text-[#a6a6a6]', endpoint: 'https://sandbox-api.cirlo.io', debug: true, lastDeployed: '1 week ago', icon: '⚪' },
];

export function FlagsEnvironmentStudio() {
  const [flags, setFlags] = useState<FeatureFlag[]>([
    { id: 'ff_1', name: 'Next-Gen Dashboard', key: 'next_gen_dashboard', description: 'Redesigned analytics dashboard with AI insights', enabled: true, rolloutPercentage: 100, targetRole: 'All Users', targetRegion: 'Global' },
    { id: 'ff_2', name: 'AI Copilot Beta', key: 'ai_copilot_beta', description: 'Natural language AI assistant in Operating Console', enabled: true, rolloutPercentage: 45, targetRole: 'Developer', targetRegion: 'US' },
    { id: 'ff_3', name: 'Voice Commands', key: 'voice_commands', description: 'Hands-free voice control interface', enabled: false, rolloutPercentage: 0, targetRole: 'All Users', targetRegion: 'Global' },
    { id: 'ff_4', name: 'Experimental Charts', key: 'experimental_charts', description: 'WebGL-powered 3D chart visualizations', enabled: true, rolloutPercentage: 25, targetRole: 'Admin', targetRegion: 'EU' },
    { id: 'ff_5', name: 'Advanced Workflow Builder', key: 'adv_workflow', description: 'Visual drag-and-drop automation composer', enabled: true, rolloutPercentage: 80, targetRole: 'Admin', targetRegion: 'Global' },
    { id: 'ff_6', name: 'Blockchain Module', key: 'blockchain_mod', description: 'Crypto wallet and DeFi integration', enabled: false, rolloutPercentage: 0, targetRole: 'Super Admin', targetRegion: 'US' },
  ]);

  const [lang, setLang] = useState('English');
  const [dateFormat, setDateFormat] = useState('YYYY-MM-DD');
  const [currency, setCurrency] = useState('USD');
  const [timezone, setTimezone] = useState('UTC');
  const [textDir, setTextDir] = useState<'LTR' | 'RTL'>('LTR');

  const toggleFlag = (id: string) => {
    setFlags(prev => prev.map(f => f.id === id ? { ...f, enabled: !f.enabled, rolloutPercentage: f.enabled ? 0 : 100 } : f));
    const f = flags.find(ff => ff.id === id);
    toast(`"${f?.name}" ${f?.enabled ? 'disabled' : 'enabled'}`, { type: f?.enabled ? 'info' : 'success' });
  };

  const updateRollout = (id: string, pct: number) => {
    setFlags(prev => prev.map(f => f.id === id ? { ...f, rolloutPercentage: pct } : f));
  };

  const updateFlagField = (id: string, field: 'targetRole' | 'targetRegion', val: string) => {
    setFlags(prev => prev.map(f => f.id === id ? { ...f, [field]: val } : f));
  };

  const flagStatus = (f: FeatureFlag) => {
    if (!f.enabled) return { label: 'Disabled', color: 'bg-[#333]/40 text-[#656565]' };
    if (f.rolloutPercentage < 100) return { label: 'Rolling Out', color: 'bg-amber-500/20 text-amber-400' };
    return { label: 'Enabled', color: 'bg-green-500/20 text-green-400' };
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Feature Flag Manager */}
      <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#262626] pb-3">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <Flag className="w-4 h-4 text-amber-400" /> Feature Flag Manager
          </h3>
          <span className="text-[10px] text-[#656565] font-mono">{flags.filter(f => f.enabled).length}/{flags.length} flags active</span>
        </div>

        <div className="space-y-3">
          {flags.map(f => {
            const st = flagStatus(f);
            return (
              <div key={f.id} className="bg-[#121212] border border-[#262626] rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{f.name}</span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${st.color}`}>{st.label}</span>
                    </div>
                    <div className="text-[10px] text-[#656565] mt-0.5 flex items-center gap-2">
                      <code className="bg-[#1a1a1a] px-1.5 py-0.5 rounded border border-[#262626] font-mono text-[#a6a6a6]">{f.key}</code>
                      <span>{f.description}</span>
                    </div>
                  </div>
                  <button onClick={() => toggleFlag(f.id)} className="shrink-0">
                    {f.enabled ? <ToggleRight className="w-8 h-8 text-green-400" /> : <ToggleLeft className="w-8 h-8 text-[#333]" />}
                  </button>
                </div>

                {f.enabled && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 border-t border-[#262626]">
                    {/* Rollout */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-[#656565] font-semibold flex items-center justify-between">
                        Rollout
                        <span className="text-[#2266ec] font-mono">{f.rolloutPercentage}%</span>
                      </label>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={f.rolloutPercentage}
                        onChange={e => updateRollout(f.id, Number(e.target.value))}
                        className="w-full accent-[#2266ec] h-1"
                      />
                      <div className="w-full h-1.5 bg-[#262626] rounded-full overflow-hidden">
                        <div className="h-full bg-[#2266ec] rounded-full transition-all" style={{ width: `${f.rolloutPercentage}%` }} />
                      </div>
                    </div>

                    {/* Target Role */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-[#656565] font-semibold">Target Role</label>
                      <select
                        value={f.targetRole}
                        onChange={e => updateFlagField(f.id, 'targetRole', e.target.value)}
                        className="bg-[#1a1a1a] border border-[#333] text-white text-[11px] px-2 py-1.5 rounded-lg outline-none w-full cursor-pointer"
                      >
                        {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>

                    {/* Target Region */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-[#656565] font-semibold">Target Region</label>
                      <select
                        value={f.targetRegion}
                        onChange={e => updateFlagField(f.id, 'targetRegion', e.target.value)}
                        className="bg-[#1a1a1a] border border-[#333] text-white text-[11px] px-2 py-1.5 rounded-lg outline-none w-full cursor-pointer"
                      >
                        {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Environment Manager */}
      <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-5 shadow-xl space-y-4">
        <div className="border-b border-[#262626] pb-3">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <Server className="w-4 h-4 text-cyan-400" /> Multi-Environment Manager
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
          {ENVS.map(env => (
            <div key={env.env} className="bg-[#121212] border border-[#262626] rounded-xl p-4 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white flex items-center gap-2">
                  <span>{env.icon}</span> {env.label}
                </span>
                <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${env.statusColor}`}>{env.status}</span>
              </div>
              <div className="space-y-1.5 font-mono text-[10px]">
                <div className="flex items-center gap-1.5 text-[#a6a6a6]">
                  <Terminal className="w-3 h-3 text-[#656565]" />
                  <span className="truncate">{env.endpoint}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#a6a6a6]">
                  <Bug className="w-3 h-3 text-[#656565]" />
                  Debug: <span className={env.debug ? 'text-green-400' : 'text-red-400'}>{env.debug ? 'ON' : 'OFF'}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#656565]">
                  <Clock className="w-3 h-3" /> Deployed {env.lastDeployed}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Localization */}
      <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-5 shadow-xl space-y-4">
        <div className="border-b border-[#262626] pb-3">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <Languages className="w-4 h-4 text-pink-400" /> Localization Studio
          </h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 text-xs">
          <div className="space-y-1.5">
            <label className="text-[10px] text-[#656565] font-semibold">Language</label>
            <select value={lang} onChange={e => setLang(e.target.value)} className="bg-[#121212] border border-[#333] text-white px-2 py-1.5 rounded-lg outline-none w-full cursor-pointer text-xs">
              {['English', 'Spanish', 'French', 'Arabic', 'Mandarin', 'Portuguese'].map(l => <option key={l}>{l}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] text-[#656565] font-semibold">Date Format</label>
            <select value={dateFormat} onChange={e => setDateFormat(e.target.value)} className="bg-[#121212] border border-[#333] text-white px-2 py-1.5 rounded-lg outline-none w-full cursor-pointer text-xs font-mono">
              {['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD'].map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] text-[#656565] font-semibold">Currency</label>
            <select value={currency} onChange={e => setCurrency(e.target.value)} className="bg-[#121212] border border-[#333] text-white px-2 py-1.5 rounded-lg outline-none w-full cursor-pointer text-xs font-mono">
              {['USD', 'EUR', 'GBP', 'NGN', 'BTC'].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] text-[#656565] font-semibold">Timezone</label>
            <select value={timezone} onChange={e => setTimezone(e.target.value)} className="bg-[#121212] border border-[#333] text-white px-2 py-1.5 rounded-lg outline-none w-full cursor-pointer text-xs font-mono">
              {['UTC', 'EST', 'PST', 'WAT', 'CET'].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] text-[#656565] font-semibold">Text Direction</label>
            <div className="flex gap-1.5">
              {(['LTR', 'RTL'] as const).map(d => (
                <button
                  key={d}
                  onClick={() => setTextDir(d)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                    textDir === d ? 'bg-[#2266ec] border-[#2266ec] text-white' : 'bg-[#121212] border-[#262626] text-[#656565]'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] text-[#656565] font-semibold">Translation Coverage</label>
            <div className="bg-[#121212] border border-[#262626] rounded-lg p-2 space-y-1.5">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-[#a6a6a6]">Coverage</span>
                <span className="text-green-400 font-mono font-bold">87%</span>
              </div>
              <div className="w-full h-1.5 bg-[#262626] rounded-full overflow-hidden">
                <div className="h-full bg-green-400 rounded-full" style={{ width: '87%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
