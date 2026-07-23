"use client";

import React from 'react';
import { 
  Plus, Upload, Download, RefreshCw, FileText, RotateCw, Archive, ChevronRight, CheckCircle2 
} from 'lucide-react';
import { UniversalEntity } from './types';

interface HeaderProps {
  entity: UniversalEntity;
  onCreateClick?: () => void;
  onImportClick?: () => void;
  onExportClick?: () => void;
  onRefreshClick?: () => void;
  onGenerateReportClick?: () => void;
  onSyncClick?: () => void;
  onBulkUploadClick?: () => void;
  onArchiveClick?: () => void;
}

export function DataManagerHeader({
  entity,
  onCreateClick,
  onImportClick,
  onExportClick,
  onRefreshClick,
  onGenerateReportClick,
  onSyncClick,
  onBulkUploadClick,
  onArchiveClick,
}: HeaderProps) {
  return (
    <div className="space-y-4 pb-4 border-b border-[#262626]">
      {/* Breadcrumbs */}
      {entity.breadcrumbs && entity.breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-1.5 text-xs text-[#a6a6a6]">
          {entity.breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-[#656565]" />}
              <span className={idx === entity.breadcrumbs!.length - 1 ? "text-white font-medium" : "hover:text-white cursor-pointer"}>
                {crumb.label}
              </span>
            </React.Fragment>
          ))}
        </nav>
      )}

      {/* Main Header Content */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white tracking-tight">{entity.title}</h1>
            <span className="bg-[#2266ec]/10 border border-[#2266ec]/30 text-[#2266ec] text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full">
              {entity.totalCount.toLocaleString()} {entity.title}
            </span>
          </div>
          <p className="text-xs text-[#a6a6a6] mt-1">{entity.description}</p>
          
          <div className="flex items-center gap-4 mt-2 text-[11px] text-[#656565] font-mono">
            <span>Updated {entity.lastUpdated}</span>
            <span className="flex items-center gap-1 text-green-400 font-semibold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Synced
            </span>
          </div>
        </div>

        {/* Primary & Contextual Action Toolbars */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Contextual Actions Dropdown/Group */}
          <div className="flex items-center gap-1 bg-[#1a1a1a] border border-[#262626] rounded-lg p-1">
            <button
              onClick={onGenerateReportClick}
              className="px-2.5 py-1 text-xs text-[#a6a6a6] hover:text-white hover:bg-[#262626] rounded transition-colors flex items-center gap-1"
              title="Generate Report"
            >
              <FileText className="w-3.5 h-3.5 text-[#2266ec]" /> Report
            </button>
            <button
              onClick={onSyncClick}
              className="px-2.5 py-1 text-xs text-[#a6a6a6] hover:text-white hover:bg-[#262626] rounded transition-colors flex items-center gap-1"
              title="Sync External Data"
            >
              <RotateCw className="w-3.5 h-3.5 text-amber-400" /> Sync
            </button>
            <button
              onClick={onArchiveClick}
              className="px-2.5 py-1 text-xs text-[#a6a6a6] hover:text-white hover:bg-[#262626] rounded transition-colors flex items-center gap-1"
              title="Archive Views"
            >
              <Archive className="w-3.5 h-3.5 text-purple-400" /> Archive
            </button>
          </div>

          {/* Primary Action Buttons */}
          <button
            onClick={onRefreshClick}
            className="p-2 bg-[#1a1a1a] border border-[#262626] hover:border-[#404040] text-[#a6a6a6] hover:text-white rounded-lg transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          
          <button
            onClick={onImportClick}
            className="px-3 py-1.5 bg-[#1a1a1a] border border-[#262626] hover:border-[#404040] text-xs font-medium text-white rounded-lg transition-colors flex items-center gap-1.5 shadow"
          >
            <Upload className="w-3.5 h-3.5 text-[#a6a6a6]" /> Import
          </button>

          <button
            onClick={onExportClick}
            className="px-3 py-1.5 bg-[#1a1a1a] border border-[#262626] hover:border-[#404040] text-xs font-medium text-white rounded-lg transition-colors flex items-center gap-1.5 shadow"
          >
            <Download className="w-3.5 h-3.5 text-[#a6a6a6]" /> Export
          </button>

          <button
            onClick={onCreateClick}
            className="px-4 py-1.5 bg-[#2266ec] hover:bg-[#1d57cc] text-xs font-semibold text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-lg shadow-[#2266ec]/20"
          >
            <Plus className="w-4 h-4" /> Create
          </button>
        </div>
      </div>
    </div>
  );
}
