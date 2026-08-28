const fs = require('fs');
let code = fs.readFileSync('dashboard/src/components/ioac/identity-manager.tsx', 'utf8');

const tabsStart = `{/* Identity Type Tabs */}`;
const replaceStart = `<div className="flex justify-between items-center border-b border-[#262626] pb-3">
        {/* Identity Type Tabs */}`;

code = code.replace(tabsStart, replaceStart);

const tabsEnd = `        })}
      </div>`;
const replaceEnd = `        })}
        </div>
        <button 
          onClick={() => {
            const name = prompt("Enter Name");
            if (!name) return;
            const email = prompt("Enter Email");
            
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://litetrack-api-916484331446.us-central1.run.app';
            const token = localStorage.getItem('litetrack_token');
            
            fetch(\`\${apiUrl}/api/ioac/identities\`, {
              method: 'POST',
              headers: { 
                'Content-Type': 'application/json',
                'Authorization': \`Bearer \${token}\`
              },
              body: JSON.stringify({
                id: 'usr_' + Math.floor(Math.random() * 10000),
                name,
                email,
                type: 'user',
                roleId: 'r_standard',
                status: 'active',
                riskScore: 0,
                mfaEnabled: false
              })
            }).then(() => {
              toast({ title: 'Identity Created', description: 'Please refresh to see the new identity.' });
            });
          }}
          className="bg-[#2266ec] text-white px-3 py-1.5 rounded text-xs font-semibold"
        >
          + Add Identity
        </button>
      </div>`;

code = code.replace(tabsEnd, replaceEnd);
fs.writeFileSync('dashboard/src/components/ioac/identity-manager.tsx', code);
