"use client";

import React, { useState } from 'react';
import { SlidersHorizontal, Check } from 'lucide-react';
import { WidgetConfig, WidgetType } from './types';

interface ConfigModalProps {
  isOpen: boolean;
  widget: WidgetConfig | null;
  onClose: () => void;
  onSave: (updated: WidgetConfig) => void;
}

export function WidgetConfigModal({
  isOpen,
  widget,
  onClose,
  onSave,
}: ConfigModalProps) {
  const [title, setTitle] = useState(widget?.title || '');
  const [widgetType, setWidgetType] = useState<WidgetType>(widget?.type || 'kpi');
  const [gridWidth, setGridWidth] = useState<number>(widget?.w || 4);

  if (!isOpen || !widget) return null;

  const handleConfirm = () => {
    onSave({
      ...widget,
      title: title.trim() || widget.title,
      type: widgetType,
      w: gridWidth,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-6 animate-in fade-in duration-200">
      <div className="bg-[#1a1a1a] border border-[#333] rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#262626] pb-3">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-[#2266ec]" /> Widget Configuration Studio
          </h3>
          <button onClick={onClose} className="text-[#a6a6a6] hover:text-white text-sm">✕</button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs text-[#a6a6a6] block mb-1">Widget Title:</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Total Revenue"
              className="w-full bg-[#121212] border border-[#333] text-white text-xs rounded px-3 py-2 outline-none focus:border-[#2266ec]"
            />
          </div>

          <div>
            <label className="text-xs text-[#a6a6a6] block mb-1">Widget Render Type:</label>
            <select
              value={widgetType}
              onChange={e => setWidgetType(e.target.value as any)}
              className="w-full bg-[#121212] border border-[#333] text-white text-xs rounded px-3 py-2 outline-none focus:border-[#2266ec]"
            >
              <option value="kpi">KPI Metric Card</option>
              <option value="metric_comparison">Metric Comparison Card</option>
              <option value="chart_area">Area Chart (Brush Zoom)</option>
              <option value="chart_bar">Bar Chart</option>
              <option value="chart_pie">Pie / Donut Chart</option>
              <option value="ai_summary">AI Natural Language Summary</option>
              <option value="activity_feed">Activity Stream Feed</option>
              <option value="kanban">Kanban Board</option>
              <option value="alert">Alert Status Cards</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-[#a6a6a6] block mb-1">Grid Column Width (1-12):</label>
            <select
              value={gridWidth}
              onChange={e => setGridWidth(Number(e.target.value))}
              className="w-full bg-[#121212] border border-[#333] text-white text-xs rounded px-3 py-2 outline-none focus:border-[#2266ec]"
            >
              <option value={3}>3 Columns (25% Width)</option>
              <option value={4}>4 Columns (33% Width)</option>
              <option value={6}>6 Columns (50% Width)</option>
              <option value={8}>8 Columns (66% Width)</option>
              <option value={12}>12 Columns (100% Full Width)</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button onClick={onClose} className="px-3 py-1.5 bg-[#262626] text-[#a6a6a6] hover:text-white text-xs rounded-md">
            Cancel
          </button>
          <button onClick={handleConfirm} className="px-4 py-1.5 bg-[#2266ec] text-white text-xs font-semibold rounded-md hover:bg-[#1d57cc] flex items-center gap-1">
            <Check className="w-3.5 h-3.5" /> Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
}
