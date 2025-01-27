import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/api";

interface WorkspaceState {
  currentWorkspace: any;
  workspaces: any[];
  loading: boolean;
  error: string | null;
}

const initialState: WorkspaceState = {
  currentWorkspace: null,
  workspaces: [],
  loading: false,
  error: null,
};

export const createWorkspace = createAsyncThunk(
  "workspace/create",
  async (data: { workspaceName: string; workspaceSubdomain: string }) => {
    const response = await api.post("/auth/register", data);
    return response.data.workspace;
  }
);

export const setCurrentWorkspace = createAsyncThunk(
  "workspace/setCurrent",
  async (workspaceId: string) => {
    // Update API headers
    api.defaults.headers["x-workspace-id"] = workspaceId;
    return workspaceId;
  }
);

const workspaceSlice = createSlice({
  name: "workspace",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createWorkspace.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createWorkspace.fulfilled, (state, action) => {
        state.currentWorkspace = action.payload;
        state.workspaces.push(action.payload);
        state.loading = false;
      })
      .addCase(createWorkspace.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create workspace";
      })
      .addCase(setCurrentWorkspace.fulfilled, (state, action) => {
        state.currentWorkspace = state.workspaces.find(
          (w) => w.id === action.payload
        );
      });
  },
});

export default workspaceSlice.reducer;
