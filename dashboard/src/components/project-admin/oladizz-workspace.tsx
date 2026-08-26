"use client";

import React, { useState, useEffect } from 'react';
import { THEMES } from './theme-tokens';
import { Loader2, Plus, Trash2, Save, X, Folder, Layers, Briefcase, List, MessageSquare } from 'lucide-react';
import { toast } from '@/components/ui/toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://litetrack-api-916484331446.us-central1.run.app';

// ═══════════════════════════════════════════════════════════════
// Oladizz.xyz CMS Workspace
// ═══════════════════════════════════════════════════════════════
export function OladizzXyzWorkspace({ 
  sectionId 
}: { 
  sectionId: string 
}) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [commentCount, setCommentCount] = useState(0);
  const theme = THEMES.cyberpunk;

  useEffect(() => {
    fetchData();
    fetchCommentCount();
  }, []);

  const fetchCommentCount = async () => {
    try {
      const token = localStorage.getItem('litetrack_token');
      const res = await fetch(`${API_URL}/api/project-admin/my-portfolio-7cd72/projectComments`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await res.json();
      setCommentCount(json.data ? json.data.length : 0);
    } catch (err) {
      console.error('Failed to load comments count');
    }
  };

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('litetrack_token');
      const res = await fetch(`${API_URL}/api/project-admin/my-portfolio-7cd72/content/portfolio-data`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await res.json();
      setData(json.data);
    } catch (err) {
      toast('Failed to load Oladizz.xyz data', { type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (updatedSectionData: any) => {
    setSaving(true);
    try {
      const token = localStorage.getItem('litetrack_token');
      const fullUpdate = { ...data, [sectionId]: updatedSectionData };
      
      await fetch(`${API_URL}/api/project-admin/my-portfolio-7cd72/content/portfolio-data`, {
        method: 'PUT',
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(fullUpdate)
      });
      
      setData(fullUpdate);
      toast('Saved successfully', { type: 'success' });
    } catch (err) {
      toast('Failed to save', { type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-64 text-[#00B2FF]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  const sectionData = data[sectionId];

// ==========================================
  // OVERVIEW EDITOR (Matches OverviewTab.tsx)
  // ==========================================
  if (sectionId === 'overview') {
    const stats = [
      { name: 'Projects', value: data.projects?.length || 0, icon: Folder },
      { name: 'Skills', value: (data.skills || []).reduce((acc: number, cat: any) => acc + (cat.skills?.length || 0), 0), icon: Layers },
      { name: 'Experience', value: data.experience?.length || 0, icon: Briefcase },
      { name: 'Timeline Events', value: data.impactTimeline?.length || 0, icon: List },
      { name: 'Comments', value: commentCount, icon: MessageSquare },
    ];

    const updateHiddenSections = async (newHidden: string[]) => {
      handleSave(newHidden, 'hiddenSections');
    };

    const enableCompactMode = () => {
      updateHiddenSections(Array.from(new Set([...(data.hiddenSections || []), 'terminal', 'techDNA', 'impactTimeline'])));
    };

    const restoreFullMode = () => {
      updateHiddenSections((data.hiddenSections || []).filter((s: string) => !['terminal', 'techDNA', 'impactTimeline'].includes(s)));
    };

    return (
      <div className="animate-in fade-in duration-300 space-y-8 font-sans">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-white text-lg font-bold">CMS DASHBOARD</h3>
            <p className="text-gray-500 text-sm">Select a section from the sidebar to begin editing content.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={enableCompactMode} className="px-4 py-2 bg-gray-800 hover:bg-red-900/40 text-gray-300 hover:text-red-400 rounded text-xs font-bold tracking-widest uppercase transition-colors border border-gray-700 hover:border-red-500/50">
              Hide Decor Sections
            </button>
            <button onClick={restoreFullMode} className="px-4 py-2 bg-[#00B2FF]/10 hover:bg-[#00B2FF]/20 text-[#00B2FF] rounded text-xs font-bold tracking-widest uppercase transition-colors border border-[#00B2FF]/30 hover:border-[#00B2FF]/80">
              Show All Sections
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(stat => (
            <div key={stat.name} className="bg-gray-900/40 border border-gray-800 p-4 rounded flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">{stat.name}</p>
                <p className="text-3xl font-bold text-white">{stat.value}</p>
              </div>
              <stat.icon className="w-8 h-8 text-[#00B2FF]" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ==========================================
  // HERO EDITOR
  // ==========================================
  if (sectionId === 'hero') {
    return (
      <div className="animate-in fade-in duration-300 space-y-6">
        <h2 className={theme.title}>Hero Section</h2>
        <div className={theme.card + " p-6 space-y-4"}>
          <div>
            <label className={theme.label}>Name / Brand</label>
            <input 
              className={theme.input} 
              value={sectionData?.name || ''} 
              onChange={(e) => setData({...data, hero: {...data.hero, name: e.target.value}})} 
            />
          </div>
          <div>
            <label className={theme.label}>Main Title</label>
            <input 
              className={theme.input} 
              value={sectionData?.title || ''} 
              onChange={(e) => setData({...data, hero: {...data.hero, title: e.target.value}})} 
            />
          </div>
          <div>
            <label className={theme.label}>Tagline</label>
            <input 
              className={theme.input} 
              value={sectionData?.tagline || ''} 
              onChange={(e) => setData({...data, hero: {...data.hero, tagline: e.target.value}})} 
            />
          </div>
        </div>
        <button onClick={() => handleSave(data.hero)} className={theme.primaryButton + " flex items-center gap-2"}>
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} SAVE CHANGES
        </button>
      </div>
    );
  }

  // ==========================================
  // ABOUT EDITOR
  // ==========================================
  if (sectionId === 'about') {
    return (
      <div className="animate-in fade-in duration-300 space-y-6">
        <h2 className={theme.title}>About Section</h2>
        <div className={theme.card + " p-6 space-y-4"}>
          <div>
            <label className={theme.label}>Title</label>
            <input 
              className={theme.input} 
              value={sectionData?.title || ''} 
              onChange={(e) => setData({...data, about: {...data.about, title: e.target.value}})} 
            />
          </div>
          <div>
            <label className={theme.label}>Bio / Description</label>
            <textarea 
              className={theme.input} 
              rows={6}
              value={sectionData?.description || ''} 
              onChange={(e) => setData({...data, about: {...data.about, description: e.target.value}})} 
            />
          </div>
        </div>
        <button onClick={() => handleSave(data.about)} className={theme.primaryButton + " flex items-center gap-2"}>
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} SAVE CHANGES
        </button>
      </div>
    );
  }

  // ==========================================
  // PROJECTS ARRAY EDITOR
  // ==========================================
  if (sectionId === 'projects') {
    const projects = sectionData || [];
    return (
      <div className="animate-in fade-in duration-300 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className={theme.title}>Projects Portfolio</h2>
          <button 
            onClick={() => {
              const newProject = { id: Date.now(), title: 'New Project', description: '', category: 'WEB3', tech: [] };
              setData({...data, projects: [...projects, newProject]});
            }}
            className={theme.primaryButton + " flex items-center gap-2"}
          >
            <Plus className="w-4 h-4" /> ADD PROJECT
          </button>
        </div>
        
        <div className="space-y-4">
          {projects.map((proj: any, index: number) => (
            <div key={proj.id || index} className={theme.card + " p-6"}>
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-[#00B2FF] font-mono uppercase tracking-widest">{proj.title || 'Untitled'}</h3>
                <button 
                  onClick={() => {
                    const newArr = [...projects];
                    newArr.splice(index, 1);
                    setData({...data, projects: newArr});
                  }}
                  className="text-red-500 hover:text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className={theme.label}>Title</label>
                  <input 
                    className={theme.input} 
                    value={proj.title || ''} 
                    onChange={(e) => {
                      const newArr = [...projects];
                      newArr[index].title = e.target.value;
                      setData({...data, projects: newArr});
                    }} 
                  />
                </div>
                <div>
                  <label className={theme.label}>Category</label>
                  <input 
                    className={theme.input} 
                    value={proj.category || ''} 
                    onChange={(e) => {
                      const newArr = [...projects];
                      newArr[index].category = e.target.value;
                      setData({...data, projects: newArr});
                    }} 
                  />
                </div>
              </div>
              <div>
                <label className={theme.label}>Description</label>
                <textarea 
                  className={theme.input} 
                  rows={3}
                  value={proj.description || ''} 
                  onChange={(e) => {
                    const newArr = [...projects];
                    newArr[index].description = e.target.value;
                    setData({...data, projects: newArr});
                  }} 
                />
              </div>
            </div>
          ))}
        </div>
        
        <button onClick={() => handleSave(data.projects)} className={theme.primaryButton + " flex items-center gap-2"}>
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} SAVE PROJECTS
        </button>
      </div>
    );
  }

  // ==========================================
  // RAW JSON FALLBACK (For other sections)
  // ==========================================
  return (
    <div className="animate-in fade-in duration-300 space-y-6">
      <h2 className={theme.title}>{sectionId.toUpperCase()} EDITOR</h2>
      <p className="text-gray-400 text-sm">Advanced JSON editor for arrays and objects.</p>
      
      <textarea 
        className={theme.input + " font-mono text-xs leading-relaxed"} 
        rows={25}
        value={typeof sectionData === 'string' ? sectionData : JSON.stringify(sectionData, null, 2)}
        onChange={(e) => {
          try {
            setData({...data, [sectionId]: JSON.parse(e.target.value)});
          } catch {
            // Keep typing if invalid JSON
          }
        }}
      />
      
      <button onClick={() => handleSave(data[sectionId])} className={theme.primaryButton + " flex items-center gap-2"}>
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} SAVE RAW DATA
      </button>
    </div>
  );
}
