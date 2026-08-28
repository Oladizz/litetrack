const fs = require('fs');

let content = fs.readFileSync('dashboard/src/components/ui/sidebar.tsx', 'utf8');

const oldAdminLinks = `          <div className="text-[10px] font-bold text-[#656565] mt-6 mb-2 px-2 uppercase tracking-widest">Admin</div>

          <Link href="/settings" className={\`w-full flex items-center gap-2 px-2 py-1.5 text-[13px] font-medium rounded transition-colors \${isActive('/settings') ? 'bg-[#262626] text-white' : 'text-[#a6a6a6] hover:text-white hover:bg-[#262626]/50'}\`}>
            <Settings className="w-4 h-4" /> Settings
          </Link>`;

const newAdminLinks = `          <div className="text-[10px] font-bold text-[#656565] mt-6 mb-2 px-2 uppercase tracking-widest">Admin</div>

          <Link href="/enterprise-control" className={\`w-full flex items-center gap-2 px-2 py-1.5 text-[13px] font-medium rounded transition-colors \${isActive('/enterprise-control') ? 'bg-[#262626] text-white' : 'text-[#a6a6a6] hover:text-white hover:bg-[#262626]/50'}\`}>
            <Globe className="w-4 h-4" /> Global Overview
          </Link>
          
          <Link href="/settings" className={\`w-full flex items-center gap-2 px-2 py-1.5 text-[13px] font-medium rounded transition-colors \${isActive('/settings') ? 'bg-[#262626] text-white' : 'text-[#a6a6a6] hover:text-white hover:bg-[#262626]/50'}\`}>
            <Settings className="w-4 h-4" /> Settings
          </Link>`;

content = content.replace(oldAdminLinks, newAdminLinks);

fs.writeFileSync('dashboard/src/components/ui/sidebar.tsx', content);
