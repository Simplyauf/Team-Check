import { RoleType } from "../types/role";
import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";

const { RoleService } = require("../services/role.service");
const { AppError } = require("../utils/AppError");

interface RequestWithWorkspace extends Request {
  workspace: {
    id: string;
  };
}

class RoleController {
  roleService;

  constructor() {
    this.roleService = new RoleService();
  }

  delegatePermissions = async (req, res, next) => {
    try {
      const { workspaceId } = req.params;
      const { teamLeadId, permissions } = req.body;
      const managerId = req.user.id;

      const updatedRole = await this.roleService.delegatePermissions(
        managerId,
        teamLeadId,
        permissions,
        workspaceId
      );

      return res.status(200).json({ role: updatedRole });
    } catch (error) {
      next(error);
    }
  };

  // Create custom role
  createRole = async (req, res, next) => {
    try {
      const { workspaceId } = req.params;
      const roleData = {
        ...req.body,
        workspaceId,
        type: RoleType.CUSTOM,
      };
      const role = await this.roleService.createRole(roleData);
      return res.status(201).json({ role });
    } catch (error) {
      next(error);
    }
  };

  // Update role permissions
  updateRole = async (req, res, next) => {
    try {
      const { roleId } = req.params;
      const role = await this.roleService.updateRole(roleId, req.body);
      return res.status(200).json({ role });
    } catch (error) {
      next(error);
    }
  };

  // Get role hierarchy
  getRoleHierarchy = async (req, res, next) => {
    try {
      const { workspaceId } = req.params;
      const hierarchy = await this.roleService.buildHierarchyTree(workspaceId);
      return res.status(200).json({ hierarchy });
    } catch (error) {
      next(error);
    }
  };

  // Assign role to user
  assignRole = async (req, res, next) => {
    try {
      const { workspaceId, userId, roleId } = req.body;
      const result = await this.roleService.assignRole(
        userId,
        workspaceId,
        roleId
      );
      return res.status(200).json({ result });
    } catch (error) {
      next(error);
    }
  };

  // Revoke delegated permissions
  revokeDelegatedPermissions = async (req, res, next) => {
    try {
      const { workspaceId } = req.params;
      const { teamLeadId, permissions } = req.body;
      const managerId = req.user.id;

      const updatedRole = await this.roleService.revokeDelegatedPermissions(
        managerId,
        teamLeadId,
        permissions,
        workspaceId
      );

      return res.status(200).json({ role: updatedRole });
    } catch (error) {
      next(error);
    }
  };

  getWorkspaceRoles = async (
    req: RequestWithWorkspace,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const workspaceId = req.workspace.id;

      const roles = await prisma.role.findMany({
        where: {
          workspaceId,
        },
        select: {
          id: true,
          name: true,
          type: true,
          permissions: true,
          precedence: true,
          metadata: true,
        },
        orderBy: {
          precedence: "desc", // Higher precedence roles first
        },
      });

      return res.status(200).json({
        status: "success",
        data: roles,
      });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = { RoleController };
