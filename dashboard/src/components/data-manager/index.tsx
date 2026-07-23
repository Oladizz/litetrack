"use client";

import React, { useState } from 'react';
import { UniversalEntity, ColumnDef, SavedView, FilterRule, SearchOperator } from './types';
import { DataManagerHeader } from './header';
import { DataManagerSearchBar } from './search-bar';
import { DataManagerSavedViews } from './saved-views';
import { DataManagerFilterBuilder } from './filter-builder';
import { UniversalDataGrid } from './datagrid';
import { DataManagerRowDrawer } from './row-drawer';
import { DataManagerBulkActions } from './bulk-actions';
import { DataManagerContextMenu } from './context-menu';
import { DataManagerImportModal } from './import-modal';
import { DataManagerExportModal } from './export-modal';
import { DataManagerEmptyState } from './empty-state';
import { SlidersHorizontal } from 'lucide-react';
import { toast } from '@/components/ui/toast';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

interface UniversalDataManagerProps {
  initialEntity: UniversalEntity;
}

export function UniversalDataManager({ initialEntity }: UniversalDataManagerProps) {
  const [entity, setEntity] = useState<UniversalEntity>(initialEntity);
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
  const [activeViewId, setActiveViewId] = useState<string>(initialEntity.savedViews?.[0]?.id || 'all');
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [parsedOperators, setParsedOperators] = useState<SearchOperator[]>([]);
  const [filterRules, setFilterRules] = useState<FilterRule[]>([]);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Modals & Drawers state
  const [activeRow, setActiveRow] = useState<Record<string, any> | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Context Menu state
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; row: Record<string, any> } | null>(null);

  // Filter rows based on search query, operators, and rules
  const filteredRows = entity.rows.filter(row => {
    // 1. Text search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchText = Object.values(row).some(v => String(v).toLowerCase().includes(q));
      if (!matchText) return false;
    }

    // 2. Parsed operator chips (e.g. status:active, country:nigeria)
    for (const op of parsedOperators) {
      const rowVal = String(row[op.key] || '').toLowerCase();
      if (!rowVal.includes(op.value.toLowerCase())) return false;
    }

    // 3. Advanced filter rules
    for (const rule of filterRules) {
      const val = row[rule.field];
      if (rule.operator === '=') { if (String(val) !== String(rule.value)) return false; }
      if (rule.operator === '!=') { if (String(val) === String(rule.value)) return false; }
      if (rule.operator === '>') { if (Number(val) <= Number(rule.value)) return false; }
      if (rule.operator === '<') { if (Number(val) >= Number(rule.value)) return false; }
      if (rule.operator === 'contains') { if (!String(val).toLowerCase().includes(String(rule.value).toLowerCase())) return false; }
      if (rule.operator === 'is_empty') { if (val !== undefined && val !== null && val !== '') return false; }
      if (rule.operator === 'is_not_empty') { if (val === undefined || val === null || val === '') return false; }
    }

    return true;
  });

  // Handlers
  const handleCellEdit = (rowId: string, columnId: string, newValue: any) => {
    setEntity(prev => ({
      ...prev,
      rows: prev.rows.map(r => r.id === rowId ? { ...r, [columnId]: newValue } : r)
    }));
  };

  const [confirmDialog, setConfirmDialog] = useState<{ isOpen: boolean; title: string; description: string; onConfirm: () => void } | null>(null);

  const handleRowClick = (row: Record<string, any>) => {
    setActiveRow(row);
    setIsDrawerOpen(true);
  };

  const handleContextMenu = (e: React.MouseEvent, row: Record<string, any>) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, row });
  };

  const handleSaveNewView = (name: string) => {
    const newView: SavedView = {
      id: crypto.randomUUID(),
      name,
      query: searchQuery,
      filters: filterRules,
    };
    setEntity(prev => ({
      ...prev,
      savedViews: [...(prev.savedViews || []), newView]
    }));
    setActiveViewId(newView.id);
    toast('Custom View Saved', { type: 'success' });
  };

  const handleDeleteSelected = () => {
    setConfirmDialog({
      isOpen: true,
      title: `Delete ${selectedRowIds.length} Selected Records?`,
      description: 'This operation is permanent. Are you sure you want to remove these items from your dataset?',
      onConfirm: () => {
        setEntity(prev => ({
          ...prev,
          rows: prev.rows.filter(r => !selectedRowIds.includes(r.id)),
          totalCount: prev.totalCount - selectedRowIds.length
        }));
        setSelectedRowIds([]);
        setConfirmDialog(null);
        toast(`${selectedRowIds.length} records deleted`, { type: 'info' });
      }
    });
  };

  const handleCreateRow = () => {
    const newId = `rec_${Math.floor(Math.random() * 90000) + 10000}`;
    const newRow: Record<string, any> = { id: newId, name: 'New Record', status: 'active', revenue: 0 };
    setEntity(prev => ({
      ...prev,
      rows: [newRow, ...prev.rows],
      totalCount: prev.totalCount + 1
    }));
    setActiveRow(newRow);
    setIsDrawerOpen(true);
    toast('New record created', { type: 'success' });
  };

  return (
    <div className="flex flex-col w-full h-[calc(100vh-64px)] font-sans animate-in fade-in duration-700 fill-mode-both ease-out">
      
      {/* 1. Quiet Stats Row (No Hero, No Header) */}
      <div className="flex items-center justify-between px-2 mb-6">
        <h1 className="text-[15px] font-bold text-[#fafafa] flex items-center gap-2">
          {entity.title}
        </h1>
        <div className="flex items-center gap-4 text-[13px] text-[#656565] font-medium tracking-wide">
          <span>{entity.totalCount.toLocaleString()} Records</span>
          <span>•</span>
          <span>142 Views</span>
          <span>•</span>
          <span className="flex items-center gap-1.5 text-indigo-400">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-indigo-500"></span>
            </span>
            Live
          </span>
        </div>
      </div>

      {/* 2. Command Bar & Canvas Layout */}
      <div className="flex flex-1 gap-6 overflow-hidden">
        
        {/* Left Column: Views & Collections (Hidden for now to focus on Canvas, could expand later) */}
        <div className="w-48 hidden lg:flex flex-col gap-6 shrink-0 border-r border-[#262626] pr-4">
          <div>
            <div className="text-[11px] font-bold text-[#656565] uppercase tracking-wider mb-2">Views</div>
            <div className="space-y-0.5">
              <button className="w-full text-left px-2 py-1.5 rounded text-[13px] font-medium bg-[#2266ec]/10 text-[#2266ec]">All Records</button>
              <button className="w-full text-left px-2 py-1.5 rounded text-[13px] font-medium text-[#a6a6a6] hover:text-[#fafafa]">Active Only</button>
              <button className="w-full text-left px-2 py-1.5 rounded text-[13px] font-medium text-[#a6a6a6] hover:text-[#fafafa]">Archived</button>
            </div>
          </div>
        </div>

        {/* Center: Main Canvas */}
        <div className="flex-1 flex flex-col min-w-0">
          
          {/* Unified Search Command Bar */}
          <div className="mb-6">
            <DataManagerSearchBar
              value={searchQuery}
              onChange={(q, ops) => { setSearchQuery(q); setParsedOperators(ops); }}
              placeholder="Search anything... (records, views, commands, AI)"
            />
          </div>

          {/* 4. Data Canvas (Grid or Empty State) */}
          <div className="flex-1 overflow-auto rounded-lg">
      {filteredRows.length === 0 ? (
        <DataManagerEmptyState 
          entityTitle={entity.title} 
          onCreateClick={handleCreateRow}
          onClearFilters={() => {
            setSearchQuery('');
            setParsedOperators([]);
            setFilterRules([]);
          }}
        />
      ) : (
        <UniversalDataGrid
          columns={entity.columns}
          rows={filteredRows}
          selectedRowIds={selectedRowIds}
          onRowSelectChange={setSelectedRowIds}
          onRowClick={handleRowClick}
          onCellEdit={handleCellEdit}
          onContextMenu={handleContextMenu}
        />
      )}

      {/* 5. Slide-over Right Preview Drawer */}
      <DataManagerRowDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        row={activeRow}
        columns={entity.columns}
      />

      {/* 6. Contextual Floating Bulk Action Bar */}
      <DataManagerBulkActions
        selectedCount={selectedRowIds.length}
        onClearSelection={() => setSelectedRowIds([])}
        onDeleteSelected={handleDeleteSelected}
        onArchiveSelected={() => alert(`Archived ${selectedRowIds.length} records!`)}
        onExportSelected={() => setIsExportOpen(true)}
        onAssignSelected={() => alert(`Assigned ${selectedRowIds.length} records!`)}
        onTagSelected={() => alert(`Tagged ${selectedRowIds.length} records!`)}
        onDuplicateSelected={() => alert(`Duplicated ${selectedRowIds.length} records!`)}
        onApproveSelected={() => alert(`Approved ${selectedRowIds.length} records!`)}
      />

      {/* 7. Right-Click Context Menu */}
      {contextMenu && (
        <DataManagerContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          row={contextMenu.row}
          onClose={() => setContextMenu(null)}
          onOpenRow={handleRowClick}
          onDeleteRow={(id) => {
            setEntity(prev => ({ ...prev, rows: prev.rows.filter(r => r.id !== id) }));
          }}
          onArchiveRow={(id) => alert(`Archived record ${id}`)}
          onDuplicateRow={(r) => {
            const dup = { ...r, id: `dup_${r.id}` };
            setEntity(prev => ({ ...prev, rows: [dup, ...prev.rows] }));
          }}
        />
      )}

      {/* 8. Import Wizard Modal */}
      <DataManagerImportModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        columns={entity.columns}
        onImportConfirm={(imported) => {
          setEntity(prev => ({
            ...prev,
            rows: [...imported.map((r, i) => ({ id: `imp_${i}`, ...r })), ...prev.rows],
            totalCount: prev.totalCount + imported.length
          }));
          toast(`Successfully imported ${imported.length} records!`, { type: 'success' });
        }}
      />

      {/* 9. Export Wizard Modal */}
      <DataManagerExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        rowCount={filteredRows.length}
        onConfirmExport={(fmt) => toast(`Exported ${filteredRows.length} records to ${fmt.toUpperCase()}`, { type: 'success' })}
      />

      {/* 10. Advanced Filter Rules Builder Modal */}
      <DataManagerFilterBuilder
        columns={entity.columns}
        rules={filterRules}
        onChangeRules={setFilterRules}
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
      />

      {/* 11. In-App Dark-Glass Confirmation Modal */}
      {confirmDialog && (
        <ConfirmDialog
          isOpen={confirmDialog.isOpen}
          title={confirmDialog.title}
          description={confirmDialog.description}
          onConfirm={confirmDialog.onConfirm}
          onCancel={() => setConfirmDialog(null)}
        />
      )}
          </div>
        </div>
      </div>
    </div>
  );
}
