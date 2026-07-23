export type CellType = 
  | 'text'
  | 'number'
  | 'currency'
  | 'percentage'
  | 'progress'
  | 'status'
  | 'badge'
  | 'avatar'
  | 'tags'
  | 'rating'
  | 'date'
  | 'toggle'
  | 'image'
  | 'file'
  | 'json'
  | 'code'
  | 'link'
  | 'action_button';

export type StatusValue = 'active' | 'disabled' | 'pending' | 'suspended' | 'verified' | 'failed' | 'completed';

export interface ColumnDef {
  id: string;
  label: string;
  type: CellType;
  width?: number;
  pinned?: 'left' | 'right' | false;
  visible?: boolean;
  editable?: boolean;
  sortable?: boolean;
  filterable?: boolean;
  formatOptions?: {
    currencySymbol?: string;
    dateFormat?: string;
    maxRating?: number;
    codeLanguage?: string;
  };
}

export interface SearchOperator {
  key: string;
  value: string;
  raw: string;
}

export interface SavedView {
  id: string;
  name: string;
  icon?: string;
  query?: string;
  filters?: Record<string, any>;
  sorts?: { columnId: string; direction: 'asc' | 'desc' }[];
  visibleColumns?: string[];
  isDefault?: boolean;
}

export interface FilterRule {
  id: string;
  field: string;
  operator: '>' | '<' | '=' | '!=' | 'contains' | 'between' | 'in' | 'is_empty' | 'is_not_empty';
  value: any;
}

export interface AuditRecord {
  id: string;
  recordId: string;
  action: 'create' | 'update' | 'delete' | 'import' | 'bulk_edit';
  performedBy: string;
  timestamp: string;
  changes?: Record<string, { old: any; new: any }>;
  ipAddress?: string;
  source: 'UI' | 'API' | 'SYSTEM';
}

export interface UniversalEntity {
  id: string;
  title: string;
  description: string;
  icon?: string;
  columns: ColumnDef[];
  rows: Record<string, any>[];
  savedViews?: SavedView[];
  totalCount: number;
  lastUpdated: string;
  synced: boolean;
  breadcrumbs?: { label: string; href?: string }[];
}
