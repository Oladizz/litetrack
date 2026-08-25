import React from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, ChevronRight, LayoutDashboard, Settings, BarChart2 } from 'lucide-react';

export default function DocsPage() {
  return (
    <div className="min-h-screen font-sans bg-[#121212] text-[#fafafa]">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <Link href="/" className="inline-flex items-center gap-2 text-[13px] text-[#a6a6a6] hover:text-white transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        
        <div className="flex items-center gap-4 mb-12 border-b border-[#262626] pb-8">
          <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center">
            <BookOpen className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Documentation</h1>
            <p className="text-[#a6a6a6] text-[15px]">Learn how to integrate and build with Litetrack.</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/docs/dashboards" className="group p-6 bg-[#1a1a1a] border border-[#262626] rounded-2xl hover:border-[#404040] transition-colors relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
              <ChevronRight className="w-5 h-5 text-white" />
            </div>
            <div className="w-10 h-10 bg-[#2266ec]/10 rounded-xl flex items-center justify-center mb-4">
              <LayoutDashboard className="w-5 h-5 text-[#2266ec]" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Custom Dashboards</h3>
            <p className="text-sm text-[#a6a6a6] leading-relaxed">
              Learn how to create, layout, and manage multiple dashboards across your organization.
            </p>
          </Link>

          <Link href="/docs/metrics" className="group p-6 bg-[#1a1a1a] border border-[#262626] rounded-2xl hover:border-[#404040] transition-colors relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
              <ChevronRight className="w-5 h-5 text-white" />
            </div>
            <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4">
              <BarChart2 className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Understanding Metrics</h3>
            <p className="text-sm text-[#a6a6a6] leading-relaxed">
              Dive into the data types and chart visualizations supported by the platform.
            </p>
          </Link>

          <Link href="/settings" className="group p-6 bg-[#1a1a1a] border border-[#262626] rounded-2xl hover:border-[#404040] transition-colors relative overflow-hidden md:col-span-2">
            <div className="absolute top-0 right-0 p-6 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
              <ChevronRight className="w-5 h-5 text-white" />
            </div>
            <div className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center mb-4">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Platform Settings & API</h3>
            <p className="text-sm text-[#a6a6a6] leading-relaxed max-w-xl">
              Configure your projects, retrieve API keys, and manage billing settings. Connect your external data sources via the REST API.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
