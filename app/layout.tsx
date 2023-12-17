import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import NextUIProviderLayout from "@/components/layout/Provider";

const inter = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "H&H - Passwords",
  description:
    "The best solution to store your passwords based on your preferences",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning={true}
        className={
          inter.className + " dark w-full h-full min-h-screen bg-black"
        }
      >
        <NextUIProviderLayout>{children}</NextUIProviderLayout>
      </body>
    </html>
  );
}
