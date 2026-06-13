"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SkillItem {
  name: string;
  icon?: string;
}

interface Category {
  id: string;
  category: string;
  color: string;
  display_order: number;
  items: SkillItem[];
}

function hexToRgba(hex: string, alpha: number): string {
  try {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  } catch {
    return `rgba(129,140,248,${alpha})`;
  }
}

const ICON_COLORS: Record<string, string> = {
  nextdotjs: "ffffff", typescript: "3178c6", react: "61dafb",
  tailwindcss: "38bdf8", shadcnui: "ffffff", framer: "ffffff",
  reactquery: "ff4154", fastapi: "009688", python: "3776ab",
  pydantic: "e92063", postgresql: "336791", nodedotjs: "339933",
  express: "ffffff", googlegemini: "8e75b2", ollama: "ffffff",
  huggingface: "ffd21e", elastic: "005571", langchain: "ffffff",
  docker: "2496ed", githubactions: "2088ff", supabase: "3ecf8e",
  vercel: "ffffff", render: "46e3b7", git: "f05032", github: "ffffff",
  java: "f89820", javascript: "f7df1e", cplusplus: "00599c",
  php: "777bb4",
};

function iconUrl(slug: string | undefined): string | null {
  if (!slug || slug.trim() === "") return null;
  const s = slug.toLowerCase().trim();
  const color = ICON_COLORS[s] ?? "ffffff";
  return `https://cdn.simpleicons.org/${encodeURIComponent(s)}/${color}`;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Skills() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [highlightedSkills, setHighlightedSkills] = useState<string[]>([]);

  useEffect(() => {
    supabase
      .from("skills")
      .select("*")
      .order("display_order")
      .then(({ data }) => {
        if (data) setCategories(data as Category[]);
      });
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ skills: string[] }>).detail;
      setHighlightedSkills(detail.skills ?? []);
    };
    window.addEventListener("skill-highlight", handler);
    return () => window.removeEventListener("skill-highlight", handler);
  }, []);

  const allSkills = categories.flatMap((c) =>
    (c.items ?? []).map((s) => ({ name: s.name, icon: iconUrl(s.icon) }))
  );

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
          {categories.map((cat) => {
            const glow = hexToRgba(cat.color, 0.18);
            return (
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
                    {cat.category}
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
                  aria-label={`${cat.category} skills`}
                  style={{ display: "flex", flexWrap: "wrap" as const, gap: 10 }}
                >
                  {(cat.items ?? []).map((skill) => (
                    <SkillPill
                      key={skill.name}
                      name={skill.name}
                      icon={iconUrl(skill.icon)}
                      color={cat.color}
                      glow={glow}
                      highlighted={highlightedSkills.includes(skill.name)}
                      dimmed={highlightedSkills.length > 0 && !highlightedSkills.includes(skill.name)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Scrolling ticker */}
        <Ticker skills={allSkills} />
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
  icon: string | null; 
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
      {icon && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={icon}
          alt=""
          width={16}
          height={16}
          loading="lazy"
          style={{ flexShrink: 0, opacity: 0.82 }}
        />
      )}
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

function Ticker({ skills }: { skills: { name: string; icon: string | null }[] }) {
  const items = [...skills, ...skills];

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
            {skill.icon && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={skill.icon} alt="" width={12} height={12} style={{ opacity: 0.3 }} loading="lazy" />
            )}
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
