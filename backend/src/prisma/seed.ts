const { PrismaClient } = require("@prisma/client");
const { RoleType } = require("../src/types/role");

const prisma = new PrismaClient();

async function main() {
  const defaultRoles = [
    {
      name: "Workspace Owner",
      type: RoleType.WORKSPACE_OWNER,
      permissions: {
        // Full permissions
      },
      precedence: 100,
    },
    {
      name: "Workspace Admin",
      type: RoleType.WORKSPACE_ADMIN,
      permissions: {
        // Admin permissions
      },
      precedence: 80,
    },
  ];

  console.log("Seeding database...");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
