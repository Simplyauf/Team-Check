import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { googleLogin, logout, setupWorkspace } from "@/store/slices/authSlice";

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated, loading, error } = useSelector(
    (state: RootState) => state.auth
  );

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login: (credential: string) => dispatch(googleLogin(credential)),
    logout: () => dispatch(logout()),
    setupWorkspace: (data: {
      workspaceName: string;
      workspaceSubdomain: string;
    }) => dispatch(setupWorkspace(data)),
  };
};
