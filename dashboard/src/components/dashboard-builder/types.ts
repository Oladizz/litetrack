export type WidgetType = 
  | 'kpi'
  | 'metric_comparison'
  | 'chart_line'
  | 'chart_area'
  | 'chart_bar'
  | 'chart_horizontal_bar'
  | 'chart_pie'
  | 'chart_donut'
  | 'chart_radar'
  | 'chart_scatter'
  | 'chart_funnel'
  | 'chart_gauge'
  | 'table'
  | 'activity_feed'
  | 'timeline'
  | 'calendar'
  | 'kanban'
  | 'map'
  | 'progress'
  | 'ai_summary'
  | 'markdown'
  | 'embed'
  | 'image'
  | 'alert';

export interface WidgetConfig {
  id: string;
  type: WidgetType;
  title: string;
  subtitle?: string;
  icon?: string;
  w: number; // grid columns width (1-12)
  h: number; // height units
  x?: number;
  y?: number;
  locked?: boolean;
  hidden?: boolean;
  dataSource?: string;
  refreshInterval?: number; // seconds
  colorScheme?: string;
  thresholds?: { min?: number; max?: number; color?: string }[];
  clickAction?: 'drilldown' | 'navigate' | 'modal' | 'none';
  customProps?: Record<string, any>;
}

export interface DashboardTemplate {
  id: string;
  name: string;
  category: 'Executive' | 'Sales' | 'Finance' | 'Operations' | 'Marketing' | 'Support' | 'School' | 'Healthcare' | 'Crypto';
  description: string;
  icon: string;
  widgets: WidgetConfig[];
}

export interface DashboardState {
  id: string;
  title: string;
  description: string;
  owner: string;
  lastUpdated: string;
  isLive: boolean;
  isFavorite: boolean;
  locked: boolean;
  widgets: WidgetConfig[];
  globalFilters: {
    dateRange: string;
    comparePeriod: string;
    region?: string;
    status?: string;
    autoRefresh: number; // 0 = off, 10, 30, 60 sec
  };
}
