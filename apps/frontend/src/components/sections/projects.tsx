"use client";

import { useEffect, useState } from "react";
import { getProjects, type Project } from "@/lib/content";

const FALLBACK: Project[] = [
  { id: "1", title: "AI Portfolio Platform", description: "Production-grade portfolio with a RAG-powered AI assistant. Answers questions about projects, architecture, and code using pgvector semantic search.", tags: ["Next.js", "FastAPI", "RAG", "pgvector", "Supabase"], accent_color: "#9d8ff0", github_url: "https://github.com/krmilan", live_url: "", display_order: 1, visible: true },
  { id: "2", title: "RAG Pipeline Engine", description: "Modular retrieval-augmented generation pipeline with semantic search, embedding generation, and streaming responses via Gemini and Groq APIs.", tags: ["Python", "Gemini", "Groq", "pgvector", "SSE"], accent_color: "#00d4ff", github_url: "https://github.com/krmilan", live_url: "", display_order: 2, visible: true },
  { id: "3", title: "Full-Stack API Boilerplate", description: "Production-ready monorepo combining Next.js and FastAPI with Docker, GitHub Actions CI/CD, Supabase, shared TypeScript types, and E2E testing.", tags: ["Next.js", "FastAPI", "Docker", "GitHub Actions", "Pytest"], accent_color: "#00ffaa", github_url: "https://github.com/krmilan", live_url: "", display_order: 3, visible: true },
];

// Tag → skill name mapping for cross-component highlight synergy
const TAG_TO_SKILL: Record<string, string[]> = {
  "Next.js":        ["Next.js"],
  "FastAPI":        ["FastAPI"],
  "RAG":            ["RAG Pipelines"],
  "pgvector":       ["pgvector", "Vector Search"],
  "Supabase":       ["Supabase"],
  "Python":         ["Python"],
  "Gemini":         ["Gemini API"],
  "Groq":           ["Groq / Llama"],
  "SSE":            ["REST / SSE"],
  "Docker":         ["Docker"],
  "GitHub Actions": ["GitHub Actions"],
  "TypeScript":     ["TypeScript"],
  "PostgreSQL":     ["PostgreSQL"],
};

function getSkillsForTags(tags: string[]): string[] {
  return [...new Set(tags.flatMap(t => TAG_TO_SKILL[t] ?? []))];
}

export default function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>(FALLBACK);

  useEffect(() => {
    getProjects().then(data => { if (data.length > 0) setProjects(data); });
  }, []);

  function handleCardEnter(tags: string[]) {
    const skills = getSkillsForTags(tags);
    window.dispatchEvent(new CustomEvent("skill-highlight", { detail: { skills } }));
  }

  function handleCardLeave() {
    window.dispatchEvent(new CustomEvent("skill-highlight", { detail: { skills: [] } }));
  }

  return (
    <section id="projects" className="section-pad">
      <div style={{ maxWidth: 1152, margin: "0 auto", position: "relative", zIndex: 1 }}>

        {/* Header */}
        <div className="projects-header">
          <div>
            <p style={{ fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", color: "#00d4ff", marginBottom: 16, fontWeight: 600 }}>
              Work
            </p>
            <h2 className="font-display" style={{ fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 900, color: "white" }}>
              Featured{" "}
              <span style={{ background: "linear-gradient(135deg, #9d8ff0, #00d4ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Projects
              </span>
            </h2>
          </div>
          <a
            href="https://github.com/krmilan"
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: 14, color: "#94a3b8", textDecoration: "none", display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap", transition: "color 0.2s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "white"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#94a3b8"; }}
          >
            View all on GitHub →
          </a>
        </div>

        {/* Grid */}
        <div className="projects-grid">
          {projects.map(p => (
            <ProjectCard
              key={p.id}
              project={p}
              onEnter={() => handleCardEnter(p.tags)}
              onLeave={handleCardLeave}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Project Card ─────────────────────────────────────────────────────────────

function ProjectCard({
  project: p,
  onEnter,
  onLeave,
}: {
  project: Project;
  onEnter: () => void;
  onLeave: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="glass"
      onMouseEnter={() => { setHovered(true); onEnter(); }}
      onMouseLeave={() => { setHovered(false); onLeave(); }}
      style={{
        borderRadius: 20,
        padding: 28,
        position: "relative",
        overflow: "hidden",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        boxShadow: hovered ? `0 24px 60px ${p.accent_color}22` : "none",
        cursor: "default",
      }}
    >
      {/* Top accent line — animates width on hover */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        height: 1,
        width: hovered ? "100%" : "60%",
        background: `linear-gradient(90deg, transparent, ${p.accent_color}77, transparent)`,
        transition: "width 0.5s ease",
      }} />

      {/* Card header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22 }}>
        <div style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: `${p.accent_color}15`,
          border: `1px solid ${p.accent_color}${hovered ? "55" : "30"}`,
          color: p.accent_color,
          fontSize: 18,
          fontWeight: 700,
          transition: "border-color 0.3s",
        }}>
          ◈
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", gap: 8 }}>
          {p.github_url && (
            <ActionButton
              href={p.github_url}
              title="View Source"
              accentColor={p.accent_color}
              variant="ghost"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
              </svg>
            </ActionButton>
          )}
          {p.live_url && (
            <ActionButton
              href={p.live_url}
              title="Live Demo"
              accentColor={p.accent_color}
              variant="accent"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/>
                <line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
            </ActionButton>
          )}
        </div>
      </div>

      {/* Title + description */}
      <h3 className="font-display" style={{ fontSize: 19, fontWeight: 700, color: "white", marginBottom: 10 }}>
        {p.title}
      </h3>
      <p style={{ fontSize: 14, color: "#94a3b8", lineHeight: 1.7, marginBottom: 22 }}>
        {p.description}
      </p>

      {/* Tags */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {p.tags.map(tag => (
          <span
            key={tag}
            style={{
              fontSize: 11,
              padding: "4px 10px",
              borderRadius: 6,
              fontWeight: 600,
              background: `${p.accent_color}12`,
              color: p.accent_color,
              border: `1px solid ${p.accent_color}25`,
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Live badge */}
      {p.live_url && (
        <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#00ffaa", boxShadow: "0 0 6px #00ffaa", animation: "glow-pulse 2s ease-in-out infinite" }} />
          <span style={{ fontSize: 11, color: "#00ffaa", fontWeight: 600 }}>Live Demo Available</span>
        </div>
      )}
    </div>
  );
}

// ─── Action Button ────────────────────────────────────────────────────────────

function ActionButton({
  href,
  title,
  accentColor,
  variant,
  children,
}: {
  href: string;
  title: string;
  accentColor: string;
  variant: "ghost" | "accent";
  children: React.ReactNode;
}) {
  const [hovered, setHovered] = useState(false);
  const isAccent = variant === "accent";

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={title}
      aria-label={title}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 32,
        height: 32,
        borderRadius: 8,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textDecoration: "none",
        transition: "all 0.2s",
        background: isAccent
          ? hovered ? `${accentColor}25` : `${accentColor}15`
          : hovered ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.04)",
        border: isAccent
          ? `1px solid ${accentColor}${hovered ? "55" : "30"}`
          : `1px solid rgba(255,255,255,${hovered ? "0.20" : "0.08"})`,
        color: isAccent ? accentColor : hovered ? "white" : "#64748b",
      }}
    >
      {children}
    </a>
  );
}
