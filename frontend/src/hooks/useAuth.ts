import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import {
  googleLogin,
  logout,
  setupWorkspace,
  verifyAuth,
  finishLoading,
} from "@/store/slices/authSlice";
import { useEffect, useCallback } from "react";

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated, loading, error } = useSelector(
    (state: RootState) => state.auth
  );

  // Memoize callback functions to maintain consistent references
  const login = useCallback(
    (credential: string) => dispatch(googleLogin(credential)),
    [dispatch]
  );

  const handleLogout = useCallback(() => dispatch(logout()), [dispatch]);

  const handleSetupWorkspace = useCallback(
    (data: { workspaceName: string; workspaceSubdomain: string }) =>
      dispatch(setupWorkspace(data)),
    [dispatch]
  );

  const handleVerifyAuth = useCallback(
    () => dispatch(verifyAuth()),
    [dispatch]
  );

  // Add verification on hook mount
  useEffect(() => {
    let mounted = true;

    const verifyAuthentication = async () => {
      const token = localStorage.getItem("accessToken");
      console.log("useAuth Debug:", {
        token: !!token,
        isAuthenticated,
        hasUser: !!user,
        loading,
        mounted,
      });

      if (token && !isAuthenticated && mounted) {
        try {
          const result = await dispatch(verifyAuth());
          if (mounted) {
            if (verifyAuth.fulfilled.match(result)) {
              console.log("Verification successful, user:", result.payload);
            }
          }
        } catch (error) {
          console.error("Verification failed:", error);
        }
      } else {
        // If no token, finish loading
        dispatch(finishLoading());
      }
    };

    verifyAuthentication();

    return () => {
      mounted = false;
    };
  }, []); // Remove dependencies to run only once on mount

  // Wait for initial verification before returning auth state
  if (loading) {
    return {
      user: null,
      isAuthenticated: false,
      loading: true,
      error: null,
      login: () => Promise.resolve(),
      logout: () => {},
      setupWorkspace: () => Promise.resolve(),
      verifyAuth: () => Promise.resolve(),
    };
  }

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    logout: handleLogout,
    setupWorkspace: handleSetupWorkspace,
    verifyAuth: handleVerifyAuth,
  };
};
