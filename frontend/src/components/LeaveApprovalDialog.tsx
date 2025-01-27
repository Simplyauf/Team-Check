import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";

interface LeaveApprovalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: LeaveRequest;
}

export function LeaveApprovalDialog({
  open,
  onOpenChange,
  request,
}: LeaveApprovalDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Leave Request Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="flex items-start space-x-4">
            <Avatar>
              <AvatarImage src={request.avatar} />
              <AvatarFallback>{request.user[0]}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h4 className="font-medium">{request.user}</h4>
              <div className="flex items-center gap-2">
                <Badge>{request.type}</Badge>
                <Badge variant="outline">{request.status}</Badge>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Start Date</label>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4" />
                {request.startDate}
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">End Date</label>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4" />
                {request.endDate}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Reason</label>
            <p className="text-sm text-muted-foreground">{request.reason}</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Comments</label>
            <Textarea placeholder="Add your comments..." />
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button variant="destructive">Reject</Button>
            <Button>Approve</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
