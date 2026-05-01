import type { Metadata } from "next";
import { Nunito } from "next/font/google";

import { ClerkProvider } from "@clerk/nextjs";

import { ExitModal } from "@/components/modals/exit-modal";
import { HeartsModal } from "@/components/modals/hearts-modal";
import { PracticeModal } from "@/components/modals/practice-modal";
import { Toaster } from "@/components/ui/sonner";

import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Lingo",
  description: "Language Learning App",
};

/**
 * The root layout that wraps the entire Next.js application.
 * Server Component
 *
 * @param props - An object containing the child pages/layouts to render.
 * @param props.children - The application's child components.
 * @returns The HTML skeleton, font definitions, authentication provider, global modals, and toast notifications.
 *
 * @example
 * ```tsx
 * <RootLayout>
 *   <App />
 * </RootLayout>
 * ```
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={`${nunito.variable} h-full antialiased`} lang="en">
      <body className="flex flex-col min-h-full font-sans">
        <ClerkProvider>
          <Toaster />
          <ExitModal />
          <HeartsModal />
          <PracticeModal />
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
