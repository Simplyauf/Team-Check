const { AppError } = require("../utils/AppError.ts");
const { RoleService } = require("../services/role.service.ts");

const roleService = new RoleService();

const checkPermission = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      const { workspaceId } = req.params;
      const userId = req.user.id;

      const userRole = await roleService.getRoleForUserInWorkspace(
        userId,
        workspaceId
      );
      const hasPermission = await roleService.checkUserPermission(
        userId,
        workspaceId,
        requiredPermission
      );

      if (!hasPermission) {
        throw new AppError("Insufficient permissions", 403);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = { checkPermission };
