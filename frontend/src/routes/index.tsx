import { createBrowserRouter } from "react-router-dom";
import { publicRoutes } from "./public";
import { privateRoutes } from "./private";
import { PrivateRoute } from "@/components/auth/PrivateRoute";
import { useWorkspace } from "@/hooks/useWorkspace";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import WorkspaceSetup from "@/pages/WorkspaceSetup";
import { WorkspaceSelect } from "@/components/WorkspaceSelect";

interface WorkspaceRouteProps {
  children: React.ReactNode;
}

// Workspace middleware component
const WorkspaceRoute = ({ children }: WorkspaceRouteProps) => {
  const { currentWorkspace } = useWorkspace();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentWorkspace) {
      navigate("/workspace-select");
    }
  }, [currentWorkspace, navigate]);

  return <>{children}</>;
};

export const router = createBrowserRouter([
  ...publicRoutes,
  {
    element: <PrivateRoute />,
    children: [
      {
        path: "/workspace-setup",
        element: <WorkspaceSetup />,
      },
      {
        path: "/workspace-select",
        element: <WorkspaceSelect />,
      },
      ...privateRoutes.map((route) => ({
        ...route,
        element: <WorkspaceRoute>{route.element}</WorkspaceRoute>,
      })),
    ],
  },
]);
