"use client";

import React, { useState } from 'react';
import { Download, FileText, Code2, Clipboard, Check } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  rowCount: number;
  onConfirmExport: (format: 'csv' | 'excel' | 'pdf' | 'json' | 'clipboard') => void;
}

export function DataManagerExportModal({
  isOpen,
  onClose,
  rowCount,
  onConfirmExport,
}: ExportModalProps) {
  const [selectedFormat, setSelectedFormat] = useState<'csv' | 'excel' | 'pdf' | 'json' | 'clipboard'>('csv');

  if (!isOpen) return null;

  const formats = [
    { id: 'csv', label: 'CSV (.csv)', desc: 'Comma separated values for spreadsheet processing' },
    { id: 'excel', label: 'Excel (.xlsx)', desc: 'Microsoft Excel spreadsheet format' },
    { id: 'pdf', label: 'PDF Document (.pdf)', desc: 'Printable formatted report document' },
    { id: 'json', label: 'Raw JSON (.json)', desc: 'Structured JavaScript Object Notation' },
    { id: 'clipboard', label: 'Copy to Clipboard', desc: 'Copy formatted TSV data directly to clipboard' },
  ];

  const handleExport = () => {
    onConfirmExport(selectedFormat);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-6 animate-in fade-in duration-200">
      <div className="bg-[#1a1a1a] border border-[#333] rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#262626] pb-3">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Download className="w-4 h-4 text-[#2266ec]" /> Universal Export Wizard
          </h3>
          <button onClick={onClose} className="text-[#a6a6a6] hover:text-white text-sm">✕</button>
        </div>

        <div className="text-xs text-[#a6a6a6]">
          Exporting <span className="text-white font-semibold">{rowCount} records</span> using your current column visibility and sort filters:
        </div>

        <div className="space-y-2">
          {formats.map(f => (
            <label
              key={f.id}
              className={`flex items-start gap-3 p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                selectedFormat === f.id
                  ? 'bg-[#2266ec]/10 border-[#2266ec]/50 text-white'
                  : 'bg-[#121212] border-[#262626] text-[#656565]'
              }`}
            >
              <input
                type="radio"
                name="export_format"
                checked={selectedFormat === f.id}
                onChange={() => setSelectedFormat(f.id as any)}
                className="mt-0.5 border-[#404040] bg-[#121212] text-[#2266ec] focus:ring-0"
              />
              <div>
                <div className="font-semibold text-white">{f.label}</div>
                <div className="text-[11px] text-[#a6a6a6]">{f.desc}</div>
              </div>
            </label>
          ))}
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button onClick={onClose} className="px-3 py-1.5 bg-[#262626] text-[#a6a6a6] hover:text-white text-xs rounded-md">
            Cancel
          </button>
          <button onClick={handleExport} className="px-5 py-1.5 bg-[#2266ec] text-white text-xs font-semibold rounded-md hover:bg-[#1d57cc]">
            Export Now
          </button>
        </div>
      </div>
    </div>
  );
}
