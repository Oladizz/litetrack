"use client";

import React, { useState } from 'react';
import {
  ShieldCheck, Check, X, Clock, ChevronRight, BookOpen,
  Sparkles, Bot, User, Scale, AlertTriangle
} from 'lucide-react';
import { ApprovalStage, Decision } from './types';
import { toast } from '@/components/ui/toast';

interface Props {
  approvals: ApprovalStage[];
  decisions: Decision[];
  onApprove: (stageId: string) => void;
  onReject: (stageId: string) => void;
}

const STATUS_STYLES: Record<string, { color: string; bg: string; icon: React.ReactNode }> = {
  approved: { color: 'text-green-400', bg: 'bg-green-500/20', icon: <Check className="w-3.5 h-3.5" /> },
  rejected: { color: 'text-red-400', bg: 'bg-red-500/20', icon: <X className="w-3.5 h-3.5" /> },
  pending: { color: 'text-[#2266ec]', bg: 'bg-[#2266ec]/20', icon: <Clock className="w-3.5 h-3.5" /> },
  waiting: { color: 'text-[#656565]', bg: 'bg-[#333]/30', icon: <Clock className="w-3.5 h-3.5" /> },
};

const DECISION_CATEGORIES: Record<string, string> = {
  Financial: 'text-green-400 bg-green-500/10 border-green-500/20',
  Operational: 'text-[#2266ec] bg-[#2266ec]/10 border-[#2266ec]/20',
  Security: 'text-red-400 bg-red-500/10 border-red-500/20',
  Product: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  HR: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
};

export function ApprovalDecisionLog({ approvals, decisions, onApprove, onReject }: Props) {
  const [expandedApproval, setExpandedApproval] = useState<string | null>(approvals.find(a => a.status === 'pending')?.id ?? null);

  return (
    <div className="space-y-6 font-sans">
      {/* Approval Chain */}
      <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-5 shadow-xl space-y-4">
        <div className="border-b border-[#262626] pb-3">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-green-400" /> Visual Approval Pipeline
          </h3>
          <p className="text-[10px] text-[#656565] mt-1">Multi-stage approval chain with AI summary preparation</p>
        </div>

        {/* Horizontal Pipeline */}
        <div className="flex items-center justify-center gap-0 py-4 overflow-x-auto">
          {approvals.map((stage, i) => {
            const style = STATUS_STYLES[stage.status];
            const isPending = stage.status === 'pending';
            return (
              <React.Fragment key={stage.id}>
                <button
                  onClick={() => setExpandedApproval(expandedApproval === stage.id ? null : stage.id)}
                  className="flex flex-col items-center gap-1.5 shrink-0"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center border-2 transition-all ${
                    isPending
                      ? 'bg-[#2266ec] border-[#2266ec] text-white shadow-lg shadow-[#2266ec]/30 scale-110 animate-pulse'
                      : stage.status === 'approved'
                        ? 'bg-green-500/20 border-green-500/40 text-green-400'
                        : stage.status === 'rejected'
                          ? 'bg-red-500/20 border-red-500/40 text-red-400'
                          : 'bg-[#121212] border-[#262626] text-[#656565]'
                  }`}>
                    {style.icon}
                  </div>
                  <span className={`text-[10px] font-semibold text-center ${style.color}`}>{stage.label}</span>
                  <span className="text-[9px] text-[#656565] font-mono">{stage.approver}</span>
                </button>
                {i < approvals.length - 1 && (
                  <div className={`w-10 h-0.5 mx-1 mt-[-20px] rounded-full shrink-0 ${
                    stage.status === 'approved' ? 'bg-green-400' : 'bg-[#262626]'
                  }`} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Expanded Stage Detail */}
        {expandedApproval && (() => {
          const stage = approvals.find(a => a.id === expandedApproval);
          if (!stage) return null;
          const isPending = stage.status === 'pending';
          return (
            <div className="bg-[#121212] border border-[#262626] rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-white">{stage.label}</div>
                  <div className="text-[10px] text-[#656565] flex items-center gap-1.5 mt-0.5">
                    {stage.approverType === 'ai_agent' ? <Bot className="w-3 h-3 text-purple-400" /> : <User className="w-3 h-3 text-[#a6a6a6]" />}
                    {stage.approver}
                    {stage.timestamp && <span className="font-mono">· {stage.timestamp}</span>}
                  </div>
                </div>
                <span className={`text-[10px] px-2 py-1 rounded-lg font-bold ${STATUS_STYLES[stage.status].bg} ${STATUS_STYLES[stage.status].color}`}>
                  {stage.status.charAt(0).toUpperCase() + stage.status.slice(1)}
                </span>
              </div>

              {/* AI Summary */}
              {stage.aiSummary && (
                <div className="bg-purple-500/5 border border-purple-500/20 rounded-lg p-3 text-xs text-purple-300 space-y-1">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-purple-400">
                    <Sparkles className="w-3 h-3" /> AI Approval Summary
                  </div>
                  <div className="text-[11px] leading-relaxed">{stage.aiSummary}</div>
                </div>
              )}

              {/* Action Buttons */}
              {isPending && (
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => { onApprove(stage.id); toast(`${stage.label} approved`, { type: 'success' }); }}
                    className="flex-1 py-2 rounded-lg bg-green-500/20 text-green-400 text-xs font-bold flex items-center justify-center gap-1.5 border border-green-500/30 hover:bg-green-500/30 transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" /> Approve
                  </button>
                  <button
                    onClick={() => { onReject(stage.id); toast(`${stage.label} rejected`, { type: 'info' }); }}
                    className="flex-1 py-2 rounded-lg bg-red-500/20 text-red-400 text-xs font-bold flex items-center justify-center gap-1.5 border border-red-500/30 hover:bg-red-500/30 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" /> Reject
                  </button>
                </div>
              )}
            </div>
          );
        })()}
      </div>

      {/* Decision Log */}
      <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#262626] pb-3">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <Scale className="w-4 h-4 text-pink-400" /> Decision Log
          </h3>
          <span className="text-[10px] text-[#656565] font-mono">{decisions.length} decisions recorded</span>
        </div>

        <div className="space-y-2">
          {decisions.map(d => {
            const catStyle = DECISION_CATEGORIES[d.category] ?? 'text-[#a6a6a6] bg-[#1a1a1a] border-[#262626]';
            return (
              <div key={d.id} className="bg-[#121212] border border-[#262626] rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{d.title}</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded border font-bold ${catStyle}`}>{d.category}</span>
                  </div>
                  <span className="text-[9px] text-[#656565] font-mono">{d.timestamp}</span>
                </div>
                <div className="text-xs text-[#a6a6a6]">{d.reason}</div>
                <div className="flex items-center gap-4 text-[10px] text-[#656565] pt-1 border-t border-[#262626]">
                  <span className="flex items-center gap-1">
                    <Check className="w-3 h-3 text-green-400" /> Approved by: <span className="text-white font-semibold">{d.approvedBy}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    {d.suggestedByType === 'ai_agent' ? <Bot className="w-3 h-3 text-purple-400" /> : <User className="w-3 h-3" />}
                    Suggested by: <span className="text-purple-400 font-semibold">{d.suggestedBy}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
