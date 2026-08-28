const fs = require('fs');
let code = fs.readFileSync('dashboard/src/components/project-admin/admin-components.tsx', 'utf8');
code = code.replace(
  "import { Loader2, Plus, Pencil, Trash2, X, Check, Search } from 'lucide-react';",
  "import * as LucideIcons from 'lucide-react';\nimport { Loader2, Plus, Pencil, Trash2, X, Check, Search } from 'lucide-react';"
);

code = code.replace(
  '<span className="mr-2 opacity-80">{section.icon}</span>',
  `{(() => {\n            const Icon = (LucideIcons as any)[section.icon] || LucideIcons.Circle;\n            return <Icon className="w-5 h-5 mr-2 opacity-80" />;\n          })()}`
);

fs.writeFileSync('dashboard/src/components/project-admin/admin-components.tsx', code);
