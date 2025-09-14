"use server";

import { makePartialPublicPost, PublicPost } from "@/DTO/post/dto";
import { verifyLoginSession } from "@/lib/login/manage-login";
import { PostCreateSchema } from "@/lib/post/schemas";
import { PostModel } from "@/models/post/post-model";
import { postRepository } from "@/repositories/post";
import { getZodErrorMessages } from "@/utils/get-zod-error-messages";
import { makeSlugFromText } from "@/utils/make-slug-from-text";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { v4 as uuidV4 } from "uuid";

type CreatePostActionState = {
    formState: PublicPost;
    errors: string[];
    success?: string;
};

export async function createPostAction(
    prevState: CreatePostActionState,
    formData: FormData
): Promise<CreatePostActionState> {
    const isAuthenticated = await verifyLoginSession();

    if (!(formData instanceof FormData)) {
        return {
            formState: prevState.formState,
            errors: ["Invalid data"],
        };
    }

    const formDataToObj = Object.fromEntries(formData.entries());
    const zodParsedObj = PostCreateSchema.safeParse(formDataToObj);

    if (!isAuthenticated) {
        return {
            formState: makePartialPublicPost(formDataToObj),
            errors: ["Please log in again in another tab to continue"],
        };
    }

    if (!zodParsedObj.success) {
        const errors = getZodErrorMessages(zodParsedObj.error.format());
        return {
            errors,
            formState: makePartialPublicPost(formDataToObj),
        };
    }

    const validPostData = zodParsedObj.data;
    const newPost: PostModel = {
        ...validPostData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        id: uuidV4(),
        slug: makeSlugFromText(validPostData.title),
    };

    try {
        await postRepository.create(newPost);
    } catch (e: unknown) {
        if (e instanceof Error) {
            return {
                formState: newPost,
                errors: [e.message],
            };
        }

        return {
            formState: newPost,
            errors: ["Unknown error"],
        };
    }

    revalidateTag("posts");
    redirect(`/admin/post/${newPost.id}?created=1`);
}
