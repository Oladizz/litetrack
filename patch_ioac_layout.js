const fs = require('fs');
let code = fs.readFileSync('dashboard/src/components/ioac/index.tsx', 'utf8');

const tabsStart = `const [activeTab, setActiveTab] = useState<'identities' | 'org_workspaces' | 'roles' | 'policies' | 'simulator'>('identities');`;
const newTabsState = `const [activeTab, setActiveTab] = useState<string>('identities');`;

code = code.replace(tabsStart, newTabsState);

const oldTabsUI = `<div className="flex items-center gap-1.5 border-b border-[#262626] pb-3 overflow-x-auto hide-scrollbar text-xs font-semibold">
        {[
          { id: 'identities', label: '1. Identity Directory & Sessions', icon: Users },
          { id: 'org_workspaces', label: '2. Orgs, Workspaces & Teams', icon: Building2 },
          { id: 'roles', label: '3. Dynamic Roles & Field Masking', icon: Shield },
          { id: 'policies', label: '4. IF-THEN Policy Engine', icon: Sliders },
          { id: 'simulator', label: '5. Live Permission Simulator', icon: Eye },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={\`px-4 py-2 rounded-xl border transition-all shrink-0 flex items-center gap-2 \${
                isActive
                  ? 'bg-[#2266ec] border-[#2266ec] text-white shadow-lg shadow-[#2266ec]/20'
                  : 'bg-[#1a1a1a] border-[#262626] text-[#a6a6a6] hover:text-white hover:bg-[#262626]'
              }\`}
            >
              <Icon className="w-4 h-4" /> {tab.label}
            </button>
          );
        })}
      </div>`;

const newTabsUI = `<div className="flex items-center gap-1.5 border-b border-[#262626] pb-3 overflow-x-auto hide-scrollbar text-[11px] font-semibold">
        {[
          { id: 'identities', label: '1. Identity & People', icon: Users },
          { id: 'org_workspaces', label: '2. Orgs & Workspaces', icon: Building2 },
          { id: 'roles', label: '3. Roles Engine', icon: Shield },
          { id: 'matrix', label: '4. Permission Matrix', icon: Shield },
          { id: 'policies', label: '5. Conditional Access', icon: Sliders },
          { id: 'agents', label: '6. AI Agent Permissions', icon: Bot },
          { id: 'auth', label: '7. Auth & Security', icon: Key },
          { id: 'temporary', label: '8. Temporary Access', icon: Activity },
          { id: 'explorer', label: '9. Access Explorer', icon: Eye },
          { id: 'audit', label: '10. Audit & History', icon: Users },
          { id: 'risk', label: '11. Risk Intelligence', icon: Shield },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={\`px-3 py-1.5 rounded-lg border transition-all shrink-0 flex items-center gap-1.5 \${
                isActive
                  ? 'bg-[#2266ec] border-[#2266ec] text-white shadow-lg shadow-[#2266ec]/20'
                  : 'bg-[#1a1a1a] border-[#262626] text-[#a6a6a6] hover:text-white hover:bg-[#262626]'
              }\`}
            >
              <Icon className="w-3.5 h-3.5" /> {tab.label}
            </button>
          );
        })}
      </div>`;

code = code.replace(oldTabsUI, newTabsUI);

// Need to update lucide-react imports if missing
if (!code.includes('Activity')) {
  code = code.replace(/import \{([^}]+)\} from 'lucide-react';/, "import { $1, Activity, Key, Bot } from 'lucide-react';");
}

fs.writeFileSync('dashboard/src/components/ioac/index.tsx', code);
