import { createApi, fetchBaseQuery, type BaseQueryFn } from "@reduxjs/toolkit/query/react";
import type { FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import type { RootState } from "@/store";
import { logout } from "@/features/auth/authSlice";

/**
 * The backend's global exception filter (see AllExceptionsFilter) always
 * returns this shape on error
 */
export interface ApiErrorBody {
  statusCode: number;
  message: string | string[];
  error?: string;
  path?: string;
  timestamp?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});

const baseQueryWithAuthHandling: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  queryApi,
  extraOptions,
) => {
  const result = await rawBaseQuery(args, queryApi, extraOptions);
  const url = typeof args === "string" ? args : args.url;
  if (result.error?.status === 401 && url !== "/auth/login") {
    queryApi.dispatch(logout());
  }
  return result;
};

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithAuthHandling,
  tagTypes: ["Student", "StudentClasses"],
  endpoints: () => ({}),
});

/** Pulls a human-readable message out of an RTK Query error, regardless of shape. */
export function getApiErrorMessage(error: unknown, fallback = "Something went wrong. Please try again."): string {
  if (error && typeof error === "object" && "data" in error) {
    const data = (error as { data?: unknown }).data;
    if (data && typeof data === "object" && "message" in data) {
      const message = (data as ApiErrorBody).message;
      if (Array.isArray(message)) return message[0] ?? fallback;
      if (typeof message === "string") return message;
    }
  }
  if (error && typeof error === "object" && "error" in error) {
    const message = (error as { error?: unknown }).error;
    if (typeof message === "string") return message;
  }
  return fallback;
}
