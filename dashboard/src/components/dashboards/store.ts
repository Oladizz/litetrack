"use client";

import { useState, useEffect } from 'react';

export type Report = {
  id: string;
  name: string;
  chartType: 'area' | 'bar' | 'pie' | 'metric' | 'linear';
  metric: string;
  dimension: string;
  data: any[];
  layout?: { x: number; y: number; w: number; h: number };
};

export type Dashboard = {
  id: string;
  name: string;
  updatedAt: number;
  reports: Report[];
};

const defaultData = [
  { name: 'Mon', value: 400 },
  { name: 'Tue', value: 300 },
  { name: 'Wed', value: 550 },
  { name: 'Thu', value: 450 },
  { name: 'Fri', value: 700 },
];

const DEFAULT_DASHBOARDS: Dashboard[] = [
  {
    id: 'default-1',
    name: 'Marketing Dashboard',
    updatedAt: Date.now(),
    reports: [
      { id: 'r1', name: 'Total Conversions', chartType: 'metric', metric: 'visitors', dimension: 'none', data: [{ value: '1,204' }], layout: { x: 0, y: 0, w: 12, h: 1 } },
      { id: 'r2', name: 'Conversions Over Time', chartType: 'area', metric: 'pageviews', dimension: 'date', data: defaultData, layout: { x: 0, y: 1, w: 8, h: 3 } },
      { id: 'r3', name: 'Device Breakdown', chartType: 'pie', metric: 'visitors', dimension: 'device', data: [{ name: 'Desktop', value: 400 }, { name: 'Mobile', value: 300 }], layout: { x: 8, y: 1, w: 4, h: 3 } },
    ]
  }
];

export function useDashboardsStore() {
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('litetrack_dashboards');
    if (stored) {
      setDashboards(JSON.parse(stored));
    } else {
      setDashboards(DEFAULT_DASHBOARDS);
      localStorage.setItem('litetrack_dashboards', JSON.stringify(DEFAULT_DASHBOARDS));
    }
    setIsLoaded(true);
  }, []);

  const saveDashboards = (newDashboards: Dashboard[]) => {
    setDashboards(newDashboards);
    localStorage.setItem('litetrack_dashboards', JSON.stringify(newDashboards));
  };

  const addDashboard = (name: string) => {
    const newDash = { id: `dash-${Date.now()}`, name, updatedAt: Date.now(), reports: [] };
    saveDashboards([...dashboards, newDash]);
    return newDash;
  };

  const deleteDashboard = (id: string) => {
    saveDashboards(dashboards.filter(d => d.id !== id));
  };

  const updateDashboard = (id: string, updates: Partial<Dashboard>) => {
    saveDashboards(dashboards.map(d => d.id === id ? { ...d, ...updates, updatedAt: Date.now() } : d));
  };

  return { dashboards, isLoaded, addDashboard, deleteDashboard, updateDashboard };
}
