"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";

const PUBLIC_ROUTES = new Set(["/login"]);

/**
 * Gates every page behind a valid session, except the routes in
 * `PUBLIC_ROUTES`. Renders nothing until localStorage has been checked
 * (see AuthProvider) so an authenticated user never flashes a redirect
 * to /login on refresh, and a signed-out user never briefly sees a
 * protected page before being sent to log in.
 */
export function RouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const token = useAppSelector((state) => state.auth.token);
  const hasHydrated = useAppSelector((state) => state.auth.hasHydrated);

  const isPublicRoute = PUBLIC_ROUTES.has(pathname);
  const isAuthorized = Boolean(token) && !isPublicRoute;
  const shouldRedirectToLogin = hasHydrated && !token && !isPublicRoute;
  const shouldRedirectToApp = hasHydrated && Boolean(token) && isPublicRoute;

  React.useEffect(() => {
    if (shouldRedirectToLogin) router.replace("/login");
    if (shouldRedirectToApp) router.replace("/students");
  }, [shouldRedirectToLogin, shouldRedirectToApp, router]);

  if (!hasHydrated || shouldRedirectToLogin || shouldRedirectToApp) {
    return null;
  }

  if (isPublicRoute || isAuthorized) {
    return <>{children}</>;
  }

  return null;
}
