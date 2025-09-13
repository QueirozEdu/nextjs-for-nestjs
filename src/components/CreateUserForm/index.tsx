"use client";

import { InputText } from "@/components/InputText";
import clsx from "clsx";
import { UserRoundIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "../Button";
import { createUserAction } from "@/actions/user/create-user-action";
import { PublicUserSchema } from "@/lib/user/schemas";
import { useActionState, useEffect } from "react";
import { toast } from "react-toastify";

export function CreateUserForm() {
    const [state, action, isPending] = useActionState(createUserAction, {
        user: PublicUserSchema.parse({}),
        errors: [],
        success: false,
    });

    useEffect(() => {
        toast.dismiss();
        if (state.errors.length > 0) {
            state.errors.forEach((error) => toast.error(error));
        }
    });

    return (
        <div
            className={clsx(
                "flex items-center justify-center",
                "text-center max-w-sm mt-16 mb-32 mx-auto"
            )}
        >
            <form action={action} className="flex-1 flex flex-col gap-6">
                <InputText
                    type="text"
                    name="name"
                    labelText="Name"
                    placeholder="Your name"
                    disabled={false}
                    defaultValue={state.user.name}
                    required
                />
                <InputText
                    type="email"
                    name="email"
                    labelText="E-mail"
                    placeholder="Your e-mail"
                    disabled={false}
                    defaultValue={state.user.email}
                    required
                />
                <InputText
                    type="password"
                    name="password"
                    labelText="Password"
                    placeholder="Your password"
                    disabled={false}
                    required
                />
                <InputText
                    type="password"
                    name="password2"
                    labelText="Enter your password again"
                    placeholder="Enter your password again"
                    disabled={false}
                    required
                />

                <Button disabled={false} type="submit" className="mt-4">
                    <UserRoundIcon />
                    {!isPending && "Sign in"}
                    {isPending && "Creating account..."}
                </Button>

                <p className="text-sm/tight">
                    <Link href="/login">Already registred? Log in</Link>
                </p>
            </form>
        </div>
    );
}
