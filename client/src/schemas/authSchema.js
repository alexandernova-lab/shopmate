import { z } from "zod";

export const registerSchema = z
  .object({
    fullName: z.string().min(2, "Full name is required."),
    email: z.string().email("Please enter a valid email address."),
    username: z.string().min(3, "Username must be at least 3 characters."),
    password: z.string().min(8, "Use at least 8 characters."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"], // Highlights the Confirm password input
  });

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});
