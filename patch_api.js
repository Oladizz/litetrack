const fs = require('fs');
let content = fs.readFileSync('api/src/index.ts', 'utf8');

content = content.replace(
  "import { getSiteCollection, getSiteAuthUsers, createSiteDocument, updateSiteDocument, deleteSiteDocument } from './firebase-proxy';",
  "import { listSiteCollections, getSiteCollection, getSiteAuthUsers, createSiteDocument, updateSiteDocument, deleteSiteDocument } from './firebase-proxy';"
);

const newRoute = `app.get('/api/admin/firebase/:siteId/collections', async (c) => {
  try {
    const siteId = c.req.param('siteId');
    const collections = await listSiteCollections(siteId);
    return c.json({ collections });
  } catch (error: any) {
    console.error(\`Error listing collections for site \${c.req.param('siteId')}:\`, error);
    return c.json({ error: error.message || 'Failed to list collections' }, 500);
  }
});

app.get('/api/admin/firebase/:siteId/firestore/:collection',`;

content = content.replace("app.get('/api/admin/firebase/:siteId/firestore/:collection',", newRoute);

fs.writeFileSync('api/src/index.ts', content);
