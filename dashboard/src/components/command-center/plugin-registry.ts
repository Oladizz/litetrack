import { CommandItem, SearchProvider } from './types';
import { toast } from '@/components/ui/toast';
import { EntityGraph, EntityDefinition } from '@/lib/entity-graph';

class PluginSearchRegistry {
  private providers: SearchProvider[] = [];

  public registerSearch(provider: SearchProvider) {
    this.providers.push(provider);
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

    // Loop through the Entity Graph to find matching actions
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

// -------------------------------------------------------------
// DYNAMICALLY REGISTER PROVIDERS BASED ON THE ENTITY GRAPH
// -------------------------------------------------------------

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
      // Skip if query is empty unless it's a global search
      if (!q && query !== '') return [];

      // Simulated Data for demonstration purposes based on the entity type
      const mockData: any[] = [];
      
      if (entity.type === 'User') {
        mockData.push(
          { id: 'u1', label: 'John Doe', metadata: 'john@gmail.com · Nigeria', status: 'active' },
          { id: 'u2', label: 'Sarah Connor', metadata: 'sarah@skynet.com · USA', status: 'pending' },
          { id: 'u3', label: 'Rabiu Oladizz', metadata: 'Super Admin · Nigeria', status: 'active' }
        );
      } else if (entity.type === 'Transaction') {
        mockData.push(
          { id: 'tx1', label: 'TX-9481', metadata: '$1,450 · John Doe', status: 'completed' },
          { id: 'tx2', label: 'TX-8392', metadata: '$3,800 · Sarah Connor', status: 'pending' }
        );
      } else if (entity.type === 'Application') {
        mockData.push(
          { id: 'app1', label: 'Oladizz Store', metadata: 'Production · e-commerce', status: 'active' },
          { id: 'app2', label: 'LiteTrack Analytics', metadata: 'Internal · dashboard', status: 'active' }
        );
      } else if (entity.type === 'Event') {
         mockData.push(
          { id: 'evt1', label: 'user.login', metadata: 'John Doe · 2 mins ago', status: 'success' },
          { id: 'evt2', label: 'payment.failed', metadata: 'TX-8392 · 1 hour ago', status: 'error' }
        );
      }

      // Filter and map to CommandItem format
      return mockData
        .filter(d => d.label.toLowerCase().includes(q) || d.metadata.toLowerCase().includes(q))
        .map(d => ({
          id: d.id,
          title: d.label,
          subtitle: d.metadata,
          category: 'Entity',
          icon: entity.icon === 'Users' ? '👤' : entity.icon === 'ShoppingCart' ? '🛒' : entity.icon === 'Package' ? '📦' : '📄',
          status: d.status,
          metadata: d,
          perform: () => toast(`Opening ${entity.label}: ${d.label}`, { type: 'info' }),
          quickActions: entity.actions.map(action => ({
            label: action,
            action: () => toast(`${action} executed on ${d.label}`, { type: 'success' })
          }))
        }));
    }
  });
});

