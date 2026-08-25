const fs = require('fs');
let content = fs.readFileSync('src/components/dashboards/store.ts', 'utf8');

// Update Report type
const oldReport = `export type Report = {
  id: string;
  name: string;
  chartType: 'area' | 'bar' | 'pie' | 'metric' | 'linear';
  data: any[];
  layout?: { x: number; y: number; w: number; h: number };
};`;

const newReport = `export type Report = {
  id: string;
  name: string;
  chartType: 'area' | 'bar' | 'pie' | 'metric' | 'linear';
  metric: string;
  dimension: string;
  data: any[];
  layout?: { x: number; y: number; w: number; h: number };
};`;
content = content.replace(oldReport, newReport);

// Update default report
content = content.replace(`{ id: 'r1', name: 'Total Conversions', chartType: 'metric', data: [{ value: '1,204' }], layout: { x: 0, y: 0, w: 12, h: 1 } },`, `{ id: 'r1', name: 'Total Conversions', chartType: 'metric', metric: 'visitors', dimension: 'none', data: [{ value: '1,204' }], layout: { x: 0, y: 0, w: 12, h: 1 } },`);
content = content.replace(`{ id: 'r2', name: 'Conversions Over Time', chartType: 'area', data: defaultData, layout: { x: 0, y: 1, w: 8, h: 3 } },`, `{ id: 'r2', name: 'Conversions Over Time', chartType: 'area', metric: 'pageviews', dimension: 'date', data: defaultData, layout: { x: 0, y: 1, w: 8, h: 3 } },`);
content = content.replace(`{ id: 'r3', name: 'Device Breakdown', chartType: 'pie', data: [{ name: 'Desktop', value: 400 }, { name: 'Mobile', value: 300 }], layout: { x: 8, y: 1, w: 4, h: 3 } },`, `{ id: 'r3', name: 'Device Breakdown', chartType: 'pie', metric: 'visitors', dimension: 'device', data: [{ name: 'Desktop', value: 400 }, { name: 'Mobile', value: 300 }], layout: { x: 8, y: 1, w: 4, h: 3 } },`);

fs.writeFileSync('src/components/dashboards/store.ts', content);
