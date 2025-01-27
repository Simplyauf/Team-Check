import { createContext, useContext, useState } from "react";
import api from "@/lib/api";

interface WorkspaceContextType {
  currentWorkspace: any;
  setCurrentWorkspace: (workspace: any) => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(
  undefined
);

export const WorkspaceProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [currentWorkspace, setCurrentWorkspace] = useState(null);

  // Update API headers when workspace changes
  const handleWorkspaceChange = (workspace: any) => {
    if (workspace?.id) {
      api.defaults.headers["x-workspace-id"] = workspace.id;
    } else {
      delete api.defaults.headers["x-workspace-id"];
    }
    setCurrentWorkspace(workspace);
  };

  return (
    <WorkspaceContext.Provider
      value={{ currentWorkspace, setCurrentWorkspace: handleWorkspaceChange }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};
