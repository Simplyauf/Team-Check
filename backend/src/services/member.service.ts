import { RoleType, DEFAULT_PERMISSIONS } from "../types/role";
const { PrismaClient, MemberStatus, InviteStatus } = require("@prisma/client");
const { generateToken } = require("../utils/token");
const { sendInviteEmail } = require("../utils/email");
const { AppError } = require("../utils/AppError");

interface InviteMemberData {
  email: string;
  roleId: string;
  position?: string;
}

interface Role {
  id: string;
  name: string;
  type: string;
  permissions: string[];
  precedence: number;
}

interface WorkspaceInvite {
  id: string;
  email: string;
  status: (typeof InviteStatus)[keyof typeof InviteStatus];
  expiresAt: Date;
  position?: string;
  roleId: string;
  role?: Role;
}

interface InviteWithRole extends WorkspaceInvite {
  role?: Role;
}

interface Member {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatar: string | null;
  };
  role: Role;
  position: string | null;
  status: (typeof MemberStatus)[keyof typeof MemberStatus];
  joinedAt: Date | null;
  teams: Array<{
    team: {
      id: string;
      name: string;
    };
  }>;
}

interface WorkspaceMember {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatar: string | null;
  };
  role: {
    id: string;
    name: string;
    type: string;
    permissions: string[];
    precedence: number;
  };
  position: string | null;
  status: (typeof MemberStatus)[keyof typeof MemberStatus];
  joinedAt: Date | null;
  teams: Array<{
    team: {
      id: string;
      name: string;
    };
  }>;
}

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

// Add this debug log
console.log("Prisma Models:", Object.keys(prisma));
console.log("WorkspaceMember fields:", Object.keys(prisma.workspaceMember));

class MemberService {
  async getWorkspaceMembers(workspaceId: string) {
    // Get all workspace members
    const members = (await prisma.workspaceMember.findMany({
      where: { workspaceId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        role: true,
        teams: {
          include: {
            team: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: [
        {
          createdAt: "desc",
        },
      ],
    })) as Member[];

    // Get all pending invites for the workspace
    const invites = (await prisma.workspaceInvite.findMany({
      where: {
        workspaceId,
        status: InviteStatus.PENDING,
      },
      select: {
        id: true,
        email: true,
        status: true,
        expiresAt: true,
        position: true,
        roleId: true,
      },
    })) as WorkspaceInvite[];

    // Get roles for invites in a separate query
    const roleIds = [...new Set(invites.map((invite) => invite.roleId))];
    const roles = await prisma.role.findMany({
      where: {
        id: {
          in: roleIds,
        },
      },
    });

    const rolesMap = new Map<string, Role>(
      roles.map((role) => [role.id, role])
    );

    // Sort members by role precedence after fetching
    members.sort(
      (a, b) => (b.role?.precedence || 0) - (a.role?.precedence || 0)
    );

    // Create a map of email to invite for faster lookup
    const invitesByEmail = new Map<string, InviteWithRole>(
      invites.map((invite) => [
        invite.email,
        { ...invite, role: rolesMap.get(invite.roleId) },
      ])
    );

    // Transform and combine the data
    const membersWithInvites = members.map((member) => {
      const invite = invitesByEmail.get(member.user.email);
      const hasFullAccess = member.role.permissions.includes("*");

      return {
        id: member.id,
        user: member.user,
        role: member.role,
        position: member.position,
        status: member.status,
        joinedAt: member.joinedAt,
        teams: member.teams,
        // Include invite information if exists
        inviteStatus: invite
          ? {
              id: invite.id,
              status: invite.status,
              expiresAt: invite.expiresAt,
              canResend: invite.status === InviteStatus.PENDING,
              canCancel: invite.status === InviteStatus.PENDING,
            }
          : null,
        // Add permissions summary for frontend use
        permissions: {
          canManageMembers:
            hasFullAccess || member.role.permissions.includes("manage_members"),
          canManageRoles:
            hasFullAccess || member.role.permissions.includes("manage_roles"),
          canManageTeams:
            hasFullAccess || member.role.permissions.includes("manage_teams"),
        },
        metadata: {
          isOwner: member.role.type === "WORKSPACE_OWNER",
          isAdmin: member.role.type === "WORKSPACE_ADMIN",
          rolePrecedence: member.role.precedence,
        },
      };
    });

    // Also include pending invites that don't have members yet
    const pendingInvitesWithoutMembers = invites
      .filter(
        (invite) =>
          !members.some((member) => member.user.email === invite.email)
      )
      .map((invite) => ({
        id: `invite-${invite.id}`,
        user: {
          email: invite.email,
          name: invite.email.split("@")[0],
          avatar: null,
        },
        role: rolesMap.get(invite.roleId),
        position: invite.position,
        status: "PENDING" as const,
        joinedAt: null,
        teams: [],
        inviteStatus: {
          id: invite.id,
          status: invite.status,
          expiresAt: invite.expiresAt,
          canResend: true,
          canCancel: true,
        },
        permissions: {
          canManageMembers: false,
          canManageRoles: false,
          canManageTeams: false,
        },
        metadata: {
          isOwner: false,
          isAdmin: false,
          rolePrecedence: rolesMap.get(invite.roleId)?.precedence || 0,
        },
      }));

    return [...membersWithInvites, ...pendingInvitesWithoutMembers];
  }

  async inviteMember(
    workspaceId: string,
    invitedById: string,
    data: InviteMemberData
  ) {
    const { email, roleId, position } = data;

    // Check if user is already a member
    const existingMember = await prisma.workspaceMember.findFirst({
      where: {
        workspace: { id: workspaceId },
        user: { email },
      },
    });

    if (existingMember) {
      throw new AppError("User is already a member of this workspace", 400);
    }

    // Check for existing invite
    const existingInvite = await prisma.workspaceInvite.findFirst({
      where: {
        workspaceId,
        email,
        status: "PENDING",
      },
    });

    if (existingInvite) {
      throw new AppError("User has already been invited", 400);
    }

    // Generate invite token
    const token = generateToken();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // Expires in 7 days

    // Create invite
    const invite = await prisma.workspaceInvite.create({
      data: {
        email,
        workspaceId,
        roleId,
        position,
        token,
        invitedById,
        expiresAt,
        status: "PENDING",
      },
      include: {
        workspace: true,
        invitedBy: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return invite;
  }

  async resendInvite(workspaceId: string, inviteId: string) {
    const invite = await prisma.workspaceInvite.findFirst({
      where: {
        id: inviteId,
        workspaceId,
        status: InviteStatus.PENDING,
      },
      include: {
        workspace: true,
        invitedBy: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!invite) {
      throw new AppError("Invalid or expired invite", 404);
    }

    // Update expiry
    await prisma.workspaceInvite.update({
      where: { id: inviteId },
      data: {
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    // Resend email
    await sendInviteEmail({
      to: invite.email,
      inviteToken: invite.token,
      workspaceName: invite.workspace.name,
      invitedBy: invite.invitedBy.name,
    });

    return invite;
  }

  async cancelInvite(workspaceId: string, inviteId: string) {
    const invite = await prisma.workspaceInvite.findFirst({
      where: {
        id: inviteId,
        workspaceId,
      },
    });

    if (!invite) {
      throw new AppError("Invite not found", 404);
    }

    // Update invite status
    await prisma.workspaceInvite.update({
      where: { id: inviteId },
      data: { status: InviteStatus.CANCELLED },
    });

    // Update member status
    await prisma.workspaceMember.updateMany({
      where: {
        workspaceId,
        userId: invite.userId,
        status: MemberStatus.PENDING,
      },
      data: {
        status: MemberStatus.INACTIVE,
      },
    });

    return { message: "Invite cancelled successfully" };
  }

  async updateMemberStatus(
    workspaceId: string,
    memberId: string,
    status: (typeof MemberStatus)[keyof typeof MemberStatus]
  ) {
    const member = await prisma.workspaceMember.findFirst({
      where: {
        id: memberId,
        workspaceId,
      },
    });

    if (!member) {
      throw new AppError("Member not found", 404);
    }

    const updatedMember = await prisma.workspaceMember.update({
      where: { id: memberId },
      data: {
        status,
        ...(status === MemberStatus.ACTIVE && !member.joinedAt
          ? { joinedAt: new Date() }
          : {}),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        role: true,
      },
    });

    return updatedMember;
  }

  async removeMember(workspaceId: string, memberId: string) {
    const member = await prisma.workspaceMember.findFirst({
      where: {
        id: memberId,
        workspaceId,
      },
    });

    if (!member) {
      throw new AppError("Member not found", 404);
    }

    // Remove from teams first
    await prisma.teamMember.deleteMany({
      where: {
        memberId: member.id,
      },
    });

    // Delete member
    await prisma.workspaceMember.delete({
      where: { id: memberId },
    });

    return { message: "Member removed successfully" };
  }
}

// Create and export a single instance
const memberService = new MemberService();
module.exports = memberService;
