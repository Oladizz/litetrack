import re
with open('/home/rabiuoladizz/litetrack/api/src/telegram.ts', 'r') as f:
    content = f.read()

# Make a function that just returns the string instead of sending
new_text = """
export async function getDailySummaryText() {
  const query = `
    SELECT 
      s.name as project,
      COUNT(DISTINCT e.visitor_id) as visitors,
      COUNT(e.event_id) as pageviews,
      APPROX_TOP_COUNT(e.country, 1)[OFFSET(0)].value as top_country
    FROM \\\`${DATASET}.events\\\` e
    JOIN \\\`${DATASET}.sites\\\` s ON e.site_id = s.site_id
    WHERE e.timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 24 HOUR)
    GROUP BY s.name
  `;
  
  try {
    const [rows] = await bq.query({ query });
    if (rows.length === 0) return "📭 No traffic in the last 24 hours.";

    let message = "📊 <b>Daily LiteTrack Summary</b>\\n\\n";
    rows.forEach(r => {
      message += `<b>${r.project}</b>\\n`;
      message += `• Visitors: ${r.visitors}\\n`;
      message += `• Pageviews: ${r.pageviews}\\n`;
      message += `• Top Location: ${r.top_country || 'Unknown'}\\n\\n`;
    });

    return message;
  } catch(e: any) {
    console.error(e);
    return `❌ Error: ${e.message}`;
  }
}
"""
content = content + new_text
with open('/home/rabiuoladizz/litetrack/api/src/telegram.ts', 'w') as f:
    f.write(content)

with open('/home/rabiuoladizz/litetrack/api/src/index.ts', 'r') as f:
    content2 = f.read()

content2 = content2.replace("import { sendDailySummary, sendHourlySummary } from './telegram';", "import { sendDailySummary, sendHourlySummary, getDailySummaryText } from './telegram';")

new_endpoint = """
app.get('/api/bot/daily-text', async (c) => {
  const text = await getDailySummaryText();
  return c.json({ text });
});
"""
content2 = content2.replace("app.get('/api/cron/telegram/hourly'", new_endpoint + "\\napp.get('/api/cron/telegram/hourly'")

with open('/home/rabiuoladizz/litetrack/api/src/index.ts', 'w') as f:
    f.write(content2)
print("Patched litetrack api")
