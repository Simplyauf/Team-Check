import { MANAGER_DELEGATABLE_PERMISSIONS } from "types/permissions";

const { prisma } = require("../lib/prisma");
const { AppError } = require("../utils/AppError");
const { TeamService } = require("./team.service");
const { RoleService } = require("./role.service");

export class ProjectService {
  private teamService: typeof TeamService;
  private roleService: typeof RoleService;

  constructor() {
    this.teamService = new TeamService();
    this.roleService = new RoleService();
  }

  async createProject(
    managerId: string,
    data: {
      name: string;
      description: string;
      workspaceId: string;
      startDate: Date;
      endDate: Date;
      teamName?: string;
      teamMembers: string[];
      teamLeadId: string;
      milestones: Array<{
        title: string;
        description: string;
        dueDate: Date;
      }>;
    }
  ) {
    return await prisma.$transaction(async (tx) => {
      // Create project
      const project = await tx.project.create({
        data: {
          name: data.name,
          description: data.description,
          workspaceId: data.workspaceId,
          startDate: data.startDate,
          endDate: data.endDate,
          status: "ACTIVE",
          progress: 0,
          createdById: managerId,
        },
      });

      // Create project team
      const team = await this.teamService.createProjectTeam({
        name: data.teamName || `${data.name} Team`,
        displayName: data.teamName || `${data.name} Team`,
        workspaceId: data.workspaceId,
        projectId: project.id,
        startDate: data.startDate,
        endDate: data.endDate,
        leadId: data.teamLeadId,
        memberIds: data.teamMembers,
      });

      // Delegate project permissions to team lead
      await this.roleService.delegateProjectPermissions(
        managerId,
        team.id,
        data.teamLeadId
      );

      // Create milestones
      await tx.milestone.createMany({
        data: data.milestones.map((milestone, index) => ({
          projectId: project.id,
          title: milestone.title,
          description: milestone.description,
          dueDate: milestone.dueDate,
          status: "NOT_STARTED",
          order: index + 1,
        })),
      });

      return project;
    });
  }

  async updateProject(
    projectId: string,
    managerId: string,
    data: {
      name?: string;
      description?: string;
      status?: "ACTIVE" | "PAUSED" | "COMPLETED" | "CANCELLED";
      endDate?: Date;
    }
  ) {
    return await prisma.$transaction(async (tx) => {
      const project = await tx.project.findUnique({
        where: { id: projectId },
        include: { team: true },
      });

      if (!project) {
        throw new AppError("Project not found", 404);
      }

      // If completing or cancelling project, handle team permissions
      if (data.status === "COMPLETED" || data.status === "CANCELLED") {
        await this.teamService.completeProjectTeam(project.team.id, managerId);
      }

      return await tx.project.update({
        where: { id: projectId },
        data: {
          ...data,
          updatedAt: new Date(),
        },
      });
    });
  }

  async updateMilestone(
    projectId: string,
    milestoneId: string,
    data: {
      title?: string;
      description?: string;
      dueDate?: Date;
      status?: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "PAUSED";
    }
  ) {
    return await prisma.$transaction(async (tx) => {
      const milestone = await tx.milestone.findFirst({
        where: {
          id: milestoneId,
          projectId,
        },
      });

      if (!milestone) {
        throw new AppError("Milestone not found", 404);
      }

      const updatedMilestone = await tx.milestone.update({
        where: { id: milestoneId },
        data: {
          ...data,
          updatedAt: new Date(),
        },
      });

      // Update project progress
      const allMilestones = await tx.milestone.findMany({
        where: { projectId },
      });

      const completedCount = allMilestones.filter(
        (m) => m.status === "COMPLETED"
      ).length;
      const progress = (completedCount / allMilestones.length) * 100;

      await tx.project.update({
        where: { id: projectId },
        data: { progress },
      });

      return updatedMilestone;
    });
  }

  async addProjectMembers(
    projectId: string,
    managerId: string,
    memberIds: string[]
  ) {
    return await prisma.$transaction(async (tx) => {
      const project = await tx.project.findUnique({
        where: { id: projectId },
        include: {
          team: {
            include: { members: true },
          },
        },
      });

      if (!project) {
        throw new AppError("Project not found", 404);
      }

      // Check if manager has permission
      const hasPermission = await this.roleService.checkProjectPermission(
        managerId,
        project.team.id,
        "member:manage"
      );

      if (!hasPermission) {
        throw new AppError("Unauthorized to manage project members", 403);
      }

      const existingMembers = project.team.members.map((m) => m.memberId);
      const newMembers = memberIds.filter(
        (id) => !existingMembers.includes(id)
      );

      // Add members to project team
      await Promise.all(
        newMembers.map((memberId) =>
          tx.teamMember.create({
            data: {
              teamId: project.team.id,
              memberId,
            },
          })
        )
      );

      return project;
    });
  }

  async removeProjectMembers(
    projectId: string,
    managerId: string,
    memberIds: string[]
  ) {
    return await prisma.$transaction(async (tx) => {
      const project = await tx.project.findUnique({
        where: { id: projectId },
        include: {
          team: {
            include: { leads: true },
          },
        },
      });

      if (!project) {
        throw new AppError("Project not found", 404);
      }

      // Check if manager has permission
      const hasPermission = await this.roleService.checkProjectPermission(
        managerId,
        project.team.id,
        "member:manage"
      );

      if (!hasPermission) {
        throw new AppError("Unauthorized to manage project members", 403);
      }

      // Don't allow removing team leads
      const teamLeadIds = project.team.leads.map((l) => l.leadId);
      const attemptingToRemoveLeads = memberIds.some((id) =>
        teamLeadIds.includes(id)
      );

      if (attemptingToRemoveLeads) {
        throw new AppError(
          "Cannot remove team leads. Reassign lead role first.",
          400
        );
      }

      await tx.teamMember.deleteMany({
        where: {
          teamId: project.team.id,
          memberId: { in: memberIds },
        },
      });

      return project;
    });
  }

  async assignProjectLead(
    projectId: string,
    managerId: string,
    newLeadId: string
  ) {
    return await prisma.$transaction(async (tx) => {
      const project = await tx.project.findUnique({
        where: { id: projectId },
        include: {
          team: {
            include: { leads: true },
          },
        },
      });

      if (!project) {
        throw new AppError("Project not found", 404);
      }

      // Check if manager has permission
      const hasPermission = await this.roleService.checkProjectPermission(
        managerId,
        project.team.id,
        "team:manage"
      );

      if (!hasPermission) {
        throw new AppError("Unauthorized to manage project lead", 403);
      }

      // Remove existing project lead permissions
      const currentLead = project.team.leads.find((l) => l.scope === "PROJECT");
      if (currentLead) {
        await this.roleService.revokeDelegatedPermissions(
          managerId,
          currentLead.leadId,
          MANAGER_DELEGATABLE_PERMISSIONS,
          project.team.workspaceId
        );
      }

      // Create new team lead
      await tx.teamLead.create({
        data: {
          teamId: project.team.id,
          leadId: newLeadId,
          title: "Project Lead",
          type: "PRIMARY",
          scope: "PROJECT",
          permissions: {},
        },
      });

      // Delegate project permissions to new lead
      await this.roleService.delegateProjectPermissions(
        managerId,
        project.team.id,
        newLeadId
      );

      return project;
    });
  }
}
