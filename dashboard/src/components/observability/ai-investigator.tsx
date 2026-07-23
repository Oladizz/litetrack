"use client";

import React from 'react';
import { Search, Sparkles, CheckCircle2, AlertTriangle, ArrowRight, X } from 'lucide-react';
import { InvestigationReport } from './types';

interface InvestigatorProps {
  report: InvestigationReport | null;
  onClose: () => void;
}

export function AIInvestigatorModal({ report, onClose }: InvestigatorProps) {
  if (!report) return null;

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-6 animate-in fade-in duration-200">
      <div className="bg-[#1a1a1a] border border-[#2266ec] rounded-2xl w-full max-w-2xl p-6 shadow-2xl space-y-5 font-sans">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#262626] pb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#2266ec]" />
            <h3 className="text-base font-bold text-white">⭐ AI Automated Investigation Brief</h3>
          </div>
          <button onClick={onClose} className="text-[#a6a6a6] hover:text-white text-sm">✕</button>
        </div>

        {/* Target & Probability Score */}
        <div className="bg-[#121212] p-4 rounded-xl border border-[#262626] flex items-center justify-between">
          <div>
            <div className="text-[10px] text-[#656565] font-mono uppercase">Target Event / Item</div>
            <div className="font-bold text-white text-sm">{report.targetTitle}</div>
          </div>
          <span className="bg-green-500/10 text-green-400 border border-green-500/20 px-3 py-1 rounded-full font-mono text-xs font-bold">
            Confidence: {report.confidenceScore}%
          </span>
        </div>

        {/* Probable Cause */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-[#656565] font-mono uppercase block">Probable Root Cause</label>
          <p className="text-xs text-white bg-[#121212] p-3 rounded-lg border border-[#262626] leading-relaxed">
            {report.probableCause}
          </p>
        </div>

        {/* Evidence List */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#656565] font-mono uppercase block">Collected System Evidence ({report.evidenceList.length})</label>
          <div className="space-y-1.5 font-mono text-xs">
            {report.evidenceList.map((ev, i) => (
              <div key={i} className="bg-[#121212] p-2.5 rounded-lg border border-[#262626] text-white flex items-center gap-2">
                <span className="text-[#2266ec] font-bold">✓</span> {ev}
              </div>
            ))}
          </div>
        </div>

        {/* Suggested Action */}
        <div className="bg-[#2266ec]/10 border border-[#2266ec]/30 p-3 rounded-xl text-xs text-[#2266ec] font-semibold flex items-center justify-between">
          <span>Suggested Action: {report.suggestedAction}</span>
          <button onClick={onClose} className="px-3 py-1 bg-[#2266ec] text-white rounded font-bold hover:bg-[#1d57cc]">
            Execute Action
          </button>
        </div>
      </div>
    </div>
  );
}
