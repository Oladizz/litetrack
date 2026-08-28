"use client";

import React, { useState } from 'react';
import { Eye, Shield, Lock, CheckCircle2, AlertTriangle, X } from 'lucide-react';
import { DynamicRole } from './types';
import { toast } from '@/components/ui/toast';

interface SimulatorProps {
  roles: DynamicRole[];
}

export function IOACPermissionSimulator({ roles }: SimulatorProps) {
  const [activeSimRole, setActiveSimRole] = useState<DynamicRole>(roles[0] || {
    id: 'r_tech',
    name: 'Repair Technician',
    description: 'Tech Role',
    resourcePermissions: [],
    fieldPermissions: [
      { fieldId: 'salary', fieldLabel: 'Salary & Compensation', allowed: false },
      { fieldId: 'balance', fieldLabel: 'Treasury Wallet Balance', allowed: false }
    ]
  });

  const [isSimulating, setIsSimulating] = useState(false);

  const startSimulation = (role: DynamicRole) => {
    setActiveSimRole(role);
    setIsSimulating(true);
    toast(`Entered Permission Sandbox Mode for role: ${role.name}`, { type: 'info' });
  };

  const hasAction = (action: 'view' | 'create' | 'edit' | 'delete' | 'export') => {
    return activeSimRole.resourcePermissions?.some(p => p.actions?.[action] !== 'none') ?? false;
  };

  const isFieldAllowed = (fieldId: string) => {
    return activeSimRole.fieldPermissions?.find(f => f.fieldId === fieldId)?.allowed ?? false;
  };

  return (
    <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-5 shadow-xl space-y-4 font-sans">
      <div className="flex items-center justify-between border-b border-[#262626] pb-3">
        <div>
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <Eye className="w-4 h-4 text-[#2266ec]" /> Live Permission Simulation Sandbox
          </h3>
          <p className="text-xs text-[#a6a6a6] mt-0.5">Test and experience the UI through any role's eyes before publishing changes.</p>
        </div>
        <div className="flex gap-2">
          {roles.map(r => (
            <button
              key={r.id}
              onClick={() => startSimulation(r)}
              className="px-3 py-1.5 bg-[#121212] border border-[#262626] hover:border-[#2266ec] text-xs text-white rounded-lg transition-colors font-medium"
            >
              Simulate {r.name}
            </button>
          ))}
        </div>
      </div>

      {/* Simulation Live Sandbox Render Window */}
      {isSimulating && (
        <div className="bg-[#121212] border-2 border-[#2266ec] rounded-xl p-5 space-y-4 relative overflow-hidden animate-in fade-in duration-200">
          <div className="bg-[#2266ec] text-white px-4 py-1.5 rounded-lg text-xs font-bold flex items-center justify-between shadow-lg">
            <span><Eye className="w-4 h-4 inline-block mr-2" /> SIMULATION SANDBOX: Viewing UI as Role [{activeSimRole.name}]</span>
            <button onClick={() => setIsSimulating(false)} className="hover:underline font-mono">Exit Sandbox ✕</button>
          </div>

          {/* Simulated UI Components */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Simulated Data Record */}
            <div className="bg-[#1a1a1a] p-4 rounded-xl border border-[#262626] space-y-2">
              <div className="font-bold text-white text-sm">John Doe Profile Attributes</div>
              <div className="space-y-1.5 font-mono">
                <div className="flex justify-between">
                  <span className="text-[#656565]">Email:</span>
                  <span className="text-white font-medium">john.doe@gmail.com</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#656565]">Salary:</span>
                  {isFieldAllowed('salary') ? (
                    <span className="text-green-400 font-bold">$120,000 / yr</span>
                  ) : (
                    <span className="text-red-400 font-bold bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">•••••••• (MASKED)</span>
                  )}
                </div>
                <div className="flex justify-between">
                  <span className="text-[#656565]">Treasury Balance:</span>
                  {isFieldAllowed('balance') ? (
                    <span className="text-green-400 font-bold">$4,850,000</span>
                  ) : (
                    <span className="text-red-400 font-bold bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">•••••••• (MASKED)</span>
                  )}
                </div>
              </div>
            </div>

            {/* Simulated Action Buttons */}
            <div className="bg-[#1a1a1a] p-4 rounded-xl border border-[#262626] space-y-2">
              <div className="font-bold text-white text-sm">Action Toolbar Visibility</div>
              <div className="flex flex-wrap gap-2">
                {hasAction('create') && (
                  <button className="px-3 py-1 bg-[#2266ec] text-white text-xs font-semibold rounded">+ Create Record</button>
                )}
                {hasAction('export') && (
                  <button className="px-3 py-1 bg-[#262626] text-white text-xs font-semibold rounded">Export CSV</button>
                )}
                {hasAction('delete') ? (
                  <button className="px-3 py-1 bg-red-600 text-white text-xs font-semibold rounded">Delete Record</button>
                ) : (
                  <span className="text-[10px] text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-1 rounded">Delete Button Hidden (No Permission)</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
