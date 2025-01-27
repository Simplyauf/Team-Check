import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { Calendar, Clock, Building2, User, ArrowLeft } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LeaveDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [approvalComment, setApprovalComment] = useState("");

  // This would come from your API
  const leaveRequest = {
    id: "1",
    employeeName: "Mike Wilson",
    team: "Engineering",
    type: "Vacation",
    status: "Pending",
    requestedOn: "2024-03-15",
    startDate: "2024-04-24",
    endDate: "2024-04-25",
    duration: "2 days",
    reason: "Family vacation",
    history: [
      {
        date: "2024-03-15T09:00:00",
        action: "Requested",
        by: "Mike Wilson",
      },
      {
        date: "2024-03-15T10:30:00",
        action: "Reviewed",
        by: "Team Lead",
      },
    ],
  };

  return (
    <div className="flex-1 p-8 pt-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/leave")}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">
          Leave Request Details
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Info */}
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle>Request Information</CardTitle>
                <div className="text-sm text-muted-foreground">
                  Submitted on{" "}
                  {format(new Date(leaveRequest.requestedOn), "PPP")}
                </div>
              </div>
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
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Employee Info */}
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
                    Leave Type
                  </div>
                  <Badge variant="outline">{leaveRequest.type}</Badge>
                </div>
              </div>
            </div>

            <Separator />

            {/* Reason */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Leave Reason</label>
              <p className="text-sm text-muted-foreground">
                {leaveRequest.reason}
              </p>
            </div>

            {/* Approval Section */}
            {leaveRequest.status === "Pending" && (
              <>
                <Separator />
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Approval Comment
                  </label>
                  <Textarea
                    placeholder="Add a comment (optional)"
                    value={approvalComment}
                    onChange={(e) => setApprovalComment(e.target.value)}
                  />
                  <div className="flex justify-end gap-2 mt-4">
                    <Button variant="destructive">Reject</Button>
                    <Button>Approve</Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Request Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {leaveRequest.history.map((event, index) => (
                <div key={index} className="flex gap-4">
                  <div className="w-2 h-2 mt-2 rounded-full bg-primary" />
                  <div className="flex-1 space-y-1">
                    <div className="text-sm font-medium">{event.action}</div>
                    <div className="text-sm text-muted-foreground">
                      by {event.by}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {format(new Date(event.date), "PPP p")}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
