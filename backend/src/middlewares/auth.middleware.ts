import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface JwtPayload {
  userId: string;
  email?: string;
}

interface RequestWithUser extends Request {
  user?: any;
  workspace?: any;
}

export const protect = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1) Get token from header
    const authHeader = req.headers.authorization;
    let token: string | undefined;

    if (authHeader && authHeader.startsWith("Bearer")) {
      token = authHeader.split(" ")[1];
    }

    if (!token) {
      throw new AppError(
        "You are not logged in. Please log in to get access.",
        401
      );
    }

    // 2) Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    ) as JwtPayload;

    // 3) Check if user still exists
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        workspaces: {
          include: {
            workspace: true,
            role: true,
          },
        },
      },
    });

    if (!user) {
      throw new AppError(
        "The user belonging to this token no longer exists.",
        401
      );
    }

    // 4) Attach user to request
    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new AppError("Invalid token. Please log in again.", 401));
    } else if (error instanceof jwt.TokenExpiredError) {
      next(new AppError("Your token has expired. Please log in again.", 401));
    } else {
      next(error);
    }
  }
};

export const requireWorkspace = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const workspaceId = req.headers["x-workspace-id"] as string;

    if (!workspaceId) {
      throw new AppError("Workspace ID is required", 400);
    }

    if (!req.user) {
      throw new AppError("User not authenticated", 401);
    }

    // Find the workspace member
    const workspaceMember = await prisma.workspaceMember.findFirst({
      where: {
        userId: req.user.id,
        workspaceId,
      },
      include: {
        workspace: true,
        role: true,
      },
    });

    if (!workspaceMember) {
      throw new AppError("You don't have access to this workspace", 403);
    }

    req.workspace = workspaceMember.workspace;
    next();
  } catch (error) {
    next(error);
  }
};
