"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { StudentFilters } from "@/features/students/components/StudentFilters";
import { StudentTable } from "@/features/students/components/StudentTable";
import { StudentsPagination } from "@/features/students/components/StudentsPagination";
import { StudentFormDialog } from "@/features/students/components/StudentFormDialog";
import { DeleteStudentDialog } from "@/features/students/components/DeleteStudentDialog";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setPage } from "@/features/students/studentFiltersSlice";
import { useListStudentsQuery } from "@/features/students/studentsApi";
import { getApiErrorMessage } from "@/store/api";
import type { Student } from "@/features/students/types";

export default function StudentsPage() {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.studentFilters);

  const { data, isLoading, isFetching, isError, error, refetch } = useListStudentsQuery({
    ...filters,
    status: filters.status || undefined,
  });

  const [isAddOpen, setAddOpen] = React.useState(false);
  const [editingStudent, setEditingStudent] = React.useState<Student | null>(null);
  const [deletingStudent, setDeletingStudent] = React.useState<Student | null>(null);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Students</h1>
          <p className="text-sm text-muted-foreground">
            View, search, filter, and manage every student record.
          </p>
        </div>
        <Button onClick={() => setAddOpen(true)}>
          <Plus />
          Add Student
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="sr-only">Filters</CardTitle>
          <CardDescription className="sr-only">
            Search, filter, and sort the student list.
          </CardDescription>
          <StudentFilters />
        </CardHeader>
      </Card>

      <div className="overflow-hidden rounded-lg border border-border bg-surface">
        <StudentTable
          students={data?.data}
          isLoading={isLoading || (isFetching && !data)}
          isError={isError}
          errorMessage={isError ? getApiErrorMessage(error) : undefined}
          onEdit={setEditingStudent}
          onDelete={setDeletingStudent}
          onRetry={refetch}
        />
        {data?.meta && (
          <StudentsPagination meta={data.meta} onPageChange={(page) => dispatch(setPage(page))} />
        )}
      </div>

      <StudentFormDialog open={isAddOpen} onOpenChange={setAddOpen} />

      <StudentFormDialog
        open={!!editingStudent}
        onOpenChange={(open) => !open && setEditingStudent(null)}
        student={editingStudent ?? undefined}
      />

      <DeleteStudentDialog
        open={!!deletingStudent}
        onOpenChange={(open) => !open && setDeletingStudent(null)}
        student={deletingStudent}
      />
    </div>
  );
}
