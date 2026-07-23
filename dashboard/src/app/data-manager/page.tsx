"use client";

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/ui/sidebar';
import { UniversalDataManager } from '@/components/data-manager';
import { UniversalEntity } from '@/components/data-manager/types';
import { useWorkspace } from '@/components/ui/workspace-context';
import { Loader2 } from 'lucide-react';

export default function UniversalDataManagerPage() {
  const { state } = useWorkspace();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [entity, setEntity] = useState<UniversalEntity | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!state.project) return;
      setLoading(true);
      setError(null);
      
      try {
        const token = localStorage.getItem('litetrack_token');
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://litetrack-api-916484331446.us-central1.run.app';
        
        const res = await fetch(`${apiUrl}/api/admin/firebase/${state.project}/auth`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || 'Failed to fetch Firebase users');
        }
        
        const data = await res.json();
        
        // Map Firebase Auth users to UniversalEntity
        const mappedEntity: UniversalEntity = {
          id: 'firebase_users',
          title: `Firebase Users (${state.projectName})`,
          description: 'Live user accounts from your connected Firebase Auth project.',
          totalCount: data.users.length,
          lastUpdated: 'Just now',
          synced: true,
          breadcrumbs: [
            { label: 'Admin OS' },
            { label: 'Data Manager' },
            { label: 'Firebase Auth' }
          ],
          columns: [
            { id: 'uid', label: 'User ID', type: 'link', sortable: true },
            { id: 'name', label: 'Name', type: 'avatar', sortable: true },
            { id: 'email', label: 'Email Address', type: 'link', sortable: true },
            { id: 'status', label: 'Status', type: 'status', sortable: true },
            { id: 'created', label: 'Joined Date', type: 'date', sortable: true },
            { id: 'lastSignIn', label: 'Last Sign In', type: 'date', sortable: true },
            { id: 'actions', label: 'Actions', type: 'action_button', sortable: false },
          ],
          rows: data.users.map((u: any) => ({
            id: u.uid,
            uid: u.uid,
            name: u.displayName || 'Anonymous',
            email: u.email || 'No email',
            status: u.disabled ? 'disabled' : 'active',
            created: new Date(u.creationTime).toLocaleDateString(),
            lastSignIn: new Date(u.lastSignInTime).toLocaleString(),
          }))
        };
        
        setEntity(mappedEntity);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [state.project]);

  return (
    <div className="min-h-screen font-sans flex text-[#fafafa] bg-[#121212]">
      <Sidebar />
      <main className="w-full lg:pl-64 min-w-0 flex-1 h-screen overflow-y-auto bg-[#121212]">
        <div className="p-8 max-w-[1600px] mx-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
              <Loader2 className="w-8 h-8 text-[#2266ec] animate-spin" />
              <div className="text-sm text-[#a6a6a6]">Loading Firebase users...</div>
            </div>
          ) : error ? (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center space-y-4">
              <div className="text-red-400 font-semibold text-lg">Failed to load users</div>
              <div className="text-sm text-red-400/80">{error}</div>
              <div className="text-xs text-[#a6a6a6] mt-4">Make sure you have added your Firebase Admin config for this project in Settings.</div>
            </div>
          ) : entity ? (
            <UniversalDataManager initialEntity={entity} />
          ) : (
            <div className="text-center text-[#656565] mt-20">Select a project to view users</div>
          )}
        </div>
      </main>
    </div>
  );
}
