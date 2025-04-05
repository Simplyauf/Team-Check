const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const { prisma } = require("../lib/prisma");
const { AppError } = require("../utils/AppError");

interface TokenPayload {
  id: string;
  email: string;
  workspaceId?: string;
}

interface SessionTokens {
  accessToken: string;
  refreshToken: string;
}

class AuthService {
  private googleClient: typeof OAuth2Client;

  constructor() {
    this.googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }

  async verifyGoogleToken(token: string) {
    try {
      console.log("Starting Google token verification");
      const ticket = await this.googleClient.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      console.log("Token verified successfully");
      return ticket.getPayload();
    } catch (error) {
      console.error("Google verification error:", error);
      throw new AppError("Invalid Google token: " + error.message, 401);
    }
  }

  async findOrCreateUser(googleData: any) {
    try {
      const user = await prisma.user.upsert({
        where: { email: googleData.email },
        update: {
          name: googleData.name,
          avatar: googleData.picture,
          googleId: googleData.sub,
        },
        create: {
          email: googleData.email,
          name: googleData.name,
          avatar: googleData.picture,
          googleId: googleData.sub,
        },
      });
      return user;
    } catch (error) {
      throw new AppError("Error creating user", 500);
    }
  }

  private generateTokens(payload: TokenPayload): SessionTokens {
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: "56m",
    });

    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: "7d",
    });

    return { accessToken, refreshToken };
  }

  async createSession(user: any, workspaceId?: string) {
    const payload: TokenPayload = {
      id: user.id,
      email: user.email,
      workspaceId,
    };

    const tokens = this.generateTokens(payload);

    // Store refresh token hash in database
    await prisma.userSession.create({
      data: {
        userId: user.id,
        refreshToken: tokens.refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return tokens;
  }

  async refreshSession(refreshToken: string) {
    try {
      const decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET
      ) as TokenPayload;

      const session = await prisma.userSession.findFirst({
        where: {
          userId: decoded.id,
          refreshToken,
          expiresAt: { gt: new Date() },
        },
      });

      if (!session) {
        throw new AppError("Invalid refresh token", 401);
      }

      const tokens = this.generateTokens({
        id: decoded.id,
        email: decoded.email,
        workspaceId: decoded.workspaceId,
      });

      // Update session with new refresh token
      await prisma.userSession.update({
        where: { id: session.id },
        data: {
          refreshToken: tokens.refreshToken,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });

      return tokens;
    } catch (error) {
      throw new AppError("Invalid refresh token", 401);
    }
  }

  async getCurrentUserWithWorkspaces(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
      include: {
        workspaces: {
          include: {
            workspace: true,
            role: true,
          },
        },
      },
    });
  }

  async logout(userId: string, refreshToken: string) {
    await prisma.userSession.deleteMany({
      where: {
        userId,
        refreshToken,
      },
    });
  }
}

export { AuthService };
