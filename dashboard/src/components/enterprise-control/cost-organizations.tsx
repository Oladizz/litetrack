"use client";

import React from 'react';
import {
  DollarSign, TrendingUp, TrendingDown, Building2, Users, Bot,
  Package, Gauge, CreditCard
} from 'lucide-react';
import { CostBreakdown, Organization } from './types';

interface Props {
  costs: CostBreakdown[];
  organizations: Organization[];
}

const HEALTH_COLORS: Record<string, { text: string; bg: string }> = {
  healthy: { text: 'text-green-400', bg: 'bg-green-500/20' },
  degraded: { text: 'text-amber-400', bg: 'bg-amber-500/20' },
  critical: { text: 'text-red-400', bg: 'bg-red-500/20' },
};

export function CostOrganizations({ costs, organizations }: Props) {
  const totalCost = costs.reduce((s, c) => s + c.costUsd, 0);
  const totalBudget = costs.reduce((s, c) => s + c.budgetUsd, 0);
  const utilizationPct = Math.round((totalCost / totalBudget) * 100);

  return (
    <div className="space-y-6 font-sans">
      {/* Cost Intelligence */}
      <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#262626] pb-3">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-green-400" /> Cost Intelligence
          </h3>
          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="text-[#a6a6a6]">Total: <span className="text-white font-bold">${totalCost.toFixed(2)}</span></span>
            <span className="text-[#656565]">Budget: ${totalBudget.toFixed(2)}</span>
            <span className={`font-bold ${utilizationPct > 85 ? 'text-red-400' : utilizationPct > 60 ? 'text-amber-400' : 'text-green-400'}`}>
              {utilizationPct}% utilized
            </span>
          </div>
        </div>

        {/* Overall Budget Bar */}
        <div className="bg-[#121212] border border-[#262626] rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#a6a6a6]">Monthly Budget Utilization</span>
            <span className="font-mono font-bold text-white">${totalCost.toFixed(2)} / ${totalBudget.toFixed(2)}</span>
          </div>
          <div className="w-full h-3 bg-[#262626] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${utilizationPct > 85 ? 'bg-red-400' : utilizationPct > 60 ? 'bg-amber-400' : 'bg-green-400'}`}
              style={{ width: `${Math.min(utilizationPct, 100)}%` }}
            />
          </div>
          <div className="text-[9px] text-[#656565] font-mono">
            Forecast: ~${(totalCost * 30 / new Date().getDate()).toFixed(2)}/month at current rate
          </div>
        </div>

        {/* Cost Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {costs.map(c => {
            const pct = Math.round((c.costUsd / c.budgetUsd) * 100);
            return (
              <div key={c.category} className="bg-[#121212] border border-[#262626] rounded-xl p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{c.icon}</span>
                    <span className="text-xs font-bold text-white">{c.category}</span>
                  </div>
                  <div className={`text-[10px] font-mono flex items-center gap-1 ${c.trend > 0 ? 'text-red-400' : 'text-green-400'}`}>
                    {c.trend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {c.trend > 0 ? '+' : ''}{c.trend}%
                  </div>
                </div>

                <div className="flex items-end justify-between">
                  <span className="text-lg font-bold text-white font-mono">${c.costUsd.toFixed(2)}</span>
                  <span className="text-[9px] text-[#656565] font-mono">/ ${c.budgetUsd.toFixed(2)}</span>
                </div>

                <div className="w-full h-1.5 bg-[#262626] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${pct > 85 ? 'bg-red-400' : pct > 60 ? 'bg-amber-400' : 'bg-green-400'}`}
                    style={{ width: `${Math.min(pct, 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Organization Manager */}
      <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#262626] pb-3">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#2266ec]" /> Organization Manager
          </h3>
          <span className="text-[10px] text-[#656565] font-mono">{organizations.length} organizations</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
          {organizations.map(org => {
            const hc = HEALTH_COLORS[org.health];
            return (
              <div key={org.id} className="bg-[#121212] border border-[#262626] rounded-xl p-4 space-y-3 hover:border-[#333] transition-all">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-white text-sm">{org.name}</div>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold capitalize ${hc.bg} ${hc.text}`}>{org.health}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[9px] font-mono text-[#a6a6a6]">
                  <div className="flex items-center gap-1"><Package className="w-3 h-3 text-[#656565]" /> {org.appCount} Apps</div>
                  <div className="flex items-center gap-1"><Users className="w-3 h-3 text-[#656565]" /> {org.userCount} Users</div>
                  <div className="flex items-center gap-1"><Bot className="w-3 h-3 text-[#656565]" /> {org.aiAgentCount} AI</div>
                  <div className="flex items-center gap-1"><CreditCard className="w-3 h-3 text-[#656565]" /> {org.plan}</div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-[#262626] text-[10px]">
                  <span className="text-[#656565]">MRR</span>
                  <span className="text-green-400 font-mono font-bold">${org.mrr.toLocaleString()}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
