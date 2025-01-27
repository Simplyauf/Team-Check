import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export const PrivateRoute = () => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated but no workspaces, redirect to workspace setup
  if (!user?.workspaces?.length) {
    return <Navigate to="/workspace-setup" replace />;
  }

  return <Outlet />;
};
