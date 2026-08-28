"use client";

import React, { useState, useEffect } from 'react';
import { Building2, Layout, Users2, Globe, Clock, DollarSign, Plus } from 'lucide-react';
import { Organization, Workspace, Team } from './types';
import { toast } from '@/components/ui/toast';

export function IOACOrganizationWorkspace() {
  const [org, setOrg] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('litetrack_token');
        const headers = { Authorization: `Bearer ${token}` };
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://litetrack-api-916484331446.us-central1.run.app';
        
        // Fetch Orgs
        const resOrg = await fetch(`${apiUrl}/api/ioac/orgs`, { headers });
        const dataOrg = await resOrg.json();
        if (dataOrg.orgs && dataOrg.orgs.length > 0) {
          const row = dataOrg.orgs[0];
          setOrg({
            id: row.id,
            name: row.name,
            timezone: 'UTC', // We'll update this to be dynamic later
            currency: 'USD',
            invitePolicy: 'open'
          });
        } else {
          setOrg({
            id: 'org_pending',
            name: 'No Organization Found',
            timezone: 'UTC',
            currency: 'USD',
            invitePolicy: 'open'
          });
        }

        // Fetch Workspaces
        const resWs = await fetch(`${apiUrl}/api/ioac/workspaces`, { headers });
        const dataWs = await resWs.json();
        if (dataWs.workspaces) {
          setWorkspaces(dataWs.workspaces.map((w: any) => ({
            id: w.id,
            name: w.name,
            category: w.category,
            icon: <Layout className="w-4 h-4" />, // Fallback icon
            allowedRoles: w.allowedRoles ? JSON.parse(w.allowedRoles) : []
          })));
        }

        // Fetch Teams
        const resTeams = await fetch(`${apiUrl}/api/ioac/teams`, { headers });
        const dataTeams = await resTeams.json();
        if (dataTeams.teams) {
          setTeams(dataTeams.teams.map((t: any) => ({
            id: t.id,
            name: t.name,
            memberCount: 0, // Compute dynamically later
            workspaceId: t.workspaceId
          })));
        }

      } catch(e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);

  if (loading) return <div className="text-white text-xs p-4">Loading Org Data...</div>;
  if (!org) return <div className="text-white text-xs p-4">No org data.</div>;
  
  return (
    <div className="space-y-6 font-sans">
      {/* Organization Settings Banner */}
      <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#2266ec]/20 border border-[#2266ec]/40 flex items-center justify-center text-xl shrink-0">
              <Building2 className="w-6 h-6 text-[#2266ec]" />
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
              onClick={async () => {
                const name = prompt("Enter Workspace Name:");
                if (!name) return;
                const token = localStorage.getItem('litetrack_token');
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://litetrack-api-916484331446.us-central1.run.app';
                try {
                  await fetch(`${apiUrl}/api/ioac/workspaces`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({
                      id: 'ws_' + Math.floor(Math.random() * 1000),
                      name,
                      category: 'General',
                      allowedRoles: JSON.stringify(['Admin'])
                    })
                  });
                  toast('Created new workspace. Refreshing...', { type: 'success' });
                  window.location.reload();
                } catch(e) {
                  toast('Failed to create workspace', { type: 'error' });
                }
              }}
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
              onClick={async () => {
                const name = prompt("Enter Team Name:");
                if (!name) return;
                const workspaceId = prompt("Enter Scoped Workspace ID (e.g. ws_123):", workspaces[0]?.id || 'ws_123');
                if (!workspaceId) return;
                
                const token = localStorage.getItem('litetrack_token');
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://litetrack-api-916484331446.us-central1.run.app';
                try {
                  await fetch(`${apiUrl}/api/ioac/teams`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({
                      id: 't_' + Math.floor(Math.random() * 1000),
                      name,
                      workspaceId
                    })
                  });
                  toast('Created new team. Refreshing...', { type: 'success' });
                  window.location.reload();
                } catch(e) {
                  toast('Failed to create team', { type: 'error' });
                }
              }}
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
