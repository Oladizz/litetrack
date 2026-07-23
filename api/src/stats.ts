import { BigQuery } from '@google-cloud/bigquery';

const bq = new BigQuery();
const DATASET = 'litetrack';

export async function getSites() {
  try {
    const query = `SELECT site_id, name, domain, created_at, template, features, firebase_config FROM \`${DATASET}.sites\` ORDER BY created_at DESC`;
    const [rows] = await bq.query({ query });
    return rows.map(r => ({ 
      ...r, 
      template: r.template || 'saas',
      features: r.features ? (typeof r.features === 'string' ? JSON.parse(r.features) : r.features) : ['pageviews', 'events', 'ecommerce', 'user_journey', 'tech_specs', 'performance', 'privacy'],
      firebase_config: r.firebase_config ? (typeof r.firebase_config === 'string' ? JSON.parse(r.firebase_config) : r.firebase_config) : null
    }));
  } catch (err) {
    console.error('Failed to get sites', err);
    return [];
  }
}

export async function addSite(site_id: string, name: string, domain: string, template: string = 'saas', features: string[] = ['pageviews', 'events', 'ecommerce', 'user_journey', 'tech_specs', 'performance', 'privacy']) {
  const featuresJson = JSON.stringify(features);
  const query = `INSERT INTO \`${DATASET}.sites\` (site_id, name, domain, created_at, template, features) VALUES (@site_id, @name, @domain, CURRENT_TIMESTAMP(), @template, @featuresJson)`;
  await bq.query({ query, params: { site_id, name, domain, template, featuresJson } });
  return true;
}

export async function updateSiteTemplate(site_id: string, template: string) {
  const query = `UPDATE \`${DATASET}.sites\` SET template = @template WHERE site_id = @site_id`;
  await bq.query({ query, params: { site_id, template } });
  return true;
}

export async function updateSiteFeatures(site_id: string, features: string[]) {
  const featuresJson = JSON.stringify(features);
  const query = `UPDATE \`${DATASET}.sites\` SET features = @featuresJson WHERE site_id = @site_id`;
  await bq.query({ query, params: { site_id, featuresJson } });
  return true;
}

export async function updateSiteFirebaseConfig(site_id: string, config: any) {
  const configJson = JSON.stringify(config);
  const query = `UPDATE \`${DATASET}.sites\` SET firebase_config = @configJson WHERE site_id = @site_id`;
  await bq.query({ query, params: { site_id, configJson } });
  return true;
}

export async function deleteSite(site_id: string) {
  const query = `DELETE FROM \`${DATASET}.sites\` WHERE site_id = @site_id`;
  await bq.query({ query, params: { site_id } });
  return true;
}

export async function getLiveVisitors(siteId: string) {
  try {

    const query = `
      SELECT COUNT(DISTINCT visitor_id) as live
      FROM \`${DATASET}.events\`
      WHERE site_id = @siteId
      AND timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 30 MINUTE)
    `;
    const [rows] = await bq.query({ query, params: { siteId } });
    return rows[0]?.live || 0;
  } catch (err) {
    return 0; 
  }
}

export async function getActivityStream(siteId: string) {
  try {
    const query = `
      SELECT 
        event_id,
        visitor_id,
        pathname,
        device,
        country,
        browser,
        os,
        FORMAT_TIMESTAMP('%I:%M %p', timestamp) as time,
        timestamp
      FROM \`${DATASET}.events\`
      WHERE site_id = @siteId
      ORDER BY timestamp DESC
      LIMIT 50
    `;
    const [rows] = await bq.query({ query, params: { siteId } });
    return rows;
  } catch (err) {
    console.error('Failed to get activity stream', err);
    return [];
  }
}

export async function getStats(siteId: string, period: string, filters: Record<string, string | undefined>) {

  // Build the WHERE clause dynamically based on drill-down filters
  let filterClause = '';
  const params: Record<string, any> = { siteId };

  const FILTER_MAP: Record<string, string> = {
    source: 'referrer_source',
    referrer_source: 'referrer_source',
    ref: 'referrer',
    referrer: 'referrer',
    pathname: 'pathname',
    url: 'pathname',
    country: 'country',
    region: 'region',
    city: 'city',
    device: 'device',
    browser: 'browser',
    os: 'os',
    type: 'type',
    event: 'event_name',
    event_name: 'event_name',
    link: 'link_url',
    link_url: 'link_url',
    utm_source: 'utm_source',
    utm_medium: 'utm_medium',
    utm_campaign: 'utm_campaign',
    utm_term: 'utm_term',
    utm_content: 'utm_content',
    device_brand: 'device_brand',
    device_model: 'device_model',
    browser_version: 'browser_version',
    os_version: 'os_version',
    hostname: 'hostname'
  };

  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      const col = FILTER_MAP[key] || key;
      const paramKey = key.replace(/[^a-zA-Z0-9_]/g, '_');
      if (col === 'browser_version' && value.includes(' ')) {
        filterClause += ` AND CONCAT(browser, ' ', browser_version) = @${paramKey}`;
      } else if (col === 'os_version' && value.includes(' ')) {
        filterClause += ` AND CONCAT(os, ' ', os_version) = @${paramKey}`;
      } else if (col === 'device_model' && value.includes(' ')) {
        filterClause += ` AND CONCAT(device_brand, ' ', device_model) = @${paramKey}`;
      } else {
        filterClause += ` AND ${col} = @${paramKey}`;
      }
      params[paramKey] = value;
    }
  });

  let dateFilter = 'timestamp >= TIMESTAMP_TRUNC(CURRENT_TIMESTAMP(), DAY)'; 
  if (period === '7d') dateFilter = 'timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 7 DAY)';
  if (period === '30d') dateFilter = 'timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 30 DAY)';
  if (period === '90d') dateFilter = 'timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 90 DAY)';
  if (period === '12mo') dateFilter = 'timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 365 DAY)';

  const queries = {
    summary: `
      SELECT 
        COUNT(*) as pageviews, 
        COUNT(DISTINCT visitor_id) as unique_visitors,
        IFNULL(SAFE_DIVIDE(SUM(CASE WHEN hits_per_session = 1 THEN 1 ELSE 0 END), COUNT(DISTINCT session_id)) * 100, 0) as bounce_rate
      FROM (
        SELECT visitor_id, session_id, COUNT(*) as hits_per_session
        FROM \`${DATASET}.events\`
        WHERE site_id = @siteId AND type = 'pageview' AND ${dateFilter} ${filterClause}
        GROUP BY visitor_id, session_id
      )
    `,
    topPages: `
      SELECT pathname, COUNT(*) as views, COUNT(DISTINCT session_id) as sessions, COUNT(DISTINCT visitor_id) as visitors
      FROM \`${DATASET}.events\`
      WHERE site_id = @siteId AND type = 'pageview' AND ${dateFilter} ${filterClause} AND pathname IS NOT NULL
      GROUP BY pathname
      ORDER BY views DESC
      LIMIT 50
    `,
    entries: `
      SELECT pathname, COUNT(DISTINCT session_id) as views, COUNT(DISTINCT session_id) as sessions
      FROM (
        SELECT pathname, session_id, ROW_NUMBER() OVER (PARTITION BY session_id ORDER BY timestamp ASC) as rn
        FROM \`${DATASET}.events\`
        WHERE site_id = @siteId AND type = 'pageview' AND ${dateFilter} ${filterClause}
      )
      WHERE rn = 1 AND pathname IS NOT NULL
      GROUP BY pathname
      ORDER BY sessions DESC
      LIMIT 50
    `,
    exits: `
      SELECT pathname, COUNT(DISTINCT session_id) as views, COUNT(DISTINCT session_id) as sessions
      FROM (
        SELECT pathname, session_id, ROW_NUMBER() OVER (PARTITION BY session_id ORDER BY timestamp DESC) as rn
        FROM \`${DATASET}.events\`
        WHERE site_id = @siteId AND type = 'pageview' AND ${dateFilter} ${filterClause}
      )
      WHERE rn = 1 AND pathname IS NOT NULL
      GROUP BY pathname
      ORDER BY sessions DESC
      LIMIT 50
    `,
    topSources: `
      SELECT referrer_source as source, COUNT(DISTINCT visitor_id) as visitors
      FROM \`${DATASET}.events\`
      WHERE site_id = @siteId AND type = 'pageview' AND ${dateFilter} ${filterClause} AND referrer_source IS NOT NULL
      GROUP BY referrer_source
      ORDER BY visitors DESC
      LIMIT 10
    `,
    countries: `
      SELECT country, COUNT(DISTINCT visitor_id) as visitors
      FROM \`${DATASET}.events\`
      WHERE site_id = @siteId AND type = 'pageview' AND ${dateFilter} ${filterClause} AND country IS NOT NULL
      GROUP BY country
      ORDER BY visitors DESC
      LIMIT 10
    `,
    devices: `
      SELECT device, COUNT(DISTINCT visitor_id) as visitors
      FROM \`${DATASET}.events\`
      WHERE site_id = @siteId AND ${dateFilter} ${filterClause} AND device IS NOT NULL
      GROUP BY device
      ORDER BY visitors DESC
    `,
    browsers: `
      SELECT browser, COUNT(DISTINCT visitor_id) as visitors
      FROM \`${DATASET}.events\`
      WHERE site_id = @siteId AND ${dateFilter} ${filterClause} AND browser IS NOT NULL
      GROUP BY browser
      ORDER BY visitors DESC
    `,
    os: `
      SELECT os, COUNT(DISTINCT visitor_id) as visitors
      FROM \`${DATASET}.events\`
      WHERE site_id = @siteId AND ${dateFilter} ${filterClause} AND os IS NOT NULL
      GROUP BY os
      ORDER BY visitors DESC
    `,
    browser_version: `
      SELECT CONCAT(browser, ' ', browser_version) as id, COUNT(DISTINCT visitor_id) as visitors
      FROM \`${DATASET}.events\`
      WHERE site_id = @siteId AND ${dateFilter} ${filterClause} AND browser_version IS NOT NULL
      GROUP BY id
      ORDER BY visitors DESC
      LIMIT 10
    `,
    heatmap: `
      SELECT 
        EXTRACT(DAYOFWEEK FROM timestamp) as day,
        EXTRACT(HOUR FROM timestamp) as hour,
        COUNT(DISTINCT visitor_id) as visitors,
        COUNT(DISTINCT session_id) as sessions,
        COUNT(*) as pageviews
      FROM \`${DATASET}.events\`
      WHERE site_id = @siteId AND ${dateFilter} ${filterClause}
      GROUP BY day, hour
    `,
    journey3: `
      SELECT step1, step2, step3, COUNT(*) as count
      FROM (
        SELECT 
          pathname as step1,
          LEAD(pathname, 1) OVER (PARTITION BY session_id ORDER BY timestamp ASC) as step2,
          LEAD(pathname, 2) OVER (PARTITION BY session_id ORDER BY timestamp ASC) as step3,
          ROW_NUMBER() OVER (PARTITION BY session_id ORDER BY timestamp ASC) as rn
        FROM \`${DATASET}.events\`
        WHERE site_id = @siteId AND type = 'pageview' AND ${dateFilter} ${filterClause}
      )
      WHERE rn = 1
      GROUP BY step1, step2, step3
      ORDER BY count DESC
      LIMIT 10
    `,
    journey5: `
      SELECT step1, step2, step3, step4, step5, COUNT(*) as count
      FROM (
        SELECT 
          pathname as step1,
          LEAD(pathname, 1) OVER (PARTITION BY session_id ORDER BY timestamp ASC) as step2,
          LEAD(pathname, 2) OVER (PARTITION BY session_id ORDER BY timestamp ASC) as step3,
          LEAD(pathname, 3) OVER (PARTITION BY session_id ORDER BY timestamp ASC) as step4,
          LEAD(pathname, 4) OVER (PARTITION BY session_id ORDER BY timestamp ASC) as step5,
          ROW_NUMBER() OVER (PARTITION BY session_id ORDER BY timestamp ASC) as rn
        FROM \`${DATASET}.events\`
        WHERE site_id = @siteId AND type = 'pageview' AND ${dateFilter} ${filterClause}
      )
      WHERE rn = 1
      GROUP BY step1, step2, step3, step4, step5
      ORDER BY count DESC
      LIMIT 10
    `,
    os_version: `
      SELECT CONCAT(os, ' ', os_version) as id, COUNT(DISTINCT visitor_id) as visitors
      FROM \`${DATASET}.events\`
      WHERE site_id = @siteId AND ${dateFilter} ${filterClause} AND os_version IS NOT NULL
      GROUP BY id
      ORDER BY visitors DESC
      LIMIT 10
    `,
    brands: `
      SELECT device_brand as id, COUNT(DISTINCT visitor_id) as visitors
      FROM \`${DATASET}.events\`
      WHERE site_id = @siteId AND ${dateFilter} ${filterClause} AND device_brand IS NOT NULL
      GROUP BY id
      ORDER BY visitors DESC
      LIMIT 10
    `,
    models: `
      SELECT CONCAT(device_brand, ' ', device_model) as id, COUNT(DISTINCT visitor_id) as visitors
      FROM \`${DATASET}.events\`
      WHERE site_id = @siteId AND ${dateFilter} ${filterClause} AND device_model IS NOT NULL
      GROUP BY id
      ORDER BY visitors DESC
      LIMIT 10
    `,
    linkOut: `
      SELECT link_url as link, COUNT(*) as views
      FROM \`${DATASET}.events\`
      WHERE site_id = @siteId AND ${dateFilter} ${filterClause} AND (event_name = 'Link out' OR link_url IS NOT NULL)
      GROUP BY link
      ORDER BY views DESC
      LIMIT 10
    `,
    regions: `
      SELECT region, COUNT(DISTINCT visitor_id) as visitors, COUNT(DISTINCT session_id) as sessions
      FROM \`${DATASET}.events\`
      WHERE site_id = @siteId AND ${dateFilter} ${filterClause} AND region IS NOT NULL
      GROUP BY region
      ORDER BY visitors DESC
      LIMIT 10
    `,
    cities: `
      SELECT city, COUNT(DISTINCT visitor_id) as visitors, COUNT(DISTINCT session_id) as sessions
      FROM \`${DATASET}.events\`
      WHERE site_id = @siteId AND ${dateFilter} ${filterClause} AND city IS NOT NULL
      GROUP BY city
      ORDER BY visitors DESC
      LIMIT 10
    `,
    medium: `
      SELECT utm_medium as medium, COUNT(*) as views, COUNT(DISTINCT session_id) as sessions
      FROM \`${DATASET}.events\`
      WHERE site_id = @siteId AND ${dateFilter} ${filterClause} AND utm_medium IS NOT NULL
      GROUP BY medium
      ORDER BY views DESC
      LIMIT 10
    `,
    campaign: `
      SELECT utm_campaign as campaign, COUNT(*) as views, COUNT(DISTINCT session_id) as sessions
      FROM \`${DATASET}.events\`
      WHERE site_id = @siteId AND ${dateFilter} ${filterClause} AND utm_campaign IS NOT NULL
      GROUP BY campaign
      ORDER BY views DESC
      LIMIT 10
    `,
    term: `
      SELECT utm_term as term, COUNT(*) as views, COUNT(DISTINCT session_id) as sessions
      FROM \`${DATASET}.events\`
      WHERE site_id = @siteId AND ${dateFilter} ${filterClause} AND utm_term IS NOT NULL
      GROUP BY term
      ORDER BY views DESC
      LIMIT 10
    `,
    content: `
      SELECT utm_content as content, COUNT(*) as views, COUNT(DISTINCT session_id) as sessions
      FROM \`${DATASET}.events\`
      WHERE site_id = @siteId AND ${dateFilter} ${filterClause} AND utm_content IS NOT NULL
      GROUP BY content
      ORDER BY views DESC
      LIMIT 10
    `,
    refs: `
      SELECT referrer as ref, COUNT(*) as views, COUNT(DISTINCT session_id) as sessions
      FROM \`${DATASET}.events\`
      WHERE site_id = @siteId AND type = 'pageview' AND ${dateFilter} ${filterClause} AND referrer IS NOT NULL
      GROUP BY ref
      ORDER BY views DESC
      LIMIT 10
    `,
    timeseries: `
      SELECT FORMAT_TIMESTAMP('%Y-%m-%d', timestamp) as date, COUNT(*) as pageviews, COUNT(DISTINCT visitor_id) as visitors
      FROM \`${DATASET}.events\`
      WHERE site_id = @siteId AND type = 'pageview' AND ${dateFilter} ${filterClause}
      GROUP BY date
      ORDER BY date ASC
    `,
    events: `
      SELECT event_name as event, COUNT(*) as views
      FROM \`${DATASET}.events\`
      WHERE site_id = @siteId AND type = 'event' AND ${dateFilter} ${filterClause} AND event_name IS NOT NULL
      GROUP BY event_name
      ORDER BY views DESC
      LIMIT 10
    `,
    urls: `
      SELECT CONCAT(IFNULL(hostname, ''), pathname) as url, COUNT(*) as views, COUNT(DISTINCT session_id) as sessions
      FROM \`${DATASET}.events\`
      WHERE site_id = @siteId AND type = 'pageview' AND ${dateFilter} ${filterClause}
      GROUP BY url
      ORDER BY views DESC
      LIMIT 50
    `,
    types: `
      SELECT type, COUNT(*) as views, COUNT(DISTINCT session_id) as sessions
      FROM \`${DATASET}.events\`
      WHERE site_id = @siteId AND ${dateFilter} ${filterClause}
      GROUP BY type
      ORDER BY views DESC
      LIMIT 10
    `
  };

  try {
    const [summary] = await bq.query({ query: queries.summary, params });
    const [topPages] = await bq.query({ query: queries.topPages, params });
    const [entries] = await bq.query({ query: queries.entries, params });
    const [exits] = await bq.query({ query: queries.exits, params });
    const [topSources] = await bq.query({ query: queries.topSources, params });
    const [countries] = await bq.query({ query: queries.countries, params });
    const [devices] = await bq.query({ query: queries.devices, params });
    const [browsers] = await bq.query({ query: queries.browsers, params });
    const [os] = await bq.query({ query: queries.os, params });
    const [timeseries] = await bq.query({ query: queries.timeseries, params });
    const [events] = await bq.query({ query: queries.events, params });
    
    // New mappings
    const [regions] = await bq.query({ query: queries.regions, params });
    const [cities] = await bq.query({ query: queries.cities, params });
    const [medium] = await bq.query({ query: queries.medium, params });
    const [campaign] = await bq.query({ query: queries.campaign, params });
    const [term] = await bq.query({ query: queries.term, params });
    const [content] = await bq.query({ query: queries.content, params });
    const [refs] = await bq.query({ query: queries.refs, params });
    const [browser_version] = await bq.query({ query: queries.browser_version, params });
    const [os_version] = await bq.query({ query: queries.os_version, params });
    const [brands] = await bq.query({ query: queries.brands, params });
    const [models] = await bq.query({ query: queries.models, params });
    const [linkOut] = await bq.query({ query: queries.linkOut, params });
    const [heatmap] = await bq.query({ query: queries.heatmap, params });
    const [journey3] = await bq.query({ query: queries.journey3, params });
    const [journey5] = await bq.query({ query: queries.journey5, params });
    const [urls] = await bq.query({ query: queries.urls, params });
    const [types] = await bq.query({ query: queries.types, params });

    let paddedTimeseries = timeseries || [];
    if (paddedTimeseries.length > 0) {
      let days = 1;
      if (period === '7d') days = 7;
      if (period === '30d') days = 30;
      if (period === '90d') days = 90;
      if (period === '12mo') days = 365;
      
      const filled = [];
      const dataMap = new Map((timeseries || []).map((t: any) => [t.date, t]));
      
      for (let i = days - 1; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dStr = d.toISOString().split('T')[0];
        
        if (dataMap.has(dStr)) {
          filled.push(dataMap.get(dStr));
        } else {
          filled.push({ date: dStr, pageviews: 0, visitors: 0 });
        }
      }
      paddedTimeseries = filled;
    }

    return {
      summary: summary[0] || { pageviews: 0, unique_visitors: 0, bounce_rate: 0, avg_duration: 0 },
      top_pages: topPages || [],
      entries: entries || [],
      exits: exits || [],
      top_sources: topSources || [],
      countries: countries || [],
      devices: devices || [],
      browsers: browsers || [],
      os: os || [],
      timeseries: paddedTimeseries,
      events: events || [],
      
      regions: regions || [],
      cities: cities || [],
      medium: medium || [],
      campaign: campaign || [],
      term: term || [],
      content: content || [],
      refs: refs || [],
      browser_version: browser_version || [],
      os_version: os_version || [],
      brands: brands || [],
      models: models || [],
      linkOut: linkOut || [],
      heatmap: heatmap || [],
      journey3: journey3 || [],
      journey5: journey5 || [],
      urls: urls || [],
      types: types || []
    };
  } catch (err) {
    console.error('BQ Query Error', err);
    throw err;
  }
}



export async function getUsers(siteId: string, period: string, filters: Record<string, string | undefined>) {
  // Use real data from BigQuery
  let filterClause = '';
  const params: Record<string, any> = { siteId };
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      filterClause += ` AND ${key} = @${key}`;
      params[key] = value;
    }
  });

  let dateFilter = 'timestamp >= TIMESTAMP_TRUNC(CURRENT_TIMESTAMP(), DAY)'; 
  if (period === '7d') dateFilter = 'timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 7 DAY)';
  if (period === '30d') dateFilter = 'timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 30 DAY)';
  if (period === '90d') dateFilter = 'timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 90 DAY)';
  if (period === '12mo') dateFilter = 'timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 365 DAY)';

  const query = `
    SELECT 
      visitor_id as id,
      'Anonymous Visitor' as name,
      CONCAT(visitor_id, '@visitor.local') as email,
      'User' as role,
      'Active' as status,
      FORMAT_TIMESTAMP('%b %Y', MIN(timestamp)) as joined,
      FORMAT_TIMESTAMP('%b %d, %I:%M %p', MAX(timestamp)) as lastActive,
      COUNT(DISTINCT session_id) as sessions,
      IFNULL(SUM(revenue), 0) as revenue
    FROM \`${DATASET}.events\`
    WHERE site_id = @siteId AND ${dateFilter} ${filterClause}
    GROUP BY visitor_id
    ORDER BY MAX(timestamp) DESC
    LIMIT 50
  `;

  const growthQuery = `
    SELECT 
      FORMAT_TIMESTAMP('%b %d', DATE(timestamp)) as date,
      COUNT(DISTINCT visitor_id) as users,
      COUNT(DISTINCT session_id) as active
    FROM \`${DATASET}.events\`
    WHERE site_id = @siteId AND ${dateFilter} ${filterClause}
    GROUP BY date
    ORDER BY date ASC
  `;

  try {
    const [[users], [growth]] = await Promise.all([
      bq.query({ query, params }),
      bq.query({ query: growthQuery, params })
    ]);
    return { users, growthData: growth };
  } catch (err) {
    console.error('Failed to get users', err);
    return { users: [], growthData: [] };
  }
}

export async function getFinances(siteId: string, period: string, filters: Record<string, string | undefined>) {
  let filterClause = '';
  const params: Record<string, any> = { siteId };
  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      filterClause += ` AND ${key} = @${key}`;
      params[key] = value;
    }
  });

  let dateFilter = 'timestamp >= TIMESTAMP_TRUNC(CURRENT_TIMESTAMP(), DAY)'; 
  if (period === '7d') dateFilter = 'timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 7 DAY)';
  if (period === '30d') dateFilter = 'timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 30 DAY)';
  if (period === '90d') dateFilter = 'timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 90 DAY)';
  if (period === '12mo') dateFilter = 'timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 365 DAY)';

  const summaryQuery = `
    SELECT 
      IFNULL(SUM(revenue), 0) as totalRevenue,
      COUNT(*) as transactions,
      IFNULL(AVG(revenue), 0) as aov
    FROM \`${DATASET}.events\`
    WHERE site_id = @siteId AND revenue IS NOT NULL AND ${dateFilter} ${filterClause}
  `;

  const chartQuery = `
    SELECT 
      FORMAT_TIMESTAMP('%b %d', DATE(timestamp)) as date,
      IFNULL(SUM(revenue), 0) as revenue
    FROM \`${DATASET}.events\`
    WHERE site_id = @siteId AND revenue IS NOT NULL AND ${dateFilter} ${filterClause}
    GROUP BY date
    ORDER BY date ASC
  `;

  const txQuery = `
    SELECT 
      event_id as id,
      visitor_id as customer,
      revenue as amount,
      'Completed' as status,
      FORMAT_TIMESTAMP('%b %d, %I:%M %p', timestamp) as date,
      event_name as product
    FROM \`${DATASET}.events\`
    WHERE site_id = @siteId AND revenue IS NOT NULL AND ${dateFilter} ${filterClause}
    ORDER BY timestamp DESC
    LIMIT 50
  `;

  try {
    const [[summaryRows], [chartData], [transactions]] = await Promise.all([
      bq.query({ query: summaryQuery, params }),
      bq.query({ query: chartQuery, params }),
      bq.query({ query: txQuery, params })
    ]);
    return {
      summary: summaryRows[0] || { totalRevenue: 0, transactions: 0, aov: 0 },
      chartData,
      transactions
    };
  } catch (err) {
    console.error('Failed to get finances', err);
    return { summary: { totalRevenue: 0, transactions: 0, aov: 0 }, chartData: [], transactions: [] };
  }
}
