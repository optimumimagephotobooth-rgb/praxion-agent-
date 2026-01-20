import "./globals.css";
import type { Metadata } from "next";
import { GradientMeshBackground, ParticleBackground } from "@/components/effects";

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
          <GradientMeshBackground className="-z-20" />
          <ParticleBackground className="-z-20" />
          <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-gradient-to-r from-purple-600/10 to-cyan-600/10 blur-3xl animate-ambient-glow [animation-duration:10s]" />
          <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-gradient-to-r from-cyan-600/10 to-purple-600/10 blur-3xl animate-ambient-glow [animation-duration:12s] [animation-delay:1s]" />
          <div className="absolute inset-0 noise-texture opacity-30" />
        </div>
        <div className="relative">{children}</div>
      </body>
    </html>
  );
}
