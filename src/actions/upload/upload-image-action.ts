"use server";

import { verifyLoginSession } from "@/lib/login/manage-login";
import { mkdir, writeFile } from "fs/promises";
import { extname, resolve } from "path";

type uploadImageActionResult = {
    url: string;
    error: string;
};

export async function uploadImageAction(
    formData: FormData
): Promise<uploadImageActionResult> {
    const makeResult = ({ url = "", error = "" }) => {
        return { url, error };
    };

    const isAuthenticated = await verifyLoginSession();

    if (!isAuthenticated) {
        return makeResult({ error: "Please log in again" });
    }

    if (!(formData instanceof FormData)) {
        return makeResult({
            error: "Invalid Data",
        });
    }

    const file = formData.get("file");
    if (!(file instanceof File)) {
        return makeResult({ error: "Invalid File" });
    }

    const uploadMaxSie =
        Number(process.env.NEXT_PUBLIC_IMAGE_UPLOADER_MAX_SIZE) || 921600;
    if (file.size > uploadMaxSie) {
        return makeResult({ error: "File size too large" });
    }

    if (!file.type.startsWith("image/")) {
        return makeResult({ error: "Invalid Image" });
    }

    const imageExtension = extname(file.name);
    const uniqueImageName = `${Date.now()}${imageExtension}`;

    const uploadDir = process.env.IMAGE_UPLOAD_DIRECTORY || "uploads";
    const uploadsFullPath = resolve(process.cwd(), "public", uploadDir);
    await mkdir(uploadsFullPath, { recursive: true });

    const fileArrayByffer = await file.arrayBuffer();
    const buffer = Buffer.from(fileArrayByffer);

    const fileFullPath = resolve(uploadsFullPath, uniqueImageName);

    await writeFile(fileFullPath, buffer);

    const imgServerUrl =
        process.env.IMAGE_SERVER_URL || "http://localhost:3000/uploads";
    const url = `${imgServerUrl}/${uniqueImageName}`;

    return makeResult({ url });
}
