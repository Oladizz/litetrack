"use client";

import React, { useState } from 'react';
import { ChevronRight, Filter, Search, ArrowRight } from 'lucide-react';

interface DrilldownModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTitle: string;
}

export function DrilldownModal({
  isOpen,
  onClose,
  initialTitle,
}: DrilldownModalProps) {
  const [breadcrumbs, setBreadcrumbs] = useState<string[]>(['Revenue', 'Country (Nigeria)', 'City (Lagos)', 'Top Customer (Rabiu)', 'Order #ORD-9481']);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-6 animate-in fade-in duration-200">
      <div className="bg-[#1a1a1a] border border-[#333] rounded-2xl w-full max-w-3xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#262626] pb-3">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#2266ec]" /> Interactive Metric Drill-Down Explorer
          </h3>
          <button onClick={onClose} className="text-[#a6a6a6] hover:text-white text-sm">✕</button>
        </div>

        {/* Drill-down Breadcrumbs Trail */}
        <div className="flex items-center gap-1.5 text-xs bg-[#121212] p-3 rounded-lg border border-[#262626] overflow-x-auto hide-scrollbar font-mono">
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-[#656565] shrink-0" />}
              <span className={idx === breadcrumbs.length - 1 ? "text-[#2266ec] font-bold" : "text-[#a6a6a6]"}>
                {crumb}
              </span>
            </React.Fragment>
          ))}
        </div>

        {/* Breakdown Level Data Table */}
        <div className="space-y-2">
          <div className="text-xs font-semibold text-white">Lagos City Customer Order Breakdown:</div>
          <div className="bg-[#121212] rounded-lg border border-[#262626] overflow-hidden text-xs">
            <div className="grid grid-cols-4 p-2.5 bg-[#1a1a1a] text-[#656565] font-mono font-bold border-b border-[#262626]">
              <span>Customer</span>
              <span>Orders</span>
              <span>Total Revenue</span>
              <span>Action</span>
            </div>
            {[
              { name: 'Rabiu Oladizz', orders: 14, rev: '$18,400' },
              { name: 'Emeka Chukwu', orders: 8, rev: '$9,200' },
              { name: 'Amina Bello', orders: 5, rev: '$5,100' },
            ].map((row, i) => (
              <div key={i} className="grid grid-cols-4 p-2.5 border-b border-[#262626] text-white hover:bg-[#262626]/40 transition-colors">
                <span className="font-semibold">{row.name}</span>
                <span className="font-mono text-[#a6a6a6]">{row.orders} orders</span>
                <span className="font-mono text-green-400 font-bold">{row.rev}</span>
                <button onClick={() => alert(`Drilled down into ${row.name}`)} className="text-[#2266ec] text-left hover:underline flex items-center gap-1">
                  Explore <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button onClick={onClose} className="px-4 py-1.5 bg-[#2266ec] text-white text-xs font-semibold rounded-md hover:bg-[#1d57cc]">
            Close Explorer
          </button>
        </div>
      </div>
    </div>
  );
}
