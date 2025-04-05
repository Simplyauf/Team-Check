import { Request, Response, NextFunction } from "express";
import { PrismaClient, MemberStatus } from "@prisma/client";
const { AppError } = require("../utils/AppError");
const memberService = require("../services/member.service");

const prisma = new PrismaClient();

// Define custom request type with workspace property
interface RequestWithWorkspace extends Request {
  workspace: {
    id: string;
  };
  user: {
    id: string;
  };
}

class MemberController {
  async getWorkspaceMembers(
    req: RequestWithWorkspace,
    res: Response,
    next: NextFunction
  ) {
    try {
      const workspaceId = req.workspace.id;

      const members = await memberService.getWorkspaceMembers(workspaceId);

      res.status(200).json({
        status: "success",
        data: members,
      });
    } catch (error) {
      next(error);
    }
  }

  async getMemberDetails(
    req: RequestWithWorkspace,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { memberId } = req.params;
      const workspaceId = req.workspace.id;

      const member = await prisma.workspaceMember.findFirst({
        where: {
          id: memberId,
          workspaceId,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
            },
          },
          role: true,
          teams: {
            include: {
              team: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });

      if (!member) {
        throw new AppError("Member not found", 404);
      }

      res.status(200).json({
        status: "success",
        data: member,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateMember(
    req: RequestWithWorkspace,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { memberId } = req.params;
      const { position, roleId } = req.body;
      const workspaceId = req.workspace.id;

      // Verify member exists
      const existingMember = await prisma.workspaceMember.findFirst({
        where: {
          id: memberId,
          workspaceId,
        },
      });

      if (!existingMember) {
        throw new AppError("Member not found", 404);
      }

      // If roleId provided, verify role exists and belongs to workspace
      if (roleId) {
        const role = await prisma.role.findFirst({
          where: {
            id: roleId,
            workspaceId,
          },
        });

        if (!role) {
          throw new AppError("Invalid role", 400);
        }
      }

      // Update member
      const updatedMember = await prisma.workspaceMember.update({
        where: {
          id: memberId,
        },
        data: {
          position: position || undefined,
          roleId: roleId || undefined,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
            },
          },
          role: true,
          teams: {
            include: {
              team: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });

      res.status(200).json({
        status: "success",
        data: updatedMember,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateMemberStatus(
    req: RequestWithWorkspace,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { memberId } = req.params;
      const { status } = req.body;
      const workspaceId = req.workspace.id;

      // Validate status
      if (!Object.values(MemberStatus).includes(status)) {
        throw new AppError("Invalid status", 400);
      }

      // Verify member exists
      const existingMember = await prisma.workspaceMember.findFirst({
        where: {
          id: memberId,
          workspaceId,
        },
      });

      if (!existingMember) {
        throw new AppError("Member not found", 404);
      }

      // Update member status
      const updatedMember = await memberService.updateMemberStatus(
        workspaceId,
        memberId,
        status
      );

      res.status(200).json({
        status: "success",
        data: updatedMember,
      });
    } catch (error) {
      next(error);
    }
  }

  async removeMember(
    req: RequestWithWorkspace,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { memberId } = req.params;
      const workspaceId = req.workspace.id;

      // Verify member exists
      const existingMember = await prisma.workspaceMember.findFirst({
        where: {
          id: memberId,
          workspaceId,
        },
      });

      if (!existingMember) {
        throw new AppError("Member not found", 404);
      }

      // Remove member from workspace
      await memberService.removeMember(workspaceId, memberId);

      res.status(200).json({
        status: "success",
        message: "Member removed successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async inviteMember(
    req: RequestWithWorkspace,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { workspace, user } = req;
      const { email, roleId, position } = req.body;

      if (!email) {
        throw new AppError("Email is required", 400);
      }

      if (!roleId) {
        throw new AppError("Role ID is required", 400);
      }

      const member = await memberService.inviteMember(workspace.id, user.id, {
        email,
        roleId,
        position,
      });

      res.status(200).json({
        status: "success",
        data: member,
      });
    } catch (error) {
      next(error);
    }
  }

  async resendInvite(
    req: RequestWithWorkspace,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { workspace } = req;
      const { inviteId } = req.params;

      const invite = await memberService.resendInvite(workspace.id, inviteId);

      res.status(200).json({
        status: "success",
        data: invite,
      });
    } catch (error) {
      next(error);
    }
  }

  async cancelInvite(
    req: RequestWithWorkspace,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { workspace } = req;
      const { inviteId } = req.params;

      const result = await memberService.cancelInvite(workspace.id, inviteId);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

// Create and export a single instance
const memberController = new MemberController();
module.exports = memberController;
