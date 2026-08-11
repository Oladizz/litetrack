import { ColumnDef } from '@/components/data-manager/types';

// ==========================================
// 1. TEMPLATES (Starting layouts & structures)
// ==========================================

export interface TemplateDefinition {
  id: string;
  name: string;
  description: string;
  type: 'resource_manager' | 'dashboard' | 'settings' | 'directory' | 'timeline' | 'kanban';
  // What tools this template uses by default
  tools: string[]; 
}

export const TemplateLibrary: Record<string, TemplateDefinition> = {
  resource_manager: {
    id: 'resource_manager',
    name: 'Resource Manager',
    description: 'Standard table and form for managing any database collection.',
    type: 'resource_manager',
    tools: ['table', 'search', 'filters', 'create_form', 'edit_form', 'delete_action', 'export_action']
  },
  user_directory: {
    id: 'user_directory',
    name: 'User Directory',
    description: 'Specialized layout for managing people, accounts, or customers.',
    type: 'directory',
    tools: ['avatar_grid', 'table', 'search', 'role_filter', 'status_badge', 'profile_viewer']
  },
  analytics_dashboard: {
    id: 'analytics_dashboard',
    name: 'Analytics Dashboard',
    description: 'High-level overview of metrics, charts, and key performance indicators.',
    type: 'dashboard',
    tools: ['stats_header', 'revenue_chart', 'growth_chart', 'quick_actions']
  },
  settings_panel: {
    id: 'settings_panel',
    name: 'Settings Panel',
    description: 'Configuration layout with sections, toggles, and form inputs.',
    type: 'settings',
    tools: ['sidebar_nav', 'toggles', 'input_forms', 'save_action']
  },
  activity_logs: {
    id: 'activity_logs',
    name: 'Activity Logs',
    description: 'Chronological timeline of events or audit trails.',
    type: 'timeline',
    tools: ['timeline_view', 'date_filter', 'event_details', 'user_attribution']
  },
  kanban_board: {
    id: 'kanban_board',
    name: 'Kanban Board',
    description: 'Visual drag-and-drop board for tracking statuses (orders, tasks).',
    type: 'kanban',
    tools: ['drag_drop_board', 'swimlanes', 'card_editor', 'search']
  }
};

// ==========================================
// 2. PROJECT CONFIG (How templates are used)
// ==========================================

export interface PageConfig {
  id: string; // The URL path, e.g. 'products'
  title: string;
  description: string;
  templateId: string; // Maps to TemplateLibrary
  
  // Specific configuration for this template instance
  config: {
    collectionName?: string;
    columns?: ColumnDef[];
    [key: string]: any;
  };
}

export interface ProjectConfig {
  projectId: string;
  pages: PageConfig[];
}

// Simulated default project config (this would normally come from the DB)
export const DefaultProjectConfig: ProjectConfig = {
  projectId: 'default',
  pages: [
    {
      id: 'overview',
      title: 'Overview',
      description: 'Your project performance at a glance.',
      templateId: 'analytics_dashboard',
      config: {}
    },
    {
      id: 'users',
      title: 'Users & Customers',
      description: 'Manage accounts across your application.',
      templateId: 'user_directory',
      config: {
        collectionName: 'users',
        columns: [
          { id: 'id', label: 'ID', type: 'link', sortable: true },
          { id: 'name', label: 'Name', type: 'avatar', sortable: true },
          { id: 'email', label: 'Email', type: 'text', sortable: true },
          { id: 'role', label: 'Role', type: 'badge', sortable: true },
          { id: 'status', label: 'Status', type: 'status', sortable: true },
        ]
      }
    },
    {
      id: 'products',
      title: 'Inventory',
      description: 'Manage standard resources.',
      templateId: 'resource_manager',
      config: {
        collectionName: 'products',
        columns: [
          { id: 'id', label: 'ID', type: 'link', sortable: true },
          { id: 'name', label: 'Name', type: 'text', sortable: true },
          { id: 'price', label: 'Price', type: 'currency', sortable: true, formatOptions: { currencySymbol: '$' } },
          { id: 'stock', label: 'Stock', type: 'number', sortable: true },
        ]
      }
    },
    {
      id: 'fulfillment',
      title: 'Order Fulfillment',
      description: 'Track orders visually through fulfillment stages.',
      templateId: 'kanban_board',
      config: {
        collectionName: 'orders',
        statusField: 'status'
      }
    },
    {
      id: 'audit',
      title: 'System Logs',
      description: 'Track system and user activity over time.',
      templateId: 'activity_logs',
      config: {
        collectionName: 'logs',
        dateField: 'createdAt'
      }
    }
  ]
};
