const express = require("express");
const { AuthController } = require("../controllers/auth.controller");
const { protect } = require("../middlewares/auth.middleware");

const router = express.Router();
const authController = new AuthController();

// Public routes
router.post("/google", authController.googleAuth);
router.post("/refresh", authController.refreshToken);

// Development only route
if (process.env.NODE_ENV !== "production") {
  router.get("/dev/token", authController.generateTestToken);
}

// Protected routes
router.use(protect);
router.post("/register", authController.register);
router.post("/logout", authController.logout);
router.get("/me", authController.getCurrentUser);

module.exports = router;
