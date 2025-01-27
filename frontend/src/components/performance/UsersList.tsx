import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { formatDate } from "date-fns";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// src/components/performance/UsersList.tsx
export function UsersList() {
  const [users] = useState([
    {
      id: "1",
      name: "John Doe",
      role: "Senior Developer",
      department: "Engineering",
      lastEvaluation: {
        date: "2024-02-01",
        score: 4.5,
      },
    },
    // More users...
  ]);

  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      {users.map((user) => (
        <div
          key={user.id}
          className="flex justify-between items-center p-4 rounded-lg border cursor-pointer hover:bg-accent"
          onClick={() => navigate(`/performance/users/${user.id}`)}
        >
          <div className="flex gap-4 items-center">
            <Avatar>
              <AvatarFallback>{user.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-medium">{user.name}</h4>
              <p className="text-sm text-muted-foreground">
                {user.role} • {user.department}
              </p>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            Last Evaluation:{" "}
            {formatDate(user.lastEvaluation.date, "MM/dd/yyyy")}
          </div>
        </div>
      ))}
    </div>
  );
}
