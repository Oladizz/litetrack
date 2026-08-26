"use client";

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { getProjectBySlug, PROJECT_REGISTRY } from '@/components/project-admin/project-registry';
import { CollectionManager } from '@/components/project-admin/admin-components';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function ProjectAdminPage() {
  const params = React.use(useParams() as any);
  const slug = params.projectSlug as string;
  const project = getProjectBySlug(slug);

  const [activeSection, setActiveSection] = useState(0);

  if (!project) {
    return (
      <div className="p-8 text-center">
        <div className="text-2xl font-bold text-white mb-2">Project Not Found</div>
        <p className="text-[#a6a6a6] text-sm mb-6">No admin panel configured for "{slug}"</p>
        <Link href="/admin" className="text-[#2266ec] hover:underline text-sm">← Back to Projects</Link>
      </div>
    );
  }

  const section = project.sections[activeSection];

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left: Section Nav */}
      <div className="w-56 bg-[#0a0a0a] border-r border-[#262626] flex flex-col shrink-0">
        <div className="p-4 border-b border-[#262626]">
          <Link href="/admin" className="text-[11px] text-[#656565] hover:text-white flex items-center gap-1 mb-3 transition-colors">
            <ChevronLeft className="w-3 h-3" /> All Projects
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xl">{project.icon}</span>
            <div>
              <div className="text-sm font-bold text-white">{project.name}</div>
              <div className="text-[10px] text-[#656565] font-mono">{project.domain}</div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
          {project.sections.map((sec, i) => (
            <button
              key={sec.id}
              onClick={() => setActiveSection(i)}
              className={`w-full text-left px-3 py-2 rounded-lg text-[13px] font-medium flex items-center gap-2.5 transition-colors ${
                activeSection === i
                  ? 'bg-[#2266ec] text-white'
                  : 'text-[#a6a6a6] hover:text-white hover:bg-[#1a1a1a]'
              }`}
            >
              <span>{sec.icon}</span> {sec.label}
            </button>
          ))}
        </div>

        <div className="p-3 border-t border-[#262626]">
          <div className="text-[10px] text-[#656565] font-mono">
            Firebase: {project.firebase.projectId}
            {project.firebase.databaseId && <><br />DB: {project.firebase.databaseId}</>}
          </div>
        </div>
      </div>

      {/* Right: Collection Manager */}
      <div className="flex-1 overflow-y-auto p-8">
        <CollectionManager project={project} section={section} />
      </div>
    </div>
  );
}
