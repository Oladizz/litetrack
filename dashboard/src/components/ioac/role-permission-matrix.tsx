"use client";

import React, { useState } from 'react';
import { Shield, Plus, Check, Eye, Lock, Edit2, Trash2 } from 'lucide-react';
import { DynamicRole, FieldPermission } from './types';
import { toast } from '@/components/ui/toast';

export function IOACRolePermissionMatrix() {
  const [roles, setRoles] = useState<DynamicRole[]>([]);
  const [selectedRole, setSelectedRole] = useState<DynamicRole | null>(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('litetrack_token');
        const headers = { Authorization: `Bearer ${token}` };
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://litetrack-api-916484331446.us-central1.run.app';
        
        const res = await fetch(`${apiUrl}/api/ioac/roles`, { headers });
        const data = await res.json();
        
        if (data.roles && data.roles.length > 0) {
          const parsedRoles = data.roles.map((r: any) => ({
            id: r.id,
            name: r.name,
            description: r.description,
            resourcePermissions: r.matrix_json ? JSON.parse(r.matrix_json).resourcePermissions || [] : [],
            fieldPermissions: r.matrix_json ? JSON.parse(r.matrix_json).fieldPermissions || [] : []
          }));
          setRoles(parsedRoles);
          setSelectedRole(parsedRoles[0]);
        }
      } catch (e) {
        console.error("Failed to load roles", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);



  if (loading) return <div className="text-white text-xs p-4">Loading roles...</div>;
  if (!selectedRole) return (
    <div className="text-white text-xs p-4 flex flex-col items-start gap-4">
      <div>No roles found.</div>
      <button 
        onClick={() => {
          const name = prompt("Enter Role Name");
          if (!name) return;
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://litetrack-api-916484331446.us-central1.run.app';
          const token = localStorage.getItem('litetrack_token');
          fetch(`${apiUrl}/api/ioac/roles`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({
              id: 'r_' + Math.floor(Math.random() * 1000),
              name,
              description: 'Custom Role',
              matrix_json: JSON.stringify({ resourcePermissions: [], fieldPermissions: [] })
            })
          }).then(() => {
            window.location.reload();
          });
        }}
        className="px-4 py-1.5 bg-[#2266ec] text-white text-xs font-semibold rounded-lg"
      >
        + Create First Role
      </button>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
      {/* Dynamic Roles List */}
      <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between border-b border-[#262626] pb-3">
          <h4 className="font-bold text-white text-sm flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-400" /> Dynamic Roles ({roles.length})
          </h4>
          <button
            onClick={() => {
              const name = prompt("Enter Role Name");
              if (!name) return;
              const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://litetrack-api-916484331446.us-central1.run.app';
              const token = localStorage.getItem('litetrack_token');
              fetch(`${apiUrl}/api/ioac/roles`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({
                  id: 'r_' + Math.floor(Math.random() * 1000),
                  name,
                  description: 'Custom Role',
                  matrix_json: JSON.stringify({ resourcePermissions: [], fieldPermissions: [] })
                })
              }).then(() => {
                toast('Created new dynamic role. Refresh to view.', { type: 'success' });
              });
            }}
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
            onClick={async () => {
              const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://litetrack-api-916484331446.us-central1.run.app';
              const token = localStorage.getItem('litetrack_token');
              const matrix_json = JSON.stringify({
                resourcePermissions: selectedRole.resourcePermissions,
                fieldPermissions: selectedRole.fieldPermissions
              });
              await fetch(`${apiUrl}/api/ioac/roles/${selectedRole.id}/matrix`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ matrix_json })
              });
              toast(`Saved permissions for ${selectedRole.name}`, { type: 'success' });
            }}
            className="px-4 py-1.5 bg-[#2266ec] hover:bg-[#1d57cc] text-white text-xs font-semibold rounded-lg transition-colors shadow"
          >
            Save Role Matrix
          </button>
        </div>

        {/* Resource -> Action -> Scope Matrix */}
        <div className="space-y-4">
          <label className="text-xs font-bold text-[#656565] uppercase tracking-wider block">Resource Permissions Matrix</label>
          <div className="border border-[#262626] rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#121212] border-b border-[#262626] text-[#a6a6a6]">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Resource</th>
                    <th className="px-4 py-3 font-semibold text-center">View</th>
                    <th className="px-4 py-3 font-semibold text-center">Create</th>
                    <th className="px-4 py-3 font-semibold text-center">Edit</th>
                    <th className="px-4 py-3 font-semibold text-center">Delete</th>
                    <th className="px-4 py-3 font-semibold text-center">Export</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#262626]">
                  {['Customers', 'Invoices', 'Analytics', 'Settings', 'Projects', 'Users', 'Roles'].map(resource => (
                    <tr key={resource} className="hover:bg-[#121212]/50 transition-colors">
                      <td className="px-4 py-3 font-medium text-white">{resource}</td>
                      {(['view', 'create', 'edit', 'delete', 'export'] as const).map(action => {
                        const perm = selectedRole.resourcePermissions?.find(r => r.resource === resource);
                        const currentScope = perm?.actions?.[action] || 'none';
                        return (
                          <td key={action} className="px-2 py-2 text-center">
                            <select
                              value={currentScope}
                              onChange={(e) => {
                                const newScope = e.target.value as any;
                                const existing = [...(selectedRole.resourcePermissions || [])];
                                const idx = existing.findIndex(r => r.resource === resource);
                                if (idx >= 0) {
                                  existing[idx] = {
                                    ...existing[idx],
                                    actions: { ...existing[idx].actions, [action]: newScope }
                                  };
                                } else {
                                  existing.push({
                                    resource,
                                    actions: { view: 'none', create: 'none', edit: 'none', delete: 'none', export: 'none', [action]: newScope }
                                  });
                                }
                                const updatedRole = { ...selectedRole, resourcePermissions: existing };
                                setSelectedRole(updatedRole);
                                setRoles(prev => prev.map(r => r.id === updatedRole.id ? updatedRole : r));
                              }}
                              className={`bg-[#1a1a1a] border border-[#333] rounded px-2 py-1 text-[10px] font-mono outline-none focus:border-[#2266ec] transition-colors w-full max-w-[110px] ${currentScope !== 'none' ? 'text-green-400 border-green-500/30 bg-green-500/10' : 'text-[#656565]'}`}
                            >
                              <option value="none">✕ None</option>
                              <option value="all_data">✓ All Data</option>
                              <option value="organization">✓ Organization</option>
                              <option value="department">✓ Department</option>
                              <option value="team">✓ Team</option>
                              <option value="assigned">✓ Assigned</option>
                              <option value="own">✓ Own Records</option>
                            </select>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 2. Field-Level Masking Rules */}
        <div className="space-y-2 border-t border-[#262626] pt-4">
          <label className="text-xs font-bold text-[#656565] uppercase tracking-wider block">Field-Level Masking & Restricted Attributes</label>
          <div className="space-y-2">
            {(selectedRole.fieldPermissions || []).map(fp => (
              <div key={fp.fieldId} className="bg-[#121212] p-3 rounded-lg border border-[#262626] flex items-center justify-between text-xs">
                <span className="text-white font-medium">{fp.fieldLabel} ({fp.fieldId})</span>
                <button
                  type="button"
                  onClick={() => {
                    const updatedFields = (selectedRole.fieldPermissions || []).map(f => 
                      f.fieldId === fp.fieldId ? { ...f, allowed: !f.allowed } : f
                    );
                    const updatedRole = { ...selectedRole, fieldPermissions: updatedFields };
                    setSelectedRole(updatedRole);
                    setRoles(prev => prev.map(r => r.id === updatedRole.id ? updatedRole : r));
                  }}
                  className={`px-3 py-1 rounded font-mono text-[11px] font-bold transition-colors ${
                    fp.allowed ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}
                >
                  {fp.allowed ? 'VISIBLE' : 'MASKED'}
                </button>
              </div>
            ))}
            {(!selectedRole.fieldPermissions || selectedRole.fieldPermissions.length === 0) && (
              <div className="text-xs text-[#656565] py-2">No field masking rules configured for this role.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
