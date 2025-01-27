// src/components/projects/MilestoneDialog.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MilestoneDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  milestone?: any; // Replace with proper type
  onSave: (milestone: any) => void;
  teamMembers: any[]; // Replace with proper type
}

export function MilestoneDialog({
  open,
  onOpenChange,
  milestone,
  onSave,
  teamMembers,
}: MilestoneDialogProps) {
  const isEditing = !!milestone;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Milestone" : "Add Milestone"}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label>Title</label>
            <Input defaultValue={milestone?.title} />
          </div>
          <div className="grid gap-2">
            <label>Description</label>
            <Textarea defaultValue={milestone?.description} />
          </div>
          <div className="grid gap-2">
            <label>Due Date</label>
            <Input type="date" defaultValue={milestone?.dueDate} />
          </div>
          <div className="grid gap-2">
            <label>Status</label>
            <Select defaultValue={milestone?.status || "pending"}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <label>Assignee</label>
            <Select defaultValue={milestone?.assignee}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {teamMembers.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => onSave(milestone)}>
            {isEditing ? "Save Changes" : "Add Milestone"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
