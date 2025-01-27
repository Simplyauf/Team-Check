export type LeaveStatus = "Pending" | "Approved" | "Rejected" | "Cancelled";

export type LeaveType =
  | "Vacation"
  | "Sick"
  | "Personal"
  | "Work From Home"
  | "Other";

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  avatar: string;
  type: LeaveType;
  status: LeaveStatus;
  startDate: Date;
  endDate: Date;
  reason: string;
  approver?: string;
  approvalDate?: Date;
  comments?: string[];
}

export interface LeaveBalance {
  type: LeaveType;
  total: number;
  used: number;
  pending: number;
  remaining: number;
}
