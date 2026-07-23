export type LayoutMode = 'sidebar' | 'top_nav' | 'split_view' | 'three_column' | 'workspace' | 'fullscreen';

export type EnvironmentType = 'development' | 'staging' | 'production' | 'sandbox';

export interface PlatformApp {
  id: string;
  name: string;
  category: string;
  icon: string;
  status: 'active' | 'inactive' | 'draft';
  version: string;
  layoutMode: LayoutMode;
  enabledModules: string[];
  domainName: string;
}

export interface PlatformModule {
  id: string;
  name: string;
  description: string;
  category: string;
  enabled: boolean;
  dependsOn?: string[];
}

export interface NavItem {
  id: string;
  label: string;
  route: string;
  icon: string;
  badge?: string;
  requiredRole?: string;
  children?: NavItem[];
}

export interface ThemeConfig {
  primaryColor: string;
  accentColor: string;
  fontFamily: string;
  borderRadiusPx: number;
  density: 'compact' | 'comfortable' | 'spacious';
  mode: 'dark' | 'light' | 'system';
}

export interface FeatureFlag {
  id: string;
  name: string;
  key: string;
  description: string;
  enabled: boolean;
  rolloutPercentage: number; // 0 - 100
  targetRole?: string;
  targetRegion?: string;
}

export interface PlatformBlueprint {
  id: string;
  title: string;
  description: string;
  industry: 'Education' | 'E-Commerce' | 'Fintech' | 'Repair Shop' | 'SaaS Admin';
  icon: string;
  modulesCount: number;
  navItemsCount: number;
  presetTheme: string;
}

export interface PublishingPipeline {
  version: string;
  status: 'draft' | 'review' | 'approved' | 'published';
  author: string;
  changesSummary: string;
  timestamp: string;
}
