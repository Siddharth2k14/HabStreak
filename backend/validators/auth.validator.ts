import { z } from "zod";

export const registerSchema = z.object({
    body: z.object({
        username: z.string().min(3, "Username must be at least 3 characters.").max(30),
        email: z.string().email("Invalid email address."),
        password: z.string().min(8, "Password must be at least 8 characters.").max(32),
        confirmPassword: z.string(),
    }).refine((data) => data.password === data.confirmPassword, {
        message: "Password do not match.",
        path: ["confirmPassword"],
    }),
});

export const loginSchema = z.object({
    body: z.object({
        email: z.string().email("Invalid email address."),
        password: z.string().min(8).max(32),
    }),
});