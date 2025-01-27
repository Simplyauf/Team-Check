import { Router } from "express";
const { ProjectController } = require("../controllers/project.controller");
const { protect } = require("../middlewares/auth.middleware");
const { checkPermission } = require("../middlewares/permission.middleware");

const router = Router();
const projectController = new ProjectController();

// Create project
router.post(
  "/",
  protect,
  checkPermission("project:create"),
  projectController.createProject
);

// Project member management
router.post(
  "/:projectId/members",
  protect,
  checkPermission("project:manage"),
  projectController.addMembers
);

router.delete(
  "/:projectId/members",
  protect,
  checkPermission("project:manage"),
  projectController.removeMembers
);

// Project lead management
router.post(
  "/:projectId/lead",
  protect,
  checkPermission("project:manage"),
  projectController.assignProjectLead
);

// Project status management
router.patch(
  "/:projectId/complete",
  protect,
  checkPermission("project:manage"),
  projectController.completeProject
);

// Project settings and updates
router.patch(
  "/:projectId",
  protect,
  checkPermission("project:update"),
  projectController.updateProject
);

// Milestone management
router.post(
  "/:projectId/milestones",
  protect,
  checkPermission("project:manage"),
  projectController.createMilestone
);

router.patch(
  "/:projectId/milestones/:milestoneId",
  protect,
  checkPermission("project:manage"),
  projectController.updateMilestone
);

export default router;
