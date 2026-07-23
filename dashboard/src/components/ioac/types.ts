export type IdentityType = 'user' | 'admin' | 'customer' | 'teacher' | 'student' | 'company' | 'api_key' | 'ai_agent' | 'service_account' | 'bot';

export type PermissionAction = 'read' | 'create' | 'update' | 'delete' | 'export' | 'import' | 'approve' | 'archive' | 'share' | 'manage';

export interface FieldPermission {
  fieldId: string;
  fieldLabel: string;
  allowed: boolean;
}

export interface DynamicRole {
  id: string;
  name: string;
  description: string;
  isSystem?: boolean;
  actions: PermissionAction[];
  fieldPermissions?: FieldPermission[];
  hiddenNavRoutes?: string[];
  hiddenWidgets?: string[];
}

export interface IFPolicyRule {
  id: string;
  name: string;
  conditionField: string;
  operator: '>' | '<' | '=' | '!=' | 'contains' | 'not_equals';
  conditionValue: string;
  actionEffect: 'require_approval' | 'disable_withdrawal' | 'hide_billing' | 'block_access';
  isActive: boolean;
}

export interface UserSession {
  id: string;
  device: string;
  ipLocation: string;
  lastActive: string;
  isCurrent: boolean;
}

export interface IdentityRecord {
  id: string;
  name: string;
  email: string;
  type: IdentityType;
  roleId: string;
  roleName: string;
  status: 'active' | 'pending' | 'suspended' | 'disabled';
  avatarUrl?: string;
  riskScore: number; // 1-100
  sessions: UserSession[];
  mfaEnabled: boolean;
  apiKeyCount?: number;
  aiAgentScoped?: boolean;
  created: string;
}

export interface Organization {
  id: string;
  name: string;
  logo?: string;
  timezone: string;
  currency: string;
  invitePolicy: 'open' | 'admin_only' | 'domain_match';
}

export interface Workspace {
  id: string;
  name: string;
  category: 'Analytics' | 'Admin' | 'Developer' | 'Support' | 'Finance';
  icon: string;
  allowedRoles: string[];
}

export interface Team {
  id: string;
  name: string;
  memberCount: number;
  workspaceId: string;
}
