"use client";

import { useState } from "react";

// ─── Data ─────────────────────────────────────────────────────────────────────

interface Experience {
  type: "work" | "edu";
  period: string;
  role: string;
  org: string;
  location: string;
  points: string[];
  tags: string[];
  accent: string;
}

const TIMELINE: Experience[] = [
  {
    type: "work",
    period: "2024 — Present",
    role: "Full-Stack AI Engineer",
    org: "Freelance / Open Source",
    location: "Bengaluru, IN",
    points: [
      "Built a production-grade AI portfolio platform with RAG-powered Q&A using pgvector, Gemini embeddings, and Groq LLM — deployed on Vercel + Render at $0/mo infrastructure cost.",
      "Developed Ledgr.ai, a full-stack personal finance tracker with OpenAI-powered spending insights, Clerk auth, Prisma ORM, and Recharts dashboards.",
      "Architected a pnpm monorepo boilerplate combining Next.js 15 + FastAPI with multi-stage Docker, GitHub Actions CI/CD, shared TypeScript types, and Playwright E2E tests.",
    ],
    tags: ["Next.js", "FastAPI", "RAG", "pgvector", "Docker", "GitHub Actions"],
    accent: "#9d8ff0",
  },
  {
    type: "edu",
    period: "2021 — 2023",
    role: "Master of Computer Applications",
    org: "Lovely Professional University",
    location: "Phagwara, Punjab",
    points: [
      "Specialized in software engineering, database systems, and applied machine learning.",
      "Final-year project: intelligent document retrieval system using TF-IDF and cosine similarity — direct precursor to current RAG pipeline work.",
      "Graduated with distinction; coursework in algorithms, OS internals, and distributed systems.",
    ],
    tags: ["C++", "PHP", "Java", "Python", "Machine Learning", "DBMS", "Algorithms", "Distributed Systems", "Web Development"],
    accent: "#00d4ff",
  },
  {
    type: "edu",
    period: "2018 — 2021",
    role: "Bachelor of Computer Applications",
    org: "Reva University",
    location: "Bengaluru, Karnataka",
    points: [
      "Foundation in computer science: data structures, OOP, web technologies, and networking.",
      "Built first full-stack projects using PHP + MySQL; developed interest in backend systems.",
      "Active in coding club; participated in inter-college hackathons.",
    ],
    tags: ["C/C++", "Java", "Python", "PHP", "MySQL", "Artificial Intelligence", "Data Structures", "OS", "Networking", "RDBMS"],
    accent: "#00ffaa",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function ExperienceSection() {
  const [expanded, setExpanded] = useState<number>(0);

  return (
    <section id="experience" data-snap className="section-pad">
      <div style={{ maxWidth: 1152, margin: "0 auto", position: "relative", zIndex: 1, width: "100%" }}>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <p style={{ fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", color: "#00d4ff", marginBottom: 12, fontWeight: 600 }}>
            Background
          </p>
          <h2 className="font-display" style={{ fontSize: "clamp(22px, 3.5vw, 44px)", fontWeight: 900, color: "white" }}>
            Experience &{" "}
            <span style={{ background: "linear-gradient(135deg, #9d8ff0, #00d4ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Education
            </span>
          </h2>
        </div>

        {/* Two-column layout: timeline rail + detail panel */}
        <style>{`
          .exp-grid { display: grid; grid-template-columns: 1fr 1.4fr; gap: 32px; align-items: start; }
          .exp-detail-col { min-height: 420px; }
          .exp-inline { display: none !important; }
          @media (max-width: 768px) {
            .exp-grid { grid-template-columns: 1fr !important; gap: 12px !important; }
            .exp-detail-col { display: none !important; }
            .exp-inline { display: block !important; }
          }
        `}</style>
        <div className="exp-grid">

          {/* Left: stacked timeline entries */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {TIMELINE.map((item, i) => (
              <TimelineEntry
                key={i}
                item={item}
                index={i}
                isActive={expanded === i}
                isLast={i === TIMELINE.length - 1}
                onClick={() => setExpanded(i)}
              />
            ))}
          </div>

          {/* Right: expanded detail panel (desktop only) */}
          <div className="exp-detail-col">
            <DetailPanel item={TIMELINE[expanded]} index={expanded} />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Timeline Entry ───────────────────────────────────────────────────────────

function TimelineEntry({
  item, index, isActive, isLast, onClick,
}: {
  item: Experience; index: number; isActive: boolean; isLast: boolean; onClick: () => void;
}) {
  const [hov, setHov] = useState(false);

  return (
    <div style={{ position: "relative", paddingLeft: 28 }}>
      {/* Vertical rail line */}
      {!isLast && (
        <div style={{
          position: "absolute", left: 7, top: 24, bottom: -12, width: 1,
          background: isActive
            ? `linear-gradient(180deg, ${item.accent}66, transparent)`
            : "rgba(255,255,255,0.07)",
          transition: "background 0.4s ease",
        }} />
      )}

      {/* Rail dot */}
      <div style={{
        position: "absolute", left: 0, top: 16,
        width: 15, height: 15, borderRadius: "50%",
        background: isActive ? item.accent : "rgba(255,255,255,0.08)",
        border: `2px solid ${isActive ? item.accent : "rgba(255,255,255,0.15)"}`,
        boxShadow: isActive ? `0 0 12px ${item.accent}88` : "none",
        transition: "all 0.3s ease",
        zIndex: 1,
      }} />

      {/* Card */}
      <div
        onClick={onClick}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        className={isActive ? "glass" : ""}
        style={{
          borderRadius: 14,
          padding: "16px 20px",
          cursor: "pointer",
          background: isActive ? undefined : hov ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.02)",
          border: isActive
            ? `1px solid ${item.accent}44`
            : `1px solid ${hov ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.05)"}`,
          boxShadow: isActive ? `0 0 30px ${item.accent}14` : "none",
          transition: "all 0.25s ease",
        }}
      >
        {/* Type badge */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{
            fontSize: 9, fontFamily: "monospace", fontWeight: 700, letterSpacing: "0.15em",
            textTransform: "uppercase", padding: "2px 8px", borderRadius: 4,
            background: `${item.accent}15`, color: item.accent, border: `1px solid ${item.accent}30`,
          }}>
            {item.type === "work" ? "⚡ Work" : "🎓 Education"}
          </span>
          <span style={{ fontSize: 11, fontFamily: "monospace", color: "rgba(255,255,255,0.3)" }}>
            {item.period}
          </span>
        </div>

        <h3 style={{ fontSize: 15, fontWeight: 700, color: isActive ? "white" : "rgba(255,255,255,0.8)", marginBottom: 2, transition: "color 0.2s" }}>
          {item.role}
        </h3>
        <p style={{ fontSize: 12, color: isActive ? item.accent : "#64748b", fontFamily: "monospace", transition: "color 0.3s" }}>
          {item.org} · {item.location}
        </p>

        {/* Mobile inline detail — hidden on desktop via .exp-inline class */}
        {isActive && (
          <div className="exp-inline" style={{ marginTop: 14 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
              {item.points.map((pt, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <div style={{ flexShrink: 0, width: 5, height: 5, borderRadius: "50%", marginTop: 7, background: item.accent }} />
                  <p style={{ fontSize: 12.5, color: "#94a3b8", lineHeight: 1.6 }}>{pt}</p>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              {item.tags.map(tag => (
                <span key={tag} style={{ fontSize: 10, padding: "3px 8px", borderRadius: 5, fontWeight: 600, background: `${item.accent}12`, color: item.accent, border: `1px solid ${item.accent}25` }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Detail Panel ─────────────────────────────────────────────────────────────

function DetailPanel({ item, index }: { item: Experience; index: number }) {
  return (
    <div
      key={index}
      className="glass"
      style={{
        borderRadius: 20,
        padding: 32,
        position: "relative",
        overflow: "hidden",
        border: `1px solid ${item.accent}33`,
        boxShadow: `0 0 50px ${item.accent}12`,
        animation: "fadeSlideIn 0.3s ease",
      }}
    >
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Top accent bar */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg, transparent, ${item.accent}88, transparent)`,
      }} />

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 8 }}>
          <h3 className="font-display" style={{ fontSize: 22, fontWeight: 800, color: "white", lineHeight: 1.2 }}>
            {item.role}
          </h3>
          <span style={{
            fontSize: 11, fontFamily: "monospace", fontWeight: 600, whiteSpace: "nowrap",
            padding: "4px 10px", borderRadius: 6,
            background: `${item.accent}15`, color: item.accent, border: `1px solid ${item.accent}30`,
          }}>
            {item.period}
          </span>
        </div>
        <p style={{ fontSize: 14, color: item.accent, fontFamily: "monospace" }}>
          {item.org} · {item.location}
        </p>
      </div>

      {/* Bullet points */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
        {item.points.map((pt, i) => (
          <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            <div style={{
              flexShrink: 0, width: 6, height: 6, borderRadius: "50%", marginTop: 7,
              background: item.accent, boxShadow: `0 0 6px ${item.accent}88`,
            }} />
            <p style={{ fontSize: 13.5, color: "#94a3b8", lineHeight: 1.7 }}>
              {pt}
            </p>
          </div>
        ))}
      </div>

      {/* Tags */}
      <div style={{ paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", flexWrap: "wrap", gap: 8 }}>
        {item.tags.map(tag => (
          <span key={tag} style={{
            fontSize: 11, padding: "4px 10px", borderRadius: 6, fontWeight: 600,
            background: `${item.accent}12`, color: item.accent, border: `1px solid ${item.accent}25`,
          }}>
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
