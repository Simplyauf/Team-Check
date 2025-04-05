import express from "express";
const { protect, requireWorkspace } = require("../middlewares/auth.middleware");
const { InviteController } = require("../controllers/invite.controller");

const router = express.Router({ mergeParams: true });
const inviteController = new InviteController();

// Public routes (no authentication required)
router.get("/details/:token", inviteController.getInviteDetails);
router.post("/accept/:token", inviteController.acceptInvite);
router.post("/reject/:token", inviteController.rejectInvite);

// Protected routes (require authentication and workspace context)
router.use(protect);
router.use(requireWorkspace);

router.post("/", inviteController.createInvite);
router.post("/:inviteId/resend", inviteController.resendInvite);
router.delete("/:inviteId", inviteController.cancelInvite);

module.exports = router;
