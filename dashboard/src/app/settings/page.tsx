'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Settings, Plus, Trash2, ArrowLeft, ChevronDown, Sparkles, LayoutDashboard, Activity, DollarSign 
} from 'lucide-react';
import { Sidebar } from '@/components/ui/sidebar';
import Link from 'next/link';

import { useWorkspace } from '@/components/ui/workspace-context';

const AVAILABLE_FEATURES = [
  { id: 'pageviews', label: '📊 Pageviews & Traffic', desc: 'Core pageview, visitor & path stats' },
  { id: 'events', label: '⚡ Custom Events & Link Out', desc: 'Outbound links & custom CTA clicks' },
  { id: 'ecommerce', label: '🛒 E-Commerce & Revenue', desc: 'Conversions, cart additions & revenue' },
  { id: 'user_journey', label: '👥 User Journey & Funnels', desc: 'Sequential path tracking & exit flows' },
  { id: 'tech_specs', label: '💻 Tech, OS & Devices', desc: 'Browser versions, OS & device brands' },
  { id: 'performance', label: '⏱️ Core Web Vitals & Speed', desc: 'Load latency, TTFB, LCP & CLS performance' },
  { id: 'privacy', label: '🔒 Strict Cookieless Anonymity', desc: 'Zero cookie persistence & DNT mode' },
];

export default function SettingsPage() {
  const router = useRouter();
  const [sites, setSites] = useState<any[]>([]);
  const [newDomain, setNewDomain] = useState('');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
    'pageviews', 'events', 'ecommerce', 'user_journey', 'tech_specs', 'performance', 'privacy'
  ]);
  const [token, setToken] = useState<string | null>(null);
  const { state, setProject } = useWorkspace();

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://litetrack-api-916484331446.us-central1.run.app';

  const fetchSites = async (t: string) => {
    const res = await fetch(`${apiUrl}/api/sites`, { headers: { Authorization: `Bearer ${t}` } });
    if (res.status === 401) {
      localStorage.removeItem('litetrack_token');
      router.push('/login');
      return;
    }
    if (res.ok) {
      const data = await res.json();
      const updatedSites = data.sites || [];
      setSites(updatedSites);

      // If current site was deleted, auto-switch to first remaining site
      if (updatedSites.length > 0 && !updatedSites.some((s: any) => s.site_id === state.project)) {
        setProject(updatedSites[0].site_id, updatedSites[0].domain);
      }
    }
  };

  useEffect(() => {
    const t = localStorage.getItem('litetrack_token');
    if (!t) router.push('/login');
    else {
      setToken(t);
      fetchSites(t);
    }
  }, [router]);

  const toggleFeatureSelect = (id: string) => {
    setSelectedFeatures(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const handleAddSite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDomain) return;
    
    const res = await fetch(`${apiUrl}/api/sites`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newDomain, domain: newDomain, features: selectedFeatures })
    });
    if (res.ok) {
      const data = await res.json();
      setNewDomain('');
      fetchSites(token!);
      if (data.site_id) {
        setProject(data.site_id, newDomain);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    await fetch(`${apiUrl}/api/sites/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchSites(token!);
  };

  const updateTemplate = async (id: string, template: string) => {
    await fetch(`${apiUrl}/api/sites/${id}/template`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ template })
    });
    fetchSites(token!);
  };

  const toggleSiteFeature = async (siteId: string, currentFeatures: string[], featureId: string) => {
    const updated = currentFeatures.includes(featureId)
      ? currentFeatures.filter(f => f !== featureId)
      : [...currentFeatures, featureId];

    await fetch(`${apiUrl}/api/sites/${siteId}/features`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ features: updated })
    });
    fetchSites(token!);
  };

  return (
    <div className="min-h-screen font-sans flex text-[#fafafa] bg-[#121212]">
      
      <Sidebar />

      {/* Main Content Area */}
      <main className="w-full lg:pl-64 min-w-0 flex-1 h-screen overflow-y-auto bg-[#121212]">
        
        {/* STICKY HEADER */}
        <div className="sticky top-0 z-30 bg-[#121212]/90 backdrop-blur border-b border-[#262626] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-[#a6a6a6] hover:text-[#fafafa] flex items-center gap-2 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </Link>
          </div>
        </div>

        <div className="p-6 max-w-[1000px] mx-auto space-y-6 mt-4 pb-20">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Settings className="w-6 h-6 text-[#2266ec]" /> Site Settings & Module Features
          </h2>

          <div className="space-y-6">
            
            {/* Add New Site */}
            <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-6 space-y-4 shadow-xl">
              <h3 className="font-semibold text-[15px] text-white">Add New Project</h3>
              <form onSubmit={handleAddSite} className="space-y-4">
                <div className="flex gap-4">
                  <input 
                    type="text" 
                    value={newDomain}
                    onChange={e => setNewDomain(e.target.value)}
                    placeholder="e.g. my-app.com"
                    className="flex-1 bg-[#121212] border border-[#333] text-white rounded-md px-4 py-2 focus:border-[#2266ec] focus:ring-1 focus:ring-[#2266ec] outline-none text-[13px] placeholder:text-[#656565]"
                  />
                  <button type="submit" className="bg-[#2266ec] hover:bg-[#1d57cc] text-white px-6 py-2 rounded-md text-[13px] font-medium flex items-center gap-2 transition-colors">
                    <Plus className="w-4 h-4" /> Add Project
                  </button>
                </div>

                <div className="border-t border-[#262626] pt-3">
                  <div className="text-[12px] font-semibold text-[#fafafa] mb-2">Configure Enabled Analytics Modules ("I need this / I don't need this"):</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {AVAILABLE_FEATURES.map(f => {
                      const isChecked = selectedFeatures.includes(f.id);
                      return (
                        <label key={f.id} className={`flex items-start gap-2.5 p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                          isChecked ? 'bg-[#2266ec]/10 border-[#2266ec]/50 text-white' : 'bg-[#121212] border-[#262626] text-[#656565]'
                        }`}>
                          <input 
                            type="checkbox" 
                            checked={isChecked}
                            onChange={() => toggleFeatureSelect(f.id)}
                            className="mt-0.5 rounded border-[#404040] bg-[#121212] text-[#2266ec] focus:ring-0"
                          />
                          <div>
                            <div className="font-semibold text-white">{f.label}</div>
                            <div className="text-[10px] text-[#a6a6a6]">{f.desc}</div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </form>
            </div>

            {/* Tracked Sites List */}
            <div>
              <h3 className="font-semibold text-[15px] text-white mb-4">Your Tracked Projects</h3>
              {sites.length === 0 ? (
                <div className="text-[#656565] text-[13px] bg-[#1a1a1a] border border-[#262626] rounded-xl p-6 text-center">
                  No projects added yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {sites.map((site: any) => {
                    const activeFeatures = site.features || ['pageviews', 'events', 'ecommerce', 'user_journey', 'tech_specs', 'performance', 'privacy'];
                    return (
                      <div key={site.site_id} className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-5 shadow-xl space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-white text-[15px] flex items-center gap-2">
                              {site.domain}
                              <span className="text-[10px] bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full font-normal">Active</span>
                            </h4>
                            <span className="text-[11px] text-[#656565] font-mono mt-1 block">Project ID: {site.site_id}</span>
                          </div>
                          <button onClick={() => handleDelete(site.site_id)} className="text-red-500/70 hover:text-red-500 p-2 transition-colors" title="Delete Project">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="relative group">
                          <div className="text-[11px] text-[#a6a6a6] mb-1 font-medium">Tracking Snippet</div>
                          <div className="bg-[#121212] border border-[#333] rounded-md p-3 text-[12px] text-green-400 font-mono overflow-x-auto pr-12">
                            {`<script defer data-domain="${site.site_id}" src="${apiUrl}/tracker.js"></script>`}
                          </div>
                          <button 
                            onClick={() => {
                              navigator.clipboard.writeText(`<script defer data-domain="${site.site_id}" src="${apiUrl}/tracker.js"></script>`);
                              alert('Copied tracking snippet to clipboard!');
                            }}
                            className="absolute right-2 top-7 bg-[#262626] hover:bg-[#333] text-[#a6a6a6] hover:text-white p-1.5 rounded transition-colors"
                            title="Copy snippet"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                          </button>
                        </div>

                        {/* Feature Toggles for this project */}
                        <div className="border-t border-[#262626] pt-3">
                          <div className="text-[12px] font-semibold text-white mb-2">Module Features for {site.domain}:</div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {AVAILABLE_FEATURES.map(f => {
                              const isEnabled = activeFeatures.includes(f.id);
                              return (
                                <button
                                  key={f.id}
                                  type="button"
                                  onClick={() => toggleSiteFeature(site.site_id, activeFeatures, f.id)}
                                  className={`flex items-center justify-between p-2 rounded border text-xs text-left transition-all ${
                                    isEnabled ? 'bg-[#2266ec]/10 border-[#2266ec]/40 text-white' : 'bg-[#121212] border-[#262626] text-[#656565]'
                                  }`}
                                >
                                  <div>
                                    <div className="font-semibold">{f.label}</div>
                                  </div>
                                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                    isEnabled ? 'bg-green-500/20 text-green-400' : 'bg-[#262626] text-[#656565]'
                                  }`}>
                                    {isEnabled ? 'ENABLED' : 'DISABLED'}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                        
                        <div className="border-t border-[#333] pt-4 flex items-center justify-between">
                          <div className="text-[12px] text-[#a6a6a6] font-medium">Dashboard Template</div>
                          <select 
                            value={site.template || 'saas'}
                            onChange={(e) => updateTemplate(site.site_id, e.target.value)}
                            className="bg-[#121212] border border-[#333] text-white rounded px-2 py-1.5 text-[12px] outline-none focus:border-[#2266ec] transition-colors"
                          >
                            <option value="saas">SaaS / Web App</option>
                            <option value="ecommerce">E-Commerce</option>
                            <option value="blog">Content / Blog</option>
                            <option value="minimal">Minimalist</option>
                          </select>
                        </div>

                        {/* Firebase Admin SDK Config */}
                        <div className="border-t border-[#333] pt-4 flex flex-col space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="text-[12px] text-white font-semibold flex items-center gap-2">
                              🔥 Firebase Admin Integration
                              {site.firebase_config ? (
                                <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full font-normal">Connected</span>
                              ) : (
                                <span className="text-[10px] bg-[#262626] text-[#656565] px-2 py-0.5 rounded-full font-normal">Not Configured</span>
                              )}
                            </div>
                          </div>
                          <p className="text-[11px] text-[#a6a6a6]">
                            Add your Firebase Admin Service Account JSON key or Project config to use LiteTrack as your main admin control panel for {site.domain}.
                          </p>
                          <textarea
                            defaultValue={site.firebase_config ? JSON.stringify(site.firebase_config, null, 2) : ''}
                            placeholder={`{\n  "projectId": "${site.domain.replace(/\./g, '-')}",\n  "clientEmail": "firebase-adminsdk@...",\n  "privateKey": "-----BEGIN PRIVATE KEY-----\\n..."\n}`}
                            id={`fb_config_${site.site_id}`}
                            rows={4}
                            className="w-full bg-[#121212] border border-[#333] rounded-md p-3 text-[11px] font-mono text-amber-400 outline-none focus:border-[#2266ec]"
                          />
                          <div className="flex justify-end">
                            <button
                              type="button"
                              onClick={async () => {
                                const val = (document.getElementById(`fb_config_${site.site_id}`) as HTMLTextAreaElement)?.value;
                                if (!val) return;
                                try {
                                  const parsed = JSON.parse(val);
                                  await fetch(`${apiUrl}/api/sites/${site.site_id}/firebase`, {
                                    method: 'PUT',
                                    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ firebase_config: parsed })
                                  });
                                  fetchSites(token!);
                                  alert('Firebase Admin Key saved successfully!');
                                } catch(e) {
                                  alert('Please enter valid JSON for your Firebase config / service account key');
                                }
                              }}
                              className="bg-[#2266ec] hover:bg-[#1d57cc] text-white px-4 py-1.5 rounded text-xs font-medium transition-colors"
                            >
                              Save Firebase Admin Config
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
