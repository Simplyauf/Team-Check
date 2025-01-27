import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useWorkspace } from "@/hooks/useWorkspace";

export const WorkspaceSelect = () => {
  const { user } = useAuth();
  const { setCurrentWorkspace } = useWorkspace();
  const navigate = useNavigate();

  const handleWorkspaceSelect = (workspace: any) => {
    setCurrentWorkspace(workspace);
    navigate("/dashboard");
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-background">
      <div className="space-y-4 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center">Select Workspace</h1>
        <div className="space-y-2">
          {user?.workspaces?.map((membership: any) => (
            <button
              key={membership.workspace.id}
              onClick={() => handleWorkspaceSelect(membership.workspace)}
              className="p-4 w-full text-left rounded-lg border hover:bg-gray-50"
            >
              <div className="font-medium">{membership.workspace.name}</div>
              <div className="text-sm text-gray-500">
                {membership.workspace.subdomain}.teamsync.com
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
