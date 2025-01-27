export interface UpdateTeamDto {
  name?: string;
  displayName?: string;
  description?: string;
  status?: "ACTIVE" | "COMPLETED" | "ARCHIVED";
  endDate?: Date;
  metadata?: Record<string, any>;
}

export interface ProjectTeamDto {
  name: string;
  displayName: string;
  workspaceId: string;
  projectId: string;
  startDate?: Date;
  endDate?: Date;
  leadId: string;
  memberIds: string[];
}
