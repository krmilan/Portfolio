"use client";

import { useEffect, useState } from "react";

// ─── Data ────────────────────────────────────────────────────────────────────

const CATEGORIES = [
  {
    id: "frontend",
    label: "Frontend",
    color: "#818cf8",
    glow: "rgba(129,140,248,0.18)",
    skills: [
      { name: "Next.js",        icon: "https://cdn.simpleicons.org/nextdotjs/ffffff" },
      { name: "TypeScript",     icon: "https://cdn.simpleicons.org/typescript/3178c6" },
      { name: "React",          icon: "https://cdn.simpleicons.org/react/61dafb" },
      { name: "Tailwind CSS",   icon: "https://cdn.simpleicons.org/tailwindcss/38bdf8" },
      { name: "Shadcn/UI",      icon: "https://cdn.simpleicons.org/shadcnui/ffffff" },
      { name: "Framer Motion",  icon: "https://cdn.simpleicons.org/framer/ffffff" },
      { name: "Zustand",        icon: "https://cdn.simpleicons.org/react/61dafb" },
      { name: "TanStack Query", icon: "https://cdn.simpleicons.org/reactquery/ff4154" },
    ],
  },
  {
    id: "backend",
    label: "Backend",
    color: "#34d399",
    glow: "rgba(52,211,153,0.18)",
    skills: [
      { name: "FastAPI",    icon: "https://cdn.simpleicons.org/fastapi/009688" },
      { name: "Python",     icon: "https://cdn.simpleicons.org/python/3776ab" },
      { name: "Pydantic",   icon: "https://cdn.simpleicons.org/pydantic/e92063" },
      { name: "PostgreSQL", icon: "https://cdn.simpleicons.org/postgresql/336791" },
      { name: "REST / SSE", icon: "https://cdn.simpleicons.org/fastapi/009688" },
      { name: "Node.js",    icon: "https://cdn.simpleicons.org/nodedotjs/339933" },
    ],
  },
  {
    id: "ai",
    label: "AI & RAG",
    color: "#f472b6",
    glow: "rgba(244,114,182,0.18)",
    skills: [
      { name: "RAG Pipelines", icon: "https://cdn.simpleicons.org/googlegemini/8e75b2" },
      { name: "pgvector",      icon: "https://cdn.simpleicons.org/postgresql/336791" },
      { name: "Gemini API",    icon: "https://cdn.simpleicons.org/googlegemini/8e75b2" },
      { name: "Groq / Llama",  icon: "https://cdn.simpleicons.org/ollama/ffffff" },
      { name: "Embeddings",    icon: "https://cdn.simpleicons.org/huggingface/ffd21e" },
      { name: "Vector Search", icon: "https://cdn.simpleicons.org/elastic/005571" },
      { name: "LangChain",     icon: "https://cdn.simpleicons.org/langchain/ffffff" },
    ],
  },
  {
    id: "devops",
    label: "DevOps & Cloud",
    color: "#fb923c",
    glow: "rgba(251,146,60,0.18)",
    skills: [
      { name: "Docker",         icon: "https://cdn.simpleicons.org/docker/2496ed" },
      { name: "GitHub Actions", icon: "https://cdn.simpleicons.org/githubactions/2088ff" },
      { name: "Supabase",       icon: "https://cdn.simpleicons.org/supabase/3ecf8e" },
      { name: "Vercel",         icon: "https://cdn.simpleicons.org/vercel/ffffff" },
      { name: "Render",         icon: "https://cdn.simpleicons.org/render/46e3b7" },
      { name: "Git",            icon: "https://cdn.simpleicons.org/git/f05032" },
      { name: "GitHub",         icon: "https://cdn.simpleicons.org/github/ffffff" },
    ],
  },
];

const ALL_SKILLS = CATEGORIES.flatMap((c) => c.skills);

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Skills() {

   const [highlightedSkills, setHighlightedSkills] = useState<string[]>([]);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ skills: string[] }>).detail;
      setHighlightedSkills(detail.skills ?? []);
    };
    window.addEventListener("skill-highlight", handler);
    return () => window.removeEventListener("skill-highlight", handler);
  }, []);

  return (
    <section
      id="skills"
      data-snap
      aria-label="Skills and Tech Stack"
      className="section-pad"
      style={{ position: "relative", overflow: "hidden" }}
    >
      {/* Orb glow — matches bg-orbs aesthetic */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        <div
          style={{
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(99,102,241,0.09) 0%, rgba(139,92,246,0.04) 45%, transparent 70%)",
          }}
        />
      </div>

      {/* Container — exactly matches hero: maxWidth 1152, margin auto */}
      <div style={{ maxWidth: 1152, margin: "0 auto", width: "100%", position: "relative", zIndex: 1 }}>

        <p style={{ fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", color: "#00d4ff", marginBottom: 16, fontWeight: 600 }}>
          Skill
        </p>
        {/* Heading — same pattern as other sections */}
        <h2 style={{
          fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
          fontWeight: 800,
          letterSpacing: "-0.02em",
          color: "#f8fafc",
          marginBottom: 8,
          lineHeight: 1.1,
          fontFamily: "Syne, sans-serif",
        }}>
          Skills &amp;{" "}
          <span style={{
            background: "linear-gradient(135deg, #22d3ee, #818cf8)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            Tech Stack
          </span>
        </h2>

        <p style={{
          fontFamily: "monospace",
          fontSize: 12,
          color: "#475569",
          marginBottom: 36,
        }}>
          tools and technologies I build with
        </p>

        {/* Category groups */}
        <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
          {CATEGORIES.map((cat) => (
            <div key={cat.id}>
              {/* Category header */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <span
                  aria-hidden="true"
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: cat.color,
                    flexShrink: 0,
                    boxShadow: `0 0 6px ${cat.color}88`,
                  }}
                />
                <span style={{
                  fontFamily: "monospace",
                  fontSize: 10,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase" as const,
                  color: "#64748b",
                }}>
                  {cat.label}
                </span>
                <div
                  aria-hidden="true"
                  style={{
                    flex: 1,
                    height: 1,
                    background: `linear-gradient(to right, ${cat.color}44, transparent)`,
                  }}
                />
              </div>

              {/* Pills */}
              <div
                role="list"
                aria-label={`${cat.label} skills`}
                style={{ display: "flex", flexWrap: "wrap" as const, gap: 10 }}
              >
                {cat.skills.map((skill) => (
                  <SkillPill
                    key={skill.name}
                    name={skill.name}
                    icon={skill.icon}
                    color={cat.color}
                    glow={cat.glow}
                    highlighted={highlightedSkills.includes(skill.name)}
                    dimmed={highlightedSkills.length > 0 && !highlightedSkills.includes(skill.name)}
                  />
            ))}
              </div>
            </div>
          ))}
        </div>

        {/* Scrolling ticker */}
        <Ticker />
      </div>
    </section>
  );
}

// ─── Skill Pill ───────────────────────────────────────────────────────────────

function SkillPill({
  name, icon, 
  color, glow, 
  highlighted = false, 
  dimmed = false,
}: {
  name: string; 
  icon: string; 
  color: string; 
  glow: string;
  highlighted?: boolean; dimmed?: boolean;
}) {
  return (
    <div
      role="listitem"
      tabIndex={0}
      aria-label={name}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.borderColor = color;
        el.style.background = "rgba(255,255,255,0.06)";
        el.style.boxShadow = `0 4px 20px rgba(0,0,0,0.25), 0 0 14px ${glow}`;
        el.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.borderColor = "rgba(255,255,255,0.07)";
        el.style.background = "rgba(255,255,255,0.03)";
        el.style.boxShadow = "none";
        el.style.transform = "translateY(0)";
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = color;
        e.currentTarget.style.boxShadow = `0 0 0 2px ${glow}`;
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
        e.currentTarget.style.boxShadow = "none";
      }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 14px",
        borderRadius: 10,
        border: `1px solid ${highlighted ? color : "rgba(255,255,255,0.07)"}`,
        background: highlighted ? `${color}18` : "rgba(255,255,255,0.03)",
        boxShadow: highlighted ? `0 0 16px ${glow}` : "none",
        opacity: dimmed ? 0.25 : 1,
        transform: highlighted ? "translateY(-2px)" : "translateY(0)",
        cursor: "default",
        transition: "all 0.3s ease",
        backdropFilter: "blur(4px)",
        outline: "none",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={icon}
        alt=""
        width={16}
        height={16}
        loading="lazy"
        style={{ flexShrink: 0, opacity: 0.82 }}
      />
      <span style={{
        fontFamily: "monospace",
        fontSize: 12,
        color: "#94a3b8",
        whiteSpace: "nowrap",
      }}>
        {name}
      </span>
    </div>
  );
}

// ─── Ticker ───────────────────────────────────────────────────────────────────

function Ticker() {
  const items = [...ALL_SKILLS, ...ALL_SKILLS];

  return (
    <div
      aria-hidden="true"
      style={{
        position: "relative",
        marginTop: 36,
        overflow: "hidden",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        paddingTop: 14,
      }}
    >
      <div style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: 80, background: "linear-gradient(to right, #080810, transparent)", zIndex: 2, pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: 0, bottom: 0, right: 0, width: 80, background: "linear-gradient(to left, #080810, transparent)", zIndex: 2, pointerEvents: "none" }} />

      <div
        style={{ display: "flex", width: "max-content", animation: "skillsTicker 32s linear infinite" }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.animationPlayState = "paused"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.animationPlayState = "running"; }}
      >
        {items.map((skill, i) => (
          <div
            key={`${skill.name}-${i}`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "0 18px",
              fontFamily: "monospace",
              fontSize: 11,
              color: "#334155",
              whiteSpace: "nowrap",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={skill.icon} alt="" width={12} height={12} style={{ opacity: 0.3 }} loading="lazy" />
            {skill.name}
            <span style={{ marginLeft: 12, color: "#1e293b" }}>·</span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes skillsTicker {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
