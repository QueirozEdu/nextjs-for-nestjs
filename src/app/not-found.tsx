import ErrorMessage from "@/components/ErrorMessage";

export default function NotFoundPage() {
    return (
        <>
            <ErrorMessage
                pageTitle="Page not found"
                contentTitle="404"
                content="The page you are looking for does not exist."
            />
        </>
    );
}
