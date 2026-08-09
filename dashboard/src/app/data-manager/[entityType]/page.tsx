"use client";

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/ui/sidebar';
import { UniversalDataManager } from '@/components/data-manager';
import { UniversalEntity } from '@/components/data-manager/types';
import { Loader2 } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase';
import { OladizzSchemas } from '@/lib/schema-registry';
import { notFound } from 'next/navigation';

export default function DynamicDataManagerPage({ params }: { params: { entityType: string } }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [entity, setEntity] = useState<UniversalEntity | null>(null);

  const schema = OladizzSchemas[params.entityType];

  if (!schema) {
    return notFound();
  }

  useEffect(() => {
    const fetchDynamicData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch dynamically based on the schema's collection name
        const querySnapshot = await getDocs(collection(db, schema.collectionName));
        const dataRows = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // Map data to Litetrack's UniversalEntity using the dynamic schema
        const mappedEntity: UniversalEntity = {
          id: `oladizz_${params.entityType}`,
          title: schema.title,
          description: schema.description,
          totalCount: dataRows.length,
          lastUpdated: 'Just now',
          synced: true,
          breadcrumbs: [
            { label: 'Admin OS' },
            { label: 'Data Manager' },
            { label: schema.title }
          ],
          columns: schema.columns,
          // Dynamically map row fields based on column IDs to ensure no crashes
          rows: dataRows.map((p: any) => {
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
  }, [params.entityType]);

  return (
    <div className="min-h-screen font-sans flex text-[#fafafa] bg-[#121212]">
      <Sidebar />
      <main className="w-full lg:pl-64 min-w-0 flex-1 h-screen overflow-y-auto bg-[#121212]">
        <div className="p-8 max-w-[1600px] mx-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
              <Loader2 className="w-8 h-8 text-[#2266ec] animate-spin" />
              <div className="text-sm text-[#a6a6a6]">Synchronizing {schema.title}...</div>
            </div>
          ) : error ? (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center space-y-4">
              <div className="text-red-400 font-semibold text-lg">Failed to sync data</div>
              <div className="text-sm text-red-400/80">{error}</div>
            </div>
          ) : entity ? (
            <UniversalDataManager initialEntity={entity} />
          ) : (
            <div className="text-center text-[#656565] mt-20">No data found.</div>
          )}
        </div>
      </main>
    </div>
  );
}
