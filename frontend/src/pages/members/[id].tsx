import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useWorkspace } from "@/hooks/useWorkspace";
import api from "@/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, UserCircle, ArrowLeft } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Member {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  role: {
    id: string;
    name: string;
    type: string;
    permissions: string[];
    precedence: number;
  };
  position?: string;
  status: "PENDING" | "ACTIVE" | "INACTIVE" | "SUSPENDED";
  teams: {
    team: {
      id: string;
      name: string;
    };
  }[];
}

interface Role {
  id: string;
  name: string;
  type: string;
  permissions: string[];
  precedence: number;
}

export default function MemberDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentWorkspace } = useWorkspace();
  const [member, setMember] = useState<Member | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editData, setEditData] = useState({
    position: "",
    roleId: "",
  });

  useEffect(() => {
    if (currentWorkspace?.data?.workspace?.id) {
      fetchMemberDetails();
      fetchRoles();
    }
  }, [currentWorkspace, id]);

  const fetchMemberDetails = async () => {
    try {
      const response = await api.get(`/members/${id}`, {
        headers: { "X-Workspace-Id": currentWorkspace?.data?.workspace?.id },
      });
      setMember(response.data.data);
      setEditData({
        position: response.data.data.position || "",
        roleId: response.data.data.role.id,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to fetch member details",
        variant: "destructive",
      });
      navigate("/members");
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await api.get(
        `/workspaces/${currentWorkspace?.data?.workspace?.id}/roles`,
        {
          headers: { "X-Workspace-Id": currentWorkspace?.data?.workspace?.id },
        }
      );
      setRoles(response.data.data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to fetch roles",
        variant: "destructive",
      });
    }
  };

  const handleUpdateMember = async () => {
    try {
      setUpdateLoading(true);
      await api.patch(`/members/${id}`, editData, {
        headers: { "X-Workspace-Id": currentWorkspace?.data?.workspace?.id },
      });

      toast({
        title: "Success",
        description: "Member updated successfully",
      });

      fetchMemberDetails();
      setEditDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update member",
        variant: "destructive",
      });
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      setUpdateLoading(true);
      await api.patch(
        `/members/${id}/status`,
        { status: newStatus },
        {
          headers: { "X-Workspace-Id": currentWorkspace?.data?.workspace?.id },
        }
      );

      toast({
        title: "Success",
        description: "Member status updated successfully",
      });

      fetchMemberDetails();
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to update member status",
        variant: "destructive",
      });
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!member) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Member not found</p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-500";
      case "PENDING":
        return "bg-yellow-500";
      case "INACTIVE":
        return "bg-gray-500";
      case "SUSPENDED":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate("/members")}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Back to Members</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <h1 className="text-2xl font-bold">Member Details</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center">
              {member.user.avatar ? (
                <img
                  src={member.user.avatar}
                  alt={member.user.name}
                  className="w-24 h-24 rounded-full"
                />
              ) : (
                <UserCircle className="w-24 h-24" />
              )}
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold">{member.user.name}</h3>
              <p className="text-sm text-gray-500">{member.user.email}</p>
              <div className="mt-2 flex justify-center">
                <Badge
                  className={`${getStatusColor(member.status)} text-white`}
                >
                  {member.status}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Role & Position Card */}
        <Card>
          <CardHeader>
            <CardTitle>Role & Position</CardTitle>
            <CardDescription>
              Member's role and position in the workspace
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Current Role</Label>
              <p className="text-lg font-medium">{member.role.name}</p>
              <p className="text-sm text-gray-500">
                Type: {member.role.type.replace(/_/g, " ")}
              </p>
            </div>
            <div>
              <Label>Position</Label>
              <p className="text-lg font-medium">
                {member.position || "Not set"}
              </p>
            </div>
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full">Edit Details</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Member Details</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Position</Label>
                    <Input
                      value={editData.position}
                      onChange={(e) =>
                        setEditData((prev) => ({
                          ...prev,
                          position: e.target.value,
                        }))
                      }
                      placeholder="Enter position"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Role</Label>
                    <Select
                      value={editData.roleId}
                      onValueChange={(value) =>
                        setEditData((prev) => ({ ...prev, roleId: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role.id} value={role.id}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    className="w-full"
                    onClick={handleUpdateMember}
                    disabled={updateLoading}
                  >
                    {updateLoading ? "Updating..." : "Save Changes"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        {/* Status Management Card */}
        <Card>
          <CardHeader>
            <CardTitle>Status Management</CardTitle>
            <CardDescription>
              Manage member's status in the workspace
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select
              value={member.status}
              onValueChange={handleStatusChange}
              disabled={updateLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
                <SelectItem value="SUSPENDED">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Teams Card */}
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Teams</CardTitle>
            <CardDescription>Teams that this member is part of</CardDescription>
          </CardHeader>
          <CardContent>
            {member.teams.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {member.teams.map(({ team }) => (
                  <Card key={team.id}>
                    <CardHeader>
                      <CardTitle>{team.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Button
                        variant="outline"
                        onClick={() => navigate(`/teams/${team.id}`)}
                      >
                        View Team
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Not a member of any teams</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
