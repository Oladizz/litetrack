"use client";

import React, { useState } from 'react';
import { Filter, Plus, Trash2, Check, SlidersHorizontal } from 'lucide-react';
import { ColumnDef, FilterRule } from './types';

interface FilterBuilderProps {
  columns: ColumnDef[];
  rules: FilterRule[];
  onChangeRules: (rules: FilterRule[]) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function DataManagerFilterBuilder({
  columns,
  rules,
  onChangeRules,
  isOpen,
  onClose,
}: FilterBuilderProps) {
  const [localRules, setLocalRules] = useState<FilterRule[]>(rules);

  if (!isOpen) return null;

  const handleAddRule = () => {
    const firstCol = columns[0]?.id || 'status';
    setLocalRules(prev => [
      ...prev,
      { id: crypto.randomUUID(), field: firstCol, operator: '=', value: '' }
    ]);
  };

  const handleRemoveRule = (id: string) => {
    setLocalRules(prev => prev.filter(r => r.id !== id));
  };

  const handleUpdateRule = (id: string, updates: Partial<FilterRule>) => {
    setLocalRules(prev =>
      prev.map(r => (r.id === id ? { ...r, ...updates } : r))
    );
  };

  const handleApply = () => {
    onChangeRules(localRules);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-6 animate-in fade-in duration-200">
      <div className="bg-[#1a1a1a] border border-[#333] rounded-2xl w-full max-w-2xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#262626] pb-3">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-[#2266ec]" /> Advanced Filter Rules Builder
          </h3>
          <button onClick={onClose} className="text-[#a6a6a6] hover:text-white text-sm">✕</button>
        </div>

        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          {localRules.length === 0 ? (
            <div className="text-center py-8 text-[#656565] text-xs bg-[#121212] rounded-xl border border-dashed border-[#262626]">
              No active filter rules. Click "+ Add Rule" to filter data.
            </div>
          ) : (
            localRules.map((rule, idx) => (
              <div key={rule.id} className="flex items-center gap-2 bg-[#121212] p-3 rounded-lg border border-[#262626]">
                <span className="text-[10px] font-mono text-[#656565] w-6">#{idx + 1}</span>
                
                {/* Field Selector */}
                <select
                  value={rule.field}
                  onChange={e => handleUpdateRule(rule.id, { field: e.target.value })}
                  className="bg-[#1a1a1a] border border-[#333] text-white text-xs rounded px-2.5 py-1.5 outline-none focus:border-[#2266ec]"
                >
                  {columns.map(col => (
                    <option key={col.id} value={col.id}>{col.label}</option>
                  ))}
                </select>

                {/* Operator Selector */}
                <select
                  value={rule.operator}
                  onChange={e => handleUpdateRule(rule.id, { operator: e.target.value as any })}
                  className="bg-[#1a1a1a] border border-[#333] text-white text-xs rounded px-2.5 py-1.5 outline-none focus:border-[#2266ec]"
                >
                  <option value="=">Equals (=)</option>
                  <option value="!=">Not Equals (!=)</option>
                  <option value=">">Greater Than (&gt;)</option>
                  <option value="<">Less Than (&lt;)</option>
                  <option value="contains">Contains</option>
                  <option value="between">Between</option>
                  <option value="in">In List</option>
                  <option value="is_empty">Is Empty</option>
                  <option value="is_not_empty">Is Not Empty</option>
                </select>

                {/* Value Input */}
                {rule.operator !== 'is_empty' && rule.operator !== 'is_not_empty' && (
                  <input
                    type="text"
                    value={rule.value}
                    onChange={e => handleUpdateRule(rule.id, { value: e.target.value })}
                    placeholder="Value..."
                    className="flex-1 bg-[#1a1a1a] border border-[#333] text-white text-xs rounded px-2.5 py-1.5 outline-none focus:border-[#2266ec]"
                  />
                )}

                <button
                  type="button"
                  onClick={() => handleRemoveRule(rule.id)}
                  className="text-red-500/70 hover:text-red-500 p-1.5 rounded transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="flex items-center justify-between border-t border-[#262626] pt-3">
          <button
            type="button"
            onClick={handleAddRule}
            className="px-3 py-1.5 bg-[#262626] hover:bg-[#333] text-white text-xs font-medium rounded-md transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 text-[#2266ec]" /> Add Rule
          </button>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setLocalRules([])}
              className="px-3 py-1.5 bg-transparent text-[#a6a6a6] hover:text-white text-xs underline"
            >
              Clear All
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="px-4 py-1.5 bg-[#2266ec] text-white text-xs font-medium rounded-md hover:bg-[#1d57cc] transition-colors flex items-center gap-1"
            >
              <Check className="w-3.5 h-3.5" /> Apply Filters ({localRules.length})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
