import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "next-themes";

import "@/app/globals.css";

const inter = Inter({
  subsets: ["latin"], // Load only necessary characters
  variable: "--font-inter", // Optional: for CSS variable usage
  display: "swap",
});

export const metadata: Metadata = {
  title: "Itool",
  description: "Itool | An inventory management tool for managing Forklifts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider afterSignOutUrl="/">
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.variable} antialiased`}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
