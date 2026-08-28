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

import { cert } from 'firebase-admin/app';
import { getSites } from './stats';

// Cache of initialized Firebase Admin apps by projectId
const projectAppCache: Record<string, App> = {};

async function getProjectApp(projectId: string): Promise<App> {
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
}

async function getDb(projectId: string, databaseId?: string) {
  const app = await getProjectApp(projectId);
  return databaseId ? getFirestore(app, databaseId) : getFirestore(app);
}

// ═══════════════════════════════════════════════════════
// CRUD Operations
// ═══════════════════════════════════════════════════════

export async function listCollection(projectId: string, collection: string, databaseId?: string, limit = 100) {
  const db = await getDb(projectId, databaseId);
  const snapshot = await db.collection(collection).limit(limit).get();
  const data: any[] = [];
  snapshot.forEach(doc => {
    data.push({ id: doc.id, ...doc.data() });
  });
  return data;
}

export async function createDocument(projectId: string, collection: string, data: any, databaseId?: string) {
  const db = await getDb(projectId, databaseId);
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
  const db = await getDb(projectId, databaseId);
  const { id, ...cleanData } = data;
  cleanData.updatedAt = new Date().toISOString();
  await db.collection(collection).doc(docId).update(cleanData);
  return { id: docId, ...cleanData };
}

export async function deleteDocument(projectId: string, collection: string, docId: string, databaseId?: string) {
  const db = await getDb(projectId, databaseId);
  await db.collection(collection).doc(docId).delete();
  return { success: true, id: docId };
}

export async function getDocument(projectId: string, collection: string, docId: string, databaseId?: string) {
  const app = await getProjectApp(projectId);
  if (!app) throw new Error('Failed to initialize Firebase app for project: ' + projectId);
  const db = databaseId ? getFirestore(app, databaseId) : getFirestore(app);
  const docRef = db.collection(collection).doc(docId);
  const snap = await docRef.get();
  if (!snap.exists) return null;
  return { id: snap.id, ...snap.data() };
}
