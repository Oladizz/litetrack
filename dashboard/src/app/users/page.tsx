"use client";

import React, { useState, useEffect } from 'react';
import { 
  Users, UserPlus, Download, Search, Filter, 
  MoreHorizontal, Shield, Mail, Calendar, Activity, 
  ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { Sidebar } from '@/components/ui/sidebar';
import { SlidePanel } from '@/components/ui/slide-panel';
import { AnimatedNumber } from '@/components/ui/animated-number';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { useWorkspace } from '@/components/ui/workspace-context';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://litetrack-api-916484331446.us-central1.run.app';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1a1a1a]/90 backdrop-blur-md border border-white/[0.05] p-3 rounded-lg shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
        <p className="text-[#a6a6a6] text-[11px] mb-2 font-medium tracking-wide">{label}</p>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#2266ec]"></div>
            <p className="text-[#fafafa] text-[13px] font-semibold tabular-nums">
              {payload[0].value.toLocaleString()} <span className="text-[#656565] font-normal ml-1">Total</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#22c55e]"></div>
            <p className="text-[#fafafa] text-[13px] font-semibold tabular-nums">
              {payload[1].value.toLocaleString()} <span className="text-[#656565] font-normal ml-1">Active</span>
            </p>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default function UsersPage() {
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [usersData, setUsersData] = useState<{ users: any[], growthData: any[] }>({ users: [], growthData: [] });
  const [loading, setLoading] = useState(true);
  
  const { state, setDateRange } = useWorkspace();
  const currentSite = state.project;
  const period = state.dateRange === 'Last 7 days' ? '7d' : state.dateRange === 'Today' ? '1d' : '30d';
  const filters = state.filters;

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('litetrack_token');
      if (!token || !currentSite || currentSite === 'Workspace Admin') {
        setLoading(false);
        return;
      }
      setLoading(true);
      const queryParams = new URLSearchParams({ period });
      Object.entries(filters).forEach(([k, v]) => { if (v) queryParams.append(k, v); });
      
      const data = await fetch(`${apiUrl}/api/users/${currentSite}?${queryParams.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      }).then(r => r.json()).catch(() => ({ users: [], growthData: [] }));
      
      setUsersData({
        users: Array.isArray(data?.users) ? data.users : [],
        growthData: Array.isArray(data?.growthData) ? data.growthData : []
      });
      setLoading(false);
    };
    fetchUsers();
  }, [currentSite, period, filters]);

  const filteredUsers = (usersData.users || []).filter((u: any) => 
    (u.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
    (u.email || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen font-sans flex text-[#fafafa] bg-[#0a0a0f]">
      <Sidebar />

      <main className="w-full lg:pl-64 min-w-0 flex-1 h-screen overflow-y-auto">
        
        {/* Header */}
        <div className="sticky top-0 z-30 bg-[#0a0a0f]/90 backdrop-blur-md border-b border-white/[0.05] px-8 py-5 flex items-center justify-between">
          <h1 className="text-xl font-semibold tracking-tight text-white flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#2266ec]/10 flex items-center justify-center border border-[#2266ec]/20">
              <Users className="w-4 h-4 text-[#2266ec]" />
            </div>
            Users & Customers
          </h1>
          
          {/* Actions */}
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-3 py-1.5 bg-[#1a1a1a] border border-[#262626] rounded-md text-[13px] font-medium text-white hover:bg-[#262626] transition-colors">
              <Download className="w-3.5 h-3.5" /> Export
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-white text-black text-[13px] font-semibold rounded-md hover:bg-gray-200 transition-colors">
              <UserPlus className="w-3.5 h-3.5" /> Invite User
            </button>
          </div>
        </div>

        <div className="p-8 max-w-[1600px] mx-auto space-y-8">
          
          {/* Summary KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#121212] border border-[#262626] rounded-xl p-5 hover:border-[#333] transition-colors relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#2266ec]/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-[#2266ec]/10 transition-all"></div>
              <div className="text-[#a6a6a6] text-[13px] font-medium mb-2">Total Users</div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-semibold text-white tabular-nums"><AnimatedNumber value={usersData.users?.length || 0} /></span>
              </div>
            </div>

            <div className="bg-[#121212] border border-[#262626] rounded-xl p-5 hover:border-[#333] transition-colors relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#22c55e]/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-[#22c55e]/10 transition-all"></div>
              <div className="text-[#a6a6a6] text-[13px] font-medium mb-2">Active Users (7d)</div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-semibold text-white tabular-nums"><AnimatedNumber value={usersData.growthData?.[usersData.growthData.length - 1]?.active || 0} /></span>
              </div>
            </div>

            <div className="bg-[#121212] border border-[#262626] rounded-xl p-5 hover:border-[#333] transition-colors relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-orange-500/10 transition-all"></div>
              <div className="text-[#a6a6a6] text-[13px] font-medium mb-2">Suspended</div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-semibold text-white tabular-nums">0</span>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="bg-[#121212] border border-[#262626] rounded-xl p-6 relative">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-[14px] font-medium text-white mb-1">User Growth</h2>
                <p className="text-[12px] text-[#656565]">Total vs Active users over time</p>
              </div>
            </div>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={usersData.growthData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2266ec" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#2266ec" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#262626" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#656565', fontSize: 11 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#656565', fontSize: 11 }} dx={-10} tickFormatter={(val) => val >= 1000 ? (val/1000).toFixed(1)+'k' : val} />
                  <RechartsTooltip content={<CustomTooltip />} cursor={{ stroke: '#333', strokeWidth: 1, strokeDasharray: '4 4' }} />
                  <Area type="monotone" dataKey="users" stroke="#2266ec" strokeWidth={2} fillOpacity={1} fill="url(#colorTotal)" animationDuration={1000} />
                  <Area type="monotone" dataKey="active" stroke="#22c55e" strokeWidth={2} fillOpacity={1} fill="url(#colorActive)" animationDuration={1000} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Table Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 bg-[#121212] border border-[#262626] rounded-md px-3 py-2 w-80 focus-within:border-[#404040] transition-colors">
              <Search className="w-4 h-4 text-[#656565]" />
              <input 
                type="text" 
                placeholder="Search users..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="bg-transparent text-[13px] text-[#fafafa] flex-1 outline-none placeholder:text-[#656565]" 
              />
            </div>
            
            <button className="flex items-center gap-2 px-3 py-2 bg-[#121212] border border-[#262626] rounded-md text-[13px] font-medium text-white hover:bg-[#1a1a1a] transition-colors">
              <Filter className="w-3.5 h-3.5" /> Filters
            </button>
          </div>

          {/* Table */}
          <div className="bg-[#121212] border border-[#262626] rounded-xl overflow-hidden">
            <div className="grid grid-cols-6 gap-4 p-4 border-b border-[#262626] bg-[#1a1a1a]/50 text-[12px] font-semibold text-[#656565] uppercase tracking-wider">
              <div className="col-span-2">User</div>
              <div>Status</div>
              <div>Role</div>
              <div>Last Active</div>
              <div className="text-right">Actions</div>
            </div>
            
            <div className="divide-y divide-[#262626]">
              {filteredUsers.map((user: any) => (
                <div 
                  key={user.id} 
                  onClick={() => setSelectedUser(user)}
                  className="grid grid-cols-6 gap-4 p-4 items-center hover:bg-[#1a1a1a] transition-colors cursor-pointer group"
                >
                  <div className="col-span-2 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#2266ec] to-purple-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {user.name.split(' ').map((n: string) => n[0]).join('')}
                    </div>
                    <div>
                      <div className="text-[13px] font-medium text-white mb-0.5">{user.name}</div>
                      <div className="text-[12px] text-[#656565]">{user.email}</div>
                    </div>
                  </div>
                  
                  <div>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${
                      user.status === 'Active' ? 'bg-green-500/10 text-green-400' :
                      user.status === 'Inactive' ? 'bg-[#333] text-[#a6a6a6]' :
                      'bg-red-500/10 text-red-400'
                    }`}>
                      {user.status}
                    </span>
                  </div>
                  
                  <div className="text-[13px] text-[#a6a6a6]">{user.role}</div>
                  <div className="text-[13px] text-[#a6a6a6]">{user.lastActive}</div>
                  
                  <div className="text-right">
                    <button className="p-1.5 text-[#656565] hover:text-white rounded-md opacity-0 group-hover:opacity-100 transition-all">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </main>

      {/* Details Panel */}
      <SlidePanel 
        isOpen={!!selectedUser} 
        onClose={() => setSelectedUser(null)}
        title={selectedUser?.name || ''}
        subtitle={selectedUser?.email || ''}
        actions={
          <button className="text-[12px] font-medium text-[#2266ec] hover:text-white transition-colors">
            Edit User
          </button>
        }
      >
        {selectedUser && (
          <div className="space-y-8">
            {/* Contextual Stats inside panel */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#1a1a1a] p-4 rounded-xl border border-[#262626]">
                <div className="text-[12px] text-[#656565] font-medium mb-1">Lifetime Revenue</div>
                <div className="text-xl font-semibold text-white">${selectedUser.revenue.toLocaleString()}</div>
              </div>
              <div className="bg-[#1a1a1a] p-4 rounded-xl border border-[#262626]">
                <div className="text-[12px] text-[#656565] font-medium mb-1">Total Sessions</div>
                <div className="text-xl font-semibold text-white">{selectedUser.sessions}</div>
              </div>
            </div>

            {/* General Info */}
            <div>
              <h3 className="text-[11px] font-bold text-[#656565] uppercase tracking-wider mb-4">Information</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-[#262626] flex items-center justify-center">
                    <Shield className="w-4 h-4 text-[#a6a6a6]" />
                  </div>
                  <div>
                    <div className="text-[13px] font-medium text-white">Role</div>
                    <div className="text-[12px] text-[#8a8a8a]">{selectedUser.role}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-[#262626] flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-[#a6a6a6]" />
                  </div>
                  <div>
                    <div className="text-[13px] font-medium text-white">Joined</div>
                    <div className="text-[12px] text-[#8a8a8a]">{selectedUser.joined}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div>
              <h3 className="text-[11px] font-bold text-[#656565] uppercase tracking-wider mb-4">Activity Timeline</h3>
              <div className="relative pl-4 space-y-6 before:absolute before:inset-y-0 before:left-[7px] before:w-px before:bg-[#262626]">
                <div className="relative">
                  <div className="absolute -left-4 w-2 h-2 rounded-full bg-[#2266ec] ring-4 ring-[#121212]"></div>
                  <div className="text-[12px] text-[#656565] mb-1">{selectedUser.lastActive}</div>
                  <div className="text-[13px] font-medium text-white">Logged In</div>
                </div>
                <div className="relative">
                  <div className="absolute -left-4 w-2 h-2 rounded-full bg-[#262626] ring-4 ring-[#121212]"></div>
                  <div className="text-[12px] text-[#656565] mb-1">Yesterday</div>
                  <div className="text-[13px] font-medium text-white">Viewed Dashboard "Q3 Revenue"</div>
                </div>
                <div className="relative">
                  <div className="absolute -left-4 w-2 h-2 rounded-full bg-[#262626] ring-4 ring-[#121212]"></div>
                  <div className="text-[12px] text-[#656565] mb-1">Last Week</div>
                  <div className="text-[13px] font-medium text-white">Exported 3 Reports</div>
                </div>
              </div>
            </div>

          </div>
        )}
      </SlidePanel>
    </div>
  );
}
