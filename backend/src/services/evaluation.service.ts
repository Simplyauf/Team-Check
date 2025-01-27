const { prisma } = require("../lib/prisma");
const AppError = require("../utils/AppError");
import {
  EvaluationCriteriaBody,
  SubmitEvaluationBody,
} from "../types/evaluation.types";
const { RoleService } = require("./role.service");

export class EvaluationService {
  private roleService: typeof RoleService;

  constructor(roleService: typeof RoleService) {
    this.roleService = roleService;
  }

  async processEvaluation(
    evaluationId: string,
    reviewerId: string,
    data: SubmitEvaluationBody
  ) {
    return await prisma.$transaction(async (tx) => {
      const evaluation = await tx.performanceEvaluation.findUnique({
        where: { id: evaluationId },
        include: {
          criteria: true,
          project: true,
          employee: true,
        },
      });

      if (!evaluation || evaluation.reviewerId !== reviewerId) {
        throw new AppError("Unauthorized or evaluation not found", 404);
      }

      if (evaluation.status === "COMPLETED") {
        throw new AppError("Evaluation already completed", 400);
      }

      // Create performance scores
      await tx.performanceScore.createMany({
        data: data.scores.map((score) => ({
          evaluationId,
          criteriaId: score.criteriaId,
          score: score.score,
          comment: score.comment,
        })),
      });

      // Calculate weighted average score
      const criteria = await tx.evaluationCriteria.findMany({
        where: { isActive: true },
      });

      let totalWeight = 0;
      let weightedScore = 0;

      data.scores.forEach((score) => {
        const criterion = criteria.find((c) => c.id === score.criteriaId);
        if (criterion) {
          totalWeight += criterion.weight;
          weightedScore += score.score * criterion.weight;
        }
      });

      const overallScore = weightedScore / totalWeight;

      // Update evaluation status
      const updatedEvaluation = await tx.performanceEvaluation.update({
        where: { id: evaluationId },
        data: {
          status: "COMPLETED",
          score: overallScore,
          completedAt: new Date(),
          comment: data.overallComment,
        },
        include: {
          criteria: {
            include: {
              criteria: true,
            },
          },
          employee: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          reviewer: {
            select: {
              id: true,
              name: true,
              role: true,
            },
          },
          project: {
            select: {
              id: true,
              name: true,
              team: true,
            },
          },
        },
      });

      return updatedEvaluation;
    });
  }

  async createEvaluationCriteria(data: EvaluationCriteriaBody) {
    const existingCriteria = await prisma.evaluationCriteria.findFirst({
      where: { name: data.name },
    });

    if (existingCriteria) {
      throw new AppError("Evaluation criteria already exists", 400);
    }

    return await prisma.evaluationCriteria.create({
      data: {
        name: data.name,
        description: data.description,
        weight: data.weight,
        isActive: true,
      },
    });
  }

  async getEmployeeEvaluations(
    employeeId: string,
    options?: {
      type?: "PROJECT" | "REGULAR" | "SEMI_ANNUAL";
      status?: "PENDING" | "COMPLETED";
      startDate?: Date;
      endDate?: Date;
    }
  ) {
    const where = {
      employeeId,
      ...(options?.type && { type: options.type }),
      ...(options?.status && { status: options.status }),
      ...(options?.startDate &&
        options?.endDate && {
          createdAt: {
            gte: options.startDate,
            lte: options.endDate,
          },
        }),
    };

    return await prisma.performanceEvaluation.findMany({
      where,
      include: {
        criteria: {
          include: {
            criteria: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
          },
        },
        reviewer: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async createProjectEvaluation(
    projectId: string,
    managerId: string,
    data: {
      employeeIds: string[];
      reviewerIds: string[];
      dueDate: Date;
    }
  ) {
    return await prisma.$transaction(async (tx) => {
      const project = await tx.project.findUnique({
        where: { id: projectId },
        include: {
          team: true,
          status: true,
        },
      });

      if (!project) {
        throw new AppError("Project not found", 404);
      }

      if (project.status !== "COMPLETED") {
        throw new AppError("Project must be completed for evaluation", 400);
      }

      // Validate reviewers have necessary permissions
      for (const reviewerId of data.reviewerIds) {
        const hasPermission = await this.roleService.checkProjectPermission(
          reviewerId,
          project.team.id,
          "evaluation:create"
        );
        if (!hasPermission) {
          throw new AppError(
            `Reviewer ${reviewerId} lacks required permissions`,
            403
          );
        }
      }

      // Get active evaluation criteria
      const criteria = await tx.evaluationCriteria.findMany({
        where: { isActive: true },
      });

      if (!criteria.length) {
        throw new AppError("No active evaluation criteria found", 400);
      }

      // Create evaluations for each employee-reviewer pair
      const evaluations = await Promise.all(
        data.employeeIds.map(async (employeeId) =>
          Promise.all(
            data.reviewerIds.map(async (reviewerId) =>
              tx.performanceEvaluation.create({
                data: {
                  projectId,
                  employeeId,
                  reviewerId,
                  type: "PROJECT",
                  status: "PENDING",
                  dueDate: data.dueDate,
                },
                include: {
                  employee: {
                    select: {
                      id: true,
                      name: true,
                      email: true,
                    },
                  },
                  reviewer: {
                    select: {
                      id: true,
                      name: true,
                      role: true,
                    },
                  },
                },
              })
            )
          )
        )
      );

      return evaluations;
    });
  }

  async getEmployeeEvaluationSummary(
    employeeId: string,
    options?: {
      startDate?: Date;
      endDate?: Date;
      type?: "PROJECT" | "REGULAR" | "SEMI_ANNUAL";
    }
  ) {
    const where = {
      employeeId,
      status: "COMPLETED",
      ...(options?.type && { type: options.type }),
      ...(options?.startDate &&
        options?.endDate && {
          completedAt: {
            gte: options.startDate,
            lte: options.endDate,
          },
        }),
    };

    const evaluations = await prisma.performanceEvaluation.findMany({
      where,
      include: {
        criteria: {
          include: {
            criteria: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
          },
        },
        reviewer: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
      },
      orderBy: {
        completedAt: "desc",
      },
    });

    // Calculate overall average
    const overallScore =
      evaluations.reduce((acc, evaluation) => acc + evaluation.score, 0) /
      evaluations.length;

    // Calculate criteria-wise averages
    const criteriaScores = new Map();
    evaluations.forEach((evaluation) => {
      evaluation.criteria.forEach((score) => {
        const current = criteriaScores.get(score.criteriaId) || {
          total: 0,
          count: 0,
        };
        criteriaScores.set(score.criteriaId, {
          total: current.total + score.score,
          count: current.count + 1,
        });
      });
    });

    const criteriaAverages = Array.from(criteriaScores.entries()).map(
      ([criteriaId, scores]) => ({
        criteriaId,
        averageScore: scores.total / scores.count,
      })
    );

    return {
      employeeId,
      overallScore,
      criteriaAverages,
      evaluations,
    };
  }
}
