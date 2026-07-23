"use client";

import React, { useEffect, useState } from 'react';
import { Check, Info, AlertTriangle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  action?: {
    label: string;
    onClick: () => void;
  };
}

let globalToasts: Toast[] = [];
let listeners: Array<() => void> = [];

const emitChange = () => {
  for (const listener of listeners) {
    listener();
  }
};

export const toast = (message: string, options?: Omit<Toast, 'id' | 'message'>) => {
  const newToast = {
    id: Math.random().toString(36).substring(2, 9),
    message,
    type: options?.type || 'info',
    action: options?.action,
  };
  globalToasts = [...globalToasts, newToast];
  emitChange();
};

const removeToast = (id: string) => {
  globalToasts = globalToasts.filter(t => t.id !== id);
  emitChange();
};

const useToastStore = () => {
  const [toasts, setToasts] = useState<Toast[]>(globalToasts);

  useEffect(() => {
    const handleStoreChange = () => {
      setToasts(globalToasts);
    };
    listeners.push(handleStoreChange);
    return () => {
      listeners = listeners.filter(l => l !== handleStoreChange);
    };
  }, []);

  return toasts;
};

export function ToastProvider() {
  const toasts = useToastStore();

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} />
      ))}
    </div>
  );
}

function ToastItem({ toast: t }: { toast: Toast }) {
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;
    const timer = setTimeout(() => {
      removeToast(t.id);
    }, 4000);
    return () => clearTimeout(timer);
  }, [t.id, isHovered]);

  const Icon = {
    success: <Check className="w-4 h-4 text-green-500" />,
    error: <AlertTriangle className="w-4 h-4 text-red-500" />,
    warning: <AlertTriangle className="w-4 h-4 text-yellow-500" />,
    info: <Info className="w-4 h-4 text-[#2266ec]" />,
  }[t.type];

  return (
    <div 
      className="pointer-events-auto flex items-center gap-3 bg-[#1a1a1a]/95 backdrop-blur-md border border-white/[0.08] shadow-[0_8px_30px_rgba(0,0,0,0.5)] rounded-lg px-4 py-3 min-w-[300px] max-w-[400px] animate-in slide-in-from-bottom-5 fade-in duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="shrink-0">{Icon}</div>
      <div className="flex-1 text-[13px] text-[#fafafa] font-medium">{t.message}</div>
      {t.action && (
        <button 
          onClick={(e) => { e.stopPropagation(); t.action!.onClick(); removeToast(t.id); }}
          className="text-[12px] font-semibold text-[#a6a6a6] hover:text-white transition-colors bg-white/[0.05] hover:bg-white/[0.1] px-2 py-1 rounded"
        >
          {t.action.label}
        </button>
      )}
      <button 
        onClick={() => removeToast(t.id)} 
        className="shrink-0 text-[#656565] hover:text-white transition-colors ml-2"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
