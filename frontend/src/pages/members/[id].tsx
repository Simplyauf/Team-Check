import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Member {
  id: number;
  name: string;
  email: string;
  role: string;
  position: string;
  status: string;
}

export default function MemberDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [member, setMember] = useState<Member | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editedMember, setEditedMember] = useState<Member | null>(null);

  // Fetch member details from backend (Placeholder)
  useEffect(() => {
    // Replace with actual API call
    const fetchMember = async () => {
      // Example data
      const data: Member = {
        id: parseInt(id || "0"),
        name: "John Doe",
        email: "john@example.com",
        role: "Manager",
        position: "Engineering Lead",
        status: "Active",
      };
      setMember(data);
      setEditedMember(data);
    };

    if (id) {
      fetchMember();
    }
  }, [id]);

  const handleSave = () => {
    // Implement save logic here
    console.log("Saved member:", editedMember);
    setMember(editedMember);
    setEditMode(false);
    // Optionally, update backend
  };

  if (!member) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="p-4">
      {/* Back Button */}
      <Button variant="outline" onClick={() => navigate(-1)}>
        Back to Members
      </Button>

      {/* Member Information */}
      <div className="p-6 mt-4 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold">{member.name}</h2>
        <p className="text-md text-muted-foreground">{member.position}</p>
        <p className="mt-2">Email: {member.email}</p>
        <p>Role: {member.role}</p>
        <p>
          Status:{" "}
          <Badge variant={member.status === "Active" ? "default" : "secondary"}>
            {member.status}
          </Badge>
        </p>

        {/* Edit Button */}
        <Button className="mt-4" onClick={() => setEditMode(true)}>
          Edit Member
        </Button>
      </div>

      {/* Edit Member Dialog */}
      {editedMember && (
        <Dialog open={editMode} onOpenChange={setEditMode}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Member</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <label className="block">
                <span className="text-sm">Name</span>
                <input
                  type="text"
                  value={editedMember.name}
                  onChange={(e) =>
                    setEditedMember({ ...editedMember, name: e.target.value })
                  }
                  className="block mt-1 w-full rounded-md border-gray-300 shadow-sm"
                />
              </label>
              <label className="block">
                <span className="text-sm">Email</span>
                <input
                  type="email"
                  value={editedMember.email}
                  onChange={(e) =>
                    setEditedMember({ ...editedMember, email: e.target.value })
                  }
                  className="block mt-1 w-full rounded-md border-gray-300 shadow-sm"
                />
              </label>
              <label className="block">
                <span className="text-sm">Role</span>
                <input
                  type="text"
                  value={editedMember.role}
                  onChange={(e) =>
                    setEditedMember({ ...editedMember, role: e.target.value })
                  }
                  className="block mt-1 w-full rounded-md border-gray-300 shadow-sm"
                />
              </label>
              <label className="block">
                <span className="text-sm">Position</span>
                <input
                  type="text"
                  value={editedMember.position}
                  onChange={(e) =>
                    setEditedMember({
                      ...editedMember,
                      position: e.target.value,
                    })
                  }
                  className="block mt-1 w-full rounded-md border-gray-300 shadow-sm"
                />
              </label>
              <label className="flex items-center space-x-2">
                <span className="text-sm">Status:</span>
                <select
                  value={editedMember.status}
                  onChange={(e) =>
                    setEditedMember({ ...editedMember, status: e.target.value })
                  }
                  className="block mt-1 w-full rounded-md border-gray-300 shadow-sm"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Pending">Pending</option>
                </select>
              </label>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setEditMode(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>Save</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
