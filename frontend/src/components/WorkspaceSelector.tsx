import { useWorkspace } from "@/hooks/useWorkspace";
import { useAuth } from "@/hooks/useAuth";

export function WorkspaceSelector() {
  const { user } = useAuth();
  const { setCurrentWorkspace, currentWorkspace } = useWorkspace();

  return (
    <select
      value={currentWorkspace?.id}
      onChange={(e) => setCurrentWorkspace(e.target.value)}
      className="p-2 rounded-md border"
    >
      {user?.workspaces?.map((workspace: any) => (
        <option key={workspace.id} value={workspace.id}>
          {workspace.name}
        </option>
      ))}
    </select>
  );
}
