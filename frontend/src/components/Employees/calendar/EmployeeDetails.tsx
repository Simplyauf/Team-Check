import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface EmployeeDetailsProps {
  employeeId: string;
  date: Date | null;
  onClose: () => void;
}

export function EmployeeDetails({
  employeeId,
  date,
  onClose,
}: EmployeeDetailsProps) {
  // This would fetch employee details from your API
  const employee = {
    id: employeeId,
    name: "Sarah Chen",
    avatar: "/avatars/sarah.jpg",
    position: "Frontend Developer",
    team: "Engineering",
    status: "Checked In",
    checkInTime: "9:00 AM",
    checkOutTime: "6:00 PM",
    project: "Project Atlas",
    summary: "Working on API integration",
    activities: [
      { time: "9:00 AM", type: "Check In", details: "Started work day" },
      { time: "10:30 AM", type: "Break", details: "15 minutes" },
      { time: "2:00 PM", type: "Meeting", details: "Team sync" },
    ],
  };

  return (
    <div className="fixed inset-y-0 bg-white z-[51] right-0 w-[70%] border-l bg-background shadow-lg animate-in slide-in-from-right">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-4">
            <Avatar className="w-10 h-10">
              <AvatarImage src={employee.avatar} />
              <AvatarFallback>{employee.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-lg font-semibold">{employee.name}</h2>
              <p className="text-sm text-muted-foreground">
                {employee.position}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <ScrollArea className="flex-1 p-6">
          <div className="space-y-6">
            {/* Status Section */}
            <div className="space-y-2">
              <h3 className="font-medium">Current Status</h3>
              <div className="flex items-center space-x-2">
                <Badge>{employee.status}</Badge>
                <span className="text-sm text-muted-foreground">
                  Since {employee.checkInTime}
                </span>
              </div>
            </div>

            {/* Timeline Section */}
            <div className="space-y-2">
              <h3 className="font-medium">Today's Timeline</h3>
              <div className="space-y-4">
                {employee.activities.map((activity, i) => (
                  <div key={i} className="flex items-start space-x-4">
                    <div className="text-sm w-14 text-muted-foreground">
                      {activity.time}
                    </div>
                    <div>
                      <div className="font-medium">{activity.type}</div>
                      <p className="text-sm text-muted-foreground">
                        {activity.details}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
