export interface WorkspaceSettings {
  timezone: string;
  workingDays: string[];
  workingHours: {
    start: string;
    end: string;
  };
}
