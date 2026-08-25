const fs = require('fs');

let content = fs.readFileSync('functions/src/index.ts', 'utf8');

content = content.replace(
  'utm_content: utm.utm_content || null,',
  'utm_content: utm.utm_content || null,\nttfb: body.ttfb || null,\nfcp: body.fcp || null,\nlcp: body.lcp || null,\ncls: body.cls || null,\ninp: body.inp || null,\nseo_score: body.seo_score || null,\nseo_issues: body.seo_issues ? JSON.stringify(body.seo_issues) : null,'
);

fs.writeFileSync('functions/src/index.ts', content);
