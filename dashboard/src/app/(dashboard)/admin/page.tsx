"use client";

import React from 'react';
import Link from 'next/link';
import { PROJECT_REGISTRY } from '@/components/project-admin/project-registry';
import { ArrowRight, Database } from 'lucide-react';

export default function AdminIndexPage() {
  return (
    <div className="p-8 max-w-[1000px] mx-auto space-y-8">
      <div className="pb-4 border-b border-[#262626]">
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
          <Database className="w-6 h-6 text-[#2266ec]" /> Project Admin Panels
        </h1>
        <p className="text-xs text-[#a6a6a6] mt-1">
          Full CRUD database access for each of your projects. Select one to manage its data.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PROJECT_REGISTRY.map(project => (
          <Link
            key={project.slug}
            href={`/admin/${project.slug}`}
            className="group bg-[#1a1a1a] hover:bg-[#262626] border border-[#262626] hover:border-[#333] rounded-xl p-6 transition-all flex flex-col gap-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl border"
                  style={{ background: `${project.color}15`, borderColor: `${project.color}30` }}
                >
                  {project.icon}
                </div>
                <div>
                  <div className="text-white font-bold text-lg">{project.name}</div>
                  <div className="text-xs text-[#656565] font-mono">{project.domain}</div>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-[#656565] group-hover:text-white transition-colors" />
            </div>

            <div className="flex flex-wrap gap-1.5">
              {project.sections.map(sec => (
                <span key={sec.id} className="text-[10px] bg-[#262626] text-[#a6a6a6] px-2 py-0.5 rounded-full">
                  {sec.icon} {sec.label}
                </span>
              ))}
            </div>

            <div className="text-[10px] text-[#656565] font-mono border-t border-[#262626] pt-3 mt-auto">
              Firebase: {project.firebase.projectId}
              {project.firebase.databaseId && <> · DB: {project.firebase.databaseId}</>}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
