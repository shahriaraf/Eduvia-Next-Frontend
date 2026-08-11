import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { SortField, SortOrder, StudentStatus } from "@/features/students/types";

export interface StudentFiltersState {
  search: string;
  status: StudentStatus | "";
  class: string;
  page: number;
  limit: number;
  sortBy: SortField;
  sortOrder: SortOrder;
}

const initialState: StudentFiltersState = {
  search: "",
  status: "",
  class: "",
  page: 1,
  limit: 10,
  sortBy: "createdAt",
  sortOrder: "DESC",
};

/**
 * Holds the student list's search/filter/sort/pagination UI state.
 *
 * This is deliberately in Redux (not local component state): the same
 * filters drive both the table and, on a wider screen, a filter summary
 * in the page header, and they need to reset the page number in a few
 * different places (changing a filter, changing the search term) — a
 * single reducer keeps that reset logic in one place instead of
 * scattered `setPage(1)` calls next to every setter.
 *
 * The actual student *data* is NOT here — RTK Query (studentsApi) owns
 * fetching/caching/loading/error state for that, since it already does
 * that job well and duplicating it in a slice would just be two sources
 * of truth for the same data.
 */
const studentFiltersSlice = createSlice({
  name: "studentFilters",
  initialState,
  reducers: {
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
      state.page = 1;
    },
    setStatusFilter(state, action: PayloadAction<StudentStatus | "">) {
      state.status = action.payload;
      state.page = 1;
    },
    setClassFilter(state, action: PayloadAction<string>) {
      state.class = action.payload;
      state.page = 1;
    },
    setSort(state, action: PayloadAction<{ sortBy: SortField; sortOrder: SortOrder }>) {
      state.sortBy = action.payload.sortBy;
      state.sortOrder = action.payload.sortOrder;
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    resetFilters() {
      return initialState;
    },
  },
});

export const { setSearch, setStatusFilter, setClassFilter, setSort, setPage, resetFilters } =
  studentFiltersSlice.actions;

export default studentFiltersSlice.reducer;
