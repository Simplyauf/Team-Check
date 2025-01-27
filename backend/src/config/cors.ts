const corsOptions = {
  origin: "https://eb20-102-89-84-226.ngrok-free.app",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "x-workspace-id",
    "x-refresh-token",
  ],
  exposedHeaders: ["X-New-Access-Token"],
};

module.exports = corsOptions;
