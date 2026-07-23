"use client";

import React, { useState, useCallback } from 'react';
import {
  Workspace, PanelInstance, PanelDefinition, NavItem, AIInsight, RunningAgent,
  DockItem, AILevel
} from './types';
import { CommandBar } from './command-bar';
import { WorkspaceNavigator } from './workspace-navigator';
import { ActiveCanvas } from './active-canvas';
import { AILane } from './ai-lane';
import { DynamicDock } from './dynamic-dock';
import { toast } from '@/components/ui/toast';

// === Panel Registry: All panels contributed by the 10 tools ===
const PANEL_DEFINITIONS: PanelDefinition[] = [
  { id: 'def_data_grid', type: 'data_grid', title: 'Data Grid', icon: '📊', toolOrigin: 'Data Manager', description: 'Tabular data view', defaultSize: 'lg', resizable: true, closable: true, floatable: true, duplicatable: true },
  { id: 'def_chart', type: 'chart', title: 'Revenue Chart', icon: '📈', toolOrigin: 'Dashboard Builder', description: 'Interactive chart', defaultSize: 'md', resizable: true, closable: true, floatable: true, duplicatable: true },
  { id: 'def_activity', type: 'activity_feed', title: 'Activity Feed', icon: '⚡', toolOrigin: 'Collaboration Hub', description: 'Universal activity stream', defaultSize: 'md', resizable: true, closable: true, floatable: true, duplicatable: false },
  { id: 'def_ai_insight', type: 'ai_insight', title: 'AI Findings', icon: '🧠', toolOrigin: 'AI Agent Studio', description: 'AI-generated insights', defaultSize: 'md', resizable: true, closable: true, floatable: true, duplicatable: false },
  { id: 'def_tasks', type: 'task_board', title: 'Task Board', icon: '✅', toolOrigin: 'Collaboration Hub', description: 'Kanban task board', defaultSize: 'lg', resizable: true, closable: true, floatable: true, duplicatable: false },
  { id: 'def_timeline', type: 'timeline', title: 'Investigation Timeline', icon: '🕐', toolOrigin: 'Collaboration Hub', description: 'Event timeline', defaultSize: 'md', resizable: true, closable: true, floatable: true, duplicatable: true },
  { id: 'def_ecosystem', type: 'ecosystem_kpi', title: 'Ecosystem KPIs', icon: '🌐', toolOrigin: 'Enterprise Control', description: 'Platform-wide KPIs', defaultSize: 'md', resizable: true, closable: true, floatable: true, duplicatable: false },
  { id: 'def_twin', type: 'digital_twin', title: 'Digital Twin', icon: '🔮', toolOrigin: 'Enterprise Control', description: 'Live platform model', defaultSize: 'lg', resizable: true, closable: true, floatable: true, duplicatable: false },
  { id: 'def_notes', type: 'notes', title: 'Notes', icon: '📝', toolOrigin: 'Collaboration Hub', description: 'Markdown notes', defaultSize: 'sm', resizable: true, closable: true, floatable: true, duplicatable: true },
  { id: 'def_approvals', type: 'approval_chain', title: 'Approval Pipeline', icon: '🔐', toolOrigin: 'Collaboration Hub', description: 'Visual approval chain', defaultSize: 'md', resizable: true, closable: true, floatable: true, duplicatable: false },
  { id: 'def_agents', type: 'agent_registry', title: 'AI Fleet', icon: '🤖', toolOrigin: 'AI Agent Studio', description: 'AI agent registry', defaultSize: 'md', resizable: true, closable: true, floatable: true, duplicatable: false },
  { id: 'def_security', type: 'security_alert', title: 'Security Alerts', icon: '🛡️', toolOrigin: 'Enterprise Control', description: 'Security operations', defaultSize: 'md', resizable: true, closable: true, floatable: true, duplicatable: false },
];

// === Pre-assembled Workspaces ===
const DEFAULT_WORKSPACES: Workspace[] = [
  {
    id: 'ws_revenue', title: 'Investigate Revenue Drop', description: 'Q2 SMB churn investigation workspace', icon: '🔍',
    status: 'active',
    panels: [
      { id: 'p1', definitionId: 'def_data_grid', position: { x: 0, y: 0 }, size: { width: 600, height: 400 }, state: 'docked', zIndex: 1, isPinned: false },
      { id: 'p2', definitionId: 'def_chart', position: { x: 600, y: 0 }, size: { width: 600, height: 400 }, state: 'docked', zIndex: 2, isPinned: false },
      { id: 'p3', definitionId: 'def_ai_insight', position: { x: 0, y: 400 }, size: { width: 600, height: 400 }, state: 'docked', zIndex: 3, isPinned: true },
      { id: 'p4', definitionId: 'def_timeline', position: { x: 600, y: 400 }, size: { width: 600, height: 400 }, state: 'docked', zIndex: 4, isPinned: false },
    ],
    context: { filters: { segment: 'SMB', period: 'Q2 2026' }, selection: [], scrollPositions: {}, aiContext: 'Investigating 18% churn increase in SMB segment', recentHistory: ['Opened churn data', 'Generated AI report', 'Compared Q1 vs Q2'], activeGoal: 'Identify root causes of revenue decline' },
    createdAt: '2 hours ago', lastAccessedAt: 'Just now', createdBy: 'ai',
  },
  {
    id: 'ws_executive', title: 'Executive Overview', description: 'Daily executive command center', icon: '👑',
    status: 'active',
    panels: [
      { id: 'p5', definitionId: 'def_ecosystem', position: { x: 0, y: 0 }, size: { width: 800, height: 300 }, state: 'docked', zIndex: 1, isPinned: true },
      { id: 'p6', definitionId: 'def_twin', position: { x: 0, y: 300 }, size: { width: 400, height: 400 }, state: 'docked', zIndex: 2, isPinned: false },
      { id: 'p7', definitionId: 'def_agents', position: { x: 400, y: 300 }, size: { width: 400, height: 400 }, state: 'docked', zIndex: 3, isPinned: false },
    ],
    context: { filters: {}, selection: [], scrollPositions: {}, aiContext: 'Monitoring full platform health', recentHistory: ['Morning briefing reviewed', 'AI costs checked'], activeGoal: 'Maintain platform health above 95%' },
    createdAt: 'Today 9:00 AM', lastAccessedAt: '30 mins ago', createdBy: 'user',
  },
  {
    id: 'ws_security', title: 'Security Investigation', description: 'Investigating API key abuse and credential stuffing', icon: '🛡️',
    status: 'active',
    panels: [
      { id: 'p8', definitionId: 'def_security', position: { x: 0, y: 0 }, size: { width: 600, height: 400 }, state: 'docked', zIndex: 1, isPinned: true },
      { id: 'p9', definitionId: 'def_activity', position: { x: 600, y: 0 }, size: { width: 600, height: 400 }, state: 'docked', zIndex: 2, isPinned: false },
    ],
    context: { filters: { severity: 'critical,high' }, selection: [], scrollPositions: {}, aiContext: 'Monitoring security events', recentHistory: ['Resolved credential stuffing', 'Flagged API key abuse'], activeGoal: 'Resolve 2 unresolved security events' },
    createdAt: '4 hours ago', lastAccessedAt: '1 hour ago', createdBy: 'ai',
  },
  {
    id: 'ws_tasks', title: 'Sprint Board', description: 'Current sprint task management', icon: '📋',
    status: 'saved',
    panels: [
      { id: 'p10', definitionId: 'def_tasks', position: { x: 0, y: 0 }, size: { width: 1200, height: 600 }, state: 'docked', zIndex: 1, isPinned: false },
      { id: 'p11', definitionId: 'def_notes', position: { x: 0, y: 600 }, size: { width: 600, height: 200 }, state: 'docked', zIndex: 2, isPinned: false },
    ],
    context: { filters: { sprint: '16' }, selection: [], scrollPositions: {}, aiContext: 'Sprint 16 management', recentHistory: ['Added Slack integration task', 'Moved webhook fix to review'], activeGoal: 'Complete Sprint 16 on time' },
    createdAt: '2 days ago', lastAccessedAt: 'Yesterday', createdBy: 'user',
  },
];

export function WorkspaceEngine() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>(DEFAULT_WORKSPACES);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState('ws_revenue');
  const [aiLevel, setAiLevel] = useState<AILevel>('assistive');

  const activeWorkspace = workspaces.find(w => w.id === activeWorkspaceId);

  // === Navigation Items ===
  const navItems: NavItem[] = [
    { id: 'nav_1', label: 'Investigate Revenue Drop', icon: '🔍', section: 'pinned', workspaceId: 'ws_revenue' },
    { id: 'nav_2', label: 'Executive Overview', icon: '👑', section: 'pinned', workspaceId: 'ws_executive' },
    { id: 'nav_3', label: 'Security Investigation', icon: '🛡️', section: 'investigations', workspaceId: 'ws_security', badge: '2' },
    { id: 'nav_4', label: 'Sprint Board', icon: '📋', section: 'recent', workspaceId: 'ws_tasks' },
    { id: 'nav_5', label: 'Customer #C-4021', icon: '👤', section: 'recent' },
    { id: 'nav_6', label: 'Q2 Dashboards', icon: '📈', section: 'favorites' },
    { id: 'nav_7', label: 'Revenue Reports', icon: '💰', section: 'collections' },
    { id: 'nav_8', label: 'AI Churn Analysis', icon: '🤖', section: 'ai_workspaces', workspaceId: 'ws_revenue' },
  ];

  // === AI Lane Data ===
  const insights: AIInsight[] = [
    { id: 'ins_1', message: 'SMB churn rate increased 18% — concentrated at Day 14 post-signup.', severity: 'warning', source: 'Analytics AI', confidence: 92, timestamp: '10 mins ago', actionable: true, suggestedAction: 'Open Churn Dashboard' },
    { id: 'ins_2', message: 'CRM Engine latency elevated (142ms). Unindexed query on contacts table.', severity: 'warning', source: 'Developer AI', confidence: 91, timestamp: '25 mins ago', actionable: true, suggestedAction: 'View Query Plan' },
    { id: 'ins_3', message: '3 enterprise orgs approaching plan limits. ~$12,400 upgrade opportunity.', severity: 'opportunity', source: 'Strategic AI', confidence: 86, timestamp: '1 hour ago', actionable: true, suggestedAction: 'Open Org Manager' },
    { id: 'ins_4', message: 'Finance AI exceeded token budget by $4.20 today. Seasonal spike expected.', severity: 'info', source: 'Cost AI', confidence: 95, timestamp: '2 hours ago', actionable: false },
  ];

  const runningAgents: RunningAgent[] = [
    { id: 'ra_1', name: 'Analytics AI', avatar: '📊', task: 'Generating Q2 cohort analysis', status: 'running', progress: 72 },
    { id: 'ra_2', name: 'Security AI', avatar: '🔒', task: 'Continuous threat monitoring', status: 'running', progress: 0 },
    { id: 'ra_3', name: 'Support AI', avatar: '🎧', task: 'Processing 12 open tickets', status: 'thinking', progress: 45 },
    { id: 'ra_4', name: 'Finance AI', avatar: '💰', task: 'Monthly reconciliation', status: 'done', progress: 100 },
  ];

  // === Dock Data ===
  const [dockItems, setDockItems] = useState<DockItem[]>([
    { id: 'dock_1', label: 'Q2 Churn Report', icon: '📄', type: 'clipboard' },
    { id: 'dock_2', label: 'Customer #C-4021', icon: '👤', type: 'pinned' },
    { id: 'dock_3', label: 'Cohort Analysis', icon: '📊', type: 'ai_task', status: 'running', progress: 72 },
    { id: 'dock_4', label: 'Export: Revenue.csv', icon: '📁', type: 'download', status: 'complete' },
    { id: 'dock_5', label: '2 security alerts', icon: '🛡️', type: 'notification' },
  ]);

  // === Handlers ===
  const handleSwitchWorkspace = useCallback((id: string) => {
    setActiveWorkspaceId(id);
    toast(`Switched to ${workspaces.find(w => w.id === id)?.title}`, { type: 'info' });
  }, [workspaces]);

  const handleCreateWorkspace = useCallback(() => {
    const newWs: Workspace = {
      id: `ws_new_${Date.now()}`, title: 'New Workspace', description: 'Empty workspace', icon: '📁',
      status: 'active', panels: [], context: { filters: {}, selection: [], scrollPositions: {}, aiContext: '', recentHistory: [] },
      createdAt: 'Just now', lastAccessedAt: 'Just now', createdBy: 'user',
    };
    setWorkspaces(prev => [...prev, newWs]);
    setActiveWorkspaceId(newWs.id);
    toast('New workspace created', { type: 'success' });
  }, []);

  const handleCommandExecute = useCallback((command: string) => {
    toast(`Command: ${command}`, { type: 'info' });
  }, []);

  const handleClosePanel = useCallback((panelId: string) => {
    setWorkspaces(prev => prev.map(ws =>
      ws.id === activeWorkspaceId ? { ...ws, panels: ws.panels.filter(p => p.id !== panelId) } : ws
    ));
  }, [activeWorkspaceId]);

  const handlePinPanel = useCallback((panelId: string) => {
    setWorkspaces(prev => prev.map(ws =>
      ws.id === activeWorkspaceId ? { ...ws, panels: ws.panels.map(p => p.id === panelId ? { ...p, isPinned: !p.isPinned } : p) } : ws
    ));
  }, [activeWorkspaceId]);

  const handleMaximizePanel = useCallback((panelId: string) => {
    setWorkspaces(prev => prev.map(ws =>
      ws.id === activeWorkspaceId ? { ...ws, panels: ws.panels.map(p => p.id === panelId ? { ...p, state: p.state === 'maximized' ? 'docked' as const : 'maximized' as const } : p) } : ws
    ));
  }, [activeWorkspaceId]);

  const handleDuplicatePanel = useCallback((panelId: string) => {
    setWorkspaces(prev => prev.map(ws => {
      if (ws.id !== activeWorkspaceId) return ws;
      const panel = ws.panels.find(p => p.id === panelId);
      if (!panel) return ws;
      return { ...ws, panels: [...ws.panels, { ...panel, id: `${panel.id}_dup_${Date.now()}`, isPinned: false }] };
    }));
    toast('Panel duplicated', { type: 'success' });
  }, [activeWorkspaceId]);

  const handleNavSelect = useCallback((item: NavItem) => {
    if (item.workspaceId) handleSwitchWorkspace(item.workspaceId);
  }, [handleSwitchWorkspace]);

  const handleDismissDock = useCallback((id: string) => {
    setDockItems(prev => prev.filter(d => d.id !== id));
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col bg-[#121212] text-[#fafafa] font-sans overflow-hidden">
      {/* Region 1: Command Bar */}
      <CommandBar
        workspaces={workspaces}
        activeWorkspaceId={activeWorkspaceId}
        onSwitchWorkspace={handleSwitchWorkspace}
        onCreateWorkspace={handleCreateWorkspace}
        onCommandExecute={handleCommandExecute}
        runningTaskCount={runningAgents.filter(a => a.status === 'running' || a.status === 'thinking').length}
        notificationCount={3}
      />

      {/* Middle Section: Navigator + Canvas + AI Lane */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Region 2: Workspace Navigator */}
        <WorkspaceNavigator
          navItems={navItems}
          activeWorkspaceId={activeWorkspaceId}
          onSelectItem={handleNavSelect}
          onCreateWorkspace={handleCreateWorkspace}
        />

        {/* Region 3: Active Canvas */}
        <ActiveCanvas
          panels={activeWorkspace?.panels ?? []}
          definitions={PANEL_DEFINITIONS}
          onClosePanel={handleClosePanel}
          onPinPanel={handlePinPanel}
          onMaximizePanel={handleMaximizePanel}
          onDuplicatePanel={handleDuplicatePanel}
        />

        {/* Region 4: AI Lane */}
        <AILane
          insights={insights}
          runningAgents={runningAgents}
          aiLevel={aiLevel}
          onAILevelChange={setAiLevel}
          onExecuteSuggestion={(id) => toast(`Executing suggestion: ${id}`, { type: 'info' })}
        />
      </div>

      {/* Region 5: Dynamic Dock */}
      <DynamicDock items={dockItems} onDismissItem={handleDismissDock} />
    </div>
  );
}
