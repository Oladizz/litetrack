const fs = require('fs');

let content = fs.readFileSync('api/src/project-admin-proxy.ts', 'utf8');

// Change getDb to async
content = content.replace('function getDb(projectId: string, databaseId?: string) {', 'async function getDb(projectId: string, databaseId?: string) {');
// Change calls to getDb
content = content.replace(/const db = getDb\(/g, 'const db = await getDb(');

fs.writeFileSync('api/src/project-admin-proxy.ts', content);
