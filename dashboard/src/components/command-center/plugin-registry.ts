import { CommandItem, SearchProvider } from './types';
import { toast } from '@/components/ui/toast';

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
}

export const pluginRegistry = new PluginSearchRegistry();

// REGISTER DEFAULT ENTITY SEARCH PROVIDERS
pluginRegistry.registerSearch({
  id: 'users_provider',
  name: 'Users Engine',
  entityName: 'Users',
  commands: [
    {
      id: 'cmd_create_user',
      title: 'Create New User Account',
      category: 'Action',
      icon: '👤',
      perform: () => toast('User creation modal opened', { type: 'info' })
    }
  ],
  search: (query: string) => {
    const mockUsers = [
      { id: 'u1', name: 'John Doe', email: 'john@gmail.com', role: 'Admin', status: 'active', country: 'Nigeria' },
      { id: 'u2', name: 'Sarah Connor', email: 'sarah@cyberdyne.com', role: 'Editor', status: 'pending', country: 'United States' },
      { id: 'u3', name: 'Rabiu Oladizz', email: 'oladizz.dev@gmail.com', role: 'Super Admin', status: 'active', country: 'Nigeria' }
    ];

    const q = query.toLowerCase();
    return mockUsers
      .filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.role.toLowerCase().includes(q))
      .map(u => ({
        id: `user_${u.id}`,
        title: u.name,
        subtitle: `${u.email} · ${u.country}`,
        category: 'Entity',
        icon: '👤',
        status: u.status,
        badge: u.role,
        metadata: u,
        perform: () => toast(`Viewing user ${u.name}`, { type: 'info' }),
        quickActions: [
          { label: 'View Profile', action: () => toast(`Opened ${u.name} Profile`, { type: 'info' }) },
          { label: 'Copy Email', action: () => { navigator.clipboard.writeText(u.email); toast(`Copied ${u.email}`, { type: 'success' }); } }
        ]
      }));
  }
});

pluginRegistry.registerSearch({
  id: 'orders_provider',
  name: 'Orders & Sales Engine',
  entityName: 'Orders',
  commands: [
    {
      id: 'cmd_export_orders',
      title: 'Export Orders to CSV',
      category: 'Action',
      icon: '📊',
      perform: () => toast('Orders exported to CSV', { type: 'success' })
    }
  ],
  search: (query: string) => {
    const mockOrders = [
      { id: 'ord_9481', title: 'Order #ORD-9481', amount: '$1,450', status: 'completed', date: 'Today' },
      { id: 'ord_8392', title: 'Order #ORD-8392', amount: '$3,800', status: 'pending', date: 'Yesterday' }
    ];

    const q = query.toLowerCase();
    return mockOrders
      .filter(o => o.title.toLowerCase().includes(q) || o.amount.includes(q))
      .map(o => ({
        id: o.id,
        title: o.title,
        subtitle: `Total Amount: ${o.amount} · Created ${o.date}`,
        category: 'Entity',
        icon: '🛒',
        status: o.status,
        metadata: o,
        perform: () => toast(`Viewing ${o.title}`, { type: 'info' })
      }));
  }
});
