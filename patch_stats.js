const fs = require('fs');
let content = fs.readFileSync('api/src/stats.ts', 'utf8');

const oldMetricSwitch = `    switch (metric) {
      case 'pageviews':
        metricSql = 'COUNT(*) as value';
        break;
      case 'visitors':
        metricSql = 'COUNT(DISTINCT visitor_id) as value';
        break;
      case 'sessions':
        metricSql = 'COUNT(DISTINCT session_id) as value';
        break;
      default:
        metricSql = 'COUNT(*) as value';
    }`;

const newMetricSwitch = `    switch (metric) {
      case 'pageviews':
        metricSql = 'COUNT(*) as value';
        break;
      case 'visitors':
        metricSql = 'COUNT(DISTINCT visitor_id) as value';
        break;
      case 'sessions':
        metricSql = 'COUNT(DISTINCT session_id) as value';
        break;
      case 'ttfb':
        metricSql = 'ROUND(AVG(ttfb), 2) as value';
        break;
      case 'fcp':
        metricSql = 'ROUND(AVG(fcp), 2) as value';
        break;
      case 'seo_score':
        metricSql = 'ROUND(AVG(seo_score), 2) as value';
        break;
      default:
        metricSql = 'COUNT(*) as value';
    }`;

content = content.replace(oldMetricSwitch, newMetricSwitch);
fs.writeFileSync('api/src/stats.ts', content);
