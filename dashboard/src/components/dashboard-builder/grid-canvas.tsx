"use client";

import React from 'react';
import { WidgetConfig } from './types';
import { DashboardWidgetRenderer } from './widget-renderer';

interface GridCanvasProps {
  widgets: WidgetConfig[];
  isLocked?: boolean;
  onRemoveWidget: (id: string) => void;
  onEditWidgetConfig: (widget: WidgetConfig) => void;
  onDrillDown: (widgetTitle: string, metric: string) => void;
}

export function DashboardGridCanvas({
  widgets,
  isLocked,
  onRemoveWidget,
  onEditWidgetConfig,
  onDrillDown,
}: GridCanvasProps) {
  if (widgets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 bg-[#1a1a1a] border border-dashed border-[#333] rounded-2xl text-center space-y-3">
        <div className="text-3xl">📈</div>
        <h3 className="text-sm font-bold text-white">Dashboard Canvas Empty</h3>
        <p className="text-xs text-[#a6a6a6] max-w-sm">
          No widgets added yet. Click "+ Add Widget" above or pick a preset template to populate your dashboard.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-4 w-full">
      {widgets.map(w => {
        // Map 1-12 column span
        let colSpanClass = 'lg:col-span-12';
        if (w.w <= 3) colSpanClass = 'lg:col-span-3 md:col-span-3';
        else if (w.w <= 4) colSpanClass = 'lg:col-span-4 md:col-span-3';
        else if (w.w <= 6) colSpanClass = 'lg:col-span-6 md:col-span-6';
        else if (w.w <= 8) colSpanClass = 'lg:col-span-8 md:col-span-6';

        return (
          <div key={w.id} className={`${colSpanClass} col-span-1`}>
            <DashboardWidgetRenderer
              widget={w}
              isLocked={isLocked}
              onRemove={() => onRemoveWidget(w.id)}
              onEditConfig={() => onEditWidgetConfig(w)}
              onDrillDown={onDrillDown}
            />
          </div>
        );
      })}
    </div>
  );
}
