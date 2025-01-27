const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const cookieParser = require("cookie-parser");
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

// Middlewares
// app.use(helmet());
app.use(
  cors({
    origin: true, // Allow all origins temporarily for testing
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "x-workspace-id",
      "x-refresh-token",
    ],
    exposedHeaders: ["X-New-Access-Token"],
  })
);

app.use(compression());
app.use(express.json());
app.use(cookieParser());

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
app.use("/api", routes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    status: "error",
    message: err.message || "Internal server error",
  });
});

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

module.exports = app;
