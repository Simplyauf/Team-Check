import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar } from "lucide-react";

interface EmployeeHoverCardProps {
  employee: any;
  dateEl: HTMLElement;
  onClose: () => void;
  dayIndex: number;
}

export function EmployeeHoverCard({
  employee,
  dateEl,
  onClose,
  dayIndex,
}: EmployeeHoverCardProps) {
  const rect = dateEl.getBoundingClientRect();
  const isRightSide = dayIndex >= 4;

  return (
    <Card
      className="fixed z-[9999] bg-white p-4 shadow-lg min-w-80 w-80"
      style={{
        left: isRightSide
          ? `${rect.left - 320}px`
          : `${rect.left + rect.width}px`,
        top: `${rect.top}px`,
      }}
      onMouseLeave={onClose}
    >
      <div className="flex items-start space-x-4">
        <Avatar>
          <AvatarImage src={employee.avatar} />
          <AvatarFallback>{employee.name[0]}</AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-medium">{employee.name}</span>
            <Badge variant="outline">{employee.status}</Badge>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            {employee.time}
          </div>
          {employee.project && (
            <p className="text-sm text-muted-foreground">
              {employee.project} - {employee.summary}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
