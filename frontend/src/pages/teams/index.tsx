import { useState } from "react";
import {
  Plus,
  MoreVertical,
  UserPlus2,
  Layers,
  Settings,
  Eye,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface Team {
  id: number;
  name: string;
  description: string;
  hierarchy: string;
  memberCount: number;
  leadName: string;
  status: string;
}

const mockTeams: Team[] = [
  {
    id: 1,
    name: "Engineering",
    description: "Handles all engineering tasks.",
    hierarchy: "Product > Engineering",
    memberCount: 10,
    leadName: "John Doe",
    status: "Active",
  },
  {
    id: 2,
    name: "Design",
    description: "Responsible for UI/UX design.",
    hierarchy: "Product > Design",
    memberCount: 5,
    leadName: "Jane Smith",
    status: "Active",
  },
  // ... more mock teams
];

export default function TeamsPage() {
  const [showMembersDialog, setShowMembersDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [showBulkDialog, setShowBulkDialog] = useState(false);
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  const navigate = useNavigate();

  // Dialog Components

  const TeamMembersDialog = () => (
    <Dialog open={showMembersDialog} onOpenChange={setShowMembersDialog}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Team Members - {selectedTeam?.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex gap-2 items-center">
            <Input placeholder="Search members..." className="flex-1" />
            <Button>
              <UserPlus2 className="mr-2 w-4 h-4" />
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
              {/* Replace with dynamic data */}
              {/* Example Row */}
              <TableRow>
                <TableCell>John Doe</TableCell>
                <TableCell>john@example.com</TableCell>
                <TableCell>Developer</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
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
          {/* Team Visibility */}
          <div className="grid gap-2">
            <Label>Team Visibility</Label>
            <div className="flex justify-between items-center">
              <span className="text-sm">Public to workspace</span>
              <Switch />
            </div>
          </div>
          {/* Parent Team */}
          <div className="grid gap-2">
            <Label>Parent Team</Label>
            <select className="p-2 rounded-md border">
              <option value="">No parent team</option>
              {/* Replace with dynamic team options */}
              <option value="1">Product</option>
              <option value="2">Sales</option>
            </select>
          </div>
          {/* Team Permissions */}
          <div className="grid gap-2">
            <Label>Team Permissions</Label>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Can invite members</span>
                <Switch />
              </div>
              <div className="flex justify-between items-center">
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
          {/* Select Teams */}
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label>Select Teams</Label>
              <ScrollArea className="h-[200px] border rounded-md p-2">
                {mockTeams.map((team) => (
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
            {/* Operation Selection */}
            <div className="space-y-2">
              <Label>Operation</Label>
              <select className="p-2 w-full rounded-md border">
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
          {/* List of Roles */}
          <div className="space-y-2">
            {[
              { id: 1, name: "Developer", permissions: ["Read", "Write"] },
              { id: 2, name: "Designer", permissions: ["Read"] },
              // ... more roles
            ].map((role) => (
              <Card key={role.id}>
                <CardHeader className="flex justify-between items-center">
                  <CardTitle className="text-base">{role.name}</CardTitle>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    Permissions: {role.permissions.join(", ")}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {/* Create New Role */}
          <Button className="w-full">
            <Plus className="mr-2 w-4 h-4" />
            Create New Role
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  const CreateTeamDialog = () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 w-4 h-4" />
          Create Team
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Team</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Team Name */}
          <div className="grid gap-2">
            <Label htmlFor="name">Team Name</Label>
            <Input id="name" placeholder="e.g. Engineering" />
          </div>
          {/* Description */}
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" placeholder="What does this team do?" />
          </div>
          {/* Team Hierarchy */}
          <div className="grid gap-2">
            <Label htmlFor="hierarchy">Team Hierarchy</Label>
            <Input id="hierarchy" placeholder="e.g. Product > Engineering" />
            <p className="text-sm text-muted-foreground">
              Define where this team sits in the organization
            </p>
          </div>
          {/* Team Lead */}
          <div className="grid gap-2">
            <Label htmlFor="lead">Team Lead</Label>
            <select className="p-2 rounded-md border">
              <option value="">Select a team lead...</option>
              {/* Replace with dynamic team lead options */}
              <option value="1">John Doe</option>
              <option value="2">Jane Smith</option>
            </select>
          </div>
        </div>
        <Button className="w-full">Create Team</Button>
      </DialogContent>
    </Dialog>
  );

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
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
            <CreateTeamDialog />
          </div>
        </div>

        {/* Teams Grid */}
        <div className="grid gap-4">
          {mockTeams.map((team) => (
            <Card key={team.id}>
              <CardHeader className="flex flex-row justify-between items-center space-y-0">
                <div>
                  <CardTitle className="flex gap-2 items-center text-xl">
                    {team.name}
                    <Badge variant="outline" className="ml-2">
                      {team.hierarchy}
                    </Badge>
                  </CardTitle>
                  <CardDescription>{team.description}</CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="p-0 w-8 h-8">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => navigate(`/teams/${team.id}`)}
                    >
                      <Eye className="mr-2 w-4 h-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedTeam(team);
                        setShowMembersDialog(true);
                      }}
                    >
                      <UserPlus2 className="mr-2 w-4 h-4" />
                      Manage Members
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedTeam(team);
                        setShowRoleDialog(true);
                      }}
                    >
                      <Layers className="mr-2 w-4 h-4" />
                      Manage Roles
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedTeam(team);
                        setShowSettingsDialog(true);
                      }}
                    >
                      <Settings className="mr-2 w-4 h-4" />
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

          {/* Dialogs for Actions */}
          <TeamMembersDialog />
          <TeamSettingsDialog />
          <BulkOperationsDialog />
          <RoleManagementDialog />
        </div>
      </div>
    </>
  );
}
