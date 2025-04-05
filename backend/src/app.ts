import express from "express";
import cors from "cors";
const morgan = require("morgan");
const { logger } = require("./utils/logger");
const { errorHandler } = require("./middlewares/error.middleware");
const { prisma } = require("./lib/prisma");
const routes = require("./routes/index");
const corsOptions = require("./config/cors");

const app = express();

// Test database connection
async function testDbConnection() {
  try {
    await prisma.$connect();
    console.log("✅ Database connection successful");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.post("/test-post", (req, res) => {
  const body = req.body;
  res.status(200).json({
    status: "success",
    message: "POST request received",
    data: body,
  });
});

// Routes
const authRoutes = require("./routes/auth.routes");
const workspaceRoutes = require("./routes/workspace.routes");
const memberRoutes = require("./routes/member.routes");
const inviteRoutes = require("./routes/invite.routes");
const roleRoutes = require("./routes/role.routes");

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/workspaces", workspaceRoutes);
app.use("/api/members", memberRoutes);
app.use("/api/invites", inviteRoutes); // Public invite routes
app.use("/api/roles", roleRoutes);

// Error handling
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await testDbConnection();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

export default app;
