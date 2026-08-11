/**
 * Universal Entity Graph Definition
 * Defines the core entities for the Admin OS and their relationships.
 */

export type EntityType = 
  | 'Application'
  | 'User'
  | 'Organization'
  | 'Transaction'
  | 'Event'
  | 'Session'
  | 'Device'
  | 'APIRequest'
  | 'Log'
  | 'Error'
  | 'Subscription'
  | 'File'
  | 'Report'
  | 'Workflow'
  | 'Collection'
  | 'CustomData';

// Standard structure every entity in the OS must follow conceptually
export interface CoreEntity {
  id: string;
  created_at: string;
  updated_at: string;
  status: 'active' | 'inactive' | 'pending' | 'suspended' | 'error' | 'archived' | string;
  metadata: Record<string, any>;
  relationships: Record<string, string[]>; // e.g. { "transactions": ["tx-1", "tx-2"] }
}

export interface EntityDefinition {
  type: EntityType;
  label: string;
  description: string;
  icon: string;
  
  // Defined relationships to other entities in the system
  hasMany: EntityType[];
  belongsTo: EntityType[];
  
  // What actions an admin can perform on this entity type
  actions: string[];
}

export const EntityGraph: Record<string, EntityDefinition> = {
  Application: {
    type: 'Application',
    label: 'Application',
    description: 'A connected project or application being managed.',
    icon: 'Package',
    hasMany: ['User', 'Event', 'Transaction', 'Log', 'Error'],
    belongsTo: ['Organization'],
    actions: ['Configure', 'Deploy', 'View Logs', 'Manage Users', 'Manage API Keys', 'Disable']
  },
  User: {
    type: 'User',
    label: 'User',
    description: 'An individual account or human actor.',
    icon: 'Users',
    hasMany: ['Session', 'Event', 'Transaction', 'Device', 'Log'],
    belongsTo: ['Application', 'Organization'],
    actions: ['View', 'Edit', 'Suspend', 'Change Role', 'Reset Settings', 'View Activity']
  },
  Transaction: {
    type: 'Transaction',
    label: 'Transaction',
    description: 'A financial or value exchange record.',
    icon: 'ShoppingCart',
    hasMany: ['Event', 'Log'],
    belongsTo: ['User', 'Application'],
    actions: ['View', 'Refund', 'Flag', 'Export', 'Investigate']
  },
  Event: {
    type: 'Event',
    label: 'Event',
    description: 'A discrete action that occurred in the system.',
    icon: 'Activity',
    hasMany: [],
    belongsTo: ['User', 'Session', 'Application'],
    actions: ['View', 'Export']
  },
  Session: {
    type: 'Session',
    label: 'Session',
    description: 'A period of active engagement by a user.',
    icon: 'KeyRound',
    hasMany: ['Event'],
    belongsTo: ['User', 'Device'],
    actions: ['View', 'Revoke']
  },
  Error: {
    type: 'Error',
    label: 'Error',
    description: 'A system failure or exception.',
    icon: 'AlertTriangle',
    hasMany: ['Log'],
    belongsTo: ['Application', 'Session'],
    actions: ['View', 'Acknowledge', 'Resolve', 'Assign']
  },
  Collection: {
    type: 'Collection',
    label: 'Collection',
    description: 'A custom database collection (e.g., Products, Courses).',
    icon: 'Database',
    hasMany: ['CustomData'],
    belongsTo: ['Application'],
    actions: ['View', 'Edit Schema', 'Export', 'Truncate']
  }
};
