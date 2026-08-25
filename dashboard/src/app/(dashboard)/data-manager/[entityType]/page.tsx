"use client";

import React, { useState, useEffect } from 'react';
import { UniversalDataManager } from '@/components/data-manager';
import { UniversalEntity, ColumnDef } from '@/components/data-manager/types';
import { Loader2 } from 'lucide-react';
import { useWorkspace } from '@/components/ui/workspace-context';
import { DefaultProjectConfig, TemplateLibrary } from '@/lib/template-engine';

export default function DynamicDataManagerPage({ params }: { params: { entityType: string } }) {
  const { state } = useWorkspace();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [entity, setEntity] = useState<UniversalEntity | null>(null);

  // 1. PROJECT CONFIG: Find the configuration for this page ID (e.g. 'products')
  const pageId = params.entityType;
  const pageConfig = DefaultProjectConfig.pages.find(p => p.id === pageId);

  useEffect(() => {
    const fetchDynamicData = async () => {
      if (!state.project) return;
      setLoading(true);
      setError(null);
      
      try {
        const token = localStorage.getItem('litetrack_token');
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://litetrack-api-916484331446.us-central1.run.app';
        
        // If a config exists, use it. If not, we will attempt to dynamically infer it.
        const collectionName = pageConfig?.config.collectionName || pageId;
        
        const res = await fetch(`${apiUrl}/api/admin/firebase/${state.project}/firestore/${collectionName}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || `Failed to fetch ${collectionName}`);
        }
        
        const { data } = await res.json();
        
        // 2. TEMPLATES: Check which template this page uses
        const template = pageConfig ? TemplateLibrary[pageConfig.templateId] : TemplateLibrary['resource_manager'];
        
        // If there's no project config for this page, dynamically generate the schema (Tool config)
        let dynamicColumns: ColumnDef[] = pageConfig?.config.columns || [];
        
        if (!pageConfig || !pageConfig.config.columns) {
          dynamicColumns = [{ id: 'id', label: 'ID', type: 'link', sortable: true }];
          
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
        }
        
        const pageTitle = pageConfig?.title || (pageId.charAt(0).toUpperCase() + pageId.slice(1));
        const pageDescription = pageConfig?.description || `Managing ${collectionName} via ${template.name} template`;
        
        // 3. TOOLS: Render the UniversalDataManager Tool with the configured layout
        const mappedEntity: UniversalEntity = {
          id: `dynamic_${pageId}`,
          title: pageTitle,
          description: pageDescription,
          totalCount: data.length,
          lastUpdated: 'Just now',
          synced: true,
          breadcrumbs: [
            { label: 'Admin OS' },
            { label: template.name }, // The template layout being used
            { label: pageTitle }
          ],
          columns: dynamicColumns,
          rows: data.map((p: any) => {
            const row: Record<string, any> = { id: p.id };
            dynamicColumns.forEach(col => {
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
  }, [pageId, state.project, pageConfig]);

  return (
    <>      
        <div className="p-8 max-w-[1600px] mx-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
              <Loader2 className="w-8 h-8 text-[#2266ec] animate-spin" />
              <div className="text-sm text-[#a6a6a6]">Rendering Template...</div>
            </div>
          ) : error ? (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center space-y-4">
              <div className="text-red-400 font-semibold text-lg">Failed to load {pageId}</div>
              <div className="text-sm text-red-400/80">{error}</div>
            </div>
          ) : entity ? (
            <UniversalDataManager initialEntity={entity} />
          ) : (
            <div className="text-center text-[#656565] mt-20">Select a project to view data.</div>
          )}
        </div>
      
    </>
  );
}
