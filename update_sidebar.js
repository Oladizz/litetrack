const fs = require('fs');
let code = fs.readFileSync('dashboard/src/components/ui/sidebar.tsx', 'utf8');

// Inside WORKSPACE ZONE, let's add the Database Admin link
// We will look for `{template === 'saas' && (` and insert the Database Admin link before the template specific links.
const workspaceZoneLink = `              <Link href="/dashboards" className={\`w-full flex items-center gap-2 px-2 py-1.5 text-[13px] font-medium rounded transition-colors \${isActive('/dashboards') ? 'bg-[#262626] text-white' : 'text-[#a6a6a6] hover:text-white hover:bg-[#262626]/50'}\`}>
                <BarChart3 className="w-4 h-4" /> Analytics
              </Link>
              
              <Link href={\`/admin/\${state.projectName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}\`} className={\`w-full flex items-center gap-2 px-2 py-1.5 text-[13px] font-medium rounded transition-colors \${isActive(\`/admin/\${state.projectName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}\`) ? 'bg-[#262626] text-white' : 'text-[#a6a6a6] hover:text-white hover:bg-[#262626]/50'}\`}>
                <Database className="w-4 h-4" /> Database Admin
              </Link>`;

code = code.replace(
  /<Link href="\/dashboards".*?<\/Link>/s,
  workspaceZoneLink
);

// Now hide the ADMIN CONTEXT if state.project is not Workspace Admin
const adminContextStart = `{/* ======================================= */}
          {/* 3. ADMIN CONTEXT */}
          {/* ======================================= */}`;

const adminContextReplacement = `{/* ======================================= */}
          {/* 3. ADMIN CONTEXT */}
          {/* ======================================= */}
          {state.project === 'Workspace Admin' && (
            <>`;

code = code.replace(adminContextStart, adminContextReplacement);

const adminContextEnd = `<div className="mt-auto"></div>`;

const adminContextEndReplacement = `</>
          )}
          
          <div className="mt-auto"></div>`;

code = code.replace(adminContextEnd, adminContextEndReplacement);

fs.writeFileSync('dashboard/src/components/ui/sidebar.tsx', code);
