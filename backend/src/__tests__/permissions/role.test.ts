const { RoleService } = require("../../services/role.service");
const { prisma } = require("../../lib/prisma.ts");
const { RoleType } = require("../../types/role");

describe("Role Service", () => {
  let roleService;

  beforeEach(async () => {
    await prisma.clearDatabase();
    roleService = new RoleService();
  });

  it("should check permissions correctly", async () => {
    const workspace = await prisma.workspace.create({
      data: {
        name: "Test",
        subdomain: "test",
      },
    });

    const user = await prisma.user.create({
      data: {
        email: "test@test.com",
        name: "Test User",
      },
    });

    await roleService.assignRole(
      user.id,
      workspace.id,
      RoleType.WORKSPACE_OWNER
    );

    const hasPermission = await roleService.checkUserPermission(
      user.id,
      workspace.id,
      {
        action: "CREATE",
        resource: "TEAM",
        scope: "all",
      }
    );

    expect(hasPermission).toBe(true);
  });
});
