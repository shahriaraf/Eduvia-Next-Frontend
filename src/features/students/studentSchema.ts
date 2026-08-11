import { z } from "zod";

/**
 * Mirrors CreateStudentDto/UpdateStudentDto on the backend field-for-field
 * (see backend src/students/dto/create-student.dto.ts) so a validation
 * error never has to make a round trip to the server to be caught —
 * though the backend re-validates independently regardless, since the
 * client can never be trusted as the only line of defense.
 */
export const studentFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required.")
    .max(120, "Name must be at most 120 characters."),
  email: z
    .string()
    .trim()
    .min(1, "Email is required.")
    .max(160, "Email must be at most 160 characters.")
    .email("Please enter a valid email address."),
  phone: z
    .string()
    .trim()
    .min(1, "Phone is required.")
    .regex(/^[0-9+\-\s()]{6,30}$/, "Please enter a valid phone number."),
  class: z
    .string()
    .trim()
    .min(1, "Class is required.")
    .max(50, "Class must be at most 50 characters."),
  status: z.enum(["active", "inactive"], {
    message: "Status is required.",
  }),
});

export type StudentFormValues = z.infer<typeof studentFormSchema>;
