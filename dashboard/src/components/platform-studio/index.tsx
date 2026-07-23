"use client";

import React, { useState } from 'react';
import {
  Boxes, PanelLeft, Palette, Flag, GitBranch, Layers, Settings2
} from 'lucide-react';
import { PlatformApp, PlatformModule } from './types';
import { AppModuleManager } from './app-module-manager';
import { NavigationLayoutStudio } from './navigation-layout';
import { ThemeBrandingStudio } from './theme-branding';
import { FlagsEnvironmentStudio } from './flags-environment';
import { PublishingSimulator } from './publishing-simulator';
import { BlueprintEngine } from './blueprint-engine';

export function UniversalPlatformStudio() {
  const [activeTab, setActiveTab] = useState<
    'apps_modules' | 'navigation' | 'theme_brand' | 'flags_env' | 'publishing' | 'blueprints'
  >('apps_modules');

  const [apps, setApps] = useState<PlatformApp[]>([
    { id: 'app_1', name: 'Analytics Pro', category: 'Analytics', icon: '📊', status: 'active', version: '3.2.1', layoutMode: 'sidebar', enabledModules: ['Users', 'Analytics', 'Reports', 'AI', 'Payments', 'Notifications'], domainName: 'analytics.cirlo.io' },
    { id: 'app_2', name: 'Admin OS', category: 'Administration', icon: '⚙️', status: 'active', version: '2.0.0', layoutMode: 'sidebar', enabledModules: ['Users', 'Analytics', 'Reports', 'AI', 'Payments', 'Notifications', 'Automation', 'Inventory'], domainName: 'admin.cirlo.io' },
    { id: 'app_3', name: 'SchoolTrack', category: 'Education', icon: '🎓', status: 'active', version: '1.8.4', layoutMode: 'top_nav', enabledModules: ['Users', 'Analytics', 'Reports', 'Notifications', 'AI'], domainName: 'school.cirlo.io' },
    { id: 'app_4', name: 'CRM Engine', category: 'Sales', icon: '🤝', status: 'active', version: '4.1.0', layoutMode: 'split_view', enabledModules: ['Users', 'Analytics', 'Reports', 'AI', 'Payments', 'Notifications', 'Automation'], domainName: 'crm.cirlo.io' },
    { id: 'app_5', name: 'InventoryHub', category: 'Logistics', icon: '📦', status: 'active', version: '2.3.1', layoutMode: 'sidebar', enabledModules: ['Users', 'Inventory', 'Reports', 'Notifications'], domainName: 'inventory.cirlo.io' },
    { id: 'app_6', name: 'RepairDesk', category: 'Field Service', icon: '🔧', status: 'draft', version: '0.9.2', layoutMode: 'workspace', enabledModules: ['Users', 'Inventory', 'Notifications'], domainName: 'repair.cirlo.io' },
    { id: 'app_7', name: 'BlockVault', category: 'Blockchain', icon: '⛓️', status: 'draft', version: '0.5.0', layoutMode: 'fullscreen', enabledModules: ['Users', 'Payments'], domainName: 'chain.cirlo.io' },
    { id: 'app_8', name: 'SupportOS', category: 'Customer Support', icon: '💬', status: 'active', version: '3.0.1', layoutMode: 'sidebar', enabledModules: ['Users', 'Analytics', 'Reports', 'AI', 'Notifications'], domainName: 'support.cirlo.io' },
  ]);

  const [modules, setModules] = useState<PlatformModule[]>([
    { id: 'mod_1', name: 'Users & Identity', description: 'Core identity management, authentication, and user profiles', category: 'Core', enabled: true },
    { id: 'mod_2', name: 'Analytics Engine', description: 'Real-time analytics, dashboards, and data visualization', category: 'Intelligence', enabled: true, dependsOn: ['Users & Identity'] },
    { id: 'mod_3', name: 'Payment Gateway', description: 'Stripe, crypto, and multi-currency payment processing', category: 'Finance', enabled: true, dependsOn: ['Users & Identity'] },
    { id: 'mod_4', name: 'Inventory System', description: 'Product catalog, stock tracking, and warehouse management', category: 'Logistics', enabled: true, dependsOn: ['Products'] },
    { id: 'mod_5', name: 'Report Builder', description: 'Automated PDF/CSV report generation and scheduling', category: 'Intelligence', enabled: true, dependsOn: ['Analytics Engine'] },
    { id: 'mod_6', name: 'Notification Hub', description: 'Email, SMS, push, and in-app notification delivery', category: 'Communication', enabled: true },
    { id: 'mod_7', name: 'AI Engine', description: 'LLM-powered agents, copilots, and intelligent automation', category: 'Intelligence', enabled: true, dependsOn: ['Users & Identity', 'Analytics Engine'] },
    { id: 'mod_8', name: 'Automation Studio', description: 'Visual workflow builder with triggers, actions, and conditions', category: 'Workflow', enabled: true, dependsOn: ['AI Engine'] },
  ]);

  const handleToggleModule = (moduleId: string) => {
    setModules(prev => prev.map(m => m.id === moduleId ? { ...m, enabled: !m.enabled } : m));
  };

  const tabs = [
    { id: 'apps_modules' as const, label: '1. Applications & Modules', icon: Boxes },
    { id: 'navigation' as const, label: '2. Navigation & Layout', icon: PanelLeft },
    { id: 'theme_brand' as const, label: '3. Theme & Branding', icon: Palette },
    { id: 'flags_env' as const, label: '4. Flags & Environment', icon: Flag },
    { id: 'publishing' as const, label: '5. Publishing Pipeline', icon: GitBranch },
    { id: 'blueprints' as const, label: '6. ⭐ Platform Blueprints', icon: Layers },
  ];

  return (
    <div className="space-y-6 w-full font-sans">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#262626]">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Settings2 className="w-6 h-6 text-[#2266ec]" /> Tool #8: Platform Studio
          </h1>
          <p className="text-xs text-[#a6a6a6] mt-1">
            The control room for your entire platform. Configure, customize, extend, and brand any application without writing code.
          </p>
        </div>
      </div>

      {/* 6 Navigation Tabs */}
      <div className="flex items-center gap-1.5 border-b border-[#262626] pb-3 overflow-x-auto hide-scrollbar text-xs font-semibold">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl border transition-all shrink-0 flex items-center gap-2 ${
                isActive
                  ? 'bg-[#2266ec] border-[#2266ec] text-white shadow-lg shadow-[#2266ec]/20'
                  : 'bg-[#1a1a1a] border-[#262626] text-[#a6a6a6] hover:text-white hover:bg-[#262626]'
              }`}
            >
              <Icon className="w-4 h-4" /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Renderers */}
      {activeTab === 'apps_modules' && (
        <AppModuleManager
          apps={apps}
          modules={modules}
          onToggleModule={handleToggleModule}
          onSelectApp={() => {}}
        />
      )}

      {activeTab === 'navigation' && <NavigationLayoutStudio />}
      {activeTab === 'theme_brand' && <ThemeBrandingStudio />}
      {activeTab === 'flags_env' && <FlagsEnvironmentStudio />}
      {activeTab === 'publishing' && <PublishingSimulator />}
      {activeTab === 'blueprints' && <BlueprintEngine />}
    </div>
  );
}
