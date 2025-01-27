import { RoleType } from "types/role";

const { RoleService } = require("../services/role.service");
const { AppError } = require("../utils/AppError");

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
}

module.exports = { RoleController };
