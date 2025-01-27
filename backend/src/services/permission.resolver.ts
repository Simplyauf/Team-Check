const {
  PermissionAction,
  PermissionResource,
} = require("../types/permissions.ts");

const { Role } = require("../types/role.ts");

interface PermissionRule {
  action: typeof PermissionAction;
  resource: typeof PermissionResource;
  scope: "all" | "team" | "self";
  conditions?: Record<string, any>;
}

export class PermissionResolver {
  resolvePermissions(roles: (typeof Role)[]): PermissionRule[] {
    // Sort roles by precedence (highest first)
    const sortedRoles = roles.sort((a, b) => b.precedence - a.precedence);

    // Merge permissions with conflict resolution
    const finalPermissions = new Map<string, PermissionRule>();

    for (const role of sortedRoles) {
      for (const permission of role.permissions) {
        const key = `${permission.action}.${permission.resource}`;
        // Higher precedence roles override lower ones
        if (!finalPermissions.has(key)) {
          finalPermissions.set(key, permission);
        }
      }
    }

    return Array.from(finalPermissions.values());
  }

  mergePermissions(
    inheritedPermissions: PermissionRule[],
    rolePermissions: PermissionRule[],
    customFields: any[]
  ): PermissionRule[] {
    const mergedPermissions = new Map<string, PermissionRule>();

    // First add inherited permissions
    for (const permission of inheritedPermissions) {
      const key = `${permission.action}.${permission.resource}`;
      mergedPermissions.set(key, permission);
    }

    // Override with role's own permissions
    for (const permission of rolePermissions) {
      const key = `${permission.action}.${permission.resource}`;
      mergedPermissions.set(key, permission);
    }

    // Apply custom field modifications if any
    for (const field of customFields) {
      if (field.field.type === "permission") {
        const key = `${field.value.action}.${field.value.resource}`;
        mergedPermissions.set(key, {
          ...mergedPermissions.get(key),
          ...field.value,
        });
      }
    }

    return Array.from(mergedPermissions.values());
  }
}
