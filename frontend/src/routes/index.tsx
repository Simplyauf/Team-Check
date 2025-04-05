import { createBrowserRouter, Navigate } from "react-router-dom";
import { publicRoutes } from "./public";
import { privateRoutes } from "./private";
import { PrivateRoute } from "@/components/auth/PrivateRoute";
import WorkspaceSetup from "@/pages/WorkspaceSetup";
import { WorkspaceSelect } from "@/components/WorkspaceSelect";
import InviteAccept from "@/pages/invite/accept/[token]";

export const router = createBrowserRouter([
  // Public routes (login, register, etc.)
  ...publicRoutes,

  // Public invite routes
  {
    path: "invite/accept/:token",
    element: <InviteAccept />,
  },

  // Protected routes that require authentication
  {
    element: <PrivateRoute />,
    children: [
      // Workspace setup route - accessible when authenticated
      {
        path: "workspace-setup",
        element: <WorkspaceSetup />,
      },
      // Workspace selection route
      {
        path: "workspace-select",
        element: <WorkspaceSelect />,
      },
      // Other private routes
      ...privateRoutes,
    ],
  },

  // Catch-all route for 404
  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
]);
