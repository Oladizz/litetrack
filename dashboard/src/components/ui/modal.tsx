import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: string;
}

export function Modal({ isOpen, onClose, title, description, children, footer, maxWidth = 'max-w-md' }: ModalProps) {
  const [render, setRender] = useState(isOpen);

  useEffect(() => {
    if (isOpen) setRender(true);
  }, [isOpen]);

  const handleAnimationEnd = () => {
    if (!isOpen) setRender(false);
  };

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

  if (!render) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      onAnimationEnd={handleAnimationEnd}
    >
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-[#000000]/60 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />
      
      {/* Dialog */}
      <div 
        className={`relative w-full ${maxWidth} bg-[#1a1a1a] border border-[#333] rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.5)] overflow-hidden transition-all duration-300 transform ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'}`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#262626]">
          <div>
            <h3 className="text-lg font-semibold text-white tracking-tight">{title}</h3>
            {description && <p className="text-sm text-[#a6a6a6] mt-1">{description}</p>}
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-[#a6a6a6] hover:text-white hover:bg-[#262626] rounded-full transition-colors focus:outline-none"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="px-6 py-5 text-[#fafafa]">
          {children}
        </div>
        
        {footer && (
          <div className="px-6 py-4 border-t border-[#262626] bg-[#121212] flex items-center justify-end gap-3 rounded-b-2xl">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
