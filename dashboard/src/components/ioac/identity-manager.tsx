"use client";

import React, { useState } from 'react';
import { 
  User, Users, Crown, Zap, Shield, Key, Bot, Monitor, AlertTriangle, CheckCircle, UserCheck, Lock, Trash2, Eye 
} from 'lucide-react';
import { IdentityRecord, IdentityType } from './types';
import { toast } from '@/components/ui/toast';

interface IdentityManagerProps {
  identities: IdentityRecord[];
  onImpersonate: (identity: IdentityRecord) => void;
  onTerminateSession: (identityId: string, sessionId: string) => void;
}

export function IOACIdentityManager({
  identities,
  onImpersonate,
  onTerminateSession,
}: IdentityManagerProps) {
  const [selectedType, setSelectedType] = useState<IdentityType | 'all'>('all');
  const [selectedIdentity, setSelectedIdentity] = useState<IdentityRecord | null>(null);

  const filtered = identities.filter(i => selectedType === 'all' || i.type === selectedType);

  return (
    <div className="space-y-4 font-sans">
      <div className="flex justify-between items-center border-b border-[#262626] pb-3">
        {/* Identity Type Tabs */}
      <div className="flex items-center gap-1.5 border-b border-[#262626] pb-3 overflow-x-auto hide-scrollbar text-xs">
        {[
          { id: 'all', label: 'All Identities', icon: <User className="w-4 h-4" /> },
          { id: 'user', label: 'Users & Customers', icon: <Users className="w-4 h-4" /> },
          { id: 'admin', label: 'Admins & Staff', icon: <Crown className="w-4 h-4" /> },
          { id: 'api_key', label: 'API Key Identities', icon: <Key className="w-4 h-4" /> },
          { id: 'ai_agent', label: 'AI Agent Identities', icon: <Zap className="w-4 h-4" /> },
          { id: 'bot', label: 'Service Bots', icon: <Bot className="w-4 h-4" /> },
        ].map(tab => {
          const isActive = selectedType === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedType(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg border font-medium transition-all shrink-0 flex items-center gap-1.5 ${
                isActive
                  ? 'bg-[#2266ec] border-[#2266ec] text-white shadow-md font-semibold'
                  : 'bg-[#1a1a1a] border-[#262626] text-[#a6a6a6] hover:text-white hover:bg-[#262626]'
              }`}
            >
              <span>{tab.icon}</span> {tab.label}
            </button>
          );
        })}
        </div>
        <button 
          onClick={() => {
            const name = prompt("Enter Name");
            if (!name) return;
            const email = prompt("Enter Email");
            
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://litetrack-api-916484331446.us-central1.run.app';
            const token = localStorage.getItem('litetrack_token');
            
            fetch(`${apiUrl}/api/ioac/identities`, {
              method: 'POST',
              headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                id: 'usr_' + Math.floor(Math.random() * 10000),
                name,
                email,
                type: 'user',
                roleId: 'r_standard',
                status: 'active',
                riskScore: 0,
                mfaEnabled: false
              })
            }).then(() => {
              toast('Identity Created. Please refresh to see the new identity.', { type: 'success' });
            });
          }}
          className="bg-[#2266ec] text-white px-3 py-1.5 rounded text-xs font-semibold"
        >
          + Add Identity
        </button>
      </div>

      {/* Identities Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(identity => {
          const isHighRisk = identity.riskScore > 50;
          return (
            <div key={identity.id} className="bg-[#1a1a1a] border border-[#262626] hover:border-[#404040] rounded-xl p-4 shadow-xl space-y-3 relative overflow-hidden transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#2266ec]/20 border border-[#2266ec]/40 flex items-center justify-center font-bold text-white text-sm shrink-0">
                    {identity.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
                      {identity.name}
                      <span className="text-[9px] bg-[#2266ec]/20 text-[#2266ec] px-1.5 py-0.5 rounded font-mono uppercase">
                        {identity.type}
                      </span>
                    </h4>
                    <span className="text-[11px] text-[#656565] font-mono block">{identity.email}</span>
                  </div>
                </div>

                {/* Risk Score Indicator */}
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                  isHighRisk ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-green-500/10 text-green-400 border-green-500/20'
                }`}>
                  Risk: {identity.riskScore}/100
                </span>
              </div>

              {/* Role & Session Details */}
              <div className="bg-[#121212] p-2.5 rounded-lg border border-[#262626] text-xs space-y-1.5 font-mono">
                <div className="flex justify-between">
                  <span className="text-[#656565]">Role:</span>
                  <span className="text-amber-400 font-semibold">{identity.roleName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#656565]">MFA Security:</span>
                  <span className={identity.mfaEnabled ? 'text-green-400 font-bold' : 'text-red-400'}>
                    {identity.mfaEnabled ? '2FA Enabled ✓' : '2FA Disabled ✗'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#656565]">Active Sessions:</span>
                  <span className="text-white font-bold">{identity.sessions.length} Devices</span>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => onImpersonate(identity)}
                  className="flex-1 py-1.5 bg-[#2266ec] hover:bg-[#1d57cc] text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1 shadow-md shadow-[#2266ec]/20"
                >
                  <UserCheck className="w-3.5 h-3.5" /> Impersonate
                </button>
                <button
                  onClick={() => setSelectedIdentity(identity)}
                  className="px-3 py-1.5 bg-[#262626] hover:bg-[#333] text-[#a6a6a6] hover:text-white text-xs rounded-lg transition-colors"
                >
                  Sessions ({identity.sessions.length})
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Session Inspector Drawer/Modal */}
      {selectedIdentity && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-[#1a1a1a] border border-[#333] rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#262626] pb-3">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Monitor className="w-4 h-4 text-[#2266ec]" /> Active Sessions: {selectedIdentity.name}
              </h3>
              <button onClick={() => setSelectedIdentity(null)} className="text-[#a6a6a6] hover:text-white text-sm">✕</button>
            </div>

            <div className="space-y-2">
              {selectedIdentity.sessions.map(s => (
                <div key={s.id} className="bg-[#121212] p-3 rounded-lg border border-[#262626] flex items-center justify-between text-xs font-mono">
                  <div>
                    <div className="text-white font-bold">{s.device}</div>
                    <div className="text-[10px] text-[#656565]">{s.ipLocation} · Last active {s.lastActive}</div>
                  </div>
                  <button
                    onClick={() => { onTerminateSession(selectedIdentity.id, s.id); toast(`Terminated session ${s.device}`, { type: 'info' }); }}
                    className="text-red-400 hover:text-red-300 text-[11px] font-semibold underline"
                  >
                    Terminate
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button onClick={() => setSelectedIdentity(null)} className="px-4 py-1.5 bg-[#262626] text-white text-xs rounded-md">
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
