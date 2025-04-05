import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";
import { WorkspaceService } from "../services/workspace.service";
import { AppError } from "../utils/AppError";

const workspaceService = new WorkspaceService();

export const getWorkspaceDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const workspaceId = req.params.workspaceId || req.workspace.id;

    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
      include: {
        members: {
          include: {
            role: true,
            user: {
              select: {
                id: true,
                email: true,
                name: true,
                avatar: true,
              },
            },
          },
        },
      },
    });

    if (!workspace) {
      throw new AppError("Workspace not found", 404);
    }

    // Get the owner role for this workspace
    const ownerRole = await prisma.role.findFirst({
      where: {
        workspaceId: workspace.id,
        type: "WORKSPACE_OWNER",
      },
    });

    // Get the workspace member for the current user
    const workspaceMember = await prisma.workspaceMember.findFirst({
      where: {
        workspaceId: workspace.id,
        userId: req.user.id,
      },
      include: {
        role: true,
      },
    });

    res.status(200).json({
      status: "success",
      data: {
        workspace,
        ownerRole,
        workspaceMember,
      },
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Failed to get workspace details", 500);
  }
};

export const createWorkspace = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, subdomain } = req.body;

    // Create workspace with default settings
    const workspace = await prisma.workspace.create({
      data: {
        name,
        subdomain,
        settings: {
          timezone: "UTC",
          workingDays: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"],
          workingHours: {
            start: "09:00",
            end: "17:00",
          },
        },
      },
    });

    // Create owner role
    const ownerRole = await prisma.role.create({
      data: {
        name: "Workspace Owner",
        type: "WORKSPACE_OWNER",
        workspaceId: workspace.id,
        permissions: ["*"],
        precedence: 100,
      },
    });

    // Add creator as workspace member with owner role
    const workspaceMember = await prisma.workspaceMember.create({
      data: {
        userId: req.user.id,
        workspaceId: workspace.id,
        roleId: ownerRole.id,
        status: "ACTIVE",
      },
    });

    res.status(201).json({
      status: "success",
      data: {
        workspace,
        ownerRole,
        workspaceMember,
      },
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Failed to create workspace", 500);
  }
};

export const addWorkspaceMember = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId, roleId } = req.body;
    const workspaceId = req.workspace.id;

    const workspaceMember = await prisma.workspaceMember.create({
      data: {
        userId,
        workspaceId,
        roleId,
        status: "ACTIVE",
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            avatar: true,
          },
        },
        role: true,
      },
    });

    res.status(201).json({
      status: "success",
      data: {
        workspaceMember,
      },
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Failed to add workspace member", 500);
  }
};

export const updateWorkspace = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const workspaceId = req.params.workspaceId;
    const { name, subdomain, settings } = req.body;

    const workspace = await prisma.workspace.update({
      where: { id: workspaceId },
      data: {
        name,
        subdomain,
        settings,
      },
    });

    res.status(200).json({
      status: "success",
      data: {
        workspace,
      },
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Failed to update workspace", 500);
  }
};
