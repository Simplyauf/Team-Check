import { UpdateTeamDto } from "types/teams";

const { prisma } = require("../lib/prisma");
const { AppError } = require("../utils/AppError");
const { AuditLogger } = require("./audit.logger");

interface CreateTeamDto {
  name: string;
  displayName: string;
  description?: string;
  workspaceId: string;
  parentId?: string;
  metadata?: Record<string, any>;
}

interface CreateTeamLeadDto {
  teamId: string;
  leadId: string;
  title: string;
  type: "PRIMARY" | "SECONDARY";
  permissions?: Record<string, any>;
}

interface TeamSettings {
  displayNameFormat: string;
  leadTitles: {
    primary: string;
    secondary: string;
  };
  membershipRules: {
    maxMembers?: number;
    allowMultipleTeams: boolean;
    requireLead: boolean;
    allowCrossTeam: boolean;
  };
  notifications: {
    memberJoined: boolean;
    memberLeft: boolean;
    leadChanged: boolean;
    teamUpdated: boolean;
  };
  customization: {
    color?: string;
    icon?: string;
    bannerImage?: string;
  };
  privacy: {
    visibility: "public" | "private" | "workspace";
    joinPolicy: "open" | "approval" | "invite";
  };
  metrics: {
    trackAttendance: boolean;
    trackPerformance: boolean;
    customMetrics: Record<string, boolean>;
  };
}

export class TeamService {
  private auditLogger: typeof AuditLogger;

  constructor() {
    this.auditLogger = new AuditLogger();
  }

  async createTeam(data: CreateTeamDto) {
    const workspace = await prisma.workspace.findUnique({
      where: { id: data.workspaceId },
    });

    if (!workspace) {
      throw new AppError("Workspace not found", 404);
    }

    if (data.parentId) {
      const parentTeam = await prisma.team.findUnique({
        where: { id: data.parentId },
      });

      if (!parentTeam) {
        throw new AppError("Parent team not found", 404);
      }
    }

    return await prisma.team.create({
      data: {
        ...data,
        metadata: data.metadata || {},
      },
    });
  }

  async assignTeamLead(data: CreateTeamLeadDto) {
    const member = await prisma.workspaceMember.findFirst({
      where: {
        id: data.leadId,
        team: {
          id: data.teamId,
        },
      },
    });

    if (!member) {
      throw new AppError("Member not found in team", 404);
    }

    return await prisma.teamLead.create({
      data: {
        ...data,
        permissions: data.permissions || {},
      },
    });
  }

  async updateTeamTitle(teamId: string, displayName: string) {
    return await prisma.team.update({
      where: { id: teamId },
      data: { displayName },
    });
  }

  async updateLeadTitle(leadId: string, title: string) {
    return await prisma.teamLead.update({
      where: { id: leadId },
      data: { title },
    });
  }

  async addTeamMembers(teamId: string, memberIds: string[]) {
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: { members: true },
    });

    if (!team) {
      throw new AppError("Team not found", 404);
    }

    const existingMembers = team.members.map((m) => m.memberId);
    const newMembers = memberIds.filter((id) => !existingMembers.includes(id));

    return await prisma.$transaction(
      newMembers.map((memberId) =>
        prisma.teamMember.create({
          data: {
            teamId,
            memberId,
          },
        })
      )
    );
  }

  async removeTeamMembers(teamId: string, memberIds: string[]) {
    return await prisma.teamMember.deleteMany({
      where: {
        teamId,
        memberId: { in: memberIds },
      },
    });
  }

  async moveTeam(teamId: string, newParentId: string | null) {
    if (newParentId) {
      const parentTeam = await prisma.team.findUnique({
        where: { id: newParentId },
      });

      if (!parentTeam) {
        throw new AppError("Parent team not found", 404);
      }

      // Check for circular reference
      if (await this.isCircularReference(teamId, newParentId)) {
        throw new AppError("Circular team hierarchy not allowed", 400);
      }
    }

    return await prisma.team.update({
      where: { id: teamId },
      data: { parentId: newParentId },
    });
  }

  private async isCircularReference(
    teamId: string,
    parentId: string
  ): Promise<boolean> {
    let currentId = parentId;
    const visited = new Set<string>();

    while (currentId) {
      if (currentId === teamId) return true;
      if (visited.has(currentId)) return true;

      visited.add(currentId);
      const parent = await prisma.team.findUnique({
        where: { id: currentId },
        select: { parentId: true },
      });

      if (!parent?.parentId) break;
      currentId = parent.parentId;
    }

    return false;
  }

  async getTeamHierarchy(teamId: string) {
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: {
        members: {
          include: {
            member: {
              include: {
                user: true,
              },
            },
          },
        },
        leads: {
          include: {
            lead: {
              include: {
                user: true,
              },
            },
          },
        },
        children: true,
      },
    });

    if (!team) {
      throw new AppError("Team not found", 404);
    }

    return team;
  }

  async updateTeamMetadata(teamId: string, metadata: Record<string, any>) {
    return await prisma.team.update({
      where: { id: teamId },
      data: {
        metadata: {
          ...(await this.getTeamMetadata(teamId)),
          ...metadata,
        },
      },
    });
  }

  private async getTeamMetadata(teamId: string) {
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      select: { metadata: true },
    });
    return (team?.metadata as Record<string, any>) || {};
  }

  async updateTeamSettings(teamId: string, settings: Partial<TeamSettings>) {
    const team = await prisma.team.findUnique({
      where: { id: teamId },
    });

    if (!team) {
      throw new AppError("Team not found", 404);
    }

    const currentSettings = team.metadata?.settings || {};

    try {
      const updatedTeam = await prisma.$transaction(async (tx) => {
        // Save old settings for rollback
        const oldSettings = { ...currentSettings };

        const updated = await tx.team.update({
          where: { id: teamId },
          data: {
            metadata: {
              ...team.metadata,
              settings: {
                ...currentSettings,
                ...settings,
              },
            },
          },
        });

        await this.auditLogger.log({
          action: "UPDATE_TEAM_SETTINGS",
          entityId: teamId,
          entityType: "TEAM",
          changes: {
            before: oldSettings,
            after: updated.metadata.settings,
          },
        });

        return updated;
      });

      return updatedTeam;
    } catch (error) {
      throw new AppError("Failed to update team settings", 500);
    }
  }

  async bulkTeamOperations(
    workspaceId: string,
    operations: {
      create?: Array<Omit<CreateTeamDto, "workspaceId">>;
      update?: Array<{ id: string; data: Partial<CreateTeamDto> }>;
      delete?: string[];
    }
  ) {
    const session = await prisma.$transaction(async (tx) => {
      try {
        const results = {
          created: [],
          updated: [],
          deleted: [],
          failed: [],
        };

        // Store original state for rollback
        const originalState = await this.captureOriginalState(operations, tx);

        // Execute operations
        if (operations.create) {
          for (const team of operations.create) {
            try {
              const created = await tx.team.create({
                data: {
                  ...team,
                  workspaceId,
                },
              });
              results.created.push(created);
            } catch (error) {
              results.failed.push({ operation: "CREATE", data: team, error });
            }
          }
        }

        if (operations.update) {
          for (const { id, data } of operations.update) {
            try {
              const updated = await tx.team.update({
                where: { id },
                data,
              });
              results.updated.push(updated);
            } catch (error) {
              results.failed.push({
                operation: "UPDATE",
                data: { id, ...data },
                error,
              });
            }
          }
        }

        if (operations.delete) {
          for (const id of operations.delete) {
            try {
              await tx.team.delete({
                where: { id },
              });
              results.deleted.push(id);
            } catch (error) {
              results.failed.push({ operation: "DELETE", data: { id }, error });
            }
          }
        }

        // If any operation failed, throw error for rollback
        if (results.failed.length > 0) {
          throw new AppError("Some operations failed", 400, results);
        }

        // Log successful operations
        await this.auditLogger.logBulkOperations({
          workspaceId,
          operations: results,
          originalState,
        });

        return results;
      } catch (error) {
        // Rollback will happen automatically due to transaction
        throw error;
      }
    });

    return session;
  }

  private async captureOriginalState(operations: any, tx: any) {
    const state = {
      existing: new Map(),
    };

    if (operations.update || operations.delete) {
      const ids = [
        ...(operations.update || []).map((op) => op.id),
        ...(operations.delete || []),
      ];

      const existing = await tx.team.findMany({
        where: {
          id: { in: ids },
        },
      });

      existing.forEach((team) => state.existing.set(team.id, team));
    }

    return state;
  }

  async createProjectTeam(data: {
    name: string;
    displayName: string;
    workspaceId: string;
    projectId: string;
    startDate?: Date;
    endDate?: Date;
    leadId: string;
    memberIds: string[];
  }) {
    return await prisma.$transaction(async (tx) => {
      // Create project team
      const team = await tx.team.create({
        data: {
          name: data.name,
          displayName: data.displayName,
          type: "PROJECT",
          projectId: data.projectId,
          workspaceId: data.workspaceId,
          startDate: data.startDate,
          endDate: data.endDate,
          status: "ACTIVE",
        },
      });

      // Assign team lead with PROJECT scope
      await tx.teamLead.create({
        data: {
          teamId: team.id,
          leadId: data.leadId,
          title: "Project Lead",
          type: "PRIMARY",
          scope: "PROJECT",
          permissions: {}, // Will be delegated by manager
        },
      });

      // Add team members
      await Promise.all(
        data.memberIds.map((memberId) =>
          tx.teamMember.create({
            data: {
              teamId: team.id,
              memberId,
            },
          })
        )
      );

      return team;
    });
  }

  async updateTeam(teamId: string, data: Partial<UpdateTeamDto>) {
    const team = await prisma.team.findUnique({
      where: { id: teamId },
    });

    if (!team) {
      throw new AppError("Team not found", 404);
    }

    return await prisma.team.update({
      where: { id: teamId },
      data,
    });
  }
}
