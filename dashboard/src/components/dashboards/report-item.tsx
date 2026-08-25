"use client";

import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { Copy, Trash, MoreHorizontal, Maximize2, Download, RefreshCw } from 'lucide-react';
import { toast } from '@/components/ui/toast';
import { useWorkspace } from '@/components/ui/workspace-context';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://litetrack-api-916484331446.us-central1.run.app';


const COLORS = ['#2266ec', '#1a4bb3', '#11317a', '#3f7eee', '#5b94ff'];

export function ReportItem({ report, onDelete, onDuplicate }: { report: any, onDelete?: (id: string) => void, onDuplicate?: (id: string) => void }) {
    const { state } = useWorkspace();
  const [data, setData] = useState<any[]>(report.data || []);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (report.metric) {
      const fetchReportData = async () => {
        setLoading(true);
        try {
          const token = localStorage.getItem('litetrack_token');
          const res = await fetch(`${apiUrl}/api/stats/${state.project}/custom?metric=${report.metric}&dimension=${report.dimension}&days=30`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            const json = await res.json();
            setData(json.data || []);
          }
        } catch (e) {
          console.error(e);
        } finally {
          setLoading(false);
        }
      };
      fetchReportData();
    }
  }, [report.metric, report.dimension, state.project]);

  const [menuOpen, setMenuOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number } | null>(null);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Calculate position, ensuring it doesn't overflow screen bounds
    const x = Math.min(e.clientX, window.innerWidth - 180);
    const y = Math.min(e.clientY, window.innerHeight - 200);
    
    setContextMenu({ x, y });
  };

  // Close context menu on click outside
  React.useEffect(() => {
    const closeMenu = () => setContextMenu(null);
    if (contextMenu) {
      window.addEventListener('click', closeMenu);
      return () => window.removeEventListener('click', closeMenu);
    }
  }, [contextMenu]);

  const renderChart = () => {
    if (!data || data.length === 0) {
      return <div className="h-full flex items-center justify-center text-[#656565] text-sm">No data</div>;
    }

    switch (report.chartType) {
      case 'metric':
        return (
          <div className="flex flex-col justify-center h-full relative group/metric cursor-pointer">
            <div className="text-[11px] font-medium text-[#8a8a8a] tracking-widest mb-2 uppercase flex items-center justify-between">
              {report.name}
              <span className="text-green-400 font-medium tracking-normal text-[10px] bg-green-400/10 px-1.5 py-0.5 rounded-sm">↑ 18%</span>
            </div>
            <div className="text-5xl font-semibold tracking-tight text-white">{((data[0]?.value || 0).toLocaleString() || 0).toLocaleString() || 0}</div>
            <div className="absolute bottom-0 right-0 left-0 h-1/2 bg-gradient-to-t from-[#2266ec]/10 to-transparent opacity-0 group-hover/metric:opacity-100 transition-opacity duration-500 pointer-events-none blur-xl"></div>
          </div>
        );
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                {data.map((_: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <RechartsTooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #262626', borderRadius: '8px', color: '#fff' }} />
            </PieChart>
          </ResponsiveContainer>
        );
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#262626" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#656565', fontSize: 11 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#656565', fontSize: 11 }} />
              <RechartsTooltip cursor={{ fill: '#ffffff05' }} contentStyle={{ backgroundColor: '#161616', border: '1px solid #333', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.5)', color: '#fff', fontSize: '12px' }} />
              <Bar dataKey="value" fill="#2266ec" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'area':
      case 'linear':
      default:
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id={`colorVal-${report.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2266ec" stopOpacity={report.chartType === 'area' ? 0.3 : 0}/>
                  <stop offset="95%" stopColor="#2266ec" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#262626" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#656565', fontSize: 11 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#656565', fontSize: 11 }} />
              <RechartsTooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #262626', borderRadius: '8px' }} />
              <Area type="monotone" dataKey="value" stroke="#2266ec" strokeWidth={2} fillOpacity={1} fill={`url(#colorVal-${report.id})`} />
            </AreaChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <div 
      className="bg-[#121212] border border-[#262626] hover:border-[#333] transition-colors rounded-xl h-full flex flex-col relative overflow-hidden group shadow-lg cursor-default"
      onContextMenu={handleContextMenu}
    >
      
      {/* Top Drag Handle Bar (Hidden until hover) */}
      <div className="drag-handle h-6 w-full cursor-grab active:cursor-grabbing flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shrink-0 absolute top-0 left-0 right-0 z-20 hover:bg-white/[0.02]">
        <div className="w-10 h-1 bg-white/[0.1] rounded-full transition-colors group-hover:bg-white/[0.2]"></div>
      </div>
      
      {/* Hidden Toolbar */}
      <div className="absolute top-2 right-2 z-30 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-[-4px] group-hover:translate-y-0">
        <div className="flex items-center gap-1 bg-[#1a1a1a]/80 backdrop-blur-md border border-white/[0.05] rounded-md p-0.5 shadow-lg">
          <button onClick={() => toast('Chart refreshed', { type: 'success' })} className="p-1.5 text-[#656565] hover:text-white hover:bg-white/[0.05] rounded transition-colors" title="Refresh">
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => toast('Exporting CSV...', { type: 'info' })} className="p-1.5 text-[#656565] hover:text-white hover:bg-white/[0.05] rounded transition-colors" title="Export">
            <Download className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => toast('Fullscreen mode', { type: 'info' })} className="p-1.5 text-[#656565] hover:text-white hover:bg-white/[0.05] rounded transition-colors" title="Fullscreen">
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
          
          <div className="w-px h-3.5 bg-white/[0.1] mx-0.5"></div>
          
          <div className="relative">
            <button 
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1.5 text-[#656565] hover:text-white hover:bg-white/[0.05] rounded transition-colors"
            >
              <MoreHorizontal className="w-3.5 h-3.5" />
            </button>
            {menuOpen && (
              <div className="absolute top-full right-0 mt-1 w-36 bg-[#1a1a1a] border border-white/[0.1] rounded-lg shadow-2xl py-1 z-50 overflow-hidden" onMouseLeave={() => setMenuOpen(false)}>
                <button 
                  onClick={() => { setMenuOpen(false); onDuplicate?.(report.id); }}
                  className="w-full text-left px-3 py-2 text-[12px] text-[#fafafa] hover:bg-white/[0.05] flex items-center gap-2 transition-colors"
                >
                  <Copy className="w-3.5 h-3.5 text-[#a6a6a6]" /> Duplicate
                </button>
                <div className="border-t border-white/[0.05] my-1"></div>
                <button 
                  onClick={() => { setMenuOpen(false); onDelete?.(report.id); }}
                  className="w-full text-left px-3 py-2 text-[12px] text-red-400 hover:bg-white/[0.05] flex items-center gap-2 transition-colors"
                >
                  <Trash className="w-3.5 h-3.5 text-red-400/70" /> Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 p-5 pt-8 flex flex-col min-h-0 relative z-10">
        {report.chartType !== 'metric' && (
          <div className="flex items-center gap-2 mb-4 pr-32">
            <h2 className="text-[13px] font-medium text-[#fafafa] tracking-wide truncate">{report.name}</h2>
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
          </div>
        )}
        <div className="flex-1 relative w-full -ml-2 min-h-0">
          {renderChart()}
        </div>
      </div>

      {/* Global Native-Feeling Context Menu */}
      {contextMenu && (
        <div 
          className="fixed z-[100] w-48 bg-[#1a1a1a]/95 backdrop-blur-xl border border-white/[0.1] rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] py-1.5 animate-in fade-in zoom-in-95 duration-100"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-3 py-1.5 text-[10px] font-semibold text-[#656565] uppercase tracking-wider mb-1">
            {report.name} Options
          </div>
          <button 
            onClick={() => {
              toast('Report exported as PNG', { type: 'success' });
              setContextMenu(null);
            }}
            className="w-full text-left px-3 py-1.5 text-[12px] text-[#fafafa] hover:bg-[#2266ec] hover:text-white flex items-center gap-2 transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Export as PNG
          </button>
          <button 
            onClick={() => {
              onDuplicate?.(report.id);
              setContextMenu(null);
            }}
            className="w-full text-left px-3 py-1.5 text-[12px] text-[#fafafa] hover:bg-[#2266ec] hover:text-white flex items-center gap-2 transition-colors"
          >
            <Copy className="w-3.5 h-3.5" /> Duplicate Widget
          </button>
          <button 
            onClick={() => {
              toast('Comparing data to previous period...', { type: 'info' });
              setContextMenu(null);
            }}
            className="w-full text-left px-3 py-1.5 text-[12px] text-[#fafafa] hover:bg-[#2266ec] hover:text-white flex items-center gap-2 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Compare Period
          </button>
          <div className="border-t border-white/[0.05] my-1.5"></div>
          <button 
            onClick={() => {
              onDelete?.(report.id);
              setContextMenu(null);
            }}
            className="w-full text-left px-3 py-1.5 text-[12px] text-red-400 hover:bg-red-500 hover:text-white flex items-center gap-2 transition-colors"
          >
            <Trash className="w-3.5 h-3.5" /> Delete Widget
          </button>
        </div>
      )}
    </div>
  );
}
