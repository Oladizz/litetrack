"use client";

import React, { useState } from 'react';
import { Sliders, Plus, Trash2, Check, ShieldAlert } from 'lucide-react';
import { IFPolicyRule } from './types';
import { toast } from '@/components/ui/toast';

export function IOACPolicyEngine() {
  const [policies, setPolicies] = useState<IFPolicyRule[]>([
    {
      id: 'pol_1',
      name: 'High-Value Manager Approval Policy',
      conditionField: 'Amount',
      operator: '>',
      conditionValue: '10000',
      actionEffect: 'require_approval',
      isActive: true
    },
    {
      id: 'pol_2',
      name: 'Geofence Withdrawal Guard',
      conditionField: 'Country',
      operator: '!=',
      conditionValue: 'Nigeria',
      actionEffect: 'disable_withdrawal',
      isActive: true
    },
    {
      id: 'pol_3',
      name: 'Student Billing Masking Policy',
      conditionField: 'Role',
      operator: '=',
      conditionValue: 'Student',
      actionEffect: 'hide_billing',
      isActive: true
    }
  ]);

  const togglePolicy = (id: string) => {
    setPolicies(prev => prev.map(p => p.id === id ? { ...p, isActive: !p.isActive } : p));
    toast('Policy status toggled', { type: 'info' });
  };

  return (
    <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-5 shadow-xl space-y-4 font-sans">
      <div className="flex items-center justify-between border-b border-[#262626] pb-3">
        <div>
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-red-400" /> Expressive Policy Rules Engine (IF-THEN Rules)
          </h3>
          <p className="text-xs text-[#a6a6a6] mt-0.5">Automated conditional security policies beyond static role permissions.</p>
        </div>
        <button
          onClick={() => toast('Created new policy rule', { type: 'success' })}
          className="px-3.5 py-1.5 bg-[#2266ec] hover:bg-[#1d57cc] text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 shadow"
        >
          <Plus className="w-3.5 h-3.5" /> Add Policy Rule
        </button>
      </div>

      <div className="space-y-3">
        {policies.map(p => (
          <div key={p.id} className="bg-[#121212] p-4 rounded-xl border border-[#262626] flex items-center justify-between gap-4 text-xs font-mono">
            <div className="space-y-1">
              <div className="font-bold text-white flex items-center gap-2">
                <span>{p.name}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${p.isActive ? 'bg-green-500/20 text-green-400' : 'bg-[#262626] text-[#656565]'}`}>
                  {p.isActive ? 'ACTIVE' : 'DISABLED'}
                </span>
              </div>
              <div className="text-[#a6a6a6]">
                <span className="text-[#2266ec]">IF</span> ({p.conditionField} {p.operator} "{p.conditionValue}") <span className="text-amber-400">THEN</span> <strong className="text-red-400 uppercase">[{p.actionEffect}]</strong>
              </div>
            </div>

            <button
              onClick={() => togglePolicy(p.id)}
              className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors ${p.isActive ? 'bg-[#2266ec]' : 'bg-[#333]'}`}
            >
              <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${p.isActive ? 'translate-x-5' : 'translate-x-0'}`}></div>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
