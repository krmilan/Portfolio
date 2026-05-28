"use client";

import { useEffect, useRef, useState } from "react";

const PROJECTS = [
  {
    id: 1,
    title: "AI Portfolio Platform",
    description:
      "A production-grade portfolio platform with a RAG-powered AI assistant that can answer questions about projects, architecture, and code. Built with Next.js, FastAPI, and pgvector.",
    tags: ["Next.js", "FastAPI", "RAG", "pgvector", "Supabase"],
    github: "https://github.com/krmilan",
    demo: null,
    featured: true,
    gradient: "from-[#7c6af7] to-[#4fc4cf]",
    accent: "#7c6af7",
  },
  {
    id: 2,
    title: "RAG Pipeline Engine",
    description:
      "A modular retrieval-augmented generation pipeline with semantic search, embedding generation, and streaming responses powered by Gemini and Groq APIs.",
    tags: ["Python", "Gemini", "Groq", "pgvector", "SSE"],
    github: "https://github.com/krmilan",
    demo: null,
    featured: false,
    accent: "#4fc4cf",
  },
  {
    id: 3,
    title: "Full-Stack API Boilerplate",
    description:
      "A production-ready monorepo boilerplate combining Next.js and FastAPI with Docker, GitHub Actions CI/CD, Supabase, shared TypeScript types, and end-to-end testing.",
    tags: ["Next.js", "FastAPI", "Docker", "GitHub Actions", "Pytest"],
    github: "https://github.com/krmilan",
    demo: null,
    featured: false,
    accent: "#a78bfa",
  },
];

function ProjectCard({
  project,
  index,
  visible,
}: {
  project: (typeof PROJECTS)[0];
  index: number;
  visible: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "var(--surface)",
        border: `1px solid ${hovered ? "rgba(255,255,255,0.12)" : "var(--border)"}`,
        borderRadius: "20px",
        padding: "32px",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: `all 0.6s ease ${index * 0.12}s`,
        cursor: "default",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      {/* top accent line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "1px",
          background: `linear-gradient(90deg, transparent, ${project.accent}88, transparent)`,
          opacity: hovered ? 1 : 0.4,
          transition: "opacity 0.3s ease",
        }}
      />

      {/* glow on hover */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 50% 0%, ${project.accent}08, transparent 60%)`,
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.4s ease",
          pointerEvents: "none",
        }}
      />

      {/* header row */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "12px",
        }}
      >
        {/* icon box */}
        <div
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "12px",
            background: `${project.accent}15`,
            border: `1px solid ${project.accent}30`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke={project.accent}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
        </div>

        {/* external links */}
        <div style={{ display: "flex", gap: "8px" }}>
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid var(--border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--text-muted)",
                textDecoration: "none",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--text-primary)";
                e.currentTarget.style.borderColor = "var(--border-hover)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--text-muted)";
                e.currentTarget.style.borderColor = "var(--border)";
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
          )}
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--text-muted)",
              textDecoration: "none",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--text-primary)";
              e.currentTarget.style.borderColor = "var(--border-hover)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--text-muted)";
              e.currentTarget.style.borderColor = "var(--border)";
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
          </a>
        </div>
      </div>

      {/* title */}
      <h3
        style={{
          fontSize: "20px",
          fontWeight: 700,
          letterSpacing: "-0.02em",
          color: "var(--text-primary)",
          fontFamily: "var(--font-display)",
        }}
      >
        {project.title}
      </h3>

      {/* description */}
      <p
        style={{
          fontSize: "14px",
          color: "var(--text-secondary)",
          lineHeight: 1.75,
          flexGrow: 1,
        }}
      >
        {project.description}
      </p>

      {/* tags */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
        {project.tags.map((tag) => (
          <span
            key={tag}
            style={{
              fontSize: "11px",
              fontWeight: 500,
              padding: "4px 10px",
              borderRadius: "100px",
              background: `${project.accent}10`,
              border: `1px solid ${project.accent}25`,
              color: project.accent,
              letterSpacing: "0.02em",
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Projects() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="projects"
      ref={ref}
      style={{
        padding: "100px 24px",
        position: "relative",
        zIndex: 1,
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        {/* heading */}
        <div style={{ marginBottom: "60px" }}>
          <p
            style={{
              fontSize: "12px",
              color: "var(--accent)",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              fontWeight: 500,
              marginBottom: "12px",
              opacity: visible ? 1 : 0,
              transition: "all 0.6s ease",
            }}
          >
            Work
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            <h2
              style={{
                fontSize: "clamp(32px, 5vw, 52px)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(16px)",
                transition: "all 0.6s ease 0.1s",
              }}
            >
              Featured{" "}
              <span className="text-gradient">Projects</span>
            </h2>
            <a
              href="https://github.com/krmilan"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: "13px",
                color: "var(--text-muted)",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                opacity: visible ? 1 : 0,
                transition: "all 0.6s ease 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--accent)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--text-muted)")
              }
            >
              View all on GitHub
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </a>
          </div>
        </div>

        {/* cards grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "20px",
          }}
        >
          {PROJECTS.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={i}
              visible={visible}
            />
          ))}
        </div>
      </div>
    </section>
  );
}