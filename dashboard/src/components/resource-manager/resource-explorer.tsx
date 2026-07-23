"use client";

import React, { useState } from 'react';
import { 
  Folder, FileText, Image, Video, Music, Database, Cpu, Key, LayoutGrid, List, Search, Cloud 
} from 'lucide-react';
import { ResourceItem, ResourceCategory, StorageProvider } from './types';
import { toast } from '@/components/ui/toast';

interface ExplorerProps {
  resources: ResourceItem[];
  selectedCategory: ResourceCategory | 'All';
  onSelectCategory: (cat: ResourceCategory | 'All') => void;
  onSelectResource: (res: ResourceItem) => void;
}

export function ResourceExplorer({
  resources,
  selectedCategory,
  onSelectCategory,
  onSelectResource,
}: ExplorerProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [activeProvider, setActiveProvider] = useState<StorageProvider>('AWS S3');
  const [searchQuery, setSearchQuery] = useState('');

  const categories: { id: ResourceCategory | 'All'; label: string; icon: string }[] = [
    { id: 'All', label: 'All Resources', icon: '📁' },
    { id: 'Users', label: 'Users & Identities', icon: '👤' },
    { id: 'Products', label: 'Products & Orders', icon: '🛒' },
    { id: 'Media', label: 'Media & Documents', icon: '🖼️' },
    { id: 'AI', label: 'AI Assets & Prompts', icon: '⚡' },
    { id: 'Reports', label: 'Reports & Analytics', icon: '📄' },
    { id: 'APIs', label: 'API Keys & Secrets', icon: '🔑' },
  ];

  const providers: StorageProvider[] = ['Local', 'AWS S3', 'Cloudflare R2', 'Google Cloud', 'Azure', 'Dropbox'];

  const filtered = resources.filter(r => {
    const matchCat = selectedCategory === 'All' || r.category === selectedCategory;
    const matchQuery = r.title.toLowerCase().includes(searchQuery.toLowerCase()) || r.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchQuery;
  });

  return (
    <div className="space-y-4 font-sans">
      {/* Storage Provider & Search Bar */}
      <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-4 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="flex-1 flex items-center gap-2 bg-[#121212] border border-[#333] rounded-lg px-3 py-1.5 text-xs text-white">
          <Search className="w-4 h-4 text-[#2266ec]" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search all knowledge resources by title or tag..."
            className="w-full bg-transparent outline-none placeholder:text-[#656565]"
          />
        </div>

        {/* Multi-Cloud Provider Switcher */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-[#656565] flex items-center gap-1"><Cloud className="w-3.5 h-3.5 text-[#2266ec]" /> Storage Provider:</span>
          <select
            value={activeProvider}
            onChange={e => { setActiveProvider(e.target.value as any); toast(`Storage provider switched to ${e.target.value}`, { type: 'info' }); }}
            className="bg-[#121212] border border-[#333] text-white px-2.5 py-1 rounded outline-none cursor-pointer"
          >
            {providers.map(p => <option key={p} value={p}>{p}</option>)}
          </select>

          {/* Grid vs Table View Mode */}
          <div className="flex gap-1 bg-[#121212] p-1 rounded border border-[#262626] ml-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1 rounded ${viewMode === 'grid' ? 'bg-[#2266ec] text-white' : 'text-[#656565]'}`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1 rounded ${viewMode === 'table' ? 'bg-[#2266ec] text-white' : 'text-[#656565]'}`}
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Explorer Main Content Area */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Category Tree Navigation */}
        <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-4 shadow-xl space-y-2">
          <div className="text-[10px] text-[#656565] font-mono uppercase pb-1 border-b border-[#262626]">Resource Tree Navigation</div>
          {categories.map(c => {
            const isActive = selectedCategory === c.id;
            return (
              <button
                key={c.id}
                onClick={() => onSelectCategory(c.id)}
                className={`w-full p-2.5 rounded-lg border text-left text-xs font-semibold flex items-center justify-between transition-all ${
                  isActive
                    ? 'bg-[#2266ec] border-[#2266ec] text-white shadow'
                    : 'bg-[#121212] border-[#262626] text-[#a6a6a6] hover:text-white hover:bg-[#262626]'
                }`}
              >
                <span className="flex items-center gap-2"><span>{c.icon}</span> {c.label}</span>
                <span className="text-[10px] font-mono opacity-60">
                  {c.id === 'All' ? resources.length : resources.filter(r => r.category === c.id).length}
                </span>
              </button>
            );
          })}
        </div>

        {/* Resources Grid/Table Stream */}
        <div className="md:col-span-3">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(item => (
                <div
                  key={item.id}
                  onClick={() => onSelectResource(item)}
                  className="bg-[#1a1a1a] border border-[#262626] hover:border-[#2266ec] rounded-xl p-4 shadow-xl cursor-pointer space-y-3 transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-lg bg-[#121212] border border-[#262626] flex items-center justify-center text-lg">
                      {item.type === 'document' ? '📄' : item.type === 'image' ? '🖼️' : item.type === 'video' ? '🎬' : item.type === 'dev_secret' ? '🔑' : '📦'}
                    </div>
                    <span className="text-[10px] font-mono text-[#2266ec] bg-[#2266ec]/10 px-2 py-0.5 rounded border border-[#2266ec]/30 uppercase">
                      {item.version}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-white text-xs group-hover:text-[#2266ec] transition-colors truncate">{item.title}</h4>
                    <span className="text-[11px] text-[#656565] block font-mono">Owner: {item.owner}</span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {item.tags.map(t => (
                      <span key={t} className="text-[9px] font-mono bg-[#121212] text-[#a6a6a6] px-1.5 py-0.5 rounded border border-[#262626]">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl overflow-hidden shadow-xl text-xs font-mono">
              <table className="w-full text-left">
                <thead className="bg-[#121212] text-[#656565] border-b border-[#262626]">
                  <tr>
                    <th className="p-3">Title</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Owner</th>
                    <th className="p-3">Version</th>
                    <th className="p-3">Storage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#262626] text-white">
                  {filtered.map(item => (
                    <tr key={item.id} onClick={() => onSelectResource(item)} className="hover:bg-[#262626]/50 cursor-pointer">
                      <td className="p-3 font-bold">{item.title}</td>
                      <td className="p-3 text-[#2266ec]">{item.category}</td>
                      <td className="p-3 text-[#a6a6a6]">{item.owner}</td>
                      <td className="p-3 font-mono">{item.version}</td>
                      <td className="p-3 text-amber-400">{item.storageProvider}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
