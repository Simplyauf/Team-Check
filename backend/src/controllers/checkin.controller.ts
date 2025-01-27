import { Request, Response, NextFunction } from "express";
import { CheckInService } from "../services/checkin.service";
const { AppError } = require("../utils/AppError");
import { CustomRequest, CustomResponse } from "../types/types";

interface CheckInParams {
  workspaceId: string;
  checkInId?: string;
}

interface CheckInBody {
  responses: Array<{ promptId: string; answer: string | number }>;
}

interface CheckInSettingsBody {
  checkInTime?: string;
  checkOutTime?: string;
  isEnabled?: boolean;
  defaultPrompts?: boolean;
  prompts?: Array<{
    question: string;
    responseType: string;
    isRequired: boolean;
    order: number;
    type: "CHECKIN" | "CHECKOUT";
  }>;
}

class CheckInController {
  private checkInService: CheckInService;

  constructor() {
    this.checkInService = new CheckInService();
  }

  createSettings = async (
    req: CustomRequest<CheckInParams, CheckInSettingsBody>,
    res: CustomResponse,
    next: NextFunction
  ) => {
    try {
      const { workspaceId } = req.params;
      const settings = await this.checkInService.createSettings(
        workspaceId,
        req.body
      );
      return res.status(201).json({ settings });
    } catch (error) {
      next(error);
    }
  };

  checkIn = async (
    req: CustomRequest<CheckInParams, CheckInBody>,
    res: CustomResponse,
    next: NextFunction
  ) => {
    try {
      const { workspaceId } = req.params;
      const { responses } = req.body;
      const userId = req.user.id;

      const checkIn = await this.checkInService.checkIn(
        userId,
        workspaceId,
        responses
      );

      return res.status(200).json({ checkIn });
    } catch (error) {
      next(error);
    }
  };

  checkOut = async (
    req: CustomRequest<CheckInParams, CheckInBody>,
    res: CustomResponse,
    next: NextFunction
  ) => {
    try {
      const { checkInId } = req.params;
      const { responses } = req.body;

      if (!checkInId) {
        throw new AppError("Check-in ID is required", 400);
      }

      const checkIn = await this.checkInService.checkOut(checkInId, responses);
      return res.status(200).json({ checkIn });
    } catch (error) {
      next(error);
    }
  };

  getPrompts = async (
    req: CustomRequest<CheckInParams>,
    res: CustomResponse,
    next: NextFunction
  ) => {
    try {
      const { workspaceId } = req.params;
      const settings = await this.checkInService.getSettings(workspaceId);

      if (!settings) {
        throw new AppError("Check-in settings not found", 404);
      }

      return res.status(200).json({
        settings: {
          checkInTime: settings.checkInTime,
          checkOutTime: settings.checkOutTime,
          isEnabled: settings.isEnabled,
        },
        prompts: settings.prompts,
      });
    } catch (error) {
      next(error);
    }
  };
}

export { CheckInController };
