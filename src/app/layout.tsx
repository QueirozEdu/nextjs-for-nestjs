import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Container } from "@/components/Container";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ToastifyContainer } from "@/components/ToastifyContainer";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: {
        default: "The Blog - The next big blog made with Next.js",
        template: "%s | The Blog",
    },
    description: "Made with U123 ",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                <Container>
                    <Header />
                    {children}
                    <Footer />
                </Container>
                <ToastifyContainer />
            </body>
        </html>
    );
}
