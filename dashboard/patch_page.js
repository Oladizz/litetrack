const fs = require('fs');
const content = fs.readFileSync('src/app/page.tsx', 'utf8');

// 1. Add isConnected state
let newContent = content.replace(
  "const [liveVisitors, setLiveVisitors] = useState<number>(0);",
  "const [liveVisitors, setLiveVisitors] = useState<number>(0);\n  const [isConnected, setIsConnected] = useState<boolean>(false);\n  const [mapTooltip, setMapTooltip] = useState<{content: string, x: number, y: number} | null>(null);"
);

// 2. Update fetchLiveStats
const oldFetchLiveStats = `  const fetchLiveStats = async () => {
    const data = await fetch(\`\${apiUrl}/api/stats/\${currentSite}/live\`, {
      headers: { 'Authorization': \`Bearer \${token}\` }
    }).then(r => r.json()).catch(() => null);
    if (data && data.live_visitors !== undefined) {
      setLiveVisitors(data.live_visitors);
    }
  };`;

const newFetchLiveStats = `  const fetchLiveStats = async () => {
    try {
      const res = await fetch(\`\${apiUrl}/api/stats/\${currentSite}/live\`, {
        headers: { 'Authorization': \`Bearer \${token}\` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.live_visitors !== undefined) {
          setLiveVisitors(data.live_visitors);
          // If we successfully fetched and there are any events in our backend, it's connected.
          setIsConnected(true);
        } else {
          setIsConnected(false);
        }
      } else {
        setIsConnected(false);
      }
    } catch {
      setIsConnected(false);
    }
  };`;

newContent = newContent.replace(oldFetchLiveStats, newFetchLiveStats);

// 3. Update the Live header
const oldLiveHeader = `            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#1a1a1a] border border-white/[0.05] rounded-full shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-[11px] font-semibold text-[#fafafa] tracking-wide">Live</span>
              <span className="text-[10px] text-[#656565]">Updated 2 sec ago</span>
            </div>`;

const newLiveHeader = `            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#1a1a1a] border border-white/[0.05] rounded-full shadow-sm">
              <span className="relative flex h-2 w-2">
                {isConnected ? (
                  <React.Fragment>
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
                  </React.Fragment>
                )}
              </span>
              <span className="text-[11px] font-semibold text-[#fafafa] tracking-wide">{isConnected ? 'Connected' : 'Waiting...'}</span>
              <span className="text-[10px] text-[#656565]">{isConnected ? 'Updates every 30s' : 'No data yet'}</span>
            </div>`;
newContent = newContent.replace(oldLiveHeader, newLiveHeader);


// 4. Update the Map
const oldMapGeo = `<Geography 
                              key={geo.rsmKey} 
                              geography={geo} 
                              fill={isHighlighted ? "#2266ec" : "#262626"} 
                              stroke="#121212"
                              strokeWidth={0.5}
                              style={{
                                default: { outline: "none" },
                                hover: { fill: isHighlighted ? "#1d57cc" : "#333", outline: "none", cursor: "pointer" },
                                pressed: { outline: "none" },
                              }}
                            />`;

const newMapGeo = `<Geography 
                              key={geo.rsmKey} 
                              geography={geo} 
                              fill={isHighlighted ? "#2266ec" : "#262626"} 
                              stroke="#121212"
                              strokeWidth={0.5}
                              onMouseEnter={(e) => {
                                const traffic = stats?.countries?.find((c: any) => c.country.toLowerCase() === geoName || c.country === geo.properties["iso_a2"]);
                                setMapTooltip({
                                  content: \`\${geo.properties.name}: \${traffic ? traffic.visitors : 0} Visitors\`,
                                  x: e.clientX,
                                  y: e.clientY
                                });
                              }}
                              onMouseMove={(e) => setMapTooltip(prev => prev ? {...prev, x: e.clientX, y: e.clientY} : null)}
                              onMouseLeave={() => setMapTooltip(null)}
                              style={{
                                default: { outline: "none", transition: "all 250ms" },
                                hover: { fill: isHighlighted ? "#1d57cc" : "#333", outline: "none", cursor: "crosshair", transition: "all 250ms" },
                                pressed: { outline: "none" },
                              }}
                            />`;

newContent = newContent.replace(oldMapGeo, newMapGeo);

// Add the tooltip render right after ComposableMap ends
const oldMapContainer = `                  </ComposableMap>
                </div>
              </div>`;
const newMapContainer = `                  </ComposableMap>
                  {mapTooltip && (
                    <div 
                      className="fixed z-50 bg-[#1a1a1a] border border-[#333] text-white text-xs px-3 py-1.5 rounded shadow-xl pointer-events-none transform -translate-x-1/2 -translate-y-full mt-[-10px]"
                      style={{ top: mapTooltip.y, left: mapTooltip.x }}
                    >
                      {mapTooltip.content}
                    </div>
                  )}
                </div>
              </div>`;
newContent = newContent.replace(oldMapContainer, newMapContainer);

fs.writeFileSync('src/app/page.tsx', newContent);
console.log("Patched page.tsx successfully!");
