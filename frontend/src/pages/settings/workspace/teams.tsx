import { useState } from "react";
import {
  Plus,
  Users,
  MoreVertical,
  UserPlus2,
  Settings,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";

export default function TeamsSettings() {
  const [teams, setTeams] = useState([
    {
      id: 1,
      name: "Engineering",
      description: "Product development team",
      memberCount: 8,
      leadName: "John Doe",
      status: "active",
      hierarchy: "Product > Engineering",
      members: [
        { id: 1, name: "John Doe", email: "john@example.com", role: "Lead" },
        {
          id: 2,
          name: "Jane Smith",
          email: "jane@example.com",
          role: "Member",
        },
      ],
    },
    {
      id: 2,
      name: "Marketing",
      description: "Brand and growth team",
      memberCount: 5,
      leadName: "Jane Smith",
      status: "active",
      hierarchy: "Growth > Marketing",
      members: [
        { id: 3, name: "Jane Smith", email: "jane@example.com", role: "Lead" },
        { id: 4, name: "John Doe", email: "john@example.com", role: "Member" },
      ],
    },
  ]);

  const [selectedTeam, setSelectedTeam] = useState(null);
  const [showMembersDialog, setShowMembersDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [showBulkDialog, setShowBulkDialog] = useState(false);
  const [showRoleDialog, setShowRoleDialog] = useState(false);

  const roles = [
    {
      id: 1,
      name: "Team Lead",
      permissions: ["manage_team", "manage_members"],
    },
    { id: 2, name: "Project Manager", permissions: ["manage_projects"] },
    { id: 3, name: "Member", permissions: ["view", "comment"] },
  ];

  const TeamMembersDialog = () => (
    <Dialog open={showMembersDialog} onOpenChange={setShowMembersDialog}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Team Members - {selectedTeam?.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Input placeholder="Search members..." className="flex-1" />
            <Button>
              <UserPlus2 className="w-4 h-4 mr-2" />
              Add Member
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selectedTeam?.members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>{member.name}</TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>{member.role}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );

  const TeamSettingsDialog = () => (
    <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Team Settings - {selectedTeam?.name}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Team Visibility</Label>
            <div className="flex items-center justify-between">
              <span className="text-sm">Public to workspace</span>
              <Switch />
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Parent Team</Label>
            <select className="p-2 border rounded-md">
              <option value="">No parent team</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-2">
            <Label>Team Permissions</Label>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Can invite members</span>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Can manage projects</span>
                <Switch />
              </div>
            </div>
          </div>
        </div>
        <Button className="w-full">Save Settings</Button>
      </DialogContent>
    </Dialog>
  );

  const BulkOperationsDialog = () => (
    <Dialog open={showBulkDialog} onOpenChange={setShowBulkDialog}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Bulk Team Operations</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label>Select Teams</Label>
              <ScrollArea className="h-[200px] border rounded-md p-2">
                {teams.map((team) => (
                  <div
                    key={team.id}
                    className="flex items-center py-2 space-x-2"
                  >
                    <Checkbox id={`team-${team.id}`} />
                    <Label htmlFor={`team-${team.id}`}>{team.name}</Label>
                  </div>
                ))}
              </ScrollArea>
            </div>
            <div className="space-y-2">
              <Label>Operation</Label>
              <select className="w-full p-2 border rounded-md">
                <option value="archive">Archive Teams</option>
                <option value="move">Move Teams</option>
                <option value="change_visibility">Change Visibility</option>
              </select>
            </div>
          </div>
          <Button className="w-full">Apply to Selected Teams</Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  const RoleManagementDialog = () => (
    <Dialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Manage Team Roles - {selectedTeam?.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            {roles.map((role) => (
              <Card key={role.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{role.name}</CardTitle>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    Permissions: {role.permissions.join(", ")}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <Button className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Create New Role
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Teams</h3>
            <p className="text-sm text-muted-foreground">
              Create and manage teams in your workspace
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowBulkDialog(true)}>
              Bulk Operations
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Team
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create New Team</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Team Name</Label>
                    <Input id="name" placeholder="e.g. Engineering" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="What does this team do?"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="hierarchy">Team Hierarchy</Label>
                    <Input
                      id="hierarchy"
                      placeholder="e.g. Product > Engineering"
                    />
                    <p className="text-sm text-muted-foreground">
                      Define where this team sits in the organization
                    </p>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="lead">Team Lead</Label>
                    <select className="p-2 border rounded-md">
                      <option value="">Select a team lead...</option>
                      <option value="1">John Doe</option>
                      <option value="2">Jane Smith</option>
                    </select>
                  </div>
                </div>
                <Button className="w-full">Create Team</Button>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid gap-4">
          {teams.map((team) => (
            <Card key={team.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    {team.name}
                    <Badge variant="outline" className="ml-2">
                      {team.hierarchy}
                    </Badge>
                  </CardTitle>
                  <CardDescription>{team.description}</CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="w-8 h-8 p-0">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedTeam(team);
                        setShowMembersDialog(true);
                      }}
                    >
                      <UserPlus2 className="w-4 h-4 mr-2" />
                      Manage Members
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedTeam(team);
                        setShowRoleDialog(true);
                      }}
                    >
                      <Layers className="w-4 h-4 mr-2" />
                      Manage Roles
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedTeam(team);
                        setShowSettingsDialog(true);
                      }}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Team Settings
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {team.memberCount} members
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Lead: {team.leadName}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <TeamMembersDialog />
      <TeamSettingsDialog />
      <BulkOperationsDialog />
      <RoleManagementDialog />
    </>
  );
}
