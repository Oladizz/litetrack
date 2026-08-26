/**
 * GENERIC PROJECT ADMIN PROXY
 * 
 * Unlike firebase-proxy.ts which connects to a site's Firebase via stored config,
 * this module connects DIRECTLY to any Firebase project using the service account
 * that the Cloud Run instance runs under (or a stored service account key).
 * 
 * It supports specifying a custom databaseId for projects that use named Firestore databases.
 */

import { initializeApp, getApps, getApp, App, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Cache of initialized Firebase Admin apps by projectId+databaseId
const projectAppCache: Record<string, App> = {};

function getProjectApp(projectId: string): App {
  const cacheKey = projectId;
  
  if (projectAppCache[cacheKey]) {
    return projectAppCache[cacheKey];
  }

  const appName = `project_admin_${projectId}`;
  
  if (getApps().some(a => a.name === appName)) {
    const app = getApp(appName);
    projectAppCache[cacheKey] = app;
    return app;
  }

  const app = initializeApp({
    credential: applicationDefault(),
    projectId,
  }, appName);

  projectAppCache[cacheKey] = app;
  return app;
}

function getDb(projectId: string, databaseId?: string) {
  const app = getProjectApp(projectId);
  return databaseId ? getFirestore(app, databaseId) : getFirestore(app);
}

// ═══════════════════════════════════════════════════════
// CRUD Operations
// ═══════════════════════════════════════════════════════

export async function listCollection(projectId: string, collection: string, databaseId?: string, limit = 100) {
  const db = getDb(projectId, databaseId);
  const snapshot = await db.collection(collection).limit(limit).get();
  const data: any[] = [];
  snapshot.forEach(doc => {
    data.push({ id: doc.id, ...doc.data() });
  });
  return data;
}

export async function createDocument(projectId: string, collection: string, data: any, databaseId?: string) {
  const db = getDb(projectId, databaseId);
  const { id, ...cleanData } = data;
  cleanData.createdAt = new Date().toISOString();
  
  if (id) {
    await db.collection(collection).doc(id).set(cleanData);
    return { id, ...cleanData };
  } else {
    const docRef = await db.collection(collection).add(cleanData);
    return { id: docRef.id, ...cleanData };
  }
}

export async function updateDocument(projectId: string, collection: string, docId: string, data: any, databaseId?: string) {
  const db = getDb(projectId, databaseId);
  const { id, ...cleanData } = data;
  cleanData.updatedAt = new Date().toISOString();
  await db.collection(collection).doc(docId).update(cleanData);
  return { id: docId, ...cleanData };
}

export async function deleteDocument(projectId: string, collection: string, docId: string, databaseId?: string) {
  const db = getDb(projectId, databaseId);
  await db.collection(collection).doc(docId).delete();
  return { success: true, id: docId };
}
