import express from "express";
const authRoutes = require("./auth.routes");
const workspaceRoutes = require("./workspace.routes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/workspaces", workspaceRoutes);

module.exports = router;
