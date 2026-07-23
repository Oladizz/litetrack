"use client";

import React, { useState, useRef } from 'react';
import { 
  ArrowUpDown, ArrowUp, ArrowDown, Pin, EyeOff, MoreHorizontal, Check, Star, ExternalLink, FileText, Code2, Eye, Edit2, Sparkles 
} from 'lucide-react';
import { ColumnDef, CellType } from './types';

interface DataGridProps {
  columns: ColumnDef[];
  rows: Record<string, any>[];
  selectedRowIds: string[];
  onRowSelectChange: (selectedIds: string[]) => void;
  onRowClick: (row: Record<string, any>) => void;
  onCellEdit: (rowId: string, columnId: string, newValue: any) => void;
  onContextMenu: (e: React.MouseEvent, row: Record<string, any>) => void;
}

export function UniversalDataGrid({
  columns,
  rows,
  selectedRowIds,
  onRowSelectChange,
  onRowClick,
  onCellEdit,
  onContextMenu,
}: DataGridProps) {
  const [sortState, setSortState] = useState<{ columnId: string; direction: 'asc' | 'desc' }[]>([]);
  const [editingCell, setEditingCell] = useState<{ rowId: string; columnId: string } | null>(null);
  const [editValue, setEditValue] = useState<any>('');
  const lastSelectedIdxRef = useRef<number | null>(null);

  // Toggle single row selection (with Shift-Click range selection)
  const handleRowCheck = (idx: number, rowId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    let newSelected: string[] = [];

    if (e.shiftKey && lastSelectedIdxRef.current !== null) {
      const start = Math.min(lastSelectedIdxRef.current, idx);
      const end = Math.max(lastSelectedIdxRef.current, idx);
      const rangeIds = rows.slice(start, end + 1).map(r => r.id);
      newSelected = Array.from(new Set([...selectedRowIds, ...rangeIds]));
    } else {
      newSelected = selectedRowIds.includes(rowId)
        ? selectedRowIds.filter(id => id !== rowId)
        : [...selectedRowIds, rowId];
    }

    lastSelectedIdxRef.current = idx;
    onRowSelectChange(newSelected);
  };

  // Select all / Invert selection
  const handleSelectAllToggle = () => {
    if (selectedRowIds.length === rows.length) {
      onRowSelectChange([]);
    } else {
      onRowSelectChange(rows.map(r => r.id));
    }
  };

  // Sort handler
  const handleHeaderSort = (colId: string) => {
    const existing = sortState.find(s => s.columnId === colId);
    if (!existing) {
      setSortState([{ columnId: colId, direction: 'asc' }]);
    } else if (existing.direction === 'asc') {
      setSortState([{ columnId: colId, direction: 'desc' }]);
    } else {
      setSortState([]);
    }
  };

  // Start inline editing
  const handleCellDoubleClick = (e: React.MouseEvent, rowId: string, colId: string, val: any) => {
    e.stopPropagation();
    setEditingCell({ rowId, columnId: colId });
    setEditValue(val);
  };

  // Save inline editing
  const handleCellEditSave = () => {
    if (editingCell) {
      onCellEdit(editingCell.rowId, editingCell.columnId, editValue);
      setEditingCell(null);
    }
  };

  // 18+ RICH CELL RENDERERS
  const renderCellContent = (col: ColumnDef, val: any, row: Record<string, any>) => {
    if (val === undefined || val === null) return <span className="text-[#656565] italic">empty</span>;

    switch (col.type) {
      case 'text':
        return <span className="text-white truncate font-medium">{String(val)}</span>;
      
      case 'number':
        return <span className="font-mono text-[#fafafa]">{Number(val).toLocaleString()}</span>;

      case 'currency':
        return <span className="font-mono text-green-400 font-semibold">{col.formatOptions?.currencySymbol || '$'}{Number(val).toLocaleString()}</span>;

      case 'percentage':
        return <span className="font-mono text-amber-400 font-semibold">{val}%</span>;

      case 'progress': {
        const num = Math.min(100, Math.max(0, Number(val)));
        return (
          <div className="w-full flex items-center gap-2">
            <div className="flex-1 bg-[#262626] rounded-full h-1.5 overflow-hidden">
              <div className="bg-[#2266ec] h-full rounded-full" style={{ width: `${num}%` }}></div>
            </div>
            <span className="font-mono text-[10px] text-[#a6a6a6]">{num}%</span>
          </div>
        );
      }

      case 'status': {
        const status = String(val).toLowerCase();
        let badgeStyle = 'bg-gray-500/10 text-gray-400 border-gray-500/20';
        let dotStyle = 'bg-gray-400';

        if (status === 'active' || status === 'completed' || status === 'verified') {
          badgeStyle = 'bg-green-500/10 text-green-400 border-green-500/20';
          dotStyle = 'bg-green-400';
        } else if (status === 'disabled' || status === 'failed') {
          badgeStyle = 'bg-red-500/10 text-red-400 border-red-500/20';
          dotStyle = 'bg-red-400';
        } else if (status === 'pending' || status === 'suspended') {
          badgeStyle = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
          dotStyle = 'bg-amber-400';
        }

        return (
          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium border ${badgeStyle}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${dotStyle}`}></span>
            <span className="capitalize">{status}</span>
          </span>
        );
      }

      case 'badge':
        return (
          <span className="bg-[#2266ec]/10 border border-[#2266ec]/30 text-[#2266ec] font-semibold text-[11px] px-2 py-0.5 rounded-md uppercase tracking-wide">
            {String(val)}
          </span>
        );

      case 'avatar':
        return (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#2266ec] to-purple-500 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
              {String(val).substring(0, 2).toUpperCase()}
            </div>
            <span className="text-white text-xs font-medium truncate">{String(val)}</span>
          </div>
        );

      case 'tags': {
        const tagArr = Array.isArray(val) ? val : String(val).split(',');
        return (
          <div className="flex flex-wrap gap-1">
            {tagArr.map((t: string, i: number) => (
              <span key={i} className="bg-[#262626] text-[#a6a6a6] text-[10px] px-1.5 py-0.5 rounded border border-[#333]">
                {t.trim()}
              </span>
            ))}
          </div>
        );
      }

      case 'rating': {
        const rating = Math.min(5, Math.max(0, Number(val)));
        return (
          <div className="flex items-center gap-0.5 text-amber-400">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className={`w-3.5 h-3.5 ${i < rating ? 'fill-amber-400 text-amber-400' : 'text-[#404040]'}`} />
            ))}
          </div>
        );
      }

      case 'date':
        return <span className="font-mono text-[#a6a6a6] text-xs">{String(val)}</span>;

      case 'toggle':
        return (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onCellEdit(row.id, col.id, !val);
            }}
            className={`w-8 h-4 flex items-center rounded-full p-0.5 transition-colors ${val ? 'bg-[#2266ec]' : 'bg-[#333]'}`}
          >
            <div className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform ${val ? 'translate-x-4' : 'translate-x-0'}`}></div>
          </button>
        );

      case 'image':
        return (
          <div className="w-7 h-7 rounded border border-[#333] overflow-hidden bg-[#121212] flex items-center justify-center">
            <img src={val} alt="preview" className="w-full h-full object-cover" />
          </div>
        );

      case 'file':
        return (
          <span className="bg-[#121212] border border-[#333] text-[#a6a6a6] text-[11px] px-2 py-0.5 rounded flex items-center gap-1 font-mono">
            <FileText className="w-3 h-3 text-[#2266ec]" /> {String(val)}
          </span>
        );

      case 'json':
        return (
          <span className="bg-[#121212] text-green-400 text-[10px] font-mono px-2 py-0.5 rounded border border-[#333] truncate block max-w-[150px]">
            {JSON.stringify(val)}
          </span>
        );

      case 'code':
        return (
          <span className="bg-[#121212] text-amber-400 text-[10px] font-mono px-2 py-0.5 rounded border border-[#333] flex items-center gap-1">
            <Code2 className="w-3 h-3 text-[#656565]" /> {String(val)}
          </span>
        );

      case 'link':
        return (
          <a
            href={val}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-[#2266ec] hover:underline flex items-center gap-1 text-xs truncate"
          >
            {String(val)} <ExternalLink className="w-3 h-3" />
          </a>
        );

      case 'action_button':
        return (
          <div className="flex items-center gap-1">
            <button 
              onClick={(e) => { e.stopPropagation(); onRowClick(row); }}
              className="px-2 py-0.5 bg-[#2266ec] hover:bg-[#1d57cc] text-white text-[11px] font-medium rounded transition-colors"
            >
              View
            </button>
          </div>
        );

      default:
        return <span className="text-white">{String(val)}</span>;
    }
  };

  return (
    <div className="w-full relative">
      {/* Table Container - Borderless, Industrial */}
      <div className="w-full overflow-x-auto bg-transparent pb-24">
        <table className="w-full text-left border-collapse">
          {/* Table Header */}
          <thead>
            <tr className="border-b border-[#262626] bg-[#121212] text-[10px] font-bold text-[#656565] uppercase tracking-wider select-none sticky top-0 z-20 backdrop-blur-md bg-opacity-90">
              <th className="p-3 w-10 text-center">
                {/* Header Checkbox (Invisible until hovered or selected) */}
                <input
                  type="checkbox"
                  checked={rows.length > 0 && selectedRowIds.length === rows.length}
                  onChange={handleSelectAllToggle}
                  className={`rounded border-[#404040] bg-transparent text-[#2266ec] focus:ring-0 cursor-pointer transition-opacity duration-100 ${
                    selectedRowIds.length > 0 ? 'opacity-100' : 'opacity-0 hover:opacity-100'
                  }`}
                />
              </th>

              {columns.map((col) => {
                const sortObj = sortState.find(s => s.columnId === col.id);
                return (
                  <th
                    key={col.id}
                    className="py-3 px-2 font-semibold group relative hover:text-white transition-colors duration-100 ease-out"
                    style={{ minWidth: col.width || 140 }}
                  >
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => handleHeaderSort(col.id)}
                        className="flex items-center gap-1.5 outline-none"
                      >
                        <span>{col.label}</span>
                        {sortObj ? (
                          sortObj.direction === 'asc' ? <ArrowUp className="w-3 h-3 text-[#fafafa]" /> : <ArrowDown className="w-3 h-3 text-[#fafafa]" />
                        ) : (
                          <ArrowUpDown className="w-3 h-3 opacity-0 group-hover:opacity-40 transition-opacity duration-100" />
                        )}
                      </button>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-[#1a1a1a] text-[13px]">
            {rows.map((row, idx) => {
              const isSelected = selectedRowIds.includes(row.id);
              
              return (
                <tr
                  key={row.id || idx}
                  onClick={() => onRowClick(row)}
                  onContextMenu={(e) => onContextMenu(e, row)}
                  className={`group relative transition-all duration-100 ease-out cursor-pointer ${
                    isSelected ? 'bg-[#2266ec]/5' : 'hover:bg-[#1a1a1a]'
                  }`}
                >
                  {/* Subtle left accent on hover/select */}
                  <div className={`absolute left-0 top-0 bottom-0 w-[2px] transition-colors duration-100 ${
                    isSelected ? 'bg-[#2266ec]' : 'bg-transparent group-hover:bg-[#333]'
                  }`} />

                  {/* Row Checkbox */}
                  <td 
                    className="p-3 text-center z-10"
                    onClick={(e) => handleRowCheck(idx, row.id, e)}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}}
                      className={`rounded border-[#404040] bg-transparent text-[#2266ec] focus:ring-0 cursor-pointer transition-opacity duration-100 ${
                        isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                      }`}
                    />
                  </td>

                  {/* Render Column Cells */}
                  {columns.map((col) => {
                    const val = row[col.id];
                    const isEditing = editingCell?.rowId === row.id && editingCell?.columnId === col.id;

                    return (
                      <td
                        key={col.id}
                        onDoubleClick={(e) => handleCellDoubleClick(e, row.id, col.id, val)}
                        className="py-3 px-2 whitespace-nowrap"
                      >
                        {isEditing ? (
                          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="text"
                              autoFocus
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleCellEditSave();
                                if (e.key === 'Escape') setEditingCell(null);
                              }}
                              className="bg-[#121212] border border-[#2266ec] text-white px-2 py-1 rounded text-xs outline-none w-full font-mono"
                            />
                            <button onClick={handleCellEditSave} className="p-1 bg-[#2266ec] text-white rounded">
                              <Check className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          renderCellContent(col, val, row)
                        )}
                      </td>
                    );
                  })}
                  
                  {/* Subtle actions that fade in on hover on the far right edge */}
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-100 flex items-center gap-1 bg-gradient-to-l from-[#1a1a1a] via-[#1a1a1a] pl-6 pr-2 py-1">
                     <button className="text-[#a6a6a6] hover:text-white p-1 rounded transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                     <button className="text-[#a6a6a6] hover:text-white p-1 rounded transition-colors"><MoreHorizontal className="w-3.5 h-3.5" /></button>
                  </div>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Floating Bottom Action Bar (Multi-Select iOS Style) */}
      <div 
        className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 bg-[#1a1a1a]/90 backdrop-blur-xl border border-[#262626] shadow-2xl px-6 py-3 rounded-full transition-all duration-300 ease-out ${
          selectedRowIds.length > 0 
            ? 'opacity-100 translate-y-0 scale-100' 
            : 'opacity-0 translate-y-8 scale-95 pointer-events-none'
        }`}
      >
        <div className="flex items-center gap-2 border-r border-[#333] pr-4">
          <span className="flex items-center justify-center bg-[#2266ec] text-white text-[11px] font-bold h-5 min-w-[20px] px-1.5 rounded-full">
            {selectedRowIds.length}
          </span>
          <span className="text-[#a6a6a6] text-[13px] font-medium">Selected</span>
        </div>
        
        <div className="flex items-center gap-1">
          <button className="text-[13px] text-white hover:bg-[#333] px-3 py-1.5 rounded-full transition-colors font-medium">Merge</button>
          <button className="text-[13px] text-white hover:bg-[#333] px-3 py-1.5 rounded-full transition-colors font-medium">Compare</button>
          <button className="text-[13px] text-white hover:bg-[#333] px-3 py-1.5 rounded-full transition-colors font-medium">Export</button>
          <button className="text-[13px] text-amber-400 hover:bg-[#333] px-3 py-1.5 rounded-full transition-colors font-medium flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> AI Analyze
          </button>
        </div>
        
        <div className="border-l border-[#333] pl-2">
           <button className="text-[13px] text-red-400 hover:bg-red-500/10 hover:text-red-300 px-3 py-1.5 rounded-full transition-colors font-medium">Delete</button>
        </div>
      </div>
    </div>
  );
}
