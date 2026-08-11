"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

const emptySubscribe = () => () => {};

/**
 * True only once the component has hydrated on the client. Uses
 * useSyncExternalStore (client snapshot: true, server snapshot: false)
 * instead of the classic `useState(false) + useEffect(() => setState(true))`
 * pattern, which triggers an extra render pass under React Compiler.
 */
function useHasMounted() {
  return React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

/**
 * Toggles between light and dark. Renders a placeholder until mounted
 * to avoid a hydration mismatch (the server doesn't know the user's
 * persisted theme preference).
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const hasMounted = useHasMounted();

  if (!hasMounted) {
    return <Button variant="ghost" size="icon" aria-hidden="true" tabIndex={-1} disabled />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? <Sun /> : <Moon />}
    </Button>
  );
}
