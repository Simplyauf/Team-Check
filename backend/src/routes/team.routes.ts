const { Router } = require("express");
const { TeamController } = require("../controllers/team.controller");
const { protect } = require("../middlewares/auth.middleware");
const { checkPermission } = require("../middlewares/permission.middleware");

const router = Router();
const teamController = new TeamController();

router.post(
  "/",
  protect,
  checkPermission("team:create"),
  teamController.createTeam
);

router.post(
  "/:teamId/leads",
  protect,
  checkPermission("team:manage"),
  teamController.assignTeamLead
);

router.patch(
  "/:teamId/title",
  protect,
  checkPermission("team:update"),
  teamController.updateTeamTitle
);

router.patch(
  "/:teamId/settings",
  protect,
  checkPermission("team:manage"),
  teamController.updateSettings
);

router.post(
  "/bulk",
  protect,
  checkPermission("team:manage"),
  teamController.bulkOperations
);

// Add member management routes
router.post(
  "/:teamId/members",
  protect,
  checkPermission("team:manage"),
  teamController.addMembers
);

router.delete(
  "/:teamId/members",
  protect,
  checkPermission("team:manage"),
  teamController.removeMembers
);

router.get(
  "/:teamId/hierarchy",
  protect,
  checkPermission("team:read"),
  teamController.getHierarchy
);

router.patch(
  "/:teamId/move",
  protect,
  checkPermission("team:manage"),
  teamController.moveTeam
);

router.post(
  "/project",
  protect,
  checkPermission("team:create"),
  teamController.createProjectTeam
);

router.post(
  "/project/:teamId/complete",
  protect,
  checkPermission("team:manage"),
  teamController.completeProjectTeam
);

module.exports = router;
