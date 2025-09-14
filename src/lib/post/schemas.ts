import { isUrlOrRelativePath } from "@/utils/is-url-or-relative-path";
import sanitizeHtml from "sanitize-html";
import { z } from "zod";
import { PublicUserSchema } from "../user/schemas";

const PostBaseSchema = z.object({
    title: z
        .string()
        .trim()
        .min(3, "Title must have a minimum of 3 characteres")
        .max(120, "Title must have a maximum of 120 characteres"),
    content: z
        .string()
        .trim()
        .min(3, "Content is mandatory")
        .transform((val) => sanitizeHtml(val)),
    author: z
        .string()
        .trim()
        .min(4, "Author must have a minimum of 4 characteres")
        .max(100, "Authors name can not have more than 100 characteres"),
    excerpt: z
        .string()
        .trim()
        .min(3, "Excerpt must have a minimum of 3 characteres")
        .max(200, "Excerpt can not exceed 200 characteres"),
    coverImageUrl: z.string().trim().refine(isUrlOrRelativePath, {
        message: "Cover URL musb be a URL or path to image",
    }),
    published: z
        .union([
            z.literal("on"),
            z.literal("true"),
            z.literal("false"),
            z.literal(true),
            z.literal(false),
            z.literal(null),
            z.literal(undefined),
        ])
        .default(false)
        .transform((val) => val === "on" || val === "true" || val === true),
});

// PostCreateSchema: igual ao base por enquanto
export const PostCreateSchema = PostBaseSchema;

// PostUpdateSchema: pode incluir campos extras no futuro (ex: id)
export const PostUpdateSchema = PostBaseSchema.extend({
    // id: z.string().uuid('ID inválido'),
});

export const CreatePostForApiSchema = PostBaseSchema.omit({
    author: true,
    published: true,
}).extend({});

export const UpdatePostForApiSchema = PostBaseSchema.omit({
    author: true,
}).extend({});

export const PublicPostForApiSchema = PostBaseSchema.extend({
    id: z.string().default(""),
    slug: z.string().default(""),
    title: z.string().default(""),
    excerpt: z.string().default(""),
    author: PublicUserSchema.optional().default({
        id: "",
        email: "",
        name: "",
    }),
    content: z.string().default(""),
    coverImageUrl: z.string().default(""),
    createdAt: z.string().default(""),
});

export type CreatePostForApiDto = z.infer<typeof CreatePostForApiSchema>;
export type UpdatePostForApiDto = z.infer<typeof UpdatePostForApiSchema>;
export type PublicPostForApiDto = z.infer<typeof PublicPostForApiSchema>;
