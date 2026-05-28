"use client";

import { useEffect, useRef, useState } from "react";

const SKILLS = [
  {
    category: "Frontend",
    color: "#7c6af7",
    glow: "rgba(124,106,247,0.15)",
    items: [
      { name: "Next.js", level: 90 },
      { name: "TypeScript", level: 85 },
      { name: "Tailwind CSS", level: 90 },
      { name: "Shadcn UI", level: 80 },
    ],
  },
  {
    category: "Backend",
    color: "#4fc4cf",
    glow: "rgba(79,196,207,0.15)",
    items: [
      { name: "FastAPI", level: 85 },
      { name: "Python", level: 88 },
      { name: "REST APIs", level: 90 },
      { name: "Async / SSE", level: 80 },
    ],
  },
  {
    category: "AI & RAG",
    color: "#a78bfa",
    glow: "rgba(167,139,250,0.15)",
    items: [
      { name: "RAG Pipelines", level: 82 },
      { name: "pgvector", level: 78 },
      { name: "Gemini API", level: 80 },
      { name: "Groq API", level: 78 },
    ],
  },
  {
    category: "Database & DevOps",
    color: "#34d399",
    glow: "rgba(52,211,153,0.15)",
    items: [
      { name: "Supabase", level: 85 },
      { name: "PostgreSQL", level: 82 },
      { name: "Docker", level: 78 },
      { name: "GitHub Actions", level: 75 },
    ],
  },
];

function SkillBar({
  name,
  level,
  color,
  delay,
}: {
  name: string;
  level: number;
  color: string;
  delay: number;
}) {
  const [width, setWidth] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setWidth(level), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [level, delay]);

  return (
    <div ref={ref} style={{ marginBottom: "14px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "6px",
        }}
      >
        <span
          style={{
            fontSize: "13px",
            color: "var(--text-secondary)",
            fontWeight: 500,
          }}
        >
          {name}
        </span>
        <span
          style={{
            fontSize: "12px",
            color: "var(--text-muted)",
          }}
        >
          {level}%
        </span>
      </div>
      <div
        style={{
          height: "4px",
          borderRadius: "2px",
          background: "rgba(255,255,255,0.06)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            borderRadius: "2px",
            background: `linear-gradient(90deg, ${color}, ${color}99)`,
            width: `${width}%`,
            transition: "width 1s cubic-bezier(0.4, 0, 0.2, 1)",
            boxShadow: `0 0 8px ${color}66`,
          }}
        />
      </div>
    </div>
  );
}

export default function Skills() {
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
      id="skills"
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
              color: "var(--accent2)",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              fontWeight: 500,
              marginBottom: "12px",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(16px)",
              transition: "all 0.6s ease",
            }}
          >
            Capabilities
          </p>
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
            Skills &{" "}
            <span className="text-gradient">Tech Stack</span>
          </h2>
        </div>

        {/* grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "20px",
          }}
        >
          {SKILLS.map((group, gi) => (
            <div
              key={group.category}
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "16px",
                padding: "28px",
                opacity: visible ? 1 : 0,
                transform: visible
                  ? "translateY(0)"
                  : "translateY(24px)",
                transition: `all 0.6s ease ${0.1 + gi * 0.1}s`,
                position: "relative",
                overflow: "hidden",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor =
                  "rgba(255,255,255,0.12)";
                e.currentTarget.style.background =
                  "rgba(30,30,46,0.9)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.background = "var(--surface)";
              }}
            >
              {/* card glow */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "1px",
                  background: `linear-gradient(90deg, transparent, ${group.color}66, transparent)`,
                }}
              />

              {/* category label */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  marginBottom: "20px",
                }}
              >
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: group.color,
                    boxShadow: `0 0 8px ${group.color}`,
                  }}
                />
                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: group.color,
                    fontFamily: "var(--font-display)",
                    letterSpacing: "0.02em",
                  }}
                >
                  {group.category}
                </span>
              </div>

              {/* skill bars */}
              {group.items.map((skill, si) => (
                <SkillBar
                  key={skill.name}
                  name={skill.name}
                  level={skill.level}
                  color={group.color}
                  delay={gi * 100 + si * 80}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}