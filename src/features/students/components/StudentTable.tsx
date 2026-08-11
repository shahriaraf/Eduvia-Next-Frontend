"use client";

import Link from "next/link";
import { AlertCircle, Eye, Pencil, Trash2, Users } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Student } from "@/features/students/types";

interface StudentTableProps {
  students: Student[] | undefined;
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  onEdit: (student: Student) => void;
  onDelete: (student: Student) => void;
  onRetry: () => void;
}

const COLUMN_COUNT = 6;

export function StudentTable({
  students,
  isLoading,
  isError,
  errorMessage,
  onEdit,
  onDelete,
  onRetry,
}: StudentTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Student</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Class</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <TableRow key={i}>
              {Array.from({ length: COLUMN_COUNT }).map((__, j) => (
                <TableCell key={j}>
                  <Skeleton className="h-4 w-full max-w-32" />
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : isError ? (
          <TableRow>
            <TableCell colSpan={COLUMN_COUNT} className="py-12">
              <div className="flex flex-col items-center gap-3 text-center">
                <AlertCircle className="h-8 w-8 text-destructive" aria-hidden="true" />
                <div>
                  <p className="font-medium text-foreground">Unable to load students</p>
                  <p className="text-sm text-muted-foreground">
                    {errorMessage ?? "Please try again."}
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={onRetry}>
                  Try again
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ) : !students || students.length === 0 ? (
          <TableRow>
            <TableCell colSpan={COLUMN_COUNT} className="py-12">
              <div className="flex flex-col items-center gap-2 text-center">
                <Users className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
                <p className="font-medium text-foreground">No students found.</p>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your search or filters, or add a new student.
                </p>
              </div>
            </TableCell>
          </TableRow>
        ) : (
          students.map((student) => (
            <TableRow key={student.id}>
              <TableCell>
                <Link
                  href={`/students/${student.id}`}
                  className="font-medium text-foreground hover:text-primary hover:underline underline-offset-2"
                >
                  {student.name}
                </Link>
              </TableCell>
              <TableCell className="text-muted-foreground">{student.email}</TableCell>
              <TableCell className="text-muted-foreground">{student.phone}</TableCell>
              <TableCell>{student.class}</TableCell>
              <TableCell>
                <Badge variant={student.status === "active" ? "success" : "neutral"} dot>
                  {student.status === "active" ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-1">
                  <Button variant="ghost" size="icon" asChild aria-label={`View ${student.name}`}>
                    <Link href={`/students/${student.id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(student)}
                    aria-label={`Edit ${student.name}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(student)}
                    aria-label={`Delete ${student.name}`}
                    className="hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
