import { initializeApp, getApps, getApp, App, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { getSites } from './stats';

// Cache of initialized Firebase Admin apps by siteId
const appCache: Record<string, App> = {};

/**
 * Initializes or retrieves the Firebase Admin app for a specific site.
 */
export async function getFirebaseAppForSite(siteId: string): Promise<App | null> {
  if (appCache[siteId]) {
    return appCache[siteId];
  }

  // Fetch the site config from BigQuery
  const sites = await getSites();
  const site = sites.find(s => s.site_id === siteId);

  if (!site || !site.firebase_config) {
    return null;
  }

  try {
    const config = typeof site.firebase_config === 'string' 
      ? JSON.parse(site.firebase_config) 
      : site.firebase_config;

    // Use cert if it's a service account key (has private_key)
    const credential = config.private_key ? cert(config) : undefined;
    
    // Create a uniquely named app instance for this site
    const appName = `site_${siteId}`;
    let app: App;
    
    // Check if somehow already initialized in the global registry
    if (getApps().some(a => a.name === appName)) {
      app = getApp(appName);
    } else {
      app = initializeApp({
        credential,
        projectId: config.project_id || config.projectId,
      }, appName);
    }

    appCache[siteId] = app;
    return app;
  } catch (error) {
    console.error(`Failed to initialize Firebase Admin for site ${siteId}:`, error);
    return null;
  }
}

/**
 * Fetches documents from a specific Firestore collection for a site.
 */
/**
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

export async function getSiteCollection(siteId: string, collectionName: string, limit = 50) {
  const app = await getFirebaseAppForSite(siteId);
  if (!app) {
    throw new Error('Firebase configuration not found or invalid for this site');
  }

  const db = getFirestore(app);
  const snapshot = await db.collection(collectionName).limit(limit).get();
  
  const data: any[] = [];
  snapshot.forEach(doc => {
    data.push({ id: doc.id, ...doc.data() });
  });
  
  return data;
}

/**
 * Fetches users from Firebase Auth for a site.
 */
export async function getSiteAuthUsers(siteId: string, maxResults = 50) {
  const app = await getFirebaseAppForSite(siteId);
  if (!app) {
    throw new Error('Firebase configuration not found or invalid for this site');
  }

  const auth = getAuth(app);
  const listUsersResult = await auth.listUsers(maxResults);
  
  return listUsersResult.users.map(user => ({
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    disabled: user.disabled,
    creationTime: user.metadata.creationTime,
    lastSignInTime: user.metadata.lastSignInTime,
    customClaims: user.customClaims
  }));
}

/**
 * Creates a document in a specific Firestore collection for a site.
 */
export async function createSiteDocument(siteId: string, collectionName: string, data: any, docId?: string) {
  const app = await getFirebaseAppForSite(siteId);
  if (!app) {
    throw new Error('Firebase configuration not found or invalid for this site');
  }

  const db = getFirestore(app);
  
  if (data.id) {
    delete data.id; // Prevent saving the id inside the document itself if it's there
  }
  
  // Convert ISO date strings back to Timestamps if needed, or just let them be strings.
  data.createdAt = new Date().toISOString();
  
  if (docId) {
    await db.collection(collectionName).doc(docId).set(data);
    return { id: docId, ...data };
  } else {
    const docRef = await db.collection(collectionName).add(data);
    return { id: docRef.id, ...data };
  }
}

/**
 * Updates a document in a specific Firestore collection for a site.
 */
export async function updateSiteDocument(siteId: string, collectionName: string, docId: string, data: any) {
  const app = await getFirebaseAppForSite(siteId);
  if (!app) {
    throw new Error('Firebase configuration not found or invalid for this site');
  }

  const db = getFirestore(app);
  
  if (data.id) {
    delete data.id;
  }
  
  data.updatedAt = new Date().toISOString();
  
  await db.collection(collectionName).doc(docId).update(data);
  return { id: docId, ...data };
}

/**
 * Deletes a document from a specific Firestore collection for a site.
 */
export async function deleteSiteDocument(siteId: string, collectionName: string, docId: string) {
  const app = await getFirebaseAppForSite(siteId);
  if (!app) {
    throw new Error('Firebase configuration not found or invalid for this site');
  }

  const db = getFirestore(app);
  await db.collection(collectionName).doc(docId).delete();
  return { success: true, id: docId };
}
