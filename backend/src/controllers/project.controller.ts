import { NextFunction } from "express";
const { ProjectService } = require("../services/project.service");
const { AppError } = require("../utils/AppError");
const { RoleService } = require("../services/role.service");
import {
  CustomRequest,
  CustomResponse,
  ProjectParams,
  ProjectMembersBody,
  ProjectLeadBody,
  ProjectSettingsBody,
  CreateProjectBody,
} from "../types/types";

class ProjectController {
  private projectService: typeof ProjectService;
  private roleService: typeof RoleService;

  constructor() {
    this.projectService = new ProjectService();
    this.roleService = new RoleService();
  }

  createProject = async (
    req: CustomRequest<ProjectParams, CreateProjectBody>,
    res: CustomResponse,
    next: NextFunction
  ) => {
    try {
      const { workspaceId } = req.params;
      const managerId = req.user.id;

      const project = await this.projectService.createProject(managerId, {
        ...req.body,
        workspaceId,
        startDate: new Date(req.body.startDate),
        endDate: new Date(req.body.endDate),
        milestones: req.body.milestones.map((m) => ({
          ...m,
          dueDate: new Date(m.dueDate),
        })),
      });

      return res.status(201).json({ project });
    } catch (error) {
      next(error);
    }
  };

  addMembers = async (
    req: CustomRequest<ProjectParams, ProjectMembersBody>,
    res: CustomResponse,
    next: NextFunction
  ) => {
    try {
      const { projectId } = req.params;
      const { memberIds } = req.body;
      const managerId = req.user.id;

      const members = await this.projectService.addProjectMembers(
        projectId,
        managerId,
        memberIds
      );

      return res.status(200).json({ members });
    } catch (error) {
      next(error);
    }
  };

  removeMembers = async (
    req: CustomRequest<ProjectParams, ProjectMembersBody>,
    res: CustomResponse,
    next: NextFunction
  ) => {
    try {
      const { projectId } = req.params;
      const { memberIds } = req.body;
      const managerId = req.user.id;

      await this.projectService.removeProjectMembers(
        projectId,
        managerId,
        memberIds
      );

      return res.status(200).json({ message: "Members removed successfully" });
    } catch (error) {
      next(error);
    }
  };

  assignProjectLead = async (
    req: CustomRequest<ProjectParams, ProjectLeadBody>,
    res: CustomResponse,
    next: NextFunction
  ) => {
    try {
      const { projectId } = req.params;
      const { leadId } = req.body;
      const managerId = req.user.id;

      const project = await this.projectService.assignProjectLead(
        projectId,
        managerId,
        leadId
      );

      return res.status(200).json({ project });
    } catch (error) {
      next(error);
    }
  };

  completeProject = async (
    req: CustomRequest<ProjectParams>,
    res: CustomResponse,
    next: NextFunction
  ) => {
    try {
      const { projectId } = req.params;
      const managerId = req.user.id;

      const project = await this.projectService.completeProject(
        projectId,
        managerId
      );

      return res.status(200).json({ project });
    } catch (error) {
      next(error);
    }
  };
}

export default ProjectController;
