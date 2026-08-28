const fs = require('fs');
let content = fs.readFileSync('dashboard/src/components/command-center/index.tsx', 'utf8');

// I need to add useWorkspace to get the active project
content = content.replace(
  "import { toast } from '@/components/ui/toast';",
  "import { toast } from '@/components/ui/toast';\nimport { useWorkspace } from '@/components/ui/workspace-context';"
);

// I need to update the useEffect
const oldEffect = `  // Inject real data into pluginRegistry on mount
  useEffect(() => {
    const token = localStorage.getItem('litetrack_token');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://litetrack-api-916484331446.us-central1.run.app';
    
    if (token) {
      // 1. Fetch Real Sites
      fetch(\`\${apiUrl}/api/sites\`, { headers: { 'Authorization': \`Bearer \${token}\` } })
        .then(res => res.json())
        .then(data => {
          if (data && data.sites) {
            const siteData = data.sites.map((s: any) => ({
              id: s.site_id,
              label: s.domain,
              metadata: \`Site ID: \${s.site_id}\`,
              status: 'active',
              url: '/'
            }));
            pluginRegistry.injectData('Application', siteData);
          }
        })
        .catch(err => console.error("Failed to fetch sites for command palette", err));
    }
  }, []);`;

const newEffect = `  const { state } = useWorkspace();
  
  // Inject real data into pluginRegistry
  useEffect(() => {
    const token = localStorage.getItem('litetrack_token');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://litetrack-api-916484331446.us-central1.run.app';
    
    if (token) {
      // 1. Fetch Real Sites (Applications)
      fetch(\`\${apiUrl}/api/sites\`, { headers: { 'Authorization': \`Bearer \${token}\` } })
        .then(res => res.json())
        .then(data => {
          if (data && data.sites) {
            const siteData = data.sites.map((s: any) => ({
              id: s.site_id,
              label: s.domain,
              metadata: \`Site ID: \${s.site_id}\`,
              status: 'active',
              url: '/'
            }));
            pluginRegistry.injectData('Application', siteData);
          }
        })
        .catch(err => console.error("Failed to fetch sites", err));

      // 2. Fetch Real Users (If a project is selected)
      if (state.project && state.project !== 'Workspace Admin') {
        fetch(\`\${apiUrl}/api/admin/firebase/\${state.project}/firestore/users\`, {
          headers: { 'Authorization': \`Bearer \${token}\` }
        })
          .then(res => res.json())
          .then(resData => {
             if (resData && resData.data) {
                const userData = resData.data.map((u: any) => ({
                  id: u.id,
                  label: u.name || u.email || 'Unknown User',
                  metadata: \`\${u.email || ''} · \${u.role || 'user'}\`,
                  status: 'active',
                  url: \`/data-manager/users\`
                }));
                pluginRegistry.injectData('User', userData);
             }
          })
          .catch(err => console.error("Failed to fetch users", err));
      }
    }
  }, [state.project]);`;

content = content.replace(oldEffect, newEffect);

fs.writeFileSync('dashboard/src/components/command-center/index.tsx', content);
