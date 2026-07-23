"use client";

import React, { useState } from 'react';
import {
  Palette, Type, Upload, Globe, Sun, Moon, Monitor, Sliders, Sparkles
} from 'lucide-react';
import { ThemeConfig } from './types';
import { toast } from '@/components/ui/toast';

const COLOR_PRESETS = [
  '#2266ec', '#8b5cf6', '#ef4444', '#10b981', '#f59e0b', '#ec4899', '#06b6d4', '#f97316',
];

const FONTS = ['Inter', 'Roboto', 'Outfit', 'JetBrains Mono', 'SF Pro', 'Plus Jakarta Sans'];
const DENSITIES: ThemeConfig['density'][] = ['compact', 'comfortable', 'spacious'];
const SHADOW_LEVELS = ['None', 'Subtle', 'Medium', 'Dramatic'] as const;
type ShadowLevel = typeof SHADOW_LEVELS[number];

export function ThemeBrandingStudio() {
  const [theme, setTheme] = useState<ThemeConfig>({
    primaryColor: '#2266ec',
    accentColor: '#8b5cf6',
    fontFamily: 'Inter',
    borderRadiusPx: 12,
    density: 'comfortable',
    mode: 'dark',
  });
  const [shadow, setShadow] = useState<ShadowLevel>('Medium');
  const [brandName, setBrandName] = useState('Cirlo Admin OS');
  const [domain, setDomain] = useState('admin.cirlo.io');

  const densityPadding: Record<string, string> = {
    compact: 'p-2',
    comfortable: 'p-4',
    spacious: 'p-6',
  };

  const shadowCSS: Record<ShadowLevel, string> = {
    None: 'shadow-none',
    Subtle: 'shadow-md',
    Medium: 'shadow-xl',
    Dramatic: 'shadow-2xl',
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Theme Design System */}
      <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-5 shadow-xl space-y-5">
        <div className="border-b border-[#262626] pb-3">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <Palette className="w-4 h-4 text-[#2266ec]" /> Dynamic Theme Design System
          </h3>
          <p className="text-[10px] text-[#656565] mt-1">Configure every visual aspect of your platform in real time.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Controls */}
          <div className="space-y-5">
            {/* Primary Color */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-white">Primary Color</label>
              <div className="flex items-center gap-2">
                {COLOR_PRESETS.map(c => (
                  <button
                    key={c}
                    onClick={() => { setTheme(p => ({ ...p, primaryColor: c })); toast(`Primary color set to ${c}`, { type: 'success' }); }}
                    className={`w-7 h-7 rounded-lg border-2 transition-all ${
                      theme.primaryColor === c ? 'border-white scale-110' : 'border-transparent hover:scale-105'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            {/* Accent Color */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-white">Accent Color</label>
              <div className="flex items-center gap-2">
                {COLOR_PRESETS.map(c => (
                  <button
                    key={c}
                    onClick={() => setTheme(p => ({ ...p, accentColor: c }))}
                    className={`w-7 h-7 rounded-lg border-2 transition-all ${
                      theme.accentColor === c ? 'border-white scale-110' : 'border-transparent hover:scale-105'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            {/* Mode */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-white">Background Mode</label>
              <div className="flex items-center gap-2">
                {([
                  { m: 'dark' as const, icon: <Moon className="w-3.5 h-3.5" />, label: 'Dark' },
                  { m: 'light' as const, icon: <Sun className="w-3.5 h-3.5" />, label: 'Light' },
                  { m: 'system' as const, icon: <Monitor className="w-3.5 h-3.5" />, label: 'System' },
                ]).map(o => (
                  <button
                    key={o.m}
                    onClick={() => setTheme(p => ({ ...p, mode: o.m }))}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                      theme.mode === o.m
                        ? 'bg-[#2266ec] border-[#2266ec] text-white'
                        : 'bg-[#121212] border-[#262626] text-[#a6a6a6] hover:text-white'
                    }`}
                  >
                    {o.icon} {o.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Font Family */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-white flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5 text-purple-400" /> Font Family
              </label>
              <select
                value={theme.fontFamily}
                onChange={e => setTheme(p => ({ ...p, fontFamily: e.target.value }))}
                className="bg-[#121212] border border-[#333] text-white text-xs px-3 py-1.5 rounded-lg outline-none w-full cursor-pointer"
              >
                {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>

            {/* Border Radius */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-white flex items-center justify-between">
                Border Radius
                <span className="text-[#2266ec] font-mono text-[10px]">{theme.borderRadiusPx}px</span>
              </label>
              <input
                type="range"
                min={0}
                max={24}
                value={theme.borderRadiusPx}
                onChange={e => setTheme(p => ({ ...p, borderRadiusPx: Number(e.target.value) }))}
                className="w-full accent-[#2266ec] h-1.5"
              />
            </div>

            {/* Density */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-white">Density</label>
              <div className="flex items-center gap-2">
                {DENSITIES.map(d => (
                  <button
                    key={d}
                    onClick={() => setTheme(p => ({ ...p, density: d }))}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all capitalize ${
                      theme.density === d
                        ? 'bg-[#2266ec] border-[#2266ec] text-white'
                        : 'bg-[#121212] border-[#262626] text-[#a6a6a6] hover:text-white'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Shadow */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-white flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-cyan-400" /> Shadow Intensity
              </label>
              <div className="flex items-center gap-2">
                {SHADOW_LEVELS.map(s => (
                  <button
                    key={s}
                    onClick={() => setShadow(s)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      shadow === s
                        ? 'bg-[#2266ec] border-[#2266ec] text-white'
                        : 'bg-[#121212] border-[#262626] text-[#a6a6a6] hover:text-white'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Live Preview */}
          <div className="space-y-3">
            <div className="text-xs font-semibold text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Live Preview
            </div>
            <div
              className={`bg-[#0f0f0f] border border-[#262626] p-5 space-y-4 ${shadowCSS[shadow]}`}
              style={{ borderRadius: `${theme.borderRadiusPx}px`, fontFamily: theme.fontFamily }}
            >
              {/* Sample Header */}
              <div
                className="h-10 flex items-center px-4 text-white text-xs font-bold"
                style={{ backgroundColor: theme.primaryColor, borderRadius: `${theme.borderRadiusPx}px` }}
              >
                {brandName} — Header Preview
              </div>
              {/* Sample Card */}
              <div
                className={`bg-[#1a1a1a] border border-[#262626] ${densityPadding[theme.density]} space-y-2 ${shadowCSS[shadow]}`}
                style={{ borderRadius: `${theme.borderRadiusPx}px` }}
              >
                <div className="text-sm font-bold text-white">Sample Card Component</div>
                <div className="text-xs text-[#a6a6a6]">
                  This card updates in real time as you change theme settings. Font: {theme.fontFamily}, Radius: {theme.borderRadiusPx}px, Density: {theme.density}.
                </div>
                <button
                  className="text-xs text-white px-4 py-1.5 font-semibold"
                  style={{ backgroundColor: theme.primaryColor, borderRadius: `${Math.min(theme.borderRadiusPx, 12)}px` }}
                >
                  Primary Button
                </button>
                <button
                  className="text-xs text-white px-4 py-1.5 font-semibold ml-2"
                  style={{ backgroundColor: theme.accentColor, borderRadius: `${Math.min(theme.borderRadiusPx, 12)}px` }}
                >
                  Accent Button
                </button>
              </div>
              {/* Sample Text */}
              <div className="text-xs text-[#a6a6a6]" style={{ fontFamily: theme.fontFamily }}>
                Typography sample — The quick brown fox jumps over the lazy dog. 0123456789
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* White-Label Branding */}
      <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-5 shadow-xl space-y-5">
        <div className="border-b border-[#262626] pb-3">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <Globe className="w-4 h-4 text-purple-400" /> White-Label Branding Studio
          </h3>
          <p className="text-[10px] text-[#656565] mt-1">Customize brand identity per application. Supports full white-labeling.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Brand Fields */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white">Brand Name</label>
              <input
                type="text"
                value={brandName}
                onChange={e => setBrandName(e.target.value)}
                className="bg-[#121212] border border-[#333] text-white text-xs px-3 py-2 rounded-lg outline-none w-full"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white">Custom Domain</label>
              <input
                type="text"
                value={domain}
                onChange={e => setDomain(e.target.value)}
                className="bg-[#121212] border border-[#333] text-white text-xs px-3 py-2 rounded-lg outline-none w-full font-mono"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white">Logo</label>
                <div className="bg-[#121212] border border-dashed border-[#333] rounded-lg h-20 flex items-center justify-center text-[#656565] text-xs gap-1.5 cursor-pointer hover:border-[#2266ec] transition-colors">
                  <Upload className="w-4 h-4" /> Upload Logo
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white">Favicon</label>
                <div className="bg-[#121212] border border-dashed border-[#333] rounded-lg h-20 flex items-center justify-center text-[#656565] text-xs gap-1.5 cursor-pointer hover:border-[#2266ec] transition-colors">
                  <Upload className="w-3.5 h-3.5" /> Favicon
                </div>
              </div>
            </div>
          </div>

          {/* Login & Email Preview */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white">Login Screen Preview</label>
              <div className="bg-[#0f0f0f] border border-[#262626] rounded-xl p-6 flex flex-col items-center justify-center space-y-3 min-h-[180px]">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg" style={{ backgroundColor: theme.primaryColor }}>
                  {brandName.charAt(0)}
                </div>
                <div className="text-sm font-bold text-white">{brandName}</div>
                <div className="w-full max-w-[200px] space-y-2">
                  <div className="bg-[#1a1a1a] border border-[#262626] rounded-lg h-7 w-full" />
                  <div className="bg-[#1a1a1a] border border-[#262626] rounded-lg h-7 w-full" />
                  <div className="h-7 rounded-lg text-white text-[10px] font-bold flex items-center justify-center" style={{ backgroundColor: theme.primaryColor }}>
                    Sign In
                  </div>
                </div>
                <div className="text-[9px] text-[#656565] font-mono">{domain}</div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white">Email Branding Preview</label>
              <div className="bg-[#0f0f0f] border border-[#262626] rounded-xl p-4 space-y-2 min-h-[100px]">
                <div className="h-6 rounded flex items-center px-3 text-white text-[10px] font-bold" style={{ backgroundColor: theme.primaryColor }}>
                  {brandName} — Notification
                </div>
                <div className="text-[10px] text-[#a6a6a6] px-1">Hello, you have a new update from <span className="font-bold text-white">{brandName}</span>.</div>
                <div className="text-[9px] text-[#656565] px-1 font-mono border-t border-[#262626] pt-2 mt-2">
                  Sent from {domain} · Unsubscribe
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
