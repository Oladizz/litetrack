const fs = require('fs');
let content = fs.readFileSync('dashboard/src/app/(dashboard)/page.tsx', 'utf8');

const oldCards = `[
                { label: 'UNIQUE VISITORS', value: formatNumber(stats?.summary?.unique_visitors), dataKey: 'unique_visitors', trend: null, isPositive: true },
                { label: 'SESSIONS', value: formatNumber(stats?.summary?.unique_visitors), dataKey: 'unique_visitors', trend: null, isPositive: true },
                { label: 'PAGEVIEWS', value: formatNumber(stats?.summary?.pageviews), dataKey: 'pageviews', trend: null, isPositive: true },
                { label: 'PAGES PER SESSION', value: stats?.summary?.unique_visitors ? (stats.summary.pageviews / stats.summary.unique_visitors).toFixed(1) : '0', dataKey: 'pages_per_session', trend: null, isPositive: true },
                { label: 'BOUNCE RATE', value: (stats?.summary?.bounce_rate || 0).toFixed(1) + '%', dataKey: 'bounce_rate', trend: null, isPositive: true },
                { label: 'SESSION DURATION', value: (stats?.summary?.avg_duration || 0) + 's', dataKey: 'avg_duration', trend: null, isPositive: true },
                { label: 'REVENUE', value: '0 $', dataKey: 'revenue', trend: null, isPositive: true },
                { label: 'CONVERSIONS', value: '0', dataKey: 'conversions', trend: null, isPositive: true },
              ]`;

const newCards = `[
                { label: 'UNIQUE VISITORS', value: formatNumber(stats?.summary?.unique_visitors), dataKey: 'unique_visitors', trend: null, isPositive: true },
                { label: 'PAGEVIEWS', value: formatNumber(stats?.summary?.pageviews), dataKey: 'pageviews', trend: null, isPositive: true },
                { label: 'PAGES PER SESSION', value: stats?.summary?.unique_visitors ? (stats.summary.pageviews / stats.summary.unique_visitors).toFixed(1) : '0', dataKey: 'pages_per_session', trend: null, isPositive: true },
                { label: 'BOUNCE RATE', value: (stats?.summary?.bounce_rate || 0).toFixed(1) + '%', dataKey: 'bounce_rate', trend: null, isPositive: true },
                { label: 'AVG TTFB', value: stats?.summary?.ttfb ? Math.round(stats.summary.ttfb) + ' ms' : 'N/A', dataKey: 'ttfb', trend: null, isPositive: true },
                { label: 'AVG FCP', value: stats?.summary?.fcp ? Math.round(stats.summary.fcp) + ' ms' : 'N/A', dataKey: 'fcp', trend: null, isPositive: true },
                { label: 'SEO SCORE', value: stats?.summary?.seo_score ? Math.round(stats.summary.seo_score) + '/100' : 'N/A', dataKey: 'seo_score', trend: null, isPositive: true },
                { label: 'SESSIONS', value: formatNumber(stats?.summary?.sessions || stats?.summary?.unique_visitors), dataKey: 'sessions', trend: null, isPositive: true },
              ]`;

content = content.replace(oldCards, newCards);
fs.writeFileSync('dashboard/src/app/(dashboard)/page.tsx', content);
