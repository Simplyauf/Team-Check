const jwt = require("jsonwebtoken");
const { AppError } = require("../utils/AppError.ts");
const { prisma } = require("../lib/prisma.ts");
const env = require("../config/environment.ts");

const protect = async (req, res, next) => {
  try {
    // Check for access token
    const accessToken = req.headers.authorization?.split(" ")[1];
    const refreshToken = req.cookies.refreshToken;

    if (!accessToken && !refreshToken) {
      throw new AppError("Not authenticated", 401);
    }

    try {
      // Try to verify access token
      if (accessToken) {
        const decoded = jwt.verify(accessToken, env.JWT_SECRET);
        req.user = decoded;
        return next();
      }
    } catch (error) {
      // Access token invalid, try refresh token
      if (!refreshToken) {
        throw new AppError("Not authenticated", 401);
      }
    }

    // Verify refresh token and issue new access token
    const session = await prisma.userSession.findFirst({
      where: {
        refreshToken,
        expiresAt: { gt: new Date() },
      },
      include: {
        user: true,
      },
    });

    if (!session) {
      throw new AppError("Invalid refresh token", 401);
    }

    // Generate new access token
    const newAccessToken = jwt.sign(
      {
        id: session.user.id,
        email: session.user.email,
        workspaceId: req.headers["x-workspace-id"],
      },
      env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    // Set new access token in response
    res.setHeader("X-New-Access-Token", newAccessToken);
    req.user = jwt.decode(newAccessToken);

    next();
  } catch (error) {
    next(new AppError("Not authenticated", 401));
  }
};

const requireWorkspace = async (req, res, next) => {
  try {
    const workspaceId = req.headers["x-workspace-id"];
    if (!workspaceId) {
      throw new AppError("Workspace context required", 400);
    }

    const membership = await prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId: req.user.id,
          workspaceId,
        },
      },
      include: {
        role: true,
      },
    });

    if (!membership) {
      throw new AppError("Not a member of this workspace", 403);
    }

    req.workspace = { id: workspaceId };
    req.userRole = membership.role;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { protect, requireWorkspace };
