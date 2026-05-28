import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Milan Ray — Full-Stack & AI Engineer",
  description:
    "Full-Stack & AI Engineer building intelligent, deployable systems. Explore my projects, skills, and AI-powered portfolio assistant.",
  keywords: [
    "Milan Ray",
    "Full-Stack Engineer",
    "AI Engineer",
    "FastAPI",
    "Next.js",
    "RAG",
    "pgvector",
  ],
  authors: [{ name: "Milan Ray", url: "https://github.com/krmilan" }],
  openGraph: {
    title: "Milan Ray — Full-Stack & AI Engineer",
    description:
      "Full-Stack & AI Engineer building intelligent, deployable systems.",
    url: "https://milanray.dev",
    siteName: "Milan Ray",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Milan Ray — Full-Stack & AI Engineer",
    description:
      "Full-Stack & AI Engineer building intelligent, deployable systems.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="noise">
        {children}
      </body>
    </html>
  );
}