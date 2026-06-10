"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { getProjects, type Project } from "@/lib/content";

const FALLBACK: Project[] = [
  { id: "1", title: "AI Portfolio Platform", description: "Production-grade portfolio with a RAG-powered AI assistant. Answers questions about projects, architecture, and code using pgvector semantic search.", tags: ["Next.js", "FastAPI", "RAG", "pgvector", "Supabase"], accent_color: "#9d8ff0", github_url: "https://github.com/krmilan", live_url: "https://krmilan-portfolio-frontend.vercel.app", display_order: 1, visible: true },
  { id: "2", title: "RAG Pipeline Engine", description: "Modular retrieval-augmented generation pipeline with semantic search, embedding generation, and streaming responses via Gemini and Groq APIs.", tags: ["Python", "Gemini", "Groq", "pgvector", "SSE"], accent_color: "#00d4ff", github_url: "https://github.com/krmilan", live_url: "", display_order: 2, visible: true },
  { id: "3", title: "Full-Stack API Boilerplate", description: "Production-ready monorepo combining Next.js and FastAPI with Docker, GitHub Actions CI/CD, Supabase, shared TypeScript types, and E2E testing.", tags: ["Next.js", "FastAPI", "Docker", "GitHub Actions", "Pytest"], accent_color: "#00ffaa", github_url: "https://github.com/krmilan", live_url: "", display_order: 3, visible: true },
];

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
    window.dispatchEvent(new CustomEvent("skill-highlight", { detail: { skills: getSkillsForTags(tags) } }));
  }
  function handleCardLeave() {
    window.dispatchEvent(new CustomEvent("skill-highlight", { detail: { skills: [] } }));
  }

  return (
    <section id="projects" data-snap className="section-pad">
      <div style={{ maxWidth: 1152, margin: "0 auto", position: "relative", zIndex: 1, width: "100%" }}>

        {/* Header */}
        <div className="projects-header">
          <div>
            <p style={{ fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", color: "#00d4ff", marginBottom: 16, fontWeight: 600 }}>
              Work
            </p>
            <h2 className="font-display" style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 900, color: "white" }}>
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

        <SmoothCarousel projects={projects} onEnter={handleCardEnter} onLeave={handleCardLeave} />
      </div>
    </section>
  );
}

// ─── Smooth Carousel ──────────────────────────────────────────────────────────
// Desktop: 3 cards visible, slides 1 at a time.
// Tablet:  2 cards visible.
// Mobile:  1 card visible, full width.
// Pure CSS scroll-snap — no JS width measurement, SSR safe, buttery smooth.

function SmoothCarousel({
  projects,
  onEnter,
  onLeave,
}: {
  projects: Project[];
  onEnter: (tags: string[]) => void;
  onLeave: () => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const total = projects.length;

  // Observe scroll position to update dots / arrows
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const onScroll = () => {
      const { scrollLeft, scrollWidth, clientWidth } = track;
      const cardW = clientWidth / getVisibleCount();
      const idx = Math.round(scrollLeft / cardW);
      setActiveIndex(Math.min(idx, total - 1));
      setCanPrev(scrollLeft > 4);
      setCanNext(scrollLeft < scrollWidth - clientWidth - 4);
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => track.removeEventListener("scroll", onScroll);
  }, [total]);

  function getVisibleCount() {
    if (!trackRef.current) return 3;
    const w = trackRef.current.clientWidth;
    if (w < 600) return 1;
    if (w < 900) return 2;
    return 3;
  }

  const scrollTo = useCallback((idx: number) => {
    const track = trackRef.current;
    if (!track) return;
    const cardW = track.clientWidth / getVisibleCount();
    track.scrollTo({ left: idx * cardW, behavior: "smooth" });
  }, []);

  const prev = () => scrollTo(Math.max(0, activeIndex - 1));
  const next = () => scrollTo(Math.min(total - 1, activeIndex + 1));

  return (
    <div>
      {/* Track */}
      <div
        ref={trackRef}
        style={{
          display: "grid",
          // CSS grid + auto-fill so cards are exactly 1/3 wide on desktop etc.
          gridAutoFlow: "column",
          gridAutoColumns: "calc((100% - 48px) / 3)",   // 3-up desktop default
          gap: 24,
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          scrollBehavior: "smooth",
          // Hide scrollbar cross-browser
          msOverflowStyle: "none",
          scrollbarWidth: "none",
          paddingBottom: 4,  // tiny buffer so box-shadows don't clip
        }}
        className="hide-scrollbar"
      >
        {projects.map(p => (
          <div
            key={p.id}
            style={{ scrollSnapAlign: "start", minWidth: 0 }}
          >
            <ProjectCard
              project={p}
              onEnter={() => onEnter(p.tags)}
              onLeave={onLeave}
            />
          </div>
        ))}
      </div>

      {/* Controls: prev · dots · next */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, marginTop: 28 }}>
        <NavArrow dir="left"  disabled={!canPrev} accent={projects[activeIndex]?.accent_color ?? "#9d8ff0"} onClick={prev} />

        {/* Dots = scroll positions, not total projects.
             3-up: pages = total-2, 2-up: total-1, 1-up: total */}
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {Array.from({ length: Math.max(1, total - (getVisibleCount() - 1)) }).map((_, i) => {
            const accent = projects[i]?.accent_color ?? "#9d8ff0";
            const isActive = i === Math.min(activeIndex, total - getVisibleCount());
            return (
              <button
                key={i}
                onClick={() => scrollTo(i)}
                aria-label={`Go to project ${i + 1}`}
                style={{
                  width: isActive ? 28 : 8,
                  height: 8,
                  borderRadius: 4,
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  background: isActive ? (projects[activeIndex]?.accent_color ?? "#9d8ff0") : "rgba(255,255,255,0.12)",
                  boxShadow: isActive ? `0 0 8px ${projects[activeIndex]?.accent_color ?? "#9d8ff0"}88` : "none",
                  transition: "width 0.35s ease, background 0.35s ease, box-shadow 0.35s ease",
                }}
              />
            );
          })}
        </div>

        <NavArrow dir="right" disabled={!canNext} accent={projects[activeIndex]?.accent_color ?? "#9d8ff0"} onClick={next} />
      </div>

      {/* Responsive grid columns via a style tag — Tailwind v4 inline isn't reliable here */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        @media (max-width: 899px) and (min-width: 600px) {
          #projects .hide-scrollbar { grid-auto-columns: calc((100% - 24px) / 2) !important; }
        }
        @media (max-width: 599px) {
          #projects .hide-scrollbar { grid-auto-columns: 100% !important; }
        }
      `}</style>
    </div>
  );
}

function NavArrow({ dir, disabled, accent, onClick }: {
  dir: "left" | "right"; disabled: boolean; accent: string; onClick: () => void;
}) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === "left" ? "Previous" : "Next"}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: 36, height: 36, borderRadius: 10, padding: 0,
        border: `1px solid ${hov && !disabled ? accent + "44" : "rgba(255,255,255,0.09)"}`,
        background: hov && !disabled ? `${accent}12` : "rgba(255,255,255,0.03)",
        color: disabled ? "#2d3748" : hov ? accent : "#64748b",
        cursor: disabled ? "default" : "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "all 0.2s",
      }}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        {dir === "left" ? <polyline points="15 18 9 12 15 6" /> : <polyline points="9 18 15 12 9 6" />}
      </svg>
    </button>
  );
}

// ─── Project Card — unchanged from original ───────────────────────────────────

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
        height: "100%",
        boxSizing: "border-box",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        boxShadow: hovered ? `0 24px 60px ${p.accent_color}22` : "none",
        cursor: "default",
      }}
    >
      {/* Top accent line */}
      <div style={{
        position: "absolute", top: 0, left: 0, height: 1,
        width: hovered ? "100%" : "60%",
        background: `linear-gradient(90deg, transparent, ${p.accent_color}77, transparent)`,
        transition: "width 0.5s ease",
      }} />

      {/* Card header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: `${p.accent_color}15`,
          border: `1px solid ${p.accent_color}${hovered ? "55" : "30"}`,
          color: p.accent_color, fontSize: 18, fontWeight: 700,
          transition: "border-color 0.3s",
        }}>
          ◈
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {p.github_url && (
            <ActionButton href={p.github_url} title="View Source" accentColor={p.accent_color} variant="ghost">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
              </svg>
            </ActionButton>
          )}
          {p.live_url && (
            <ActionButton href={p.live_url} title="Live Demo" accentColor={p.accent_color} variant="accent">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/>
                <line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
            </ActionButton>
          )}
        </div>
      </div>

      <h3 className="font-display" style={{ fontSize: 19, fontWeight: 700, color: "white", marginBottom: 10 }}>
        {p.title}
      </h3>
      <p style={{ fontSize: 14, color: "#94a3b8", lineHeight: 1.7, marginBottom: 22 }}>
        {p.description}
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {p.tags.map(tag => (
          <span key={tag} style={{
            fontSize: 11, padding: "4px 10px", borderRadius: 6, fontWeight: 600,
            background: `${p.accent_color}12`, color: p.accent_color, border: `1px solid ${p.accent_color}25`,
          }}>
            {tag}
          </span>
        ))}
      </div>

      {p.live_url && (
        <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#00ffaa", boxShadow: "0 0 6px #00ffaa", animation: "glow-pulse 2s ease-in-out infinite" }} />
          <span style={{ fontSize: 11, color: "#00ffaa", fontWeight: 600 }}>Live Demo Available</span>
        </div>
      )}
    </div>
  );
}

// ─── Action Button — unchanged from original ──────────────────────────────────

function ActionButton({
  href, title, accentColor, variant, children,
}: {
  href: string; title: string; accentColor: string; variant: "ghost" | "accent"; children: React.ReactNode;
}) {
  const [hovered, setHovered] = useState(false);
  const isAccent = variant === "accent";
  return (
    <a
      href={href} target="_blank" rel="noopener noreferrer" title={title} aria-label={title}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        width: 32, height: 32, borderRadius: 8,
        display: "flex", alignItems: "center", justifyContent: "center",
        textDecoration: "none", transition: "all 0.2s",
        background: isAccent ? (hovered ? `${accentColor}25` : `${accentColor}15`) : (hovered ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.04)"),
        border: isAccent ? `1px solid ${accentColor}${hovered ? "55" : "30"}` : `1px solid rgba(255,255,255,${hovered ? "0.20" : "0.08"})`,
        color: isAccent ? accentColor : hovered ? "white" : "#64748b",
      }}
    >
      {children}
    </a>
  );
}
