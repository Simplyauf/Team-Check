import { Request, Response, NextFunction } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";

export interface TeamParams extends ParamsDictionary {
  teamId?: string;
  workspaceId?: string;
}

export interface TeamSettingsBody {
  settings: Record<string, any>;
}

export interface TeamMembersBody {
  memberIds: string[];
}

export interface TeamLeadBody {
  leadId: string;
  title: string;
  type: "PRIMARY" | "SECONDARY";
  parentId?: string;
}

export interface TeamTitleBody {
  displayName: string;
}

export interface CustomRequest<
  P = ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = ParsedQs
> extends Request<P, ResBody, ReqBody, ReqQuery> {
  user?: any;
}

export interface CustomResponse<ResBody = any> extends Response<ResBody> {
  user?: any;
}

// Project Types
export interface ProjectParams {
  workspaceId?: string;
  projectId?: string;
}

export interface CreateProjectBody {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  teamName?: string;
  teamMembers: string[];
  teamLeadId: string;
  milestones: Array<{
    title: string;
    description: string;
    dueDate: string;
  }>;
}

export interface ProjectMembersBody {
  memberIds: string[];
}

export interface ProjectLeadBody {
  leadId: string;
  title?: string;
}

export interface ProjectSettingsBody {
  status?: "ACTIVE" | "PAUSED" | "COMPLETED" | "CANCELLED";
  description?: string;
  endDate?: string;
}

export interface ProjectMilestoneBody {
  title?: string;
  description?: string;
  dueDate?: string;
  status?: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "PAUSED";
}
