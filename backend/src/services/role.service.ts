import { RoleHierarchyManager } from "./role.hierarchy";
import { CustomFieldService } from "./custom.fields";
import { PermissionResolver } from "./permission.resolver";
import { RoleType, DEFAULT_PERMISSIONS } from "../types/role";

const { prisma } = require("../lib/prisma.ts");
const { AppError } = require("../utils/AppError.ts");
const {
  MANAGER_PERMISSIONS,
  MANAGER_DELEGATABLE_PERMISSIONS,
} = require("../types/permissions.ts");

class RoleService {
  private customFieldService: CustomFieldService;
  private permissionResolver: PermissionResolver;

  constructor() {
    this.customFieldService = new CustomFieldService();
    this.permissionResolver = new PermissionResolver();
  }

  async getRoleForUserInWorkspace(userId, workspaceId) {
    const member = await prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId,
          workspaceId,
        },
      },
      include: {
        role: true,
      },
    });

    if (!member) {
      throw new AppError("User not found in workspace", 404);
    }

    return member.role;
  }

  async checkUserPermission(userId, workspaceId, requiredPermission) {
    const role = await this.getRoleForUserInWorkspace(userId, workspaceId);

    if (role.type === RoleType.WORKSPACE_OWNER) {
      return true;
    }

    return role.permissions.some(
      (permission) =>
        permission.action === requiredPermission.action &&
        permission.resource === requiredPermission.resource &&
        (!permission.scope || permission.scope === requiredPermission.scope)
    );
  }

  async createRole(data) {
    const existingRole = await prisma.role.findFirst({
      where: {
        workspaceId: data.workspaceId,
        name: data.name,
      },
    });

    if (existingRole) {
      throw new AppError("Role with this name already exists", 400);
    }

    return await prisma.role.create({
      data: {
        ...data,
        precedence: data.precedence || 0,
      },
    });
  }

  async updateRole(id, data) {
    const role = await prisma.role.findUnique({
      where: { id },
    });

    if (!role) {
      throw new AppError("Role not found", 404);
    }

    if (role.type !== RoleType.CUSTOM && Object.keys(data).length > 0) {
      throw new AppError("Cannot modify system roles", 400);
    }

    return await prisma.role.update({
      where: { id },
      data,
    });
  }

  async assignRole(userId, workspaceId, roleId) {
    return await prisma.workspaceMember.update({
      where: {
        userId_workspaceId: {
          userId,
          workspaceId,
        },
      },
      data: {
        roleId,
      },
    });
  }

  async deleteRole(id) {
    const role = await prisma.role.findUnique({
      where: { id },
      include: {
        members: true,
      },
    });

    if (!role) {
      throw new AppError("Role not found", 404);
    }

    if (role.type !== RoleType.CUSTOM) {
      throw new AppError("Cannot delete system roles", 400);
    }

    if (role.members.length > 0) {
      throw new AppError("Cannot delete role with assigned members", 400);
    }

    await prisma.role.delete({
      where: { id },
    });
  }

  async delegatePermissions(
    managerId: string,
    teamLeadId: string,
    permissions: string[],
    workspaceId: string
  ) {
    // Get manager's role
    const managerRole = await this.getRoleForUserInWorkspace(
      managerId,
      workspaceId
    );

    // Verify manager role
    if (managerRole.type !== RoleType.MANAGER) {
      throw new AppError("Only managers can delegate permissions", 403);
    }

    // Get team lead's role
    const teamLeadRole = await this.getRoleForUserInWorkspace(
      teamLeadId,
      workspaceId
    );
    if (teamLeadRole.type !== RoleType.TEAM_LEAD) {
      throw new AppError(
        "Permissions can only be delegated to team leads",
        400
      );
    }

    // Validate permissions can be delegated
    const invalidPermissions = permissions.filter(
      (p) => !MANAGER_DELEGATABLE_PERMISSIONS.includes(p)
    );

    if (invalidPermissions.length > 0) {
      throw new AppError(
        `Cannot delegate permissions: ${invalidPermissions.join(", ")}`,
        400
      );
    }

    // Update team lead's role permissions
    const updatedPermissions = [...teamLeadRole.permissions, ...permissions];

    return await prisma.role.update({
      where: { id: teamLeadRole.id },
      data: {
        permissions: updatedPermissions,
        metadata: {
          ...teamLeadRole.metadata,
          delegatedBy: managerId,
          delegatedAt: new Date(),
        },
      },
    });
  }

  async revokeDelegatedPermissions(
    managerId,
    teamLeadId,
    permissions,
    workspaceId
  ) {
    const managerRole = await this.getRoleForUserInWorkspace(
      managerId,
      workspaceId
    );

    if (managerRole.type !== RoleType.MANAGER) {
      throw new AppError("Only managers can revoke delegated permissions", 403);
    }

    const teamLeadRole = await this.getRoleForUserInWorkspace(
      teamLeadId,
      workspaceId
    );
    if (teamLeadRole.type !== RoleType.TEAM_LEAD) {
      throw new AppError("Can only revoke permissions from team leads", 400);
    }

    const updatedPermissions = teamLeadRole.permissions.filter(
      (p) => !permissions.includes(p)
    );

    return await prisma.role.update({
      where: { id: teamLeadRole.id },
      data: {
        permissions: updatedPermissions,
        metadata: {
          ...teamLeadRole.metadata,
          revokedBy: managerId,
          revokedAt: new Date(),
        },
      },
    });
  }

  async buildHierarchyTree(workspaceId) {
    const roleHierarchy = new RoleHierarchyManager();
    return await roleHierarchy.buildHierarchyTree(workspaceId);
  }

  async resolveCustomRolePermissions(roleId: string) {
    const role = await prisma.role.findUnique({
      where: { id: roleId },
      include: {
        parent: true,
        customFields: true,
      },
    });

    const inheritedPermissions = role.parent
      ? await this.resolveCustomRolePermissions(role.parent.id)
      : [];

    const customFields = await this.customFieldService.getFieldValues(
      roleId,
      "role"
    );

    return this.permissionResolver.mergePermissions(
      inheritedPermissions,
      role.permissions,
      customFields
    );
  }

  async cloneRole(
    sourceRoleId: string,
    newRoleData: {
      name: string;
      workspaceId: string;
      customizations?: {
        permissions?: string[];
        scope?: string;
        metadata?: Record<string, any>;
      };
    }
  ) {
    const sourceRole = await prisma.role.findUnique({
      where: { id: sourceRoleId },
    });

    if (!sourceRole) {
      throw new AppError("Source role not found", 404);
    }

    return await prisma.role.create({
      data: {
        ...sourceRole,
        id: undefined,
        type: RoleType.CUSTOM,
        name: newRoleData.name,
        workspaceId: newRoleData.workspaceId,
        permissions:
          newRoleData.customizations?.permissions || sourceRole.permissions,
        metadata: {
          ...sourceRole.metadata,
          ...newRoleData.customizations?.metadata,
          clonedFrom: sourceRoleId,
          clonedAt: new Date(),
        },
      },
    });
  }

  async checkProjectPermission(
    userId: string,
    teamId: string,
    permission: string
  ): Promise<boolean> {
    const teamLead = await prisma.teamLead.findFirst({
      where: {
        leadId: userId,
        teamId,
      },
      include: {
        team: true,
      },
    });

    if (!teamLead) return false;

    // For unit teams, check full permissions
    if (teamLead.scope === "FULL") {
      return true;
    }

    // For project teams, check delegated permissions
    if (teamLead.team.type === "PROJECT") {
      const permissions = teamLead.permissions as string[];
      return permissions.includes(permission);
    }

    return false;
  }

  async delegateProjectPermissions(
    managerId: string,
    projectTeamId: string,
    projectLeadId: string
  ) {
    const projectPermissions = [
      "team:manage",
      "member:manage",
      "task:assign",
      "report:view",
    ];

    await this.delegatePermissions(
      managerId,
      projectLeadId,
      projectPermissions,
      projectTeamId
    );
  }

  async createDefaultWorkspaceRoles(workspaceId: string) {
    const defaultRoles = [
      {
        name: "Workspace Owner",
        type: RoleType.WORKSPACE_OWNER,
        permissions: DEFAULT_PERMISSIONS.WORKSPACE_OWNER,
        precedence: 100,
      },
      {
        name: "Workspace Admin",
        type: RoleType.WORKSPACE_ADMIN,
        permissions: DEFAULT_PERMISSIONS.WORKSPACE_ADMIN,
        precedence: 80,
      },
      {
        name: "Manager",
        type: RoleType.MANAGER,
        permissions: DEFAULT_PERMISSIONS.MANAGER,
        precedence: 60,
      },
      {
        name: "Team Lead",
        type: RoleType.TEAM_LEAD,
        permissions: DEFAULT_PERMISSIONS.TEAM_LEAD,
        precedence: 40,
      },
      {
        name: "Member",
        type: RoleType.MEMBER,
        permissions: DEFAULT_PERMISSIONS.MEMBER,
        precedence: 20,
      },
    ];

    for (const roleData of defaultRoles) {
      await prisma.role.create({
        data: {
          ...roleData,
          workspaceId,
        },
      });
    }
  }
}

module.exports = { RoleService };
