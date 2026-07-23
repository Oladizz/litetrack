"use client";

import React, { useState } from 'react';
import { 
  Shield, Users, Building2, Sliders, Eye, UserCheck, X, Activity, Key 
} from 'lucide-react';
import { IdentityRecord, DynamicRole } from './types';
import { IOACIdentityManager } from './identity-manager';
import { IOACOrganizationWorkspace } from './organization-workspace';
import { IOACRolePermissionMatrix } from './role-permission-matrix';
import { IOACPolicyEngine } from './policy-engine';
import { IOACPermissionSimulator } from './permission-simulator';
import { toast } from '@/components/ui/toast';

export function UniversalIOAC() {
  const [activeTab, setActiveTab] = useState<'identities' | 'org_workspaces' | 'roles' | 'policies' | 'simulator'>('identities');

  // Impersonation Banner State
  const [impersonatingUser, setImpersonatingUser] = useState<IdentityRecord | null>(null);

  const [identities, setIdentities] = useState<IdentityRecord[]>([
    {
      id: 'usr_9481',
      name: 'John Doe',
      email: 'john.doe@gmail.com',
      type: 'admin',
      roleId: 'r_ceo',
      roleName: 'CEO / Executive',
      status: 'active',
      riskScore: 12,
      mfaEnabled: true,
      created: 'Yesterday',
      sessions: [
        { id: 's1', device: 'Chrome on Windows 11', ipLocation: 'Lagos, Nigeria', lastActive: '2 mins ago', isCurrent: true },
        { id: 's2', device: 'Safari on iPhone 15', ipLocation: 'Lagos, Nigeria', lastActive: '2 days ago', isCurrent: false }
      ]
    },
    {
      id: 'usr_8392',
      name: 'Sarah Connor',
      email: 'sarah@cyberdyne.com',
      type: 'user',
      roleId: 'r_tech',
      roleName: 'Repair Technician',
      status: 'pending',
      riskScore: 78,
      mfaEnabled: false,
      created: '3 days ago',
      sessions: [
        { id: 's3', device: 'Firefox on macOS', ipLocation: 'London, UK', lastActive: '1 hour ago', isCurrent: false }
      ]
    },
    {
      id: 'usr_6104',
      name: 'Rabiu Oladizz',
      email: 'oladizz.dev@gmail.com',
      type: 'admin',
      roleId: 'r_ceo',
      roleName: 'Super Admin',
      status: 'active',
      riskScore: 5,
      mfaEnabled: true,
      created: 'Just now',
      sessions: [
        { id: 's4', device: 'Chrome on Linux', ipLocation: 'Lagos, Nigeria', lastActive: 'Just now', isCurrent: true }
      ]
    }
  ]);

  const roles: DynamicRole[] = [
    {
      id: 'r_ceo',
      name: 'CEO / Executive',
      description: 'Full strategic access to analytics, financial reports, and high-level dashboards.',
      actions: ['read', 'create', 'update', 'export', 'approve', 'share', 'manage'],
      fieldPermissions: [
        { fieldId: 'salary', fieldLabel: 'Salary & Compensation', allowed: true },
        { fieldId: 'balance', fieldLabel: 'Treasury Wallet Balance', allowed: true }
      ]
    },
    {
      id: 'r_tech',
      name: 'Repair Technician',
      description: 'Manages repair jobs, inventory items, and customer hardware diagnostics.',
      actions: ['read', 'create', 'update'],
      fieldPermissions: [
        { fieldId: 'salary', fieldLabel: 'Salary & Compensation', allowed: false },
        { fieldId: 'balance', fieldLabel: 'Treasury Wallet Balance', allowed: false }
      ]
    }
  ];

  const handleImpersonate = (identity: IdentityRecord) => {
    setImpersonatingUser(identity);
    toast(`Impersonation active: Viewing platform as ${identity.name}`, { type: 'info' });
  };

  const handleTerminateSession = (identityId: string, sessionId: string) => {
    setIdentities(prev =>
      prev.map(i => i.id === identityId ? { ...i, sessions: i.sessions.filter(s => s.id !== sessionId) } : i)
    );
  };

  return (
    <div className="space-y-6 w-full font-sans">
      {/* User Impersonation Top Banner */}
      {impersonatingUser && (
        <div className="bg-amber-500 text-black px-5 py-2.5 rounded-xl font-semibold text-xs flex items-center justify-between shadow-2xl animate-in slide-in-from-top-4 duration-200">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4" />
            <span>IMPERSONATION MODE ACTIVE: Viewing workspace as <strong>{impersonatingUser.name} ({impersonatingUser.email})</strong></span>
          </div>
          <button
            onClick={() => { setImpersonatingUser(null); toast('Exited impersonation mode', { type: 'success' }); }}
            className="bg-black text-white hover:bg-black/80 px-3 py-1 rounded text-[11px] font-mono transition-colors"
          >
            Exit Impersonation ✕
          </button>
        </div>
      )}

      {/* Main IOAC Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#262626]">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Shield className="w-6 h-6 text-amber-400" /> Tool #4: Identity, Organizations & Access Control (IOAC)
          </h1>
          <p className="text-xs text-[#a6a6a6] mt-1">
            Universal Identity Engine (Users, API Keys, AI Agents), Multi-Tenant Workspaces, Dynamic Roles, Field-Level Masking, IF-THEN Policies, and ⭐ Live Permission Sandbox.
          </p>
        </div>
      </div>

      {/* 5 Component Tab Navigation */}
      <div className="flex items-center gap-1.5 border-b border-[#262626] pb-3 overflow-x-auto hide-scrollbar text-xs font-semibold">
        {[
          { id: 'identities', label: '1. Identity Directory & Sessions', icon: Users },
          { id: 'org_workspaces', label: '2. Orgs, Workspaces & Teams', icon: Building2 },
          { id: 'roles', label: '3. Dynamic Roles & Field Masking', icon: Shield },
          { id: 'policies', label: '4. IF-THEN Policy Engine', icon: Sliders },
          { id: 'simulator', label: '5. ⭐ Live Permission Simulator', icon: Eye },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
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
      {activeTab === 'identities' && (
        <IOACIdentityManager
          identities={identities}
          onImpersonate={handleImpersonate}
          onTerminateSession={handleTerminateSession}
        />
      )}

      {activeTab === 'org_workspaces' && <IOACOrganizationWorkspace />}

      {activeTab === 'roles' && <IOACRolePermissionMatrix />}

      {activeTab === 'policies' && <IOACPolicyEngine />}

      {activeTab === 'simulator' && <IOACPermissionSimulator roles={roles} />}
    </div>
  );
}
