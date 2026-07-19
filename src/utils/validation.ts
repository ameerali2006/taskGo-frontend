import { z } from "zod";

/**
 * Reusable Signup Name validation schema
 * Rules:
 * - Minimum length: 3
 * - Maximum length: 50
 * - Letters and single spaces between words only
 * - Disallows numbers, special characters, leading/trailing/consecutive spaces
 */
export const signupNameSchema = z
  .string()
  .min(3, "Name must be at least 3 characters")
  .max(50, "Name must be at most 50 characters")
  .regex(
    /^[a-zA-Z]+(?: [a-zA-Z]+)*$/,
    "Name can contain only letters and single spaces between words."
  );

/**
 * Reusable Task Title validation schema
 * Rules:
 * - Minimum length: 3 (after trimming)
 * - Maximum length: 100
 * - Allowed: Letters, Numbers, Spaces, Special characters
 * - Constraint: Must contain at least one alphabetic letter
 */
export const taskTitleSchema = z
  .string()
  .transform((val) => val.trim())
  .pipe(
    z
      .string()
      .min(3, "Task title must be at least 3 characters")
      .max(100, "Task title must not exceed 100 characters")
      .refine(
        (val) => /[a-zA-Z]/.test(val),
        "Task title must contain at least one letter"
      )
  );

export const emailSchema = z
  .string()
  .min(1, "Email is required")
  .email("Please provide a valid email address");

export const phoneSchema = z
  .string()
  .min(1, "Phone number is required")
  .length(10, "Phone number must be exactly 10 digits")
  .regex(/^\d+$/, "Phone number must contain only numbers");

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/\d/, "Password must contain at least one number")
  .regex(/[@$!%*?&#]/, "Password must contain at least one special character");

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const signupSchema = z
  .object({
    name: signupNameSchema,
    email: emailSchema,
    phone: phoneSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignupFormData = z.infer<typeof signupSchema>;

export const taskFormSchema = z.object({
  title: taskTitleSchema,
  description: z.string().optional(),
  priority: z.enum(["Low", "Medium", "High"]),
  status: z.enum(["Todo", "In Progress", "Completed"]),
  dueDate: z.string().min(1, "Due date is required"),
});

export type TaskFormData = z.infer<typeof taskFormSchema>;
