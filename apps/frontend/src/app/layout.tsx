import type { Metadata } from "next";
import { Syne, DM_Sans } from "next/font/google";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-syne",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://krmilan-portfolio-frontend.vercel.app"),
  title: {
    default: "Milan Ray — AI & Full-Stack Engineer",
    template: "%s | Milan Ray",
  },
  description:
    "MCA graduate building production-grade AI systems. Specializing in RAG pipelines, FastAPI backends, and Next.js frontends.",
  keywords: [
    "AI Engineer",
    "Full Stack Engineer",
    "RAG",
    "FastAPI",
    "Next.js",
    "Milan Ray",
    "Machine Learning",
    "Python",
  ],
  authors: [{ name: "Milan Ray", url: "https://github.com/krmilan" }],
  creator: "Milan Ray",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://krmilan-portfolio-frontend.vercel.app",
    siteName: "Milan Ray Portfolio",
    title: "Milan Ray — AI & Full-Stack Engineer",
    description:
      "Production-grade AI systems, RAG pipelines, and modern full-stack engineering.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Milan Ray — AI Engineer Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Milan Ray — AI & Full-Stack Engineer",
    description:
      "Production-grade AI systems, RAG pipelines, and modern full-stack engineering.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${dmSans.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link
          rel="preconnect"
          href="https://krmilan-portfolio-backend.onrender.com"
        />
        <link
          rel="dns-prefetch"
          href="https://krmilan-portfolio-backend.onrender.com"
        />
      </head>
      <body className={dmSans.className}>{children}</body>
    </html>
  );
}
