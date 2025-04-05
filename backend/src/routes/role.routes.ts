import express from "express";
const { protect, requireWorkspace } = require("../middlewares/auth.middleware");
const { RoleController } = require("../controllers/role.controller");

const router = express.Router();
const roleController = new RoleController();

// All routes require authentication and workspace context
router.use(protect);
router.use(requireWorkspace);

// Get workspace roles
router.get("/", roleController.getWorkspaceRoles);

// Create custom role
router.post("/", roleController.createRole);

// Update role
router.patch("/:roleId", roleController.updateRole);

// Get role hierarchy
router.get("/hierarchy", roleController.getRoleHierarchy);

// Assign role to user
router.post("/assign", roleController.assignRole);

// Delegate permissions
router.post("/delegate", roleController.delegatePermissions);

// Revoke delegated permissions
router.post("/revoke", roleController.revokeDelegatedPermissions);

module.exports = router;
