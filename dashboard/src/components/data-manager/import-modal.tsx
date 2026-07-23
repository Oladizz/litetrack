"use client";

import React, { useState } from 'react';
import { Upload, FileSpreadsheet, CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';
import { ColumnDef } from './types';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  columns: ColumnDef[];
  onImportConfirm: (rows: Record<string, any>[]) => void;
}

export function DataManagerImportModal({
  isOpen,
  onClose,
  columns,
  onImportConfirm,
}: ImportModalProps) {
  const [step, setStep] = useState<'upload' | 'mapping' | 'preview'>('upload');
  const [fileName, setFileName] = useState('');

  if (!isOpen) return null;

  const sampleRows = [
    { name: 'John Doe', email: 'john@example.com', status: 'active', revenue: 1500 },
    { name: 'Sarah Connor', email: 'sarah@example.com', status: 'pending', revenue: 2400 },
  ];

  const handleConfirm = () => {
    onImportConfirm(sampleRows);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-6 animate-in fade-in duration-200">
      <div className="bg-[#1a1a1a] border border-[#333] rounded-2xl w-full max-w-xl p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-[#262626] pb-3">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-[#2266ec]" /> Universal Data Import Wizard
          </h3>
          <button onClick={onClose} className="text-[#a6a6a6] hover:text-white text-sm">✕</button>
        </div>

        {step === 'upload' && (
          <div className="space-y-4">
            <div
              onClick={() => { setFileName('data_export_users_2026.csv'); setStep('mapping'); }}
              className="border-2 border-dashed border-[#333] hover:border-[#2266ec] rounded-xl p-8 text-center cursor-pointer bg-[#121212] transition-colors space-y-2"
            >
              <Upload className="w-8 h-8 text-[#2266ec] mx-auto" />
              <div className="text-xs text-white font-medium">Drag & Drop CSV or Excel file here</div>
              <div className="text-[11px] text-[#656565]">Supports .csv, .xlsx, .json format (up to 50MB)</div>
            </div>
          </div>
        )}

        {step === 'mapping' && (
          <div className="space-y-4">
            <div className="text-xs font-semibold text-white flex items-center justify-between">
              <span>Map CSV Columns to Schema</span>
              <span className="text-[10px] text-green-400 font-mono">File: {fileName}</span>
            </div>
            
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {columns.map(col => (
                <div key={col.id} className="flex items-center justify-between bg-[#121212] p-2.5 rounded-lg border border-[#262626] text-xs">
                  <span className="text-[#a6a6a6] font-mono">{col.label} ({col.type})</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#656565]" />
                  <select className="bg-[#1a1a1a] border border-[#333] text-white rounded px-2 py-1 outline-none text-xs">
                    <option value={col.id}>Matched Column: [{col.id}]</option>
                  </select>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setStep('preview')} className="px-4 py-1.5 bg-[#2266ec] text-white text-xs font-medium rounded-md hover:bg-[#1d57cc]">
                Continue to Validation
              </button>
            </div>
          </div>
        )}

        {step === 'preview' && (
          <div className="space-y-4">
            <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-3 rounded-lg text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0" /> Validation Passed: 2 rows ready for import. 0 errors detected.
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button onClick={handleConfirm} className="px-5 py-2 bg-[#2266ec] text-white text-xs font-semibold rounded-md hover:bg-[#1d57cc]">
                Complete Import (2 Rows)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
