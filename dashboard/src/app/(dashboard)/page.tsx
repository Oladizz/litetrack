'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Brush, ReferenceArea, ReferenceDot, ReferenceLine } from 'recharts';
import { 
  LogOut, LayoutDashboard, Activity, Settings, ChevronDown, ChevronUp, BookOpen, MessageSquare, Plus, Check, Search, 
  Sparkles, Calendar, Clock, Filter, Lock, Maximize2, LineChart as LineChartIcon, Map as MapIcon, Link as LinkIcon, DollarSign,
  Monitor, Globe, Shield, Users
} from 'lucide-react';
import { useWorkspace } from '@/components/ui/workspace-context';
import { AnimatedNumber } from '@/components/ui/animated-number';
import { Skeleton, CardSkeleton, ChartSkeleton } from '@/components/ui/skeleton';
import { SlidePanel } from '@/components/ui/slide-panel';
import Link from 'next/link';
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
const geoUrl = "/features.json";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1a1a1a]/90 backdrop-blur-md border border-white/[0.05] p-3 rounded-lg shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
        <p className="text-[#a6a6a6] text-[11px] mb-1 font-medium tracking-wide">{label}</p>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#2266ec]"></div>
          <p className="text-[#fafafa] text-[13px] font-semibold tabular-nums">
            {payload[0].value.toLocaleString()} <span className="text-[#656565] font-normal ml-1">{payload[0].name || 'Views'}</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

// EXACT TABBED TABLE
const TabbedTable = ({ 
  tabs, defaultTab, searchPlaceholder, tabConfigs, onRowClick, hasFooter = true, onExpand
}: { 
  tabs: string[], defaultTab: string, searchPlaceholder: string, 
  tabConfigs: Record<string, { data: any[], labelField: string, keyField: string, filterKey: string, columns: string[] }>,
  onRowClick: (filterKey: string, val: string) => void, hasFooter?: boolean,
  onExpand?: (tab: string, config: any, data: any[]) => void
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [search, setSearch] = useState('');
  const [isChartView, setIsChartView] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftGradient, setShowLeftGradient] = useState(false);
  const [showRightGradient, setShowRightGradient] = useState(false);

  const updateGradients = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    const hasOverflow = scrollWidth > clientWidth;
    setShowLeftGradient(hasOverflow && scrollLeft > 0);
    setShowRightGradient(hasOverflow && scrollLeft < scrollWidth - clientWidth - 1);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateGradients();
    el.addEventListener('scroll', updateGradients);
    window.addEventListener('resize', updateGradients);
    return () => {
      el.removeEventListener('scroll', updateGradients);
      window.removeEventListener('resize', updateGradients);
    };
  }, [updateGradients]);

  useEffect(() => {
    requestAnimationFrame(updateGradients);
  }, [tabs, activeTab, updateGradients]);

  const currentConfig = tabConfigs[activeTab] || Object.values(tabConfigs)[0];
  const data = currentConfig?.data || [];
  const dataLabelField = currentConfig?.labelField || 'id';
  const dataKeyField = currentConfig?.keyField || 'id';
  const columns = currentConfig?.columns || ['Item', 'Views', 'Sess.'];

  const filteredData = data?.filter((d: any) => (d[dataLabelField]||'').toLowerCase().includes(search.toLowerCase())) || [];
  
  const [sortCol, setSortCol] = useState<number | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc' | null>(null);

  const handleSort = (colIndex: number) => {
    if (sortCol === colIndex) {
      if (sortDir === 'desc') setSortDir('asc');
      else if (sortDir === 'asc') { setSortCol(null); setSortDir(null); }
    } else {
      setSortCol(colIndex);
      setSortDir('desc');
    }
  };

  const sortedData = [...filteredData].sort((a, b) => {
    if (sortCol === null || sortDir === null) return 0;
    
    const getVal = (row: any, idx: number) => {
      if (idx === 0) return String(row[dataLabelField] || '');
      const val = row.views || row.visitors || 0;
      if (idx === 1) return val;
      if (idx === 2) return row.sessions || Math.max(1, Math.floor(val * 0.25));
      return 0;
    };

    const aVal = getVal(a, sortCol);
    const bVal = getVal(b, sortCol);

    let comp = 0;
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      comp = aVal - bVal;
    } else {
      comp = String(aVal).localeCompare(String(bVal));
    }
    return sortDir === 'desc' ? -comp : comp;
  });

  const maxViews = Math.max(1, ...sortedData.map((d: any) => d.views || d.visitors || 0));

  const SortableHeader = ({ name, index, isRightAligned }: { name: string, index: number, isRightAligned: boolean }) => {
    const isSorted = sortCol === index;
    return (
      <button
        type="button"
        onClick={() => handleSort(index)}
        className={`flex items-center gap-1 hover:opacity-80 transition-opacity ${isRightAligned ? 'justify-end ml-auto' : ''}`}
      >
        <span>{name}</span>
        {isSorted ? (
          sortDir === 'desc' ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />
        ) : (
          <ChevronDown className="w-3 h-3 opacity-30" />
        )}
      </button>
    );
  };

  return (
    <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl flex flex-col h-[400px]">
      <div className="border-b border-[#262626]">
        {/* Tabs */}
        <div className="relative">
          <div className={`pointer-events-none absolute left-0 top-0 z-10 h-full w-8 bg-gradient-to-r from-[#1a1a1a] to-transparent transition-opacity duration-200 ${showLeftGradient ? 'opacity-100' : 'opacity-0'}`} />
          <div ref={scrollRef} className="flex gap-1 overflow-x-auto px-2 py-3 hide-scrollbar">
            {tabs.map(t => (
              <button 
                key={t} onClick={() => { setActiveTab(t); setSearch(''); setSortCol(null); setSortDir(null); }}
                className={`shrink-0 rounded-md px-2 py-1.5 text-[13px] font-medium transition-colors ${activeTab === t ? 'text-[#fafafa]' : 'text-[#a6a6a6] hover:bg-[#262626]/50 hover:text-[#fafafa]'}`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className={`pointer-events-none absolute right-0 top-0 z-10 bottom-px w-8 bg-gradient-to-l from-[#1a1a1a] to-transparent transition-opacity duration-200 ${showRightGradient ? 'opacity-100' : 'opacity-0'}`} />
        </div>
        
        {/* Search */}
        <div className="relative border-t border-white/[0.05]">
          <Search className="absolute left-3 top-1/2 w-3.5 h-3.5 -translate-y-1/2 text-[#656565]" />
          <input 
            type="search" placeholder={searchPlaceholder} value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 bg-transparent border-0 py-2.5 text-[13px] text-[#fafafa] outline-none placeholder:text-[#656565] focus-visible:ring-1 focus-visible:ring-white/[0.1] focus-visible:ring-offset-0 transition-all" 
          />
        </div>
      </div>

      {/* Column Headers */}
      {!isChartView && (
        <div className="flex px-4 py-2 text-[11px] font-semibold text-[#656565] shrink-0 border-b border-[#262626]">
          <div className="flex-1"><SortableHeader name={columns[0]} index={0} isRightAligned={false} /></div>
          {columns[1] && <div className="w-16"><SortableHeader name={columns[1]} index={1} isRightAligned={true} /></div>}
          {columns[2] && <div className="w-16"><SortableHeader name={columns[2]} index={2} isRightAligned={true} /></div>}
        </div>
      )}

      {/* Data Rows / Chart */}
      <div className="flex-1 overflow-y-auto p-1 space-y-[1px] hide-scrollbar">
        {isChartView ? (
          <div className="h-full w-full p-4 flex flex-col justify-end gap-2">
            {sortedData.slice(0, 7).map((row: any, i: number) => {
              const val = row.views || row.visitors || 0;
              const pct = Math.max(5, (val / maxViews) * 100);
              return (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-[11px] text-[#a6a6a6]">
                    <span className="truncate max-w-[200px]">{row[dataLabelField]}</span>
                    <span className="font-mono">{val}</span>
                  </div>
                  <div className="h-2 bg-[#262626] rounded-full overflow-hidden">
                    <div className="h-full bg-[#2266ec] rounded-full" style={{ width: `${pct}%` }}></div>
                  </div>
                </div>
              );
            })}
            {sortedData.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-[#656565] text-xs">No chart data</div>
            )}
          </div>
        ) : (
          sortedData.map((row: any, i: number) => {
            const val = row.views || row.visitors || 0;
            const sess = row.sessions || Math.max(1, Math.floor(val * 0.25));
            return (
              <div key={i} onClick={() => onRowClick(currentConfig.filterKey, row[dataKeyField])} className="relative flex items-center px-3 py-2 cursor-pointer group rounded-md hover:bg-[#262626]/50">
                <div className="absolute top-1 left-1 bottom-1 bg-[#262626]/40 rounded-sm z-0" style={{ width: `${(val / maxViews) * 100}%` }}></div>
                <div className="flex-1 truncate pr-4 relative z-10 text-[13px] font-medium text-[#fafafa] flex items-center gap-2">
                  {row.icon && <img src={row.icon} className="w-3.5 h-3.5 rounded-sm" onError={(e) => e.currentTarget.style.display = 'none'} />}
                  {row[dataLabelField]}
                </div>
                {columns[1] && <div className="w-16 text-right text-[13px] text-[#fafafa] relative z-10 font-mono font-medium">{val >= 1000 ? (val/1000).toFixed(1)+'K' : val}</div>}
                {columns[2] && <div className="w-16 text-right text-[13px] text-[#fafafa] relative z-10 font-mono font-medium">{sess >= 1000 ? (sess/1000).toFixed(1)+'K' : sess}</div>}
              </div>
            );
          })
        )}
        {!isChartView && sortedData.length === 0 && (
          <div className="flex flex-col items-center justify-center p-8 text-center h-full min-h-[150px]">
            <div className="w-10 h-10 bg-[#262626]/50 rounded-xl flex items-center justify-center mb-3">
              <Search className="w-4 h-4 text-[#656565]" />
            </div>
            <div className="text-[13px] font-medium text-[#fafafa]">No {activeTab} data yet</div>
            <div className="text-[11px] text-[#656565] mt-1">Check back once analytics are collected.</div>
          </div>
        )}
      </div>

      {/* Footer */}
      {hasFooter && (
        <div className="flex items-center justify-between px-3 py-2 border-t border-[#262626] shrink-0 text-[#656565] bg-[#1a1a1a] rounded-b-xl">
          <button 
            type="button"
            title="Expand Full Table"
            onClick={() => onExpand?.(activeTab, currentConfig, sortedData)}
            className="hover:text-[#fafafa] p-1 transition-colors"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
          <button 
            type="button"
            title={isChartView ? "Switch to Table View" : "Switch to Bar View"}
            onClick={() => setIsChartView(!isChartView)}
            className={`p-1 transition-colors ${isChartView ? 'text-[#2266ec]' : 'hover:text-[#fafafa]'}`}
          >
            <LineChartIcon className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};

const MetricCard = ({ kpi, isActive, onClick, timeseries = [], globalHoverIndex, setGlobalHoverIndex }: any) => {
  const isHovered = globalHoverIndex !== null && globalHoverIndex !== undefined;
  
  // Try to use actual data for the bars
  const chartValues = timeseries.length > 0 ? timeseries.map((t: any) => t[kpi.dataKey] || 0) : [4,7,5,8,6,9,10,7,8,6,9,10,7,8,6,9,10,7];
  const maxVal = Math.max(1, ...chartValues);
  
  const displayValue = isHovered && timeseries[globalHoverIndex] 
    ? (kpi.dataKey === 'revenue' ? '0 $' : (kpi.dataKey === 'bounce_rate' ? (timeseries[globalHoverIndex][kpi.dataKey] || 0).toFixed(1) + '%' : (timeseries[globalHoverIndex][kpi.dataKey] || 0)))
    : kpi.value;
    
  const displayDate = isHovered && timeseries[globalHoverIndex] 
    ? new Date(timeseries[globalHoverIndex].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) 
    : kpi.dateLabel || 'Last 7 days';

  return (
    <div 
      onClick={onClick}
      className={`group relative overflow-hidden text-left border rounded-xl flex flex-col h-[100px] cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)] hover:border-white/[0.1] ${isActive ? 'bg-[#262626] border-white/[0.08]' : 'bg-gradient-to-b from-[#1c1c1c] to-[#121212] border-white/[0.04]'}`}
    >
      {isActive && <span className="absolute inset-y-0 left-0 w-[2px] bg-[#2266ec]" />}
      <div className="px-4 pt-3 flex-1 flex flex-col pointer-events-none">
        <div className="flex justify-between items-start">
          <div className="text-[10px] font-semibold text-[#a6a6a6] tracking-wider uppercase">{kpi.label}</div>
          {kpi.trend && <div className={`text-[10px] font-semibold px-1 rounded ${kpi.isPositive ? 'text-green-500 bg-green-500/10' : 'text-red-500 bg-red-500/10'}`}>{kpi.trend}</div>}
        </div>
        <div className="text-xl font-bold text-white mt-1 tabular-nums tracking-tight">
          {typeof displayValue === 'string' && displayValue.includes('%') ? (
            <React.Fragment><AnimatedNumber value={parseFloat(displayValue)} duration={800} formatter={v => v.toFixed(1)} />%</React.Fragment>
          ) : typeof displayValue === 'string' && displayValue.includes('s') ? (
            <React.Fragment><AnimatedNumber value={parseFloat(displayValue)} duration={800} formatter={v => v.toFixed(0)} />s</React.Fragment>
          ) : typeof displayValue === 'string' ? (
            displayValue
          ) : (
            <AnimatedNumber value={Number(displayValue)} duration={800} formatter={v => Math.round(v).toLocaleString()} />
          )}
        </div>
        <div className="text-[10px] text-[#656565] mt-0.5 truncate">{displayDate}</div>
      </div>
      
      <div className="flex items-end gap-[1px] mt-auto h-8 px-1 pb-1 z-10" onMouseLeave={() => setGlobalHoverIndex(null)}>
        {chartValues.map((val: number, j: number) => {
          const h = (val / maxVal) * 100;
          return (
            <div 
              key={j} 
              className={`flex-1 rounded-t-[2px] transition-all duration-300 ${!isHovered || globalHoverIndex === j ? 'opacity-100' : 'opacity-40'} ${isActive ? 'bg-[#2266ec]' : 'bg-[#2266ec]/50 group-hover:bg-[#2266ec]/90'} ${globalHoverIndex === j ? 'shadow-[0_0_10px_rgba(34,102,236,0.6)] z-20' : ''}`} 
              style={{ height: `${Math.max(10, h)}%` }}
              onMouseEnter={() => setGlobalHoverIndex(j)}
            ></div>
          );
        })}
      </div>
    </div>
  );
};

export default function Dashboard() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [sites, setSites] = useState<any[]>([]);
  const { state, setDateRange, setFilter, removeFilter, clearFilters, setProject } = useWorkspace();
  const currentSite = state.project;
  const setCurrentSite = setProject;
  const period = state.dateRange === 'Last 7 days' ? '7d' : state.dateRange === 'Today' ? '1d' : '30d';
  const setPeriod = (p: string) => setDateRange(p === '7d' ? 'Last 7 days' : p === '1d' ? 'Today' : 'Last 30 days');
  const filters = state.filters;
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [stats, setStats] = useState<any>(null);
  const [liveVisitors, setLiveVisitors] = useState<number>(0);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [mapTooltip, setMapTooltip] = useState<{content: string, x: number, y: number} | null>(null);
  const [loading, setLoading] = useState(true);
  const [projectMenuOpen, setProjectMenuOpen] = useState(false);
  const [activeMetric, setActiveMetric] = useState('UNIQUE VISITORS');
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [globalHoverIndex, setGlobalHoverIndex] = useState<number | null>(null);

  // AI State
  const [aiQuery, setAiQuery] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);

  // Activity Stream State
  const [isActivityPanelOpen, setIsActivityPanelOpen] = useState(false);
  const [activityStream, setActivityStream] = useState<any[]>([]);
  const [isActivityLoading, setIsActivityLoading] = useState(false);
  // Interactive UI Modals & Dropdowns State
  const [dateMenuOpen, setDateMenuOpen] = useState(false);
  const [clockMenuOpen, setClockMenuOpen] = useState(false);
  const [granularity, setGranularity] = useState('Day');
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isChartExpanded, setIsChartExpanded] = useState(false);
  const [expandedTableModal, setExpandedTableModal] = useState<{ isOpen: boolean, title: string, config: any, data: any[] }>({
    isOpen: false, title: '', config: null, data: []
  });

  const fetchAiResponse = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && aiQuery.trim() && currentSite && token) {
      setIsAiLoading(true);
      setAiResponse(null);
      
      try {
        const res = await fetch(`${apiUrl}/api/stats/${currentSite}/ai`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ question: aiQuery, period, filters })
        });
        
        const data = await res.json();
        if (data.answer) {
          setAiResponse(data.answer);
        } else {
          setAiResponse('Sorry, an error occurred analyzing the data.');
        }
      } catch (err) {
        setAiResponse('Network error connecting to AI service.');
      }
      setIsAiLoading(false);
    }
  };

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://litetrack-api-916484331446.us-central1.run.app';

  useEffect(() => {
    const t = localStorage.getItem('litetrack_token');
    if (!t) router.push('/login');
    else { setToken(t); fetchSites(t); }
  }, [router]);

  useEffect(() => {
    if (token && currentSite) {
      fetchStats();
      fetchLiveStats();
      const interval = setInterval(fetchLiveStats, 30000); // Poll live stats every 30s
      return () => clearInterval(interval);
    }
  }, [token, currentSite, period, filters]);

  const fetchLiveStats = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/stats/${currentSite}/live`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.live_visitors !== undefined) {
          setLiveVisitors(data.live_visitors);
          // If we successfully fetched and there are any events in our backend, it's connected.
          setIsConnected(true);
        } else {
          setIsConnected(false);
        }
      } else {
        setIsConnected(false);
      }
    } catch {
      setIsConnected(false);
    }
  };

  const fetchActivityStream = async () => {
    setIsActivityLoading(true);
    const data = await fetch(`${apiUrl}/api/stats/${currentSite}/activity`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(r => r.json()).catch(() => null);
    if (data && data.activity) {
      setActivityStream(data.activity);
    }
    setIsActivityLoading(false);
  };

  const fetchSites = async (t: string) => {
    try {
      const res = await fetch(`${apiUrl}/api/sites`, { headers: { 'Authorization': `Bearer ${t}` } });
      if (res.status === 401) {
        localStorage.removeItem('litetrack_token');
        router.push('/login');
        return;
      }
      const data = await res.json();
      if (data?.sites) {
        setSites(data.sites);
        if (data.sites.length > 0 && currentSite === 'Workspace Admin') setCurrentSite(data.sites[0].site_id, data.sites[0].domain);
      }
    } catch (e) {
      // Ignored
    }
  };

  const fetchStats = async () => {
    setLoading(true);
    const queryParams = new URLSearchParams({ period });
    Object.entries(filters).forEach(([k, v]) => { if (v) queryParams.append(k, v); });
    
    const data = await fetch(`${apiUrl}/api/stats/${currentSite}?${queryParams.toString()}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(r => {
      if (r.status === 401) {
        localStorage.removeItem('litetrack_token');
        router.push('/login');
        return null;
      }
      return r.json();
    }).catch(() => null);
    if (data) setStats(data);
    setLoading(false);
  };

  const [adminViewMode, setAdminViewMode] = useState<'analytics' | 'admin'>('analytics');
  
  if (!token) return null;

  const currentSiteObj = sites.find(s => s.site_id === currentSite);
  const currentDomain = currentSiteObj?.domain || 'Select Project';
  const template = currentSiteObj?.template || 'saas';

  const formatNumber = (num: number) => {
    if (!num) return '0';
    return num >= 1000 ? (num / 1000).toFixed(1) + 'K' : num.toString();
  };

  const chartData = stats?.timeseries || [];
  
  const sourceData = stats?.top_sources?.map((s:any) => ({ ...s, icon: `https://icons.duckduckgo.com/ip3/${s.source}.ico` })) || [];

  return (
    <>
      
      {/* SIDEBAR EXACT MATCH */}
      {/* Main Content Area */}
      
        
        {/* STICKY HEADER */}
        <div className="sticky top-0 z-30 bg-[#121212]/90 backdrop-blur-md border-b border-white/[0.05] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex bg-[#1a1a1a] border border-[#262626] rounded-lg p-0.5 text-xs font-medium">
              <button 
                onClick={() => setAdminViewMode('analytics')}
                className={`px-3 py-1 rounded-md transition-colors flex items-center gap-1.5 ${
                  adminViewMode === 'analytics' ? 'bg-[#2266ec] text-white font-semibold' : 'text-[#a6a6a6] hover:text-white'
                }`}
              >
                <Activity className="w-3.5 h-3.5" /> Analytics
              </button>
              <button 
                onClick={() => setAdminViewMode('admin')}
                className={`px-3 py-1 rounded-md transition-colors flex items-center gap-1.5 ${
                  adminViewMode === 'admin' ? 'bg-[#2266ec] text-white font-semibold' : 'text-[#a6a6a6] hover:text-white'
                }`}
              >
                <Shield className="w-3.5 h-3.5 text-amber-400" /> Site Admin Panel
              </button>
            </div>
            <div className="relative">
              <button 
                onClick={() => setDateMenuOpen(!dateMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 bg-[#1a1a1a] border border-[#262626] rounded-md text-[13px] font-medium text-white hover:bg-[#262626] transition-colors"
              >
                <Calendar className="w-3.5 h-3.5 text-[#2266ec]" /> {state.dateRange} <ChevronDown className="w-3 h-3 opacity-60" />
              </button>
              {dateMenuOpen && (
                <div className="absolute top-full mt-1 left-0 w-48 bg-[#1a1a1a] border border-[#262626] rounded-md shadow-2xl p-1 z-50">
                  {['Today', 'Last 7 days', 'Last 30 days', 'Last 90 days', 'Last 12 months'].map(r => (
                    <button 
                      key={r}
                      onClick={() => { setDateRange(r); setDateMenuOpen(false); }}
                      className={`block w-full text-left px-3 py-2 text-[13px] rounded transition-colors ${state.dateRange === r ? 'text-[#2266ec] bg-[#2266ec]/10 font-semibold' : 'text-[#fafafa] hover:bg-[#262626]'}`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <button 
                onClick={() => setClockMenuOpen(!clockMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 bg-[#1a1a1a] border border-[#262626] rounded-md text-[13px] font-medium text-white hover:bg-[#262626] transition-colors"
              >
                <Clock className="w-3.5 h-3.5 text-[#a6a6a6]" /> {granularity} <ChevronDown className="w-3 h-3 opacity-60" />
              </button>
              {clockMenuOpen && (
                <div className="absolute top-full mt-1 left-0 w-36 bg-[#1a1a1a] border border-[#262626] rounded-md shadow-2xl p-1 z-50">
                  {['Hour', 'Day', 'Week', 'Month'].map(g => (
                    <button 
                      key={g}
                      onClick={() => { setGranularity(g); setClockMenuOpen(false); }}
                      className={`block w-full text-left px-3 py-2 text-[13px] rounded transition-colors ${granularity === g ? 'text-[#2266ec] bg-[#2266ec]/10 font-semibold' : 'text-[#fafafa] hover:bg-[#262626]'}`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <div className="relative">
              <button 
                onClick={() => Object.values(filters).filter(Boolean).length > 0 ? clearFilters() : setFilterMenuOpen(!filterMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 bg-[#1a1a1a] border border-[#262626] rounded-md text-[13px] font-medium text-white hover:bg-[#262626] transition-colors"
              >
                <Filter className="w-3.5 h-3.5" /> 
                {Object.values(filters).filter(Boolean).length > 0 ? `Clear Filters (${Object.values(filters).filter(Boolean).length})` : 'Filters'}
              </button>
              {filterMenuOpen && (
                <div className="absolute top-full mt-1 left-0 w-52 bg-[#1a1a1a] border border-[#262626] rounded-md shadow-xl p-2 z-50">
                  <div className="text-[11px] text-[#656565] mb-2 px-1 font-medium uppercase tracking-wider">Quick Filters</div>
                  {[
                    'Browser: Chrome', 'Browser: Safari', 'OS: Windows', 'OS: macOS', 'Device: Mobile', 'Device: Desktop'
                  ].map(f => (
                    <button 
                      key={f}
                      onClick={() => {
                        const [k, v] = f.split(': ');
                        setFilter(k.toLowerCase(), v);
                        setFilterMenuOpen(false);
                      }}
                      className="block w-full text-left px-2.5 py-1.5 text-[13px] text-[#fafafa] hover:bg-[#262626] rounded transition-colors"
                    >
                      {f}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Show active filter chips */}
            {Object.entries(filters).map(([k, v]) => v ? (
              <div key={k} className="flex items-center gap-1 bg-[#2266ec]/20 border border-[#2266ec]/50 text-[#2266ec] px-2 py-1.5 rounded-md text-[11px] font-medium">
                {k}: {v}
                <button onClick={() => removeFilter(k)} className="ml-1 hover:text-white">&times;</button>
              </div>
            ) : null)}
            
            <div className="ml-2 flex items-center gap-2 bg-[#1a1a1a] border border-[#262626] rounded-md px-3 py-1.5 w-[300px]">
              <Sparkles className="w-3.5 h-3.5 text-[#656565]" />
              <input 
                type="text" 
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                onKeyDown={fetchAiResponse}
                placeholder='Ask AI: "Why did traffic spike today?"' 
                className="bg-transparent text-[13px] text-white outline-none w-full placeholder:text-[#656565]" 
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#1a1a1a] border border-white/[0.05] rounded-full shadow-sm">
              <span className="relative flex h-2 w-2">
                {isConnected ? (
                  <React.Fragment>
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
                  </React.Fragment>
                )}
              </span>
              <span className="text-[11px] font-semibold text-[#fafafa] tracking-wide">{isConnected ? 'Connected' : 'Waiting...'}</span>
              <span className="text-[10px] text-[#656565]">{isConnected ? 'Updates every 30s' : 'No data yet'}</span>
            </div>
            <button 
              onClick={() => setIsPrivacyOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-transparent border border-white/[0.05] rounded-full text-[11px] font-medium text-[#a6a6a6] hover:text-white hover:border-white/20 transition-all cursor-pointer"
            >
              <Lock className="w-3 h-3 text-[#a6a6a6]" /> Private
            </button>
          </div>
        </div>

        {/* AI Result Overlay */}
        {(aiResponse || isAiLoading) && (
          <div className="fixed top-20 left-64 ml-6 w-[450px] bg-[#1a1a1a] border border-[#333] rounded-xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[80vh]">
            <div className="bg-[#262626] px-4 py-2.5 border-b border-[#333] flex justify-between items-center">
              <div className="flex items-center gap-2 text-[12px] font-semibold text-white">
                <Sparkles className="w-4 h-4 text-[#2266ec]" /> LiteTrack AI Analyst
              </div>
              <button onClick={() => { setAiResponse(null); setAiQuery(''); setIsAiLoading(false); }} className="text-[#a6a6a6] hover:text-white">✕</button>
            </div>
            <div className="p-5 overflow-y-auto text-[13px] text-[#fafafa] leading-relaxed whitespace-pre-wrap">
              {isAiLoading ? (
                <div className="flex items-center gap-3 text-[#a6a6a6]">
                  <div className="w-4 h-4 rounded-full border-2 border-[#2266ec] border-t-transparent animate-spin"></div>
                  Analyzing your data and generating insights...
                </div>
              ) : (
                aiResponse
              )}
            </div>
          </div>
        )}

        <div className="p-6 max-w-[1600px] mx-auto space-y-8">
          {adminViewMode === 'admin' ? (
            <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-8 flex flex-col items-center justify-center text-center space-y-6 h-[50vh] animate-in fade-in slide-in-from-bottom-2 duration-300 mt-8">
              <div className="w-16 h-16 bg-[#2266ec]/10 border border-[#2266ec]/20 rounded-2xl flex items-center justify-center">
                <Shield className="w-8 h-8 text-[#2266ec]" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Site Admin Panel</h2>
                <p className="text-[#a6a6a6] max-w-md mx-auto text-sm">
                  Full site administration, user management, and database operations have been moved to the dedicated Data Manager.
                </p>
              </div>
              <div className="flex items-center gap-4 pt-4">
                <Link href="/data-manager/users" className="bg-[#2266ec] hover:bg-[#1d57cc] text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2">
                  <Users className="w-4 h-4" /> Manage Users
                </Link>
                <Link href="/settings" className="bg-[#262626] hover:bg-[#333] border border-[#404040] text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2">
                  <Settings className="w-4 h-4" /> Site Settings
                </Link>
              </div>
            </div>
          ) : (
            <React.Fragment>

          
          {/* Active Filters */}
          {Object.keys(filters).length > 0 && (
            <div className="flex flex-wrap items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
              <span className="text-[12px] font-semibold text-[#656565] uppercase tracking-wider mr-2">Active Filters:</span>
              {Object.entries(filters).map(([k, v]) => (
                <div key={k} className="flex items-center gap-1.5 bg-[#2266ec]/10 border border-[#2266ec]/20 text-[#2266ec] px-3 py-1.5 rounded-full text-[12px] font-medium shadow-[0_0_10px_rgba(34,102,236,0.1)] group transition-all hover:bg-[#2266ec]/20 hover:border-[#2266ec]/30">
                  <span className="capitalize">{k}:</span> <span className="text-white">{v}</span>
                  <button 
                    onClick={() => {
                      removeFilter(k);
                    }}
                    className="ml-1 text-[#2266ec]/70 hover:text-white transition-colors"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button 
                onClick={() => clearFilters()}
                className="text-[12px] text-[#a6a6a6] hover:text-white underline underline-offset-2 ml-2 transition-colors"
              >
                Clear all
              </button>
            </div>
          )}

          {/* KPI Grid (Exactly like screenshot) */}
          <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-4 gap-6">
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)
            ) : (
              [
                { label: 'UNIQUE VISITORS', value: formatNumber(stats?.summary?.unique_visitors), dataKey: 'unique_visitors', trend: null, isPositive: true },
                { label: 'SESSIONS', value: formatNumber(stats?.summary?.unique_visitors), dataKey: 'unique_visitors', trend: null, isPositive: true },
                { label: 'PAGEVIEWS', value: formatNumber(stats?.summary?.pageviews), dataKey: 'pageviews', trend: null, isPositive: true },
                { label: 'PAGES PER SESSION', value: stats?.summary?.unique_visitors ? (stats.summary.pageviews / stats.summary.unique_visitors).toFixed(1) : '0', dataKey: 'pages_per_session', trend: null, isPositive: true },
                { label: 'BOUNCE RATE', value: (stats?.summary?.bounce_rate || 0).toFixed(1) + '%', dataKey: 'bounce_rate', trend: null, isPositive: true },
                { label: 'SESSION DURATION', value: (stats?.summary?.avg_duration || 0) + 's', dataKey: 'avg_duration', trend: null, isPositive: true },
                { label: 'REVENUE', value: '0 $', dataKey: 'revenue', trend: null, isPositive: true },
                { label: 'Live · 30 min', value: liveVisitors.toString(), dataKey: 'live', dateLabel: 'Last 30 min', trend: null, isPositive: true },
              ].map((kpi, i) => (
                <MetricCard 
                  key={i} 
                  kpi={kpi} 
                  isActive={activeMetric === kpi.label} 
                  onClick={() => {
                    if (kpi.label === 'Live · 30 min') {
                      setIsActivityPanelOpen(true);
                      fetchActivityStream();
                    } else {
                      setActiveMetric(kpi.label);
                    }
                  }}
                  timeseries={chartData}
                  globalHoverIndex={globalHoverIndex}
                  setGlobalHoverIndex={setGlobalHoverIndex}
                />
              ))
            )}
          </div>

          {/* Main Chart */}
          {loading ? (
            <ChartSkeleton />
          ) : (
            <div className="bg-gradient-to-b from-[#181818] to-[#121212] border border-white/[0.04] rounded-xl p-6 shadow-xl relative overflow-hidden group">
              <h2 className="text-[13px] font-medium text-[#fafafa] mb-6 flex items-center justify-between tracking-wide">
                <span>{activeMetric.charAt(0).toUpperCase() + activeMetric.slice(1).toLowerCase()} Overview</span>
                <button 
                  onClick={() => setIsChartExpanded(true)} 
                  className="text-[#a6a6a6] hover:text-white opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-[#262626]"
                  title="Expand Overview Chart"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </h2>
              <div className="h-[250px] relative w-full -ml-4 z-10">
                {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart 
                    data={chartData} 
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    onMouseMove={(e) => {
                      if (e && e.activeTooltipIndex !== undefined) {
                        setGlobalHoverIndex(Number(e.activeTooltipIndex));
                      }
                    }}
                    onMouseLeave={() => setGlobalHoverIndex(null)}
                  >
                    <defs>
                      <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2266ec" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#2266ec" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#262626" />
                    <XAxis 
                      dataKey="date" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#656565', fontSize: 11 }} 
                      dy={10}
                      minTickGap={30}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#656565', fontSize: 11 }}
                      tickFormatter={(value) => value >= 1000 ? `${(value/1000).toFixed(1)}k` : value}
                      dx={-10}
                    />
                    <RechartsTooltip content={<CustomTooltip />} cursor={{ stroke: '#333', strokeWidth: 1, strokeDasharray: '4 4' }} />
                    <Area 
                      type="monotone" 
                      dataKey={activeMetric.toLowerCase() === 'revenue' ? 'revenue' : (activeMetric.toLowerCase().replace(/ /g, '_'))} 
                      stroke="#2266ec" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorPv)" 
                      activeDot={{ r: 5, fill: '#2266ec', stroke: '#fff', strokeWidth: 2, className: "shadow-[0_0_10px_rgba(34,102,236,0.8)]" }}
                      animationDuration={800}
                      animationEasing="ease-out"
                    />
                    <Brush 
                      dataKey="date" 
                      height={20} 
                      stroke="#2266ec" 
                      fill="#121212"
                      tickFormatter={() => ''}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full w-full flex items-center justify-center text-[#656565] text-xs">No data available</div>
              )}
            </div>
          </div>
          )}

          {/* Data Tables Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-4">
            
            <TabbedTable 
              tabs={['Refs', 'Urls', 'Types', 'Source', 'Medium', 'Campaign', 'Term', 'Content']}
              defaultTab="Source"
              searchPlaceholder="Search sources"
              onRowClick={(k, val) => setFilter(k, val)}
              onExpand={(t, c, d) => setExpandedTableModal({ isOpen: true, title: `${t} Breakdown`, config: c, data: d })}
              tabConfigs={{
                'Source': { data: sourceData, labelField: 'source', keyField: 'source', filterKey: 'source', columns: ['Source', 'Views', 'Sess.'] },
                'Medium': { data: stats?.medium || [], labelField: 'medium', keyField: 'medium', filterKey: 'utm_medium', columns: ['Medium', 'Views', 'Sess.'] },
                'Campaign': { data: stats?.campaign || [], labelField: 'campaign', keyField: 'campaign', filterKey: 'utm_campaign', columns: ['Campaign', 'Views', 'Sess.'] },
                'Term': { data: stats?.term || [], labelField: 'term', keyField: 'term', filterKey: 'utm_term', columns: ['Term', 'Views', 'Sess.'] },
                'Content': { data: stats?.content || [], labelField: 'content', keyField: 'content', filterKey: 'utm_content', columns: ['Content', 'Views', 'Sess.'] },
                'Refs': { data: stats?.refs || [], labelField: 'ref', keyField: 'ref', filterKey: 'referrer', columns: ['Referrer', 'Views', 'Sess.'] },
                'Urls': { data: stats?.urls || [], labelField: 'url', keyField: 'url', filterKey: 'hostname', columns: ['Url', 'Views', 'Sess.'] },
                'Types': { data: stats?.types || [], labelField: 'type', keyField: 'type', filterKey: 'type', columns: ['Type', 'Views', 'Sess.'] }
              }}
            />

            <TabbedTable 
              tabs={['Pages', 'Entries', 'Exits']}
              defaultTab="Pages"
              searchPlaceholder="Search pages"
              onRowClick={(k, val) => setFilter(k, val)}
              onExpand={(t, c, d) => setExpandedTableModal({ isOpen: true, title: `${t} Breakdown`, config: c, data: d })}
              tabConfigs={{
                'Pages': { data: stats?.top_pages || [], labelField: 'pathname', keyField: 'pathname', filterKey: 'pathname', columns: ['Path', 'Views', 'Sess.'] },
                'Entries': { data: stats?.entries || [], labelField: 'pathname', keyField: 'pathname', filterKey: 'pathname', columns: ['Entry Path', 'Views', 'Sess.'] },
                'Exits': { data: stats?.exits || [], labelField: 'pathname', keyField: 'pathname', filterKey: 'pathname', columns: ['Exit Path', 'Views', 'Sess.'] }
              }}
            />

            {template !== 'minimal' && (
              <TabbedTable 
                tabs={['Devices', 'Browser', 'Browser Version', 'OS', 'OS Version', 'Brands', 'Models']}
                defaultTab="Devices"
                searchPlaceholder="Search technology"
                onRowClick={(k, val) => setFilter(k, val)}
                onExpand={(t, c, d) => setExpandedTableModal({ isOpen: true, title: `${t} Breakdown`, config: c, data: d })}
                tabConfigs={{
                  'Devices': { data: stats?.devices || [], labelField: 'device', keyField: 'device', filterKey: 'device', columns: ['Device', 'Views', 'Sess.'] },
                  'Browser': { data: stats?.browsers || [], labelField: 'browser', keyField: 'browser', filterKey: 'browser', columns: ['Browser', 'Views', 'Sess.'] },
                  'OS': { data: stats?.os || [], labelField: 'os', keyField: 'os', filterKey: 'os', columns: ['OS', 'Views', 'Sess.'] },
                  'Browser Version': { data: stats?.browser_version || [], labelField: 'id', keyField: 'id', filterKey: 'browser_version', columns: ['Version', 'Views', 'Sess.'] },
                  'OS Version': { data: stats?.os_version || [], labelField: 'id', keyField: 'id', filterKey: 'os_version', columns: ['Version', 'Views', 'Sess.'] },
                  'Brands': { data: stats?.brands || [], labelField: 'id', keyField: 'id', filterKey: 'device_brand', columns: ['Brand', 'Views', 'Sess.'] },
                  'Models': { data: stats?.models || [], labelField: 'id', keyField: 'id', filterKey: 'device_model', columns: ['Model', 'Views', 'Sess.'] }
                }}
              />
            )}

            {(template === 'saas' || template === 'ecommerce') && (
              <TabbedTable 
                tabs={['Events', 'Link out']}
                defaultTab="Events"
                searchPlaceholder="Search events"
                onRowClick={(k, val) => setFilter(k, val)}
                onExpand={(t, c, d) => setExpandedTableModal({ isOpen: true, title: `${t} Breakdown`, config: c, data: d })}
                tabConfigs={{
                  'Events': { data: stats?.events || [], labelField: 'event', keyField: 'event', filterKey: 'event', columns: ['Event', 'Count', ''] },
                  'Link out': { data: stats?.linkOut || [], labelField: 'link', keyField: 'link', filterKey: 'link', columns: ['Link', 'Clicks', ''] }
                }}
              />
            )}

            {template !== 'minimal' && (
              <TabbedTable 
                tabs={['Countries', 'Regions', 'Cities']}
                defaultTab="Countries"
                searchPlaceholder="Search locations"
                onRowClick={(k, val) => setFilter(k, val)}
                onExpand={(t, c, d) => setExpandedTableModal({ isOpen: true, title: `${t} Breakdown`, config: c, data: d })}
                hasFooter={true}
                tabConfigs={{
                  'Countries': { data: stats?.countries || [], labelField: 'country', keyField: 'country', filterKey: 'country', columns: ['Country', 'Views', 'Sess.'] },
                  'Regions': { data: stats?.regions || [], labelField: 'region', keyField: 'region', filterKey: 'region', columns: ['Region', 'Views', 'Sess.'] },
                  'Cities': { data: stats?.cities || [], labelField: 'city', keyField: 'city', filterKey: 'city', columns: ['City', 'Views', 'Sess.'] }
                }}
              />
            )}

            {/* Map Implementation */}
            {template !== 'minimal' && (
              <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl flex flex-col h-[400px]">
                <div className="px-4 py-3 border-b border-[#262626]">
                  <h3 className="text-xs font-semibold text-[#fafafa]">Map</h3>
                </div>
                <div className="flex-1 flex items-center justify-center relative overflow-hidden bg-[#121212] rounded-b-xl pb-6">
                  <ComposableMap 
                    projectionConfig={{ scale: 180, center: [0, 10] }} 
                    width={800} 
                    height={400} 
                    style={{ width: "100%", height: "100%", objectFit: "contain" }}
                  >
                    <Geographies geography={geoUrl}>
                      {({ geographies }: any) => {
                        const countryNamesWithTraffic = (stats?.countries || []).map((c: any) => c.country.toLowerCase());
                        
                        return geographies.map((geo: any) => {
                          const geoName = geo.properties.name.toLowerCase();
                          const isHighlighted = countryNamesWithTraffic.includes(geoName) || 
                                                (stats?.countries || []).some((c:any) => c.country === geo.properties["iso_a2"]);
                          
                          return (
                            <Geography 
                              key={geo.rsmKey} 
                              geography={geo} 
                              fill={isHighlighted ? "#2266ec" : "#262626"} 
                              stroke="#121212"
                              strokeWidth={0.5}
                              style={{
                                default: { outline: "none", transition: "all 250ms" },
                                hover: { fill: isHighlighted ? "#3b7cfc" : "#333", outline: "none", cursor: "pointer" },
                                pressed: { outline: "none" },
                              }}
                            />
                          );
                        });
                      }}
                    </Geographies>
                  </ComposableMap>
                  <span className="absolute bottom-2 right-2 text-[10px] text-[#656565]">Geo data provided by MaxMind</span>
                </div>
              </div>
            )}

          </div>
          
          {/* Bottom Heatmap */}
          {(template === 'saas' || template === 'ecommerce') && (
            <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-4 mt-8">
              <div className="flex gap-4 mb-4 text-[11px] font-semibold text-[#656565]">
                <span className="text-[#fafafa]">Unique Visitors</span>
              </div>
              
              <div className="h-[200px] border border-[#262626] rounded-lg bg-[#121212] flex overflow-hidden p-2 gap-1">
                <div className="flex flex-col justify-between text-[10px] text-[#656565] pr-2">
                  <span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>23:00</span>
                </div>
                <div className="flex-1 grid grid-cols-7 gap-1">
                  {[...Array(7)].map((_, i) => {
                    // Map column 0-6 to Mon(2)-Sun(1)
                    const dayNum = i === 6 ? 1 : i + 2;
                    
                    return (
                      <div key={i} className="flex flex-col gap-[2px]">
                        {[...Array(24)].map((_, j) => {
                          const cellData = stats?.heatmap?.find((d: any) => d.day === dayNum && d.hour === j);
                          const val = cellData?.visitors || 0;
                          const maxVal = Math.max(1, ...(stats?.heatmap?.map((d: any) => d.visitors) || []));
                          
                          // Calculate opacity based on value relative to max (min 0.1 for empty, max 1.0)
                          const opacity = val === 0 ? 0.05 : 0.2 + (0.8 * (val / maxVal));
                          
                          return (
                            <div 
                              key={j} 
                              className="flex-1 bg-[#2266ec] rounded-sm transition-opacity cursor-crosshair group relative"
                              style={{ opacity }}
                            >
                              <div className="absolute hidden group-hover:block bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-[#262626] text-white text-[10px] rounded whitespace-nowrap z-50">
                                {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][i]} at {j.toString().padStart(2, '0')}:00 - {val} Visitors
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="flex justify-around text-[10px] text-[#656565] mt-2 ml-10">
                <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
              </div>
            </div>
          )}
          
          {/* User Journey */}
          {(template === 'saas' || template === 'ecommerce') && (
            <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-4 mt-4 mb-10 flex flex-col">
              <div className="flex justify-between items-center">
                <h2 className="text-[13px] font-semibold text-[#fafafa]">User Journey</h2>
                <div className="flex gap-4">
                  <button 
                    onClick={() => setActiveTab('journey3' as any)}
                    className={`text-[11px] transition-colors pb-1 ${activeTab === 'journey3' || activeTab === 'overview' ? 'text-white border-b border-white' : 'text-[#a6a6a6] hover:text-white'}`}
                  >
                    3 Steps
                  </button>
                  <button 
                    onClick={() => setActiveTab('journey5' as any)}
                    className={`text-[11px] transition-colors pb-1 ${activeTab === 'journey5' ? 'text-white border-b border-white' : 'text-[#a6a6a6] hover:text-white'}`}
                  >
                    5 Steps
                  </button>
                </div>
              </div>
              
              <div className="mt-6 flex-1 min-h-[150px]">
                {(() => {
                  const is5 = activeTab === 'journey5';
                  const paths = is5 ? stats?.journey5 : stats?.journey3;
                  
                  if (!paths || paths.length === 0) {
                    return (
                      <div className="h-full flex items-center justify-center text-[11px] text-[#656565]">
                        No journey data available for this timeframe
                      </div>
                    );
                  }

                  const maxCount = Math.max(1, ...paths.map((p: any) => p.count));

                  return (
                    <div className="space-y-3">
                      {paths.slice(0, 5).map((path: any, i: number) => {
                        const steps = is5 
                          ? [path.step1, path.step2, path.step3, path.step4, path.step5].filter(Boolean)
                          : [path.step1, path.step2, path.step3].filter(Boolean);
                        
                        return (
                          <div key={i} className="flex flex-col gap-1 relative">
                            <div className="flex items-center gap-2 text-[11px] font-medium text-[#fafafa]">
                              <span className="w-8 text-right font-mono text-[#656565] shrink-0">{path.count}</span>
                              <div className="flex items-center flex-1 flex-wrap gap-2">
                                {steps.map((step, stepIdx) => (
                                  <div key={stepIdx} className="flex items-center gap-2">
                                    <div className="px-2 py-1 bg-[#262626] border border-[#333] rounded text-[#fafafa] truncate max-w-[150px]">
                                      {step === '/' ? '/ (Home)' : step}
                                    </div>
                                    {stepIdx < steps.length - 1 && <span className="text-[#656565] font-bold">→</span>}
                                  </div>
                                ))}
                              </div>
                            </div>
                            {/* Mini Progress Bar representing volume relative to max */}
                            <div className="ml-10 h-1 bg-[#262626] rounded-full overflow-hidden w-full max-w-[400px]">
                              <div className="h-full bg-[#2266ec]" style={{ width: `${(path.count / maxCount) * 100}%` }}></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
              
              <div className="text-[10px] text-[#656565] mt-6 border-t border-[#262626] pt-3">
                Shows the most common sequential paths users take through your application starting from their entry point.
              </div>
            </div>
          )}

            </React.Fragment>
          )}
        </div>
        <SlidePanel
          isOpen={isActivityPanelOpen}
          onClose={() => setIsActivityPanelOpen(false)}
          title="Live Activity Stream"
          subtitle="Real-time chronological events from active users"
          actions={<span className="flex items-center gap-2 text-[#656565] text-xs"><span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span></span> {liveVisitors} Online</span>}
        >
          <div className="space-y-4">
            {isActivityLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-16 bg-[#1a1a1a] rounded-xl border border-[#262626] animate-pulse"></div>
              ))
            ) : activityStream.length > 0 ? (
              activityStream.map((event, i) => (
                <div key={i} className="flex gap-4 p-4 bg-[#1a1a1a] rounded-xl border border-[#262626] hover:border-[#333] transition-colors relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#2266ec]/5 rounded-full blur-2xl -mr-8 -mt-8 group-hover:bg-[#2266ec]/10 transition-all"></div>
                  
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#2266ec] to-purple-500 flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-lg shadow-[#2266ec]/20">
                    {event.visitor_id.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <div className="text-[13px] font-medium text-white truncate max-w-[200px]" title={event.pathname}>
                        {event.pathname}
                      </div>
                      <div className="text-[11px] text-[#a6a6a6] whitespace-nowrap">{event.time}</div>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-[#656565]">
                      <span className="flex items-center gap-1.5"><Monitor className="w-3 h-3" /> {event.device || 'Unknown'}</span>
                      <span className="flex items-center gap-1.5"><Globe className="w-3 h-3" /> {event.country || 'Unknown'}</span>
                      <span className="flex items-center gap-1.5"><LayoutDashboard className="w-3 h-3" /> {event.browser || 'Unknown'}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-[#656565] text-[13px]">No recent activity found.</div>
            )}
          </div>
        </SlidePanel>

        {/* Modal 1: Expanded Overview Chart */}
        {isChartExpanded && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-6 animate-in fade-in duration-200">
            <div className="bg-[#1a1a1a] border border-[#333] rounded-2xl w-full max-w-5xl p-6 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-[#262626] pb-4">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <LineChartIcon className="w-5 h-5 text-[#2266ec]" />
                  {activeMetric} - Detailed High-Resolution Breakdown
                </h2>
                <button onClick={() => setIsChartExpanded(false)} className="text-[#a6a6a6] hover:text-white text-lg">✕</button>
              </div>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorPvLarge" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2266ec" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#2266ec" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#262626" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#656565', fontSize: 12 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#656565', fontSize: 12 }} dx={-10} />
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey={activeMetric.toLowerCase() === 'revenue' ? 'revenue' : activeMetric.toLowerCase().replace(/ /g, '_')} stroke="#2266ec" strokeWidth={3} fillOpacity={1} fill="url(#colorPvLarge)" />
                    <Brush dataKey="date" height={24} stroke="#2266ec" fill="#121212" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Modal 2: Expanded Table Breakdown */}
        {expandedTableModal.isOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-6 animate-in fade-in duration-200">
            <div className="bg-[#1a1a1a] border border-[#333] rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col p-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#262626] pb-4 shrink-0">
                <div>
                  <h2 className="text-lg font-semibold text-white">{expandedTableModal.title}</h2>
                  <p className="text-xs text-[#a6a6a6] mt-0.5">Full metric listing ({expandedTableModal.data.length} rows)</p>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => {
                      const csvHeader = 'Item,Count\n';
                      const csvRows = expandedTableModal.data.map((r: any) => `"${r[expandedTableModal.config?.labelField || 'id']}","${r.views || r.visitors || 0}"`).join('\n');
                      const blob = new Blob([csvHeader + csvRows], { type: 'text/csv' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `${expandedTableModal.title.toLowerCase().replace(/ /g, '_')}.csv`;
                      a.click();
                    }}
                    className="px-3 py-1.5 bg-[#2266ec] text-white rounded-md text-xs font-medium hover:bg-[#2266ec]/90 transition-colors shadow-lg"
                  >
                    Export CSV
                  </button>
                  <button onClick={() => setExpandedTableModal({ isOpen: false, title: '', config: null, data: [] })} className="text-[#a6a6a6] hover:text-white text-lg">✕</button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto mt-4 space-y-1 pr-1">
                {expandedTableModal.data.map((row: any, idx: number) => {
                  const labelField = expandedTableModal.config?.labelField || 'id';
                  const val = row.views || row.visitors || 0;
                  return (
                    <div key={idx} className="flex items-center justify-between p-3 bg-[#262626]/40 rounded-lg hover:bg-[#262626] transition-colors text-xs">
                      <span className="font-medium text-white truncate max-w-[500px]">{row[labelField]}</span>
                      <span className="font-mono text-[#fafafa] font-semibold">{val}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Modal 3: Privacy & Security Policy */}
        {isPrivacyOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-6 animate-in fade-in duration-200">
            <div className="bg-[#1a1a1a] border border-[#333] rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-[#262626] pb-3">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Lock className="w-4 h-4 text-green-400" /> LiteTrack Privacy Guarantees
                </h3>
                <button onClick={() => setIsPrivacyOpen(false)} className="text-[#a6a6a6] hover:text-white text-sm">✕</button>
              </div>
              <div className="text-xs text-[#a6a6a6] leading-relaxed space-y-2">
                <p><strong>• Zero Cookies:</strong> LiteTrack uses no tracking cookies or local storage persistence.</p>
                <p><strong>• DNT Compliant:</strong> Automatically respects browser Do-Not-Track (DNT) headers.</p>
                <p><strong>• Daily Hashed Visitor IDs:</strong> Visitor IDs are salted and rotated daily using SHA-256 to ensure complete GDPR/CCPA anonymity.</p>
              </div>
            </div>
          </div>
        )}
      
    </>
  );
}
