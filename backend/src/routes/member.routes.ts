import express from "express";
const { protect, requireWorkspace } = require("../middlewares/auth.middleware");
const memberController = require("../controllers/member.controller");

const router = express.Router();

// All routes require authentication and workspace context
router.use(protect);
router.use(requireWorkspace);

// Get all members (including pending)
router.get("/", memberController.getWorkspaceMembers);

// Get member details
router.get("/:memberId", memberController.getMemberDetails);

// Update member details (position, role)
router.patch("/:memberId", memberController.updateMember);

// Update member status
router.patch("/:memberId/status", memberController.updateMemberStatus);

// Remove member
router.delete("/:memberId", memberController.removeMember);

// Invite related routes
router.post("/invite", memberController.inviteMember);
router.post("/invite/:inviteId/resend", memberController.resendInvite);
router.delete("/invite/:inviteId", memberController.cancelInvite);

module.exports = router;
