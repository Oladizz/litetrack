"use client";

import React, { useState } from 'react';
import { FileText, Download, Filter, Eye } from 'lucide-react';
import { toast } from '@/components/ui/toast';

interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  target: string;
  ip: string;
  status: 'SUCCESS' | 'FAILED' | 'BLOCKED';
}

export function IOACAccessAudit() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('litetrack_token');
        const headers = { Authorization: `Bearer ${token}` };
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://litetrack-api-916484331446.us-central1.run.app';
        
        const res = await fetch(`${apiUrl}/api/ioac/audit_logs`, { headers });
        const data = await res.json();
        
        if (data.logs) {
          setLogs(data.logs.map((l: any) => ({
            id: l.id,
            timestamp: l.event_timestamp?.value || l.event_timestamp,
            actor: l.actor,
            action: l.action,
            target: l.target,
            ip: l.ip,
            status: l.status
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
              <FileText className="w-5 h-5 text-indigo-400" /> Immutable Access Audit Log
            </h3>
            <p className="text-xs text-[#a6a6a6] mt-0.5">Compliance-ready historical logs of every permission change and access attempt.</p>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 bg-[#121212] border border-[#262626] text-white text-xs font-semibold rounded-lg flex items-center gap-2 hover:border-[#2266ec]">
              <Filter className="w-3.5 h-3.5" /> Filter
            </button>
            <button 
              onClick={() => toast('Exporting CSV...', { type: 'info' })}
              className="px-3 py-1.5 bg-[#121212] border border-[#262626] text-white text-xs font-semibold rounded-lg flex items-center gap-2 hover:border-[#2266ec]"
            >
              <Download className="w-3.5 h-3.5" /> Export CSV
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#121212] border-b border-[#262626] text-[#a6a6a6]">
              <tr>
                <th className="px-4 py-3 font-semibold">Timestamp</th>
                <th className="px-4 py-3 font-semibold">Actor</th>
                <th className="px-4 py-3 font-semibold">Action</th>
                <th className="px-4 py-3 font-semibold">Target / Resource</th>
                <th className="px-4 py-3 font-semibold">IP Address</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262626]">
              {logs.map(log => (
                <tr key={log.id} className="hover:bg-[#121212]/50 transition-colors">
                  <td className="px-4 py-3 text-[#a6a6a6]">{log.timestamp}</td>
                  <td className="px-4 py-3 text-white">{log.actor}</td>
                  <td className="px-4 py-3 font-bold text-[#2266ec]">{log.action}</td>
                  <td className="px-4 py-3 text-white">{log.target}</td>
                  <td className="px-4 py-3 text-[#656565]">{log.ip}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      log.status === 'SUCCESS' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                      log.status === 'BLOCKED' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                      'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {log.status}
                    </span>
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
