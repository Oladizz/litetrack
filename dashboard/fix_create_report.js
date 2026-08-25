const fs = require('fs');
let content = fs.readFileSync('src/app/(dashboard)/dashboards/[id]/page.tsx', 'utf8');

// 1. Add states for metric and dimension
content = content.replace(
  `const [reportType, setReportType] = useState<'area' | 'bar' | 'pie' | 'metric'>('area');`,
  `const [reportType, setReportType] = useState<'area' | 'bar' | 'pie' | 'metric'>('area');\n  const [reportMetric, setReportMetric] = useState<string>('pageviews');\n  const [reportDimension, setReportDimension] = useState<string>('date');`
);

// 2. Update handleCreateReportConfirm
const oldCreate = `const newReport = {
      id: \`rep-\${Date.now()}\`,
      name: reportNameInput.trim(),
      chartType: reportType,
      data: defaultData,
      layout: { x: 0, y: 0, w: reportType === 'metric' ? 3 : 6, h: reportType === 'metric' ? 1 : 3 }
    };`;
    
const newCreate = `const newReport: Report = {
      id: \`rep-\${Date.now()}\`,
      name: reportNameInput.trim(),
      chartType: reportType,
      metric: reportMetric,
      dimension: reportType === 'metric' ? 'none' : reportDimension,
      data: [], // Will be fetched dynamically
      layout: { x: 0, y: 0, w: reportType === 'metric' ? 3 : 6, h: reportType === 'metric' ? 1 : 3 }
    };`;
content = content.replace(/const newReport = \{[\s\S]*?layout: \{ x: 0, y: 0, w: reportType === 'metric' \? 3 : 6, h: reportType === 'metric' \? 1 : 3 \}\n    \};/, newCreate);

// 3. Delete mock data generation (if it was there)
content = content.replace(/if \(reportType === 'metric'\) \{[\s\S]*?\} else if \(reportType === 'pie'\) \{[\s\S]*?\}/, '');

// 4. Inject UI for Metric and Dimension inside the Create Modal
const modalUI = `
            {reportType !== 'metric' && (
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div>
                  <label className="block text-xs font-semibold text-[#a6a6a6] uppercase tracking-wider mb-2">Metric</label>
                  <select 
                    value={reportMetric} 
                    onChange={(e) => setReportMetric(e.target.value)}
                    className="w-full bg-[#121212] border border-[#262626] rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-[#2266ec]"
                  >
                    <option value="pageviews">Pageviews</option>
                    <option value="visitors">Unique Visitors</option>
                    <option value="sessions">Sessions</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#a6a6a6] uppercase tracking-wider mb-2">Dimension</label>
                  <select 
                    value={reportDimension} 
                    onChange={(e) => setReportDimension(e.target.value)}
                    className="w-full bg-[#121212] border border-[#262626] rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-[#2266ec]"
                  >
                    <option value="date">Date</option>
                    <option value="country">Country</option>
                    <option value="browser">Browser</option>
                    <option value="os">OS</option>
                    <option value="device">Device</option>
                    <option value="referrer">Referrer</option>
                    <option value="page">Page</option>
                  </select>
                </div>
              </div>
            )}
            {reportType === 'metric' && (
              <div className="mt-6">
                <label className="block text-xs font-semibold text-[#a6a6a6] uppercase tracking-wider mb-2">Metric</label>
                <select 
                  value={reportMetric} 
                  onChange={(e) => setReportMetric(e.target.value)}
                  className="w-full bg-[#121212] border border-[#262626] rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-[#2266ec]"
                >
                  <option value="pageviews">Pageviews</option>
                  <option value="visitors">Unique Visitors</option>
                  <option value="sessions">Sessions</option>
                </select>
              </div>
            )}
`;

content = content.replace(/<\/div>\n\s*<div className="flex justify-end gap-3 pt-4 mt-6 border-t border-\[#262626\]">/, modalUI + '\n          </div>\n          <div className="flex justify-end gap-3 pt-4 mt-6 border-t border-[#262626]">');

fs.writeFileSync('src/app/(dashboard)/dashboards/[id]/page.tsx', content);
