"use client";

import React, { useState } from 'react';
import { LayoutDashboard, Activity, Settings, ChevronDown, Plus, LayoutPanelTopIcon, Pencil, Trash, BarChart3, PieChart, Hash, TrendingUp, Sparkles, DollarSign } from 'lucide-react';
import { useDashboardsStore, Dashboard } from '@/components/dashboards/store';
import { toast } from '@/components/ui/toast';
import { Modal } from '@/components/ui/modal';
import Link from 'next/link';

export default function DashboardsListPage() {
  const { dashboards, isLoaded, addDashboard, deleteDashboard, updateDashboard } = useDashboardsStore();
  const [projectMenuOpen, setProjectMenuOpen] = useState(false);

  // Modal states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  
  const [activeDashboard, setActiveDashboard] = useState<Dashboard | null>(null);
  const [dashboardNameInput, setDashboardNameInput] = useState("");

  const openCreateModal = () => {
    setDashboardNameInput("");
    setIsCreateOpen(true);
  };

  const handleCreateConfirm = () => {
    if (dashboardNameInput.trim()) {
      addDashboard(dashboardNameInput.trim());
      setIsCreateOpen(false);
      toast('Dashboard created', { type: 'success' });
    }
  };

  const openEditModal = (dashboard: Dashboard) => {
    setActiveDashboard(dashboard);
    setDashboardNameInput(dashboard.name);
    setIsEditOpen(true);
  };

  const handleEditConfirm = () => {
    if (activeDashboard && dashboardNameInput.trim()) {
      updateDashboard(activeDashboard.id, { name: dashboardNameInput.trim() });
      setIsEditOpen(false);
      toast('Dashboard updated', { type: 'success' });
    }
  };

  const openDeleteModal = (dashboard: Dashboard) => {
    setActiveDashboard(dashboard);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (activeDashboard) {
      deleteDashboard(activeDashboard.id);
      setIsDeleteOpen(false);
      toast('Dashboard deleted', { type: 'info', action: { label: 'Undo', onClick: () => {
        addDashboard(activeDashboard.name);
      }}});
    }
  };

  return (
    <>
      {/* SIDEBAR */}
      {/* Main Content */}
      
        <div className="p-8 max-w-[1600px] mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Dashboards</h1>
              <p className="text-[#a6a6a6] text-sm mt-1">Access all your custom dashboards here</p>
            </div>
            <button onClick={openCreateModal} className="flex items-center gap-2 px-4 py-2 bg-[#2266ec] rounded-md text-[13px] font-medium text-white hover:bg-[#2266ec]/90 transition-colors shadow-lg">
              <Plus className="w-4 h-4" /> Create dashboard
            </button>
          </div>

          {!isLoaded ? (
            <div className="animate-pulse space-y-4">
              <div className="h-40 bg-[#1a1a1a] rounded-xl border border-[#262626]"></div>
              <div className="h-40 bg-[#1a1a1a] rounded-xl border border-[#262626]"></div>
            </div>
          ) : dashboards.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 border border-dashed border-[#333] rounded-xl">
              <LayoutPanelTopIcon className="w-12 h-12 text-[#404040] mb-4" />
              <h3 className="text-lg font-medium text-white">No dashboards</h3>
              <p className="text-[#656565] text-sm mt-1 mb-6">You have not created any custom dashboards yet.</p>
              <button onClick={openCreateModal} className="flex items-center gap-2 px-4 py-2 bg-[#262626] hover:bg-[#333] rounded-md text-[13px] font-medium text-white transition-colors border border-[#333]">
                <Plus className="w-4 h-4" /> Create dashboard
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dashboards.map(dashboard => (
                <div key={dashboard.id} className="group flex flex-col bg-[#1a1a1a] border border-[#262626] rounded-xl overflow-hidden hover:border-[#404040] transition-colors relative shadow-md">
                  <Link href={`/dashboards/${dashboard.id}`} className="flex-1 p-5">
                    <div className="font-semibold text-lg text-white mb-1">{dashboard.name}</div>
                    <div className="text-xs text-[#656565] mb-6">Updated {new Date(dashboard.updatedAt).toLocaleDateString()}</div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      {dashboard.reports.slice(0, 4).map(report => {
                        const Icon = report.chartType === 'area' ? TrendingUp : report.chartType === 'bar' ? BarChart3 : report.chartType === 'pie' ? PieChart : Hash;
                        return (
                          <div key={report.id} className="flex items-center gap-2 bg-[#262626]/50 rounded-md p-2">
                            <Icon className="w-4 h-4 text-[#a6a6a6]" />
                            <span className="text-[11px] text-[#fafafa] truncate">{report.name}</span>
                          </div>
                        )
                      })}
                      {dashboard.reports.length > 4 && (
                        <div className="flex items-center gap-2 bg-[#262626]/50 rounded-md p-2">
                          <Plus className="w-4 h-4 text-[#a6a6a6]" />
                          <span className="text-[11px] text-[#a6a6a6] truncate">{dashboard.reports.length - 4} more</span>
                        </div>
                      )}
                    </div>
                  </Link>
                  <div className="flex border-t border-[#262626] bg-[#1a1a1a]">
                    <button 
                      onClick={() => openEditModal(dashboard)}
                      className="flex-1 py-2.5 flex justify-center items-center gap-2 text-xs font-medium text-[#a6a6a6] hover:text-white hover:bg-[#262626] transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5" /> Edit
                    </button>
                    <div className="w-px bg-[#262626]"></div>
                    <button 
                      onClick={() => openDeleteModal(dashboard)}
                      className="flex-1 py-2.5 flex justify-center items-center gap-2 text-xs font-medium text-red-500/80 hover:text-red-400 hover:bg-[#262626] transition-colors"
                    >
                      <Trash className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      

      {/* Modals */}
      <Modal 
        isOpen={isCreateOpen} 
        onClose={() => setIsCreateOpen(false)}
        title="Create Dashboard"
        description="Create a new custom dashboard to organize your reports."
        footer={
          <>
            <button onClick={() => setIsCreateOpen(false)} className="px-4 py-2 text-[13px] font-medium text-[#a6a6a6] hover:text-white transition-colors">Cancel</button>
            <button onClick={handleCreateConfirm} className="px-4 py-2 bg-[#2266ec] text-white rounded-md text-[13px] font-medium hover:bg-[#2266ec]/90 transition-colors shadow-lg">Create</button>
          </>
        }
      >
        <div className="space-y-3">
          <label className="block text-xs font-semibold text-[#a6a6a6] uppercase tracking-wider">Dashboard Name</label>
          <input 
            type="text" 
            value={dashboardNameInput}
            onChange={(e) => setDashboardNameInput(e.target.value)}
            placeholder="e.g. Q3 Marketing Performance"
            className="w-full bg-[#121212] border border-[#333] rounded-md px-3 py-2 text-[13px] text-white outline-none focus:border-[#404040] transition-colors placeholder:text-[#656565]"
            autoFocus
          />
        </div>
      </Modal>

      <Modal 
        isOpen={isEditOpen} 
        onClose={() => setIsEditOpen(false)}
        title="Rename Dashboard"
        footer={
          <>
            <button onClick={() => setIsEditOpen(false)} className="px-4 py-2 text-[13px] font-medium text-[#a6a6a6] hover:text-white transition-colors">Cancel</button>
            <button onClick={handleEditConfirm} className="px-4 py-2 bg-[#2266ec] text-white rounded-md text-[13px] font-medium hover:bg-[#2266ec]/90 transition-colors shadow-lg">Save Changes</button>
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
        description={`Are you sure you want to delete "${activeDashboard?.name}"? This action cannot be undone and will permanently remove all layout configurations for these reports.`}
        footer={
          <>
            <button onClick={() => setIsDeleteOpen(false)} className="px-4 py-2 text-[13px] font-medium text-[#a6a6a6] hover:text-white transition-colors">Cancel</button>
            <button onClick={handleDeleteConfirm} className="px-4 py-2 bg-red-500/90 text-white rounded-md text-[13px] font-medium hover:bg-red-500 transition-colors shadow-lg">Yes, Delete</button>
          </>
        }
      >
        <div className="py-2"></div>
      </Modal>

    </>
  );
}
