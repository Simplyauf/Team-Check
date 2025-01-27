import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LeaveRequest } from "@/lib/leave";

interface LeaveRequestListProps {
  requests: LeaveRequest[];
  onSelectRequest: (request: LeaveRequest) => void;
}

export function LeaveRequestList({
  requests,
  onSelectRequest,
}: LeaveRequestListProps) {
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRequests = requests.filter((request) => {
    const matchesStatus = !statusFilter || request.status === statusFilter;
    const matchesSearch =
      !searchQuery ||
      request.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.reason.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Leave Requests</CardTitle>
          <div className="flex gap-2">
            <Input
              placeholder="Search requests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-[200px]"
            />
            <Select onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredRequests.map((request) => (
            <div
              key={request.id}
              className="flex items-start p-4 space-x-4 border rounded-lg cursor-pointer hover:bg-muted"
              onClick={() => onSelectRequest(request)}
            >
              <Avatar>
                <AvatarImage src={request.avatar} />
                <AvatarFallback>{request.user[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{request.user}</span>
                    <Badge>{request.status}</Badge>
                    <Badge variant="outline">{request.type}</Badge>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {request.submittedAt}
                  </span>
                </div>
                <p className="text-sm">
                  {request.startDate} - {request.endDate}
                </p>
                <p className="text-sm text-muted-foreground">
                  {request.reason}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
