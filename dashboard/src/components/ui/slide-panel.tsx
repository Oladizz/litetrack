"use client";

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface SlidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export function SlidePanel({ isOpen, onClose, title, subtitle, children, actions }: SlidePanelProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className="relative w-full max-w-xl h-full bg-[#121212] border-l border-[#262626] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#262626] flex items-center justify-between bg-[#1a1a1a]/50 backdrop-blur-md">
          <div>
            <h2 className="text-[16px] font-semibold text-white tracking-tight">{title}</h2>
            {subtitle && <p className="text-[12px] text-[#8a8a8a] mt-0.5">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-3">
            {actions}
            <div className="w-px h-4 bg-[#333]"></div>
            <button 
              onClick={onClose}
              className="p-1.5 text-[#656565] hover:text-white hover:bg-[#262626] rounded-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto hide-scrollbar p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
