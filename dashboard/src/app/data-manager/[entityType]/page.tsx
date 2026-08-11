"use client";

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/ui/sidebar';
import { UniversalDataManager } from '@/components/data-manager';
import { UniversalEntity, ColumnDef } from '@/components/data-manager/types';
import { Loader2 } from 'lucide-react';
import { useWorkspace } from '@/components/ui/workspace-context';
import { OladizzSchemas } from '@/lib/schema-registry';

export default function DynamicDataManagerPage({ params }: { params: { entityType: string } }) {
  const { state } = useWorkspace();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [entity, setEntity] = useState<UniversalEntity | null>(null);

  useEffect(() => {
    const fetchDynamicData = async () => {
      if (!state.project) return;
      setLoading(true);
      setError(null);
      
      try {
        const token = localStorage.getItem('litetrack_token');
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://litetrack-api-916484331446.us-central1.run.app';
        
        // Fetch dynamically from Litetrack API using the connected Firebase Admin
        const collectionName = OladizzSchemas[params.entityType]?.collectionName || params.entityType;
        const res = await fetch(`${apiUrl}/api/admin/firebase/${state.project}/firestore/${collectionName}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || `Failed to fetch ${collectionName}`);
        }
        
        const { data } = await res.json();
        
        // Use predefined schema for nice UI, or auto-generate dynamic schema from the first document!
        let schema = OladizzSchemas[params.entityType];
        
        if (!schema) {
          const dynamicColumns: ColumnDef[] = [{ id: 'id', label: 'ID', type: 'link', sortable: true }];
          
          if (data.length > 0) {
            Object.keys(data[0]).forEach(key => {
              if (key !== 'id') {
                dynamicColumns.push({
                  id: key,
                  label: key.charAt(0).toUpperCase() + key.slice(1),
                  type: typeof data[0][key] === 'number' ? 'number' : 'text',
                  sortable: true
                });
              }
            });
          }
          
          schema = {
            title: params.entityType.charAt(0).toUpperCase() + params.entityType.slice(1),
            description: `Dynamic collection: ${collectionName}`,
            collectionName: collectionName,
            columns: dynamicColumns
          };
        }
        
        // Map data to Litetrack's UniversalEntity using the dynamic schema
        const mappedEntity: UniversalEntity = {
          id: `dynamic_${params.entityType}`,
          title: schema.title,
          description: schema.description,
          totalCount: data.length,
          lastUpdated: 'Just now',
          synced: true,
          breadcrumbs: [
            { label: 'Admin OS' },
            { label: 'Data Manager' },
            { label: schema.title }
          ],
          columns: schema.columns,
          // Map row fields dynamically based on column IDs
          rows: data.map((p: any) => {
            const row: Record<string, any> = { id: p.id };
            schema.columns.forEach(col => {
              if (col.id !== 'actions') {
                row[col.id] = p[col.id] !== undefined ? p[col.id] : null;
              }
            });
            return row;
          })
        };
        
        setEntity(mappedEntity);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDynamicData();
  }, [params.entityType, state.project]);

  return (
    <div className="min-h-screen font-sans flex text-[#fafafa] bg-[#121212]">
      <Sidebar />
      <main className="w-full lg:pl-64 min-w-0 flex-1 h-screen overflow-y-auto bg-[#121212]">
        <div className="p-8 max-w-[1600px] mx-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
              <Loader2 className="w-8 h-8 text-[#2266ec] animate-spin" />
              <div className="text-sm text-[#a6a6a6]">Synchronizing Data...</div>
            </div>
          ) : error ? (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center space-y-4">
              <div className="text-red-400 font-semibold text-lg">Failed to sync data</div>
              <div className="text-sm text-red-400/80">{error}</div>
            </div>
          ) : entity ? (
            <UniversalDataManager initialEntity={entity} />
          ) : (
            <div className="text-center text-[#656565] mt-20">Select a project to view data.</div>
          )}
        </div>
      </main>
    </div>
  );
}
