"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, Activity, Users, ShoppingCart, Zap, Shield, Settings, 
  ChevronDown, Search, Sparkles, Database, BarChart3, Terminal,
  KeyRound, Bot, Package, Eye, Wrench, Handshake, Crown, Layers
} from 'lucide-react';
import { useWorkspace } from '@/components/ui/workspace-context';

import { OperatingConsole } from '@/components/operating-console';

export function Sidebar() {
  const pathname = usePathname();
  const [projectMenuOpen, setProjectMenuOpen] = useState(false);
  const [sites, setSites] = useState<any[]>([]);
  const [activeModal, setActiveModal] = useState<'monitoring' | 'security' | 'profile' | null>(null);
  const [isCommandCenterOpen, setIsCommandCenterOpen] = useState(false);
  const { state, setProject } = useWorkspace();

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://litetrack-api-916484331446.us-central1.run.app';

  // Global Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'p' || e.key === '/' || e.key === 'f' || e.key === 'a')) {
        e.preventDefault();
        setIsCommandCenterOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('litetrack_token');
    if (token) {
      fetch(`${apiUrl}/api/sites`, { headers: { 'Authorization': `Bearer ${token}` } })
        .then(r => r.json())
        .then(data => {
          if (data?.sites) {
            setSites(data.sites);
            if (data.sites.length > 0 && state.project === 'Workspace Admin') {
              setProject(data.sites[0].site_id, data.sites[0].domain);
            }
          }
        })
        .catch(() => {});
    }
  }, [state.project, setProject, apiUrl]);

  const isActive = (path: string) => {
    if (path === '/' && pathname !== '/') return false;
    return pathname.startsWith(path);
  };

  return (
    <>
      <aside className="fixed top-0 left-0 z-40 flex h-screen w-64 flex-col border-r border-[#262626] bg-[#1a1a1a]">
        {/* GLOBAL ZONE */}
        <div className="p-3 border-b border-[#262626] space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#2266ec] rounded flex items-center justify-center shrink-0 shadow-lg">
              <span className="text-white font-bold text-sm">O!</span>
            </div>
            <span className="text-white font-bold tracking-wide">Admin OS</span>
          </div>
          
          {/* Global AI Command / Search trigger */}
          <button 
            onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}
            className="w-full flex items-center gap-2 bg-[#262626]/50 border border-[#262626] rounded-md px-2 py-1.5 hover:border-[#404040] transition-colors text-left"
          >
            <Search className="w-3.5 h-3.5 text-[#a6a6a6]" />
            <span className="text-[11px] text-[#a6a6a6] flex-1">Search anything...</span>
            <span className="text-[10px] text-[#656565] border border-[#262626] bg-[#1a1a1a] rounded px-1 tracking-widest">⌘K</span>
          </button>
        </div>

        <div className="flex-1 overflow-auto px-2 mt-2 space-y-0.5 hide-scrollbar">
          
          <div className="text-[10px] font-bold text-[#656565] mt-2 mb-2 px-2 uppercase tracking-widest">Global</div>
          
          <Link href="/" className={`w-full flex items-center gap-2 px-2 py-1.5 text-[13px] font-medium rounded transition-colors ${isActive('/') ? 'bg-[#262626] text-white' : 'text-[#a6a6a6] hover:text-white hover:bg-[#262626]/50'}`}>
            <Home className="w-4 h-4" /> System Overview
          </Link>
          <Link href="/command-center" className={`w-full flex items-center gap-2 px-2 py-1.5 text-[13px] font-medium rounded transition-colors ${isActive('/command-center') ? 'bg-[#262626] text-white' : 'text-[#a6a6a6] hover:text-white hover:bg-[#262626]/50'}`}>
            <Terminal className="w-4 h-4" /> Operating Console
          </Link>
          
          {/* APPLICATION SELECTOR */}
          <div className="mt-4 px-2">
            <div className="relative">
              <button 
                onClick={() => setProjectMenuOpen(!projectMenuOpen)} 
                className="w-full flex items-center justify-between text-[13px] font-semibold bg-[#2266ec]/10 border border-[#2266ec]/20 text-[#2266ec] px-2 py-1.5 rounded transition-colors"
              >
                <span className="truncate flex items-center gap-2"><Package className="w-4 h-4"/> {state.projectName || 'Select Application'}</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {projectMenuOpen && (
                <div className="absolute top-full mt-1 left-0 w-full bg-[#1a1a1a] border border-[#262626] rounded-md shadow-2xl p-1 z-50">
                  <div className="text-[10px] font-bold text-[#656565] uppercase px-2 py-1 tracking-wider">Your Applications</div>
                  {sites.map((s: any) => (
                    <button
                      key={s.site_id}
                      onClick={() => {
                        setProject(s.site_id, s.domain);
                        setProjectMenuOpen(false);
                      }}
                      className={`w-full text-left px-2 py-1.5 text-[12px] rounded transition-colors truncate block ${
                        state.project === s.site_id ? 'text-[#2266ec] bg-[#2266ec]/10 font-semibold' : 'text-white hover:bg-[#262626]'
                      }`}
                    >
                      {s.domain}
                    </button>
                  ))}
                  <div className="border-t border-[#262626] mt-1 pt-1">
                    <Link
                      href="/settings"
                      onClick={() => setProjectMenuOpen(false)}
                      className="w-full flex items-center gap-1.5 px-2 py-1.5 text-[12px] text-[#2266ec] hover:text-white hover:bg-[#262626] rounded transition-colors"
                    >
                      + Add Application
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* WORKSPACE ZONE (Contextual to selected app) */}
          {state.project && state.project !== 'Workspace Admin' ? (
            <>
              <div className="text-[10px] font-bold text-[#656565] mt-6 mb-2 px-2 uppercase tracking-widest truncate">Workspace: {state.projectName}</div>
              
              <Link href="/dashboards" className={`w-full flex items-center gap-2 px-2 py-1.5 text-[13px] font-medium rounded transition-colors ${isActive('/dashboards') ? 'bg-[#262626] text-white' : 'text-[#a6a6a6] hover:text-white hover:bg-[#262626]/50'}`}>
                <BarChart3 className="w-4 h-4" /> Analytics
              </Link>
              <Link href="/data-manager/users" className={`w-full flex items-center gap-2 px-2 py-1.5 text-[13px] font-medium rounded transition-colors ${isActive('/data-manager/users') ? 'bg-[#262626] text-white' : 'text-[#a6a6a6] hover:text-white hover:bg-[#262626]/50'}`}>
                <Users className="w-4 h-4" /> Users
              </Link>
              <Link href="/data-manager/products" className={`w-full flex items-center gap-2 px-2 py-1.5 text-[13px] font-medium rounded transition-colors ${isActive('/data-manager/products') ? 'bg-[#262626] text-white' : 'text-[#a6a6a6] hover:text-white hover:bg-[#262626]/50'}`}>
                <Database className="w-4 h-4" /> Data & Collections
              </Link>
              <Link href="/data-manager/orders" className={`w-full flex items-center gap-2 px-2 py-1.5 text-[13px] font-medium rounded transition-colors ${isActive('/data-manager/orders') ? 'bg-[#262626] text-white' : 'text-[#a6a6a6] hover:text-white hover:bg-[#262626]/50'}`}>
                <ShoppingCart className="w-4 h-4" /> Transactions
              </Link>
              <Link href="/observability" className={`w-full flex items-center gap-2 px-2 py-1.5 text-[13px] font-medium rounded transition-colors ${isActive('/observability') ? 'bg-[#262626] text-white' : 'text-[#a6a6a6] hover:text-white hover:bg-[#262626]/50'}`}>
                <Activity className="w-4 h-4" /> Events & Logs
              </Link>
              <Link href="/agent-studio" className={`w-full flex items-center gap-2 px-2 py-1.5 text-[13px] font-medium rounded transition-colors ${isActive('/agent-studio') ? 'bg-[#262626] text-white' : 'text-[#a6a6a6] hover:text-white hover:bg-[#262626]/50'}`}>
                <Bot className="w-4 h-4" /> AI Operations
              </Link>

              <Link href="/data-manager/audit" className={`w-full flex items-center gap-2 px-2 py-1.5 text-[13px] font-medium rounded transition-colors ${isActive('/data-manager/audit') ? 'bg-[#262626] text-white' : 'text-[#a6a6a6] hover:text-white hover:bg-[#262626]/50'}`}>
                <Terminal className="w-4 h-4" /> Operations (Logs)
              </Link>
            </>
          ) : (
            <div className="mt-6 px-4 text-center">
              <div className="text-[11px] text-[#656565] border border-[#262626] border-dashed rounded-lg p-4 bg-[#1a1a1a]/50">
                Select an application from the top dropdown to view its workspace.
              </div>
            </div>
          )}

          {/* ======================================= */}
          {/* 3. ADMIN CONTEXT */}
          {/* ======================================= */}
          <div className="text-[10px] font-bold text-[#656565] mt-6 mb-2 px-2 uppercase tracking-widest">Admin</div>

          <Link href="/settings" className={`w-full flex items-center gap-2 px-2 py-1.5 text-[13px] font-medium rounded transition-colors ${isActive('/settings') ? 'bg-[#262626] text-white' : 'text-[#a6a6a6] hover:text-white hover:bg-[#262626]/50'}`}>
            <Settings className="w-4 h-4" /> Settings
          </Link>
          
          <Link href="/ioac" className={`w-full flex items-center gap-2 px-2 py-1.5 text-[13px] font-medium rounded transition-colors ${isActive('/ioac') ? 'bg-[#262626] text-white' : 'text-[#a6a6a6] hover:text-white hover:bg-[#262626]/50'}`}>
            <KeyRound className="w-4 h-4" /> Permissions
          </Link>
          
          <Link href="/agent-studio" className={`w-full flex items-center gap-2 px-2 py-1.5 text-[13px] font-medium rounded transition-colors ${isActive('/agent-studio') ? 'bg-[#262626] text-white' : 'text-[#a6a6a6] hover:text-white hover:bg-[#262626]/50'}`}>
            <Bot className="w-4 h-4" /> AI Layer
          </Link>

        </div>
        
        <div className="p-3 border-t border-[#262626]">
          <div 
            onClick={() => setActiveModal('profile')}
            className="flex items-center gap-3 p-2 bg-[#262626]/30 rounded-lg border border-[#333]/50 hover:bg-[#262626] transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#2266ec] to-purple-500 flex items-center justify-center text-white text-xs font-bold shadow-lg">
              LT
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[12px] font-medium text-white truncate">LiteTrack Admin</div>
              <div className="text-[10px] text-[#8a8a8a] truncate">Administrator</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Modal: Monitoring */}
      {activeModal === 'monitoring' && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-[#1a1a1a] border border-[#333] rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#262626] pb-3">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" /> System Performance & Monitoring
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-[#a6a6a6] hover:text-white text-sm">✕</button>
            </div>
            <div className="text-xs text-[#a6a6a6] space-y-3 font-mono">
              <div className="flex justify-between bg-[#121212] p-2.5 rounded border border-[#262626]">
                <span>Cloud Run API Status:</span>
                <span className="text-green-400 font-bold">100% HEALTHY</span>
              </div>
              <div className="flex justify-between bg-[#121212] p-2.5 rounded border border-[#262626]">
                <span>BigQuery Response Latency:</span>
                <span className="text-white font-bold">42 ms</span>
              </div>
              <div className="flex justify-between bg-[#121212] p-2.5 rounded border border-[#262626]">
                <span>Uptime SLI:</span>
                <span className="text-white font-bold">99.99%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Security */}
      {activeModal === 'security' && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-[#1a1a1a] border border-[#333] rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#262626] pb-3">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" /> Security & Privacy Controls
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-[#a6a6a6] hover:text-white text-sm">✕</button>
            </div>
            <div className="text-xs text-[#a6a6a6] space-y-3 font-mono">
              <div className="flex justify-between bg-[#121212] p-2.5 rounded border border-[#262626]">
                <span>IP Hashing Method:</span>
                <span className="text-emerald-400 font-bold">SHA-256 Daily Salt</span>
              </div>
              <div className="flex justify-between bg-[#121212] p-2.5 rounded border border-[#262626]">
                <span>Cookies Usage:</span>
                <span className="text-white font-bold">NONE (Cookieless)</span>
              </div>
              <div className="flex justify-between bg-[#121212] p-2.5 rounded border border-[#262626]">
                <span>Do-Not-Track (DNT):</span>
                <span className="text-white font-bold">RESPECTED</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Profile */}
      {activeModal === 'profile' && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-[#1a1a1a] border border-[#333] rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#262626] pb-3">
              <h3 className="text-sm font-semibold text-white">Administrator Account</h3>
              <button onClick={() => setActiveModal(null)} className="text-[#a6a6a6] hover:text-white text-sm">✕</button>
            </div>
            <div className="text-xs text-[#a6a6a6] space-y-3">
              <p>Logged in as <strong>LiteTrack Admin</strong>.</p>
              <div className="flex gap-2">
                <Link 
                  href="/settings" 
                  onClick={() => setActiveModal(null)}
                  className="flex-1 text-center bg-[#2266ec] hover:bg-[#1d57cc] text-white py-2 rounded text-xs font-medium"
                >
                  Manage Projects
                </Link>
                <button 
                  onClick={() => {
                    localStorage.removeItem('litetrack_token');
                    window.location.href = '/login';
                  }}
                  className="flex-1 text-center bg-red-500/20 hover:bg-red-500/30 text-red-400 py-2 rounded text-xs font-medium border border-red-500/30"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Operating Console (Search | Copilot | Autopilot) */}
      <OperatingConsole
        isOpen={isCommandCenterOpen}
        onClose={() => setIsCommandCenterOpen(false)}
      />
    </>
  );
}
