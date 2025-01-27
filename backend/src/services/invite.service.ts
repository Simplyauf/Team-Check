const crypto = require("crypto");
const { prisma } = require("../lib/prisma.ts");
const { AppError } = require("../utils/AppError.ts");

class InviteService {
  async sendInviteEmail(invite) {
    // Implement email sending logic
  }

  async createInvite(params) {
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const invite = await prisma.workspaceInvite.create({
      data: {
        ...params,
        token,
        expiresAt,
      },
    });

    await this.sendInviteEmail(invite);
    return invite;
  }

  async acceptInvite(token, userId) {
    const invite = await prisma.workspaceInvite.findUnique({
      where: { token },
    });

    if (!invite || invite.expiresAt < new Date()) {
      throw new AppError("Invalid or expired invite", 400);
    }

    await prisma.workspaceMember.create({
      data: {
        workspaceId: invite.workspaceId,
        userId,
        roleId: invite.role.id,
      },
    });

    await prisma.workspaceInvite.delete({
      where: { id: invite.id },
    });
  }
}

module.exports = { InviteService };
