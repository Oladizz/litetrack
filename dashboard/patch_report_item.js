const fs = require('fs');

let content = fs.readFileSync('src/components/dashboards/report-item.tsx', 'utf8');

// Update imports safely
const newImports = `import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { Copy, Trash, MoreHorizontal, Maximize2, Download, RefreshCw } from 'lucide-react';
import { toast } from '@/components/ui/toast';
import { useWorkspace } from '@/components/ui/workspace-context';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://litetrack-api-916484331446.us-central1.run.app';
`;

// Find where imports end
content = content.replace(/import React, \{ useState \} from 'react';[\s\S]*?import \{ toast \} from '@\/components\/ui\/toast';/, newImports);


const fetchLogic = `export function ReportItem({ report, onDelete, onDuplicate }: { report: any, onDelete?: (id: string) => void, onDuplicate?: (id: string) => void }) {
  const { state } = useWorkspace();
  const [data, setData] = useState<any[]>(report.data || []);
  
  useEffect(() => {
    if (report.metric) {
      const fetchReportData = async () => {
        try {
          const token = localStorage.getItem('litetrack_token');
          const res = await fetch(\`\${apiUrl}/api/stats/\${state.project}/custom?metric=\${report.metric}&dimension=\${report.dimension}&days=30\`, {
            headers: { 'Authorization': \`Bearer \${token}\` }
          });
          if (res.ok) {
            const json = await res.json();
            setData(json.data || []);
          }
        } catch (e) {
          console.error(e);
        }
      };
      fetchReportData();
    }
  }, [report.metric, report.dimension, state.project]);
  
  const [menuOpen, setMenuOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number } | null>(null);`;

// Replace component opening
content = content.replace(/export function ReportItem\([^\{]+\{[\s\S]*?const \[contextMenu, setContextMenu\] = useState<\{ x: number, y: number \} \| null>\(null\);/, fetchLogic);


// Replace `report.data` with `data` globally EXCEPT when it's setting state above
content = content.replace(/report\.data/g, 'data');
// Fix the state initialization that got messed up by the global replace
content = content.replace(/const \[data, setData\] = useState<any\[\]>\(data \|\| \[\]\);/, 'const [data, setData] = useState<any[]>(report.data || []);');

// Fix pie reduce
content = content.replace(/data\.reduce\(\(sum, item\) => sum \+ item\.value, 0\)/g, `data.reduce((sum, item) => sum + (Number(item.value) || 0), 0)`);
// Fix metric
content = content.replace(/data\[0\]\?.value/g, `(data[0]?.value || 0).toLocaleString()`);

fs.writeFileSync('src/components/dashboards/report-item.tsx', content);
