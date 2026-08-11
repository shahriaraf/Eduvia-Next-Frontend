"use client";

import * as React from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { hydrate, logout } from "@/features/auth/authSlice";

const STORAGE_KEY = "eduvia_auth";

interface StoredSession {
  token: string;
  user: { id: string; email: string };
}

function readStoredSession(): StoredSession | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredSession) : null;
  } catch {
    // Corrupted or inaccessible storage — treat as "no session" rather than throwing.
    return null;
  }
}

/**
 * Bridges Redux auth state with localStorage so a login survives a page
 * refresh. This intentionally runs only on the client, after mount:
 * reading localStorage during server rendering isn't possible, and
 * guessing at the session there would cause a hydration mismatch.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);
  const user = useAppSelector((state) => state.auth.user);
  const hasHydrated = useAppSelector((state) => state.auth.hasHydrated);

  // Once, on mount: load whatever session (if any) was saved previously.
  React.useEffect(() => {
    dispatch(hydrate(readStoredSession()));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // After that, keep localStorage in sync with whatever Redux holds.
  React.useEffect(() => {
    if (!hasHydrated) return;
    if (token && user) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, user }));
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, [token, user, hasHydrated]);

  // If another tab logs out (or in), mirror that here too.
  React.useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY) return;
      if (!event.newValue) {
        dispatch(logout());
      } else {
        dispatch(hydrate(readStoredSession()));
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [dispatch]);

  return <>{children}</>;
}
