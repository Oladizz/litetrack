const fs = require('fs');

let content = fs.readFileSync('src/components/dashboards/report-item.tsx', 'utf8');

// Insert useWorkspace state right after export function ReportItem
content = content.replace(
  /export function ReportItem\([^\{]+\{[\s\S]*?const \[menuOpen, setMenuOpen\] = useState\(false\);/,
  `export function ReportItem({ report, onDelete, onDuplicate }: { report: any, onDelete?: (id: string) => void, onDuplicate?: (id: string) => void }) {
  const { state } = useWorkspace();
  const [data, setData] = useState<any[]>(report.data || []);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (report.metric) {
      const fetchReportData = async () => {
        setLoading(true);
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
        } finally {
          setLoading(false);
        }
      };
      fetchReportData();
    }
  }, [report.metric, report.dimension, state.project]);

  const [menuOpen, setMenuOpen] = useState(false);`
);

fs.writeFileSync('src/components/dashboards/report-item.tsx', content);
