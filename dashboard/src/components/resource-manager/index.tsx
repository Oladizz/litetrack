"use client";

import React, { useState } from 'react';
import { Package, Network, Sparkles, History, Layers, Cloud } from 'lucide-react';
import { ResourceItem, ResourceCategory } from './types';
import { ResourceExplorer } from './resource-explorer';
import { EntityKnowledgeGraph } from './knowledge-graph';
import { SmartCollections } from './smart-collections';
import { VersionHistoryStack } from './version-history';
import { toast } from '@/components/ui/toast';

export function UniversalResourceManager() {
  const [activeTab, setActiveTab] = useState<'explorer' | 'graph' | 'collections' | 'history'>('explorer');
  const [selectedCategory, setSelectedCategory] = useState<ResourceCategory | 'All'>('All');

  const [resources, setResources] = useState<ResourceItem[]>([
    {
      id: 'res_usr_john',
      title: 'Customer Knowledge Object: John Doe',
      category: 'Users',
      type: 'db_record',
      owner: 'System Admin',
      status: 'published',
      version: 'v3.2.0',
      storageProvider: 'Google Cloud',
      tags: ['customer', 'vip', 'nigeria', 'john_doe'],
      createdAt: '2026-01-10',
      updatedAt: 'Just now',
      metadata: { email: 'john.doe@gmail.com', phone: '+234 801 234 5678', country: 'Nigeria', role: 'VIP Member' },
      relationships: [
        { targetId: 'ord_9481', targetTitle: 'Order #ORD-9481 ($1,450)', targetCategory: 'Products', relationType: 'purchased' },
        { targetId: 'inv_204', targetTitle: 'Invoice #INV-204 (Paid)', targetCategory: 'Reports', relationType: 'generated' },
        { targetId: 'file_receipt', targetTitle: 'Payment Receipt PDF', targetCategory: 'Media', relationType: 'attached_to' },
        { targetId: 'ticket_841', targetTitle: 'Support Ticket #841 (Resolved)', targetCategory: 'Users', relationType: 'owns' }
      ],
      versionHistory: [
        { version: 'v3.2.0', createdAt: 'Today 14:20', createdBy: 'Admin', summary: 'Updated VIP status & phone' },
        { version: 'v3.1.0', createdAt: 'Yesterday', createdBy: 'System', summary: 'Attached Order #ORD-9481' },
        { version: 'v3.0.0', createdAt: '2 weeks ago', createdBy: 'John Doe', summary: 'Initial customer creation' }
      ]
    },
    {
      id: 'res_doc_atlas',
      title: 'Project Atlas System Spec PDF',
      category: 'Media',
      type: 'document',
      owner: 'Rabiu Oladizz',
      status: 'published',
      version: 'v1.4.0',
      storageProvider: 'AWS S3',
      sizeBytes: 4820100,
      tags: ['atlas', 'architecture', 'pdf', 'specs'],
      createdAt: '2026-02-01',
      updatedAt: 'Yesterday',
      metadata: { author: 'Oladizz', pageCount: 42, securityClassification: 'Confidential' },
      relationships: [
        { targetId: 'res_usr_john', targetTitle: 'Customer John Doe', targetCategory: 'Users', relationType: 'created_by' },
        { targetId: 'api_key_atlas', targetTitle: 'Atlas Webhook Secret Key', targetCategory: 'APIs', relationType: 'attached_to' }
      ],
      versionHistory: [
        { version: 'v1.4.0', createdAt: 'Yesterday', createdBy: 'Rabiu Oladizz', summary: 'Added Security Matrix Annex' },
        { version: 'v1.0.0', createdAt: '1 month ago', createdBy: 'Rabiu Oladizz', summary: 'Initial Spec Draft' }
      ]
    },
    {
      id: 'res_ai_exec',
      title: 'CEO Executive AI Agent Memory',
      category: 'AI',
      type: 'ai_asset',
      owner: 'AI Studio',
      status: 'pinned',
      version: 'v2.4.0',
      storageProvider: 'Cloudflare R2',
      tags: ['ai_agent', 'ceo', 'memory', 'context'],
      createdAt: '2026-03-12',
      updatedAt: 'Just now',
      metadata: { model: 'gemini-2.5-pro', memoryEntries: 1420 },
      relationships: [
        { targetId: 'res_usr_john', targetTitle: 'Customer John Doe', targetCategory: 'Users', relationType: 'generated' }
      ],
      versionHistory: [
        { version: 'v2.4.0', createdAt: 'Just now', createdBy: 'CEO Agent', summary: 'Auto-consolidated retention memory' }
      ]
    }
  ]);

  const [selectedResource, setSelectedResource] = useState<ResourceItem>(resources[0]);

  const handleSelectResource = (res: ResourceItem) => {
    setSelectedResource(res);
    toast(`Opened knowledge object: ${res.title}`, { type: 'info' });
  };

  return (
    <div className="space-y-6 w-full font-sans">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#262626]">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Package className="w-6 h-6 text-green-400" /> Tool #6: Universal Resource Manager (Knowledge Object Engine)
          </h1>
          <p className="text-xs text-[#a6a6a6] mt-1">
            Manage every entity (Users, Orders, Media, AI, APIs) through unified Knowledge Objects connected via interactive Knowledge Graphs.
          </p>
        </div>
      </div>

      {/* 4 Navigation Tabs */}
      <div className="flex items-center gap-1.5 border-b border-[#262626] pb-3 overflow-x-auto hide-scrollbar text-xs font-semibold">
        {[
          { id: 'explorer', label: '1. Resource Explorer & Multi-Cloud', icon: Package },
          { id: 'graph', label: '2. ⭐ Knowledge Object Graph', icon: Network },
          { id: 'collections', label: '3. Smart Collections & AI Bundler', icon: Sparkles },
          { id: 'history', label: '4. Version History & Restore', icon: History },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl border transition-all shrink-0 flex items-center gap-2 ${
                isActive
                  ? 'bg-[#2266ec] border-[#2266ec] text-white shadow-lg shadow-[#2266ec]/20'
                  : 'bg-[#1a1a1a] border-[#262626] text-[#a6a6a6] hover:text-white hover:bg-[#262626]'
              }`}
            >
              <Icon className="w-4 h-4" /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Renderers */}
      {activeTab === 'explorer' && (
        <ResourceExplorer
          resources={resources}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          onSelectResource={handleSelectResource}
        />
      )}

      {activeTab === 'graph' && <EntityKnowledgeGraph selectedResource={selectedResource} />}

      {activeTab === 'collections' && <SmartCollections />}

      {activeTab === 'history' && <VersionHistoryStack resource={selectedResource} />}
    </div>
  );
}
