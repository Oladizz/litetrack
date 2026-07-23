"use client";

import React, { useState } from 'react';
import {
  Bell, Eye, Bookmark, Check, Trash2, AtSign, ClipboardList, Bot,
  ShieldCheck, AlertTriangle, MessageSquare, Settings, Filter
} from 'lucide-react';
import { Notification, WatchlistItem } from './types';
import { toast } from '@/components/ui/toast';

interface Props {
  notifications: Notification[];
  watchlist: WatchlistItem[];
  onMarkRead: (id: string) => void;
  onDismiss: (id: string) => void;
}

const TYPE_ICON: Record<string, { icon: React.ReactNode; color: string }> = {
  mention: { icon: <AtSign className="w-3.5 h-3.5" />, color: 'text-[#2266ec]' },
  task: { icon: <ClipboardList className="w-3.5 h-3.5" />, color: 'text-amber-400' },
  ai_suggestion: { icon: <Bot className="w-3.5 h-3.5" />, color: 'text-purple-400' },
  approval: { icon: <ShieldCheck className="w-3.5 h-3.5" />, color: 'text-green-400' },
  alert: { icon: <AlertTriangle className="w-3.5 h-3.5" />, color: 'text-red-400' },
  comment: { icon: <MessageSquare className="w-3.5 h-3.5" />, color: 'text-cyan-400' },
  system: { icon: <Settings className="w-3.5 h-3.5" />, color: 'text-[#656565]' },
};

const PRESENCE_USERS = [
  { name: 'John Doe', avatar: '👤', type: 'user', status: 'viewing' },
  { name: 'Sarah Chen', avatar: '👩', type: 'user', status: 'editing' },
  { name: 'Analytics AI', avatar: '📊', type: 'ai_agent', status: 'processing' },
  { name: 'David Kim', avatar: '👨', type: 'user', status: 'idle' },
  { name: 'Support AI', avatar: '🎧', type: 'ai_agent', status: 'listening' },
];

const PRESENCE_COLORS: Record<string, string> = {
  viewing: 'bg-green-400',
  editing: 'bg-[#2266ec]',
  processing: 'bg-purple-400 animate-pulse',
  idle: 'bg-[#656565]',
  listening: 'bg-amber-400 animate-pulse',
};

export function NotificationsPresenceWatchlist({ notifications, watchlist, onMarkRead, onDismiss }: Props) {
  const [filter, setFilter] = useState<string>('all');
  const [followedResources] = useState([
    { name: 'Revenue Dashboard', type: '📊 Dashboard' },
    { name: 'Customer #C-4021', type: '👤 User' },
    { name: 'Order #ORD-892', type: '📦 Order' },
    { name: 'Analytics AI', type: '🤖 AI Agent' },
    { name: 'Q2 Churn Report', type: '📄 Report' },
  ]);

  const types = ['all', 'mention', 'task', 'ai_suggestion', 'approval', 'alert', 'comment'];

  const filtered = filter === 'all'
    ? notifications
    : notifications.filter(n => n.type === filter);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6 font-sans">
      {/* Live Presence */}
      <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-5 shadow-xl space-y-3">
        <div className="border-b border-[#262626] pb-3">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <Eye className="w-4 h-4 text-green-400" /> Live Presence
          </h3>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {PRESENCE_USERS.map(u => (
            <div key={u.name} className="flex items-center gap-2 bg-[#121212] border border-[#262626] rounded-lg px-3 py-2 text-xs">
              <div className="relative">
                <span className="text-sm">{u.avatar}</span>
                <div className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-[#121212] ${PRESENCE_COLORS[u.status]}`} />
              </div>
              <div>
                <div className="font-semibold text-white">{u.name}</div>
                <div className="text-[9px] text-[#656565] capitalize">{u.status}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notification Center */}
        <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#262626] pb-3">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-400" /> Notification Center
              {unreadCount > 0 && (
                <span className="text-[9px] bg-red-500 text-white px-1.5 py-0.5 rounded-full font-bold">{unreadCount}</span>
              )}
            </h3>
          </div>

          {/* Type Filters */}
          <div className="flex items-center gap-1 overflow-x-auto hide-scrollbar text-[9px] font-semibold">
            {types.map(t => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`px-2 py-1 rounded-lg border transition-all capitalize shrink-0 ${
                  filter === t
                    ? 'bg-[#2266ec] border-[#2266ec] text-white'
                    : 'bg-[#121212] border-[#262626] text-[#656565] hover:text-white'
                }`}
              >
                {t === 'all' ? 'All' : t.replace('_', ' ')}
              </button>
            ))}
          </div>

          {/* Notification List */}
          <div className="space-y-1.5 max-h-[350px] overflow-y-auto">
            {filtered.map(n => {
              const typeStyle = TYPE_ICON[n.type] ?? TYPE_ICON.system;
              return (
                <div
                  key={n.id}
                  className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${
                    n.read
                      ? 'bg-[#121212] border-[#262626] opacity-60'
                      : 'bg-[#121212] border-[#2266ec]/20 shadow-sm'
                  }`}
                >
                  <div className={`mt-0.5 ${typeStyle.color}`}>{typeStyle.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-white">{n.title}</div>
                    <div className="text-[10px] text-[#a6a6a6] mt-0.5 line-clamp-1">{n.message}</div>
                    <div className="text-[9px] text-[#656565] font-mono mt-1">{n.timestamp}</div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {!n.read && (
                      <button onClick={() => onMarkRead(n.id)} className="p-1 rounded text-[#656565] hover:text-green-400" title="Mark read">
                        <Check className="w-3 h-3" />
                      </button>
                    )}
                    <button onClick={() => onDismiss(n.id)} className="p-1 rounded text-[#656565] hover:text-red-400" title="Dismiss">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Following + Watchlists */}
        <div className="space-y-6">
          {/* Following */}
          <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-5 shadow-xl space-y-3">
            <div className="border-b border-[#262626] pb-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-[#2266ec]" /> Following
              </h3>
            </div>
            <div className="space-y-1.5">
              {followedResources.map(r => (
                <div key={r.name} className="flex items-center justify-between bg-[#121212] border border-[#262626] rounded-lg px-3 py-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-[#a6a6a6]">{r.type.split(' ')[0]}</span>
                    <span className="font-semibold text-white">{r.name}</span>
                  </div>
                  <span className="text-[9px] text-[#656565] font-mono">{r.type.split(' ').slice(1).join(' ')}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Watchlists */}
          <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-5 shadow-xl space-y-3">
            <div className="border-b border-[#262626] pb-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400" /> Watchlists
              </h3>
            </div>
            <div className="space-y-2">
              {watchlist.map(w => (
                <div key={w.id} className={`bg-[#121212] border rounded-xl p-3 space-y-2 ${
                  w.triggered ? 'border-red-500/30 shadow-sm shadow-red-500/10' : 'border-[#262626]'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs">{w.resourceName}</span>
                    {w.triggered && (
                      <span className="text-[9px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded font-bold animate-pulse">TRIGGERED</span>
                    )}
                  </div>
                  <div className="text-[10px] text-[#656565]">Type: {w.resourceType}</div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {w.conditions.map(c => (
                      <span key={c} className="text-[9px] bg-[#1a1a1a] text-[#a6a6a6] px-1.5 py-0.5 rounded border border-[#262626] font-mono">{c}</span>
                    ))}
                  </div>
                  <div className="text-[9px] text-[#656565] font-mono">Last checked: {w.lastChecked}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
