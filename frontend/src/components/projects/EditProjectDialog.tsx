// src/components/projects/EditProjectDialog.tsx
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

interface EditProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: any; // Replace with proper type
  onSave: (updatedProject: any) => void;
}

export function EditProjectDialog({
  open,
  onOpenChange,
  project,
  onSave,
}: EditProjectDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label>Project Name</label>
            <Input defaultValue={project.name} />
          </div>
          <div className="grid gap-2">
            <label>Description</label>
            <Textarea defaultValue={project.description} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label>Start Date</label>
              <Input type="date" defaultValue={project.startDate} />
            </div>
            <div className="grid gap-2">
              <label>End Date</label>
              <Input type="date" defaultValue={project.endDate} />
            </div>
          </div>
          <div className="grid gap-2">
            <label>Status</label>
            <Select defaultValue={project.status}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="on-hold">On Hold</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <label>Priority</label>
            <Select defaultValue={project.priority}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => onSave(project)}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
