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
  loading: true,
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

export const verifyAuth = createAsyncThunk(
  "auth/verify",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("http://localhost:3000/api/auth/me", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      console.log("verifyAuth response:", response.data);
      if (!response.data.user) {
        throw new Error("No user data in response");
      }
      return response.data.user;
    } catch (error: any) {
      console.error("verifyAuth error:", error);
      // localStorage.removeItem("accessToken");
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      // localStorage.removeItem("accessToken");
    },
    startLoading: (state) => {
      state.loading = true;
    },
    finishLoading: (state) => {
      state.loading = false;
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
      })
      .addCase(verifyAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyAuth.fulfilled, (state, action) => {
        console.log("Previous state:", JSON.stringify(state));
        console.log("Action payload:", JSON.stringify(action.payload));
        // localStorage.setItem("workspaceId", action.payload.);
        localStorage.setItem("userId", action.payload.id);
        return {
          ...state,
          loading: false,
          isAuthenticated: true,
          user: action.payload,
          error: null,
        };
      })
      .addCase(verifyAuth.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload as string;
        // localStorage.removeItem("accessToken");
      });
  },
});

export const { logout, startLoading, finishLoading } = authSlice.actions;
export default authSlice.reducer;
