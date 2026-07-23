"use client";

import React, { useState } from 'react';
import { 
  TrendingUp, TrendingDown, Sparkles, Activity, Calendar as CalendarIcon, 
  Map as MapIcon, ShieldAlert, FileText, CheckCircle2, MoreHorizontal, Maximize2, Move, Lock, Trash2, Edit 
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, RadarChart, Radar, PolarGrid, PolarAngleAxis, ScatterChart, Scatter, Brush 
} from 'recharts';
import { WidgetConfig } from './types';

interface WidgetProps {
  widget: WidgetConfig;
  isLocked?: boolean;
  onRemove?: () => void;
  onEditConfig?: () => void;
  onDrillDown?: (widgetTitle: string, metric: string) => void;
}

export function DashboardWidgetRenderer({
  widget,
  isLocked,
  onRemove,
  onEditConfig,
  onDrillDown,
}: WidgetProps) {
  const sampleTimeSeries = [
    { date: 'Mon', value: 4000, secondary: 2400 },
    { date: 'Tue', value: 6500, secondary: 3100 },
    { date: 'Wed', value: 5100, secondary: 4000 },
    { date: 'Thu', value: 9800, secondary: 5200 },
    { date: 'Fri', value: 12400, secondary: 6800 },
    { date: 'Sat', value: 11000, secondary: 7100 },
    { date: 'Sun', value: 14500, secondary: 8900 },
  ];

  const pieColors = ['#2266ec', '#a855f7', '#f59e0b', '#10b981', '#ef4444'];

  const renderWidgetBody = () => {
    switch (widget.type) {
      case 'kpi': {
        const val = widget.customProps?.value || '$124,500';
        const trend = widget.customProps?.trend || '+14.2%';
        const isPositive = !trend.startsWith('-');

        return (
          <div className="flex flex-col justify-between h-full space-y-3">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-extrabold text-white tracking-tight">{val}</span>
              <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                isPositive ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
              }`}>
                {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {trend}
              </span>
            </div>

            {/* Sparkline mini chart */}
            <div className="h-10 w-full -ml-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sampleTimeSeries}>
                  <Line type="monotone" dataKey="value" stroke="#2266ec" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      }

      case 'metric_comparison':
        return (
          <div className="flex items-center justify-between h-full p-2 bg-[#121212] rounded-lg border border-[#262626]">
            <div>
              <div className="text-[10px] text-[#656565] uppercase font-mono">Today</div>
              <div className="text-xl font-bold text-white">$12,340</div>
            </div>
            <div className="flex items-center gap-1 text-green-400 text-xs font-bold">
              <TrendingUp className="w-4 h-4" /> ▲ 14%
            </div>
            <div className="text-right">
              <div className="text-[10px] text-[#656565] uppercase font-mono">Yesterday</div>
              <div className="text-sm font-semibold text-[#a6a6a6]">$10,820</div>
            </div>
          </div>
        );

      case 'chart_area':
        return (
          <div 
            className="h-full w-full cursor-pointer"
            onClick={() => onDrillDown && onDrillDown(widget.title, 'Area Metric')}
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sampleTimeSeries} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id={`grad_${widget.id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2266ec" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#2266ec" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#262626" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#656565', fontSize: 10 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#656565', fontSize: 10 }} />
                <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: 8, color: '#fff', fontSize: 11 }} />
                <Area type="monotone" dataKey="value" stroke="#2266ec" strokeWidth={2} fill={`url(#grad_${widget.id})`} />
                <Brush dataKey="date" height={16} stroke="#2266ec" fill="#121212" tickFormatter={() => ''} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        );

      case 'chart_bar':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sampleTimeSeries} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#262626" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#656565', fontSize: 10 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#656565', fontSize: 10 }} />
              <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: 8, color: '#fff', fontSize: 11 }} />
              <Bar dataKey="value" fill="#2266ec" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'chart_pie':
      case 'chart_donut':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={[
                  { name: 'Organic', value: 400 },
                  { name: 'Direct', value: 300 },
                  { name: 'Referral', value: 300 },
                  { name: 'Social', value: 200 },
                ]}
                innerRadius={widget.type === 'chart_donut' ? 45 : 0}
                outerRadius={65}
                paddingAngle={4}
                dataKey="value"
              >
                {pieColors.map((color, index) => (
                  <Cell key={`cell-${index}`} fill={color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: 8, color: '#fff', fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'ai_summary':
        return (
          <div className="bg-[#121212] p-4 rounded-xl border border-[#2266ec]/30 space-y-2 relative overflow-hidden">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#2266ec]">
              <Sparkles className="w-4 h-4 text-amber-400" /> Automated AI Data Insights
            </div>
            <p className="text-xs text-[#fafafa] leading-relaxed">
              Revenue increased <strong className="text-green-400">14.2%</strong> this week, primarily driven by returning customers from Lagos. Refunds fell by 8%, while mobile traffic rose 17%.
            </p>
          </div>
        );

      case 'activity_feed':
        return (
          <div className="space-y-2 text-xs font-mono">
            {[
              { text: 'John created order #ORD-9481', time: '2m ago', color: 'text-green-400' },
              { text: 'Sarah refunded payment #PAY-3820', time: '14m ago', color: 'text-amber-400' },
              { text: 'API key production_v2 generated', time: '1h ago', color: 'text-blue-400' },
              { text: 'Deployment litetrack-api succeeded', time: '2h ago', color: 'text-purple-400' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between bg-[#121212] p-2 rounded border border-[#262626]">
                <span className={item.color}>{item.text}</span>
                <span className="text-[10px] text-[#656565]">{item.time}</span>
              </div>
            ))}
          </div>
        );

      case 'kanban':
        return (
          <div className="grid grid-cols-4 gap-2 h-full text-xs">
            {['To-Do', 'In Progress', 'Review', 'Done'].map(col => (
              <div key={col} className="bg-[#121212] p-2.5 rounded-lg border border-[#262626] space-y-2">
                <div className="font-bold text-white text-[11px] border-b border-[#262626] pb-1">{col}</div>
                <div className="bg-[#1a1a1a] p-2 rounded border border-[#333] text-[11px] text-[#a6a6a6]">
                  Task #{Math.floor(Math.random() * 900) + 100}
                </div>
              </div>
            ))}
          </div>
        );

      case 'alert':
        return (
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-[#121212] p-3 rounded-lg border border-red-500/30 flex items-center justify-between text-xs">
              <span className="text-red-400 font-semibold flex items-center gap-1.5">🔴 Database CPU High</span>
              <span className="font-mono text-[10px] text-[#a6a6a6]">94% Usage</span>
            </div>
            <div className="bg-[#121212] p-3 rounded-lg border border-amber-500/30 flex items-center justify-between text-xs">
              <span className="text-amber-400 font-semibold flex items-center gap-1.5">🟡 Payment Queue Delayed</span>
              <span className="font-mono text-[10px] text-[#a6a6a6]">42 Queueing</span>
            </div>
            <div className="bg-[#121212] p-3 rounded-lg border border-green-500/30 flex items-center justify-between text-xs">
              <span className="text-green-400 font-semibold flex items-center gap-1.5">🟢 Systems Operational</span>
              <span className="font-mono text-[10px] text-[#a6a6a6]">99.99% SLI</span>
            </div>
          </div>
        );

      default:
        return (
          <div className="flex items-center justify-center h-full bg-[#121212] rounded-lg border border-[#262626] text-xs text-[#656565]">
            [{widget.type.toUpperCase()}] Widget View Ready
          </div>
        );
    }
  };

  return (
    <div className="group bg-[#1a1a1a] border border-[#262626] hover:border-[#404040] rounded-xl p-4 shadow-xl flex flex-col justify-between h-full relative overflow-hidden transition-colors">
      {/* Widget Card Header */}
      <div className="flex items-center justify-between border-b border-[#262626] pb-2 mb-3">
        <h3 className="text-xs font-bold text-white flex items-center gap-2 tracking-wide">
          <Activity className="w-3.5 h-3.5 text-[#2266ec]" />
          {widget.title}
        </h3>

        {!isLocked && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={onEditConfig} className="p-1 rounded text-[#a6a6a6] hover:text-white hover:bg-[#262626]">
              <Edit className="w-3 h-3" />
            </button>
            <button onClick={onRemove} className="p-1 rounded text-red-500/70 hover:text-red-400 hover:bg-[#262626]">
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      {/* Widget Body */}
      <div className="flex-1 min-h-[140px]">
        {renderWidgetBody()}
      </div>
    </div>
  );
}
