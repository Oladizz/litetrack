"use client";

import React, { useState } from 'react';
import { Key, Shield, Smartphone, Globe, Clock, ShieldCheck, Activity, Users } from 'lucide-react';
import { toast } from '@/components/ui/toast';

export function IOACAuthSecurity() {
  const [ssoEnabled, setSsoEnabled] = useState(false);
  const [mfaEnforced, setMfaEnforced] = useState(true);
  const [passwordExpiry, setPasswordExpiry] = useState('90');
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('litetrack_token');
        const headers = { Authorization: `Bearer ${token}` };
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://litetrack-api-916484331446.us-central1.run.app';
        
        const res = await fetch(`${apiUrl}/api/ioac/auth`, { headers });
        const data = await res.json();
        if (data.settings) {
          setSsoEnabled(data.settings.ssoEnabled);
          setMfaEnforced(data.settings.mfaEnforced);
          setPasswordExpiry(data.settings.passwordExpiry || '90');
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const saveSettings = async () => {
    try {
      const token = localStorage.getItem('litetrack_token');
      const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://litetrack-api-916484331446.us-central1.run.app';
      
      await fetch(`${apiUrl}/api/ioac/auth`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          ssoEnabled,
          mfaEnforced,
          passwordExpiry
        })
      });
      toast('Global Security Policies updated successfully', { type: 'success' });
    } catch(e) {
      toast('Failed to update policies', { type: 'error' });
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Global Security Policies */}
        <div className="md:col-span-2 space-y-4">
          <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-5 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-[#262626] pb-3">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#2266ec]" /> Global Security & Authentication
              </h3>
              <button
                onClick={saveSettings}
                className="px-4 py-1.5 bg-[#2266ec] text-white text-xs font-semibold rounded-lg"
              >
                Save Policies
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
              
              <div className="space-y-3">
                <label className="font-bold text-[#656565] uppercase tracking-wider block border-b border-[#262626] pb-2">Identity Providers</label>
                
                <div className="flex items-center justify-between bg-[#121212] p-3 rounded-lg border border-[#262626]">
                  <div>
                    <div className="text-white font-medium">Enterprise SSO (SAML)</div>
                    <div className="text-[#a6a6a6] mt-0.5 text-[10px]">Google Workspace, Okta</div>
                  </div>
                  <button 
                    onClick={() => setSsoEnabled(!ssoEnabled)}
                    className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors ${ssoEnabled ? 'bg-green-500' : 'bg-[#333]'}`}
                  >
                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${ssoEnabled ? 'translate-x-5' : 'translate-x-0'}`}></div>
                  </button>
                </div>

                <div className="flex items-center justify-between bg-[#121212] p-3 rounded-lg border border-[#262626]">
                  <div>
                    <div className="text-white font-medium">Require Passkeys / WebAuthn</div>
                    <div className="text-[#a6a6a6] mt-0.5 text-[10px]">Biometric hardware enforcement</div>
                  </div>
                  <button className="w-10 h-5 flex items-center rounded-full p-0.5 transition-colors bg-[#333]">
                    <div className="bg-white w-4 h-4 rounded-full shadow-md transform transition-transform translate-x-0"></div>
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <label className="font-bold text-[#656565] uppercase tracking-wider block border-b border-[#262626] pb-2">Enforcement Policies</label>
                
                <div className="flex items-center justify-between bg-[#121212] p-3 rounded-lg border border-[#262626]">
                  <div>
                    <div className="text-white font-medium">Enforce Global MFA</div>
                    <div className="text-[#a6a6a6] mt-0.5 text-[10px]">Require 2FA for all members</div>
                  </div>
                  <button 
                    onClick={() => setMfaEnforced(!mfaEnforced)}
                    className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors ${mfaEnforced ? 'bg-[#2266ec]' : 'bg-[#333]'}`}
                  >
                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${mfaEnforced ? 'translate-x-5' : 'translate-x-0'}`}></div>
                  </button>
                </div>

                <div className="flex items-center justify-between bg-[#121212] p-3 rounded-lg border border-[#262626]">
                  <div className="text-white font-medium">Password Expiry (Days)</div>
                  <select 
                    value={passwordExpiry} 
                    onChange={e => setPasswordExpiry(e.target.value)}
                    className="bg-[#1a1a1a] border border-[#333] text-white px-2 py-1 rounded"
                  >
                    <option value="30">30 Days</option>
                    <option value="90">90 Days</option>
                    <option value="180">180 Days</option>
                    <option value="never">Never</option>
                  </select>
                </div>
              </div>

            </div>
          </div>

          {/* Active Sessions & Devices */}
          <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-5 shadow-xl space-y-4">
             <div className="flex items-center justify-between border-b border-[#262626] pb-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-cyan-400" /> Active Sessions & Device Management
              </h3>
              <button className="text-[#2266ec] text-xs hover:underline">Revoke All Sessions</button>
            </div>

            <div className="space-y-2">
              {[
                { id: 1, user: 'rabiuoladizz@gmail.com', device: 'MacBook Pro 16"', ip: '102.164.21.4', location: 'Lagos, NG', time: 'Active now' },
                { id: 2, user: 'rabiuoladizz@gmail.com', device: 'iPhone 14 Pro', ip: '102.164.21.4', location: 'Lagos, NG', time: '2 hours ago' },
                { id: 3, user: 'api_service_worker', device: 'Cloud Run API', ip: '34.120.54.1', location: 'Iowa, US', time: 'Active now' },
              ].map(session => (
                <div key={session.id} className="bg-[#121212] border border-[#262626] p-3 rounded-lg flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <Globe className="w-8 h-8 text-[#656565] bg-[#1a1a1a] p-1.5 rounded-md border border-[#333]" />
                    <div>
                      <div className="text-white font-bold">{session.device} <span className="text-[#656565] font-normal ml-1">({session.ip})</span></div>
                      <div className="text-[#a6a6a6] mt-0.5">{session.user} • {session.location} • <span className="text-green-400">{session.time}</span></div>
                    </div>
                  </div>
                  <button className="text-red-400 hover:bg-red-500/10 px-3 py-1.5 rounded transition-colors border border-transparent hover:border-red-500/20">
                    Revoke
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* API Keys Sidebar */}
        <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#262626] pb-3">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <Key className="w-4 h-4 text-amber-400" /> API Keys
            </h4>
            <button className="text-xs text-[#2266ec] hover:underline">+ Generate</button>
          </div>

          <div className="space-y-3">
            <div className="bg-[#121212] p-3 rounded-lg border border-[#262626] text-xs">
              <div className="flex justify-between items-start mb-2">
                <span className="text-white font-bold">Production Stripe Sync</span>
                <span className="text-[10px] bg-green-500/20 text-green-400 px-1.5 rounded">ACTIVE</span>
              </div>
              <div className="font-mono text-[#656565] text-[10px] bg-[#1a1a1a] p-1.5 rounded border border-[#333] mb-2">
                sk_live_****************a2b4
              </div>
              <div className="text-[#a6a6a6] text-[10px] flex justify-between">
                <span>Created: 2 mos ago</span>
                <button className="text-red-400 hover:underline">Revoke</button>
              </div>
            </div>

            <div className="bg-[#121212] p-3 rounded-lg border border-[#262626] text-xs">
              <div className="flex justify-between items-start mb-2">
                <span className="text-white font-bold">Internal Data Pipeline</span>
                <span className="text-[10px] bg-[#262626] text-[#656565] px-1.5 rounded">REVOKED</span>
              </div>
              <div className="font-mono text-[#656565] text-[10px] bg-[#1a1a1a] p-1.5 rounded border border-[#333] mb-2 line-through">
                sk_test_****************99f1
              </div>
              <div className="text-[#a6a6a6] text-[10px] flex justify-between">
                <span>Revoked: yesterday</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
