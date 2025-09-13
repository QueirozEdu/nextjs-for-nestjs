import { z } from "zod";

export const LoginSchema = z.object({
    email: z.string().trim().email({ message: "Invalid email" }),
    password: z
        .string()
        .trim()
        .min(3, "Password must have a minimum of 3 characters"),
});
