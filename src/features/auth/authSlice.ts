import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthUser } from "@/features/auth/types";

export interface AuthState {
  token: string | null;
  user: AuthUser | null;
  /**
   * True once we've checked localStorage for a saved session on this
   * page load. The route guard waits for this before redirecting, so a
   * logged-in user doesn't get bounced to /login for a single frame
   * while the token is still being read on the client.
   */
  hasHydrated: boolean;
}

const initialState: AuthState = {
  token: null,
  user: null,
  hasHydrated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<{ token: string; user: AuthUser }>) {
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
    /** Restores a session found in localStorage (or confirms there wasn't one). */
    hydrate(state, action: PayloadAction<{ token: string; user: AuthUser } | null>) {
      state.token = action.payload?.token ?? null;
      state.user = action.payload?.user ?? null;
      state.hasHydrated = true;
    },
    logout(state) {
      state.token = null;
      state.user = null;
    },
  },
});

export const { setCredentials, hydrate, logout } = authSlice.actions;
export default authSlice.reducer;
