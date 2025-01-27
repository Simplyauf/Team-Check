import { Permission } from "./permissions";

export enum RoleType {
  WORKSPACE_OWNER = "WORKSPACE_OWNER",
  WORKSPACE_ADMIN = "WORKSPACE_ADMIN",
  MANAGER = "MANAGER",
  TEAM_LEAD = "TEAM_LEAD",
  MEMBER = "MEMBER",
  CUSTOM = "CUSTOM",
}

export const DEFAULT_PERMISSIONS = {
  WORKSPACE_OWNER: ["*"],
  WORKSPACE_ADMIN: [
    "workspace:manage",
    "team:manage",
    "user:manage",
    "role:manage",
  ],
  MANAGER: [
    "department:manage",
    "team:create",
    "team:manage",
    "member:manage",
    "report:view",
    "report:create",
  ],
  TEAM_LEAD: ["team:manage", "member:manage", "team:settings"],
  MEMBER: ["team:view", "profile:manage"],
};

export interface RoleCustomization {
  permissions: string[];
  scope?: "department" | "team" | "project";
  customTitle?: string;
  metadata?: Record<string, any>;
}

export interface Role {
  id: string;
  name: string;
  type: RoleType;
  workspaceId: string;
  permissions: Permission[];
  precedence: number;
  parentId?: string | null;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface RoleWithHierarchy extends Role {
  children?: RoleWithHierarchy[];
  parent?: Role;
}

export interface CreateRoleDto {
  name: string;
  type: RoleType;
  workspaceId: string;
  permissions: Permission[];
  precedence?: number;
  parentId?: string;
  metadata?: Record<string, any>;
}

export interface UpdateRoleDto {
  name?: string;
  permissions?: Permission[];
  precedence?: number;
  parentId?: string;
  metadata?: Record<string, any>;
}
