const fs = require('fs');

const customQueryCode = `
export async function getCustomQuery(siteId: string, metric: string, dimension: string, periodDays: number = 30) {
  let metricSql = 'COUNT(*) as value';
  if (metric === 'visitors') metricSql = 'COUNT(DISTINCT visitor_id) as value';
  else if (metric === 'sessions') metricSql = 'COUNT(DISTINCT session_id) as value';
  else if (metric === 'bounce_rate') return []; // Complex, skip for now
  else if (metric === 'avg_duration') return [];

  let dimSql = '"" as name';
  if (dimension === 'date') dimSql = 'CAST(DATE(timestamp) AS STRING) as name';
  else if (dimension === 'country') dimSql = 'IFNULL(geo_country, "Unknown") as name';
  else if (dimension === 'browser') dimSql = 'IFNULL(browser, "Unknown") as name';
  else if (dimension === 'os') dimSql = 'IFNULL(os, "Unknown") as name';
  else if (dimension === 'device') dimSql = 'IFNULL(device, "Unknown") as name';
  else if (dimension === 'referrer') dimSql = 'IFNULL(referrer, "Direct") as name';
  else if (dimension === 'page') dimSql = 'IFNULL(pathname, "/") as name';

  const query = \`
    SELECT \${dimSql}, \${metricSql}
    FROM \\\`\${DATASET}.events\\\`
    WHERE site_id = @siteId AND timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL @periodDays DAY)
    \${dimension !== 'none' ? 'GROUP BY name' : ''}
    ORDER BY \${dimension === 'date' ? 'name ASC' : 'value DESC'}
    LIMIT 100
  \`;

  try {
    const [rows] = await bigquery.query({
      query,
      params: { siteId, periodDays }
    });
    return rows;
  } catch (e) {
    console.error("Custom query error", e);
    return [];
  }
}
`;

fs.appendFileSync('src/stats.ts', customQueryCode);
console.log("Appended custom query code.");
