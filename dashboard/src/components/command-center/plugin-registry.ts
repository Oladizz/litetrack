import { CommandItem, SearchProvider } from './types';
import { toast } from '@/components/ui/toast';
import { EntityGraph, EntityDefinition } from '@/lib/entity-graph';

class PluginSearchRegistry {
  private providers: SearchProvider[] = [];
  // Store real dynamic data
  private dataStore: Record<string, any[]> = {};

  public registerSearch(provider: SearchProvider) {
    this.providers.push(provider);
  }
  
  public injectData(entityType: string, data: any[]) {
    this.dataStore[entityType] = data;
  }
  
  public getData(entityType: string): any[] {
    return this.dataStore[entityType] || [];
  }

  public getProviders(): SearchProvider[] {
    return this.providers;
  }

  public searchAll(query: string, userRole: string = 'admin'): CommandItem[] {
    let results: CommandItem[] = [];

    // Also include a global command parser (e.g., "> Suspend User")
    if (query.startsWith('>')) {
      return this.parseActionCommand(query);
    }

    for (const provider of this.providers) {
      const providerResults = provider.search(query, userRole);
      // Filter out unauthorized commands by RBAC
      const authorizedResults = providerResults.filter(item => {
        if (!item.requiredRole) return true;
        if (userRole === 'admin' || userRole === 'superadmin') return true;
        return item.requiredRole === userRole;
      });
      results = [...results, ...authorizedResults];
    }

    return results;
  }

  private parseActionCommand(query: string): CommandItem[] {
    const actionQuery = query.substring(1).trim().toLowerCase();
    const results: CommandItem[] = [];

    Object.values(EntityGraph).forEach((entity: EntityDefinition) => {
      entity.actions.forEach(action => {
        const fullActionName = `${action} ${entity.label}`.toLowerCase();
        if (fullActionName.includes(actionQuery) || action.toLowerCase().includes(actionQuery)) {
          results.push({
            id: `action_${entity.type}_${action.replace(/\s+/g, '_')}`,
            title: `${action} ${entity.label}`,
            subtitle: `Global OS Action on ${entity.label}`,
            category: 'Action',
            icon: '⚡',
            perform: () => toast(`Executing: ${action} ${entity.label}`, { type: 'success' })
          });
        }
      });
    });

    return results;
  }
}

export const pluginRegistry = new PluginSearchRegistry();

Object.values(EntityGraph).forEach((entity: EntityDefinition) => {
  pluginRegistry.registerSearch({
    id: `${entity.type}_provider`.toLowerCase(),
    name: `${entity.label} Engine`,
    entityName: entity.label,
    commands: entity.actions.map(action => ({
      id: `cmd_${entity.type}_${action.replace(/\s+/g, '_')}`.toLowerCase(),
      title: `${action} ${entity.label}`,
      category: 'Action',
      icon: '⚡',
      perform: () => toast(`Action Triggered: ${action} ${entity.label}`, { type: 'info' })
    })),
    search: (query: string) => {
      const q = query.toLowerCase();
      if (!q && query !== '') return [];

      // Fetch real data injected into the registry
      const realData = pluginRegistry.getData(entity.type);

      return realData
        .filter(d => d.label.toLowerCase().includes(q) || (d.metadata && d.metadata.toLowerCase().includes(q)))
        .map(d => ({
          id: d.id,
          title: d.label,
          subtitle: d.metadata || 'No details',
          category: 'Entity',
          icon: entity.icon === 'Users' ? '👤' : entity.icon === 'ShoppingCart' ? '🛒' : entity.icon === 'Package' ? '📦' : '📄',
          status: d.status || 'active',
          metadata: d,
          perform: () => {
             if (d.url) {
                // If the data provides a URL, use standard navigation
                window.location.href = d.url;
             } else {
                toast(`Opened ${entity.label}: ${d.label}`, { type: 'info' });
             }
          },
          quickActions: entity.actions.map(action => ({
            label: action,
            action: () => toast(`${action} executed on ${d.label}`, { type: 'success' })
          }))
        }));
    }
  });
});
