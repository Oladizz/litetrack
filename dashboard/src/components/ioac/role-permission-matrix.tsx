"use client";

import React, { useState } from 'react';
import { Shield, Plus, Check, Eye, Lock, Edit2, Trash2 } from 'lucide-react';
import { DynamicRole, PermissionAction, FieldPermission } from './types';
import { toast } from '@/components/ui/toast';

export function IOACRolePermissionMatrix() {
  const [roles, setRoles] = useState<DynamicRole[]>([
    {
      id: 'r_ceo',
      name: 'CEO / Executive',
      description: 'Full strategic access to analytics, financial reports, and high-level dashboards.',
      actions: ['read', 'create', 'update', 'export', 'approve', 'share', 'manage'],
      fieldPermissions: [
        { fieldId: 'salary', fieldLabel: 'Salary & Compensation', allowed: true },
        { fieldId: 'balance', fieldLabel: 'Treasury Wallet Balance', allowed: true }
      ]
    },
    {
      id: 'r_fin',
      name: 'Finance Manager',
      description: 'Manages transactions, billing, payouts, and financial reporting.',
      actions: ['read', 'create', 'update', 'export', 'approve'],
      fieldPermissions: [
        { fieldId: 'salary', fieldLabel: 'Salary & Compensation', allowed: true },
        { fieldId: 'balance', fieldLabel: 'Treasury Wallet Balance', allowed: true }
      ]
    },
    {
      id: 'r_tech',
      name: 'Repair Technician',
      description: 'Manages repair jobs, inventory items, and customer hardware diagnostics.',
      actions: ['read', 'create', 'update'],
      fieldPermissions: [
        { fieldId: 'salary', fieldLabel: 'Salary & Compensation', allowed: false },
        { fieldId: 'balance', fieldLabel: 'Treasury Wallet Balance', allowed: false }
      ]
    },
    {
      id: 'r_analyst',
      name: 'Data Analyst',
      description: 'Builds custom dashboards, executes queries, and exports reports.',
      actions: ['read', 'export', 'share'],
      fieldPermissions: [
        { fieldId: 'salary', fieldLabel: 'Salary & Compensation', allowed: false },
        { fieldId: 'balance', fieldLabel: 'Treasury Wallet Balance', allowed: true }
      ]
    }
  ]);

  const [selectedRole, setSelectedRole] = useState<DynamicRole>(roles[0]);

  const allActions: PermissionAction[] = ['read', 'create', 'update', 'delete', 'export', 'import', 'approve', 'archive', 'share', 'manage'];

  const toggleAction = (action: PermissionAction) => {
    const isAllowed = selectedRole.actions.includes(action);
    const updatedActions = isAllowed
      ? selectedRole.actions.filter(a => a !== action)
      : [...selectedRole.actions, action];

    const updatedRole = { ...selectedRole, actions: updatedActions };
    setSelectedRole(updatedRole);
    setRoles(prev => prev.map(r => r.id === updatedRole.id ? updatedRole : r));
    toast(`Updated permission: ${action.toUpperCase()}`, { type: 'info' });
  };

  const toggleFieldPermission = (fieldId: string) => {
    const updatedFields = (selectedRole.fieldPermissions || []).map(f =>
      f.fieldId === fieldId ? { ...f, allowed: !f.allowed } : f
    );
    const updatedRole = { ...selectedRole, fieldPermissions: updatedFields };
    setSelectedRole(updatedRole);
    setRoles(prev => prev.map(r => r.id === updatedRole.id ? updatedRole : r));
    toast(`Toggled field access for ${fieldId}`, { type: 'info' });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
      {/* Dynamic Roles List */}
      <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between border-b border-[#262626] pb-3">
          <h4 className="font-bold text-white text-sm flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-400" /> Dynamic Roles ({roles.length})
          </h4>
          <button
            onClick={() => toast('Created new dynamic role', { type: 'success' })}
            className="text-xs text-[#2266ec] hover:underline font-semibold flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Add Role
          </button>
        </div>

        <div className="space-y-2">
          {roles.map(r => {
            const isSelected = selectedRole.id === r.id;
            return (
              <div
                key={r.id}
                onClick={() => setSelectedRole(r)}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-[#2266ec]/20 border-[#2266ec] text-white shadow-md'
                    : 'bg-[#121212] border-[#262626] text-[#a6a6a6] hover:text-white'
                }`}
              >
                <div className="font-bold text-xs">{r.name}</div>
                <div className="text-[11px] text-[#656565] mt-1 line-clamp-2">{r.description}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Role Permission Matrix & Field Masking Studio */}
      <div className="md:col-span-2 bg-[#1a1a1a] border border-[#262626] rounded-xl p-5 shadow-xl space-y-5">
        <div className="flex items-center justify-between border-b border-[#262626] pb-3">
          <div>
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-400" /> Role Capabilities: {selectedRole.name}
            </h3>
            <p className="text-xs text-[#a6a6a6] mt-0.5">{selectedRole.description}</p>
          </div>
          <button
            onClick={() => toast(`Saved permissions for ${selectedRole.name}`, { type: 'success' })}
            className="px-4 py-1.5 bg-[#2266ec] hover:bg-[#1d57cc] text-white text-xs font-semibold rounded-lg transition-colors shadow"
          >
            Save Role Matrix
          </button>
        </div>

        {/* 1. Action Permissions Checkbox Grid */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#656565] uppercase tracking-wider block">1. Action Level Permissions</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {allActions.map(action => {
              const isAllowed = selectedRole.actions.includes(action);
              return (
                <button
                  key={action}
                  type="button"
                  onClick={() => toggleAction(action)}
                  className={`p-2.5 rounded-lg border text-xs font-semibold flex items-center justify-between transition-all ${
                    isAllowed
                      ? 'bg-green-500/10 border-green-500/40 text-green-400'
                      : 'bg-[#121212] border-[#262626] text-[#656565]'
                  }`}
                >
                  <span className="capitalize">{action}</span>
                  {isAllowed ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Lock className="w-3.5 h-3.5 text-[#656565]" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Field-Level Masking Rules */}
        <div className="space-y-2 border-t border-[#262626] pt-4">
          <label className="text-xs font-bold text-[#656565] uppercase tracking-wider block">2. Field-Level Masking & Restricted Attributes</label>
          <div className="space-y-2">
            {selectedRole.fieldPermissions?.map(fp => (
              <div key={fp.fieldId} className="bg-[#121212] p-3 rounded-lg border border-[#262626] flex items-center justify-between text-xs">
                <span className="text-white font-medium">{fp.fieldLabel} ({fp.fieldId})</span>
                <button
                  type="button"
                  onClick={() => toggleFieldPermission(fp.fieldId)}
                  className={`px-3 py-1 rounded font-mono text-[11px] font-bold transition-colors ${
                    fp.allowed ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}
                >
                  {fp.allowed ? 'VISIBLE ✅' : 'MASKED ❌'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
