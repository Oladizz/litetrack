"use client";

import React, { useState } from 'react';
import { Building2, Layout, Users2, Globe, Clock, DollarSign, Plus } from 'lucide-react';
import { Organization, Workspace, Team } from './types';
import { toast } from '@/components/ui/toast';

export function IOACOrganizationWorkspace() {
  const [org, setOrg] = useState<Organization>({
    id: 'org_oladizz',
    name: 'OLADIZZ ENTERPRISE',
    timezone: 'UTC+1 (Lagos / West Africa)',
    currency: 'USD ($)',
    invitePolicy: 'open'
  });

  const [workspaces, setWorkspaces] = useState<Workspace[]>([
    { id: 'ws_analytics', name: 'Analytics Suite', category: 'Analytics', icon: '📊', allowedRoles: ['Admin', 'Analyst'] },
    { id: 'ws_admin', name: 'Admin OS Console', category: 'Admin', icon: '⚡', allowedRoles: ['Super Admin', 'Admin'] },
    { id: 'ws_dev', name: 'Developer Hub', category: 'Developer', icon: '💻', allowedRoles: ['Developer', 'Engineer'] },
    { id: 'ws_support', name: 'Support & Tickets', category: 'Support', icon: '🎧', allowedRoles: ['Support Lead', 'Agent'] },
    { id: 'ws_finance', name: 'Finance & Revenue', category: 'Finance', icon: '💰', allowedRoles: ['Finance Manager', 'CFO'] },
  ]);

  const [teams, setTeams] = useState<Team[]>([
    { id: 't_eng', name: 'Engineering Team', memberCount: 14, workspaceId: 'ws_dev' },
    { id: 't_support', name: 'Support & Success', memberCount: 8, workspaceId: 'ws_support' },
    { id: 't_sales', name: 'Global Sales & Deals', memberCount: 12, workspaceId: 'ws_analytics' },
    { id: 't_fin', name: 'Treasury & Accounting', memberCount: 5, workspaceId: 'ws_finance' },
  ]);

  return (
    <div className="space-y-6 font-sans">
      {/* Organization Settings Banner */}
      <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#2266ec]/20 border border-[#2266ec]/40 flex items-center justify-center text-xl shrink-0">
              🏢
            </div>
            <div>
              <h3 className="font-bold text-white text-base">{org.name}</h3>
              <span className="text-xs text-[#a6a6a6]">Multi-Tenant Parent Organization Scoping</span>
            </div>
          </div>
          <button 
            onClick={() => toast('Organization settings saved', { type: 'success' })}
            className="px-4 py-1.5 bg-[#2266ec] hover:bg-[#1d57cc] text-white text-xs font-semibold rounded-lg transition-colors shadow"
          >
            Save Org Settings
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="bg-[#121212] p-3 rounded-lg border border-[#262626] flex items-center justify-between">
            <span className="text-[#656565] font-mono flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-[#2266ec]" /> Timezone:</span>
            <span className="text-white font-semibold">{org.timezone}</span>
          </div>
          <div className="bg-[#121212] p-3 rounded-lg border border-[#262626] flex items-center justify-between">
            <span className="text-[#656565] font-mono flex items-center gap-1.5"><DollarSign className="w-3.5 h-3.5 text-green-400" /> Currency:</span>
            <span className="text-white font-semibold">{org.currency}</span>
          </div>
          <div className="bg-[#121212] p-3 rounded-lg border border-[#262626] flex items-center justify-between">
            <span className="text-[#656565] font-mono flex items-center gap-1.5"><Globe className="w-3.5 h-3.5 text-amber-400" /> Invite Policy:</span>
            <span className="text-amber-400 font-semibold uppercase">{org.invitePolicy}</span>
          </div>
        </div>
      </div>

      {/* Workspaces & Teams Scoping */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Workspaces List */}
        <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-[#262626] pb-3">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <Layout className="w-4 h-4 text-[#2266ec]" /> Workspaces ({workspaces.length})
            </h4>
            <button 
              onClick={() => toast('Created new workspace', { type: 'success' })}
              className="text-xs text-[#2266ec] hover:underline font-semibold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Workspace
            </button>
          </div>

          <div className="space-y-2">
            {workspaces.map(ws => (
              <div key={ws.id} className="bg-[#121212] p-3 rounded-lg border border-[#262626] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{ws.icon}</span>
                  <div>
                    <div className="font-bold text-white">{ws.name}</div>
                    <div className="text-[10px] text-[#656565] font-mono">Category: {ws.category}</div>
                  </div>
                </div>
                <div className="flex gap-1">
                  {ws.allowedRoles.map(r => (
                    <span key={r} className="bg-[#262626] text-[#a6a6a6] text-[9px] px-1.5 py-0.5 rounded border border-[#333]">
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Teams List */}
        <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-[#262626] pb-3">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <Users2 className="w-4 h-4 text-purple-400" /> Teams & Departments ({teams.length})
            </h4>
            <button 
              onClick={() => toast('Created new team', { type: 'success' })}
              className="text-xs text-[#2266ec] hover:underline font-semibold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Team
            </button>
          </div>

          <div className="space-y-2">
            {teams.map(t => (
              <div key={t.id} className="bg-[#121212] p-3 rounded-lg border border-[#262626] flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-white">{t.name}</div>
                  <div className="text-[10px] text-[#656565] font-mono">Scoped Workspace: {t.workspaceId}</div>
                </div>
                <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs px-2.5 py-1 rounded-full font-mono font-semibold">
                  {t.memberCount} Members
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
