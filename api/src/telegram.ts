import { BigQuery } from '@google-cloud/bigquery';

const bq = new BigQuery();
const DATASET = 'litetrack';

const TELEGRAM_API = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`;

async function sendTelegramMessage(chatId: string, text: string) {
  if (!process.env.TELEGRAM_BOT_TOKEN) {
    console.warn("TELEGRAM_BOT_TOKEN is not set.");
    return;
  }
  
  const res = await fetch(`${TELEGRAM_API}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' })
  });
  
  if (!res.ok) {
    console.error("Failed to send telegram message:", await res.text());
  }
}

export async function sendDailySummary(chatId: string) {
  const query = `
    SELECT 
      s.name as project,
      COUNT(DISTINCT e.visitor_id) as visitors,
      COUNT(e.event_id) as pageviews,
      APPROX_TOP_COUNT(e.country, 1)[OFFSET(0)].value as top_country
    FROM \`${DATASET}.events\` e
    JOIN \`${DATASET}.sites\` s ON e.site_id = s.site_id
    WHERE e.timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 24 HOUR)
    GROUP BY s.name
  `;
  
  try {
    const [rows] = await bq.query({ query });
    if (rows.length === 0) return;

    let message = "📊 *Daily LiteTrack Summary*\n\n";
    rows.forEach(r => {
      message += `*${r.project}*\n`;
      message += `• Visitors: ${r.visitors}\n`;
      message += `• Pageviews: ${r.pageviews}\n`;
      message += `• Top Location: ${r.top_country || 'Unknown'}\n\n`;
    });

    await sendTelegramMessage(chatId, message);
  } catch(e) {
    console.error(e);
  }
}

export async function sendHourlySummary(chatId: string) {
  const query = `
    SELECT 
      s.name as project,
      COUNT(DISTINCT e.visitor_id) as visitors,
      APPROX_TOP_COUNT(e.country, 1)[OFFSET(0)].value as top_country
    FROM \`${DATASET}.events\` e
    JOIN \`${DATASET}.sites\` s ON e.site_id = s.site_id
    WHERE e.timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 1 HOUR)
    GROUP BY s.name
  `;
  
  try {
    const [rows] = await bq.query({ query });
    if (rows.length === 0) return;

    let message = "🕒 *Hourly Update*\n\n";
    rows.forEach(r => {
      message += `*${r.project}* just got *${r.visitors} new visitors* in the last hour! (Mostly from ${r.top_country || 'Unknown'})\n`;
    });

    await sendTelegramMessage(chatId, message);
  } catch(e) {
    console.error(e);
  }
}
