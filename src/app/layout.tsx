import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CustomSnap — Custom Websites for Small Businesses",
  description:
    "Get a professional, custom-built website for your small business. No templates, no DIY — real designers build it for you. Free preview in days.",
  metadataBase: new URL("https://customsnap.io"),
  openGraph: {
    title: "CustomSnap — Custom Websites for Small Businesses",
    description:
      "Get a professional, custom-built website for your small business. No templates, no DIY — real designers build it for you. Free preview in days.",
    url: "https://customsnap.io",
    siteName: "CustomSnap",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CustomSnap — Custom Websites for Small Businesses",
    description:
      "Get a professional, custom-built website for your small business. No templates, no DIY — real designers build it for you.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
