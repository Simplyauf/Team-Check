const express = require("express");
const { Request, Response, NextFunction, CookieOptions } = require("express");
const { CookieParserRequest } = require("cookie-parser");

const { AuthService } = require("../services/auth.service");
const { WorkspaceService } = require("../services/workspace.service");
const { AppError } = require("../utils/AppError");

interface GoogleAuthRequest {
  token: string;
  workspaceId?: string;
}

interface RegisterRequest {
  email: string;
  name: string;
  workspaceName: string;
  workspaceSubdomain: string;
}

interface RequestWithUser extends Request {
  user?: {
    id: string;
  };
  cookies: {
    [key: string]: string;
  };
}

interface TypedResponse {
  cookie(
    name: string,
    value: any,
    options: typeof CookieOptions
  ): TypedResponse;
  clearCookie(name: string, options?: typeof CookieOptions): TypedResponse;
  status(code: number): TypedResponse;
  json(body: any): TypedResponse;
}

type ExpressResponse = Response & TypedResponse;

class AuthController {
  private authService: typeof AuthService;
  private workspaceService: typeof WorkspaceService;

  constructor(
    authService = new AuthService(),
    workspaceService = new WorkspaceService()
  ) {
    this.authService = authService;
    this.workspaceService = workspaceService;
  }

  // Development only: Generate test token
  generateTestToken = async (
    req: RequestWithUser,
    res: ExpressResponse,
    next: typeof NextFunction
  ) => {
    try {
      // Only allow in development
      if (process.env.NODE_ENV === "production") {
        throw new AppError("Not available in production", 403);
      }

      // Find the first user in the database
      const user = await this.authService.prisma.user.findFirst();

      if (!user) {
        throw new AppError("No test user found", 404);
      }

      // Create a session with 30-day validity
      const tokens = await this.authService.createSession(
        user,
        null,
        30 * 24 * 60 * 60
      ); // 30 days in seconds

      const cookieOptions = {
        httpOnly: true,
        secure: false, // Set to false for development
        sameSite: "lax" as const,
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
      };

      res.cookie("refreshToken", tokens.refreshToken, cookieOptions);

      return res.status(200).json({
        message: "Test token generated",
        user,
        accessToken: tokens.accessToken,
        expiresIn: "30 days",
      });
    } catch (error) {
      next(error);
    }
  };

  googleAuth = async (
    req: RequestWithUser & { body: GoogleAuthRequest },
    res: ExpressResponse,
    next: typeof NextFunction
  ) => {
    try {
      console.log("1. Google auth request received");
      const { token, workspaceId } = req.body;
      console.log("2. Token received:", token ? "Yes" : "No");

      console.log("3. Verifying Google token...");
      const googleData = await this.authService.verifyGoogleToken(token);
      console.log("4. Google token verified, data:", googleData);

      console.log("5. Finding or creating user...");
      const user = await this.authService.findOrCreateUser(googleData);
      console.log("6. User processed:", user.id);

      if (workspaceId) {
        console.log("7. Adding to workspace:", workspaceId);
        await this.workspaceService.addMemberToWorkspace(workspaceId, user.id);
      }

      console.log("8. Creating session...");
      const tokens = await this.authService.createSession(user, workspaceId);
      console.log("9. Session created");

      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax" as const,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      };

      res.cookie("refreshToken", tokens.refreshToken, cookieOptions);
      console.log("10. Response sending...");

      return res.status(200).json({
        user,
        accessToken: tokens.accessToken,
      });
    } catch (error) {
      console.error("Google Auth Error:", error);
      next(error);
    }
  };

  register = async (
    req: RequestWithUser & { body: RegisterRequest },
    res: ExpressResponse,
    next: typeof NextFunction
  ) => {
    try {
      const { workspaceName, workspaceSubdomain } = req.body;

      if (!req.user?.id) {
        throw new AppError("User not authenticated", 401);
      }

      const workspace = await this.workspaceService.createWorkspace({
        name: workspaceName,
        subdomain: workspaceSubdomain,
        ownerId: req.user.id,
        settings: {
          timezone: "UTC",
          workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          workingHours: { start: "09:00", end: "17:00" },
        },
      });

      const tokens = await this.authService.createSession(
        req.user,
        workspace.id
      );

      res.cookie("refreshToken", tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res
        .status(201)
        .json({ workspace, accessToken: tokens.accessToken });
    } catch (error) {
      next(error);
    }
  };

  logout = async (
    req: RequestWithUser,
    res: ExpressResponse,
    next: typeof NextFunction
  ) => {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (refreshToken) {
        await this.authService.logout(req.user.id, refreshToken);
      }

      res.clearCookie("refreshToken");
      return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
      next(error);
    }
  };

  refreshToken = async (
    req: RequestWithUser,
    res: ExpressResponse,
    next: typeof NextFunction
  ) => {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        throw new AppError("Refresh token required", 400);
      }

      const tokens = await this.authService.refreshSession(refreshToken);

      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax" as const,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      };

      res.cookie("refreshToken", tokens.refreshToken, cookieOptions);

      return res.status(200).json({
        accessToken: tokens.accessToken,
      });
    } catch (error) {
      next(error);
    }
  };

  getCurrentUser = async (
    req: RequestWithUser,
    res: ExpressResponse,
    next: typeof NextFunction
  ) => {
    try {
      if (!req.user?.id) {
        throw new Error("User not authenticated");
      }

      const user = await this.authService.getCurrentUserWithWorkspaces(
        req.user.id
      );
      return res.status(200).json({ user });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = { AuthController };
