const { prisma } = require("../lib/prisma");
const { AppError } = require("../utils/AppError");
import {
  CheckInPrompt,
  CheckInResponse,
  CheckInSettings,
  CheckInStatus,
  DEFAULT_CHECKIN_PROMPTS,
} from "../types/checkin";

// Use the singleton pattern for PrismaClient

export class CheckInService {
  async createSettings(
    workspaceId: string,
    settings?: Partial<CheckInSettings>
  ) {
    const defaultSettings = {
      checkInTime: "09:00",
      checkOutTime: "17:00",
      isEnabled: true,
      defaultPrompts: true,
    };

    const finalSettings = { ...defaultSettings, ...settings };

    return await prisma.$transaction(async (tx) => {
      // Create settings first
      const checkInSettings = await prisma.checkInSettings.create({
        data: {
          workspaceId,
          checkInTime: finalSettings.checkInTime,
          checkOutTime: finalSettings.checkOutTime,
          isEnabled: finalSettings.isEnabled,
          defaultPrompts: finalSettings.defaultPrompts,
        },
      });

      if (finalSettings.defaultPrompts) {
        // Create default prompts
        await Promise.all(
          DEFAULT_CHECKIN_PROMPTS.map((prompt) =>
            prisma.checkInPrompt.create({
              data: {
                settingsId: checkInSettings.id,
                promptType: prompt.promptType,
                question: prompt.question,
                responseType: prompt.responseType,
                isRequired: prompt.isRequired,
                order: prompt.order,
              },
            })
          )
        );
      }

      return checkInSettings;
    });
  }

  async checkIn(
    userId: string,
    workspaceId: string,
    responses: CheckInResponse[]
  ) {
    const settings = await prisma.checkInSettings.findFirst({
      where: { workspaceId },
      include: {
        prompts: {
          where: { promptType: "CHECKIN" },
        },
      },
    });

    if (!settings?.isEnabled) {
      throw new AppError(
        "Check-in system is not enabled for this workspace",
        400
      );
    }

    // Validate required prompts are answered
    const requiredPrompts = settings.prompts.filter((p) => p.isRequired);
    const answeredPromptIds = responses.map((r) => r.promptId);

    const missingRequired = requiredPrompts.filter(
      (p) => !answeredPromptIds.includes(p.id)
    );

    if (missingRequired.length > 0) {
      throw new AppError(
        `Missing required responses: ${missingRequired
          .map((p) => p.question)
          .join(", ")}`,
        400
      );
    }

    // Create check-in record
    return await prisma.dailyCheckIn.create({
      data: {
        userId,
        workspaceId,
        checkInTime: new Date(),
        status: "CHECKED_IN",
        responses: responses.map((r) => ({
          promptId: r.promptId,
          question:
            settings.prompts.find((p) => p.id === r.promptId)?.question || "",
          answer: r.answer,
        })),
      },
    });
  }

  async checkOut(checkInId: string, responses: CheckInResponse[]) {
    const checkIn = await prisma.dailyCheckIn.findUnique({
      where: { id: checkInId },
    });

    if (!checkIn) {
      throw new AppError("Check-in record not found", 404);
    }

    if (checkIn.status === "CHECKED_OUT") {
      throw new AppError("Already checked out", 400);
    }

    const settings = await prisma.checkInSettings.findFirst({
      where: { workspaceId: checkIn.workspaceId },
      include: {
        prompts: {
          where: { promptType: "CHECKOUT" },
        },
      },
    });

    if (!settings) {
      throw new AppError("Check-in settings not found", 404);
    }

    // Validate required prompts
    const requiredPrompts = settings.prompts.filter((p) => p.isRequired);
    const answeredPromptIds = responses.map((r) => r.promptId);

    const missingRequired = requiredPrompts.filter(
      (p) => !answeredPromptIds.includes(p.id)
    );

    if (missingRequired.length > 0) {
      throw new AppError(
        `Missing required responses: ${missingRequired
          .map((p) => p.question)
          .join(", ")}`,
        400
      );
    }

    // Update check-in record with check-out
    return await prisma.dailyCheckIn.update({
      where: { id: checkInId },
      data: {
        checkOutTime: new Date(),
        status: "CHECKED_OUT",
        responses: [
          ...(checkIn.responses as any[]),
          ...responses.map((r) => ({
            promptId: r.promptId,
            question:
              settings.prompts.find((p) => p.id === r.promptId)?.question || "",
            answer: r.answer,
          })),
        ],
      },
    });
  }

  async getSettings(workspaceId: string) {
    return await prisma.checkInSettings.findFirst({
      where: { workspaceId },
      include: {
        prompts: {
          orderBy: {
            order: "asc",
          },
        },
      },
    });
  }

  async getCurrentStatus(userId: string, workspaceId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return await prisma.dailyCheckIn.findFirst({
      where: {
        userId,
        workspaceId,
        createdAt: {
          gte: today,
        },
      },
    });
  }

  private isWithinCheckInTime(settings: CheckInSettings): boolean {
    const now = new Date();
    const [hours, minutes] = settings.checkInTime.split(":").map(Number);
    const checkInTime = new Date();
    checkInTime.setHours(hours, minutes, 0, 0);

    // Allow check-in within 2 hours of start time
    const cutoffTime = new Date(checkInTime);
    cutoffTime.setHours(cutoffTime.getHours() + 2);

    return now >= checkInTime && now <= cutoffTime;
  }

  async getHistory(
    workspaceId: string,
    userId: string,
    startDate: Date,
    endDate: Date
  ) {
    return await prisma.dailyCheckIn.findMany({
      where: {
        workspaceId,
        userId,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
}
