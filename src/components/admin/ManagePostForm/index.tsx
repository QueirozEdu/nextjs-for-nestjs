"use client";

import { Button } from "@/components/Button";
import { InputCheckBox } from "@/components/InputCheckbox";
import { InputText } from "@/components/InputText";
import { MarkdownEditor } from "@/components/MarkdownEditor";
import { useActionState, useEffect, useState } from "react";
import { ImageUploader } from "../ImageUploader";
import { makePartialPublicPost, PublicPost } from "@/DTO/post/dto";
import { createPostAction } from "@/actions/post/create-post-action";
import { toast } from "react-toastify";
import { updatePostAction } from "@/actions/post/update-post-action";
import { useRouter, useSearchParams } from "next/navigation";

type ManagePostFormUpdateProps = {
    mode: "update";
    publicPost?: PublicPost;
};

type ManagePostFormCreateProps = {
    mode: "create";
};
type ManagePostFormProps =
    | ManagePostFormUpdateProps
    | ManagePostFormCreateProps;

export function ManagePostForm(props: ManagePostFormProps) {
    const { mode } = props;
    const searchParams = useSearchParams();
    const created = searchParams.get("created");
    const router = useRouter();

    let publicPost;
    if (mode === "update") {
        publicPost = props.publicPost;
    }

    const actionsMap = {
        update: updatePostAction,
        create: createPostAction,
    };

    const initialState = {
        formState: makePartialPublicPost(publicPost),
        errors: [],
    };
    const [state, action, isPending] = useActionState(
        actionsMap[mode],
        initialState
    );

    useEffect(() => {
        if (state.errors.length > 0) {
            toast.dismiss();
            state.errors.forEach((error) => toast.error(error));
        }
    }, [state.errors]);

    useEffect(() => {
        if (state.success) {
            toast.dismiss();
            toast.success("Post updated!");
        }
    }, [state.success]);

    useEffect(() => {
        if (created === "1") {
            toast.dismiss();
            toast.success("Post created!");
            const url = new URL(window.location.href);
            url.searchParams.delete("created");
            router.replace(url.toString());
        }
    }, [created, router]);

    const { formState } = state;
    const [contentValue, setContentValue] = useState(publicPost?.content || "");
    return (
        <form action={action} className="mb-16">
            <div className="flex flex-col gap-6">
                <InputText
                    labelText="ID"
                    name="id"
                    placeholder="ID generated automatically"
                    type="text"
                    defaultValue={formState.id}
                    disabled={isPending}
                    readOnly
                />
                <InputText
                    labelText="Slug"
                    name="slug"
                    placeholder="Slug generated automatically"
                    type="text"
                    defaultValue={formState.slug}
                    disabled={isPending}
                    readOnly
                />
                <InputText
                    labelText="Author"
                    name="author"
                    placeholder="Enter the author's name"
                    type="text"
                    defaultValue={formState.author}
                    disabled={isPending}
                />
                <InputText
                    labelText="Title"
                    name="title"
                    placeholder="Your post title"
                    type="text"
                    defaultValue={formState.title}
                    disabled={isPending}
                />
                <InputText
                    labelText="Excerpt"
                    name="excerpt"
                    placeholder="Enter excerpt"
                    type="text"
                    defaultValue={formState.excerpt}
                    disabled={isPending}
                />
                <MarkdownEditor
                    labelText="Content"
                    value={contentValue}
                    setValue={setContentValue}
                    textAreaName="content"
                    disabled={isPending}
                />

                <ImageUploader disabled={isPending} />

                <InputText
                    labelText="Cover image URL"
                    name="coverImageUrl"
                    placeholder="Enter the image URL"
                    type="text"
                    defaultValue={formState.coverImageUrl}
                    disabled={isPending}
                />

                <InputCheckBox
                    labelText="Publish?"
                    name="published"
                    type="checkbox"
                    defaultChecked={formState.published}
                    disabled={isPending}
                />

                <div className="mt-4">
                    <Button type="submit">Send</Button>
                </div>
            </div>
        </form>
    );
}
