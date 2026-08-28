"use client";

import React from 'react';
import { AlertTriangle, Activity, ShieldAlert, Zap, TrendingUp } from 'lucide-react';
import { toast } from '@/components/ui/toast';

export function IOACAccessRisk() {
  return (
    <div className="space-y-6 font-sans">
      <div className="flex items-center justify-between border-b border-[#262626] pb-3">
        <div>
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" /> AI Risk & Intelligence Dashboard
          </h3>
          <p className="text-xs text-[#a6a6a6] mt-0.5">Automated detection of overly-permissive roles, ghost accounts, and anomalous behavior.</p>
        </div>
        <button 
          onClick={() => toast('Running deep security scan...', { type: 'info' })}
          className="px-4 py-2 bg-[#2266ec] text-white text-xs font-semibold rounded-lg flex items-center gap-2 shadow"
        >
          <Activity className="w-3.5 h-3.5" /> Run Security Scan
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Metric 1 */}
        <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-4 shadow-xl opacity-50">
          <div className="flex items-center gap-2 text-[#a6a6a6] mb-2">
            <ShieldAlert className="w-4 h-4" />
            <span className="font-bold text-xs uppercase">Over-Permissioned</span>
          </div>
          <div className="text-3xl font-black text-white">0</div>
          <div className="text-[10px] text-[#a6a6a6] mt-1">No stale permissions detected.</div>
        </div>

        {/* Metric 2 */}
        <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-4 shadow-xl opacity-50">
          <div className="flex items-center gap-2 text-[#a6a6a6] mb-2">
            <AlertTriangle className="w-4 h-4" />
            <span className="font-bold text-xs uppercase">Ghost Accounts</span>
          </div>
          <div className="text-3xl font-black text-white">0</div>
          <div className="text-[10px] text-[#a6a6a6] mt-1">No inactive accounts detected.</div>
        </div>

        {/* Metric 3 */}
        <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-4 shadow-xl opacity-50">
          <div className="flex items-center gap-2 text-[#a6a6a6] mb-2">
            <TrendingUp className="w-4 h-4" />
            <span className="font-bold text-xs uppercase">Anomalous Geo-Logins</span>
          </div>
          <div className="text-3xl font-black text-white">0</div>
          <div className="text-[10px] text-[#a6a6a6] mt-1">No high-risk IP logins detected.</div>
        </div>
      </div>

      <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-5 shadow-xl space-y-4">
        <h4 className="font-bold text-white text-sm">Recommended Remediation Actions</h4>
        <div className="space-y-3">
          <div className="text-[#a6a6a6] text-xs py-5 text-center">
            Your environment is secure. No AI remediations required.
          </div>
        </div>
      </div>

    </div>
  );
}
