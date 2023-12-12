import "@/styles/globals.css";

import { NextThemeProvider } from "@/components/theme-provider";
import { Theme, ThemePanel } from "@radix-ui/themes";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Livestream with LiveKit",
  description: "A sample full-stack application built with LiveKit",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <NextThemeProvider>
          <Theme accentColor="purple" grayColor="mauve">
            {children}
            <ThemePanel defaultOpen={false} />
          </Theme>
        </NextThemeProvider>
      </body>
    </html>
  );
}
