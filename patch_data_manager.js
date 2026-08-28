const fs = require('fs');
let content = fs.readFileSync('dashboard/src/app/(dashboard)/data-manager/[entityType]/page.tsx', 'utf8');

// Update signature
content = content.replace(
  "export default function DynamicDataManagerPage({ params }: { params: { entityType: string } }) {",
  "export default function DynamicDataManagerPage({ params }: { params: Promise<{ entityType: string }> }) {"
);

// Unwrap params
content = content.replace(
  "const pageId = params.entityType;",
  "const { entityType } = React.use(params);\n  const pageId = entityType;"
);

fs.writeFileSync('dashboard/src/app/(dashboard)/data-manager/[entityType]/page.tsx', content);
