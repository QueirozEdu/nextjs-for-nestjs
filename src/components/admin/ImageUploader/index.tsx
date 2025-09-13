"use client";

import { uploadImageAction } from "@/actions/upload/upload-image-action";
import { Button } from "@/components/Button";
import { ImageUpIcon } from "lucide-react";
import { useRef, useState, useTransition } from "react";
import { toast } from "react-toastify";

type ImageUploaderProps = {
    disabled?: boolean;
};

export function ImageUploader({ disabled = false }: ImageUploaderProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, startTransition] = useTransition();
    const [imgUrl, setImgUrl] = useState("");

    function handleChooseFile() {
        if (!fileInputRef.current) return;

        fileInputRef.current.click();
    }

    function handleChange() {
        toast.dismiss();

        if (!fileInputRef.current) {
            setImgUrl(" ");
            return;
        }

        const fileInput = fileInputRef.current;
        const file = fileInput?.files?.[0];

        if (!file) {
            setImgUrl(" ");
            return;
        }

        const uploadMaxSie =
            Number(process.env.NEXT_PUBLIC_IMAGE_UPLOADER_MAX_SIZE) || 921600;

        if (file.size > uploadMaxSie) {
            const readableMaxSize = (uploadMaxSie / 1024).toFixed(2);
            toast.error(
                `Image size too large. Max size is: ${readableMaxSize}KB`
            );
            fileInput.value = "";
            setImgUrl(" ");
            return;
        }
        const formData = new FormData();
        formData.append("file", file);

        //TODO create action to upload file
        startTransition(async () => {
            const result = await uploadImageAction(formData);

            if (result.error) {
                toast.error(result.error);
                fileInput.value = "";
                setImgUrl(" ");
                return;
            }
            setImgUrl(result.url);
            toast.success("Image sent!");
        });

        fileInput.value = "";
    }

    return (
        <div className="flex flex-col gap-4 py-4">
            <Button
                onClick={handleChooseFile}
                type="button"
                className="self-start"
                disabled={isUploading || disabled}
            >
                <ImageUpIcon />
                Send an image
            </Button>
            {!!imgUrl && (
                <div className="flex flex-col gap-4">
                    <p>
                        <b>URL:</b> {imgUrl}
                    </p>

                    {/* eslint-disable-next-line */}
                    <img className="rounded-lg" src={imgUrl} alt="" />
                </div>
            )}
            <input
                onChange={handleChange}
                ref={fileInputRef}
                className="hidden"
                name="file"
                type="file"
                accept="image/*"
                disabled={isUploading || disabled}
            />
        </div>
    );
}
