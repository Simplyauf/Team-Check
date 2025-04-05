import { RoleType, DEFAULT_PERMISSIONS } from "../types/role";
const { PrismaClient } = require("@prisma/client");
const { AppError } = require("../utils/AppError");
const { WorkspaceSettings } = require("../types/workspace");

const prisma = new PrismaClient();

interface CreateWorkspaceParams {
  name: string;
  subdomain: string;
  ownerId: string;
  settings: typeof WorkspaceSettings;
}

export class WorkspaceService {
  async createWorkspace({
    name,
    subdomain,
    ownerId,
    settings,
  }: CreateWorkspaceParams) {
    const existingWorkspace = await prisma.workspace.findUnique({
      where: { subdomain },
    });

    if (existingWorkspace) {
      throw new AppError("Subdomain already taken", 400);
    }

    return await prisma.$transaction(async (prisma) => {
      // Create the workspace first
      const workspace = await prisma.workspace.create({
        data: {
          name,
          subdomain,
          settings,
        },
      });

      // Create all default roles
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

      // Create all roles and store them
      const createdRoles = await Promise.all(
        defaultRoles.map((roleData) =>
          prisma.role.create({
            data: {
              ...roleData,
              workspaceId: workspace.id,
            },
          })
        )
      );

      // Find the owner role
      const ownerRole = createdRoles.find(
        (role) => role.type === RoleType.WORKSPACE_OWNER
      );

      if (!ownerRole) {
        throw new AppError("Failed to create owner role", 500);
      }

      // Create the workspace member with owner role
      const workspaceMember = await prisma.workspaceMember.create({
        data: {
          status: "ACTIVE",
          userId: ownerId,
          workspaceId: workspace.id,
          roleId: ownerRole.id,
        },
      });

      return {
        workspace,
        ownerRole,
        workspaceMember,
      };
    });
  }

  async addMemberToWorkspace(
    workspaceId: string,
    userId: string,
    role = "EMPLOYEE"
  ) {
    const existingMember = await prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId,
          workspaceId,
        },
      },
    });

    if (existingMember) {
      return existingMember;
    }

    return await prisma.workspaceMember.create({
      data: {
        userId,
        workspaceId,
        role,
        status: "ACTIVE",
      },
    });
  }

  async updateWorkspaceSettings(
    workspaceId: string,
    settings: {
      timezone?: string;
      workingDays?: string[];
      workingHours?: {
        start: string;
        end: string;
      };
    }
  ) {
    const workspace = await prisma.workspace.update({
      where: {
        id: workspaceId,
      },
      data: {
        settings: {
          // If there are existing settings, merge them with the new ones
          ...((
            await prisma.workspace.findUnique({ where: { id: workspaceId } })
          )?.settings as any),
          ...settings,
        },
        updatedAt: new Date(),
      },
    });

    return workspace;
  }
}
