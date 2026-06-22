import type { Metadata, Viewport } from "next";
import { PaperTexture } from "@/components/layout/PaperTexture";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const viewport: Viewport = {
  themeColor: "#e8e4dc",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen font-sans">
        <PaperTexture />
        {children}
      </body>
    </html>
  );
}
