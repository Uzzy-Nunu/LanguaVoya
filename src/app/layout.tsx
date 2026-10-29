import type { Metadata } from "next";
import "./globals.css";
import { brand } from "@/config/brand";

export const metadata: Metadata = {
  title: `${brand.name} — ${brand.tagline}`,
  description: "A browser-based 3D life-simulation game for learning a language through contextual conversation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-slate-900 text-ink overflow-hidden select-none">
        {children}
      </body>
    </html>
  );
}
