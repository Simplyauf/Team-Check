import { Router } from "express";
const {
  EvaluationController,
} = require("../controllers/evaluation.controller");
const validateRequest = require("../middleware/validateRequest");
const isAuthenticated = require("../middleware/isAuthenticated");
const hasPermission = require("../middleware/hasPermission");
import {
  createEvaluationSchema,
  submitEvaluationSchema,
  evaluationCriteriaSchema,
} from "../types/evaluation.types";

const router = Router();
const evaluationController = new EvaluationController();

// Project evaluations
router.post(
  "/projects/:projectId/evaluations",
  isAuthenticated,
  hasPermission("evaluation:create"),
  validateRequest(createEvaluationSchema),
  evaluationController.createProjectEvaluation
);

// Process evaluation
router.post(
  "/evaluations/:evaluationId/submit",
  isAuthenticated,
  validateRequest(submitEvaluationSchema),
  evaluationController.processEvaluation
);

// Get employee evaluations
router.get(
  "/employees/:employeeId/evaluations",
  isAuthenticated,
  hasPermission("evaluation:view"),
  evaluationController.getEmployeeEvaluations
);

// Get employee evaluation summary
router.get(
  "/employees/:employeeId/evaluation-summary",
  isAuthenticated,
  hasPermission("evaluation:view"),
  evaluationController.getEmployeeEvaluationSummary
);

// Evaluation criteria management (admin only)
router.post(
  "/evaluation-criteria",
  isAuthenticated,
  hasPermission("evaluation:manage"),
  validateRequest(evaluationCriteriaSchema),
  evaluationController.createEvaluationCriteria
);

export default router;
