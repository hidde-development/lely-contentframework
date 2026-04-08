import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GEO & SEO Tekstgenerator",
  description: "Genereer geoptimaliseerde teksten voor zoekmachines en AI",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl" className="h-full">
      <body className={`${inter.className} h-full bg-gray-100`}>{children}</body>
    </html>
  );
}
