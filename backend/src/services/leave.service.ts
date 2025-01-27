const { prisma } = require("../lib/prisma");
const { AppError } = require("../utils/AppError");

export class LeaveService {
  async createLeaveType(
    workspaceId: string,
    data: {
      name: string;
      description?: string;
      daysAllowed: number;
      minNoticeDays: number;
      carryForward: boolean;
    }
  ) {
    return await prisma.$transaction(async (tx) => {
      const existingType = await tx.leaveType.findFirst({
        where: {
          workspaceId,
          name: data.name,
        },
      });

      if (existingType) {
        throw new AppError("Leave type already exists", 400);
      }

      // Get all active workspace members
      const workspaceMembers = await tx.workspaceMember.findMany({
        where: {
          workspaceId,
          status: "ACTIVE",
        },
      });

      const leaveType = await tx.leaveType.create({
        data: {
          ...data,
          workspaceId,
        },
      });

      // Create leave balances for all active members
      if (workspaceMembers.length > 0) {
        await tx.leaveBalance.createMany({
          data: workspaceMembers.map((member) => ({
            userId: member.userId,
            workspaceId,
            leaveTypeId: leaveType.id,
            year: new Date().getFullYear(),
            totalDays: data.daysAllowed,
          })),
        });
      }

      return leaveType;
    });
  }

  async requestLeave(
    userId: string,
    workspaceId: string,
    data: {
      leaveTypeId: string;
      startDate: string;
      endDate: string;
      reason: string;
    }
  ) {
    return await prisma.$transaction(async (tx) => {
      // Calculate duration in days
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      const duration =
        Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) +
        1;

      // Validate leave type and check balance
      const leaveType = await tx.leaveType.findFirst({
        where: {
          id: data.leaveTypeId,
          workspaceId,
          isActive: true,
        },
      });

      if (!leaveType) {
        throw new AppError("Invalid leave type", 400);
      }

      // Get user's leave balance
      const balance = await tx.leaveBalance.findFirst({
        where: {
          userId,
          workspaceId,
          leaveTypeId: data.leaveTypeId,
          year: new Date().getFullYear(),
        },
      });

      if (
        !balance ||
        balance.totalDays - balance.usedDays - balance.pendingDays < duration
      ) {
        throw new AppError("Insufficient leave balance", 400);
      }

      // Create leave request
      const leaveRequest = await tx.leaveRequest.create({
        data: {
          userId,
          workspaceId,
          leaveTypeId: data.leaveTypeId,
          startDate: start,
          endDate: end,
          duration,
          reason: data.reason,
          status: "PENDING",
          history: {
            create: {
              status: "PENDING",
              actionBy: userId,
            },
          },
        },
        include: {
          history: true,
        },
      });

      // Update leave balance
      await tx.leaveBalance.update({
        where: { id: balance.id },
        data: {
          pendingDays: balance.pendingDays + duration,
        },
      });

      return leaveRequest;
    });
  }

  async processLeaveRequest(
    requestId: string,
    managerId: string,
    action: "APPROVED" | "REJECTED",
    comment?: string
  ) {
    return await prisma.$transaction(async (tx) => {
      const request = await tx.leaveRequest.findUnique({
        where: { id: requestId },
        include: {
          leaveType: true,
        },
      });

      if (!request) {
        throw new AppError("Leave request not found", 404);
      }

      if (request.status !== "PENDING") {
        throw new AppError("Leave request already processed", 400);
      }

      // Update request status
      const updatedRequest = await tx.leaveRequest.update({
        where: { id: requestId },
        data: {
          status: action,
          comment,
          history: {
            create: {
              status: action,
              comment,
              actionBy: managerId,
            },
          },
        },
        include: {
          history: true,
        },
      });

      // Update leave balance if approved
      if (action === "APPROVED") {
        await tx.leaveBalance.update({
          where: {
            userId_workspaceId_leaveTypeId_year: {
              userId: request.userId,
              workspaceId: request.workspaceId,
              leaveTypeId: request.leaveTypeId,
              year: new Date(request.startDate).getFullYear(),
            },
          },
          data: {
            pendingDays: { decrement: request.duration },
            usedDays: { increment: request.duration },
          },
        });
      }

      return updatedRequest;
    });
  }

  async getLeaveRequests(
    workspaceId: string,
    filters: {
      teamId?: string;
      status?: string;
      startDate?: Date;
      endDate?: Date;
    }
  ) {
    return await prisma.leaveRequest.findMany({
      where: {
        workspaceId,
        ...(filters.teamId && {
          user: {
            teamMembers: {
              some: {
                teamId: filters.teamId,
              },
            },
          },
        }),
        ...(filters.status && { status: filters.status }),
        ...(filters.startDate &&
          filters.endDate && {
            startDate: {
              gte: filters.startDate,
            },
            endDate: {
              lte: filters.endDate,
            },
          }),
      },
      include: {
        user: true,
        leaveType: true,
        history: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async cancelLeaveRequest(requestId: string, userId: string, reason: string) {
    return await prisma.$transaction(async (tx) => {
      const request = await tx.leaveRequest.findUnique({
        where: { id: requestId },
        include: { leaveType: true },
      });

      if (!request) {
        throw new AppError("Leave request not found", 404);
      }

      if (request.userId !== userId) {
        throw new AppError("Unauthorized to cancel this request", 403);
      }

      if (request.status !== "PENDING" && request.status !== "APPROVED") {
        throw new AppError("Cannot cancel this request", 400);
      }

      // If it's an approved leave and start date is within 24 hours
      const startDate = new Date(request.startDate);
      const now = new Date();
      if (
        request.status === "APPROVED" &&
        startDate.getTime() - now.getTime() < 24 * 60 * 60 * 1000
      ) {
        throw new AppError(
          "Cannot cancel approved leave within 24 hours of start",
          400
        );
      }

      // Update request status
      const updatedRequest = await tx.leaveRequest.update({
        where: { id: requestId },
        data: {
          status: "CANCELLED",
          comment: reason,
          history: {
            create: {
              status: "CANCELLED",
              comment: reason,
              actionBy: userId,
            },
          },
        },
        include: {
          history: true,
        },
      });

      // Update leave balance
      if (request.status === "APPROVED") {
        await tx.leaveBalance.update({
          where: {
            userId_workspaceId_leaveTypeId_year: {
              userId: request.userId,
              workspaceId: request.workspaceId,
              leaveTypeId: request.leaveTypeId,
              year: new Date(request.startDate).getFullYear(),
            },
          },
          data: {
            usedDays: { decrement: request.duration },
          },
        });
      } else if (request.status === "PENDING") {
        await tx.leaveBalance.update({
          where: {
            userId_workspaceId_leaveTypeId_year: {
              userId: request.userId,
              workspaceId: request.workspaceId,
              leaveTypeId: request.leaveTypeId,
              year: new Date(request.startDate).getFullYear(),
            },
          },
          data: {
            pendingDays: { decrement: request.duration },
          },
        });
      }

      return updatedRequest;
    });
  }
}
