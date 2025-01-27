const DEFAULT_ROLES = {
  WORKSPACE_OWNER: {
    name: "workspace_owner",
    displayName: "Workspace Owner",
    permissions: ["*"], // All permissions
    immutable: true,
  },
  WORKSPACE_ADMIN: {
    name: "workspace_admin",
    displayName: "Workspace Admin",
    permissions: [
      "workspace.manage",
      "team.manage",
      "member.manage",
      "role.manage",
    ],
    immutable: true,
  },
  MANAGER: {
    name: "manager",
    displayName: "Manager",
    permissions: [
      "team.manage",
      "attendance.manage",
      "leave.manage",
      "performance.manage",
    ],
    customizable: true, // Can be modified but not deleted
  },
  EMPLOYEE: {
    name: "employee",
    displayName: "Employee",
    permissions: ["attendance.create", "leave.create", "profile.manage"],
    customizable: true,
  },
};
