"use client";

import React, { useState, useEffect, useMemo, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, Activity, Settings, ChevronDown, Plus, Sparkles, Calendar, Clock, Pencil, Trash, Search, MoreHorizontal, TrendingUp, BarChart3, PieChart, Hash, LayoutPanelTop } from 'lucide-react';
import { useDashboardsStore, Report } from '@/components/dashboards/store';
import { GrafanaGrid, useReportLayouts, Layout } from '@/components/dashboards/grafana-grid';
import { ReportItem } from '@/components/dashboards/report-item';
import { Modal } from '@/components/ui/modal';
import { toast } from '@/components/ui/toast';

export default function CustomDashboardPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { dashboards, isLoaded, updateDashboard, deleteDashboard } = useDashboardsStore();
  const [projectMenuOpen, setProjectMenuOpen] = useState(false);
  const [search, setSearch] = useState('');
  
  const resolvedParams = use(params);
  const dashboardId = resolvedParams.id;
  const dashboard = dashboards.find(d => d.id === dashboardId);
  const reports = dashboard?.reports || [];

  const [isGridReady, setIsGridReady] = useState(false);
  const [enableTransitions, setEnableTransitions] = useState(false);
  
  // Modals
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isCreateReportOpen, setIsCreateReportOpen] = useState(false);
  
  const [dashboardNameInput, setDashboardNameInput] = useState("");
  const [reportNameInput, setReportNameInput] = useState("");
  const [reportType, setReportType] = useState<'area' | 'bar' | 'pie' | 'metric'>('area');

  useEffect(() => {
    if (isLoaded && !dashboard) {
      router.push('/dashboards');
    }
  }, [isLoaded, dashboard, router]);

  useEffect(() => {
    if (reports.length > 0 && !isGridReady) {
      const timer = setTimeout(() => {
        setIsGridReady(true);
        setTimeout(() => setEnableTransitions(true), 100);
      }, 50);
      return () => clearTimeout(timer);
    }
    if (reports.length === 0) setIsGridReady(true);
  }, [reports.length, isGridReady]);

  const filteredReports = useMemo(() => {
    if (!search.trim()) return reports;
    return reports.filter(r => r.name.toLowerCase().includes(search.toLowerCase()));
  }, [reports, search]);

  const layouts = useReportLayouts(filteredReports);

  const handleDragStop = (newLayout: any[]) => {
    if (!dashboard) return;
    const newReports = [...reports];
    newLayout.forEach(item => {
      const reportIndex = newReports.findIndex(r => r.id === item.i);
      if (reportIndex >= 0) {
        newReports[reportIndex] = {
          ...newReports[reportIndex],
          layout: { x: item.x, y: item.y, w: item.w, h: item.h }
        };
      }
    });
    updateDashboard(dashboardId, { reports: newReports });
  };

  const handleResizeStop = handleDragStop;

  const handleDeleteReport = (reportId: string) => {
    if (!dashboard) return;
    updateDashboard(dashboardId, {
      reports: reports.filter(r => r.id !== reportId)
    });
  };

  const handleDuplicateReport = (reportId: string) => {
    if (!dashboard) return;
    const reportToCopy = reports.find(r => r.id === reportId);
    if (reportToCopy) {
      const newReport = {
        ...reportToCopy,
        id: `r-${Date.now()}`,
        name: `${reportToCopy.name} (Copy)`,
        layout: { 
          x: reportToCopy.layout?.x ?? 0, 
          w: reportToCopy.layout?.w ?? 6, 
          h: reportToCopy.layout?.h ?? 4, 
          y: (reportToCopy.layout?.y ?? 0) + (reportToCopy.layout?.h ?? 0) 
        }
      };
      updateDashboard(dashboardId, {
        reports: [...reports, newReport]
      });
    }
  };

  // Modal Handlers
  const openCreateReport = () => {
    setReportNameInput("");
    setReportType('area');
    setIsCreateReportOpen(true);
  };

  const handleCreateReportConfirm = () => {
    if (!dashboard || !reportNameInput.trim()) return;
    
    // Generate some mock data based on type
    let data: any[] = [];
    if (reportType === 'metric') {
      data = [{ value: Math.floor(Math.random() * 10000) }];
    } else if (reportType === 'pie') {
      data = [{ name: 'A', value: 400 }, { name: 'B', value: 300 }, { name: 'C', value: 300 }];
    } else {
      data = [
        { name: 'Mon', value: Math.random() * 100 },
        { name: 'Tue', value: Math.random() * 100 },
        { name: 'Wed', value: Math.random() * 100 },
        { name: 'Thu', value: Math.random() * 100 },
        { name: 'Fri', value: Math.random() * 100 },
      ];
    }

    const newReport = {
      id: `r-${Date.now()}`,
      name: reportNameInput.trim(),
      chartType: reportType,
      data,
      layout: { x: 0, y: 0, w: reportType === 'metric' ? 3 : 6, h: reportType === 'metric' ? 1 : 3 }
    };
    updateDashboard(dashboardId, {
      reports: [newReport, ...reports]
    });
    setIsCreateReportOpen(false);
  };

  const openRenameDashboard = () => {
    setDashboardNameInput(dashboard?.name || "");
    setIsRenameOpen(true);
    setHeaderMenuOpen(false);
  };

  const handleRenameConfirm = () => {
    if (dashboardNameInput.trim()) {
      updateDashboard(dashboardId, { name: dashboardNameInput.trim() });
      setIsRenameOpen(false);
    }
  };

  const openDeleteDashboard = () => {
    setIsDeleteOpen(true);
    setHeaderMenuOpen(false);
  };

  const handleDeleteConfirm = () => {
    deleteDashboard(dashboardId);
    router.push('/dashboards');
  };

  const [headerMenuOpen, setHeaderMenuOpen] = useState(false);

  if (!isLoaded || !dashboard) return <div className="min-h-screen bg-[#121212]" />;

  return (
    <>
      {/* SIDEBAR */}
      {/* Main Content */}
      
        
        {/* STICKY HEADER */}
        <div className="sticky top-0 z-30 bg-[#121212]/90 backdrop-blur border-b border-[#262626] px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#656565]" />
              <input 
                type="text" 
                placeholder="Search reports..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="bg-[#1a1a1a] border border-[#262626] rounded-md pl-9 pr-3 py-1.5 text-[13px] text-white outline-none focus:border-[#404040] w-48 sm:w-64 transition-colors placeholder:text-[#656565]"
              />
            </div>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-[#1a1a1a] border border-[#262626] rounded-md text-[13px] font-medium text-white hover:bg-[#262626] transition-colors ml-2 hidden sm:flex">
              <Calendar className="w-3.5 h-3.5" /> Last 7 days
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-[#1a1a1a] border border-[#262626] rounded-md text-[13px] font-medium text-white hover:bg-[#262626] transition-colors hidden sm:flex">
              <Clock className="w-3.5 h-3.5" /> Day
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <button onClick={openCreateReport} className="flex items-center gap-2 px-3 py-1.5 bg-[#2266ec] hover:bg-[#2266ec]/90 rounded-md text-[13px] font-medium text-white transition-colors shadow-lg">
              <Plus className="w-3.5 h-3.5" /> Create report
            </button>
            <div className="relative">
              <button onClick={() => setHeaderMenuOpen(!headerMenuOpen)} className="p-1.5 bg-[#1a1a1a] hover:bg-[#262626] border border-[#262626] rounded-md text-[#a6a6a6] hover:text-white transition-colors">
                <MoreHorizontal className="w-4 h-4" />
              </button>
              {headerMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-[#262626] border border-[#333] rounded-md shadow-xl py-1 z-50" onMouseLeave={() => setHeaderMenuOpen(false)}>
                  <button onClick={openRenameDashboard} className="w-full text-left px-3 py-2 text-[13px] text-[#fafafa] hover:bg-[#333] flex items-center gap-2">
                    <Pencil className="w-3.5 h-3.5" /> Rename dashboard
                  </button>
                  <div className="border-t border-[#333] my-1"></div>
                  <button onClick={openDeleteDashboard} className="w-full text-left px-3 py-2 text-[13px] text-red-400 hover:bg-[#333] flex items-center gap-2">
                    <Trash className="w-3.5 h-3.5" /> Delete dashboard
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 max-w-[1600px] mx-auto space-y-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">{dashboard.name}</h1>
              <p className="text-sm text-[#a6a6a6] mt-1">View and manage your reports</p>
            </div>
          </div>

          {reports.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[50vh] border border-dashed border-[#333] rounded-xl mt-8">
              <LayoutPanelTop className="w-12 h-12 text-[#404040] mb-4" />
              <h3 className="text-lg font-medium text-white">No reports</h3>
              <p className="text-[#656565] text-sm mt-1 mb-6">You can visualize your data with a report.</p>
              <button onClick={openCreateReport} className="flex items-center gap-2 px-4 py-2 bg-[#2266ec] rounded-md text-[13px] font-medium text-white hover:bg-[#2266ec]/90 transition-colors shadow-lg">
                <Plus className="w-4 h-4" /> Create report
              </button>
            </div>
          ) : !isGridReady ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              {[1,2,3,4].map(i => <div key={i} className="h-64 bg-[#1a1a1a] rounded-xl border border-[#262626] animate-pulse" />)}
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="text-center py-20 text-[#656565]">
              No reports match "{search}". Try a different search.
            </div>
          ) : (
            <GrafanaGrid
              transitions={enableTransitions}
              layouts={layouts as any}
              onDragStop={handleDragStop}
              onResizeStop={handleResizeStop}
              isDraggable={!search}
              isResizable={!search}
            >
              {filteredReports.map((report) => (
                <div key={report.id}>
                  <ReportItem 
                    report={report} 
                    onDelete={handleDeleteReport}
                    onDuplicate={handleDuplicateReport}
                  />
                </div>
              ))}
            </GrafanaGrid>
          )}
        </div>
      

      {/* MODALS */}
      <Modal 
        isOpen={isRenameOpen} 
        onClose={() => setIsRenameOpen(false)}
        title="Rename Dashboard"
        footer={
          <>
            <button onClick={() => setIsRenameOpen(false)} className="px-4 py-2 text-[13px] font-medium text-[#a6a6a6] hover:text-white transition-colors">Cancel</button>
            <button onClick={handleRenameConfirm} className="px-4 py-2 bg-[#2266ec] text-white rounded-md text-[13px] font-medium hover:bg-[#2266ec]/90 transition-colors shadow-lg">Save Changes</button>
          </>
        }
      >
        <div className="space-y-3">
          <label className="block text-xs font-semibold text-[#a6a6a6] uppercase tracking-wider">Dashboard Name</label>
          <input 
            type="text" 
            value={dashboardNameInput}
            onChange={(e) => setDashboardNameInput(e.target.value)}
            className="w-full bg-[#121212] border border-[#333] rounded-md px-3 py-2 text-[13px] text-white outline-none focus:border-[#404040] transition-colors"
            autoFocus
          />
        </div>
      </Modal>

      <Modal 
        isOpen={isDeleteOpen} 
        onClose={() => setIsDeleteOpen(false)}
        title="Delete Dashboard"
        description={`Are you sure you want to delete "${dashboard.name}"? This action cannot be undone and will permanently remove all layout configurations for these reports.`}
        footer={
          <>
            <button onClick={() => setIsDeleteOpen(false)} className="px-4 py-2 text-[13px] font-medium text-[#a6a6a6] hover:text-white transition-colors">Cancel</button>
            <button onClick={handleDeleteConfirm} className="px-4 py-2 bg-red-500/90 text-white rounded-md text-[13px] font-medium hover:bg-red-500 transition-colors shadow-lg">Yes, Delete</button>
          </>
        }
      >
        <div className="py-2"></div>
      </Modal>

      <Modal 
        isOpen={isCreateReportOpen} 
        onClose={() => setIsCreateReportOpen(false)}
        title="Create Report"
        description="Select a visualization type and name your report."
        maxWidth="max-w-lg"
        footer={
          <>
            <button onClick={() => setIsCreateReportOpen(false)} className="px-4 py-2 text-[13px] font-medium text-[#a6a6a6] hover:text-white transition-colors">Cancel</button>
            <button onClick={handleCreateReportConfirm} disabled={!reportNameInput.trim()} className="px-4 py-2 bg-[#2266ec] text-white rounded-md text-[13px] font-medium hover:bg-[#2266ec]/90 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">Add to Dashboard</button>
          </>
        }
      >
        <div className="space-y-6">
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-[#a6a6a6] uppercase tracking-wider">Report Name</label>
            <input 
              type="text" 
              value={reportNameInput}
              onChange={(e) => setReportNameInput(e.target.value)}
              placeholder="e.g. Monthly Active Users"
              className="w-full bg-[#121212] border border-[#333] rounded-md px-3 py-2 text-[13px] text-white outline-none focus:border-[#404040] transition-colors placeholder:text-[#656565]"
              autoFocus
            />
          </div>
          
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-[#a6a6a6] uppercase tracking-wider">Visualization Type</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'area', name: 'Area Chart', icon: TrendingUp },
                { id: 'bar', name: 'Bar Chart', icon: BarChart3 },
                { id: 'pie', name: 'Pie Chart', icon: PieChart },
                { id: 'metric', name: 'KPI Metric', icon: Hash }
              ].map(type => (
                <button
                  key={type.id}
                  onClick={() => setReportType(type.id as any)}
                  className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                    reportType === type.id 
                      ? 'bg-[#2266ec]/10 border-[#2266ec] shadow-[0_0_15px_rgba(34,102,236,0.15)]' 
                      : 'bg-[#1a1a1a] border-[#333] hover:border-[#404040]'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${reportType === type.id ? 'bg-[#2266ec]' : 'bg-[#262626]'}`}>
                    <type.icon className={`w-4 h-4 ${reportType === type.id ? 'text-white' : 'text-[#a6a6a6]'}`} />
                  </div>
                  <div>
                    <div className={`text-[13px] font-medium ${reportType === type.id ? 'text-white' : 'text-[#fafafa]'}`}>{type.name}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </Modal>

    </>
  );
}
