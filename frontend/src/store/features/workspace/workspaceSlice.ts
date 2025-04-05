// Simple API integration functions
export const workspaceApi = {
  getWorkspace: async (workspaceId: string) => {
    const response = await fetch(`/api/workspaces/${workspaceId}`);

    if (!response.ok) {
      throw new Error("Failed to fetch workspace details");
    }

    return response.json();
  },

  updateSettings: async (workspaceId: string, settings: any) => {
    const response = await fetch(`/api/workspaces/${workspaceId}/settings`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(settings),
    });

    if (!response.ok) {
      throw new Error("Failed to update workspace settings");
    }

    return response.json();
  },
  // Add other workspace-related API calls here as needed
};
