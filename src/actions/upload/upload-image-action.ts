"use server";

import { getLoginSessionForApi } from "@/lib/login/manage-login";
import { authenticatedApiRequest } from "@/utils/authenticated-api-request";

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

    const isAuthenticated = await getLoginSessionForApi();

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

    const uploadResponse = await authenticatedApiRequest<{ url: string }>(
        `/upload`,
        {
            method: "POST",
            body: formData,
        }
    );

    if (!uploadResponse.success) {
        return makeResult({ error: uploadResponse.errors[0] });
    }

    const url = `${process.env.IMAGE_SERVER_URL}${uploadResponse.data.url}`;

    return makeResult({ url });
}
