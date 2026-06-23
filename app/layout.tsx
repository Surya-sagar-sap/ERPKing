import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://erp-king.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "SAPKing — Learn SAP From Zero",
    template: "%s | SAPKing",
  },
  description:
    "The easiest way to learn SAP. Visual flowcharts, real business stories, and hands-on practice. No prior experience needed.",
  keywords: ["SAP learning", "SAP tutorial", "SAP FICO", "SAP MM", "SAP SD", "SAP beginner", "ERP training"],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "SAPKing",
    title: "SAPKing — Learn SAP From Zero",
    description: "The easiest way to learn SAP. Visual flowcharts, real business stories, and hands-on practice.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
