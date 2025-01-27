const { Router } = require("express");
const { AuthController } = require("../controllers/auth.controller.ts");
const { validateRequest } = require("../middlewares/validation.middleware.ts");
const { loginSchema, registerSchema } = require("../validators/auth.schema.ts");
const { protect } = require("../middlewares/auth.middleware.ts");

const router = Router();
const authController = new AuthController();

router.post("/google", authController.googleAuth);
router.post(
  "/register",
  protect,
  validateRequest(registerSchema),
  authController.register
);
router.post("/refresh-token", authController.refreshToken);
router.post("/logout", protect, authController.logout);
router.get("/me", protect, authController.getCurrentUser);

module.exports = router;
