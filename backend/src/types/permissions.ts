// Base Permission Types
export enum PermissionAction {
  CREATE = "create",
  READ = "read",
  UPDATE = "update",
  DELETE = "delete",
  MANAGE = "manage",
}

export enum PermissionResource {
  WORKSPACE = "workspace",
  TEAM = "team",
  MEMBER = "member",
  ROLE = "role",
  ATTENDANCE = "attendance",
  LEAVE = "leave",
  PERFORMANCE = "performance",
  SETTINGS = "settings",
  REPORT = "report",
}

export type PermissionScope = "all" | "team" | "self";

// Custom Role Configuration
export interface Permission {
  action: PermissionAction;
  resource: PermissionResource;
  scope: PermissionScope;
}

export interface PermissionRule extends Permission {
  conditions?: Record<string, any>;
}

export interface CustomRole {
  id: string;
  workspaceId: string;
  name: string;
  displayName: string;
  description?: string;
  permissions: Permission[];
  precedence: number;
  isCustom: boolean;
  metadata?: Record<string, any>;
}

export const MANAGER_PERMISSIONS = {
  // Manager's own permissions
  self: [
    "department:manage",
    "team:create",
    "team:manage",
    "member:manage",
    "report:view",
    "report:create",
    "lead:assign",
    "lead:permissions",
  ],

  // Permissions they can delegate to Team Leads
  delegatable: [
    "team:manage",
    "member:manage",
    "report:view",
    "task:assign",
    "attendance:manage",
  ],
};

export const MANAGER_DELEGATABLE_PERMISSIONS = [
  "team:manage",
  "member:manage",
  "report:view",
  "task:assign",
  "attendance:manage",
];

export const ROLE_PERMISSIONS = {
  WORKSPACE_OWNER: ["*"],
  WORKSPACE_ADMIN: ["workspace:*", "team:*", "user:*", "role:*"],
  MANAGER: ["team:*", "member:*", "role:delegate", "report:*"],
  TEAM_LEAD: ["team:manage", "member:manage", "report:view"],
  MEMBER: ["team:view", "profile:manage"],
};
