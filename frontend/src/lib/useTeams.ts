import { useState, useEffect } from "react";

interface Team {
  id: string;
  name: string;
  memberCount: number;
  leadName: string;
  hierarchy: string;
}

export function useTeams() {
  const [teams, setTeams] = useState<Team[]>([
    {
      id: "1",
      name: "Engineering",
      memberCount: 12,
      leadName: "John Doe",
      hierarchy: "Product > Engineering",
    },
    {
      id: "2",
      name: "Design",
      memberCount: 8,
      leadName: "Jane Smith",
      hierarchy: "Product > Design",
    },
    {
      id: "3",
      name: "Marketing",
      memberCount: 6,
      leadName: "Mike Wilson",
      hierarchy: "Growth > Marketing",
    },
  ]);

  // In the future, this would fetch from an API
  useEffect(() => {
    // fetchTeams().then(setTeams);
  }, []);

  return { teams };
}
