"use client";

import React from 'react';
import { AlertTriangle, Info, CheckCircle2, X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info' | 'success';
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmLabel = 'Confirm Action',
  cancelLabel = 'Cancel',
  variant = 'danger',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const iconMap = {
    danger: <AlertTriangle className="w-6 h-6 text-red-500" />,
    warning: <AlertTriangle className="w-6 h-6 text-amber-400" />,
    info: <Info className="w-6 h-6 text-[#2266ec]" />,
    success: <CheckCircle2 className="w-6 h-6 text-green-400" />,
  };

  const buttonStyleMap = {
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/20',
    warning: 'bg-amber-600 hover:bg-amber-700 text-white shadow-lg shadow-amber-600/20',
    info: 'bg-[#2266ec] hover:bg-[#1d57cc] text-white shadow-lg shadow-[#2266ec]/20',
    success: 'bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/20',
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-6 animate-in fade-in zoom-in-95 duration-200">
      <div className="bg-[#1a1a1a] border border-[#333] rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4 relative overflow-hidden">
        {/* Glow Header Accent */}
        <div className={`absolute top-0 left-0 right-0 h-1 ${
          variant === 'danger' ? 'bg-red-500' : variant === 'warning' ? 'bg-amber-400' : 'bg-[#2266ec]'
        }`}></div>

        <div className="flex items-start gap-4">
          <div className="p-3 bg-[#121212] rounded-xl border border-[#262626] shrink-0">
            {iconMap[variant]}
          </div>

          <div className="space-y-1 flex-1">
            <h3 className="text-base font-bold text-white tracking-tight">{title}</h3>
            <p className="text-xs text-[#a6a6a6] leading-relaxed">{description}</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#262626]">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-[#262626] hover:bg-[#333] text-[#a6a6a6] hover:text-white text-xs font-semibold rounded-lg transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-5 py-2 text-xs font-semibold rounded-lg transition-all transform active:scale-95 ${buttonStyleMap[variant]}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
