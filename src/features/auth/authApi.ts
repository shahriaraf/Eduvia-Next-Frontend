import { api } from "@/store/api";
import type { AuthUser, LoginInput, LoginResponse } from "@/features/auth/types";

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginInput>({
      query: (body) => ({ url: "/auth/login", method: "POST", body }),
    }),

    /** Confirms a token restored from localStorage is still valid. */
    getCurrentUser: builder.query<AuthUser, void>({
      query: () => "/auth/me",
    }),
  }),
});

export const { useLoginMutation, useLazyGetCurrentUserQuery } = authApi;
