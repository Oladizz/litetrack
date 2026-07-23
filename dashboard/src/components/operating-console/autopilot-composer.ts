import { AutopilotExecution, UIIntention, SelfAwarenessContext } from './types';
import { intentionEngine } from './ui-intention-engine';

export function runAutopilotInstruction(instruction: string, context: SelfAwarenessContext): AutopilotExecution {
  const q = instruction.trim().toLowerCase();
  const intentions: UIIntention[] = [];
  let summary = '';
  let temporaryPageCreated = false;

  // 1. "Why are sales dropping?" -> Root Cause Dashboard Composer
  if (q.includes('why are sales dropping') || q.includes('sales dropping')) {
    intentions.push(
      { id: 'i1', type: 'changeFilter', payload: { dateRange: '30d' }, description: 'Zoomed date range to Last 30 Days', timestamp: new Date().toISOString() },
      { id: 'i2', type: 'createWidget', payload: { title: 'Revenue Trend Breakdown', type: 'chart_area', w: 6 }, description: 'Inserted Revenue Trend Chart', timestamp: new Date().toISOString() },
      { id: 'i3', type: 'createWidget', payload: { title: 'Sales Conversion Funnel', type: 'chart_funnel', w: 6 }, description: 'Inserted Conversion Funnel Chart', timestamp: new Date().toISOString() },
      { id: 'i4', type: 'createWidget', payload: { title: 'Regional Traffic Sources', type: 'map', w: 6 }, description: 'Inserted Regional Traffic Heatmap', timestamp: new Date().toISOString() },
      { id: 'i5', type: 'moveWidget', payload: { targetId: 'w_rev_chart', position: 'top_left' }, description: 'Promoted Revenue Chart to Top-Left Priority Position', timestamp: new Date().toISOString() }
    );
    summary = 'I rearranged the dashboard to focus on the key factors affecting sales: Revenue Trend, Conversion Funnel, and Regional Traffic Sources.';
  }

  // 2. "Show me everything about John Doe" -> Dynamic Single Entity Workspace
  else if (q.includes('everything about john doe') || q.includes('john doe')) {
    temporaryPageCreated = true;
    intentions.push(
      { id: 'i1', type: 'createPage', payload: { title: 'Workspace: John Doe Investigation' }, description: 'Generated Temporary Entity Workspace for John Doe', timestamp: new Date().toISOString() },
      { id: 'i2', type: 'createWidget', payload: { title: 'Profile & Attributes', type: 'kpi', w: 4 }, description: 'Added User Profile Card', timestamp: new Date().toISOString() },
      { id: 'i3', type: 'createWidget', payload: { title: 'Order History & Receipts', type: 'table', w: 8 }, description: 'Added Orders DataGrid Widget', timestamp: new Date().toISOString() },
      { id: 'i4', type: 'createWidget', payload: { title: 'Activity Stream & IP Logs', type: 'activity_feed', w: 6 }, description: 'Added Real-Time Activity Feed Widget', timestamp: new Date().toISOString() },
      { id: 'i5', type: 'createWidget', payload: { title: 'Wallet Balance & Payments', type: 'kpi', w: 6 }, description: 'Added Crypto/Fiat Wallet Card', timestamp: new Date().toISOString() }
    );
    summary = 'Composed a unified 360° investigation page for John Doe (Profile, Orders, Activity Feed, Wallet Balance).';
  }

  // 3. "Create a Fraud Analysis section" -> Intelligent Section Creator
  else if (q.includes('fraud analysis') || q.includes('fraud')) {
    intentions.push(
      { id: 'i1', type: 'createSection', payload: { title: 'Fraud & Velocity Checks Section' }, description: 'Created Fraud Analysis Section Header', timestamp: new Date().toISOString() },
      { id: 'i2', type: 'createWidget', payload: { title: 'Suspicious Users & IP Flags', type: 'table', w: 6 }, description: 'Added Suspicious Users Table Widget', timestamp: new Date().toISOString() },
      { id: 'i3', type: 'createWidget', payload: { title: 'Failed Login Velocity', type: 'chart_bar', w: 6 }, description: 'Added Failed Logins Velocity Chart', timestamp: new Date().toISOString() },
      { id: 'i4', type: 'createWidget', payload: { title: 'High-Risk System Alerts', type: 'alert', w: 12 }, description: 'Added High-Risk Alert Cards', timestamp: new Date().toISOString() }
    );
    summary = 'Built a dedicated Fraud Analysis section with Suspicious Users, Login Velocity, and High-Risk Alert Monitors.';
  }

  // 4. "Compare Lagos and Abuja customers" -> Temporary Comparison Page
  else if (q.includes('compare lagos and abuja') || q.includes('lagos and abuja')) {
    temporaryPageCreated = true;
    intentions.push(
      { id: 'i1', type: 'createPage', payload: { title: 'Comparison: Lagos vs Abuja' }, description: 'Generated Temporary Regional Comparison Page', timestamp: new Date().toISOString() },
      { id: 'i2', type: 'createWidget', payload: { title: 'Lagos Revenue ($84,200)', type: 'kpi', w: 6 }, description: 'Added Lagos Metric Card', timestamp: new Date().toISOString() },
      { id: 'i3', type: 'createWidget', payload: { title: 'Abuja Revenue ($42,100)', type: 'kpi', w: 6 }, description: 'Added Abuja Metric Card', timestamp: new Date().toISOString() },
      { id: 'i4', type: 'createWidget', payload: { title: 'Regional Revenue Map', type: 'map', w: 12 }, description: 'Added Regional Map Heatmap', timestamp: new Date().toISOString() }
    );
    summary = 'Composed a side-by-side comparative workspace comparing Lagos ($84.2k) vs Abuja ($42.1k) revenue & retention.';
  }

  // 5. Default Autopilot Intent Execution
  else {
    intentions.push(
      { id: 'i1', type: 'changeChart', payload: { style: 'heatmap' }, description: `Executed Autopilot Intention: "${instruction}"`, timestamp: new Date().toISOString() }
    );
    summary = `Autopilot evaluated and applied interface updates for: "${instruction}".`;
  }

  // Execute all intentions through the Intent Execution Engine
  for (const intent of intentions) {
    intentionEngine.executeIntention(intent, context);
  }

  return {
    intentions,
    summary,
    temporaryPageCreated
  };
}
