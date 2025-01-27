import { useState } from "react";
import { Card } from "@/components/ui/card";
import { FilterBar } from "@/components/Employees/filters/FilterBar";
import { EmployeeCalendar } from "@/components/Employees/calendar/EmployeeCalendar";
import { EmployeeDetails } from "@/components/Employees/calendar/EmployeeDetails";
import { useTeams } from "@/lib/useTeams";

export type EmployeeStatus =
  | "Checked In"
  | "Checked Out"
  | "On Leave"
  | "Late"
  | "On Break";

export interface Employee {
  id: string;
  name: string;
  avatar: string;
  team: string;
  status: EmployeeStatus;
  checkInTime?: string;
  checkOutTime?: string;
  summary?: string;
  project?: string;
}

export default function EmployeesView() {
  // Reusing team data structure from TeamsSettings
  const { teams } = useTeams();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<EmployeeStatus | null>(
    null
  );

  return (
    <div className="flex min-h-screen overflow-hidden">
      <div className="flex-1 p-8 pt-6 space-y-4 ">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Employees</h2>
        </div>

        <FilterBar
          teams={teams}
          selectedTeam={selectedTeam}
          onTeamChange={setSelectedTeam}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
        />

        <Card className="p-6">
          <EmployeeCalendar
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            onEmployeeSelect={setSelectedEmployee}
            teamFilter={selectedTeam}
            statusFilter={selectedStatus}
          />
        </Card>
      </div>

      {selectedEmployee && (
        <EmployeeDetails
          employeeId={selectedEmployee}
          date={selectedDate}
          onClose={() => setSelectedEmployee(null)}
        />
      )}
    </div>
  );
}
