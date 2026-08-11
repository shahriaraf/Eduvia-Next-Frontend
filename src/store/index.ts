import { configureStore } from "@reduxjs/toolkit";
import { api } from "@/store/api";
import studentFiltersReducer from "@/features/students/studentFiltersSlice";
import authReducer from "@/features/auth/authSlice";

export function makeStore() {
  return configureStore({
    reducer: {
      [api.reducerPath]: api.reducer,
      studentFilters: studentFiltersReducer,
      auth: authReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
  });
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
