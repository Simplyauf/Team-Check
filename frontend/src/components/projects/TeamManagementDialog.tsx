// src/components/projects/TeamManagementDialog.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface TeamManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentTeam: any[]; // Replace with proper type
  availableMembers: any[]; // Replace with proper type
  onSave: (selectedMembers: any[]) => void;
}

export function TeamManagementDialog({
  open,
  onOpenChange,
  currentTeam,
  availableMembers,
  onSave,
}: TeamManagementDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Manage Team Members</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search members..." className="pl-8" />
          </div>
          <div className="space-y-4">
            <div className="text-sm font-medium">Current Team Members</div>
            {currentTeam.map((member) => (
              <div key={member.id} className="flex items-center gap-4">
                <Checkbox checked id={member.id} />
                <Avatar>
                  <AvatarImage src={member.avatar} />
                  <AvatarFallback>{member.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{member.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {member.role}
                  </div>
                </div>
              </div>
            ))}
            <div className="text-sm font-medium mt-6">Available Members</div>
            {availableMembers.map((member) => (
              <div key={member.id} className="flex items-center gap-4">
                <Checkbox id={member.id} />
                <Avatar>
                  <AvatarImage src={member.avatar} />
                  <AvatarFallback>{member.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{member.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {member.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => onSave(currentTeam)}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
