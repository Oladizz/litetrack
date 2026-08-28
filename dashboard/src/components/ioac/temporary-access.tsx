"use client";

import React, { useState } from 'react';
import { Clock, ShieldAlert, Users, Plus, Timer, Trash2 } from 'lucide-react';
import { toast } from '@/components/ui/toast';

interface TempAccessGrant {
  id: string;
  user: string;
  role: string;
  resource: string;
  grantedAt: string;
  expiresAt: string;
  status: 'active' | 'expired' | 'revoked';
}

export function IOACTemporaryAccess() {
  const [grants, setGrants] = useState<TempAccessGrant[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('litetrack_token');
        const headers = { Authorization: `Bearer ${token}` };
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://litetrack-api-916484331446.us-central1.run.app';
        
        const res = await fetch(`${apiUrl}/api/ioac/temp_grants`, { headers });
        const data = await res.json();
        
        if (data.grants) {
          setGrants(data.grants.map((g: any) => ({
            id: g.id,
            user: g.user_email,
            role: g.role_name,
            resource: g.resource,
            grantedAt: g.grantedAt?.value || g.grantedAt,
            expiresAt: g.expiresAt?.value || g.expiresAt,
            status: g.status
          })));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6 font-sans">
      <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#262626] pb-3">
          <div>
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-400" /> Temporary Access Grants
            </h3>
            <p className="text-xs text-[#a6a6a6] mt-0.5">Grant access that automatically expires. Humanity survives another contractor incident.</p>
          </div>
          <button
            onClick={async () => {
              const user_email = prompt("Enter User Email (e.g. contractor@test.com):");
              if (!user_email) return;
              const role_name = prompt("Enter Role:");
              if (!role_name) return;
              const resource = prompt("Enter Resource:");
              if (!resource) return;
              const days = prompt("How many days should this last?", "7");
              
              const token = localStorage.getItem('litetrack_token');
              const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://litetrack-api-916484331446.us-central1.run.app';
              try {
                await fetch(`${apiUrl}/api/ioac/temp_grants`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                  body: JSON.stringify({
                    id: 'tag_' + Math.floor(Math.random() * 1000),
                    user_email,
                    role_name,
                    resource,
                    days: parseInt(days || '7', 10)
                  })
                });
                toast('Created new temporary grant. Refreshing...', { type: 'success' });
                window.location.reload();
              } catch(e) {
                toast('Failed to create grant', { type: 'error' });
              }
            }}
            className="px-4 py-2 bg-[#2266ec] text-white text-xs font-semibold rounded-lg flex items-center gap-2 shadow"
          >
            <Plus className="w-3.5 h-3.5" /> New Time-Bound Grant
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#121212] border-b border-[#262626] text-[#a6a6a6]">
              <tr>
                <th className="px-4 py-3 font-semibold">Identity</th>
                <th className="px-4 py-3 font-semibold">Role / Resource</th>
                <th className="px-4 py-3 font-semibold">Granted On</th>
                <th className="px-4 py-3 font-semibold">Expires In</th>
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262626]">
              {grants.map(grant => (
                <tr key={grant.id} className="hover:bg-[#121212]/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-white flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#656565]" />
                    {grant.user}
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-white font-bold">{grant.role}</div>
                    <div className="text-[#a6a6a6] text-[10px] mt-0.5">{grant.resource}</div>
                  </td>
                  <td className="px-4 py-3 text-[#a6a6a6]">
                    {new Date(grant.grantedAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    {grant.status === 'active' ? (
                      <span className="flex items-center gap-1.5 text-amber-400 bg-amber-500/10 px-2 py-1 rounded w-max border border-amber-500/20 font-bold">
                        <Timer className="w-3.5 h-3.5" /> 7 Days Left
                      </span>
                    ) : (
                      <span className="text-[#656565] font-bold">EXPIRED</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {grant.status === 'active' ? (
                      <button 
                        onClick={async () => {
                          const token = localStorage.getItem('litetrack_token');
                          const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://litetrack-api-916484331446.us-central1.run.app';
                          try {
                            await fetch(`${apiUrl}/api/ioac/temp_grants/${grant.id}/revoke`, {
                              method: 'PUT',
                              headers: { 'Authorization': `Bearer ${token}` }
                            });
                            toast('Access Revoked Early', { type: 'info' });
                            window.location.reload();
                          } catch(e) {
                            toast('Failed to revoke', { type: 'error' });
                          }
                        }}
                        className="text-red-400 hover:underline font-semibold"
                      >
                        Revoke Now
                      </button>
                    ) : (
                      <button className="text-[#a6a6a6] hover:text-white transition-colors">
                        <Trash2 className="w-4 h-4 ml-auto" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
