const fs = require('fs');

let content = fs.readFileSync('api/src/firebase-proxy.ts', 'utf8');

const newFunction = `/**
 * Lists all Firestore collections for a site.
 */
export async function listSiteCollections(siteId: string) {
  const app = await getFirebaseAppForSite(siteId);
  if (!app) {
    throw new Error('Firebase configuration not found or invalid for this site');
  }

  const db = getFirestore(app);
  const collections = await db.listCollections();
  
  return collections.map(c => c.id);
}

export async function getSiteCollection`;

content = content.replace("export async function getSiteCollection", newFunction);
fs.writeFileSync('api/src/firebase-proxy.ts', content);
