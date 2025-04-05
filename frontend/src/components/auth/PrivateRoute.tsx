import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export const PrivateRoute = () => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  console.log("PrivateRoute Debug:", {
    isAuthenticated,
    user,
    loading,
    currentPath: location.pathname,
    hasWorkspaces: user?.workspaces?.length,
  });

  // Show loading state while verifying authentication
  if (loading) {
    console.log("PrivateRoute: Loading state");
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    console.log("PrivateRoute: Not authenticated, redirecting to login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Special handling for workspace setup route
  if (location.pathname === "/workspace-setup") {
    console.log("PrivateRoute: On workspace setup page");
    return <Outlet />;
  }

  // If authenticated but no workspaces, redirect to workspace setup
  if (!user.workspaces?.length) {
    console.log("PrivateRoute: No workspaces, redirecting to setup");
    return <Navigate to="/workspace-setup" replace />;
  }

  console.log("PrivateRoute: All checks passed, rendering outlet");
  return <Outlet />;
};
