"use client";

import React, { useMemo } from 'react';
import { Responsive, WidthProvider, Layout } from 'react-grid-layout/legacy';

const ResponsiveGridLayout = WidthProvider(Responsive);

export type { Layout };

export const useReportLayouts = (reports: any[]) => {
  return useMemo(() => {
    const baseLayout = reports.map((report, index) => ({
      i: report.id,
      x: report.layout?.x ?? (index % 2) * 6,
      y: report.layout?.y ?? Math.floor(index / 2) * 4,
      w: report.layout?.w ?? 6,
      h: report.layout?.h ?? 4,
      minW: 3,
      minH: 2,
    }));

    return {
      lg: baseLayout,
      md: baseLayout,
      sm: baseLayout.map((item) => ({ ...item, w: Math.min(item.w, 6) })),
      xs: baseLayout.map((item) => ({ ...item, w: 4, x: 0 })),
      xxs: baseLayout.map((item) => ({ ...item, w: 2, x: 0 })),
    };
  }, [reports]);
};

interface GrafanaGridProps {
  layouts: any;
  children: React.ReactNode;
  transitions?: boolean;
  onLayoutChange?: (layout: any, layouts: any) => void;
  onDragStop?: (layout: any) => void;
  onResizeStop?: (layout: any) => void;
  isDraggable?: boolean;
  isResizable?: boolean;
}

export function GrafanaGrid({
  layouts,
  children,
  transitions,
  onLayoutChange,
  onDragStop,
  onResizeStop,
  isDraggable,
  isResizable,
}: GrafanaGridProps) {
  return (
    <>
      <style>{`
        .react-grid-item {
          transition: ${transitions ? 'transform 200ms ease, width 200ms ease, height 200ms ease' : 'none'} !important;
        }
        .react-grid-item.react-grid-placeholder {
          background: none !important;
          opacity: 0.5;
          transition-duration: 100ms;
          border-radius: 0.75rem;
          border: 1px dashed #2266ec;
        }
        .react-grid-item.resizing {
          transition: none !important;
        }
        .react-grid-item > .react-resizable-handle {
          opacity: 0;
          transition: opacity 0.2s;
          z-index: 50;
        }
        .react-grid-item:hover > .react-resizable-handle {
          opacity: 1;
        }
      `}</style>
      <div className="-m-4">
        <ResponsiveGridLayout
          className="layout"
          layouts={layouts}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 12, md: 12, sm: 6, xs: 4, xxs: 2 }}
          rowHeight={100}
          draggableHandle=".drag-handle"
          compactType="vertical"
          preventCollision={false}
          margin={[16, 16]}
          transformScale={1}
          useCSSTransforms={true}
          onLayoutChange={onLayoutChange}
          onDragStop={onDragStop}
          onResizeStop={onResizeStop}
          isDraggable={isDraggable}
          isResizable={isResizable}
        >
          {children}
        </ResponsiveGridLayout>
      </div>
    </>
  );
}
