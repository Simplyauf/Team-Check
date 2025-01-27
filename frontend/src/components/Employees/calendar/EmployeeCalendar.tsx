import { useEffect, useState, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Card } from "@/components/ui/card";
import { EmployeeHoverCard } from "./EmployeeHoverCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface EmployeeCalendarProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  onEmployeeSelect: (employeeId: string) => void;
  teamFilter: string | null;
  statusFilter: string | null;
}

export function EmployeeCalendar({
  selectedDate,
  onDateSelect,
  onEmployeeSelect,
  teamFilter,
  statusFilter,
}: EmployeeCalendarProps) {
  const [hoveredEmployee, setHoveredEmployee] = useState<{
    employee: any;
    position: { top: number; left: number };
    dateEl: HTMLElement;
    date: Date;
    dayIndex: number;
  } | null>(null);

  const hoverTimeoutRef = useRef<NodeJS.Timeout>();
  const isHoveringRef = useRef(false);

  const [showMoreEmployees, setShowMoreEmployees] = useState<{
    employees: any[];
    date: Date | any;
    position: { top: number; left: number };
  } | null>(null);

  const handleMouseEnter = (
    e: React.MouseEvent,
    employee: any,
    date: Date,
    dayIndex: number
  ) => {
    e.stopPropagation();
    isHoveringRef.current = true;

    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }

    const rect = e.currentTarget.getBoundingClientRect();
    setHoveredEmployee({
      employee,
      position: {
        top: rect.top + window.scrollY,
        left: rect.left + rect.width,
      },
      dateEl: e.currentTarget as HTMLElement,
      date,
      dayIndex,
    });
  };

  const handleMouseLeave = () => {
    isHoveringRef.current = false;

    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }

    hoverTimeoutRef.current = setTimeout(() => {
      if (!isHoveringRef.current) {
        setHoveredEmployee(null);
      }
    }, 100);
  };

  return (
    <div className="">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,dayGridWeek",
        }}
        dayCellContent={(args) => {
          const employees = getEmployeesForDate(args.date);
          const dayIndex = args.date.getDay();

          return (
            <div className="p-2">
              <div className="mb-2 text-sm font-medium">
                {args.dayNumberText}
              </div>
              <div className="flex flex-wrap gap-1 ">
                {employees.slice(0, 14).map((employee) => (
                  <div
                    key={employee.id}
                    onMouseEnter={(e) =>
                      handleMouseEnter(e, employee, args.date, dayIndex)
                    }
                    onMouseLeave={handleMouseLeave}
                  >
                    {hoveredEmployee?.employee.id === employee.id &&
                      hoveredEmployee?.date.getTime() ===
                        args.date.getTime() && (
                        <div
                          onMouseEnter={() => {
                            isHoveringRef.current = true;
                            if (hoverTimeoutRef.current) {
                              clearTimeout(hoverTimeoutRef.current);
                            }
                          }}
                          onMouseLeave={handleMouseLeave}
                        >
                          <EmployeeHoverCard
                            dayIndex={hoveredEmployee.dayIndex}
                            employee={hoveredEmployee.employee}
                            position={hoveredEmployee.position}
                            dateEl={hoveredEmployee.dateEl}
                            onClose={() => setHoveredEmployee(null)}
                          />
                        </div>
                      )}
                    <Avatar
                      className="w-6 h-6 border-2 cursor-pointer"
                      style={{
                        borderColor: getStatusColor(employee.status),
                      }}
                      onClick={() => onEmployeeSelect(employee.id)}
                    >
                      <AvatarImage src={employee.avatar} />
                      <AvatarFallback>{employee.name[0]}</AvatarFallback>
                    </Avatar>
                  </div>
                ))}
                {employees.length > 14 && (
                  <Badge
                    variant="outline"
                    className="text-xs cursor-pointer hover:bg-gray-100"
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const dayIndex = args.date.getDay();

                      const adjustedLeft =
                        dayIndex >= 4 ? rect.left - 320 : rect.left - 220;

                      setShowMoreEmployees({
                        employees: employees.slice(14),
                        position: {
                          top: rect.bottom + window.scrollY,
                          left: adjustedLeft,
                        },
                        date: args,
                      });
                    }}
                  >
                    +{employees.length - 14}
                  </Badge>
                )}
              </div>
            </div>
          );
        }}
        dateClick={(info) => onDateSelect(info.date)}
      />

      {/* More Employees Popover */}
      {showMoreEmployees && (
        <>
          <div
            className="absolute inset-0"
            onClick={() => setShowMoreEmployees(null)}
          />
          <Card
            className="absolute z-50 p-2 shadow-lg w-[200px]"
            style={{
              top: showMoreEmployees.position.top,
              left: showMoreEmployees.position.left,
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">More Employees</span>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setShowMoreEmployees(null)}
              >
                ✕
              </button>
            </div>
            <div className="flex flex-col gap-1">
              {showMoreEmployees.employees.map((employee) => (
                <div key={employee.id} className="flex items-center gap-2">
                  <div
                    onMouseEnter={(e) =>
                      handleMouseEnter(
                        e,
                        employee,
                        showMoreEmployees.date.date,
                        showMoreEmployees.date.date.getDay()
                      )
                    }
                    onMouseLeave={handleMouseLeave}
                  >
                    {hoveredEmployee?.employee.id === employee.id &&
                      hoveredEmployee?.date.getTime() ===
                        showMoreEmployees.date.date.getTime() && (
                        <div
                          onMouseEnter={() => {
                            isHoveringRef.current = true;
                            if (hoverTimeoutRef.current) {
                              clearTimeout(hoverTimeoutRef.current);
                            }
                          }}
                          onMouseLeave={handleMouseLeave}
                        >
                          <EmployeeHoverCard
                            dayIndex={hoveredEmployee.dayIndex}
                            employee={hoveredEmployee.employee}
                            position={hoveredEmployee.position}
                            dateEl={hoveredEmployee.dateEl}
                            onClose={() => setHoveredEmployee(null)}
                          />
                        </div>
                      )}
                    <Avatar
                      className="w-6 h-6 border-2 cursor-pointer"
                      style={{
                        borderColor: getStatusColor(employee.status),
                      }}
                      onClick={() => {
                        onEmployeeSelect(employee.id);
                        setShowMoreEmployees(null);
                      }}
                    >
                      <AvatarImage src={employee.avatar} />
                      <AvatarFallback>{employee.name[0]}</AvatarFallback>
                    </Avatar>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}

function getStatusColor(status: string) {
  const colors = {
    "Checked In": "green",
    "Late Check-in": "yellow",
    "On Leave": "red",
    "On Break": "blue",
    "Checked Out": "gray",
  };
  return colors[status] || "gray";
}

// Temporary function to simulate data
function getEmployeesForDate(date: Date) {
  // Check if the date is in the future
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time to start of day for accurate comparison

  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);

  if (targetDate > today) {
    return []; // Return empty array for future dates
  }

  // This would be replaced with actual API call
  return [
    {
      id: "1",
      name: "Sarah Chen",
      avatar: "/avatars/sarah.jpg",
      status: "Checked In",
      time: "9:00 AM",
      project: "Project Atlas",
      summary: "Working on API integration",
    },
    {
      id: "2",
      name: "John Smith",
      avatar: "/avatars/john.jpg",
      status: "Late Check-in",
      time: "9:45 AM",
      project: "Project Beta",
      summary: "Frontend development",
    },
    {
      id: "3",
      name: "Maria Garcia",
      avatar: "/avatars/maria.jpg",
      status: "On Break",
      time: "10:30 AM",
      project: "Project Gamma",
      summary: "Code review",
    },
    {
      id: "11",
      name: "Sarah Chen",
      avatar: "/avatars/sarah.jpg",
      status: "Checked In",
      time: "9:00 AM",
      project: "Project Atlas",
      summary: "Working on API integration",
    },
    {
      id: "12",
      name: "John Smith",
      avatar: "/avatars/john.jpg",
      status: "Late Check-in",
      time: "9:45 AM",
      project: "Project Beta",
      summary: "Frontend development",
    },
    {
      id: "4",
      name: "Alex Kim",
      avatar: "/avatars/alex.jpg",
      status: "Checked In",
      time: "8:55 AM",
      project: "Project Delta",
      summary: "Database optimization",
    },
    {
      id: "5",
      name: "Lisa Wong",
      avatar: "/avatars/lisa.jpg",
      status: "On Leave",
      time: "",
      project: "Project Epsilon",
      summary: "Vacation",
    },
    {
      id: "6",
      name: "David Miller",
      avatar: "/avatars/david.jpg",
      status: "Checked In",
      time: "9:15 AM",
      project: "Project Zeta",
      summary: "Testing",
    },
    {
      id: "7",
      name: "Emma Wilson",
      avatar: "/avatars/emma.jpg",
      status: "Checked Out",
      time: "5:00 PM",
      project: "Project Eta",
      summary: "Documentation",
    },
    {
      id: "8",
      name: "James Brown",
      avatar: "/avatars/james.jpg",
      status: "Checked In",
      time: "9:05 AM",
      project: "Project Theta",
      summary: "Bug fixes",
    },
    {
      id: "9",
      name: "Sofia Rodriguez",
      avatar: "/avatars/sofia.jpg",
      status: "On Break",
      time: "2:30 PM",
      project: "Project Iota",
      summary: "Client meeting",
    },
    {
      id: "10",
      name: "Michael Lee",
      avatar: "/avatars/michael.jpg",
      status: "Late Check-in",
      time: "10:15 AM",
      project: "Project Kappa",
      summary: "Performance optimization",
    },
    {
      id: "15",
      name: "Sarah Chen",
      avatar: "/avatars/sarah.jpg",
      status: "Checked In",
      time: "9:00 AM",
      project: "Project Atlas",
      summary: "Working on API integration",
    },
    {
      id: "16",
      name: "John Smith",
      avatar: "/avatars/john.jpg",
      status: "Late Check-in",
      time: "9:45 AM",
      project: "Project Beta",
      summary: "Frontend development",
    },
    {
      id: "14",
      name: "Sarah Chen",
      avatar: "/avatars/sarah.jpg",
      status: "Checked In",
      time: "9:00 AM",
      project: "Project Atlas",
      summary: "Working on API integration",
    },
    {
      id: "13",
      name: "John Smith",
      avatar: "/avatars/john.jpg",
      status: "Late Check-in",
      time: "9:45 AM",
      project: "Project Beta",
      summary: "Frontend development",
    },
  ];
}
