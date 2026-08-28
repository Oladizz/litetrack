const fs = require('fs');
let content = fs.readFileSync('dashboard/src/app/(dashboard)/page.tsx', 'utf8');

// I need to add the import for SiteAdminWorkspace
if (!content.includes('SiteAdminWorkspace')) {
  content = content.replace(
    "import { UniversalOperatingConsolePage } from",
    "import { SiteAdminWorkspace } from '@/components/admin/site-admin-workspace';\nimport { UniversalOperatingConsolePage } from"
  );
  
  if (!content.includes('SiteAdminWorkspace')) {
     // If the above replace didn't work, just put it at the top
     content = "import { SiteAdminWorkspace } from '@/components/admin/site-admin-workspace';\n" + content;
  }
}

// Replace the placeholder
const oldPlaceholder = `<div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-8 flex flex-col items-center justify-center text-center space-y-6 h-[50vh] animate-in fade-in slide-in-from-bottom-2 duration-300 mt-8">
              <div className="w-16 h-16 bg-[#2266ec]/10 border border-[#2266ec]/20 rounded-2xl flex items-center justify-center">
                <Shield className="w-8 h-8 text-[#2266ec]" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Site Admin Panel</h2>
                <p className="text-[#a6a6a6] max-w-md mx-auto text-sm">
                  Full site administration, user management, and database operations have been moved to the dedicated Data Manager.
                </p>
              </div>
              <div className="flex items-center gap-4 pt-4">
                <button onClick={() => router.push('/data-manager/users')} className="px-4 py-2 bg-[#262626] hover:bg-[#333] text-white rounded-lg text-sm font-semibold transition-colors">
                  Manage Users
                </button>
                <button onClick={() => setAdminViewMode('analytics')} className="px-4 py-2 bg-[#2266ec] hover:bg-[#1d57cc] text-white rounded-lg text-sm font-semibold transition-colors">
                  Return to Analytics
                </button>
              </div>
            </div>`;

const newComponent = `<div className="mt-8">
              <SiteAdminWorkspace />
            </div>`;

content = content.replace(oldPlaceholder, newComponent);

fs.writeFileSync('dashboard/src/app/(dashboard)/page.tsx', content);
