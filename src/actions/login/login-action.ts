"use server";

import { createLoginSession, verifyPassword } from "@/lib/login/manage-login";
import { asyncDelay } from "@/utils/async-delay";
import { redirect } from "next/navigation";

type LoginActionState = {
    username: string;
    error: string;
};

export async function loginAction(state: LoginActionState, formData: FormData) {
    const allowLogin = Boolean(Number(process.env.ALLOW_LOGIN));

    if (!allowLogin) {
        return {
            username: "",
            error: "Login not allowed",
        };
    }
    await asyncDelay(3000);

    if (!(formData instanceof FormData)) {
        return {
            username: "",
            error: "Invalid credentials",
        };
    }

    //Data the user entered in the form
    const username = formData.get("username")?.toString().trim() || "";
    const password = formData.get("password")?.toString().trim() || "";

    if (!username || !password) {
        return {
            username,
            error: "Enter username and password",
        };
    }

    const isUsernameValid = username === process.env.LOGIN_USER;
    const isPassowrdValid = await verifyPassword(
        password,
        process.env.LOGIN_PASS || ""
    );

    if (!isUsernameValid || !isPassowrdValid) {
        return {
            username,
            error: "Invalid username or password",
        };
    }

    //From here, the username and passowrd are valid!!
    await createLoginSession(username);
    redirect("/admin/post");
}
