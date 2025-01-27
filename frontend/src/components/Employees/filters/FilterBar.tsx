import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { EmployeeStatus } from "./index";
import { Team } from "@/types/teams";

interface FilterBarProps {
  teams: Team[];
  selectedTeam: string | null;
  onTeamChange: (team: string | null) => void;
  selectedStatus: EmployeeStatus | null;
  onStatusChange: (status: EmployeeStatus | null) => void;
}

const statusOptions: EmployeeStatus[] = [
  "Checked In",
  "Checked Out",
  "On Leave",
  "Late",
  "On Break",
];

export function FilterBar({
  teams,
  selectedTeam,
  onTeamChange,
  selectedStatus,
  onStatusChange,
}: FilterBarProps) {
  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center space-x-4">
          <Input placeholder="Search employees..." className="max-w-sm" />
          <Select
            value={selectedTeam || ""}
            onValueChange={(value) => onTeamChange(value || null)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select team" />
            </SelectTrigger>
            <SelectContent>
              {teams.map((team) => (
                <SelectItem key={team.id} value={team.id.toString()}>
                  {team.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-wrap gap-2">
          {statusOptions.map((status) => (
            <Badge
              key={status}
              variant={selectedStatus === status ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() =>
                onStatusChange(selectedStatus === status ? null : status)
              }
            >
              {status}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
