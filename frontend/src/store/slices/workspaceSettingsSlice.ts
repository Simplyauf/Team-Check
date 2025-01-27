import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/api";

interface WorkspaceSettings {
  general: {
    name: string;
    subdomain: string;
    timezone: string;
    workingDays: string[];
    workingHours: { start: string; end: string };
  };
  security: {
    twoFactorRequired: boolean;
    ssoEnabled: boolean;
    sessionTimeout: number;
  };
  integrations: {
    slack: boolean;
    msTeams: boolean;
    zoom: boolean;
  };
}

export const updateWorkspaceSettings = createAsyncThunk(
  "workspaceSettings/update",
  async (settings: Partial<WorkspaceSettings>) => {
    const { data } = await api.patch("/workspace/settings", settings);
    return data;
  }
);

const workspaceSettingsSlice = createSlice({
  name: "workspaceSettings",
  initialState: {
    settings: null as WorkspaceSettings | null,
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateWorkspaceSettings.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateWorkspaceSettings.fulfilled, (state, action) => {
        state.settings = action.payload;
        state.loading = false;
      })
      .addCase(updateWorkspaceSettings.rejected, (state, action) => {
        state.error = action.error.message || "Failed to update settings";
        state.loading = false;
      });
  },
});

export default workspaceSettingsSlice.reducer;
