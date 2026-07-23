import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { parseUserAgent, extractUtmParams, hashVisitorId, parseReferrerSource } from './utils';

const app = new Hono<{
  Bindings: {
    GCP_PROJECT_ID: string;
    PUBSUB_TOPIC: string;
    API_KEY: string; // Service Account Key JSON string
    STORAGE_MODE: string; // 'pubsub' or 'local'
  }
}>();

app.use('*', cors());

app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve the tracker script
app.get('/tracker.js', async (c) => {
  // In a real scenario, you'd serve the actual static file.
  // For the worker, we can just return a simple redirect or inline the script if needed.
  // Assuming the tracker.js is served via CF Pages or fetched from a URL
  // Here we just mock a 200 response to satisfy the routing, 
  // or fetch from an R2 bucket.
  return c.text('// Tracker script would be served here', 200, {
    'Content-Type': 'application/javascript',
    'Cache-Control': 'public, max-age=3600'
  });
});

app.post('/api/event', async (c) => {
  try {
    const body = await c.req.json();
    const headers = c.req.header();
    
    const ip = headers['cf-connecting-ip'] || headers['x-forwarded-for'] || 'unknown';
    const userAgent = headers['user-agent'] || '';
    const country = headers['cf-ipcountry'] || 'unknown';
    const city = headers['cf-ipcity'] || 'unknown';
    const region = headers['cf-region'] || 'unknown';

    // Parse UA
    const { browser, os, device } = parseUserAgent(userAgent);

    // Extract UTM
    const url = body.url || '';
    const utm = extractUtmParams(url);

    // Parse Referrer
    const referrer = body.referrer || '';
    const referrerSource = parseReferrerSource(referrer);

    // Create a daily unique visitor hash
    const dateStr = new Date().toISOString().split('T')[0];
    const visitorId = hashVisitorId(ip, userAgent, dateStr);
    
    // Session ID could be derived similarly but with a shorter time window,
    // or passed from the client if using sessionStorage. 
    // For simplicity, we just use visitorId as session proxy or generate a basic one.
    const sessionId = hashVisitorId(ip, userAgent, new Date().toISOString().substring(0, 13)); // Hourly session

    const eventPayload = {
      event_id: crypto.randomUUID(),
      site_id: body.hostname || 'unknown',
      type: body.type || 'pageview',
      event_name: body.event_name || null,
      pathname: body.pathname || '/',
      hostname: body.hostname || '',
      referrer: referrer,
      referrer_source: referrerSource,
      country: country,
      city: city,
      region: region,
      device: device,
      browser: browser,
      os: os,
      screen_size: body.screen_size || '',
      utm_source: utm.utm_source,
      utm_medium: utm.utm_medium,
      utm_campaign: utm.utm_campaign,
      utm_term: utm.utm_term,
      utm_content: utm.utm_content,
      visitor_id: visitorId,
      session_id: sessionId,
      revenue: body.revenue || null,
      timestamp: new Date().toISOString()
    };

    if (c.env.STORAGE_MODE === 'local') {
      console.log('EVENT LOG:', JSON.stringify(eventPayload, null, 2));
      return c.json({ status: 'accepted', mode: 'local' }, 202);
    }

    // Publish to GCP Pub/Sub
    const topicUrl = `https://pubsub.googleapis.com/v1/projects/${c.env.GCP_PROJECT_ID}/topics/${c.env.PUBSUB_TOPIC}:publish`;
    
    // In a real production app, we would use proper Google Auth (JWT) using the API_KEY
    // For simplicity in this worker, assuming API_KEY contains a valid access token or 
    // we use a simplified REST call if a proxy is set up.
    // To do it correctly: generate a JWT signed with the service account private key.
    
    // Placeholder for PubSub publish logic
    console.log('Sending to PubSub', topicUrl);

    return c.json({ status: 'accepted' }, 202);

  } catch (error) {
    console.error('Error processing event:', error);
    // Don't fail the client tracking script
    return c.json({ status: 'accepted', error: 'internal_error' }, 202);
  }
});

export default app;
