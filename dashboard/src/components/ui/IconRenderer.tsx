import React from 'react';
import * as LucideIcons from 'lucide-react';

export function IconRenderer({ name, className = "w-4 h-4" }: { name: string, className?: string }) {
  const Icon = (LucideIcons as any)[name] || LucideIcons.Circle;
  return <Icon className={className} />;
}
