const fs = require('fs');
let code = fs.readFileSync('dashboard/src/app/(dashboard)/admin/[projectSlug]/page.tsx', 'utf8');

const oldLeft = `<div className={\`flex h-full w-full \${theme.bg}\`}>
      
      {/* Left: Project Sidebar */}
      <div className={\`w-64 flex flex-col border-r \${theme.border}\`}>
        <div className={\`p-4 border-b \${theme.border} flex items-center gap-3\`}>`;

const newLeft = `<div className={\`flex h-screen overflow-hidden \${theme.canvas}\`}>
      <div className={theme.canvasBg} />
      
      {/* Left: Project Sidebar */}
      <div className={\`w-64 flex flex-col border-r shrink-0 z-10 \${theme.sidebar}\`}>
        <div className="p-4 border-b border-gray-500/20 flex items-center gap-3">`;

code = code.replace(oldLeft, newLeft);

const oldNavBtn = `className={\`w-full text-left px-3 py-2 rounded flex items-center gap-3 text-sm transition-colors \${
                  isActive 
                    ? \`\${theme.activeNavItem} font-bold shadow-[0_0_10px_rgba(0,178,255,0.2)]\` 
                    : theme.navItem
                }\`}`;

const newNavBtn = `className={\`w-full text-left px-3 py-2 flex items-center gap-3 transition-colors \${
                  isActive 
                    ? theme.sidebarNavActive 
                    : theme.sidebarNavItems
                }\`}`;

code = code.replace(oldNavBtn, newNavBtn);

fs.writeFileSync('dashboard/src/app/(dashboard)/admin/[projectSlug]/page.tsx', code);
