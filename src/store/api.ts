import { createApi, fetchBaseQuery, type BaseQueryFn } from "@reduxjs/toolkit/query/react";
import type { FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import type { RootState } from "@/store";
import { logout } from "@/features/auth/authSlice";

/**
 * The backend's global exception filter (see AllExceptionsFilter) always
 * returns this shape on error, e.g.:
 *   { statusCode: 404, message: "Student with id ... was not found.",
 *     error: "Not Found", path: "...", timestamp: "..." }
 * `message` is a string for most errors, or string[] for a validation
 * error listing every failed field at once.
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

/**
 * Wraps the base query so an expired/invalid token (a 401 from any
 * endpoint other than login itself) clears the session — the route
 * guard then sends the user back to /login instead of leaving them on
 * a page that will just keep failing.
 */
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

/**
 * Single RTK Query API instance for the whole app. Feature modules call
 * `api.injectEndpoints(...)` (see features/students/studentsApi.ts)
 * instead of creating their own `createApi` — this keeps one shared
 * cache, one shared middleware, and one place to change the base URL
 * or add auth headers later.
 */
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
