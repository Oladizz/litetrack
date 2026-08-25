"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, Activity, Settings, Plus, Sparkles, ChevronDown, 
  DollarSign, TrendingUp, CreditCard, Users,  ArrowUpRight, ArrowDownRight, Wallet, Receipt
} from 'lucide-react';
import { AnimatedNumber } from '@/components/ui/animated-number';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, Bar } from 'recharts';
import { useWorkspace } from '@/components/ui/workspace-context';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://litetrack-api-916484331446.us-central1.run.app';



export default function FinancesPage() {
  const [projectMenuOpen, setProjectMenuOpen] = useState(false);
  const [aiQuery, setAiQuery] = useState('');
  
  const [financesData, setFinancesData] = useState<{ summary: any, chartData: any[], transactions: any[] }>({ summary: {}, chartData: [], transactions: [] });
  const [loading, setLoading] = useState(true);
  
  const { state, setDateRange } = useWorkspace();
  const currentSite = state.project;
  const period = state.dateRange === 'Last 7 days' ? '7d' : state.dateRange === 'Today' ? '1d' : '30d';
  const filters = state.filters;

  useEffect(() => {
    const fetchFinances = async () => {
      const token = localStorage.getItem('litetrack_token');
      if (!token || !currentSite || currentSite === 'Workspace Admin') {
        setLoading(false);
        return;
      }
      setLoading(true);
      const queryParams = new URLSearchParams({ period });
      Object.entries(filters).forEach(([k, v]) => { if (v) queryParams.append(k, v); });
      
      const data = await fetch(`${apiUrl}/api/finances/${currentSite}?${queryParams.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      }).then(r => r.json()).catch(() => ({ summary: {}, chartData: [], transactions: [] }));
      
      setFinancesData({
        summary: data?.summary || { totalRevenue: 0, transactions: 0, aov: 0 },
        chartData: Array.isArray(data?.chartData) ? data.chartData : [],
        transactions: Array.isArray(data?.transactions) ? data.transactions : []
      });
      setLoading(false);
    };
    fetchFinances();
  }, [currentSite, period, filters]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1a1a1a]/90 backdrop-blur-md border border-white/[0.05] p-3 rounded-lg shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
          <p className="text-[#a6a6a6] text-[11px] mb-2 font-medium tracking-wide">{label}</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]"></div>
            <p className="text-[#fafafa] text-[13px] font-semibold tabular-nums">
              ${payload[0].value} <span className="text-[#656565] font-normal ml-1">Revenue</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen font-sans flex text-[#fafafa] bg-[#0a0a0f]">
      {/* Main Content */}
      
        
        {/* Header */}
        <div className="sticky top-0 z-30 bg-[#0a0a0f]/90 backdrop-blur-md border-b border-white/[0.05] px-8 py-5 flex items-center justify-between">
          <h1 className="text-xl font-semibold tracking-tight text-white flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center border border-green-500/20">
              <DollarSign className="w-4 h-4 text-green-400" />
            </div>
            Financial Overview
          </h1>
          <div className="flex items-center gap-3">
          </div>
        </div>

        <div className="p-8 max-w-7xl mx-auto space-y-6">
          
          {/* Top KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-[#121212] border border-[#262626] rounded-xl p-5 hover:border-[#333] transition-colors relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-green-500/10 transition-all"></div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center border border-green-500/20">
                  <DollarSign className="w-4 h-4 text-green-400" />
                </div>
                <h3 className="text-[#a6a6a6] text-[13px] font-medium">Total Revenue (MRR)</h3>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-semibold text-white tabular-nums">$<AnimatedNumber value={financesData.summary?.totalRevenue || 0} /></span>
              </div>
            </div>

            <div className="bg-[#121212] border border-[#262626] rounded-xl p-5 hover:border-[#333] transition-colors relative overflow-hidden group">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-[#2266ec]/10 flex items-center justify-center border border-[#2266ec]/20">
                  <Wallet className="w-4 h-4 text-[#2266ec]" />
                </div>
                <h3 className="text-[#a6a6a6] text-[13px] font-medium">Net Income</h3>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-semibold text-white tabular-nums">$<AnimatedNumber value={financesData.summary?.aov || 0} /></span>
              </div>
            </div>

            <div className="bg-[#121212] border border-[#262626] rounded-xl p-5 hover:border-[#333] transition-colors relative overflow-hidden group">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                  <Users className="w-4 h-4 text-purple-400" />
                </div>
                <h3 className="text-[#a6a6a6] text-[13px] font-medium">Active Subscriptions</h3>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-semibold text-white tabular-nums"><AnimatedNumber value={financesData.summary?.transactions || 0} /></span>
              </div>
            </div>

            <div className="bg-[#121212] border border-[#262626] rounded-xl p-5 hover:border-[#333] transition-colors relative overflow-hidden group">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                  <TrendingUp className="w-4 h-4 text-orange-400" />
                </div>
                <h3 className="text-[#a6a6a6] text-[13px] font-medium">Churn Rate</h3>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-semibold text-white tabular-nums">0%</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Revenue Chart */}
            <div className="lg:col-span-2 bg-[#121212] border border-[#262626] rounded-xl p-6 relative">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-[14px] font-medium text-white mb-1">Revenue Trend</h2>
                  <p className="text-[12px] text-[#656565]">Last 7 days performance</p>
                </div>
                <div className="flex gap-2">
                  <div className="flex items-center gap-2 text-[11px] text-[#8a8a8a]">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div> Subscriptions
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-[#8a8a8a] ml-3">
                    <div className="w-2 h-2 rounded-full bg-green-500/30"></div> One-Time
                  </div>
                </div>
              </div>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={financesData.chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#262626" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#656565', fontSize: 11 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#656565', fontSize: 11 }} dx={-10} tickFormatter={(val) => `$${val}`} />
                    <RechartsTooltip content={<CustomTooltip />} cursor={{ stroke: '#333', strokeWidth: 1, strokeDasharray: '4 4' }} />
                    <Area type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" animationDuration={1000} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Transactions Table */}
            <div className="bg-[#121212] border border-[#262626] rounded-xl flex flex-col">
              <div className="p-5 border-b border-[#262626] flex items-center justify-between">
                <h2 className="text-[14px] font-medium text-white flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-[#a6a6a6]" />
                  Recent Transactions
                </h2>
                <button className="text-[11px] text-[#2266ec] hover:text-white transition-colors font-medium">View All</button>
              </div>
              <div className="flex-1 overflow-y-auto hide-scrollbar p-2">
                <div className="space-y-1">
                  {(financesData?.transactions || []).map((tx: any) => (
                    <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-[#1a1a1a] transition-colors cursor-pointer group">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${tx.status === 'completed' ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                          {tx.status === 'completed' ? <ArrowDownRight className="w-4 h-4 text-green-400" /> : <TrendingUp className="w-4 h-4 text-red-400" />}
                        </div>
                        <div>
                          <div className="text-[13px] font-medium text-white mb-0.5">{tx.user}</div>
                          <div className="text-[11px] text-[#656565]">{tx.plan} • {tx.date}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[14px] font-semibold text-white tabular-nums">${tx.amount}</div>
                        <div className={`text-[10px] font-medium uppercase tracking-wider ${tx.status === 'completed' ? 'text-green-400' : 'text-red-400'}`}>
                          {tx.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
        </div>
      
    </div>
  );
}
