import { Router } from "express";
const { CheckInController } = require("../controllers/checkin.controller");
const { protect } = require("../middlewares/auth.middleware");
const { checkPermission } = require("../middlewares/permission.middleware");

const router = Router();
const checkInController = new CheckInController();

// Settings routes (admin/manager only)
router.post(
  "/:workspaceId/settings",
  protect,
  checkPermission("settings:manage"),
  checkInController.createSettings
);

// Check-in/out routes (all members)
router.post("/:workspaceId/check-in", protect, checkInController.checkIn);

router.post(
  "/:workspaceId/check-out/:checkInId",
  protect,
  checkInController.checkOut
);

router.get("/:workspaceId/prompts", protect, checkInController.getPrompts);

export { router as checkInRoutes };
