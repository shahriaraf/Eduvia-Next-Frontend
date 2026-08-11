"use client";

import * as React from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { studentFormSchema, type StudentFormValues } from "@/features/students/studentSchema";
import {
  useCreateStudentMutation,
  useUpdateStudentMutation,
} from "@/features/students/studentsApi";
import { getApiErrorMessage } from "@/store/api";
import { toast } from "@/components/ui/use-toast";
import type { Student } from "@/features/students/types";

interface StudentFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** When provided, the dialog edits this student; otherwise it creates a new one. */
  student?: Student;
}

const emptyValues: StudentFormValues = {
  name: "",
  email: "",
  phone: "",
  class: "",
  status: "active",
};

export function StudentFormDialog({ open, onOpenChange, student }: StudentFormDialogProps) {
  const isEditMode = Boolean(student);

  const [createStudent, { isLoading: isCreating }] = useCreateStudentMutation();
  const [updateStudent, { isLoading: isUpdating }] = useUpdateStudentMutation();
  const isSubmitting = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm<StudentFormValues>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: emptyValues,
  });

  // Re-sync the form whenever the dialog opens (either a fresh "Add" form
  // or the selected student's current values for "Edit").
  React.useEffect(() => {
    if (open) {
      reset(
        student
          ? {
              name: student.name,
              email: student.email,
              phone: student.phone,
              class: student.class,
              status: student.status,
            }
          : emptyValues,
      );
    }
  }, [open, student, reset]);

  const onSubmit = async (values: StudentFormValues) => {
    try {
      if (isEditMode && student) {
        await updateStudent({ id: student.id, body: values }).unwrap();
        toast({
          variant: "success",
          title: "Student updated",
          description: `${values.name}'s record has been saved.`,
        });
      } else {
        await createStudent(values).unwrap();
        toast({
          variant: "success",
          title: "Student added",
          description: `${values.name} has been added to the list.`,
        });
      }
      onOpenChange(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: isEditMode ? "Couldn't update student" : "Couldn't add student",
        description: getApiErrorMessage(error),
      });
    }
  };

  const statusValue = useWatch({ control, name: "status" });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Edit Student" : "Add Student"}</DialogTitle>
            <DialogDescription>
              {isEditMode
                ? "Update this student's details."
                : "Fill in the details to add a new student."}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 px-6 py-5">
            <FormField id="name" label="Name" required error={errors.name?.message}>
              <Input
                id="name"
                placeholder="e.g. Ariana Chowdhury"
                invalid={!!errors.name}
                aria-describedby={errors.name ? "name-error" : undefined}
                {...register("name")}
              />
            </FormField>

            <FormField id="email" label="Email" required error={errors.email?.message}>
              <Input
                id="email"
                type="email"
                placeholder="e.g. ariana@example.com"
                invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
                {...register("email")}
              />
            </FormField>

            <div className="grid grid-cols-2 gap-4">
              <FormField id="phone" label="Phone" required error={errors.phone?.message}>
                <Input
                  id="phone"
                  placeholder="e.g. +8801711111111"
                  invalid={!!errors.phone}
                  aria-describedby={errors.phone ? "phone-error" : undefined}
                  {...register("phone")}
                />
              </FormField>

              <FormField id="class" label="Class" required error={errors.class?.message}>
                <Input
                  id="class"
                  placeholder="e.g. Grade 10"
                  invalid={!!errors.class}
                  aria-describedby={errors.class ? "class-error" : undefined}
                  {...register("class")}
                />
              </FormField>
            </div>

            <FormField id="status" label="Status" required error={errors.status?.message}>
              <Select
                value={statusValue}
                onValueChange={(value: "active" | "inactive") =>
                  setValue("status", value, { shouldValidate: true })
                }
              >
                <SelectTrigger id="status" invalid={!!errors.status}>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              {isEditMode ? "Save changes" : "Add student"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
