"use client";

import React, { useState } from 'react';
import {
  Boxes, ToggleRight, ToggleLeft, AlertTriangle, ChevronRight, Layers,
  Search, Shield, Cpu, DollarSign, BarChart3, Bell, Bot, Workflow, Package, Users
} from 'lucide-react';
import { PlatformApp, PlatformModule } from './types';
import { toast } from '@/components/ui/toast';

interface Props {
  apps: PlatformApp[];
  modules: PlatformModule[];
  onToggleModule: (moduleId: string) => void;
  onSelectApp: (app: PlatformApp) => void;
}

export function AppModuleManager({ apps, modules, onToggleModule, onSelectApp }: Props) {
  const [selectedAppId, setSelectedAppId] = useState<string>(apps[0]?.id ?? '');
  const [search, setSearch] = useState('');

  const statusColor: Record<string, string> = {
    active: 'bg-green-500/20 text-green-400',
    inactive: 'bg-red-500/20 text-red-400',
    draft: 'bg-amber-500/20 text-amber-400',
  };

  const layoutLabels: Record<string, string> = {
    sidebar: 'Sidebar',
    top_nav: 'Top Nav',
    split_view: 'Split View',
    three_column: '3 Column',
    workspace: 'Workspace',
    fullscreen: 'Fullscreen',
  };

  const categoryIcons: Record<string, React.ReactNode> = {
    Core: <Shield className="w-3.5 h-3.5 text-green-400" />,
    Intelligence: <BarChart3 className="w-3.5 h-3.5 text-purple-400" />,
    Finance: <DollarSign className="w-3.5 h-3.5 text-amber-400" />,
    Logistics: <Package className="w-3.5 h-3.5 text-cyan-400" />,
    Communication: <Bell className="w-3.5 h-3.5 text-pink-400" />,
    Workflow: <Workflow className="w-3.5 h-3.5 text-orange-400" />,
  };

  const filteredApps = apps.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans">
      {/* Application Registry */}
      <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#262626] pb-3">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <Boxes className="w-4 h-4 text-[#2266ec]" /> Application Registry
          </h3>
          <div className="flex items-center gap-2 bg-[#121212] border border-[#333] rounded-lg px-3 py-1.5 text-xs text-white w-64">
            <Search className="w-3.5 h-3.5 text-[#656565]" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search applications..."
              className="w-full bg-transparent outline-none placeholder:text-[#656565]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
          {filteredApps.map(app => {
            const isSelected = selectedAppId === app.id;
            return (
              <button
                key={app.id}
                onClick={() => { setSelectedAppId(app.id); onSelectApp(app); }}
                className={`text-left bg-[#121212] p-4 rounded-xl border transition-all space-y-3 ${
                  isSelected
                    ? 'border-[#2266ec] shadow-lg shadow-[#2266ec]/10 ring-1 ring-[#2266ec]/30'
                    : 'border-[#262626] hover:border-[#333]'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{app.icon}</span>
                    <div>
                      <div className="font-bold text-white text-sm">{app.name}</div>
                      <div className="text-[10px] text-[#656565] font-mono">{app.domainName}</div>
                    </div>
                  </div>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${statusColor[app.status]}`}>
                    {app.status}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[10px] font-mono text-[#a6a6a6]">
                  <span className="bg-[#1a1a1a] px-1.5 py-0.5 rounded border border-[#262626]">{app.category}</span>
                  <span>v{app.version}</span>
                  <span className="text-[#656565]">•</span>
                  <span>{layoutLabels[app.layoutMode]}</span>
                </div>

                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-[#656565]">{app.enabledModules.length} modules enabled</span>
                  <ChevronRight className={`w-3.5 h-3.5 transition-colors ${isSelected ? 'text-[#2266ec]' : 'text-[#333]'}`} />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Module Scoping Engine */}
      <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#262626] pb-3">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-400" /> Module Scoping Engine
          </h3>
          <span className="text-[10px] text-[#656565] font-mono">
            {modules.filter(m => m.enabled).length}/{modules.length} modules active
          </span>
        </div>

        <div className="space-y-2">
          {modules.map(mod => {
            const hasDeps = mod.dependsOn && mod.dependsOn.length > 0;
            return (
              <div
                key={mod.id}
                className="bg-[#121212] border border-[#262626] rounded-lg p-3.5 flex items-center justify-between gap-4 text-xs"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-[#1a1a1a] border border-[#262626] flex items-center justify-center shrink-0">
                    {categoryIcons[mod.category] ?? <Cpu className="w-3.5 h-3.5 text-[#a6a6a6]" />}
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-white flex items-center gap-2">
                      {mod.name}
                      <span className="text-[9px] bg-[#1a1a1a] text-[#a6a6a6] px-1.5 py-0.5 rounded border border-[#262626] font-mono">
                        {mod.category}
                      </span>
                    </div>
                    <div className="text-[10px] text-[#656565] truncate">{mod.description}</div>
                    {hasDeps && (
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" />
                        <span className="text-[9px] text-amber-400/80">Depends on:</span>
                        {mod.dependsOn!.map(dep => (
                          <span key={dep} className="text-[9px] bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded font-mono">{dep}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => {
                    onToggleModule(mod.id);
                    toast(`Module "${mod.name}" ${mod.enabled ? 'disabled' : 'enabled'}`, { type: mod.enabled ? 'info' : 'success' });
                  }}
                  className="shrink-0"
                  title={mod.enabled ? 'Disable module' : 'Enable module'}
                >
                  {mod.enabled ? (
                    <ToggleRight className="w-7 h-7 text-green-400" />
                  ) : (
                    <ToggleLeft className="w-7 h-7 text-[#333]" />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
