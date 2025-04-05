import express from "express";
const authRoutes = require("./auth.routes");
const workspaceRoutes = require("./workspace.routes");
const memberRoutes = require("./member.routes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/workspaces", workspaceRoutes);
router.use("/members", memberRoutes);

module.exports = router;
