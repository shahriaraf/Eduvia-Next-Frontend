"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Mail, Phone, GraduationCap, Calendar, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StudentFormDialog } from "@/features/students/components/StudentFormDialog";
import { DeleteStudentDialog } from "@/features/students/components/DeleteStudentDialog";
import { useGetStudentQuery } from "@/features/students/studentsApi";
import { getApiErrorMessage } from "@/store/api";

export default function StudentDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { data: student, isLoading, isError, error } = useGetStudentQuery(params.id);

  const [isEditOpen, setEditOpen] = React.useState(false);
  const [isDeleteOpen, setDeleteOpen] = React.useState(false);

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/students"
        className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to students
      </Link>

      {isLoading ? (
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Skeleton className="h-4 w-64" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-32" />
          </CardContent>
        </Card>
      ) : isError || !student ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <p className="font-medium text-foreground">Student not found</p>
            <p className="text-sm text-muted-foreground">
              {getApiErrorMessage(error, "This student may have been removed.")}
            </p>
            <Button variant="outline" size="sm" onClick={() => router.push("/students")}>
              Back to students
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className="flex-row items-start justify-between space-y-0">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-base font-semibold text-accent-foreground">
                {student.name
                  .split(" ")
                  .map((part) => part[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase()}
              </div>
              <div>
                <CardTitle className="text-lg">{student.name}</CardTitle>
                <Badge variant={student.status === "active" ? "success" : "neutral"} dot>
                  {student.status === "active" ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
                <Pencil />
                Edit
              </Button>
              <Button variant="destructive" size="sm" onClick={() => setDeleteOpen(true)}>
                <Trash2 />
                Delete
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <div>
                  <dt className="text-xs text-muted-foreground">Email</dt>
                  <dd className="text-sm font-medium text-foreground">{student.email}</dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <div>
                  <dt className="text-xs text-muted-foreground">Phone</dt>
                  <dd className="text-sm font-medium text-foreground">{student.phone}</dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <GraduationCap className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <div>
                  <dt className="text-xs text-muted-foreground">Class</dt>
                  <dd className="text-sm font-medium text-foreground">{student.class}</dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <div>
                  <dt className="text-xs text-muted-foreground">Enrolled</dt>
                  <dd className="text-sm font-medium text-foreground">
                    {new Date(student.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </dd>
                </div>
              </div>
            </dl>
          </CardContent>
        </Card>
      )}

      {student && (
        <>
          <StudentFormDialog open={isEditOpen} onOpenChange={setEditOpen} student={student} />
          <DeleteStudentDialog
            open={isDeleteOpen}
            onOpenChange={setDeleteOpen}
            student={student}
          />
        </>
      )}
    </div>
  );
}
