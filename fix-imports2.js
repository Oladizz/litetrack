const fs = require('fs');

const files = [
  'dashboard/src/components/enterprise-control/ai-command-governance.tsx',
  'dashboard/src/components/enterprise-control/cost-organizations.tsx',
  'dashboard/src/components/enterprise-control/digital-twin.tsx',
  'dashboard/src/components/enterprise-control/ecosystem-overview.tsx',
  'dashboard/src/components/enterprise-control/executive-briefing.tsx',
  'dashboard/src/components/enterprise-control/security-disaster.tsx',
  'dashboard/src/components/workspace-engine/active-canvas.tsx'
];

for (const path of files) {
  let code = fs.readFileSync(path, 'utf8');
  if (!code.includes("import { IconRenderer }")) {
    code = `import { IconRenderer } from '@/components/ui/IconRenderer';\n` + code;
    fs.writeFileSync(path, code);
  }
}
