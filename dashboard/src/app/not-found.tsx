"use client";

import React from 'react';
import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen font-sans flex items-center justify-center bg-[#121212] text-[#fafafa] relative overflow-hidden">
      {/* Background glowing orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#2266ec] rounded-full blur-[120px] opacity-[0.03] pointer-events-none" />
      
      <div className="relative z-10 flex flex-col items-center max-w-md text-center p-6">
        <div className="w-16 h-16 bg-[#262626] border border-[#333] rounded-2xl flex items-center justify-center mb-8 shadow-xl">
          <span className="text-2xl font-bold text-[#2266ec]">404</span>
        </div>
        
        <h1 className="text-3xl font-bold tracking-tight mb-3 text-white">Page Not Found</h1>
        <p className="text-[#a6a6a6] text-[15px] mb-8 leading-relaxed">
          The page you are looking for doesn't exist or has been moved. Check the URL or return to your dashboard.
        </p>
        
        <div className="flex items-center gap-4 w-full">
          <button 
            onClick={() => window.history.back()}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1a1a1a] border border-[#333] rounded-lg text-[13px] font-medium text-white hover:bg-[#262626] transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Go Back
          </button>
          
          <Link 
            href="/"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#2266ec] border border-[#2266ec] rounded-lg text-[13px] font-medium text-white hover:bg-[#2266ec]/90 transition-all shadow-[0_0_20px_rgba(34,102,236,0.3)]"
          >
            <Home className="w-4 h-4" /> Overview
          </Link>
        </div>
      </div>
    </div>
  );
}
