import { Role } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      user?: any;
      workspace?: {
        id: string;
      };
      userRole?: Role;
    }
  }
}

export {};
