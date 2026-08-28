const fs = require('fs');

let content = fs.readFileSync('dashboard/src/components/command-center/index.tsx', 'utf8');

const injectionCode = `  const [query, setQuery] = useState('');
  
  // Inject real data into pluginRegistry on mount
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

content = content.replace("  const [query, setQuery] = useState('');", injectionCode);

fs.writeFileSync('dashboard/src/components/command-center/index.tsx', content);
