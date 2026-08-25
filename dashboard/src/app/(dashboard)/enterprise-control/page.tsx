"use client";

import React, { useState, useEffect } from 'react';
import { Globe, Activity, Server, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useWorkspace } from '@/components/ui/workspace-context';

export default function GlobalOverviewPage() {
  const router = useRouter();
  const [sites, setSites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { setProject } = useWorkspace();

  useEffect(() => {
    const token = localStorage.getItem('litetrack_token');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://litetrack-api-916484331446.us-central1.run.app';

    if (!token) {
      router.push('/login');
      return;
    }

    fetch(`${apiUrl}/api/sites`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => {
        if (data && data.sites) setSites(data.sites);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [router]);

  return (
    <div className="p-8 max-w-[1200px] mx-auto space-y-6 font-sans">
      <div className="pb-4 border-b border-[#262626]">
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <Globe className="w-6 h-6 text-[#2266ec]" /> Global Platform Overview
        </h1>
        <p className="text-xs text-[#a6a6a6] mt-1">
          Master control panel. See all your connected applications, global tracking status, and jump straight to their workspaces.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#1a1a1a] p-4 rounded-xl border border-[#262626]">
          <div className="text-[11px] text-[#a6a6a6] font-medium uppercase tracking-wider mb-2">Total Sites</div>
          <div className="text-3xl font-bold text-white">{sites.length}</div>
        </div>
        <div className="bg-[#1a1a1a] p-4 rounded-xl border border-[#262626]">
          <div className="text-[11px] text-[#a6a6a6] font-medium uppercase tracking-wider mb-2">Platform Status</div>
          <div className="text-xl font-bold text-green-400 flex items-center gap-2">
            <Activity className="w-5 h-5" /> All Systems Operational
          </div>
        </div>
        <div className="bg-[#1a1a1a] p-4 rounded-xl border border-[#262626]">
          <div className="text-[11px] text-[#a6a6a6] font-medium uppercase tracking-wider mb-2">Ingestion Engine</div>
          <div className="text-xl font-bold text-white flex items-center gap-2">
            <Server className="w-5 h-5 text-[#2266ec]" /> Online (Cloud Run)
          </div>
        </div>
        <div className="bg-[#1a1a1a] p-4 rounded-xl border border-[#262626]">
          <div className="text-[11px] text-[#a6a6a6] font-medium uppercase tracking-wider mb-2">Data Warehouse</div>
          <div className="text-xl font-bold text-white flex items-center gap-2">
            <Server className="w-5 h-5 text-purple-400" /> BigQuery Connected
          </div>
        </div>
      </div>

      <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl overflow-hidden mt-8">
        <div className="px-6 py-4 border-b border-[#262626]">
          <h2 className="text-sm font-bold text-white">Your Tracked Applications</h2>
        </div>
        <div className="divide-y divide-[#262626]">
          {loading ? (
            <div className="p-8 text-center text-[#656565] text-sm">Loading applications...</div>
          ) : sites.length === 0 ? (
            <div className="p-8 text-center text-[#656565] text-sm">No sites added yet. Go to Settings to add one.</div>
          ) : (
            sites.map(site => (
              <div key={site.site_id} className="p-4 flex items-center justify-between hover:bg-[#262626]/30 transition-colors">
                <div>
                  <div className="text-sm font-bold text-white">{site.domain}</div>
                  <div className="text-xs text-[#656565] font-mono mt-0.5">ID: {site.site_id}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded bg-[#2266ec]/10 text-[#2266ec] text-[10px] font-bold uppercase tracking-wider border border-[#2266ec]/20">
                    {site.template || 'SaaS'} Mode
                  </span>
                  <button
                    onClick={() => {
                      setProject(site.site_id, site.domain);
                      router.push('/');
                    }}
                    className="px-4 py-1.5 bg-[#262626] hover:bg-[#333] text-white text-xs font-semibold rounded transition-colors"
                  >
                    Open Workspace
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
