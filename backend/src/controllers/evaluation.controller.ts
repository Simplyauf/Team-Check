import { CustomRequest, CustomResponse } from "../types/types";
import { NextFunction } from "express";
import { EvaluationService } from "../services/evaluation.service";
const { RoleService } = require("../services/role.service");
import {
  EvaluationParams,
  CreateEvaluationBody,
  SubmitEvaluationBody,
  EvaluationCriteriaBody,
} from "../types/evaluation.types";

export class EvaluationController {
  private evaluationService: EvaluationService;
  private roleService: typeof RoleService;

  constructor() {
    this.evaluationService = new EvaluationService(this.roleService);
    this.roleService = new RoleService();
  }

  createProjectEvaluation = async (
    req: CustomRequest<EvaluationParams, CreateEvaluationBody>,
    res: CustomResponse,
    next: NextFunction
  ) => {
    try {
      const { projectId } = req.params;
      const managerId = req.user.id;

      const evaluations = await this.evaluationService.createProjectEvaluation(
        projectId,
        managerId,
        {
          ...req.body,
          dueDate: new Date(req.body.dueDate),
        }
      );

      return res.status(201).json({ evaluations });
    } catch (error) {
      next(error);
    }
  };

  processEvaluation = async (
    req: CustomRequest<EvaluationParams, SubmitEvaluationBody>,
    res: CustomResponse,
    next: NextFunction
  ) => {
    try {
      const { evaluationId } = req.params;
      const reviewerId = req.user.id;

      const evaluation = await this.evaluationService.processEvaluation(
        evaluationId,
        reviewerId,
        req.body
      );

      return res.status(200).json({ evaluation });
    } catch (error) {
      next(error);
    }
  };

  getEmployeeEvaluations = async (
    req: CustomRequest<{ employeeId: string }>,
    res: CustomResponse,
    next: NextFunction
  ) => {
    try {
      const { employeeId } = req.params;
      const { startDate, endDate, type } = req.query;

      const evaluations = await this.evaluationService.getEmployeeEvaluations(
        employeeId,
        {
          startDate: startDate ? new Date(startDate as string) : undefined,
          endDate: endDate ? new Date(endDate as string) : undefined,
          type: type as "PROJECT" | "REGULAR" | "SEMI_ANNUAL",
        }
      );

      return res.status(200).json({ evaluations });
    } catch (error) {
      next(error);
    }
  };

  getEmployeeEvaluationSummary = async (
    req: CustomRequest<{ employeeId: string }>,
    res: CustomResponse,
    next: NextFunction
  ) => {
    try {
      const { employeeId } = req.params;
      const { startDate, endDate, type } = req.query;

      const summary = await this.evaluationService.getEmployeeEvaluationSummary(
        employeeId,
        {
          startDate: startDate ? new Date(startDate as string) : undefined,
          endDate: endDate ? new Date(endDate as string) : undefined,
          type: type as "PROJECT" | "REGULAR" | "SEMI_ANNUAL",
        }
      );

      return res.status(200).json({ summary });
    } catch (error) {
      next(error);
    }
  };

  createEvaluationCriteria = async (
    req: CustomRequest<{}, EvaluationCriteriaBody>,
    res: CustomResponse,
    next: NextFunction
  ) => {
    try {
      const criteria = await this.evaluationService.createEvaluationCriteria(
        req.body
      );

      return res.status(201).json({ criteria });
    } catch (error) {
      next(error);
    }
  };
}
