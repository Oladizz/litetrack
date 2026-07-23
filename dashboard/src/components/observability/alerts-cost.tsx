"use client";

import React from 'react';
import { AlertTriangle, DollarSign, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { AlertTrigger, CostItem } from './types';
import { toast } from '@/components/ui/toast';

interface AlertsCostProps {
  alerts: AlertTrigger[];
  costs: CostItem[];
}

export function AlertsAndCostCenter({ alerts, costs }: AlertsCostProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
      {/* Alert Triggers Center */}
      <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#262626] pb-3">
          <h4 className="font-bold text-white text-sm flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" /> Active Alert Triggers ({alerts.length})
          </h4>
          <span className="text-xs text-[#a6a6a6] font-mono">Real-time Thresholds</span>
        </div>

        <div className="space-y-2">
          {alerts.map(a => (
            <div key={a.id} className="bg-[#121212] p-3 rounded-lg border border-[#262626] flex items-center justify-between text-xs font-mono">
              <div>
                <div className="font-bold text-white flex items-center gap-2">
                  <span>{a.title}</span>
                  <span className="text-[9px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded font-bold uppercase">
                    {a.severity}
                  </span>
                </div>
                <div className="text-[10px] text-[#656565]">{a.message} · {a.triggeredAt}</div>
              </div>
              <button
                onClick={() => toast(`Acknowledged alert: ${a.title}`, { type: 'info' })}
                className="px-2.5 py-1 bg-[#262626] hover:bg-[#333] text-white text-[11px] rounded"
              >
                Ack
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Cost Monitor Analytics */}
      <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#262626] pb-3">
          <h4 className="font-bold text-white text-sm flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-green-400" /> Infrastructure & AI Cost Analytics
          </h4>
          <span className="text-xs text-green-400 font-mono font-bold">$142.80 Total / Month</span>
        </div>

        <div className="space-y-2">
          {costs.map(c => (
            <div key={c.category} className="bg-[#121212] p-3 rounded-lg border border-[#262626] flex items-center justify-between text-xs font-mono">
              <div>
                <div className="font-bold text-white">{c.category}</div>
                <div className="text-[10px] text-[#656565]">{c.details}</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-green-400">${c.costUsd.toFixed(2)}</div>
                <div className="text-[10px] text-[#656565]">+{c.deltaPercent}% vs last mo</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
