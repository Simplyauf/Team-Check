const { prisma } = require("../lib/prisma.ts");

interface AuditLog {
  id: string;
  workspaceId: string;
  actorId: string;
  action: "create" | "update" | "delete";
  entityType: "role" | "permission" | "user";
  entityId: string;
  changes: {
    before: Record<string, any>;
    after: Record<string, any>;
  };
  metadata?: Record<string, any>;
  timestamp: Date;
}

class AuditLogger {
  async logPermissionChange(params: {
    workspaceId: string;
    actorId: string;
    action: string;
    entityType: string;
    entityId: string;
    changes: any;
  }) {
    await prisma.auditLog.create({
      data: {
        ...params,
        timestamp: new Date(),
      },
    });
  }

  async getAuditTrail(
    workspaceId: string,
    filters?: {
      entityType?: string;
      startDate?: Date;
      endDate?: Date;
    }
  ) {
    return await prisma.auditLog.findMany({
      where: {
        workspaceId,
        ...filters,
      },
      orderBy: {
        timestamp: "desc",
      },
    });
  }
}
