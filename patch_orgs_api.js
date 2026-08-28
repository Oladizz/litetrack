const fs = require('fs');
let code = fs.readFileSync('dashboard/src/components/ioac/organization-workspace.tsx', 'utf8');

code = code.replace("import React, { useState } from 'react';", "import React, { useState, useEffect } from 'react';");

const stateBlock = `const [org, setOrg] = useState<Organization>({
    id: 'org_oladizz',
    name: 'OLADIZZ ENTERPRISE',
    timezone: 'UTC+1 (Lagos / West Africa)',
    currency: 'USD ($)',
    invitePolicy: 'open'
  });`;

const apiBlock = `const [org, setOrg] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('litetrack_token');
        const headers = { Authorization: \`Bearer \${token}\` };
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://litetrack-api-916484331446.us-central1.run.app';
        
        const res = await fetch(\`\${apiUrl}/api/ioac/orgs\`, { headers });
        const data = await res.json();
        
        if (data.orgs && data.orgs.length > 0) {
          const row = data.orgs[0];
          setOrg({
            id: row.id,
            name: row.name,
            timezone: 'UTC+1 (Lagos / West Africa)', // Mocked details
            currency: 'USD ($)',
            invitePolicy: 'open'
          });
        } else {
          // Empty state
          setOrg({
            id: 'org_pending',
            name: 'No Organization Found',
            timezone: 'UTC',
            currency: 'USD',
            invitePolicy: 'open'
          });
        }
      } catch(e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);`;

code = code.replace(stateBlock, apiBlock);

const createBtnStart = `<button className="bg-[#262626] text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-[#333] transition-colors">
            Edit Profile
          </button>`;
          
const createBtnReplace = `<div className="flex gap-2">
            <button onClick={() => {
                const name = prompt("Enter Org Name");
                if (!name) return;
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://litetrack-api-916484331446.us-central1.run.app';
                const token = localStorage.getItem('litetrack_token');
                
                fetch(\`\${apiUrl}/api/ioac/orgs\`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json', 'Authorization': \`Bearer \${token}\` },
                  body: JSON.stringify({ id: 'org_' + Math.floor(Math.random() * 1000), name, tier: 'Enterprise', domain: name.toLowerCase().replace(/\\s+/g, '') + '.com' })
                }).then(() => {
                  toast('Organization Created. Please refresh.', { type: 'success' });
                });
              }}
              className="bg-[#2266ec] text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-[#1a55c2] transition-colors"
            >
              + Create Org
            </button>
            <button className="bg-[#262626] text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-[#333] transition-colors">
              Edit Profile
            </button>
          </div>`;

code = code.replace(createBtnStart, createBtnReplace);

// handle null org
code = code.replace(`return (`, `if (loading) return <div className="text-white text-xs p-4">Loading Org Data...</div>;
  if (!org) return <div className="text-white text-xs p-4">No org data.</div>;
  
  return (`);

fs.writeFileSync('dashboard/src/components/ioac/organization-workspace.tsx', code);
