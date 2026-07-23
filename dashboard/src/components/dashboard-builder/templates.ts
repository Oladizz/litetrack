import { DashboardTemplate } from './types';

export const PRESET_TEMPLATES: DashboardTemplate[] = [
  {
    id: 'executive',
    name: 'Executive CEO Overview',
    category: 'Executive',
    description: 'High-level business performance metrics, total revenue trends, and AI-driven executive summary.',
    icon: '👑',
    widgets: [
      { id: 'w_kpi_rev', type: 'kpi', title: 'Gross Revenue', w: 3, h: 2, customProps: { value: '$124,500', trend: '+14.2%', sparkline: [40, 65, 80, 95, 120] } },
      { id: 'w_kpi_users', type: 'kpi', title: 'Active Subscribers', w: 3, h: 2, customProps: { value: '18,420', trend: '+8.1%', sparkline: [30, 45, 55, 70, 85] } },
      { id: 'w_kpi_margin', type: 'kpi', title: 'Net Margin', w: 3, h: 2, customProps: { value: '38.5%', trend: '+2.4%', sparkline: [35, 36, 37, 38, 38.5] } },
      { id: 'w_kpi_nps', type: 'kpi', title: 'NPS Score', w: 3, h: 2, customProps: { value: '74 / 100', trend: '+5 pts', sparkline: [65, 68, 70, 72, 74] } },
      { id: 'w_ai_summary', type: 'ai_summary', title: 'AI Executive Brief', w: 6, h: 3 },
      { id: 'w_rev_chart', type: 'chart_area', title: 'Revenue vs Operating Cost', w: 6, h: 3 },
    ]
  },
  {
    id: 'sales',
    name: 'Sales & Deal Pipeline',
    category: 'Sales',
    description: 'Lead conversions, deal velocity, regional sales map, and top sales reps leaderboard.',
    icon: '💰',
    widgets: [
      { id: 'w_sales_funnel', type: 'chart_funnel', title: 'Sales Conversion Funnel', w: 6, h: 3 },
      { id: 'w_sales_map', type: 'map', title: 'Global Customer Revenue Map', w: 6, h: 3 },
      { id: 'w_kanban_deals', type: 'kanban', title: 'Deal Pipeline Stages', w: 12, h: 4 },
    ]
  },
  {
    id: 'crypto',
    name: 'Crypto Treasury & Liquidity',
    category: 'Crypto',
    description: 'Total Value Locked (TVL), wallet transaction stream, gas fee trackers, and yield pools.',
    icon: '⚡',
    widgets: [
      { id: 'w_tvl', type: 'kpi', title: 'Total Value Locked (TVL)', w: 4, h: 2, customProps: { value: '$42.8M', trend: '+18.5%' } },
      { id: 'w_btc', type: 'kpi', title: 'BTC Reserve', w: 4, h: 2, customProps: { value: '1,250 BTC', trend: '+5.0%' } },
      { id: 'w_eth', type: 'kpi', title: 'ETH Staked', w: 4, h: 2, customProps: { value: '14,800 ETH', trend: '+12.1%' } },
      { id: 'w_alert_sys', type: 'alert', title: 'Smart Contract & Network Health', w: 12, h: 2 },
    ]
  },
  {
    id: 'school',
    name: 'School Management & Attendance',
    category: 'School',
    description: 'Student attendance rates, grade point distributions, teacher schedules, and events calendar.',
    icon: '🎓',
    widgets: [
      { id: 'w_attend', type: 'kpi', title: 'Overall Student Attendance', w: 4, h: 2, customProps: { value: '96.2%', trend: '+1.1%' } },
      { id: 'w_students', type: 'kpi', title: 'Total Enrolled Students', w: 4, h: 2, customProps: { value: '1,450', trend: 'Fixed' } },
      { id: 'w_teachers', type: 'kpi', title: 'Active Faculty', w: 4, h: 2, customProps: { value: '88', trend: 'Fixed' } },
      { id: 'w_cal_events', type: 'calendar', title: 'Academic Calendar & Exams', w: 12, h: 4 },
    ]
  }
];
