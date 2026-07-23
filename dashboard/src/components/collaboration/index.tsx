"use client";

import React, { useState } from 'react';
import {
  Activity, ClipboardList, ShieldCheck, Users, Bell, Target, Handshake
} from 'lucide-react';
import {
  ActivityEvent, Comment, TaskItem, TaskStatus, ApprovalStage, Decision,
  SharedWorkspace, Notification, WatchlistItem, Mission
} from './types';
import { ActivityFeedComments } from './activity-comments';
import { TaskBoardAssignments } from './task-board';
import { ApprovalDecisionLog } from './approval-decisions';
import { WorkspacesAICollab } from './workspaces-ai-collab';
import { NotificationsPresenceWatchlist } from './notifications-presence';
import { MissionControl } from './mission-control';

export function UniversalCollaborationHub() {
  const [activeTab, setActiveTab] = useState<
    'feed_comments' | 'tasks' | 'approvals' | 'workspaces_ai' | 'notifications' | 'missions'
  >('feed_comments');

  // === Section 1 Data: Activity Feed & Comments ===
  const [activities] = useState<ActivityEvent[]>([
    { id: 'act_1', type: 'assignment', actor: 'John Doe', actorType: 'user', actorAvatar: '👤', action: 'assigned Sarah to', target: 'Customer #C-4021', timestamp: '2 mins ago' },
    { id: 'act_2', type: 'ai_action', actor: 'Analytics AI', actorType: 'ai_agent', actorAvatar: '📊', action: 'summarized profile for', target: 'Customer #C-4021', timestamp: '5 mins ago' },
    { id: 'act_3', type: 'system', actor: 'System', actorType: 'system', actorAvatar: '⚙️', action: 'generated invoice #INV-892 for', target: 'Order #ORD-381', timestamp: '12 mins ago' },
    { id: 'act_4', type: 'approval', actor: 'Sarah Chen', actorType: 'user', actorAvatar: '👩', action: 'approved refund for', target: 'Order #ORD-267', timestamp: '18 mins ago' },
    { id: 'act_5', type: 'comment', actor: 'David Kim', actorType: 'user', actorAvatar: '👨', action: 'commented on', target: 'Revenue Dashboard', timestamp: '25 mins ago' },
    { id: 'act_6', type: 'task_update', actor: 'Finance AI', actorType: 'ai_agent', actorAvatar: '💰', action: 'completed task', target: 'Monthly Reconciliation', timestamp: '30 mins ago' },
    { id: 'act_7', type: 'decision', actor: 'Sarah Chen', actorType: 'user', actorAvatar: '👩', action: 'recorded decision on', target: 'Pricing Restructure', timestamp: '1 hour ago' },
    { id: 'act_8', type: 'ai_action', actor: 'Support AI', actorType: 'ai_agent', actorAvatar: '🎧', action: 'flagged risk on', target: 'Customer #C-1089', timestamp: '1 hour ago' },
  ]);

  const [comments, setComments] = useState<Comment[]>([
    { id: 'c_1', author: 'John Doe', authorAvatar: '👤', authorType: 'user', content: 'Can someone look into the revenue drop on the Q2 dashboard? Seems like the SMB segment is the main contributor. @Sarah @Finance', timestamp: '10 mins ago', reactions: [{ emoji: '👍', count: 3 }, { emoji: '🎯', count: 1 }], mentions: ['Sarah', 'Finance'], hasCode: false },
    { id: 'c_2', author: 'Analytics AI', authorAvatar: '📊', authorType: 'ai_agent', content: 'I analyzed the Q2 data. The SMB churn rate increased by 18% compared to Q1. The primary drop-off is at Day 14 of the trial period. Here\'s the query I used to identify the affected cohorts:', timestamp: '8 mins ago', reactions: [{ emoji: '🔥', count: 2 }], mentions: [], hasCode: true },
    { id: 'c_3', author: 'Sarah Chen', authorAvatar: '👩', authorType: 'user', content: 'Thanks @Analytics AI — that confirms what I suspected. The onboarding email sequence was changed in March. Let me pull up the campaign data. @Marketing can you check the open rates?', timestamp: '5 mins ago', reactions: [{ emoji: '👍', count: 1 }], mentions: ['Analytics AI', 'Marketing'], hasCode: false },
  ]);

  // === Section 2 Data: Tasks ===
  const [tasks, setTasks] = useState<TaskItem[]>([
    { id: 'task_1', title: 'Investigate Q2 Revenue Drop', description: 'Analyze SMB churn data and identify root causes for the 18% increase.', status: 'in_progress', priority: 'critical', assignee: 'Analytics AI', assigneeType: 'ai_agent', assigneeAvatar: '📊', dueDate: 'Today', tags: ['revenue', 'churn'] },
    { id: 'task_2', title: 'Fix Stripe Webhook Timeout', description: 'Connection pool exhaustion causing 504s on /api/v2/webhooks/stripe.', status: 'in_progress', priority: 'high', assignee: 'James Wright', assigneeType: 'user', assigneeAvatar: '👨‍💻', dueDate: 'Tomorrow', tags: ['api', 'payments'] },
    { id: 'task_3', title: 'Redesign Pricing Page', description: 'Trial-to-paid conversion dropped 21pp. Pricing confusion is the #1 churn reason.', status: 'backlog', priority: 'high', assignee: 'Design Team', assigneeType: 'team', assigneeAvatar: '🎨', dueDate: 'Next Week', tags: ['design', 'conversion'] },
    { id: 'task_4', title: 'Restore SMB Onboarding Emails', description: 'Re-enable the original welcome sequence that had 72% completion rate.', status: 'review', priority: 'medium', assignee: 'Marketing AI', assigneeType: 'ai_agent', assigneeAvatar: '📢', dueDate: 'Tomorrow', tags: ['email', 'onboarding'] },
    { id: 'task_5', title: 'Monthly Financial Reconciliation', description: 'Reconcile all Q2 transactions across Stripe, crypto wallets, and manual invoices.', status: 'done', priority: 'medium', assignee: 'Finance AI', assigneeType: 'ai_agent', assigneeAvatar: '💰', dueDate: 'Completed', tags: ['finance'] },
    { id: 'task_6', title: 'Re-prioritize Slack Integration', description: 'Missing Slack integration cited by 22% of churned users. Move to Sprint 16.', status: 'backlog', priority: 'high', assignee: 'Developer AI', assigneeType: 'ai_agent', assigneeAvatar: '💻', dueDate: 'Sprint 16', tags: ['integration', 'slack'] },
  ]);

  // === Section 3 Data: Approvals & Decisions ===
  const [approvals, setApprovals] = useState<ApprovalStage[]>([
    { id: 'apr_1', label: 'Created', approver: 'John Doe', approverType: 'user', status: 'approved', timestamp: '2 hours ago' },
    { id: 'apr_2', label: 'AI Summary', approver: 'Finance AI', approverType: 'ai_agent', status: 'approved', timestamp: '1 hour ago', aiSummary: 'Customer #C-267 was charged twice ($149.99 each) due to a Stripe webhook retry during a timeout event. The duplicate charge was confirmed via transaction logs. Recommended action: Full refund of $149.99 with a courtesy credit of $15.' },
    { id: 'apr_3', label: 'Manager Approval', approver: 'Sarah Chen', approverType: 'user', status: 'pending', aiSummary: 'Finance AI recommends approval. Total refund: $164.99 ($149.99 + $15 courtesy). Customer lifetime value: $2,840. Risk assessment: Low.' },
    { id: 'apr_4', label: 'Finance Approval', approver: 'CFO', approverType: 'user', status: 'waiting' },
    { id: 'apr_5', label: 'Completed', approver: 'System', approverType: 'user', status: 'waiting' },
  ]);

  const [decisions] = useState<Decision[]>([
    { id: 'dec_1', title: 'Refund Approved — Order #ORD-267', reason: 'Duplicate charge confirmed via transaction logs. Full refund of $149.99 plus $15 courtesy credit.', approvedBy: 'Sarah Chen', suggestedBy: 'Finance AI', suggestedByType: 'ai_agent', timestamp: '2 hours ago', category: 'Financial' },
    { id: 'dec_2', title: 'Slack Integration Re-prioritized', reason: 'Missing Slack integration cited by 22% of churned SMB users. Moved from Sprint 18 to Sprint 16.', approvedBy: 'James Wright', suggestedBy: 'Support AI', suggestedByType: 'ai_agent', timestamp: '4 hours ago', category: 'Product' },
    { id: 'dec_3', title: 'API Rate Limit Increased', reason: 'Enterprise customer #C-1089 hitting 429 errors. Rate limit raised from 1000 to 5000 req/min.', approvedBy: 'David Kim', suggestedBy: 'Developer AI', suggestedByType: 'ai_agent', timestamp: '1 day ago', category: 'Operational' },
    { id: 'dec_4', title: 'SOC 2 Audit Scheduled', reason: 'Annual compliance audit scheduled for Q3. Pre-audit checklist generated by Security AI.', approvedBy: 'Sarah Chen', suggestedBy: 'Security AI', suggestedByType: 'ai_agent', timestamp: '3 days ago', category: 'Security' },
  ]);

  // === Section 4 Data: Workspaces ===
  const [workspaces] = useState<SharedWorkspace[]>([
    { id: 'ws_1', name: 'Revenue Investigation', description: 'Cross-functional investigation into Q2 revenue decline in SMB segment', members: [{ name: 'John Doe', type: 'user', avatar: '👤' }, { name: 'Sarah Chen', type: 'user', avatar: '👩' }, { name: 'Analytics AI', type: 'ai_agent', avatar: '📊' }, { name: 'Finance AI', type: 'ai_agent', avatar: '💰' }, { name: 'Support AI', type: 'ai_agent', avatar: '🎧' }], resourceCount: 14, status: 'active', createdAt: '2 hours ago' },
    { id: 'ws_2', name: 'Blockchain Module Launch', description: 'Planning and execution workspace for BlockVault crypto wallet integration', members: [{ name: 'David Kim', type: 'user', avatar: '👨' }, { name: 'Developer AI', type: 'ai_agent', avatar: '💻' }], resourceCount: 8, status: 'active', createdAt: '1 day ago' },
    { id: 'ws_3', name: 'Q1 Board Report', description: 'Executive board report preparation with AI-assisted analysis', members: [{ name: 'Sarah Chen', type: 'user', avatar: '👩' }, { name: 'Analytics AI', type: 'ai_agent', avatar: '📊' }], resourceCount: 6, status: 'archived', createdAt: '2 weeks ago' },
  ]);

  // === Section 5 Data: Notifications & Watchlists ===
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 'n_1', type: 'mention', title: '@John mentioned you', message: 'Can someone look into the revenue drop on the Q2 dashboard?', timestamp: '10 mins ago', read: false, actor: 'John Doe', actorAvatar: '👤' },
    { id: 'n_2', type: 'ai_suggestion', title: 'Analytics AI insight', message: 'SMB churn rate increased 18% — 3 cohorts identified for investigation.', timestamp: '8 mins ago', read: false, actor: 'Analytics AI', actorAvatar: '📊' },
    { id: 'n_3', type: 'approval', title: 'Approval pending', message: 'Refund for Order #ORD-267 awaiting your approval ($164.99).', timestamp: '1 hour ago', read: false, actor: 'System', actorAvatar: '⚙️' },
    { id: 'n_4', type: 'task', title: 'Task assigned', message: 'You have been assigned "Investigate Q2 Revenue Drop".', timestamp: '2 hours ago', read: true, actor: 'John Doe', actorAvatar: '👤' },
    { id: 'n_5', type: 'alert', title: 'Stripe Webhook Timeout', message: 'HTTP 504 errors detected on /api/v2/webhooks/stripe.', timestamp: '3 hours ago', read: true, actor: 'System', actorAvatar: '⚙️' },
    { id: 'n_6', type: 'comment', title: 'New comment on Revenue Dashboard', message: 'Sarah Chen replied to your comment on the Q2 analysis.', timestamp: '5 mins ago', read: false, actor: 'Sarah Chen', actorAvatar: '👩' },
    { id: 'n_7', type: 'system', title: 'Deployment complete', message: 'v2.3.1 deployed to staging environment successfully.', timestamp: '4 hours ago', read: true, actor: 'System', actorAvatar: '⚙️' },
  ]);

  const [watchlist] = useState<WatchlistItem[]>([
    { id: 'wl_1', resourceName: 'Enterprise Customer #C-1089', resourceType: 'Customer', conditions: ['Revenue Drops', 'AI Flags Risk', 'Payment Fails'], triggered: true, lastChecked: '2 mins ago' },
    { id: 'wl_2', resourceName: 'Revenue Dashboard', resourceType: 'Dashboard', conditions: ['KPI Below Threshold', 'Data Anomaly'], triggered: false, lastChecked: '5 mins ago' },
    { id: 'wl_3', resourceName: 'Stripe Webhook API', resourceType: 'API Endpoint', conditions: ['Latency > 2000ms', 'Error Rate > 1%'], triggered: true, lastChecked: '1 min ago' },
  ]);

  // === Section 6 Data: Missions ===
  const [missions] = useState<Mission[]>([
    { id: 'mis_1', title: 'Investigate Q2 Revenue Decline', objective: 'Identify root causes of 18% SMB churn increase and implement fixes to restore retention.', status: 'active', progress: 45, members: [{ name: 'John Doe', type: 'user', avatar: '👤' }, { name: 'Sarah Chen', type: 'user', avatar: '👩' }, { name: 'Analytics AI', type: 'ai_agent', avatar: '📊' }, { name: 'Marketing AI', type: 'ai_agent', avatar: '📢' }, { name: 'Support AI', type: 'ai_agent', avatar: '🎧' }], taskCount: 12, decisionCount: 3, dashboardCount: 4, createdAt: '2 hours ago', timeline: [{ event: 'Mission created', timestamp: '2 hours ago', done: true }, { event: 'AI agents assigned', timestamp: '2 hours ago', done: true }, { event: 'Initial data analysis complete', timestamp: '1 hour ago', done: true }, { event: 'Root cause identified', timestamp: '45 mins ago', done: true }, { event: 'Fix implementation', timestamp: 'In Progress', done: false }, { event: 'Validation & close', timestamp: 'Pending', done: false }] },
    { id: 'mis_2', title: 'Launch Blockchain Module', objective: 'Deploy BlockVault crypto wallet integration with KYC/AML compliance.', status: 'active', progress: 20, members: [{ name: 'David Kim', type: 'user', avatar: '👨' }, { name: 'Developer AI', type: 'ai_agent', avatar: '💻' }, { name: 'Security AI', type: 'ai_agent', avatar: '🔒' }], taskCount: 18, decisionCount: 1, dashboardCount: 2, createdAt: '1 day ago', timeline: [{ event: 'Mission created', timestamp: '1 day ago', done: true }, { event: 'Architecture review', timestamp: '1 day ago', done: true }, { event: 'Smart contract audit', timestamp: 'In Progress', done: false }, { event: 'Beta deployment', timestamp: 'Pending', done: false }] },
    { id: 'mis_3', title: 'SOC 2 Compliance Audit', objective: 'Complete annual SOC 2 Type II audit with pre-audit AI checklist.', status: 'paused', progress: 65, members: [{ name: 'Sarah Chen', type: 'user', avatar: '👩' }, { name: 'Security AI', type: 'ai_agent', avatar: '🔒' }], taskCount: 24, decisionCount: 5, dashboardCount: 1, createdAt: '1 week ago', timeline: [{ event: 'Mission created', timestamp: '1 week ago', done: true }, { event: 'Pre-audit checklist generated', timestamp: '6 days ago', done: true }, { event: 'Evidence collection', timestamp: '3 days ago', done: true }, { event: 'Auditor review', timestamp: 'Paused', done: false }] },
  ]);

  // === Handlers ===
  const handleAddComment = (text: string) => {
    setComments(prev => [...prev, {
      id: `c_${Date.now()}`, author: 'You', authorAvatar: '👤', authorType: 'user',
      content: text, timestamp: 'Just now', reactions: [], mentions: [], hasCode: false,
    }]);
  };

  const handleUpdateTask = (id: string, status: TaskStatus) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t));
  };

  const handleApprove = (stageId: string) => {
    setApprovals(prev => {
      const updated = prev.map(a => a.id === stageId ? { ...a, status: 'approved' as const, timestamp: 'Just now' } : a);
      const nextWaiting = updated.find(a => a.status === 'waiting');
      if (nextWaiting) return updated.map(a => a.id === nextWaiting.id ? { ...a, status: 'pending' as const } : a);
      return updated;
    });
  };

  const handleReject = (stageId: string) => {
    setApprovals(prev => prev.map(a => a.id === stageId ? { ...a, status: 'rejected' as const, timestamp: 'Just now' } : a));
  };

  const handleMarkRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleDismiss = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const tabs = [
    { id: 'feed_comments' as const, label: '1. Activity & Comments', icon: Activity },
    { id: 'tasks' as const, label: '2. Task Board', icon: ClipboardList },
    { id: 'approvals' as const, label: '3. Approvals & Decisions', icon: ShieldCheck },
    { id: 'workspaces_ai' as const, label: '4. Workspaces & AI Collab', icon: Users },
    { id: 'notifications' as const, label: '5. Notifications & Presence', icon: Bell },
    { id: 'missions' as const, label: '6. ⭐ Mission Control', icon: Target },
  ];

  return (
    <div className="space-y-6 w-full font-sans">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#262626]">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Handshake className="w-6 h-6 text-[#2266ec]" /> Tool #9: Collaboration & Operations Hub
          </h1>
          <p className="text-xs text-[#a6a6a6] mt-1">
            Notion + Linear + Slack + Jira combined. Teams, AI agents, and stakeholders collaborate on every object. Features ⭐ Mission Control.
          </p>
        </div>
      </div>

      {/* 6 Navigation Tabs */}
      <div className="flex items-center gap-1.5 border-b border-[#262626] pb-3 overflow-x-auto hide-scrollbar text-xs font-semibold">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl border transition-all shrink-0 flex items-center gap-2 ${
                isActive
                  ? 'bg-[#2266ec] border-[#2266ec] text-white shadow-lg shadow-[#2266ec]/20'
                  : 'bg-[#1a1a1a] border-[#262626] text-[#a6a6a6] hover:text-white hover:bg-[#262626]'
              }`}
            >
              <Icon className="w-4 h-4" /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Renderers */}
      {activeTab === 'feed_comments' && (
        <ActivityFeedComments activities={activities} comments={comments} onAddComment={handleAddComment} />
      )}
      {activeTab === 'tasks' && (
        <TaskBoardAssignments tasks={tasks} onUpdateTask={handleUpdateTask} />
      )}
      {activeTab === 'approvals' && (
        <ApprovalDecisionLog approvals={approvals} decisions={decisions} onApprove={handleApprove} onReject={handleReject} />
      )}
      {activeTab === 'workspaces_ai' && (
        <WorkspacesAICollab workspaces={workspaces} />
      )}
      {activeTab === 'notifications' && (
        <NotificationsPresenceWatchlist notifications={notifications} watchlist={watchlist} onMarkRead={handleMarkRead} onDismiss={handleDismiss} />
      )}
      {activeTab === 'missions' && (
        <MissionControl missions={missions} />
      )}
    </div>
  );
}
