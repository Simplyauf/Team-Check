import { useState, useEffect } from "react";
import { Plus, MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

interface Member {
  id: number;
  name: string;
  email: string;
  role: string;
  position: string;
  status: string;
}

export default function Members() {
  const navigate = useNavigate();
  const [inviteEmail, setInviteEmail] = useState("");
  const [position, setPosition] = useState("");
  const [members, setMembers] = useState<Member[]>([
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "Manager",
      position: "Engineering Lead",
      status: "Active",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      role: "Employee",
      position: "Frontend Developer",
      status: "Pending",
    },
    // ... other members
  ]);

  // Fetch members from backend (Placeholder)
  useEffect(() => {
    // Replace with actual API call
    // Example:
    // fetch('/api/members')
    //   .then(response => response.json())
    //   .then(data => setMembers(data));
  }, []);

  const handleInvite = () => {
    // Implement invite logic here
    // For example, send a POST request to the backend
    console.log("Invite sent to", { inviteEmail, position });
    // Optionally, refresh the members list
  };

  return (
    <div className="p-4">
      {/* Invite Member Dialog */}
      <Dialog>
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
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
            />
            <Input
              placeholder="Enter position"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
            />
            <Button onClick={handleInvite}>Send Invitation</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Members Table */}
      <Table className="mt-4">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member.id}>
              <TableCell>{member.name}</TableCell>
              <TableCell>{member.email}</TableCell>
              <TableCell>{member.role}</TableCell>
              <TableCell>{member.position}</TableCell>
              <TableCell>
                <Badge
                  variant={member.status === "Active" ? "default" : "secondary"}
                >
                  {member.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(`/members/${member.id}`)}
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
