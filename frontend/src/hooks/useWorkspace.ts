import { useState } from "react";
import api from "@/lib/api";
import { useAuth } from "./useAuth";

export const useWorkspace = () => {
  const { user } = useAuth();
  const [currentWorkspace, setCurrentWorkspace] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createWorkspace = async (data: {
    workspaceName: string;
    workspaceSubdomain: string;
  }) => {
    setLoading(true);
    try {
      const response = await api.post("/api/workspaces", {
        name: data.workspaceName,
        subdomain: data.workspaceSubdomain,
      });
      setCurrentWorkspace(response.data);
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
      const response = await api.get(`/api/workspaces/${workspaceId}`);
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
      const response = await api.put(`/api/workspaces/${workspaceId}`, data);
      setCurrentWorkspace(response.data);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update workspace");
      throw err;
    } finally {
      setLoading(false);
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
  };
};
