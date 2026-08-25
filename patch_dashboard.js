const fs = require('fs');

let content = fs.readFileSync('dashboard/src/app/(dashboard)/dashboards/[id]/page.tsx', 'utf8');

// Replace the Metric options to include Performance / SEO
const oldOptions = `<option value="pageviews">Pageviews</option>
                <option value="visitors">Unique Visitors</option>
                <option value="sessions">Sessions</option>`;

const newOptions = `<option value="pageviews">Pageviews</option>
                <option value="visitors">Unique Visitors</option>
                <option value="sessions">Sessions</option>
                <option value="ttfb">Avg. TTFB (ms)</option>
                <option value="fcp">Avg. FCP (ms)</option>
                <option value="seo_score">Avg. SEO Score</option>`;

content = content.replace(oldOptions, newOptions);

fs.writeFileSync('dashboard/src/app/(dashboard)/dashboards/[id]/page.tsx', content);
