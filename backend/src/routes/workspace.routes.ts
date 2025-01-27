import express from "express";
const { protect, requireWorkspace } = require("../middlewares/auth.middleware");
import { getWorkspaceDetails } from "../controllers/workspace.controller";

const router = express.Router();

router.use(protect);
router.use(requireWorkspace);

router.get("/", getWorkspaceDetails);

module.exports = router;
