const fs = require('fs');

let content = fs.readFileSync('src/components/dashboards/report-item.tsx', 'utf8');

const replacement = `  const { state } = useWorkspace();
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

  const [menuOpen, setMenuOpen] = useState(false);`;

content = content.replace('const [menuOpen, setMenuOpen] = useState(false);', replacement);
content = content.replace(/report\.data/g, 'data');
content = content.replace(/data\.reduce\(\(sum, item\) => sum \+ item\.value, 0\)/g, `data.reduce((sum, item) => sum + (Number(item.value) || 0), 0)`);
content = content.replace(/data\[0\]\?.value/g, `(data[0]?.value || 0).toLocaleString()`);

// Fix the state initialization that was accidentally broken by report.data replace
content = content.replace(/useState<any\[\]>\(data \|\| \[\]\)/, 'useState<any[]>(report.data || [])');

fs.writeFileSync('src/components/dashboards/report-item.tsx', content);
