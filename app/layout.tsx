import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GEO & SEO Text Generator",
  description: "Generate optimised content for search engines and AI",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className="h-full">
      <body className={`${inter.className} h-full bg-gray-100`}>{children}</body>
    </html>
  );
}
