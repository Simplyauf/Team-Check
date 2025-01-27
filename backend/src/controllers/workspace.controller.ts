import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";
const { AppError } = require("../utils/AppError");

export const getWorkspaceDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.workspace) {
      throw new AppError("Workspace context required", 400);
    }
    const workspaceId = req.workspace.id;

    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
      select: {
        id: true,
        name: true,
        subdomain: true,
        settings: true,
        createdAt: true,
        updatedAt: true,
        members: {
          select: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
              },
            },
            role: true,
            status: true,
          },
        },
      },
    });

    if (!workspace) {
      throw new AppError("Workspace not found", 404);
    }

    res.status(200).json({
      status: "success",
      data: workspace,
    });
  } catch (error) {
    next(error);
  }
};
