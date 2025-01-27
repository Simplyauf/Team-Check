import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { Calendar, Clock, Building2, User } from "lucide-react";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";

interface LeaveDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leaveRequest: {
    id: string;
    employeeName: string;
    team: string;
    type: string;
    status: string;
    requestedOn: string;
    startDate: string;
    endDate: string;
    duration: string;
    reason: string;
  };
}

export function LeaveDetailsDialog({
  open,
  onOpenChange,
  leaveRequest,
}: LeaveDetailsDialogProps) {
  const [approvalComment, setApprovalComment] = useState("");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Leave Request Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Employee & Request Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="w-4 h-4" />
                Employee
              </div>
              <div className="font-medium">{leaveRequest.employeeName}</div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Building2 className="w-4 h-4" />
                Team
              </div>
              <div className="font-medium">{leaveRequest.team}</div>
            </div>
          </div>

          <Separator />

          {/* Leave Details */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-x-2">
                <Badge variant="outline">{leaveRequest.type}</Badge>
                <Badge
                  variant={
                    leaveRequest.status === "Pending"
                      ? "outline"
                      : leaveRequest.status === "Approved"
                      ? "default"
                      : "destructive"
                  }
                >
                  {leaveRequest.status}
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                Requested on {format(new Date(leaveRequest.requestedOn), "PPP")}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  Duration
                </div>
                <div className="font-medium">{leaveRequest.duration}</div>
                <div className="text-sm text-muted-foreground">
                  {format(new Date(leaveRequest.startDate), "PPP")} -{" "}
                  {format(new Date(leaveRequest.endDate), "PPP")}
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  Status Timeline
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Requested</span>
                    <span className="text-muted-foreground">
                      {format(new Date(leaveRequest.requestedOn), "PP")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Reason */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Leave Reason</label>
            <p className="text-sm text-muted-foreground">{leaveRequest.reason}</p>
          </div>

          {/* Approval Section */}
          {leaveRequest.status === "Pending" && (
            <>
              <Separator />
              <div className="space-y-2">
                <label className="text-sm font-medium">Approval Comment</label>
                <Textarea
                  placeholder="Add a comment (optional)"
                  value={approvalComment}
                  onChange={(e) => setApprovalComment(e.target.value)}
                />
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={() => onOpenChange(false)}>
                    Cancel
                  </Button>
                  <Button variant="destructive">Reject</Button>
                  <Button>Approve</Button>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}