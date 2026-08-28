with open('api/src/index.ts', 'r') as f:
    content2 = f.read()

content2 = content2.replace("import { sendDailySummary, sendHourlySummary } from './telegram';", "import { sendDailySummary, sendHourlySummary, getDailySummaryText } from './telegram';")

new_endpoint = """
app.get('/api/bot/daily-text', async (c) => {
  const text = await getDailySummaryText();
  return c.json({ text });
});

"""

content2 = content2.replace("app.get('/api/cron/telegram/hourly'", new_endpoint + "app.get('/api/cron/telegram/hourly'")

with open('api/src/index.ts', 'w') as f:
    f.write(content2)
