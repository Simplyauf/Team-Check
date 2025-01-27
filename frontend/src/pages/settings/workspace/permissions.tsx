import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Shield, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function PermissionsSettings() {
  // Using your existing role permissions from backend/src/types/permissions.ts
  const rolePermissions = {
    WORKSPACE_OWNER: ["*"],
    WORKSPACE_ADMIN: ["workspace:*", "team:*", "user:*", "role:*"],
    MANAGER: ["team:*", "member:*", "role:delegate", "report:*"],
    TEAM_LEAD: ["team:manage", "member:manage", "report:view"],
    MEMBER: ["team:view", "profile:manage"],
  };

  const permissionDescriptions = {
    "workspace:*": "Full workspace management",
    "team:*": "Full team management",
    "team:manage": "Basic team management",
    "team:view": "View team information",
    "member:*": "Full member management",
    "member:manage": "Basic member management",
    "role:*": "Full role management",
    "role:delegate": "Delegate permissions",
    "report:*": "Full reporting access",
    "report:view": "View reports",
    "profile:manage": "Manage own profile",
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Permissions</h3>
        <p className="text-sm text-muted-foreground">
          Manage role permissions across your workspace.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Shield className="w-6 h-6" />
            <CardTitle>Role Permissions</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(rolePermissions).map(([role, permissions]) => (
                <TableRow key={role}>
                  <TableCell className="font-medium">{role}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      {permissions.map((permission) => (
                        <div
                          key={permission}
                          className="flex items-center gap-1 px-2 py-1 text-sm rounded-md bg-muted"
                        >
                          {permission}
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="w-4 h-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              {permissionDescriptions[permission] ||
                                "No description available"}
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={role === "WORKSPACE_OWNER"}
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
