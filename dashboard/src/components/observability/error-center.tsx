"use client";

import React, { useState } from 'react';
import { AlertCircle, Bug, Sparkles, Check, ArrowRight, Code } from 'lucide-react';
import { StackErrorItem } from './types';
import { toast } from '@/components/ui/toast';

interface ErrorProps {
  errors: StackErrorItem[];
  onResolveError: (errorId: string) => void;
}

export function ErrorCenter({ errors, onResolveError }: ErrorProps) {
  const [selectedError, setSelectedError] = useState<StackErrorItem>(errors[0]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
      {/* Error List */}
      <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between border-b border-[#262626] pb-3">
          <h4 className="font-bold text-white text-sm flex items-center gap-2">
            <Bug className="w-4 h-4 text-red-400" /> Exceptions ({errors.length})
          </h4>
        </div>

        <div className="space-y-2">
          {errors.map(err => {
            const isSelected = selectedError.id === err.id;
            return (
              <div
                key={err.id}
                onClick={() => setSelectedError(err)}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-red-500/10 border-red-500 text-white shadow-md'
                    : 'bg-[#121212] border-[#262626] text-[#a6a6a6] hover:text-white'
                }`}
              >
                <div className="font-bold text-xs text-red-400 font-mono truncate">{err.errorName}</div>
                <div className="text-[11px] text-[#656565] truncate font-mono mt-0.5">{err.errorMessage}</div>
                <div className="text-[10px] text-[#656565] mt-1 font-mono">{err.timestamp} · {err.affectedEndpoint}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Error Details & AI Explanation Studio */}
      <div className="md:col-span-2 bg-[#1a1a1a] border border-[#262626] rounded-xl p-5 shadow-xl space-y-4 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-[#262626] pb-3">
          <div>
            <h3 className="font-bold text-white text-base text-red-400">{selectedError.errorName}</h3>
            <p className="text-xs text-[#a6a6a6] font-sans mt-0.5">{selectedError.errorMessage}</p>
          </div>
          <button
            onClick={() => { onResolveError(selectedError.id); toast(`Applied AI Fix: ${selectedError.suggestedFix}`, { type: 'success' }); }}
            className="px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow"
          >
            <Check className="w-3.5 h-3.5" /> Apply AI Fix
          </button>
        </div>

        {/* Stack Trace Box */}
        <div className="space-y-1">
          <div className="text-[10px] text-[#656565] uppercase">Raw Stack Trace</div>
          <pre className="bg-[#121212] p-3 rounded-lg border border-[#262626] text-red-400 text-[11px] overflow-x-auto">
            {selectedError.stackTrace}
          </pre>
        </div>

        {/* AI Root Cause Explanation Box */}
        <div className="bg-[#121212] p-4 rounded-xl border border-[#2266ec]/30 space-y-2">
          <div className="flex items-center gap-2 font-bold text-[#2266ec]">
            <Sparkles className="w-4 h-4" /> AI Root Cause Diagnosis
          </div>
          <p className="text-white text-xs font-sans leading-relaxed">{selectedError.aiExplanation}</p>
          <div className="text-green-400 font-bold bg-green-500/10 p-2 rounded border border-green-500/20 font-sans">
            Recommended Automated Fix: {selectedError.suggestedFix}
          </div>
        </div>
      </div>
    </div>
  );
}
