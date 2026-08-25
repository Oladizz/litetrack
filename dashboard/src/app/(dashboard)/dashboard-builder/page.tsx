"use client";

import React from 'react';
import { UniversalDashboardBuilder } from '@/components/dashboard-builder';

export default function UniversalDashboardBuilderPage() {
  return (
    <>      
        <div className="p-8 max-w-[1600px] mx-auto">
          <UniversalDashboardBuilder />
        </div>
      
    </>
  );
}
