"use client";

import React, { useState, useEffect } from 'react';
import { Loader2, Plus, Pencil, Trash2, X, Check, ChevronLeft, Search } from 'lucide-react';
import { AdminSection, ColumnDef, FieldDef, ProjectConfig } from './project-registry';
import { toast } from '@/components/ui/toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://litetrack-api-916484331446.us-central1.run.app';

function getToken() {
  return typeof window !== 'undefined' ? localStorage.getItem('litetrack_token') : null;
}

// ═══════════════════════════════════════════════════════════════
// REUSABLE: Badge Cell
// ═══════════════════════════════════════════════════════════════
function BadgeCell({ value, colors }: { value: string; colors?: Record<string, string> }) {
  const color = colors?.[value] || '#656565';
  return (
    <span 
      className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border"
      style={{ color, borderColor: `${color}40`, background: `${color}15` }}
    >
      {value || '—'}
    </span>
  );
}

// ═══════════════════════════════════════════════════════════════
// REUSABLE: Data Table
// ═══════════════════════════════════════════════════════════════
function AdminDataTable({
  rows,
  columns,
  onEdit,
  onDelete,
  loading,
}: {
  rows: any[];
  columns: ColumnDef[];
  onEdit: (row: any) => void;
  onDelete: (id: string) => void;
  loading: boolean;
}) {
  const [search, setSearch] = useState('');

  const filtered = rows.filter(row => {
    if (!search) return true;
    const q = search.toLowerCase();
    return columns.some(col => {
      const val = row[col.key];
      return val && String(val).toLowerCase().includes(q);
    });
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-[#2266ec]" />
        <span className="ml-3 text-sm text-[#a6a6a6]">Loading data...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-4 px-1">
        <Search className="w-4 h-4 text-[#656565]" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Filter records..."
          className="flex-1 bg-transparent border-b border-[#262626] focus:border-[#2266ec] text-sm text-white outline-none py-1 placeholder:text-[#656565]"
        />
        <span className="text-[10px] text-[#656565] font-mono">{filtered.length} records</span>
      </div>

      <div className="overflow-x-auto rounded-lg border border-[#262626]">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[#1a1a1a] border-b border-[#262626]">
              {columns.map(col => (
                <th key={col.key} className="px-4 py-3 text-[10px] font-bold text-[#656565] uppercase tracking-wider">{col.label}</th>
              ))}
              <th className="px-4 py-3 text-[10px] font-bold text-[#656565] uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#262626]">
            {filtered.length === 0 ? (
              <tr><td colSpan={columns.length + 1} className="text-center py-12 text-[#656565] text-sm">No records found</td></tr>
            ) : (
              filtered.map((row, i) => (
                <tr key={row.id || i} className="hover:bg-[#1a1a1a]/50 transition-colors">
                  {columns.map(col => (
                    <td key={col.key} className="px-4 py-3 text-[13px] text-[#e0e0e0]">
                      {col.type === 'badge' ? (
                        <BadgeCell value={String(row[col.key] ?? '')} colors={col.badgeColors} />
                      ) : col.type === 'boolean' ? (
                        row[col.key] ? <Check className="w-4 h-4 text-green-400" /> : <X className="w-4 h-4 text-red-400" />
                      ) : col.type === 'image' && row[col.key] ? (
                        <img src={row[col.key]} alt="" className="w-8 h-8 rounded object-cover" />
                      ) : col.type === 'list' && Array.isArray(row[col.key]) ? (
                        <span className="text-[#a6a6a6]">{row[col.key].length} items</span>
                      ) : (
                        <span className={col.truncate ? 'truncate block max-w-[200px]' : ''}>
                          {String(row[col.key] ?? '—')}
                        </span>
                      )}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => onEdit(row)} className="p-1.5 hover:bg-[#262626] rounded text-[#a6a6a6] hover:text-white transition-colors">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => onDelete(row.id)} className="p-1.5 hover:bg-red-500/10 rounded text-[#a6a6a6] hover:text-red-400 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// REUSABLE: Record Editor Modal
// ═══════════════════════════════════════════════════════════════
function RecordEditor({
  fields,
  record,
  onSave,
  onClose,
  isNew,
}: {
  fields: FieldDef[];
  record: any;
  onSave: (data: any) => Promise<void>;
  onClose: () => void;
  isNew: boolean;
}) {
  const [formData, setFormData] = useState<any>({ ...record });
  const [saving, setSaving] = useState(false);

  const handleChange = (key: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      await onSave(formData);
      toast(`Record ${isNew ? 'created' : 'updated'} successfully`, { type: 'success' });
      onClose();
    } catch (err: any) {
      toast(err.message || 'Failed to save', { type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-in fade-in duration-200">
      <div className="bg-[#121212] border border-[#333] rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl">
        <div className="px-6 py-4 border-b border-[#262626] flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">{isNew ? 'Create Record' : 'Edit Record'}</h3>
          <button onClick={onClose} className="text-[#a6a6a6] hover:text-white"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {fields.map(field => (
            <div key={field.key}>
              <label className="block text-[11px] text-[#a6a6a6] font-bold uppercase tracking-wider mb-1.5">
                {field.label} {field.required && <span className="text-red-400">*</span>}
              </label>

              {field.type === 'text' && (
                <input
                  value={formData[field.key] || ''}
                  onChange={e => handleChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full bg-[#1a1a1a] border border-[#262626] rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#2266ec] transition-colors"
                />
              )}

              {field.type === 'textarea' && (
                <textarea
                  value={formData[field.key] || ''}
                  onChange={e => handleChange(field.key, e.target.value)}
                  rows={3}
                  className="w-full bg-[#1a1a1a] border border-[#262626] rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#2266ec] resize-none transition-colors"
                />
              )}

              {field.type === 'number' && (
                <input
                  type="number"
                  value={formData[field.key] ?? ''}
                  onChange={e => handleChange(field.key, parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#1a1a1a] border border-[#262626] rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#2266ec] transition-colors"
                />
              )}

              {field.type === 'select' && (
                <select
                  value={formData[field.key] || ''}
                  onChange={e => handleChange(field.key, e.target.value)}
                  className="w-full bg-[#1a1a1a] border border-[#262626] rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#2266ec] transition-colors"
                >
                  <option value="">Select...</option>
                  {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              )}

              {field.type === 'boolean' && (
                <button
                  onClick={() => handleChange(field.key, !formData[field.key])}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    formData[field.key] ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-[#1a1a1a] text-[#a6a6a6] border border-[#262626]'
                  }`}
                >
                  {formData[field.key] ? 'Active ✓' : 'Inactive'}
                </button>
              )}

              {field.type === 'list' && (
                <div className="space-y-2">
                  {(formData[field.key] || []).map((item: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        value={item}
                        onChange={e => {
                          const arr = [...(formData[field.key] || [])];
                          arr[idx] = e.target.value;
                          handleChange(field.key, arr);
                        }}
                        className="flex-1 bg-[#1a1a1a] border border-[#262626] rounded-lg px-3 py-1.5 text-sm text-white outline-none focus:border-[#2266ec]"
                      />
                      <button
                        onClick={() => {
                          const arr = [...(formData[field.key] || [])];
                          arr.splice(idx, 1);
                          handleChange(field.key, arr);
                        }}
                        className="text-red-400 hover:text-red-300"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => handleChange(field.key, [...(formData[field.key] || []), ''])}
                    className="text-[11px] text-[#2266ec] hover:text-white transition-colors"
                  >
                    + Add Item
                  </button>
                </div>
              )}

              {field.type === 'json' && (
                <textarea
                  value={typeof formData[field.key] === 'string' ? formData[field.key] : JSON.stringify(formData[field.key] ?? {}, null, 2)}
                  onChange={e => {
                    try { handleChange(field.key, JSON.parse(e.target.value)); } 
                    catch { handleChange(field.key, e.target.value); }
                  }}
                  rows={8}
                  className="w-full bg-[#1a1a1a] border border-[#262626] rounded-lg px-3 py-2 text-xs text-white font-mono outline-none focus:border-[#2266ec] resize-none transition-colors"
                />
              )}
            </div>
          ))}
        </div>

        <div className="px-6 py-4 border-t border-[#262626] flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm text-[#a6a6a6] hover:text-white transition-colors">Cancel</button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="px-5 py-2 bg-[#2266ec] hover:bg-[#1d57cc] text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {isNew ? 'Create' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// REUSABLE: Section View (Collection Manager)
// ═══════════════════════════════════════════════════════════════
export function CollectionManager({
  project,
  section,
}: {
  project: ProjectConfig;
  section: AdminSection;
}) {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingRecord, setEditingRecord] = useState<any | null>(null);
  const [isNew, setIsNew] = useState(false);

  const dbParam = project.firebase.databaseId ? `?databaseId=${project.firebase.databaseId}` : '';

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = getToken();
      const res = await fetch(
        `${API_URL}/api/project-admin/${project.firebase.projectId}/${section.collection}${dbParam}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      setRows(data.data || []);
    } catch (err) {
      console.error(err);
      toast('Failed to load data', { type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [section.collection]);

  const handleSave = async (formData: any) => {
    const token = getToken();
    const isUpdate = !!formData.id && !isNew;
    
    const url = isUpdate
      ? `${API_URL}/api/project-admin/${project.firebase.projectId}/${section.collection}/${formData.id}${dbParam}`
      : `${API_URL}/api/project-admin/${project.firebase.projectId}/${section.collection}${dbParam}`;

    const res = await fetch(url, {
      method: isUpdate ? 'PUT' : 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    
    if (!res.ok) throw new Error('Save failed');
    await fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this record?')) return;
    try {
      const token = getToken();
      await fetch(
        `${API_URL}/api/project-admin/${project.firebase.projectId}/${section.collection}/${id}${dbParam}`,
        { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } }
      );
      toast('Record deleted', { type: 'success' });
      await fetchData();
    } catch {
      toast('Failed to delete', { type: 'error' });
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span>{section.icon}</span> {section.label}
          </h3>
          <p className="text-xs text-[#656565] mt-0.5 font-mono">/{section.collection} · {rows.length} records</p>
        </div>
        <button
          onClick={() => { setEditingRecord({}); setIsNew(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-[#2266ec] hover:bg-[#1d57cc] text-white text-xs font-bold rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" /> Add {section.label.replace(/s$/, '')}
        </button>
      </div>

      <AdminDataTable
        rows={rows}
        columns={section.columns}
        onEdit={(row) => { setEditingRecord(row); setIsNew(false); }}
        onDelete={handleDelete}
        loading={loading}
      />

      {editingRecord && (
        <RecordEditor
          fields={section.fields}
          record={editingRecord}
          onSave={handleSave}
          onClose={() => { setEditingRecord(null); setIsNew(false); }}
          isNew={isNew}
        />
      )}
    </div>
  );
}
