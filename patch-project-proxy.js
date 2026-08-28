const fs = require('fs');

let content = fs.readFileSync('api/src/project-admin-proxy.ts', 'utf8');

// replace getProjectApp to be async and look up the config from BigQuery
const newGetProjectApp = `import { cert } from 'firebase-admin/app';
import { getSites } from './stats';

// Cache of initialized Firebase Admin apps by projectId
const projectAppCache: Record<string, App> = {};

async function getProjectApp(projectId: string): Promise<App> {
  const cacheKey = projectId;
  
  if (projectAppCache[cacheKey]) {
    return projectAppCache[cacheKey];
  }

  const appName = \`project_admin_\${projectId}\`;
  
  if (getApps().some(a => a.name === appName)) {
    const app = getApp(appName);
    projectAppCache[cacheKey] = app;
    return app;
  }

  // Look up credentials from sites table
  const sites = await getSites();
  const site = sites.find(s => {
    const conf = typeof s.firebase_config === 'string' ? JSON.parse(s.firebase_config) : s.firebase_config;
    return conf && conf.project_id === projectId;
  });

  let credential = applicationDefault();
  if (site && site.firebase_config) {
    const conf = typeof site.firebase_config === 'string' ? JSON.parse(site.firebase_config) : site.firebase_config;
    if (conf.private_key) {
      credential = cert(conf);
    }
  }

  const app = initializeApp({
    credential,
    projectId,
  }, appName);

  projectAppCache[cacheKey] = app;
  return app;
}`;

content = content.replace(/\/\/ Cache of initialized Firebase Admin apps[\s\S]*?return app;\n}/, newGetProjectApp);

// Now change all `getProjectApp(projectId)` calls to `await getProjectApp(projectId)`
content = content.replace(/const app = getProjectApp\(projectId\);/g, 'const app = await getProjectApp(projectId);');

fs.writeFileSync('api/src/project-admin-proxy.ts', content);
