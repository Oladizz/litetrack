"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

type WorkspaceFilters = {
  [key: string]: string;
};

type WorkspaceState = {
  project: string;
  projectName: string;
  dateRange: string;
  filters: WorkspaceFilters;
};

type WorkspaceContextType = {
  state: WorkspaceState;
  setProject: (project: string, projectName?: string) => void;
  setDateRange: (range: string) => void;
  setFilter: (key: string, value: string) => void;
  removeFilter: (key: string) => void;
  clearFilters: () => void;
};

const defaultState: WorkspaceState = {
  project: 'Workspace Admin',
  projectName: 'Workspace Admin',
  dateRange: 'Last 7 days',
  filters: {},
};

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<WorkspaceState>(defaultState);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('litetrack_workspace_state');
      if (stored) {
        setState(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load workspace state', e);
    }
    setIsInitialized(true);
  }, []);

  // Save to local storage on change
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('litetrack_workspace_state', JSON.stringify(state));
    }
  }, [state, isInitialized]);

  const setProject = (project: string, projectName?: string) => setState(s => ({ ...s, project, projectName: projectName || s.projectName }));
  const setDateRange = (dateRange: string) => setState(s => ({ ...s, dateRange }));
  const setFilter = (key: string, value: string) => setState(s => ({ ...s, filters: { ...s.filters, [key]: value } }));
  const removeFilter = (key: string) => {
    setState(s => {
      const newFilters = { ...s.filters };
      delete newFilters[key];
      return { ...s, filters: newFilters };
    });
  };
  const clearFilters = () => setState(s => ({ ...s, filters: {} }));

  return (
    <WorkspaceContext.Provider value={{ state, setProject, setDateRange, setFilter, removeFilter, clearFilters }}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
}
