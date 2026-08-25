const fs = require('fs');
const { execSync } = require('child_process');

try { fs.mkdirSync('src/app/(dashboard)'); } catch (e) {}

const folders = [
  'agent-studio', 'collaboration', 'command-center', 'dashboard-builder',
  'dashboards', 'data-manager', 'docs', 'enterprise-control', 'finances',
  'ioac', 'observability', 'platform-studio', 'resource-manager', 'settings',
  'users', 'workspace'
];

folders.forEach(f => {
  if (fs.existsSync('src/app/' + f)) {
    execSync('mv src/app/' + f + ' "src/app/(dashboard)/"');
  }
});

if (fs.existsSync('src/app/page.tsx')) {
  execSync('mv src/app/page.tsx "src/app/(dashboard)/"');
}

const layoutContent = `import React from 'react';
import { Sidebar } from '@/components/ui/sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen font-sans flex text-[#fafafa] bg-[#121212]">
      <Sidebar />
      <main className="w-full lg:pl-64 min-w-0 flex-1 h-screen overflow-y-auto bg-[#121212] relative">
        {children}
      </main>
    </div>
  );
}
`;
fs.writeFileSync('src/app/(dashboard)/layout.tsx', layoutContent);

const files = execSync('find src/app/\\(dashboard\\) -name "page.tsx"').toString().trim().split('\n');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  content = content.replace(/import \{ Sidebar \} from '[^']+';?\n?/, "");
  content = content.replace(/\s*<Sidebar \/>\n?/, "");
  content = content.replace(/<div className="min-h-screen font-sans flex text-\[#fafafa\] bg-\[#121212\]">/, "<>");
  content = content.replace(/<main className="w-full lg:pl-64 min-w-0 flex-1 h-screen overflow-y-auto bg-\[#121212\]">/, "");
  content = content.replace(/<main className="w-full lg:pl-64 min-w-0 flex-1 relative h-screen overflow-y-auto">/, "");
  content = content.replace(/<\/main>/, "");
  
  const lastDivIndex = content.lastIndexOf('</div>');
  if (lastDivIndex !== -1) {
    content = content.substring(0, lastDivIndex) + '</>' + content.substring(lastDivIndex + 6);
  }
  
  fs.writeFileSync(file, content);
  console.log('Stripped boilerplate:', file);
});
