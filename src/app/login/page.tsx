import ErrorMessage from "@/components/ErrorMessage";
import { LoginForm } from "@/components/admin/LoginForm";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "Post Admin",
};

export default async function AdminLoginPage() {
    const allowLogin = Boolean(Number(process.env.ALLOW_LOGIN));

    if (!allowLogin) {
        return (
            <ErrorMessage
                contentTitle="403"
                content="Release access to login using ALLOW_LOGIN"
            />
        );
    }
    return <LoginForm />;
}
