"use client";

import React, { useState, useEffect, useCallback } from 'react';
import {
  Rocket, Layers, Check, ChevronRight, Palette, Globe, Bot,
  LayoutDashboard, Shield, Sparkles, Package
} from 'lucide-react';
import { PlatformBlueprint } from './types';
import { toast } from '@/components/ui/toast';

const COLOR_SWATCHES = ['#2266ec', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4', '#f97316'];

const INDUSTRY_GRADIENTS: Record<string, string> = {
  Education: 'from-blue-500/20 to-cyan-500/10',
  'E-Commerce': 'from-green-500/20 to-emerald-500/10',
  Fintech: 'from-purple-500/20 to-violet-500/10',
  'Repair Shop': 'from-orange-500/20 to-amber-500/10',
  'SaaS Admin': 'from-[#2266ec]/20 to-blue-500/10',
};

const BLUEPRINTS: PlatformBlueprint[] = [
  { id: 'bp_1', title: 'Education Suite', description: 'Complete school management platform with student enrollment, grade tracking, attendance, and parent portals.', industry: 'Education', icon: '🎓', modulesCount: 12, navItemsCount: 18, presetTheme: 'Academic Blue' },
  { id: 'bp_2', title: 'E-Commerce Platform', description: 'Full-stack commerce solution with product catalog, cart, checkout, inventory sync, and order management.', industry: 'E-Commerce', icon: '🛒', modulesCount: 15, navItemsCount: 22, presetTheme: 'Commerce Green' },
  { id: 'bp_3', title: 'Fintech Dashboard', description: 'Financial operations center with transaction monitoring, KYC/AML compliance, crypto wallets, and treasury management.', industry: 'Fintech', icon: '💰', modulesCount: 10, navItemsCount: 14, presetTheme: 'Finance Purple' },
  { id: 'bp_4', title: 'Repair Shop Manager', description: 'Field service management with work orders, technician dispatch, parts inventory, and customer communication.', industry: 'Repair Shop', icon: '🔧', modulesCount: 8, navItemsCount: 12, presetTheme: 'Service Orange' },
  { id: 'bp_5', title: 'SaaS Admin Panel', description: 'Multi-tenant SaaS administration with billing, subscriptions, feature flags, and customer analytics.', industry: 'SaaS Admin', icon: '⚙️', modulesCount: 14, navItemsCount: 20, presetTheme: 'Admin Dark' },
];

interface DeployStep {
  label: string;
  done: boolean;
}

export function BlueprintEngine() {
  const [selectedBp, setSelectedBp] = useState<PlatformBlueprint | null>(null);
  const [step, setStep] = useState(1);
  const [appName, setAppName] = useState('');
  const [appDomain, setAppDomain] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#2266ec');
  const [deploying, setDeploying] = useState(false);
  const [deploySteps, setDeploySteps] = useState<DeployStep[]>([]);
  const [deployDone, setDeployDone] = useState(false);

  const selectBlueprint = (bp: PlatformBlueprint) => {
    setSelectedBp(bp);
    setStep(1);
    setAppName(`My ${bp.title}`);
    setAppDomain(`${bp.industry.toLowerCase().replace(/\s+/g, '-')}.cirlo.io`);
    setDeploying(false);
    setDeploySteps([]);
    setDeployDone(false);
    toast(`Blueprint "${bp.title}" selected`, { type: 'info' });
  };

  const startDeploy = useCallback(() => {
    if (!selectedBp) return;
    setDeploying(true);
    setDeployDone(false);
    const steps: DeployStep[] = [
      { label: 'Creating application...', done: false },
      { label: 'Applying navigation...', done: false },
      { label: 'Enabling modules...', done: false },
      { label: 'Configuring theme...', done: false },
      { label: 'Setting permissions...', done: false },
      { label: 'Assigning AI agents...', done: false },
    ];
    setDeploySteps(steps);

    steps.forEach((_, i) => {
      setTimeout(() => {
        setDeploySteps(prev => prev.map((s, j) => j <= i ? { ...s, done: true } : s));
        if (i === steps.length - 1) {
          setTimeout(() => {
            setDeployDone(true);
            toast(`🎉 "${appName}" deployed successfully!`, { type: 'success' });
          }, 400);
        }
      }, (i + 1) * 600);
    });
  }, [selectedBp, appName]);

  return (
    <div className="space-y-6 font-sans">
      {/* Blueprint Registry */}
      <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-5 shadow-xl space-y-4">
        <div className="border-b border-[#262626] pb-3">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#2266ec]" /> ⭐ Platform Blueprint Registry
          </h3>
          <p className="text-[10px] text-[#656565] mt-1">Select a pre-built blueprint to spin up a fully configured application in minutes.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {BLUEPRINTS.map(bp => {
            const isSelected = selectedBp?.id === bp.id;
            const gradient = INDUSTRY_GRADIENTS[bp.industry] ?? 'from-[#2266ec]/20 to-blue-500/10';
            return (
              <button
                key={bp.id}
                onClick={() => selectBlueprint(bp)}
                className={`text-left rounded-xl border-2 transition-all overflow-hidden group ${
                  isSelected
                    ? 'border-[#2266ec] shadow-lg shadow-[#2266ec]/15 ring-1 ring-[#2266ec]/30'
                    : 'border-[#262626] hover:border-[#333]'
                }`}
              >
                {/* Gradient Header */}
                <div className={`bg-gradient-to-br ${gradient} p-4 flex items-center gap-3`}>
                  <span className="text-3xl">{bp.icon}</span>
                  <div>
                    <div className="font-bold text-white text-sm">{bp.title}</div>
                    <span className="text-[9px] bg-white/10 text-white/80 px-1.5 py-0.5 rounded font-mono">{bp.industry}</span>
                  </div>
                </div>

                <div className="bg-[#121212] p-4 space-y-3">
                  <p className="text-[11px] text-[#a6a6a6] leading-relaxed line-clamp-2">{bp.description}</p>
                  <div className="flex items-center gap-3 text-[10px] font-mono text-[#656565]">
                    <span className="flex items-center gap-1"><Package className="w-3 h-3" /> {bp.modulesCount} modules</span>
                    <span className="flex items-center gap-1"><LayoutDashboard className="w-3 h-3" /> {bp.navItemsCount} nav</span>
                    <span className="flex items-center gap-1"><Palette className="w-3 h-3" /> {bp.presetTheme}</span>
                  </div>
                  <div className={`text-[10px] font-bold flex items-center gap-1 transition-colors ${
                    isSelected ? 'text-[#2266ec]' : 'text-[#656565] group-hover:text-white'
                  }`}>
                    {isSelected ? <><Check className="w-3 h-3" /> Selected</> : <>Deploy Blueprint <ChevronRight className="w-3 h-3" /></>}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 1-Click Deployment Wizard */}
      {selectedBp && (
        <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-5 shadow-xl space-y-5">
          <div className="border-b border-[#262626] pb-3">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Rocket className="w-4 h-4 text-amber-400" /> Create New Application From Blueprint
            </h3>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-0 py-2">
            {[
              { n: 1, label: 'Select Blueprint' },
              { n: 2, label: 'Customize' },
              { n: 3, label: 'Review & Deploy' },
            ].map((s, i) => (
              <React.Fragment key={s.n}>
                <button
                  onClick={() => { if (!deploying) setStep(s.n); }}
                  className="flex flex-col items-center gap-1.5"
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                    step >= s.n
                      ? 'bg-[#2266ec] border-[#2266ec] text-white'
                      : 'bg-[#121212] border-[#262626] text-[#656565]'
                  }`}>
                    {step > s.n ? <Check className="w-3.5 h-3.5" /> : s.n}
                  </div>
                  <span className={`text-[10px] font-semibold ${step >= s.n ? 'text-[#2266ec]' : 'text-[#656565]'}`}>{s.label}</span>
                </button>
                {i < 2 && (
                  <div className={`w-16 h-0.5 mx-2 mt-[-16px] rounded-full ${step > s.n ? 'bg-[#2266ec]' : 'bg-[#262626]'}`} />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Step Content */}
          {step === 1 && (
            <div className="bg-[#121212] border border-[#262626] rounded-xl p-4 text-center space-y-3">
              <div className="text-3xl">{selectedBp.icon}</div>
              <div className="font-bold text-white">{selectedBp.title}</div>
              <div className="text-xs text-[#a6a6a6]">{selectedBp.description}</div>
              <button
                onClick={() => setStep(2)}
                className="text-xs bg-[#2266ec] text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-1.5 mx-auto"
              >
                Continue <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="bg-[#121212] border border-[#262626] rounded-xl p-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white">Application Name</label>
                <input
                  type="text"
                  value={appName}
                  onChange={e => setAppName(e.target.value)}
                  className="bg-[#1a1a1a] border border-[#333] text-white text-xs px-3 py-2 rounded-lg outline-none w-full"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white">Domain</label>
                <input
                  type="text"
                  value={appDomain}
                  onChange={e => setAppDomain(e.target.value)}
                  className="bg-[#1a1a1a] border border-[#333] text-white text-xs px-3 py-2 rounded-lg outline-none w-full font-mono"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white">Primary Color</label>
                <div className="flex items-center gap-2">
                  {COLOR_SWATCHES.map(c => (
                    <button
                      key={c}
                      onClick={() => setPrimaryColor(c)}
                      className={`w-7 h-7 rounded-lg border-2 transition-all ${primaryColor === c ? 'border-white scale-110' : 'border-transparent hover:scale-105'}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
              <button
                onClick={() => setStep(3)}
                className="text-xs bg-[#2266ec] text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-1.5"
              >
                Review & Deploy <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {step === 3 && !deploying && (
            <div className="space-y-4">
              <div className="bg-[#121212] border border-[#262626] rounded-xl p-5 space-y-3">
                <div className="font-bold text-white text-sm">Deployment Summary</div>
                <div className="text-xs text-[#a6a6a6] space-y-2">
                  <div className="flex items-center gap-2"><span className="text-green-400">✅</span> Application: <span className="text-white font-bold">{appName}</span></div>
                  <div className="flex items-center gap-2"><span className="text-green-400">✅</span> Blueprint: <span className="text-white">{selectedBp.title}</span></div>
                  <div className="flex items-center gap-2"><Globe className="w-3.5 h-3.5 text-green-400" /> Domain: <span className="text-white font-mono">{appDomain}</span></div>
                  <div className="flex items-center gap-2"><LayoutDashboard className="w-3.5 h-3.5 text-green-400" /> Navigation: {selectedBp.navItemsCount} items</div>
                  <div className="flex items-center gap-2"><Package className="w-3.5 h-3.5 text-green-400" /> Modules: {selectedBp.modulesCount} enabled</div>
                  <div className="flex items-center gap-2"><Palette className="w-3.5 h-3.5 text-green-400" /> Theme: {selectedBp.presetTheme} applied</div>
                  <div className="flex items-center gap-2"><Shield className="w-3.5 h-3.5 text-green-400" /> Permissions: {Math.floor(selectedBp.modulesCount * 1.5)} roles configured</div>
                  <div className="flex items-center gap-2"><Bot className="w-3.5 h-3.5 text-green-400" /> AI Agents: {Math.ceil(selectedBp.modulesCount / 3)} assigned</div>
                  <div className="flex items-center gap-2"><Sparkles className="w-3.5 h-3.5 text-green-400" /> Dashboards: {Math.ceil(selectedBp.navItemsCount / 4)} generated</div>
                </div>
              </div>

              <button
                onClick={startDeploy}
                className="w-full py-3 rounded-xl bg-[#2266ec] text-white text-sm font-bold hover:bg-[#1a55d4] transition-colors shadow-lg shadow-[#2266ec]/20 flex items-center justify-center gap-2"
              >
                <Rocket className="w-4 h-4" /> 🚀 Deploy Application
              </button>
            </div>
          )}

          {deploying && (
            <div className="bg-[#121212] border border-[#262626] rounded-xl p-5 space-y-3">
              <div className="font-bold text-white text-sm mb-2">{deployDone ? '🎉 Deployment Complete!' : 'Deploying...'}</div>
              {deploySteps.map((ds, i) => (
                <div key={i} className={`flex items-center gap-2 text-xs transition-all ${ds.done ? 'text-green-400' : 'text-[#656565]'}`}>
                  {ds.done ? <Check className="w-3.5 h-3.5 text-green-400" /> : <div className="w-3.5 h-3.5 border border-[#333] rounded-full animate-pulse" />}
                  {ds.label} {ds.done && '✅'}
                </div>
              ))}
              {deployDone && (
                <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-center space-y-2">
                  <div className="text-2xl">🎊</div>
                  <div className="text-sm font-bold text-green-400">&quot;{appName}&quot; is live!</div>
                  <div className="text-[10px] text-[#a6a6a6] font-mono">{appDomain}</div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
