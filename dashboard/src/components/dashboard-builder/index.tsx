"use client";

import React, { useState } from 'react';
import { DashboardState, WidgetConfig, DashboardTemplate } from './types';
import { DashboardHeader } from './header';
import { DashboardControls } from './controls';
import { DashboardGridCanvas } from './grid-canvas';
import { PRESET_TEMPLATES } from './templates';
import { WidgetConfigModal } from './config-modal';
import { DrilldownModal } from './drilldown-modal';
import { LayoutGrid, Sparkles, Plus, Check } from 'lucide-react';
import { toast } from '@/components/ui/toast';

interface UniversalDashboardBuilderProps {
  initialState?: DashboardState;
}

export function UniversalDashboardBuilder({ initialState }: UniversalDashboardBuilderProps) {
  const defaultDashboard: DashboardState = initialState || {
    id: 'dash_exec_1',
    title: 'Sales & Executive Performance',
    description: 'Real-time revenue monitoring, conversion funnels, regional customer maps, and AI insights.',
    owner: 'Rabiu Oladizz',
    lastUpdated: '10 sec ago',
    isLive: true,
    isFavorite: true,
    locked: false,
    globalFilters: {
      dateRange: '24h',
      comparePeriod: 'yesterday',
      autoRefresh: 10,
    },
    widgets: PRESET_TEMPLATES[0].widgets,
  };

  const [dashboard, setDashboard] = useState<DashboardState>(defaultDashboard);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [editingWidget, setEditingWidget] = useState<WidgetConfig | null>(null);
  const [drilldownState, setDrilldownState] = useState<{ isOpen: boolean; title: string }>({ isOpen: false, title: '' });
  const [isPresentationMode, setIsPresentationMode] = useState(false);

  // Handlers
  const handleUpdateTitle = (title: string) => {
    setDashboard(prev => ({ ...prev, title }));
  };

  const handleToggleFavorite = () => {
    setDashboard(prev => ({ ...prev, isFavorite: !prev.isFavorite }));
  };

  const handleToggleLock = () => {
    setDashboard(prev => ({ ...prev, locked: !prev.locked }));
  };

  const handleChangeFilter = (key: string, value: any) => {
    setDashboard(prev => ({
      ...prev,
      globalFilters: { ...prev.globalFilters, [key]: value }
    }));
  };

  const handleRemoveWidget = (id: string) => {
    setDashboard(prev => ({
      ...prev,
      widgets: prev.widgets.filter(w => w.id !== id)
    }));
  };

  const handleAddWidget = () => {
    const newWidget: WidgetConfig = {
      id: `w_custom_${Date.now()}`,
      type: 'kpi',
      title: 'New Metric Card',
      w: 4,
      h: 2,
      customProps: { value: '$9,820', trend: '+12.5%' }
    };
    setDashboard(prev => ({
      ...prev,
      widgets: [...prev.widgets, newWidget]
    }));
  };

  const handleSaveWidgetConfig = (updated: WidgetConfig) => {
    setDashboard(prev => ({
      ...prev,
      widgets: prev.widgets.map(w => w.id === updated.id ? updated : w)
    }));
  };

  const handleSelectTemplate = (template: DashboardTemplate) => {
    setDashboard(prev => ({
      ...prev,
      title: template.name,
      description: template.description,
      widgets: template.widgets
    }));
    setIsTemplateModalOpen(false);
  };

  return (
    <div className={`space-y-6 w-full font-sans ${isPresentationMode ? 'p-8 bg-black min-h-screen text-white' : ''}`}>
      {/* Presentation Mode Exit Banner */}
      {isPresentationMode && (
        <div className="fixed top-4 right-4 z-50 bg-[#2266ec] text-white px-4 py-1.5 rounded-full text-xs font-semibold shadow-2xl flex items-center gap-2">
          <span>Presentation Mode Active</span>
          <button onClick={() => setIsPresentationMode(false)} className="bg-black/30 hover:bg-black/50 px-2 py-0.5 rounded text-[11px]">Exit Esc</button>
        </div>
      )}

      {/* 1. Header Component */}
      {!isPresentationMode && (
        <DashboardHeader
          dashboard={dashboard}
          onUpdateTitle={handleUpdateTitle}
          onToggleFavorite={handleToggleFavorite}
          onToggleLock={handleToggleLock}
          onAddWidget={handleAddWidget}
          onSelectTemplateModal={() => setIsTemplateModalOpen(true)}
          onExportPdf={() => toast('Dashboard Exported to PDF / PNG', { type: 'success' })}
          onTogglePresentationMode={() => { setIsPresentationMode(true); toast('Entered Presentation Mode', { type: 'info' }); }}
        />
      )}

      {/* 2. Global Controls Toolbar */}
      {!isPresentationMode && (
        <DashboardControls
          globalFilters={dashboard.globalFilters}
          onChangeFilter={handleChangeFilter}
          onManualRefresh={() => toast('All widget data sources refreshed', { type: 'success' })}
        />
      )}

      {/* 3. Responsive 12-Column Grid Canvas */}
      <DashboardGridCanvas
        widgets={dashboard.widgets}
        isLocked={dashboard.locked}
        onRemoveWidget={handleRemoveWidget}
        onEditWidgetConfig={(w) => setEditingWidget(w)}
        onDrillDown={(title) => setDrilldownState({ isOpen: true, title })}
      />

      {/* 4. Widget Configuration Studio Modal */}
      <WidgetConfigModal
        isOpen={!!editingWidget}
        widget={editingWidget}
        onClose={() => setEditingWidget(null)}
        onSave={handleSaveWidgetConfig}
      />

      {/* 5. Interactive Drill-Down Breadcrumb Modal */}
      <DrilldownModal
        isOpen={drilldownState.isOpen}
        initialTitle={drilldownState.title}
        onClose={() => setDrilldownState({ isOpen: false, title: '' })}
      />

      {/* 6. Template Selection Modal */}
      {isTemplateModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-[#1a1a1a] border border-[#333] rounded-2xl w-full max-w-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#262626] pb-3">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <LayoutGrid className="w-4 h-4 text-purple-400" /> Preset Dashboard Templates
              </h3>
              <button onClick={() => setIsTemplateModalOpen(false)} className="text-[#a6a6a6] hover:text-white text-sm">✕</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {PRESET_TEMPLATES.map(tmpl => (
                <div
                  key={tmpl.id}
                  onClick={() => handleSelectTemplate(tmpl)}
                  className="bg-[#121212] border border-[#262626] hover:border-[#2266ec] p-4 rounded-xl cursor-pointer transition-all space-y-2 group shadow-md"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{tmpl.icon}</span>
                    <span className="font-bold text-white text-xs group-hover:text-[#2266ec] transition-colors">{tmpl.name}</span>
                  </div>
                  <p className="text-[11px] text-[#a6a6a6]">{tmpl.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
