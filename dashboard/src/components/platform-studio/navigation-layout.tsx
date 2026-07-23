"use client";

import React, { useState } from 'react';
import {
  GripVertical, LayoutDashboard, Users, ShoppingCart, Package, BarChart3,
  Settings, Plus, Pencil, Trash2, ChevronDown, ChevronRight, Eye, EyeOff,
  Columns2, PanelLeft, PanelTop, Maximize, LayoutGrid, AppWindow
} from 'lucide-react';
import { NavItem, LayoutMode } from './types';
import { toast } from '@/components/ui/toast';

function buildNavTree(): NavItem[] {
  return [
    {
      id: 'nav_1', label: 'Dashboard', route: '/dashboard', icon: 'LayoutDashboard',
      children: [
        { id: 'nav_1a', label: 'Overview', route: '/dashboard/overview', icon: 'LayoutDashboard' },
        { id: 'nav_1b', label: 'Analytics', route: '/dashboard/analytics', icon: 'BarChart3', badge: 'New' },
      ],
    },
    {
      id: 'nav_2', label: 'Users', route: '/users', icon: 'Users', requiredRole: 'Admin',
      children: [
        { id: 'nav_2a', label: 'All Users', route: '/users/all', icon: 'Users' },
        { id: 'nav_2b', label: 'Teams', route: '/users/teams', icon: 'Users' },
        { id: 'nav_2c', label: 'Roles', route: '/users/roles', icon: 'Users', requiredRole: 'Super Admin' },
      ],
    },
    { id: 'nav_3', label: 'Orders', route: '/orders', icon: 'ShoppingCart', badge: '142' },
    {
      id: 'nav_4', label: 'Products', route: '/products', icon: 'Package',
      children: [
        { id: 'nav_4a', label: 'Catalog', route: '/products/catalog', icon: 'Package' },
        { id: 'nav_4b', label: 'Inventory', route: '/products/inventory', icon: 'Package' },
      ],
    },
    { id: 'nav_5', label: 'Reports', route: '/reports', icon: 'BarChart3' },
    {
      id: 'nav_6', label: 'Settings', route: '/settings', icon: 'Settings', requiredRole: 'Admin',
      children: [
        { id: 'nav_6a', label: 'General', route: '/settings/general', icon: 'Settings' },
        { id: 'nav_6b', label: 'Billing', route: '/settings/billing', icon: 'Settings' },
        { id: 'nav_6c', label: 'Integrations', route: '/settings/integrations', icon: 'Settings' },
      ],
    },
  ];
}

const iconMap: Record<string, React.ReactNode> = {
  LayoutDashboard: <LayoutDashboard className="w-3.5 h-3.5" />,
  Users: <Users className="w-3.5 h-3.5" />,
  ShoppingCart: <ShoppingCart className="w-3.5 h-3.5" />,
  Package: <Package className="w-3.5 h-3.5" />,
  BarChart3: <BarChart3 className="w-3.5 h-3.5" />,
  Settings: <Settings className="w-3.5 h-3.5" />,
};

interface LayoutOption {
  mode: LayoutMode;
  label: string;
  icon: React.ReactNode;
  desc: string;
  areas: { bg: string; w: string; h: string; pos: string }[];
}

const layouts: LayoutOption[] = [
  {
    mode: 'sidebar', label: 'Sidebar', icon: <PanelLeft className="w-4 h-4" />, desc: 'Classic left sidebar with main content area',
    areas: [
      { bg: 'bg-[#2266ec]', w: 'w-[30%]', h: 'h-full', pos: 'left-0 top-0' },
      { bg: 'bg-[#262626]', w: 'w-[70%]', h: 'h-full', pos: 'right-0 top-0' },
    ],
  },
  {
    mode: 'top_nav', label: 'Top Navigation', icon: <PanelTop className="w-4 h-4" />, desc: 'Horizontal navigation with content below',
    areas: [
      { bg: 'bg-[#2266ec]', w: 'w-full', h: 'h-[25%]', pos: 'left-0 top-0' },
      { bg: 'bg-[#262626]', w: 'w-full', h: 'h-[75%]', pos: 'left-0 bottom-0' },
    ],
  },
  {
    mode: 'split_view', label: 'Split View', icon: <Columns2 className="w-4 h-4" />, desc: 'Two equal-width content columns',
    areas: [
      { bg: 'bg-[#2266ec]/60', w: 'w-[50%]', h: 'h-full', pos: 'left-0 top-0' },
      { bg: 'bg-[#262626]', w: 'w-[50%]', h: 'h-full', pos: 'right-0 top-0' },
    ],
  },
  {
    mode: 'three_column', label: 'Three Column', icon: <LayoutGrid className="w-4 h-4" />, desc: 'Three-pane layout for complex workflows',
    areas: [
      { bg: 'bg-[#2266ec]', w: 'w-[25%]', h: 'h-full', pos: 'left-0 top-0' },
      { bg: 'bg-[#262626]', w: 'w-[50%]', h: 'h-full', pos: 'left-[25%] top-0' },
      { bg: 'bg-[#1a1a1a]', w: 'w-[25%]', h: 'h-full', pos: 'right-0 top-0' },
    ],
  },
  {
    mode: 'workspace', label: 'Workspace', icon: <AppWindow className="w-4 h-4" />, desc: 'Sidebar with tabbed workspace content',
    areas: [
      { bg: 'bg-[#2266ec]', w: 'w-[20%]', h: 'h-full', pos: 'left-0 top-0' },
      { bg: 'bg-[#333]', w: 'w-[80%]', h: 'h-[20%]', pos: 'right-0 top-0' },
      { bg: 'bg-[#262626]', w: 'w-[80%]', h: 'h-[80%]', pos: 'right-0 bottom-0' },
    ],
  },
  {
    mode: 'fullscreen', label: 'Fullscreen', icon: <Maximize className="w-4 h-4" />, desc: 'Single full-screen content panel',
    areas: [
      { bg: 'bg-[#262626]', w: 'w-full', h: 'h-full', pos: 'left-0 top-0' },
    ],
  },
];

export function NavigationLayoutStudio() {
  const [navTree, setNavTree] = useState<NavItem[]>(buildNavTree);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ nav_1: true, nav_2: true, nav_4: true, nav_6: true });
  const [hidden, setHidden] = useState<Record<string, boolean>>({});
  const [activeLayout, setActiveLayout] = useState<LayoutMode>('sidebar');

  const toggleExpand = (id: string) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  const toggleHide = (id: string) => {
    setHidden(prev => ({ ...prev, [id]: !prev[id] }));
    toast(`Nav item ${hidden[id] ? 'shown' : 'hidden'}`, { type: 'info' });
  };

  const renderItem = (item: NavItem, depth: number) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expanded[item.id];
    const isHidden = hidden[item.id];
    return (
      <div key={item.id}>
        <div
          className={`flex items-center gap-2 py-2 px-3 rounded-lg text-xs border transition-all group ${
            isHidden ? 'opacity-40 border-dashed border-[#333]' : 'border-transparent hover:bg-[#1a1a1a] hover:border-[#262626]'
          }`}
          style={{ paddingLeft: `${12 + depth * 24}px` }}
        >
          <GripVertical className="w-3.5 h-3.5 text-[#333] cursor-grab shrink-0" />

          {hasChildren ? (
            <button onClick={() => toggleExpand(item.id)} className="shrink-0 text-[#656565] hover:text-white">
              {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </button>
          ) : (
            <span className="w-3.5 shrink-0" />
          )}

          <span className="text-[#a6a6a6] shrink-0">{iconMap[item.icon] ?? <LayoutDashboard className="w-3.5 h-3.5" />}</span>
          <span className="font-semibold text-white">{item.label}</span>
          <span className="text-[10px] text-[#656565] font-mono">{item.route}</span>

          {item.badge && (
            <span className="text-[9px] bg-[#2266ec]/20 text-[#2266ec] px-1.5 py-0.5 rounded-full font-bold">{item.badge}</span>
          )}
          {item.requiredRole && (
            <span className="text-[9px] bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded font-mono">{item.requiredRole}</span>
          )}

          <div className="ml-auto flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => toggleHide(item.id)} className="p-1 rounded hover:bg-[#262626] text-[#656565]" title="Toggle visibility">
              {isHidden ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
            </button>
            <button className="p-1 rounded hover:bg-[#262626] text-[#656565]" title="Edit">
              <Pencil className="w-3 h-3" />
            </button>
            <button className="p-1 rounded hover:bg-[#262626] text-red-400/60" title="Delete">
              <Trash2 className="w-3 h-3" />
            </button>
            {!hasChildren && (
              <button className="p-1 rounded hover:bg-[#262626] text-[#2266ec]" title="Add child">
                <Plus className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {hasChildren && isExpanded && item.children!.map(child => renderItem(child, depth + 1))}
      </div>
    );
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Navigation Tree Builder */}
      <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between border-b border-[#262626] pb-3">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <PanelLeft className="w-4 h-4 text-[#2266ec]" /> Visual Navigation Builder
          </h3>
          <button
            onClick={() => toast('Add root nav item', { type: 'info' })}
            className="text-[10px] bg-[#2266ec] text-white px-3 py-1 rounded-lg font-semibold flex items-center gap-1"
          >
            <Plus className="w-3 h-3" /> Add Item
          </button>
        </div>

        <div className="bg-[#121212] border border-[#262626] rounded-lg p-2 max-h-[420px] overflow-y-auto space-y-0.5">
          {navTree.map(item => renderItem(item, 0))}
        </div>
      </div>

      {/* Layout Mode Selector */}
      <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-5 shadow-xl space-y-4">
        <div className="border-b border-[#262626] pb-3">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <LayoutGrid className="w-4 h-4 text-purple-400" /> Application Layout Mode
          </h3>
          <p className="text-[10px] text-[#656565] mt-1">Select the structural layout for the currently selected application.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
          {layouts.map(lo => {
            const isActive = activeLayout === lo.mode;
            return (
              <button
                key={lo.mode}
                onClick={() => { setActiveLayout(lo.mode); toast(`Layout changed to ${lo.label}`, { type: 'success' }); }}
                className={`text-left p-3 rounded-xl border transition-all space-y-2.5 ${
                  isActive
                    ? 'border-[#2266ec] bg-[#121212] shadow-lg shadow-[#2266ec]/10 ring-1 ring-[#2266ec]/30'
                    : 'border-[#262626] bg-[#121212] hover:border-[#333]'
                }`}
              >
                {/* Mini visual */}
                <div className="relative w-full h-12 rounded-md bg-[#0f0f0f] overflow-hidden border border-[#262626]">
                  {lo.areas.map((a, i) => (
                    <div key={i} className={`absolute ${a.bg} ${a.w} ${a.h} ${a.pos} ${isActive ? 'opacity-100' : 'opacity-50'}`} />
                  ))}
                </div>
                <div>
                  <div className="text-[11px] font-bold text-white flex items-center gap-1.5">{lo.icon} {lo.label}</div>
                  <div className="text-[9px] text-[#656565] leading-tight mt-0.5">{lo.desc}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
