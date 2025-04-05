import { Request, Response, NextFunction } from "express";
import { PrismaClient, InviteStatus, MemberStatus } from "@prisma/client";
const memberService = require("../services/member.service");
const { AppError } = require("../utils/AppError");
const { sendInviteEmail } = require("../utils/email");
const { generateToken } = require("../utils/token");

const prisma = new PrismaClient();

interface RequestWithWorkspace extends Request {
  workspace: {
    id: string;
  };
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export class InviteController {
  constructor() {
    // No need to instantiate anything in constructor
  }

  createInvite = async (
    req: RequestWithWorkspace,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const workspaceId = req.workspace.id;
      const invitedById = req.user.id;
      const { email, roleId, position } = req.body;

      if (!email || !roleId) {
        throw new AppError("Email and role are required", 400);
      }

      const invite = await memberService.inviteMember(
        workspaceId,
        invitedById,
        {
          email,
          roleId,
          position,
        }
      );

      res.status(201).json({
        status: "success",
        data: invite,
      });
    } catch (error) {
      next(error);
    }
  };

  acceptInvite = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token } = req.params;

      const invite = await prisma.workspaceInvite.findUnique({
        where: { token },
        include: {
          workspace: true,
          user: true,
        },
      });

      if (!invite) {
        throw new AppError("Invalid or expired invitation", 404);
      }

      if (invite.status !== InviteStatus.PENDING) {
        throw new AppError("This invitation has already been used", 400);
      }

      // Create or update workspace member
      await prisma.workspaceMember.create({
        data: {
          workspaceId: invite.workspaceId,
          userId: req.user.id,
          roleId: invite.roleId,
          position: invite.position,
          status: MemberStatus.ACTIVE,
        },
      });

      // Update invite status
      await prisma.workspaceInvite.update({
        where: { id: invite.id },
        data: { status: InviteStatus.ACCEPTED },
      });

      res.status(200).json({
        status: "success",
        message: "Invitation accepted successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  resendInvite = async (
    req: RequestWithWorkspace,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { inviteId } = req.params;
      const workspaceId = req.workspace.id;

      const invite = await prisma.workspaceInvite.findFirst({
        where: {
          id: inviteId,
          workspaceId,
        },
        include: {
          workspace: true,
          invitedBy: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      });

      if (!invite) {
        throw new AppError("Invite not found", 404);
      }

      // Resend invite email
      await sendInviteEmail({
        to: invite.email,
        inviteToken: invite.token,
        workspaceName: invite.workspace.name,
        invitedBy: invite.invitedBy.name,
      });

      res.status(200).json({
        status: "success",
        message: "Invite resent successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  cancelInvite = async (
    req: RequestWithWorkspace,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { inviteId } = req.params;
      const workspaceId = req.workspace.id;

      const invite = await prisma.workspaceInvite.update({
        where: {
          id: inviteId,
          workspaceId,
        },
        data: {
          status: InviteStatus.CANCELLED,
        },
      });

      res.status(200).json({
        status: "success",
        data: invite,
      });
    } catch (error) {
      next(error);
    }
  };

  async getInviteDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const { token } = req.params;

      const invite = await prisma.workspaceInvite.findUnique({
        where: { token },
        include: {
          workspace: {
            select: {
              id: true,
              name: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          invitedBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      if (!invite) {
        throw new AppError("Invalid or expired invitation", 404);
      }

      if (invite.status !== InviteStatus.PENDING) {
        throw new AppError("This invitation has already been used", 400);
      }

      res.status(200).json({
        status: "success",
        data: invite,
      });
    } catch (error) {
      next(error);
    }
  }

  async rejectInvite(req: Request, res: Response, next: NextFunction) {
    try {
      const { token } = req.params;

      const invite = await prisma.workspaceInvite.findUnique({
        where: { token },
      });

      if (!invite) {
        throw new AppError("Invalid or expired invitation", 404);
      }

      if (invite.status !== InviteStatus.PENDING) {
        throw new AppError("This invitation has already been used", 400);
      }

      // Update invite status
      await prisma.workspaceInvite.update({
        where: { id: invite.id },
        data: { status: InviteStatus.CANCELLED },
      });

      res.status(200).json({
        status: "success",
        message: "Invitation rejected successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}
