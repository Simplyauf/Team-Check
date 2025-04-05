import { useState } from "react";
import api from "@/lib/api";
import { useAuth } from "./useAuth";

export const useWorkspace = () => {
  const { user } = useAuth();
  const [currentWorkspace, setCurrentWorkspace] = useState(
    JSON.parse(localStorage.getItem("currentWorkspace") || "{}")
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Helper to get workspace context headers
  const getWorkspaceHeaders = (workspaceId: string) => ({
    headers: {
      "X-Workspace-Id": workspaceId,
    },
  });

  const createWorkspace = async (data: {
    name: string;
    subdomain: string;
    ownerId: string;
    settings: any;
  }) => {
    setLoading(true);
    try {
      const response = await api.post("/workspaces", {
        name: data.name,
        subdomain: data.subdomain,
        ownerId: data.ownerId,
        settings: data.settings,
      });
      setCurrentWorkspace(response.data);
      localStorage.setItem("currentWorkspace", JSON.stringify(response.data));
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create workspace");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getWorkspaceDetails = async (workspaceId: string) => {
    setLoading(true);
    try {
      // Add workspace context header
      const response = await api.get(
        `/workspaces`,
        getWorkspaceHeaders(workspaceId)
      );
      return response.data;
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to fetch workspace details"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateWorkspace = async (workspaceId: string, data: any) => {
    setLoading(true);
    try {
      // Add workspace context header
      const response = await api.patch(
        `/workspaces/${workspaceId}`,
        data,
        getWorkspaceHeaders(workspaceId)
      );
      setCurrentWorkspace(response.data);

      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update workspace");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const switchWorkspace = async (workspaceId: string) => {
    try {
      const workspaceDetails = await getWorkspaceDetails(workspaceId);
      setCurrentWorkspace(workspaceDetails);
      localStorage.setItem(
        "currentWorkspace",
        JSON.stringify(workspaceDetails)
      );
      return workspaceDetails;
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to switch workspace");
      throw err;
    }
  };

  return {
    currentWorkspace,
    setCurrentWorkspace,
    loading,
    error,
    createWorkspace,
    getWorkspaceDetails,
    updateWorkspace,
    switchWorkspace,
  };
};
