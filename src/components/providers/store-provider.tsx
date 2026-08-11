"use client";

import * as React from "react";
import { Provider } from "react-redux";
import { makeStore, type AppStore } from "@/store";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  // Lazy initializer runs exactly once per component instance, giving
  // every browser tab its own store without sharing state across SSR
  // requests — the same guarantee a useRef-based singleton would give,
  // but without touching a ref during render.
  const [store] = React.useState<AppStore>(() => makeStore());
  return <Provider store={store}>{children}</Provider>;
}
