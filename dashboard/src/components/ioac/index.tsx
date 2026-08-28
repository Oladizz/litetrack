"use client";

import React, { useState, useEffect } from 'react';
import { 
  Shield, Users, Building2, Sliders, Eye, UserCheck, X, Activity, Key, Bot 
} from 'lucide-react';
import { IdentityRecord, DynamicRole } from './types';
import { IOACIdentityManager } from './identity-manager';
import { IOACOrganizationWorkspace } from './organization-workspace';
import { IOACRolePermissionMatrix } from './role-permission-matrix';
import { IOACPolicyEngine } from './policy-engine';
import { IOACAgentPermissions } from './agent-permissions';
import { IOACAuthSecurity } from './auth-security';
import { IOACTemporaryAccess } from './temporary-access';
import { IOACAccessExplorer } from './access-explorer';
import { IOACAccessAudit } from './access-audit';
import { IOACAccessRisk } from './access-risk';
import { IOACPermissionSimulator } from './permission-simulator';
import { toast } from '@/components/ui/toast';

export function UniversalIOAC() {
  const [activeTab, setActiveTab] = useState<string>('identities');

  // Impersonation Banner State
  const [impersonatingUser, setImpersonatingUser] = useState<IdentityRecord | null>(null);

  const [identities, setIdentities] = useState<IdentityRecord[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('litetrack_token');
        const headers = { Authorization: `Bearer ${token}` };
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://litetrack-api-916484331446.us-central1.run.app';
        
        const res = await fetch(`${apiUrl}/api/ioac/identities`, { headers });
        const data = await res.json();
        
        if (data.identities) {
          // Map DB schema to frontend IdentityRecord shape
          const mapped = data.identities.map((row: any) => ({
            id: row.id,
            name: row.name,
            email: row.email,
            type: row.type || 'user',
            roleId: row.roleId || '',
            roleName: row.roleId || 'Standard',
            status: row.status || 'active',
            riskScore: row.riskScore || 0,
            mfaEnabled: !!row.mfaEnabled,
            created: row.created_at ? new Date(row.created_at.value).toLocaleDateString() : 'Unknown',
            sessions: []
          }));
          setIdentities(mapped);
        }
      } catch (e) {
        console.error("Failed to load identities", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const roles: DynamicRole[] = [
    {
      id: 'r_ceo',
      name: 'CEO / Executive',
      description: 'Full strategic access to analytics, financial reports, and high-level dashboards.',
      resourcePermissions: [],
      fieldPermissions: [
        { fieldId: 'salary', fieldLabel: 'Salary & Compensation', allowed: true },
        { fieldId: 'balance', fieldLabel: 'Treasury Wallet Balance', allowed: true }
      ]
    },
    {
      id: 'r_tech',
      name: 'Repair Technician',
      description: 'Manages repair jobs, inventory items, and customer hardware diagnostics.',
      resourcePermissions: [],
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
            Universal Identity Engine (Users, API Keys, AI Agents), Multi-Tenant Workspaces, Dynamic Roles, Field-Level Masking, IF-THEN Policies, and Live Permission Sandbox.
          </p>
        </div>
      </div>

      {/* 5 Component Tab Navigation */}
      <div className="flex items-center gap-1.5 border-b border-[#262626] pb-3 overflow-x-auto hide-scrollbar text-[11px] font-semibold">
        {[
          { id: 'identities', label: '1. Identity & People', icon: Users },
          { id: 'org_workspaces', label: '2. Orgs & Workspaces', icon: Building2 },
          { id: 'roles', label: '3. Roles Engine', icon: Shield },
          { id: 'matrix', label: '4. Permission Matrix', icon: Shield },
          { id: 'policies', label: '5. Conditional Access', icon: Sliders },
          { id: 'agents', label: '6. AI Agent Permissions', icon: Bot },
          { id: 'auth', label: '7. Auth & Security', icon: Key },
          { id: 'temporary', label: '8. Temporary Access', icon: Activity },
          { id: 'explorer', label: '9. Access Explorer', icon: Eye },
          { id: 'audit', label: '10. Audit & History', icon: Users },
          { id: 'risk', label: '11. Risk Intelligence', icon: Shield },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg border transition-all shrink-0 flex items-center gap-1.5 ${
                isActive
                  ? 'bg-[#2266ec] border-[#2266ec] text-white shadow-lg shadow-[#2266ec]/20'
                  : 'bg-[#1a1a1a] border-[#262626] text-[#a6a6a6] hover:text-white hover:bg-[#262626]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" /> {tab.label}
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

      {activeTab === 'roles' && (
        <div className="p-8 text-center bg-[#1a1a1a] rounded-xl border border-[#262626]">
          <Shield className="w-8 h-8 text-[#a6a6a6] mx-auto mb-3" />
          <h3 className="text-white font-bold mb-1">Roles Engine</h3>
          <p className="text-sm text-[#a6a6a6]">Create reusable roles such as Super Admin, Manager, and Viewer. (Coming soon)</p>
        </div>
      )}
      
      {activeTab === 'matrix' && <IOACRolePermissionMatrix />}

      {activeTab === 'policies' && <IOACPolicyEngine />}
      
      {activeTab === 'agents' && <IOACAgentPermissions />}
      
      {activeTab === 'auth' && <IOACAuthSecurity />}
      
      {activeTab === 'temporary' && <IOACTemporaryAccess />}
      
      {activeTab === 'explorer' && <IOACAccessExplorer />}
      
      {activeTab === 'audit' && <IOACAccessAudit />}
      
      {activeTab === 'risk' && <IOACAccessRisk />}

      {activeTab === 'simulator' && <IOACPermissionSimulator roles={roles} />}
    </div>
  );
}
