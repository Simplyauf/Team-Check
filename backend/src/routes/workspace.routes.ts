const express = require("express");
const { protect, requireWorkspace } = require("../middlewares/auth.middleware");
import {
  getWorkspaceDetails,
  createWorkspace,
  addWorkspaceMember,
  updateWorkspace,
  // Add these controller functions to workspace.controller.ts
} from "../controllers/workspace.controller";
const inviteRoutes = require("./invite.routes");
const { RoleController } = require("../controllers/role.controller");
const router = express.Router();
const roleController = new RoleController();

// Routes that don't require workspace context
router.use(protect); // Require authentication for all workspace routes
router.post("/", createWorkspace); // Create new workspace

// Routes that require workspace context
router.use(requireWorkspace);
router.get("/", getWorkspaceDetails); // Get current workspace details
router.patch("/:workspaceId", updateWorkspace); // Update workspace (including settings)
router.post("/members", addWorkspaceMember); // Add member to workspace

// Role routes
router.get("/:workspaceId/roles", roleController.getWorkspaceRoles);

// Invite routes - mount with workspace context
router.use("/:workspaceId/invites", inviteRoutes);

module.exports = router;
