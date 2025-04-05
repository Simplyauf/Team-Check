import { PrismaClient } from "@prisma/client";
import { RoleType, DEFAULT_PERMISSIONS } from "../../types/role";

const prisma = new PrismaClient();

interface Role {
  id: string;
  type: string;
  permissions: any; // Using 'any' for flexibility with both formats
  name: string;
  workspaceId: string;
}

interface Workspace {
  id: string;
  name: string;
  roles: Role[];
}

async function migrateExistingWorkspaces() {
  const roleService = require("../../services/role.service").RoleService;
  const service = new roleService();

  try {
    console.log(
      "Starting migration: Creating default roles for existing workspaces..."
    );

    const workspaces = (await prisma.workspace.findMany({
      include: {
        roles: true,
      },
    })) as Workspace[];

    console.log(`Found ${workspaces.length} workspaces`);

    for (const workspace of workspaces) {
      // Check for missing default roles and fix permission format
      const existingRoles = workspace.roles;

      // Fix any existing roles with old permission format
      for (const role of existingRoles) {
        if (
          typeof role.permissions === "object" &&
          !Array.isArray(role.permissions)
        ) {
          // Convert old format to new format
          const newPermissions =
            role.type === RoleType.WORKSPACE_OWNER
              ? ["*"]
              : Object.entries(
                  role.permissions as Record<string, string[]>
                ).flatMap(([resource, actions]) =>
                  actions.map((action) => `${resource}:${action}`)
                );

          await prisma.role.update({
            where: { id: role.id },
            data: { permissions: newPermissions },
          });
        }
      }

      // Check for missing roles
      const existingRoleTypes = existingRoles.map((role) => role.type);
      const missingRoles = [
        RoleType.WORKSPACE_ADMIN,
        RoleType.MANAGER,
        RoleType.TEAM_LEAD,
        RoleType.MEMBER,
      ].filter((roleType) => !existingRoleTypes.includes(roleType));

      if (missingRoles.length > 0) {
        console.log(
          `Creating missing roles for workspace: ${workspace.name} (${workspace.id})`
        );
        console.log(`Missing roles: ${missingRoles.join(", ")}`);
        await service.createDefaultWorkspaceRoles(workspace.id);
      } else {
        console.log(
          `Workspace ${workspace.name} has all default roles. Skipping...`
        );
      }
    }

    console.log("Migration completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Execute the migration if this file is run directly
if (require.main === module) {
  migrateExistingWorkspaces()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export { migrateExistingWorkspaces };
