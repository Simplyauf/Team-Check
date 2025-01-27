import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/api";
import axios from "axios";

interface AuthState {
  user: any | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

export const googleLogin = createAsyncThunk(
  "auth/googleLogin",
  async (credential: string) => {
    const { data } = await axios.post("http://localhost:3000/api/auth/google", {
      token: credential,
    });
    localStorage.setItem("accessToken", data.accessToken);
    return data.user;
  }
);

export const setupWorkspace = createAsyncThunk(
  "auth/setupWorkspace",
  async (workspaceData: {
    workspaceName: string;
    workspaceSubdomain: string;
  }) => {
    const { data } = await api.post("/auth/register", workspaceData);
    return data;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem("accessToken");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(googleLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Login failed";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
