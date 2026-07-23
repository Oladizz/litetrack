import { CopilotResponse } from './types';

export function runCopilotQuery(prompt: string): CopilotResponse {
  const q = prompt.trim().toLowerCase();

  if (q.includes('why did revenue drop') || q.includes('sales drop')) {
    return {
      answer: 'Revenue dropped 14.2% primarily due to a 22% dip in returning customer transactions in Lagos between 2:00 PM and 6:00 PM yesterday. New user signups remained stable (+3.1%).',
      sqlQuery: 'SELECT DATE_TRUNC(timestamp, HOUR) as hr, SUM(revenue) FROM litetrack.events WHERE type="purchase" GROUP BY 1 ORDER BY 1 DESC;',
      dataSummary: { dropFactor: 'Returning Users', region: 'Lagos', timeWindow: '14:00 - 18:00' }
    };
  }

  if (q.includes('how many new users') || q.includes('users joined')) {
    return {
      answer: 'A total of 428 new users registered today across all active sites (+18.4% compared to yesterday).',
      sqlQuery: 'SELECT COUNT(DISTINCT visitor_id) FROM litetrack.events WHERE DATE(timestamp) = CURRENT_DATE();'
    };
  }

  if (q.includes('summarize today') || q.includes('summary')) {
    return {
      answer: 'Today’s Performance Brief: Total revenue reached $12,490 across 340 completed orders. Average order value is $36.70. System health is 99.99% with 0 API downtime.',
      emailDraft: 'Subject: Daily Performance Update\nHi Team,\nToday’s gross revenue reached $12,490 with 340 completed transactions. Systems remain 100% operational.'
    };
  }

  return {
    answer: `Platform Copilot Analyzed Query: "${prompt}". All platform telemetry metrics indicate 99.99% system stability and active data streaming.`
  };
}
