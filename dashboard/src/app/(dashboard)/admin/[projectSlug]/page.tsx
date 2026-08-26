"use client";

import React, { useState } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { getProjectBySlug } from '@/components/project-admin/project-registry';
import { CollectionManager } from '@/components/project-admin/admin-components';
import Link from 'next/link';

import { THEMES } from '@/components/project-admin/theme-tokens';
import { OladizzXyzWorkspace } from '@/components/project-admin/oladizz-workspace';
import * as LucideIcons from 'lucide-react';

export default function ProjectAdminPage() {
  const params = useParams();
  const slug = params?.projectSlug as string;
  const searchParams = useSearchParams();
  const sectionId = searchParams.get('section');
  const router = useRouter();

  const project = getProjectBySlug(slug);

  if (!project) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-white">Project Not Found</h2>
        <Link href="/admin" className="text-blue-500 hover:underline mt-4 inline-block">← Back to Projects</Link>
      </div>
    );
  }

  const section = project.sections.find(s => s.id === sectionId) || project.sections[0];
  const theme = THEMES[project.theme || 'default'];

  const renderIcon = (name: string, className?: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Icon = (LucideIcons as any)[name] || LucideIcons.Circle;
    return <Icon className={className || "w-4 h-4"} />;
  };

  return (
    <div className={`flex h-screen overflow-hidden ${theme.canvas}`}>
      <div className={theme.canvasBg} />
      
      {/* Left: Project Sidebar */}
      <div className={`w-64 flex flex-col border-r shrink-0 z-10 ${theme.sidebar}`}>
        <div className="p-4 border-b border-gray-500/20 flex items-center gap-3">
          <Link href="/admin" className="p-1.5 hover:bg-white/10 rounded transition-colors text-white">
            <LucideIcons.ChevronLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-2">
            {renderIcon(project.icon, "w-6 h-6 text-[#00B2FF]")}
            <span className="font-bold text-white tracking-wide">{project.name}</span>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
          {project.sections.map((sec) => {
            const isActive = section.id === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => router.push(`/admin/${project.slug}?section=${sec.id}`)}
                className={`w-full text-left px-3 py-2 flex items-center gap-3 transition-colors ${
                  isActive 
                    ? theme.sidebarNavActive 
                    : theme.sidebarNavItems
                }`}
              >
                {renderIcon(sec.icon, "w-4 h-4 opacity-80")} {sec.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Right: Main Canvas */}
      <div className="flex-1 overflow-y-auto p-8 z-10 custom-scrollbar">
        <div className="max-w-5xl mx-auto">
          {project.slug === 'oladizz-xyz' && section.collection === 'content' ? (
            <OladizzXyzWorkspace sectionId={section.id} />
          ) : (
            <CollectionManager project={project} section={section} />
          )}
        </div>
      </div>
    </div>
  );
}
