const fs = require('fs');

let content = fs.readFileSync('src/app/(dashboard)/dashboards/[id]/page.tsx', 'utf8');

// Add states
content = content.replace(
  "const [reportType, setReportType] = useState<'area' | 'bar' | 'pie' | 'metric'>('area');",
  "const [reportType, setReportType] = useState<'area' | 'bar' | 'pie' | 'metric'>('area');\n  const [reportMetric, setReportMetric] = useState<string>('pageviews');\n  const [reportDimension, setReportDimension] = useState<string>('date');"
);

// Replace the entire mock data generation and report creation block
const oldCreateBlockRegex = /\/\/ Generate some mock data based on type[\s\S]*?layout: \{ x: 0, y: 0, w: reportType === 'metric' \? 3 : 6, h: reportType === 'metric' \? 1 : 3 \}\n    \};/;

const newCreateBlock = `const newReport: Report = {
      id: \`r-\${Date.now()}\`,
      name: reportNameInput.trim(),
      chartType: reportType,
      metric: reportMetric,
      dimension: reportType === 'metric' ? 'none' : reportDimension,
      data: [],
      layout: { x: 0, y: 0, w: reportType === 'metric' ? 3 : 6, h: reportType === 'metric' ? 1 : 3 }
    };`;

content = content.replace(oldCreateBlockRegex, newCreateBlock);

// Replace UI
const extraUI = `
          <div className="space-y-3 mt-4">
            <label className="block text-xs font-semibold text-[#a6a6a6] uppercase tracking-wider">Data Configuration</label>
            <div className="grid grid-cols-2 gap-4">
              <select 
                value={reportMetric} 
                onChange={(e) => setReportMetric(e.target.value)}
                className="w-full bg-[#121212] border border-[#333] rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-[#404040]"
              >
                <option value="pageviews">Pageviews</option>
                <option value="visitors">Unique Visitors</option>
                <option value="sessions">Sessions</option>
              </select>
              {reportType !== 'metric' && (
                <select 
                  value={reportDimension} 
                  onChange={(e) => setReportDimension(e.target.value)}
                  className="w-full bg-[#121212] border border-[#333] rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-[#404040]"
                >
                  <option value="date">Date</option>
                  <option value="country">Country</option>
                  <option value="browser">Browser</option>
                  <option value="os">OS</option>
                  <option value="device">Device</option>
                  <option value="referrer">Referrer</option>
                  <option value="page">Page Path</option>
                </select>
              )}
            </div>
          </div>
`;

content = content.replace(/<div className="flex justify-end gap-3 pt-4 mt-6 border-t border-\[#262626\]">/, extraUI + '\n          <div className="flex justify-end gap-3 pt-4 mt-6 border-t border-[#262626]">');

fs.writeFileSync('src/app/(dashboard)/dashboards/[id]/page.tsx', content);
