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
      const workspace = await prisma.workspace.create({
        data: {
          name,
          subdomain,
          settings,
        },
      });

      // Add owner as workspace member
      await prisma.workspaceMember.create({
        data: {
          userId: ownerId,
          workspaceId: workspace.id,
          role: "WORKSPACE_OWNER",
          status: "ACTIVE",
        },
      });

      return workspace;
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
}
