const fs = require('fs');

let content = fs.readFileSync('api/src/stats.ts', 'utf8');

// Find the getStats query
const oldQuery = `SELECT 
        COUNT(*) as pageviews,
        COUNT(DISTINCT visitor_id) as unique_visitors,
        COUNT(DISTINCT session_id) as sessions,
        (COUNTIF(type = 'pageview' AND session_id IN (
          SELECT session_id FROM \\\`\${DATASET}.\${TABLE}\\\` 
          WHERE site_id = @siteId AND DATE(timestamp) >= DATE_SUB(CURRENT_DATE(), INTERVAL @days DAY)
          GROUP BY session_id HAVING COUNT(*) = 1
        )) / NULLIF(COUNT(DISTINCT session_id), 0)) * 100 as bounce_rate
      FROM \\\`\${DATASET}.\${TABLE}\\\`
      WHERE site_id = @siteId AND DATE(timestamp) >= DATE_SUB(CURRENT_DATE(), INTERVAL @days DAY)`;

const newQuery = `SELECT 
        COUNT(*) as pageviews,
        COUNT(DISTINCT visitor_id) as unique_visitors,
        COUNT(DISTINCT session_id) as sessions,
        AVG(ttfb) as ttfb,
        AVG(fcp) as fcp,
        AVG(seo_score) as seo_score,
        (COUNTIF(type = 'pageview' AND session_id IN (
          SELECT session_id FROM \\\`\${DATASET}.\${TABLE}\\\` 
          WHERE site_id = @siteId AND DATE(timestamp) >= DATE_SUB(CURRENT_DATE(), INTERVAL @days DAY)
          GROUP BY session_id HAVING COUNT(*) = 1
        )) / NULLIF(COUNT(DISTINCT session_id), 0)) * 100 as bounce_rate
      FROM \\\`\${DATASET}.\${TABLE}\\\`
      WHERE site_id = @siteId AND DATE(timestamp) >= DATE_SUB(CURRENT_DATE(), INTERVAL @days DAY)`;

content = content.replace(oldQuery, newQuery);

fs.writeFileSync('api/src/stats.ts', content);
