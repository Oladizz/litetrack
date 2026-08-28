const fs = require('fs');
let code = fs.readFileSync('api/src/project-admin-proxy.ts', 'utf8');
code = code.replace(
  "const db = getFirestore(app);",
  "const db = databaseId ? getFirestore(app, databaseId) : getFirestore(app);"
);
fs.writeFileSync('api/src/project-admin-proxy.ts', code);
