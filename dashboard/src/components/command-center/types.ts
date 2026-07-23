export type CommandMode = 'search' | 'navigate' | 'action' | 'ai' | 'calculator' | 'favorites';

export interface CommandItem {
  id: string;
  title: string;
  subtitle?: string;
  category: 'Entity' | 'Navigation' | 'Action' | 'AI' | 'Calculator' | 'Favorite';
  icon?: string;
  avatarUrl?: string;
  status?: string;
  badge?: string;
  metadata?: Record<string, any>;
  mode?: CommandMode;
  shortcut?: string;
  requiredRole?: string; // RBAC Security check
  perform: () => void;
  quickActions?: {
    label: string;
    action: () => void;
    icon?: string;
  }[];
}

export interface SearchProvider {
  id: string;
  name: string;
  entityName: string;
  search: (query: string, userRole?: string) => CommandItem[];
  commands: CommandItem[];
}
