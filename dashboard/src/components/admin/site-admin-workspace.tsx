"use client";

import React, { useState, useEffect } from 'react';
import { Database, Folder, Shield, Loader2, ArrowRight } from 'lucide-react';
import { useWorkspace } from '@/components/ui/workspace-context';
import { UniversalDataManager } from '@/components/data-manager';
import { UniversalEntity, ColumnDef } from '@/components/data-manager/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://litetrack-api-916484331446.us-central1.run.app';

export function SiteAdminWorkspace() {
  const { state } = useWorkspace();
  const [collections, setCollections] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [activeCollection, setActiveCollection] = useState<string | null>(null);
  const [collectionData, setCollectionData] = useState<any[]>([]);
  const [collectionLoading, setCollectionLoading] = useState(false);

  useEffect(() => {
    if (!state.project || state.project === 'Workspace Admin') return;
    
    const token = localStorage.getItem('litetrack_token');
    
    setLoading(true);
    fetch(`${API_URL}/api/admin/firebase/${state.project}/collections`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.collections) {
          const cols = data.collections.includes('users') ? data.collections : ['users', ...data.collections];
          setCollections(cols);
        } else if (data.error) {
          setError(data.error);
        }
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [state.project]);

  const loadCollection = async (collection: string) => {
    setActiveCollection(collection);
    setCollectionLoading(true);
    
    try {
      const token = localStorage.getItem('litetrack_token');
      
      const endpoint = collection === 'users' 
        ? `${API_URL}/api/admin/firebase/${state.project}/auth`
        : `${API_URL}/api/admin/firebase/${state.project}/firestore/${collection}`;
        
      const res = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const data = await res.json();
      if (data.users) setCollectionData(data.users);
      else if (data.data) setCollectionData(data.data);
      else setCollectionData([]);
    } catch (err) {
      console.error(err);
      setCollectionData([]);
    } finally {
      setCollectionLoading(false);
    }
  };

  if (!state.project || state.project === 'Workspace Admin') {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4">
        <Shield className="w-12 h-12 text-[#2266ec] opacity-50" />
        <div className="text-white font-bold text-lg">No Site Selected</div>
        <div className="text-[#a6a6a6] text-sm">Please select a site from the top left to access its database.</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
        <Loader2 className="w-8 h-8 text-[#2266ec] animate-spin" />
        <div className="text-sm text-[#a6a6a6]">Scanning Firebase Project...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center space-y-4 mt-8">
        <div className="text-red-400 font-semibold text-lg">Firebase Connection Error</div>
        <div className="text-sm text-red-400/80">{error}</div>
      </div>
    );
  }

  if (activeCollection) {
    let dynamicColumns: ColumnDef[] = [{ id: 'id', label: 'ID', type: 'link', sortable: true }];
    if (collectionData.length > 0) {
      const sample = collectionData[0];
      Object.keys(sample).forEach(key => {
        if (key !== 'id' && typeof sample[key] !== 'object') {
          dynamicColumns.push({
            id: key,
            label: key.charAt(0).toUpperCase() + key.slice(1),
            type: typeof sample[key] === 'number' ? 'number' : 'text',
            sortable: true
          });
        }
      });
    }

    const entity: UniversalEntity = {
      id: `dynamic_${activeCollection}`,
      title: activeCollection.charAt(0).toUpperCase() + activeCollection.slice(1),
      description: `Managing ${collectionData.length} records in ${activeCollection}`,
      totalCount: collectionData.length,
      lastUpdated: 'Just now',
      synced: true,
      breadcrumbs: [
        { label: 'Admin OS',  },
        { label: 'Database',  },
        { label: activeCollection }
      ],
      columns: dynamicColumns,
      rows: collectionData
    };

    return (
      <div className="animate-in fade-in slide-in-from-right-4 duration-300">
        <div className="mb-4">
          <button 
            onClick={() => setActiveCollection(null)}
            className="text-sm text-[#a6a6a6] hover:text-white flex items-center gap-2 transition-colors"
          >
            ← Back to Database Overview
          </button>
        </div>
        
        {collectionLoading ? (
          <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
            <Loader2 className="w-8 h-8 text-[#2266ec] animate-spin" />
            <div className="text-sm text-[#a6a6a6]">Loading {activeCollection}...</div>
          </div>
        ) : (
          <UniversalDataManager initialEntity={entity} />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center gap-3 pb-4 border-b border-[#262626]">
        <Database className="w-6 h-6 text-[#2266ec]" />
        <div>
          <h2 className="text-xl font-bold text-white">Database Explorer</h2>
          <p className="text-xs text-[#a6a6a6]">Full CRUD access to {state.projectName}&apos;s connected Firebase project</p>
        </div>
      </div>

      {collections.length === 0 ? (
        <div className="text-center py-12 text-[#656565]">
          No collections found in this Firebase project.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {collections.map(col => (
            <button
              key={col}
              onClick={() => loadCollection(col)}
              className="group bg-[#1a1a1a] hover:bg-[#262626] border border-[#262626] hover:border-[#333] p-4 rounded-xl text-left transition-all flex flex-col gap-3"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-[#2266ec]/10 flex items-center justify-center text-[#2266ec]">
                  <Folder className="w-5 h-5" />
                </div>
                <ArrowRight className="w-4 h-4 text-[#656565] group-hover:text-white transition-colors" />
              </div>
              <div>
                <div className="text-white font-bold capitalize">{col}</div>
                <div className="text-xs text-[#a6a6a6] font-mono mt-1">/{col}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
