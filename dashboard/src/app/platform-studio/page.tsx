"use client";

import React from 'react';
import { Sidebar } from '@/components/ui/sidebar';
import { UniversalPlatformStudio } from '@/components/platform-studio';

export default function UniversalPlatformStudioPage() {
  return (
    <div className="min-h-screen font-sans flex text-[#fafafa] bg-[#121212]">
      <Sidebar />
      <main className="w-full lg:pl-64 min-w-0 flex-1 h-screen overflow-y-auto bg-[#121212]">
        <div className="p-8 max-w-[1600px] mx-auto">
          <UniversalPlatformStudio />
        </div>
      </main>
    </div>
  );
}
