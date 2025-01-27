import { Request, Response, NextFunction } from "express";
import { LeaveService } from "../services/leave.service";
const { AppError } = require("../utils/AppError");
import { CustomRequest, CustomResponse } from "../types/types";

interface LeaveParams {
  workspaceId: string;
  requestId?: string;
}

interface CreateLeaveTypeBody {
  name: string;
  description?: string;
  daysAllowed: number;
  minNoticeDays: number;
  carryForward: boolean;
}

interface LeaveRequestBody {
  leaveTypeId: string;
  startDate: string;
  endDate: string;
  reason: string;
  duration: number;
}

interface ProcessLeaveRequestBody {
  action: "APPROVED" | "REJECTED";
  comment?: string;
}

interface CancelLeaveRequestBody {
  reason: string;
}

class LeaveController {
  private leaveService: LeaveService;

  constructor() {
    this.leaveService = new LeaveService();
  }

  createLeaveType = async (
    req: CustomRequest<LeaveParams, CreateLeaveTypeBody>,
    res: CustomResponse,
    next: NextFunction
  ) => {
    try {
      const { workspaceId } = req.params;
      const leaveType = await this.leaveService.createLeaveType(
        workspaceId,
        req.body
      );
      return res.status(201).json({ leaveType });
    } catch (error) {
      next(error);
    }
  };

  requestLeave = async (
    req: CustomRequest<LeaveParams, LeaveRequestBody>,
    res: CustomResponse,
    next: NextFunction
  ) => {
    try {
      const { workspaceId } = req.params;
      const userId = req.user.id;
      const leaveRequest = await this.leaveService.requestLeave(
        userId,
        workspaceId,
        req.body
      );
      return res.status(201).json({ leaveRequest });
    } catch (error) {
      next(error);
    }
  };

  processLeaveRequest = async (
    req: CustomRequest<LeaveParams, ProcessLeaveRequestBody>,
    res: CustomResponse,
    next: NextFunction
  ) => {
    try {
      const { requestId } = req.params;
      const { action, comment } = req.body;
      const managerId = req.user.id;

      if (!requestId) {
        throw new AppError("Leave request ID is required", 400);
      }

      const leaveRequest = await this.leaveService.processLeaveRequest(
        requestId,
        managerId,
        action,
        comment
      );
      return res.status(200).json({ leaveRequest });
    } catch (error) {
      next(error);
    }
  };

  getLeaveRequests = async (
    req: CustomRequest<LeaveParams>,
    res: CustomResponse,
    next: NextFunction
  ) => {
    try {
      const { workspaceId } = req.params;
      const { status, teamId, startDate, endDate } = req.query;

      const requests = await this.leaveService.getLeaveRequests(workspaceId, {
        status: status as string,
        teamId: teamId as string,
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined,
      });

      return res.status(200).json({ requests });
    } catch (error) {
      next(error);
    }
  };

  cancelLeaveRequest = async (
    req: CustomRequest<LeaveParams, CancelLeaveRequestBody>,
    res: CustomResponse,
    next: NextFunction
  ) => {
    try {
      const { requestId } = req.params;
      const { reason } = req.body;
      const userId = req.user.id;

      if (!requestId) {
        throw new AppError("Leave request ID is required", 400);
      }

      const leaveRequest = await this.leaveService.cancelLeaveRequest(
        requestId,
        userId,
        reason
      );
      return res.status(200).json({ leaveRequest });
    } catch (error) {
      next(error);
    }
  };
}

export default LeaveController;
