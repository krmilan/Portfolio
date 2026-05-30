import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Milan Ray — AI & Full-Stack Engineer",
  description: "Production-grade AI engineering portfolio. RAG systems, Next.js, FastAPI, pgvector.",
  openGraph: {
    title: "Milan Ray — AI & Full-Stack Engineer",
    description: "Production-grade AI engineering portfolio.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}