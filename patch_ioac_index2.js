const fs = require('fs');
let code = fs.readFileSync('dashboard/src/components/ioac/index.tsx', 'utf8');

code = code.replace("import React, { useState } from 'react';", "import React, { useState, useEffect } from 'react';");

const oldIdentities = `const [identities, setIdentities] = useState<IdentityRecord[]>([
    {
      id: 'usr_9481',
      name: 'John Doe',
      email: 'john.doe@gmail.com',
      type: 'admin',
      roleId: 'r_ceo',
      roleName: 'CEO / Executive',
      status: 'active',
      riskScore: 12,
      mfaEnabled: true,
      created: 'Yesterday',
      sessions: [
        { id: 's1', device: 'Chrome on Windows 11', ipLocation: 'Lagos, Nigeria', lastActive: '2 mins ago', isCurrent: true },
        { id: 's2', device: 'Safari on iPhone 15', ipLocation: 'Lagos, Nigeria', lastActive: '2 days ago', isCurrent: false }
      ]
    },
    {
      id: 'usr_8392',
      name: 'Sarah Connor',
      email: 'sarah@cyberdyne.com',
      type: 'user',
      roleId: 'r_tech',
      roleName: 'Repair Technician',
      status: 'pending',
      riskScore: 78,
      mfaEnabled: false,
      created: '3 days ago',
      sessions: [
        { id: 's3', device: 'Firefox on macOS', ipLocation: 'London, UK', lastActive: '1 hour ago', isCurrent: false }
      ]
    },
    {
      id: 'usr_6104',
      name: 'Rabiu Oladizz',
      email: 'oladizz.dev@gmail.com',
      type: 'admin',
      roleId: 'r_ceo',
      roleName: 'Super Admin',
      status: 'active',
      riskScore: 5,
      mfaEnabled: true,
      created: 'Just now',
      sessions: [
        { id: 's4', device: 'Chrome on Linux', ipLocation: 'Lagos, Nigeria', lastActive: 'Just now', isCurrent: true }
      ]
    }
  ]);`;

const newIdentities = `const [identities, setIdentities] = useState<IdentityRecord[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('litetrack_token');
        const headers = { Authorization: \`Bearer \${token}\` };
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://litetrack-api-916484331446.us-central1.run.app';
        
        const res = await fetch(\`\${apiUrl}/api/ioac/identities\`, { headers });
        const data = await res.json();
        
        if (data.identities) {
          // Map DB schema to frontend IdentityRecord shape
          const mapped = data.identities.map((row: any) => ({
            id: row.id,
            name: row.name,
            email: row.email,
            type: row.type || 'user',
            roleId: row.roleId || '',
            roleName: row.roleId || 'Standard',
            status: row.status || 'active',
            riskScore: row.riskScore || 0,
            mfaEnabled: !!row.mfaEnabled,
            created: row.created_at ? new Date(row.created_at.value).toLocaleDateString() : 'Unknown',
            sessions: []
          }));
          setIdentities(mapped);
        }
      } catch (e) {
        console.error("Failed to load identities", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);`;

code = code.replace(oldIdentities, newIdentities);
fs.writeFileSync('dashboard/src/components/ioac/index.tsx', code);
