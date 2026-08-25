const fs = require('fs');
let content = fs.readFileSync('src/app/(dashboard)/dashboards/[id]/page.tsx', 'utf8');

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

content = content.replace(
  `              ))}
            </div>
          </div>
        </div>
      </Modal>`,
  `              ))}
            </div>
          </div>
${extraUI}
        </div>
      </Modal>`
);

fs.writeFileSync('src/app/(dashboard)/dashboards/[id]/page.tsx', content);
