import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { cors } from 'hono/cors';
import { initializeApp, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getStats, getCustomQuery, getLiveVisitors, getActivityStream, getSites, addSite, deleteSite, updateSiteTemplate, updateSiteFeatures, updateSiteFirebaseConfig } from './stats';

// Initialize Firebase Admin (requires GOOGLE_APPLICATION_CREDENTIALS or initialized with service account)
if (!getApps().length) {
  initializeApp();
}

const app = new Hono<{ Variables: { user: any } }>();

app.use('*', cors());

import { sendDailySummary, sendHourlySummary } from './telegram';

app.get('/api/cron/telegram/daily', async (c) => {
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!chatId) return c.json({ error: 'TELEGRAM_CHAT_ID not configured' }, 500);
  await sendDailySummary(chatId);
  return c.json({ success: true });
});

app.get('/api/cron/telegram/hourly', async (c) => {
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!chatId) return c.json({ error: 'TELEGRAM_CHAT_ID not configured' }, 500);
  await sendHourlySummary(chatId);
  return c.json({ success: true });
});

// Middleware to verify Firebase Auth Token
app.use('/api/*', async (c, next) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  
  const token = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await getAuth().verifyIdToken(token);
    c.set('user', decodedToken);
    await next();
  } catch (error) {
    console.error('Firebase Auth Error:', error);
    return c.json({ error: 'Unauthorized' }, 401);
  }
});

app.get('/api/sites', async (c) => {
  try {
    const sites = await getSites();
    return c.json({ sites });
  } catch (error) {
    return c.json({ error: 'Failed to fetch sites' }, 500);
  }
});

app.post('/api/sites', async (c) => {
  try {
    const { name, domain, template, features } = await c.req.json();
    const site_id = crypto.randomUUID();
    await addSite(site_id, name, domain, template || 'saas', features || ['pageviews', 'events', 'ecommerce', 'user_journey', 'tech_specs', 'performance', 'privacy']);
    return c.json({ site_id, message: 'Site added successfully' });
  } catch (error) {
    return c.json({ error: 'Failed to add site' }, 500);
  }
});

app.put('/api/sites/:id/template', async (c) => {
  try {
    const { template } = await c.req.json();
    await updateSiteTemplate(c.req.param('id'), template);
    return c.json({ message: 'Template updated' });
  } catch (error) {
    return c.json({ error: 'Failed to update template' }, 500);
  }
});

app.put('/api/sites/:id/features', async (c) => {
  try {
    const { features } = await c.req.json();
    await updateSiteFeatures(c.req.param('id'), features);
    return c.json({ message: 'Features updated' });
  } catch (error) {
    return c.json({ error: 'Failed to update features' }, 500);
  }
});

app.put('/api/sites/:id/firebase', async (c) => {
  try {
    const { firebase_config } = await c.req.json();
    await updateSiteFirebaseConfig(c.req.param('id'), firebase_config);
    return c.json({ message: 'Firebase configuration saved successfully' });
  } catch (error) {
    return c.json({ error: 'Failed to update Firebase configuration' }, 500);
  }
});

app.delete('/api/sites/:id', async (c) => {
  try {
    await deleteSite(c.req.param('id'));
    return c.json({ message: 'Site deleted' });
  } catch (error) {
    return c.json({ error: 'Failed to delete site' }, 500);
  }
});

app.get('/api/stats/:siteId/live', async (c) => {
  try {
    const siteId = c.req.param('siteId');
    const live = await getLiveVisitors(siteId);
    return c.json({ live_visitors: live });
  } catch (error) {
    return c.json({ error: 'Failed to fetch live stats' }, 500);
  }
});

app.get('/api/stats/:siteId/activity', async (c) => {
  try {
    const siteId = c.req.param('siteId');
    const activity = await getActivityStream(siteId);
    return c.json({ activity });
  } catch (error) {
    return c.json({ error: 'Failed to fetch activity stream' }, 500);
  }
});
app.get('/api/stats/:siteId/custom', async (c) => {
  try {
    const siteId = c.req.param('siteId');
    const metric = c.req.query('metric') || 'pageviews';
    const dimension = c.req.query('dimension') || 'date';
    const periodDays = parseInt(c.req.query('days') || '30');
    const data = await getCustomQuery(siteId, metric, dimension, periodDays);
    return c.json({ data });
  } catch (error) {
    return c.json({ error: 'Failed to fetch custom query' }, 500);
  }
});

app.get('/api/stats/:siteId/custom', async (c) => {
  try {
    const siteId = c.req.param('siteId');
    const metric = c.req.query('metric') || 'pageviews';
    const dimension = c.req.query('dimension') || 'date';
    const periodDays = parseInt(c.req.query('days') || '30');
    const data = await getCustomQuery(siteId, metric, dimension, periodDays);
    return c.json({ data });
  } catch (error) {
    return c.json({ error: 'Failed to fetch custom query' }, 500);
  }
});

app.get('/api/stats/:siteId', async (c) => {
  try {
    const siteId = c.req.param('siteId');
    const query = c.req.query();
    const period = query.period || '30d';
    const filters = { ...query };
    delete (filters as any).period;
    
    const stats = await getStats(siteId, period, filters);
    return c.json(stats);
  } catch (error) {
    console.error(error);
    return c.json({ error: 'Failed to fetch stats' }, 500);
  }
});

import { askAi } from './ai';

app.post('/api/stats/:siteId/ai', async (c) => {
  try {
    const siteId = c.req.param('siteId');
    const { question, period, filters } = await c.req.json();
    
    if (!question) {
      return c.json({ error: 'Question is required' }, 400);
    }
    
    const stats = await getStats(siteId, period || '30d', filters || {});
    const answer = await askAi(stats, question);
    
    return c.json({ answer });
  } catch (error) {
    console.error('AI Route Error:', error);
    return c.json({ error: 'Failed to answer question' }, 500);
  }
});


app.get('/tracker.js', async (c) => {
  const fs = require('fs');
  const path = require('path');
  try {
    const trackerPath = path.join(__dirname, '../public/tracker.js');
    const trackerCode = fs.readFileSync(trackerPath, 'utf8');
    return c.text(trackerCode, 200, {
      'Content-Type': 'application/javascript',
      'Cache-Control': 'public, max-age=3600'
    });
  } catch (e) {
    return c.text('Not found', 404);
  }
});

const port = process.env.PORT ? parseInt(process.env.PORT) : 8080;
console.log(`API running on port ${port}`);

serve({
  fetch: app.fetch,
  port
});

app.get('/api/users/:siteId', async (c) => {
  try {
    const siteId = c.req.param('siteId');
    const period = c.req.query('period') || '7d';
    const filters = c.req.query();
    delete filters.period;
    
    const { getUsers } = require('./stats');
    const data = await getUsers(siteId, period, filters);
    return c.json(data);
  } catch (error) {
    return c.json({ error: 'Failed to fetch users' }, 500);
  }
});

app.get('/api/finances/:siteId', async (c) => {
  try {
    const siteId = c.req.param('siteId');
    const period = c.req.query('period') || '7d';
    const filters = c.req.query();
    delete filters.period;
    
    const { getFinances } = require('./stats');
    const data = await getFinances(siteId, period, filters);
    return c.json(data);
  } catch (error) {
    return c.json({ error: 'Failed to fetch finances' }, 500);
  }
});

// --- Firebase Admin Proxy Routes for Admin OS ---
import { getSiteCollection, getSiteAuthUsers, createSiteDocument, updateSiteDocument, deleteSiteDocument } from './firebase-proxy';

app.get('/api/admin/firebase/:siteId/auth', async (c) => {
  try {
    const siteId = c.req.param('siteId');
    const users = await getSiteAuthUsers(siteId);
    return c.json({ users });
  } catch (error: any) {
    console.error(`Error fetching Firebase Auth for site ${c.req.param('siteId')}:`, error);
    return c.json({ error: error.message || 'Failed to fetch Firebase Auth users' }, 500);
  }
});

app.get('/api/admin/firebase/:siteId/firestore/:collection', async (c) => {
  try {
    const siteId = c.req.param('siteId');
    const collection = c.req.param('collection');
    const limit = c.req.query('limit') ? parseInt(c.req.query('limit')!) : 50;
    
    const data = await getSiteCollection(siteId, collection, limit);
    return c.json({ data });
  } catch (error: any) {
    console.error(`Error fetching Firestore ${c.req.param('collection')} for site ${c.req.param('siteId')}:`, error);
    return c.json({ error: error.message || 'Failed to fetch Firestore collection' }, 500);
  }
});

app.post('/api/admin/firebase/:siteId/firestore/:collection', async (c) => {
  try {
    const siteId = c.req.param('siteId');
    const collection = c.req.param('collection');
    const body = await c.req.json();
    const docId = body.id; // optional document ID
    
    const result = await createSiteDocument(siteId, collection, body, docId);
    return c.json(result);
  } catch (error: any) {
    console.error(`Error creating Firestore doc in ${c.req.param('collection')} for site ${c.req.param('siteId')}:`, error);
    return c.json({ error: error.message || 'Failed to create document' }, 500);
  }
});

app.put('/api/admin/firebase/:siteId/firestore/:collection/:docId', async (c) => {
  try {
    const siteId = c.req.param('siteId');
    const collection = c.req.param('collection');
    const docId = c.req.param('docId');
    const body = await c.req.json();
    
    const result = await updateSiteDocument(siteId, collection, docId, body);
    return c.json(result);
  } catch (error: any) {
    console.error(`Error updating Firestore doc ${c.req.param('docId')} in ${c.req.param('collection')} for site ${c.req.param('siteId')}:`, error);
    return c.json({ error: error.message || 'Failed to update document' }, 500);
  }
});

app.delete('/api/admin/firebase/:siteId/firestore/:collection/:docId', async (c) => {
  try {
    const siteId = c.req.param('siteId');
    const collection = c.req.param('collection');
    const docId = c.req.param('docId');
    
    const result = await deleteSiteDocument(siteId, collection, docId);
    return c.json(result);
  } catch (error: any) {
    console.error(`Error deleting Firestore doc ${c.req.param('docId')} in ${c.req.param('collection')} for site ${c.req.param('siteId')}:`, error);
    return c.json({ error: error.message || 'Failed to delete document' }, 500);
  }
});
