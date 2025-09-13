import { z } from "zod";

// User validation
const CreateUserBase = z.object({
    name: z.string().trim().min(4, "Name must be at least 4 characters long"),
    email: z.string().trim().email({ message: "Invalid email" }),
    password: z
        .string()
        .trim()
        .min(6, "Password must be at least 6 characters long"),
    password2: z
        .string()
        .trim()
        .min(6, "Password must be at least 6 characters long"),
});

export const CreateUserSchema = CreateUserBase.refine(
    (data) => {
        //Checks if password and password2 are the same
        return data.password === data.password2;
    },
    {
        path: ["password2"], // Points the error to the confirmation field
        message: "Passwords don't match",
    }
).transform(({ email, name, password }) => {
    // Removes password2
    return {
        name,
        email,
        password,
    };
});

export const PublicUserSchema = z.object({
    id: z.string().default(""),
    name: z.string().default(""),
    email: z.string().default(""),
});

export const UpdatePasswordSchema = z
    .object({
        currentPassword: z
            .string()
            .trim()
            .min(6, "Password must be at least 6 characters long"),
        newPassword: z
            .string()
            .trim()
            .min(6, "New password must be at least 6 characters long"),
        newPassword2: z
            .string()
            .trim()
            .min(6, "Password must be at least 6 characters long"),
    })
    .refine(
        (data) => {
            // Checks if newPassword and newPassword2 are the same
            return data.newPassword === data.newPassword2;
        },
        {
            path: ["newPassword2"], // points the error to confirmation field
            message: "Passwords don't match",
        }
    )
    .transform(({ currentPassword, newPassword }) => {
        // Removes newPassword2
        return {
            currentPassword,
            newPassword,
        };
    });

export const UpdateUserSchema = CreateUserBase.omit({
    password: true,
    password2: true,
}).extend({});

export type CreateUserDto = z.infer<typeof CreateUserSchema>;
export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;
export type PublicUserDto = z.infer<typeof PublicUserSchema>;
export type UpdatePasswordDto = z.infer<typeof UpdatePasswordSchema>;
