import "./globals.css";
import type { Metadata } from "next";
import { OptimizedLighting } from "@/components/ambient-lighting";

export const metadata: Metadata = {
  title: "Customer Dashboard",
  description: "Figma to Next.js conversion"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <OptimizedLighting />
          <div className="absolute inset-0 noise-texture opacity-30" />
        </div>
        <div className="relative">{children}</div>
      </body>
    </html>
  );
}
