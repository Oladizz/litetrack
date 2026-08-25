const fs = require('fs');

let content = fs.readFileSync('src/app/(dashboard)/dashboards/[id]/page.tsx', 'utf8');

// Add states
content = content.replace(
  "const [reportType, setReportType] = useState<'area' | 'bar' | 'pie' | 'metric'>('area');",
  "const [reportType, setReportType] = useState<'area' | 'bar' | 'pie' | 'metric'>('area');\n  const [reportMetric, setReportMetric] = useState<string>('pageviews');\n  const [reportDimension, setReportDimension] = useState<string>('date');"
);

content = content.replace(
  "const newReport = {",
  "const newReport: Report = {"
);

content = content.replace(
  "chartType: reportType,",
  "chartType: reportType,\n      metric: reportMetric,\n      dimension: reportType === 'metric' ? 'none' : reportDimension,"
);

// Remove mock generation
content = content.replace(/if \(reportType === 'metric'\) \{[\s\S]*?\} else if \(reportType === 'pie'\) \{[\s\S]*?\}/, '');

fs.writeFileSync('src/app/(dashboard)/dashboards/[id]/page.tsx', content);
