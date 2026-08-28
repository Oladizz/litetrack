import { http, Request, Response } from '@google-cloud/functions-framework';
import { BigQuery } from '@google-cloud/bigquery';
import { parseUserAgent, extractUtmParams, hashVisitorId, parseReferrerSource } from './utils';
import * as crypto from 'crypto';
import * as geoip from 'geoip-lite';

const bq = new BigQuery();
const DATASET = 'litetrack';
const TABLE = 'events';

http('ingestEvent', async (req: Request, res: Response) => {
  // CORS Headers
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  try {
    let bodyData = req.body;
    if (typeof bodyData === 'string' || Buffer.isBuffer(bodyData)) {
      try {
        bodyData = JSON.parse(bodyData.toString());
      } catch(e) {
        bodyData = {};
      }
    }
    bodyData = bodyData || {};
    const events = Array.isArray(bodyData) ? bodyData : [bodyData];
    
    if (events.length === 0) {
      res.status(202).json({ status: 'accepted' });
      return;
    }

    const headers = req.headers;
    const forwardedFor = headers['x-forwarded-for'];
    const ip = (Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor)?.split(',')[0] || 'unknown';
    const userAgent = headers['user-agent'] || '';
    
    let country = 'unknown'; 
    let city = 'unknown';
    let region = 'unknown';
    
    if (ip !== 'unknown') {
      const geo = geoip.lookup(ip);
      if (geo) {
        country = geo.country || 'unknown';
        city = geo.city || 'unknown';
        region = geo.region || 'unknown';
      }
    }

    // Parse UA (same for all events in this batch from same client)
    const { browser, browser_version, os, os_version, device, device_brand, device_model } = parseUserAgent(userAgent);
    const dateStr = new Date().toISOString().split('T')[0];
    const visitorId = await hashVisitorId(ip, userAgent, dateStr);
    const sessionId = await hashVisitorId(ip, userAgent, new Date().toISOString().substring(0, 13));

    const rows = events.map((body: any) => {
      const url = body.url || body.pathname || '';
      const utm = extractUtmParams(url);
      const referrer = body.referrer || '';
      const referrerSource = parseReferrerSource(referrer);

      return {
        event_id: crypto.randomUUID(),
        site_id: body.domain || body.hostname || 'unknown',
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
        device_brand: device_brand || null,
        device_model: device_model || null,
        browser: browser,
        browser_version: browser_version || null,
        os: os,
        os_version: os_version || null,
        screen_size: body.screen_size || '',
        utm_source: utm.utm_source || null,
        utm_medium: utm.utm_medium || null,
        utm_campaign: utm.utm_campaign || null,
        utm_term: utm.utm_term || null,
        utm_content: utm.utm_content || null,
ttfb: body.ttfb || null,
fcp: body.fcp || null,
lcp: body.lcp || null,
cls: body.cls || null,
inp: body.inp || null,
seo_score: body.seo_score || null,
seo_issues: body.seo_issues ? JSON.stringify(body.seo_issues) : null,
        link_url: body.link_url || (body.props && body.props.link_url) || null,
        visitor_id: visitorId,
        session_id: sessionId,
        revenue: body.revenue || null,
        timestamp: body.timestamp ? bq.timestamp(new Date(body.timestamp)) : bq.timestamp(new Date())
      };
    });

    // Insert into BigQuery in a single batch
    await bq.dataset(DATASET).table(TABLE).insert(rows);
    
    res.status(202).json({ status: 'accepted' });
  } catch (error) {
    console.error('Error inserting into BigQuery', error);
    res.status(202).json({ status: 'accepted', error: 'internal_error' }); // Do not break the client
  }
});
