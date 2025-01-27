import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { Badge } from "../ui/badge";

import { useState } from "react";
import { formatDate } from "@fullcalendar/core/index.js";
import { useNavigate } from "react-router-dom";

// src/components/performance/PerformanceList.tsx
export function PerformanceList() {
  const navigate = useNavigate();
  const [evaluations] = useState([
    {
      id: "1",
      employeeName: "John Doe",
      projectName: "Website Redesign",
      status: "completed",
      dueDate: "2024-03-15",
      evaluator: "Jane Smith",
      lastUpdated: "2024-02-01",
    },
    // More evaluations...
  ]);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "completed":
        return "secondary";
      case "in_progress":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-4">
      {evaluations.map((evaluation) => (
        <div
          key={evaluation.id}
          className="flex justify-between items-center p-4 rounded-lg border cursor-pointer hover:bg-accent"
          onClick={() => navigate(`/performance/evaluation/${evaluation.id}`)}
        >
          <div className="flex gap-4 items-center">
            <Avatar>
              <AvatarFallback>{evaluation.employeeName[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-medium">{evaluation.employeeName}</h4>
              <p className="text-sm text-muted-foreground">
                {evaluation.projectName}
              </p>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <Badge variant={getStatusVariant(evaluation.status)}>
              {evaluation.status}
            </Badge>
            <div className="text-sm text-muted-foreground">
              {formatDate(evaluation.lastUpdated)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
