"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useDeleteStudentMutation } from "@/features/students/studentsApi";
import { getApiErrorMessage } from "@/store/api";
import { toast } from "@/components/ui/use-toast";
import type { Student } from "@/features/students/types";

interface DeleteStudentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: Student | null;
}

export function DeleteStudentDialog({ open, onOpenChange, student }: DeleteStudentDialogProps) {
  const [deleteStudent, { isLoading }] = useDeleteStudentMutation();

  const handleDelete = async () => {
    if (!student) return;
    try {
      await deleteStudent(student.id).unwrap();
      toast({
        variant: "success",
        title: "Student deleted",
        description: `${student.name} has been removed.`,
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Couldn't delete student",
        description: getApiErrorMessage(error),
      });
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to delete this student?</AlertDialogTitle>
          <AlertDialogDescription>
            {student
              ? `This will permanently remove ${student.name} from your student list. This action cannot be undone.`
              : "This action cannot be undone."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            isLoading={isLoading}
            asChild={false}
          >
            Delete student
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
