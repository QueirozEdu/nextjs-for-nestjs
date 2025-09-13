"use server";
import { drizzleDb } from "@/db/drizzle";
import { postsTable } from "@/db/drizzle/schemas";
import { verifyLoginSession } from "@/lib/login/manage-login";
import { postRepository } from "@/repositories/post";
import { eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";

export async function deletePostAction(id: string) {
    const isAuthenticated = await verifyLoginSession();

    if (!isAuthenticated) {
        return {
            errors: ["Please log in again in another tab to continue"],
        };
    }

    if (!id || typeof id !== "string") {
        return {
            error: "Invalid data",
        };
    }

    const post = await postRepository.findById(id).catch(() => undefined);

    if (!post) {
        return {
            error: "Post does not exist",
        };
    }

    //TODO: move this method to repository
    await drizzleDb.delete(postsTable).where(eq(postsTable.id, id));

    revalidateTag("posts");
    revalidateTag(`post-${post.slug}`);

    return {
        error: "",
    };
}
