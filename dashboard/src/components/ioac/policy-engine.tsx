"use client";

import React, { useState } from 'react';
import { Sliders, Plus, Trash2, Check, ShieldAlert } from 'lucide-react';
import { IFPolicyRule } from './types';
import { toast } from '@/components/ui/toast';

export function IOACPolicyEngine() {
  const [policies, setPolicies] = useState<IFPolicyRule[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('litetrack_token');
        const headers = { Authorization: `Bearer ${token}` };
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://litetrack-api-916484331446.us-central1.run.app';
        
        const res = await fetch(`${apiUrl}/api/ioac/policies`, { headers });
        const data = await res.json();
        
        if (data.policies) {
          const parsed = data.policies.map((p: any) => {
            const cond = p.conditions_json ? JSON.parse(p.conditions_json) : {};
            const act = p.actions_json ? JSON.parse(p.actions_json) : {};
            return {
              id: p.id,
              name: p.name,
              conditionField: cond.field || 'Amount',
              operator: cond.operator || '>',
              conditionValue: cond.value || '0',
              actionEffect: act.effect || 'require_approval',
              isActive: p.status === 'active'
            };
          });
          setPolicies(parsed);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const togglePolicy = async (id: string) => {
    const policy = policies.find(p => p.id === id);
    if (!policy) return;
    const newStatus = policy.isActive ? 'disabled' : 'active';
    
    // optimistic update
    setPolicies(prev => prev.map(p => p.id === id ? { ...p, isActive: !p.isActive } : p));
    
    try {
      const token = localStorage.getItem('litetrack_token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://litetrack-api-916484331446.us-central1.run.app';
      await fetch(`${apiUrl}/api/ioac/policies/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus })
      });
      toast('Policy status toggled', { type: 'info' });
    } catch(e) {
      toast('Failed to toggle policy', { type: 'error' });
    }
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
          onClick={async () => {
            const name = prompt("Enter Policy Name");
            if (!name) return;
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://litetrack-api-916484331446.us-central1.run.app';
            const token = localStorage.getItem('litetrack_token');
            try {
              await fetch(`${apiUrl}/api/ioac/policies`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({
                  id: 'pol_' + Math.floor(Math.random() * 1000),
                  name,
                  description: 'Custom Policy Rule',
                  conditions_json: JSON.stringify({ field: 'Amount', operator: '>', value: '10000' }),
                  actions_json: JSON.stringify({ effect: 'require_approval' }),
                  status: 'active'
                })
              });
              toast('Created new policy rule. Refresh to view.', { type: 'success' });
            } catch(e) {
              toast('Failed to create policy', { type: 'error' });
            }
          }}
          className="px-3.5 py-1.5 bg-[#2266ec] hover:bg-[#1d57cc] text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 shadow"
        >
          <Plus className="w-3.5 h-3.5" /> Add Policy Rule
        </button>
      </div>

      <div className="space-y-3">
        {loading && <div className="text-[#a6a6a6] text-xs">Loading policies...</div>}
        {!loading && policies.length === 0 && <div className="text-[#a6a6a6] text-xs">No conditional policies found.</div>}
        {!loading && policies.map(p => (
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
