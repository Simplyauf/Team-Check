import { useState, useEffect } from "react";
import {
  Plus,
  MoreVertical,
  Mail,
  X,
  UserCog,
  Send,
  Eye,
  Ban,
  UserX,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useWorkspace } from "@/hooks/useWorkspace";
import api from "@/lib/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Member {
  id: string;
  user: {
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
  inviteStatus?: {
    id: string;
    status: string;
    expiresAt: string;
    canResend: boolean;
    canCancel: boolean;
  } | null;
  permissions: {
    canManageMembers: boolean;
    canManageRoles: boolean;
    canManageTeams: boolean;
  };
  metadata: {
    isOwner: boolean;
    isAdmin: boolean;
    rolePrecedence: number;
  };
}

interface Role {
  id: string;
  name: string;
  type: string;
  permissions: string[];
  precedence: number;
}

interface Invite {
  id: string;
  email: string;
  position?: string;
  status: string;
  role: {
    name: string;
  };
}

export default function Members() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentWorkspace } = useWorkspace();
  const [members, setMembers] = useState<Member[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [inviteData, setInviteData] = useState({
    email: "",
    position: "",
    roleId: "",
  });
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);

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

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/members`, {
        headers: { "X-Workspace-Id": currentWorkspace?.data?.workspace?.id },
      });
      setMembers(response.data.data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to fetch members",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async () => {
    // Validate form
    if (!inviteData.email || !inviteData.roleId) {
      toast({
        title: "Error",
        description: "Email and role are required",
        variant: "destructive",
      });
      return;
    }

    try {
      setInviteLoading(true);
      await api.post(
        `/workspaces/${currentWorkspace?.data?.workspace?.id}/invites`,
        inviteData,
        {
          headers: { "X-Workspace-Id": currentWorkspace?.data?.workspace?.id },
        }
      );

      toast({
        title: "Success",
        description: "Invitation sent successfully",
      });

      // Reset form and close modal
      setInviteData({
        email: "",
        position: "",
        roleId: "",
      });
      setInviteModalOpen(false);

      // Refresh members list to show pending member
      fetchMembers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to send invite",
        variant: "destructive",
      });
    } finally {
      setInviteLoading(false);
    }
  };

  const handleResendInvite = async (member: Member) => {
    if (!member.inviteStatus?.id) {
      toast({
        title: "Error",
        description: "No invite found for this member",
        variant: "destructive",
      });
      return;
    }

    try {
      await api.post(
        `/workspaces/${currentWorkspace?.data?.workspace?.id}/invites/${member.inviteStatus.id}/resend`,
        {},
        {
          headers: { "X-Workspace-Id": currentWorkspace?.data?.workspace?.id },
        }
      );
      toast({
        title: "Success",
        description: "Invitation resent successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to resend invite",
        variant: "destructive",
      });
    }
  };

  const handleCancelInvite = async (memberId: string) => {
    try {
      await api.delete(`/members/${memberId}`, {
        headers: { "X-Workspace-Id": currentWorkspace?.data?.workspace?.id },
      });
      toast({
        title: "Success",
        description: "Invitation cancelled successfully",
      });
      fetchMembers(); // Refresh members list
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to cancel invite",
        variant: "destructive",
      });
    }
  };

  const handleStatusChange = async (memberId: string, status: string) => {
    try {
      await api.patch(
        `/members/${memberId}/status`,
        { status },
        {
          headers: { "X-Workspace-Id": currentWorkspace?.data?.workspace?.id },
        }
      );
      toast({
        title: "Success",
        description: "Member status updated successfully",
      });
      fetchMembers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update status",
        variant: "destructive",
      });
    }
  };

  const handleEditMember = (member: Member) => {
    navigate(`/members/${member.id}`);
  };

  const handleRemoveMember = async (memberId: string) => {
    try {
      await api.delete(`/members/${memberId}`, {
        headers: { "X-Workspace-Id": currentWorkspace?.data?.workspace?.id },
      });
      toast({
        title: "Success",
        description: "Member removed successfully",
      });
      fetchMembers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to remove member",
        variant: "destructive",
      });
    }
  };

  console.log(currentWorkspace, "workspace");

  useEffect(() => {
    if (currentWorkspace?.data?.workspace?.id) {
      fetchMembers();
      fetchRoles();
    }
  }, [currentWorkspace]);

  const renderActions = (member: Member) => {
    const isPending = member.inviteStatus?.status === "PENDING";
    const isActive = member.status === "ACTIVE";

    return (
      <div className="flex gap-2 items-center">
        <TooltipProvider>
          {/* View Details */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(`/members/${member.id}`)}
              >
                <Eye className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>View Details</p>
            </TooltipContent>
          </Tooltip>

          {/* Manage Status - only for active members */}
          {isActive && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleStatusChange(member.id, "SUSPENDED")}
                >
                  <Ban className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Suspend Member</p>
              </TooltipContent>
            </Tooltip>
          )}

          {/* Edit Member */}
          {!isPending && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEditMember(member)}
                >
                  <UserCog className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit Member</p>
              </TooltipContent>
            </Tooltip>
          )}

          {/* Resend Invite */}
          {isPending && member.inviteStatus?.canResend && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleResendInvite(member)}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Resend Invite</p>
              </TooltipContent>
            </Tooltip>
          )}

          {/* Cancel Invite */}
          {isPending && member.inviteStatus?.canCancel && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleCancelInvite(member.id)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Cancel Invite</p>
              </TooltipContent>
            </Tooltip>
          )}

          {/* Remove Member */}
          {!isPending && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveMember(member.id)}
                >
                  <UserX className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Remove Member</p>
              </TooltipContent>
            </Tooltip>
          )}
        </TooltipProvider>
      </div>
    );
  };

  return (
    <div className="p-4">
      <Dialog open={inviteModalOpen} onOpenChange={setInviteModalOpen}>
        <DialogTrigger asChild>
          <Button className="mb-4">
            <Plus className="mr-2 w-4 h-4" />
            Invite Member
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite a New Member</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Enter email"
              type="email"
              value={inviteData.email}
              onChange={(e) =>
                setInviteData({ ...inviteData, email: e.target.value })
              }
              disabled={inviteLoading}
            />
            <Input
              placeholder="Enter position"
              value={inviteData.position}
              onChange={(e) =>
                setInviteData({ ...inviteData, position: e.target.value })
              }
              disabled={inviteLoading}
            />
            <Select
              value={inviteData.roleId}
              onValueChange={(value) =>
                setInviteData({ ...inviteData, roleId: value })
              }
              disabled={inviteLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {roles
                  .filter((role) => role.type !== "WORKSPACE_OWNER")
                  .map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <Button onClick={handleInvite} disabled={inviteLoading}>
              {inviteLoading ? "Sending..." : "Send Invitation"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Members Table */}
      <Table className="mt-4">
        <TableHeader>
          <TableRow>
            <TableHead>Name/Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member.id}>
              <TableCell>
                {member.status === "PENDING"
                  ? member.user.email
                  : member.user.name}
              </TableCell>
              <TableCell>{member.role.name}</TableCell>
              <TableCell>{member.position || "-"}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    member.status === "ACTIVE"
                      ? "default"
                      : member.status === "PENDING"
                        ? "secondary"
                        : "destructive"
                  }
                >
                  {member.status}
                </Badge>
              </TableCell>
              <TableCell>{renderActions(member)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
