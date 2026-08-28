const fs = require('fs');

let code = fs.readFileSync('dashboard/src/components/ioac/organization-workspace.tsx', 'utf8');

// replace 🏢 with <Building2 className="w-6 h-6 text-[#2266ec]" />
code = code.replace('🏢', '<Building2 className="w-6 h-6 text-[#2266ec]" />');

// replace workspaces state
const oldWorkspaces = `const [workspaces, setWorkspaces] = useState<Workspace[]>([
    { id: 'ws_analytics', name: 'Analytics Suite', category: 'Analytics', icon: '📊', allowedRoles: ['Admin', 'Analyst'] },
    { id: 'ws_admin', name: 'Admin OS Console', category: 'Admin', icon: '⚡', allowedRoles: ['Super Admin', 'Admin'] },
    { id: 'ws_dev', name: 'Developer Hub', category: 'Developer', icon: '💻', allowedRoles: ['Developer', 'Engineer'] },
    { id: 'ws_support', name: 'Support & Tickets', category: 'Support', icon: '🎧', allowedRoles: ['Support Lead', 'Agent'] },
    { id: 'ws_finance', name: 'Finance & Revenue', category: 'Finance', icon: '💰', allowedRoles: ['Finance Manager', 'CFO'] },
  ]);`;

const newWorkspaces = `const [workspaces, setWorkspaces] = useState<Workspace[]>([
    { id: 'ws_analytics', name: 'Analytics Suite', category: 'Analytics', icon: <Layout className="w-4 h-4" />, allowedRoles: ['Admin', 'Analyst'] },
    { id: 'ws_admin', name: 'Admin OS Console', category: 'Admin', icon: <Building2 className="w-4 h-4" />, allowedRoles: ['Super Admin', 'Admin'] },
    { id: 'ws_dev', name: 'Developer Hub', category: 'Developer', icon: <Layout className="w-4 h-4" />, allowedRoles: ['Developer', 'Engineer'] },
    { id: 'ws_support', name: 'Support & Tickets', category: 'Support', icon: <Users2 className="w-4 h-4" />, allowedRoles: ['Support Lead', 'Agent'] },
    { id: 'ws_finance', name: 'Finance & Revenue', category: 'Finance', icon: <DollarSign className="w-4 h-4" />, allowedRoles: ['Finance Manager', 'CFO'] },
  ]);`;

code = code.replace(oldWorkspaces, newWorkspaces);

// find how icon is rendered
const oldIconRender = `<div className="text-2xl mb-3">{ws.icon}</div>`;
const newIconRender = `<div className="mb-3 text-[#2266ec]">{ws.icon}</div>`;
code = code.replace(oldIconRender, newIconRender);

fs.writeFileSync('dashboard/src/components/ioac/organization-workspace.tsx', code);
