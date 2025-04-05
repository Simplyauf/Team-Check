const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");

async function generateTestToken() {
  const prisma = new PrismaClient();

  try {
    console.log("Finding test user...");
    const user = await prisma.user.findFirst();

    if (!user) {
      console.error("❌ No user found in database");
      process.exit(1);
    }

    console.log("✅ Found user:", user.email);

    // Generate tokens directly instead of using AuthService
    const accessToken = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "30d" }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET || "your-refresh-secret-key",
      { expiresIn: "30d" }
    );

    console.log("\n=== TEST TOKEN GENERATED ===\n");
    console.log("Access Token:");
    console.log(accessToken);
    console.log("\nRefresh Token:");
    console.log(refreshToken);
    console.log("\nUser ID:", user.id);
    console.log("User Email:", user.email);
    console.log("\nExpires in: 30 days");
    console.log("\n=== END TOKEN INFO ===\n");

    // Save refresh token to database
    await prisma.userSession.create({
      data: {
        userId: user.id,
        refreshToken,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });
  } catch (error) {
    console.error("❌ Error generating token:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
generateTestToken();
