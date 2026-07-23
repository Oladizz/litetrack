"use client";

import React from 'react';
import { Calendar, Clock, RefreshCw, Filter, Globe, SlidersHorizontal, Check } from 'lucide-react';
import { DashboardState } from './types';

interface ControlsProps {
  globalFilters: DashboardState['globalFilters'];
  onChangeFilter: (key: string, value: any) => void;
  onManualRefresh: () => void;
}

export function DashboardControls({
  globalFilters,
  onChangeFilter,
  onManualRefresh,
}: ControlsProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 bg-[#1a1a1a] border border-[#262626] rounded-xl p-3 shadow-lg">
      <div className="flex flex-wrap items-center gap-2">
        {/* Date Range Selector */}
        <div className="flex items-center gap-1.5 bg-[#121212] border border-[#262626] rounded-lg px-2.5 py-1.5 text-xs">
          <Calendar className="w-3.5 h-3.5 text-[#2266ec]" />
          <select
            value={globalFilters.dateRange}
            onChange={e => onChangeFilter('dateRange', e.target.value)}
            className="bg-transparent text-white outline-none cursor-pointer text-xs"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="12m">Last 12 Months</option>
          </select>
        </div>

        {/* Compare Period Selector */}
        <div className="flex items-center gap-1.5 bg-[#121212] border border-[#262626] rounded-lg px-2.5 py-1.5 text-xs">
          <span className="text-[#a6a6a6] text-[11px] font-mono">vs</span>
          <select
            value={globalFilters.comparePeriod}
            onChange={e => onChangeFilter('comparePeriod', e.target.value)}
            className="bg-transparent text-white outline-none cursor-pointer text-xs"
          >
            <option value="previous_period">Previous Period</option>
            <option value="yesterday">Yesterday</option>
            <option value="last_year">Same Period Last Year</option>
            <option value="none">No Comparison</option>
          </select>
        </div>

        {/* Auto Refresh Rate */}
        <div className="flex items-center gap-1.5 bg-[#121212] border border-[#262626] rounded-lg px-2.5 py-1.5 text-xs">
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          <select
            value={globalFilters.autoRefresh}
            onChange={e => onChangeFilter('autoRefresh', Number(e.target.value))}
            className="bg-transparent text-white outline-none cursor-pointer text-xs"
          >
            <option value={0}>Auto Refresh: Off</option>
            <option value={10}>Refresh: 10s</option>
            <option value={30}>Refresh: 30s</option>
            <option value={60}>Refresh: 60s</option>
          </select>
        </div>

        {/* Region Filter */}
        <div className="flex items-center gap-1.5 bg-[#121212] border border-[#262626] rounded-lg px-2.5 py-1.5 text-xs">
          <Globe className="w-3.5 h-3.5 text-purple-400" />
          <select
            value={globalFilters.region || 'all'}
            onChange={e => onChangeFilter('region', e.target.value)}
            className="bg-transparent text-white outline-none cursor-pointer text-xs"
          >
            <option value="all">Region: Global All</option>
            <option value="europe">Region: Europe</option>
            <option value="north_america">Region: North America</option>
            <option value="africa">Region: Africa (Nigeria)</option>
            <option value="asia">Region: Asia Pacific</option>
          </select>
        </div>
      </div>

      {/* Manual Refresh Button */}
      <button
        onClick={onManualRefresh}
        className="px-3 py-1.5 bg-[#121212] border border-[#262626] hover:border-[#404040] text-xs font-medium text-[#a6a6a6] hover:text-white rounded-lg transition-colors flex items-center gap-1.5 shadow"
      >
        <RefreshCw className="w-3.5 h-3.5" /> Refresh Widgets
      </button>
    </div>
  );
}
