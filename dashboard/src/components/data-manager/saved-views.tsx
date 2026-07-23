"use client";

import React, { useState } from 'react';
import { Bookmark, Plus, Check, Star, Trash2 } from 'lucide-react';
import { SavedView } from './types';

interface SavedViewsProps {
  views: SavedView[];
  activeViewId: string;
  onSelectView: (view: SavedView) => void;
  onSaveNewView: (name: string) => void;
  onDeleteView?: (viewId: string) => void;
}

export function DataManagerSavedViews({
  views,
  activeViewId,
  onSelectView,
  onSaveNewView,
  onDeleteView,
}: SavedViewsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newViewName, setNewViewName] = useState('');

  const handleSave = () => {
    if (newViewName.trim()) {
      onSaveNewView(newViewName.trim());
      setNewViewName('');
      setIsModalOpen(false);
    }
  };

  return (
    <div className="flex items-center justify-between border-b border-[#262626] pb-2 overflow-x-auto hide-scrollbar">
      <div className="flex items-center gap-1.5 min-w-0">
        <span className="text-xs text-[#a6a6a6] font-medium mr-1 flex items-center gap-1 shrink-0">
          <Bookmark className="w-3.5 h-3.5 text-[#2266ec]" /> Views:
        </span>

        {views.map(view => {
          const isActive = activeViewId === view.id;
          return (
            <button
              key={view.id}
              onClick={() => onSelectView(view)}
              className={`px-3 py-1 text-xs rounded-md font-medium transition-all shrink-0 flex items-center gap-1.5 ${
                isActive
                  ? 'bg-[#2266ec] text-white font-semibold shadow-md shadow-[#2266ec]/20'
                  : 'bg-[#1a1a1a] border border-[#262626] text-[#a6a6a6] hover:text-white hover:bg-[#262626]'
              }`}
            >
              {view.name}
              {isActive && <Check className="w-3 h-3 text-white" />}
            </button>
          );
        })}

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-2.5 py-1 text-xs rounded-md bg-[#1a1a1a] border border-dashed border-[#404040] text-[#a6a6a6] hover:text-white hover:border-[#2266ec] transition-colors flex items-center gap-1 shrink-0"
        >
          <Plus className="w-3.5 h-3.5" /> Save Current View
        </button>
      </div>

      {/* Save View Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-[#1a1a1a] border border-[#333] rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#262626] pb-3">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-400" /> Save Custom Data View
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[#a6a6a6] hover:text-white text-sm">✕</button>
            </div>
            
            <div className="space-y-3">
              <label className="text-xs text-[#a6a6a6] block">View Name (e.g. "My Customers", "High Revenue", "Europe Orders"):</label>
              <input
                type="text"
                value={newViewName}
                onChange={e => setNewViewName(e.target.value)}
                placeholder="Enter view name..."
                className="w-full bg-[#121212] border border-[#333] text-white rounded-md px-3 py-2 text-xs outline-none focus:border-[#2266ec]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-3 py-1.5 bg-[#262626] text-[#a6a6a6] hover:text-white text-xs rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-1.5 bg-[#2266ec] text-white text-xs font-medium rounded-md hover:bg-[#1d57cc] transition-colors"
              >
                Save View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
