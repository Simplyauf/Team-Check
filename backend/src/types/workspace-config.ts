import { CustomField } from "../services/custom.fields";

interface WorkspaceConfiguration {
  terminology: {
    team: string; // e.g., "Department", "Unit", "Pod"
    manager: string; // e.g., "Supervisor", "Lead", "Head"
    employee: string; // e.g., "Member", "Associate", "Staff"
  };
  features: {
    nestedTeams: boolean;
    matrixReporting: boolean;
    customFields: CustomField[];
  };
  branding: {
    colors: {
      primary: string;
      secondary: string;
    };
    logo?: string;
  };
}
