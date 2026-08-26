"use client";

import React, { useState, useEffect } from 'react';
import { THEMES } from './theme-tokens';
import { Loader2, Plus, Trash2, Save, X, Folder, Layers, Briefcase, List, MessageSquare, ArrowUp, ArrowDown, EyeOff, Eye } from 'lucide-react';
import { toast } from '@/components/ui/toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://litetrack-api-916484331446.us-central1.run.app';

// ==========================================
// ICON PICKER (Mimics IconPicker.tsx)
// ==========================================
function IconPicker({ value, onChange, theme }: { value: string, onChange: (v: string) => void, theme: any }) {
  return (
    <div className="relative">
       <label className={theme.label}>Icon / Image URL</label>
       <div className="flex gap-2">
          <div className="p-2 bg-gray-800 rounded border border-gray-700 flex items-center justify-center w-10 h-10 overflow-hidden shrink-0">
             {value && value.startsWith('http') ? (
               <img src={value} alt="icon" className="w-5 h-5 object-contain" />
             ) : (
               <div className="text-[#00B2FF] text-xs font-bold text-center leading-none">{value ? value.substring(0,2).toUpperCase() : '?'}</div>
             )}
          </div>
          <div className="flex-1">
             <input 
                type="text" 
                value={value || ''} 
                onChange={(e) => onChange(e.target.value)} 
                className={theme.input}
                placeholder="Icon name (e.g. Activity) or URL"
             />
          </div>
       </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Oladizz.xyz CMS Workspace
// ═══════════════════════════════════════════════════════════════
export function OladizzXyzWorkspace({ 
  sectionId 
}: { 
  sectionId: string 
}) {
// ... keep all the states ...
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

  const handleSaveMultiple = async (updates: Record<string, any>) => {
    setSaving(true);
    try {
      const token = localStorage.getItem('litetrack_token');
      const fullUpdate = { ...data, ...updates };
      
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

  const handleSave = async (updatedSectionData: any, customKey?: string) => {
    return handleSaveMultiple({ [customKey || sectionId]: updatedSectionData });
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
  // ARRANGE SECTIONS (OrderingEditor.tsx)
  // ==========================================
  if (sectionId === 'ordering') {
    const items = data.order || [];
    const hidden = data.hiddenSections || [];

    const move = (index: number, direction: number) => {
        if (index + direction < 0 || index + direction >= items.length) return;
        const newItems = [...items];
        const temp = newItems[index];
        newItems[index] = newItems[index + direction];
        newItems[index + direction] = temp;
        setData({ ...data, order: newItems });
    };

    const toggleHidden = (sectionName: string) => {
        const newHidden = hidden.includes(sectionName)
            ? hidden.filter((item: string) => item !== sectionName)
            : [...hidden, sectionName];
        setData({ ...data, hiddenSections: newHidden });
    };

    return (
      <div className="animate-in fade-in duration-300 space-y-6">
        <h2 className={theme.title}>Arrange Sections</h2>
        <p className="text-gray-500 mb-6">Rearrange the display order of sections and toggle visibility on the home page.</p>
        <div className="space-y-2 max-w-xl">
            {items.map((item: string, i: number) => {
                const isHidden = hidden.includes(item);
                return (
                    <div key={item} className={`flex items-center justify-between bg-gray-900 border p-3 rounded ${isHidden ? 'border-red-500/40' : 'border-gray-800'}`}>
                        <div>
                            <span className="font-mono text-sm text-white uppercase block">{item}</span>
                            {isHidden && <span className="text-[10px] uppercase tracking-[0.2em] text-red-400 mt-1 block">Hidden from homepage</span>}
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => toggleHidden(item)}
                                className={`p-2 rounded border transition-colors ${isHidden ? 'border-[#00B2FF]/50 text-[#00B2FF] hover:bg-[#00B2FF]/10' : 'border-gray-700 text-gray-300 hover:bg-white/5'}`}
                            >
                                {isHidden ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                            </button>
                            <button onClick={() => move(i, -1)} disabled={i === 0} className="p-1 hover:bg-white/10 rounded disabled:opacity-20"><ArrowUp className="w-4 h-4" /></button>
                            <button onClick={() => move(i, 1)} disabled={i === items.length - 1} className="p-1 hover:bg-white/10 rounded disabled:opacity-20"><ArrowDown className="w-4 h-4" /></button>
                        </div>
                    </div>
                );
            })}
        </div>
        <button onClick={() => handleSaveMultiple({ order: data.order, hiddenSections: data.hiddenSections })} className={theme.primaryButton + " flex items-center gap-2 mt-6"}>
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} SAVE ORDER
        </button>
      </div>
    );
  }

  // ==========================================
  // HERO EDITOR
  // ==========================================
  if (sectionId === 'hero') {
    const handleBadgeChange = (idx: number, field: string, val: string) => {
      const newBadges = [...(sectionData?.badges || [])];
      newBadges[idx] = { ...newBadges[idx], [field]: val };
      setData({...data, hero: {...data.hero, badges: newBadges}});
    };

    return (
      <div className="animate-in fade-in duration-300 space-y-6">
        <h2 className={theme.title}>Hero Section</h2>
        <div className={theme.card + " p-6 space-y-4"}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          </div>
          <div>
            <label className={theme.label}>Tagline</label>
            <input 
              className={theme.input} 
              value={sectionData?.tagline || ''} 
              onChange={(e) => setData({...data, hero: {...data.hero, tagline: e.target.value}})} 
            />
          </div>

          <div className="pt-4 border-t border-gray-800">
            <label className="text-xs text-[#00B2FF] uppercase tracking-widest mb-4 block font-mono">Hero Badges</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(sectionData?.badges || []).map((badge: any, i: number) => (
                <div key={i} className="bg-gray-900 p-4 rounded border border-gray-800">
                  <div className="mb-3">
                    <label className={theme.label}>Label</label>
                    <input 
                      className={theme.input} 
                      value={badge.label || ''} 
                      onChange={e => handleBadgeChange(i, 'label', e.target.value)} 
                    />
                  </div>
                  <IconPicker value={badge.icon || ''} onChange={v => handleBadgeChange(i, 'icon', v)} theme={theme} />
                </div>
              ))}
            </div>
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
    const handleStatChange = (idx: number, field: string, val: string) => {
      const newStats = [...(sectionData?.stats || [])];
      newStats[idx] = { ...newStats[idx], [field]: val };
      setData({...data, about: {...data.about, stats: newStats}});
    };

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
              className={theme.input + " h-48 resize-none"} 
              value={sectionData?.description || ''} 
              onChange={(e) => setData({...data, about: {...data.about, description: e.target.value}})} 
            />
          </div>

          <div className="pt-4 border-t border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <label className="text-xs text-[#00B2FF] uppercase tracking-widest block font-mono">Stats/Numbers</label>
              <button 
                onClick={() => {
                  const newStats = [...(sectionData?.stats || []), { label: 'New Stat', value: '100+', icon: 'Activity' }];
                  setData({...data, about: {...data.about, stats: newStats}});
                }}
                className="text-[#00B2FF] hover:text-white text-xs flex items-center gap-1 font-bold uppercase tracking-widest"
              >
                <Plus className="w-3 h-3" /> ADD STAT
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {(sectionData?.stats || []).map((stat: any, i: number) => (
                <div key={i} className="bg-gray-900 p-4 rounded border border-gray-800 relative group">
                  <button 
                    onClick={() => {
                      const newStats = [...sectionData.stats];
                      newStats.splice(i, 1);
                      setData({...data, about: {...data.about, stats: newStats}});
                    }}
                    className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="mb-3">
                    <label className={theme.label}>Label</label>
                    <input 
                      className={theme.input} 
                      value={stat.label || ''} 
                      onChange={e => handleStatChange(i, 'label', e.target.value)} 
                    />
                  </div>
                  <div className="mb-3">
                    <label className={theme.label}>Value (e.g. 100+)</label>
                    <input 
                      className={theme.input} 
                      value={stat.value || ''} 
                      onChange={e => handleStatChange(i, 'value', e.target.value)} 
                    />
                  </div>
                  <IconPicker value={stat.icon || ''} onChange={v => handleStatChange(i, 'icon', v)} theme={theme} />
                </div>
              ))}
            </div>
          </div>
        </div>
        <button onClick={() => handleSave(data.about)} className={theme.primaryButton + " flex items-center gap-2"}>
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} SAVE CHANGES
        </button>
      </div>
    );
  }

  // ==========================================
  // EXPERIENCE EDITOR
  // ==========================================
  if (sectionId === 'experience') {
    const experiences = sectionData || [];
    return (
      <div className="animate-in fade-in duration-300 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className={theme.title}>Experience</h2>
          <button 
            onClick={() => {
              const newItem = { id: Date.now(), period: '202X', role: 'Role', entity: 'Company', status: 'ACTIVE', description: '...', logs: [], icon: 'Briefcase', color: '#00B2FF' };
              setData({...data, experience: [...experiences, newItem]});
            }}
            className={theme.primaryButton + " flex items-center gap-2"}
          >
            <Plus className="w-4 h-4" /> ADD EXPERIENCE
          </button>
        </div>
        
        <div className="space-y-4">
          {experiences.map((exp: any, index: number) => (
            <div key={exp.id || index} className={theme.card + " p-6 relative group"}>
              <button 
                onClick={() => {
                  const newArr = [...experiences];
                  newArr.splice(index, 1);
                  setData({...data, experience: newArr});
                }}
                className="absolute top-4 right-4 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-400"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className={theme.label}>Role</label>
                  <input className={theme.input} value={exp.role || ''} onChange={e => { const arr=[...experiences]; arr[index].role=e.target.value; setData({...data, experience: arr}); }} />
                </div>
                <div>
                  <label className={theme.label}>Entity / Company</label>
                  <input className={theme.input} value={exp.entity || ''} onChange={e => { const arr=[...experiences]; arr[index].entity=e.target.value; setData({...data, experience: arr}); }} />
                </div>
                <div>
                  <label className={theme.label}>Period (e.g. 2021 - Present)</label>
                  <input className={theme.input} value={exp.period || ''} onChange={e => { const arr=[...experiences]; arr[index].period=e.target.value; setData({...data, experience: arr}); }} />
                </div>
                <div>
                  <label className={theme.label}>Status</label>
                  <input className={theme.input} value={exp.status || ''} onChange={e => { const arr=[...experiences]; arr[index].status=e.target.value; setData({...data, experience: arr}); }} />
                </div>
                <div>
                  <label className={theme.label}>Color Hex</label>
                  <input className={theme.input} value={exp.color || ''} onChange={e => { const arr=[...experiences]; arr[index].color=e.target.value; setData({...data, experience: arr}); }} />
                </div>
                <IconPicker value={exp.icon || ''} onChange={v => { const arr=[...experiences]; arr[index].icon=v; setData({...data, experience: arr}); }} theme={theme} />
              </div>
              <div>
                <label className={theme.label}>Description</label>
                <textarea className={theme.input} rows={3} value={exp.description || ''} onChange={e => { const arr=[...experiences]; arr[index].description=e.target.value; setData({...data, experience: arr}); }} />
              </div>
            </div>
          ))}
        </div>
        
        <button onClick={() => handleSave(data.experience)} className={theme.primaryButton + " flex items-center gap-2"}>
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} SAVE EXPERIENCE
        </button>
      </div>
    );
  }

  // ==========================================
  // SKILLS EDITOR
  // ==========================================
  if (sectionId === 'skills') {
    const categories = sectionData || [];

    const addCategory = () => {
      setData({...data, skills: [...categories, { category: 'New Category', skills: [] }]});
    };

    const addSkill = (catIdx: number) => {
      const newCats = [...categories];
      newCats[catIdx].skills.push({ name: 'New Skill', icon: 'Code', color: 'text-white' });
      setData({...data, skills: newCats});
    };

    return (
      <div className="animate-in fade-in duration-300 space-y-8">
        <div className="flex justify-between items-center">
          <h2 className={theme.title}>Skills</h2>
          <button onClick={addCategory} className={theme.primaryButton + " flex items-center gap-2"}>
            <Plus className="w-4 h-4" /> ADD CATEGORY
          </button>
        </div>

        {categories.map((cat: any, i: number) => (
          <div key={i} className="bg-gray-900/40 border border-gray-800 p-6 rounded-xl relative group">
            <button 
              onClick={() => { const newCats=[...categories]; newCats.splice(i,1); setData({...data, skills: newCats}); }}
              className="absolute top-4 right-4 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <div className="mb-6 max-w-sm">
              <label className={theme.label}>Category Name</label>
              <input className={theme.input} value={cat.category || ''} onChange={e => { const arr=[...categories]; arr[i].category=e.target.value; setData({...data, skills: arr}); }} />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                <label className="text-xs text-[#00B2FF] uppercase tracking-widest font-mono">Skills in Category</label>
                <button onClick={() => addSkill(i)} className="text-[#00B2FF] hover:text-white text-xs flex items-center gap-1 font-bold">
                  <Plus className="w-3 h-3" /> ADD SKILL
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(cat.skills || []).map((skill: any, j: number) => (
                  <div key={j} className="bg-gray-900 p-3 rounded border border-gray-800 relative group/skill">
                    <button 
                      onClick={() => { const arr=[...categories]; arr[i].skills.splice(j,1); setData({...data, skills: arr}); }}
                      className="absolute top-2 right-2 text-red-500 opacity-0 group-hover/skill:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="mb-2">
                      <label className="text-[10px] text-gray-500 uppercase tracking-widest block mb-1">Name</label>
                      <input className="w-full bg-black border border-gray-800 text-white text-sm p-2 rounded focus:border-[#00B2FF] outline-none" value={skill.name || ''} onChange={e => { const arr=[...categories]; arr[i].skills[j].name=e.target.value; setData({...data, skills: arr}); }} />
                    </div>
                    <div className="mb-2">
                      <label className="text-[10px] text-gray-500 uppercase tracking-widest block mb-1">Tailwind Color (e.g. text-blue-500)</label>
                      <input className="w-full bg-black border border-gray-800 text-white text-sm p-2 rounded focus:border-[#00B2FF] outline-none" value={skill.color || ''} onChange={e => { const arr=[...categories]; arr[i].skills[j].color=e.target.value; setData({...data, skills: arr}); }} />
                    </div>
                    <IconPicker value={skill.icon || ''} onChange={v => { const arr=[...categories]; arr[i].skills[j].icon=v; setData({...data, skills: arr}); }} theme={theme} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
        
        <button onClick={() => handleSave(data.skills)} className={theme.primaryButton + " flex items-center gap-2"}>
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} SAVE SKILLS
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
  // CONTACT EDITOR
  // ==========================================
  if (sectionId === 'contact') {
    const updateSocial = (idx: number, field: string, val: string) => {
        const newSocials = [...(sectionData?.socials || [])];
        newSocials[idx] = { ...newSocials[idx], [field]: val };
        setData({...data, contact: {...data.contact, socials: newSocials}});
    };

    return (
        <div className="animate-in fade-in duration-300 space-y-6">
            <h2 className={theme.title}>Contact Section</h2>
            <div className={theme.card + " p-6 space-y-4"}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className={theme.label}>Contact Email</label>
                        <input className={theme.input} value={sectionData?.email || ''} onChange={e => setData({...data, contact: {...data.contact, email: e.target.value}})} />
                    </div>
                    <div>
                        <label className={theme.label}>Location</label>
                        <input className={theme.input} value={sectionData?.location || ''} onChange={e => setData({...data, contact: {...data.contact, location: e.target.value}})} />
                    </div>
                </div>
                
                <div className="pt-4 border-t border-gray-800">
                    <div className="flex items-center justify-between mb-4">
                      <label className="text-xs text-[#00B2FF] uppercase tracking-widest block font-mono">Social Links</label>
                      <button 
                        onClick={() => {
                          const newSocials = [...(sectionData?.socials || []), { platform: 'New Platform', url: '#', icon: 'Link' }];
                          setData({...data, contact: {...data.contact, socials: newSocials}});
                        }}
                        className="text-[#00B2FF] hover:text-white text-xs flex items-center gap-1 font-bold uppercase tracking-widest"
                      >
                        <Plus className="w-3 h-3" /> ADD SOCIAL
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                        {(sectionData?.socials || []).map((s: any, i: number) => (
                            <div key={i} className="flex flex-col md:flex-row gap-4 bg-gray-900 p-3 rounded border border-gray-800 relative group">
                                <button 
                                  onClick={() => { const newArr=[...sectionData.socials]; newArr.splice(i,1); setData({...data, contact: {...data.contact, socials: newArr}}); }}
                                  className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity md:-right-8"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                                <div className="flex-1">
                                    <label className={theme.label}>Platform</label>
                                    <input className={theme.input} value={s.platform || ''} onChange={e => updateSocial(i, 'platform', e.target.value)} />
                                </div>
                                <div className="flex-[2]">
                                    <label className={theme.label}>URL</label>
                                    <input className={theme.input} value={s.url || ''} onChange={e => updateSocial(i, 'url', e.target.value)} />
                                </div>
                                <div className="w-full md:w-48">
                                    <IconPicker value={s.icon || ''} onChange={v => updateSocial(i, 'icon', v)} theme={theme} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <button onClick={() => handleSave(data.contact)} className={theme.primaryButton + " flex items-center gap-2"}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} SAVE CONTACT
            </button>
        </div>
    );
  }

  // ==========================================
  // TECH DNA EDITOR
  // ==========================================
  if (sectionId === 'techDNA') {
    const traits = sectionData || [];
    return (
      <div className="animate-in fade-in duration-300 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className={theme.title}>Tech DNA</h2>
          <button 
            onClick={() => {
              const newItem = { name: 'New Trait', value: 50, color: 'bg-[#00B2FF]' };
              setData({...data, techDNA: [...traits, newItem]});
            }}
            className={theme.primaryButton + " flex items-center gap-2"}
          >
            <Plus className="w-4 h-4" /> ADD TRAIT
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {traits.map((trait: any, i: number) => (
            <div key={i} className={theme.card + " p-4 relative group"}>
              <button 
                onClick={() => { const arr=[...traits]; arr.splice(i,1); setData({...data, techDNA: arr}); }}
                className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              
              <div className="space-y-3 mt-4">
                <div>
                  <label className={theme.label}>Name</label>
                  <input className={theme.input} value={trait.name || ''} onChange={e => { const arr=[...traits]; arr[i].name=e.target.value; setData({...data, techDNA: arr}); }} />
                </div>
                <div>
                  <label className={theme.label}>Value (0-100)</label>
                  <input type="number" className={theme.input} value={trait.value || 0} onChange={e => { const arr=[...traits]; arr[i].value=parseInt(e.target.value)||0; setData({...data, techDNA: arr}); }} />
                </div>
                <div>
                  <label className={theme.label}>Tailwind Color Class</label>
                  <input className={theme.input} value={trait.color || ''} onChange={e => { const arr=[...traits]; arr[i].color=e.target.value; setData({...data, techDNA: arr}); }} />
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <button onClick={() => handleSave(data.techDNA)} className={theme.primaryButton + " flex items-center gap-2"}>
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} SAVE TECH DNA
        </button>
      </div>
    );
  }

  // ==========================================
  // TIMELINE EDITOR
  // ==========================================
  if (sectionId === 'impactTimeline') {
    const events = sectionData || [];
    return (
      <div className="animate-in fade-in duration-300 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className={theme.title}>Timeline Events</h2>
          <button 
            onClick={() => {
              const newItem = { year: '2025', title: 'Event', desc: 'Description', icon: 'Code' };
              setData({...data, impactTimeline: [...events, newItem]});
            }}
            className={theme.primaryButton + " flex items-center gap-2"}
          >
            <Plus className="w-4 h-4" /> ADD EVENT
          </button>
        </div>
        
        <div className="space-y-4">
          {events.map((event: any, i: number) => (
            <div key={i} className={theme.card + " p-4 relative group"}>
              <button 
                onClick={() => { const arr=[...events]; arr.splice(i,1); setData({...data, impactTimeline: arr}); }}
                className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 mb-4">
                <div>
                  <label className={theme.label}>Year</label>
                  <input className={theme.input} value={event.year || ''} onChange={e => { const arr=[...events]; arr[i].year=e.target.value; setData({...data, impactTimeline: arr}); }} />
                </div>
                <div>
                  <label className={theme.label}>Title</label>
                  <input className={theme.input} value={event.title || ''} onChange={e => { const arr=[...events]; arr[i].title=e.target.value; setData({...data, impactTimeline: arr}); }} />
                </div>
              </div>
              <div className="mb-4">
                <label className={theme.label}>Description</label>
                <textarea className={theme.input} rows={2} value={event.desc || ''} onChange={e => { const arr=[...events]; arr[i].desc=e.target.value; setData({...data, impactTimeline: arr}); }} />
              </div>
              <div className="w-full md:w-64">
                <IconPicker value={event.icon || ''} onChange={v => { const arr=[...events]; arr[i].icon=v; setData({...data, impactTimeline: arr}); }} theme={theme} />
              </div>
            </div>
          ))}
        </div>
        
        <button onClick={() => handleSave(data.impactTimeline)} className={theme.primaryButton + " flex items-center gap-2"}>
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} SAVE TIMELINE
        </button>
      </div>
    );
  }

  // ==========================================
  // TERMINAL EDITOR
  // ==========================================
  if (sectionId === 'terminal') {
    const lines = sectionData || [];
    return (
      <div className="animate-in fade-in duration-300 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className={theme.title}>Terminal Lines</h2>
          <button 
            onClick={() => {
              setData({...data, terminal: [...lines, "New Line..."]});
            }}
            className={theme.primaryButton + " flex items-center gap-2"}
          >
            <Plus className="w-4 h-4" /> ADD LINE
          </button>
        </div>
        
        <div className="space-y-3">
          {lines.map((line: string, i: number) => (
            <div key={i} className="flex gap-2">
              <input 
                className="flex-1 bg-black border border-gray-800 p-3 rounded text-[#00B2FF] text-sm font-mono focus:border-[#00B2FF] outline-none"
                value={line || ''} 
                onChange={e => { const arr=[...lines]; arr[i]=e.target.value; setData({...data, terminal: arr}); }} 
              />
              <button onClick={() => { const arr=[...lines]; arr.splice(i,1); setData({...data, terminal: arr}); }} className="p-3 text-red-500 hover:bg-red-500/10 rounded">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        
        <button onClick={() => handleSave(data.terminal)} className={theme.primaryButton + " flex items-center gap-2"}>
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} SAVE TERMINAL
        </button>
      </div>
    );
  }

  // ==========================================
  // DASHBOARD EDITOR
  // ==========================================
  if (sectionId === 'liveDashboard') {
    const items = sectionData || [];
    return (
      <div className="animate-in fade-in duration-300 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className={theme.title}>Dashboard Items</h2>
          <button 
            onClick={() => {
              const newItem = { id: Date.now(), label: 'LABEL', value: 'Value', icon: 'Activity', color: 'text-white' };
              setData({...data, liveDashboard: [...items, newItem]});
            }}
            className={theme.primaryButton + " flex items-center gap-2"}
          >
            <Plus className="w-4 h-4" /> ADD ITEM
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item: any, i: number) => (
            <div key={i} className={theme.card + " p-4 relative group"}>
              <button 
                onClick={() => { const arr=[...items]; arr.splice(i,1); setData({...data, liveDashboard: arr}); }}
                className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              
              <div className="space-y-3 mt-4">
                <div>
                  <label className={theme.label}>Label</label>
                  <input className={theme.input} value={item.label || ''} onChange={e => { const arr=[...items]; arr[i].label=e.target.value; setData({...data, liveDashboard: arr}); }} />
                </div>
                <div>
                  <label className={theme.label}>Value</label>
                  <input className={theme.input} value={item.value || ''} onChange={e => { const arr=[...items]; arr[i].value=e.target.value; setData({...data, liveDashboard: arr}); }} />
                </div>
                <div>
                  <label className={theme.label}>Color Class</label>
                  <input className={theme.input} value={item.color || ''} onChange={e => { const arr=[...items]; arr[i].color=e.target.value; setData({...data, liveDashboard: arr}); }} />
                </div>
                <IconPicker value={item.icon || ''} onChange={v => { const arr=[...items]; arr[i].icon=v; setData({...data, liveDashboard: arr}); }} theme={theme} />
              </div>
            </div>
          ))}
        </div>
        
        <button onClick={() => handleSave(data.liveDashboard)} className={theme.primaryButton + " flex items-center gap-2"}>
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} SAVE DASHBOARD
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
