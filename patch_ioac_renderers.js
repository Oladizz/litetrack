const fs = require('fs');
let code = fs.readFileSync('dashboard/src/components/ioac/index.tsx', 'utf8');

const oldRenderers = `{activeTab === 'identities' && (
        <IOACIdentityManager
          identities={identities}
          onImpersonate={handleImpersonate}
          onTerminateSession={handleTerminateSession}
        />
      )}

      {activeTab === 'org_workspaces' && <IOACOrganizationWorkspace />}

      {activeTab === 'roles' && <IOACRolePermissionMatrix />}

      {activeTab === 'policies' && <IOACPolicyEngine />}

      {activeTab === 'simulator' && <IOACPermissionSimulator roles={roles} />}`;

const newRenderers = `{activeTab === 'identities' && (
        <IOACIdentityManager
          identities={identities}
          onImpersonate={handleImpersonate}
          onTerminateSession={handleTerminateSession}
        />
      )}

      {activeTab === 'org_workspaces' && <IOACOrganizationWorkspace />}

      {activeTab === 'roles' && (
        <div className="p-8 text-center bg-[#1a1a1a] rounded-xl border border-[#262626]">
          <Shield className="w-8 h-8 text-[#a6a6a6] mx-auto mb-3" />
          <h3 className="text-white font-bold mb-1">Roles Engine</h3>
          <p className="text-sm text-[#a6a6a6]">Create reusable roles such as Super Admin, Manager, and Viewer. (Coming soon)</p>
        </div>
      )}
      
      {activeTab === 'matrix' && <IOACRolePermissionMatrix />}

      {activeTab === 'policies' && <IOACPolicyEngine />}
      
      {activeTab === 'agents' && (
        <div className="p-8 text-center bg-[#1a1a1a] rounded-xl border border-[#262626]">
          <Bot className="w-8 h-8 text-[#a6a6a6] mx-auto mb-3" />
          <h3 className="text-white font-bold mb-1">AI Agent Permissions</h3>
          <p className="text-sm text-[#a6a6a6]">Control what data AI agents can read and what actions they can perform. (Coming soon)</p>
        </div>
      )}
      
      {activeTab === 'auth' && (
        <div className="p-8 text-center bg-[#1a1a1a] rounded-xl border border-[#262626]">
          <Key className="w-8 h-8 text-[#a6a6a6] mx-auto mb-3" />
          <h3 className="text-white font-bold mb-1">Authentication & Security</h3>
          <p className="text-sm text-[#a6a6a6]">Manage password policies, SSO, MFA, and API keys. (Coming soon)</p>
        </div>
      )}
      
      {activeTab === 'temporary' && (
        <div className="p-8 text-center bg-[#1a1a1a] rounded-xl border border-[#262626]">
          <Activity className="w-8 h-8 text-[#a6a6a6] mx-auto mb-3" />
          <h3 className="text-white font-bold mb-1">Temporary Access</h3>
          <p className="text-sm text-[#a6a6a6]">Grant access that automatically expires after a set duration. (Coming soon)</p>
        </div>
      )}
      
      {activeTab === 'explorer' && (
        <div className="p-8 text-center bg-[#1a1a1a] rounded-xl border border-[#262626]">
          <Eye className="w-8 h-8 text-[#a6a6a6] mx-auto mb-3" />
          <h3 className="text-white font-bold mb-1">Access Explorer</h3>
          <p className="text-sm text-[#a6a6a6]">Ask "What can this person access?" and see their effective permissions. (Coming soon)</p>
        </div>
      )}
      
      {activeTab === 'audit' && (
        <div className="p-8 text-center bg-[#1a1a1a] rounded-xl border border-[#262626]">
          <Users className="w-8 h-8 text-[#a6a6a6] mx-auto mb-3" />
          <h3 className="text-white font-bold mb-1">Access Audit & History</h3>
          <p className="text-sm text-[#a6a6a6]">Track all permission changes, assignments, and sensitive actions. (Coming soon)</p>
        </div>
      )}
      
      {activeTab === 'risk' && (
        <div className="p-8 text-center bg-[#1a1a1a] rounded-xl border border-[#262626]">
          <Shield className="w-8 h-8 text-[#a6a6a6] mx-auto mb-3" />
          <h3 className="text-white font-bold mb-1">Access Risk & Intelligence</h3>
          <p className="text-sm text-[#a6a6a6]">AI security monitors for excessive permissions and dangerous patterns. (Coming soon)</p>
        </div>
      )}

      {activeTab === 'simulator' && <IOACPermissionSimulator roles={roles} />}`;

code = code.replace(oldRenderers, newRenderers);
fs.writeFileSync('dashboard/src/components/ioac/index.tsx', code);
