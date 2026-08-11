"use client";

import * as React from "react";
import { Search, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setSearch,
  setStatusFilter,
  setClassFilter,
  setSort,
} from "@/features/students/studentFiltersSlice";
import { useGetStudentClassesQuery } from "@/features/students/studentsApi";
import { useDebouncedValue } from "@/lib/use-debounced-value";
import type { SortField, SortOrder } from "@/features/students/types";

const SORT_OPTIONS: Array<{ value: `${SortField}:${SortOrder}`; label: string }> = [
  { value: "createdAt:DESC", label: "Newest first" },
  { value: "createdAt:ASC", label: "Oldest first" },
  { value: "name:ASC", label: "Name (A–Z)" },
  { value: "name:DESC", label: "Name (Z–A)" },
  { value: "class:ASC", label: "Class (A–Z)" },
];

export function StudentFilters() {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.studentFilters);
  const { data: classOptions = [] } = useGetStudentClassesQuery();

  // Local input state, debounced before it's written to Redux — so the
  // API call (driven by the Redux value) fires ~350ms after the user
  // stops typing instead of on every keystroke.
  const [searchInput, setSearchInput] = React.useState(filters.search);
  const debouncedSearch = useDebouncedValue(searchInput, 350);

  React.useEffect(() => {
    dispatch(setSearch(debouncedSearch));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative w-full sm:max-w-xs">
        <Search
          className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search by name or email…"
          className="pl-8"
          aria-label="Search students by name or email"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Select
          value={filters.status || "all"}
          onValueChange={(value) =>
            dispatch(setStatusFilter(value === "all" ? "" : (value as "active" | "inactive")))
          }
        >
          <SelectTrigger className="w-[140px]" aria-label="Filter by status">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.class || "all"}
          onValueChange={(value) => dispatch(setClassFilter(value === "all" ? "" : value))}
        >
          <SelectTrigger className="w-[140px]" aria-label="Filter by class">
            <SelectValue placeholder="Class" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All classes</SelectItem>
            {classOptions.map((className) => (
              <SelectItem key={className} value={className}>
                {className}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={`${filters.sortBy}:${filters.sortOrder}`}
          onValueChange={(value) => {
            const [sortBy, sortOrder] = value.split(":") as [SortField, SortOrder];
            dispatch(setSort({ sortBy, sortOrder }));
          }}
        >
          <SelectTrigger className="w-[160px]" aria-label="Sort students">
            <ArrowUpDown className="h-3.5 w-3.5 opacity-60" aria-hidden="true" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
