import { z } from "zod";

// Validation schemas
export const createEvaluationSchema = z.object({
  employeeIds: z.array(z.string()),
  reviewerIds: z.array(z.string()),
  dueDate: z.string(),
  type: z.enum(["PROJECT", "REGULAR", "SEMI_ANNUAL"]),
});

export const submitEvaluationSchema = z.object({
  scores: z.array(
    z.object({
      criteriaId: z.string(),
      score: z.number().min(0).max(10),
      comment: z.string().optional(),
    })
  ),
  overallComment: z.string().optional(),
});

export const evaluationCriteriaSchema = z.object({
  name: z.string(),
  description: z.string(),
  weight: z.number().min(0).max(1),
});

export interface EvaluationParams {
  evaluationId?: string;
  projectId?: string;
}
export interface CreateEvaluationBody {
  employeeIds: string[];
  reviewerIds: string[];
  dueDate: string;
  type: "PROJECT" | "REGULAR" | "SEMI_ANNUAL";
}
export interface SubmitEvaluationBody {
  scores: Array<{
    criteriaId: string;
    score: number;
    comment?: string;
  }>;

  overallComment?: string;
}
export interface EvaluationCriteriaBody {
  name: string;
  description: string;
  weight: number;
}
export interface EvaluationResponse {
  id: string;
  projectId?: string;
  employeeId: string;
  reviewerId: string;
  type: string;
  score: number;
  status: string;
  createdAt: Date;

  criteria: Array<{
    id: string;
    criteriaId: string;
    score: number;
    comment?: string;
    criteria: {
      name: string;
      description: string;
      weight: number;
    };
  }>;
}
export interface EvaluationSummary {
  overall: number;
  projectScores: Array<{
    projectId: string;
    projectName: string;
    score: number;
    completedAt: Date;
  }>;
  criteriaAverages: Array<{
    criteriaId: string;
    name: string;
    averageScore: number;
  }>;
  recentEvaluations: Array<{
    id: string;
    type: string;
    score: number;
    completedAt: Date;
    reviewer: {
      id: string;
      name: string;
    };
  }>;
}
