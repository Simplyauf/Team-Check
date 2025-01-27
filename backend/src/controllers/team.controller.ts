const { TeamService } = require("../services/team.service");
const { AppError } = require("../utils/AppError");
import { NextFunction } from "express";
import {
  CustomRequest,
  CustomResponse,
  TeamParams,
  TeamSettingsBody,
  TeamMembersBody,
  TeamLeadBody,
  TeamTitleBody,
} from "../types/types";
const { RoleService } = require("../services/role.service");
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { MANAGER_DELEGATABLE_PERMISSIONS } from "types/permissions";

const prisma = new PrismaClient();

class TeamController {
  private teamService: typeof TeamService;
  private roleService: typeof RoleService;

  constructor() {
    this.teamService = new TeamService();
    this.roleService = new RoleService();
  }

  updateSettings = async (
    req: CustomRequest<TeamParams, TeamSettingsBody>,
    res: CustomResponse,
    next: NextFunction
  ) => {
    try {
      const { teamId } = req.params;
      const { settings } = req.body;
      const team = await this.teamService.updateTeamSettings(teamId, settings);
      return res.status(200).json({ team });
    } catch (error) {
      next(error);
    }
  };

  addMembers = async (
    req: CustomRequest<TeamParams, TeamMembersBody>,
    res: CustomResponse,
    next: NextFunction
  ) => {
    try {
      const { teamId } = req.params;
      const { memberIds } = req.body;
      const members = await this.teamService.addTeamMembers(teamId, memberIds);
      return res.status(200).json({ members });
    } catch (error) {
      next(error);
    }
  };

  removeMembers = async (
    req: CustomRequest<TeamParams, TeamMembersBody>,
    res: CustomResponse,
    next: NextFunction
  ) => {
    try {
      const { teamId } = req.params;
      const { memberIds } = req.body;
      await this.teamService.removeTeamMembers(teamId, memberIds);
      return res.status(200).json({ message: "Members removed successfully" });
    } catch (error) {
      next(error);
    }
  };

  bulkOperations = async (
    req: CustomRequest<TeamParams, TeamSettingsBody>,
    res: CustomResponse,
    next: NextFunction
  ) => {
    try {
      const { workspaceId } = req.params;
      const operations = req.body;
      const results = await this.teamService.bulkTeamOperations(
        workspaceId,
        operations
      );
      return res.status(200).json(results);
    } catch (error) {
      if (error.details) {
        return res.status(400).json({
          message: "Some operations failed",
          details: error.details,
        });
      }
      next(error);
    }
  };

  moveTeam = async (
    req: CustomRequest<TeamParams, TeamLeadBody>,
    res: CustomResponse,
    next: NextFunction
  ) => {
    try {
      const { teamId } = req.params;
      const { parentId } = req.body;
      const team = await this.teamService.moveTeam(teamId, parentId);
      return res.status(200).json({ team });
    } catch (error) {
      next(error);
    }
  };

  getHierarchy = async (
    req: CustomRequest<TeamParams>,
    res: CustomResponse,
    next: NextFunction
  ) => {
    try {
      const { teamId } = req.params;
      const hierarchy = await this.teamService.getTeamHierarchy(teamId);
      return res.status(200).json({ hierarchy });
    } catch (error) {
      next(error);
    }
  };

  createTeam = async (
    req: CustomRequest<TeamParams, TeamLeadBody>,
    res: CustomResponse,
    next: NextFunction
  ) => {
    try {
      const team = await this.teamService.createTeam(req.body);
      return res.status(201).json({ team });
    } catch (error) {
      next(error);
    }
  };

  assignTeamLead = async (
    req: CustomRequest<TeamParams, TeamLeadBody>,
    res: CustomResponse,
    next: NextFunction
  ) => {
    try {
      const lead = await this.teamService.assignTeamLead(req.body);
      return res.status(201).json({ lead });
    } catch (error) {
      next(error);
    }
  };

  updateTeamTitle = async (
    req: CustomRequest<TeamParams, TeamTitleBody>,
    res: CustomResponse,
    next: NextFunction
  ) => {
    try {
      const { teamId } = req.params;
      const { displayName } = req.body;
      const team = await this.teamService.updateTeamTitle(teamId, displayName);
      return res.status(200).json({ team });
    } catch (error) {
      next(error);
    }
  };

  createProjectTeam = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { managerId } = req.user;
      const {
        name,
        displayName,
        workspaceId,
        projectId,
        startDate,
        endDate,
        leadId,
        memberIds,
      } = req.body;

      const team = await this.teamService.createProjectTeam({
        name,
        displayName,
        workspaceId,
        projectId,
        startDate,
        endDate,
        leadId,
        memberIds,
      });

      // Delegate project-specific permissions to the lead
      await this.roleService.delegateProjectPermissions(
        managerId,
        team.id,
        leadId
      );

      return res.status(201).json({ team });
    } catch (error) {
      next(error);
    }
  };

  completeProjectTeam = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { teamId } = req.params;
      const { managerId } = req.user;

      const team = await prisma.team.findUnique({
        where: { id: teamId },
        include: { leads: true },
      });

      if (!team || team.type !== "PROJECT") {
        throw new AppError("Invalid project team", 400);
      }

      // Revoke all delegated permissions from project leads
      for (const lead of team.leads) {
        if (lead.scope === "PROJECT") {
          await this.roleService.revokeDelegatedPermissions(
            managerId,
            lead.leadId,
            MANAGER_DELEGATABLE_PERMISSIONS,
            team.workspaceId
          );
        }
      }

      const updatedTeam = await this.teamService.updateTeam(teamId, {
        status: "COMPLETED",
        endDate: new Date(),
      });

      return res.status(200).json({ team: updatedTeam });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = { TeamController };
