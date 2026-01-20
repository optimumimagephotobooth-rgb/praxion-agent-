import "./globals.css";
import type { Metadata } from "next";

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
          <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-gradient-to-r from-purple-600/10 to-cyan-600/10 blur-3xl animate-ambient-glow [animation-duration:10s]" />
          <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-gradient-to-r from-cyan-600/10 to-purple-600/10 blur-3xl animate-ambient-glow [animation-duration:12s] [animation-delay:1s]" />
        </div>
        <div className="relative">{children}</div>
      </body>
    </html>
  );
}
