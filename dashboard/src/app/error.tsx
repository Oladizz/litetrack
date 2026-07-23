"use client";

import React, { useEffect, useState } from 'react';
import { AlertTriangle, Copy, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Log the error to an error reporting service in production
    console.error(error);
  }, [error]);

  const copyToClipboard = async () => {
    try {
      const errorText = `Error: ${error.message}\nDigest: ${error.digest || 'N/A'}\nStack: ${error.stack || 'N/A'}`;
      await navigator.clipboard.writeText(errorText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="min-h-screen font-sans flex items-center justify-center bg-[#121212] text-[#fafafa] relative overflow-hidden">
      {/* Background glowing orb for errors (subtle red) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-500/20 rounded-full blur-[120px] opacity-20 pointer-events-none" />
      
      <div className="relative z-10 flex flex-col w-full max-w-xl text-left p-8 bg-[#1a1a1a] border border-[#333] rounded-2xl shadow-2xl">
        <div className="flex items-center gap-3 mb-6 border-b border-[#262626] pb-5">
          <div className="w-10 h-10 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">Application Error</h1>
            <p className="text-sm text-[#a6a6a6]">Something unexpected happened.</p>
          </div>
        </div>
        
        <div className="bg-[#121212] border border-[#262626] rounded-xl p-4 mb-6 relative group overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#656565] uppercase tracking-wider">Error Details</span>
            <button 
              onClick={copyToClipboard}
              className="flex items-center gap-1.5 text-xs font-medium text-[#a6a6a6] hover:text-white transition-colors bg-[#262626] px-2 py-1 rounded-md"
            >
              {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <p className="text-[13px] text-red-400 font-mono break-all mb-2">{error.message}</p>
          {error.digest && (
            <p className="text-xs text-[#656565] font-mono break-all">Digest: {error.digest}</p>
          )}
        </div>
        
        <div className="flex items-center gap-4 w-full">
          <button 
            onClick={() => window.location.href = '/'}
            className="flex-1 px-4 py-2.5 bg-[#262626] border border-[#333] rounded-lg text-[13px] font-medium text-white hover:bg-[#333] transition-all"
          >
            Return Home
          </button>
          
          <button 
            onClick={() => reset()}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-black rounded-lg text-[13px] font-medium hover:bg-white/90 transition-all shadow-md"
          >
            <RefreshCw className="w-4 h-4" /> Try again
          </button>
        </div>
      </div>
    </div>
  );
}
