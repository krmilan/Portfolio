"use client";

import { useEffect, useRef, useState } from "react";
import { getSkills, type Skill } from "@/lib/content";

function SkillBar({ name, pct, color, delay }: { name: string; pct: number; color: string; delay: number }) {
  const [width, setWidth] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setTimeout(() => setWidth(pct), delay);
    }, { threshold: 0.2 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [pct, delay]);
  return (
    <div ref={ref}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 13, color: "#cbd5e1", fontWeight: 500 }}>{name}</span>
        <span style={{ fontSize: 11, fontFamily: "monospace", color }}>{pct}%</span>
      </div>
      <div style={{ height: 5, borderRadius: 4, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
        <div style={{ height: "100%", borderRadius: 4, width: `${width}%`, transition: "width 1s ease-out", background: `linear-gradient(90deg, ${color}77, ${color})`, boxShadow: `0 0 8px ${color}55` }} />
      </div>
    </div>
  );
}

const FALLBACK: Skill[] = [
  { id: "1", category: "Frontend", color: "#9d8ff0", display_order: 1, items: [{ name: "Next.js", pct: 90 }, { name: "TypeScript", pct: 85 }, { name: "Tailwind CSS", pct: 90 }, { name: "React / Shadcn", pct: 88 }] },
  { id: "2", category: "Backend", color: "#00d4ff", display_order: 2, items: [{ name: "FastAPI", pct: 85 }, { name: "Python", pct: 88 }, { name: "REST / SSE", pct: 90 }, { name: "Pydantic", pct: 82 }] },
  { id: "3", category: "AI & RAG", color: "#00ffaa", display_order: 3, items: [{ name: "RAG Pipelines", pct: 82 }, { name: "pgvector", pct: 78 }, { name: "Gemini / Groq", pct: 80 }, { name: "Embeddings", pct: 76 }] },
  { id: "4", category: "DevOps", color: "#ff6b35", display_order: 4, items: [{ name: "Supabase", pct: 85 }, { name: "Docker", pct: 78 }, { name: "GitHub Actions", pct: 75 }, { name: "PostgreSQL", pct: 82 }] },
];

export default function SkillsSection() {
  const [skills, setSkills] = useState<Skill[]>(FALLBACK);

  useEffect(() => {
    getSkills().then(data => { if (data.length > 0) setSkills(data); });
  }, []);

  return (
    <section id="skills" className="section-pad">
      <div style={{ maxWidth: 1152, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div style={{ marginBottom: 52 }}>
          <p style={{ fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", color: "#9d8ff0", marginBottom: 16, fontWeight: 600 }}>Capabilities</p>
          <h2 className="font-display" style={{ fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 900, color: "white" }}>
            Skills & <span style={{ background: "linear-gradient(135deg, #9d8ff0, #00d4ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Tech Stack</span>
          </h2>
        </div>
        <div className="skills-grid">
          {skills.map(cat => (
            <div key={cat.id} className="glass-bright" style={{ borderRadius: 20, padding: 24, transition: "transform 0.3s, box-shadow 0.3s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLElement).style.boxShadow = `0 16px 40px ${cat.color}33`; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: cat.color, boxShadow: `0 0 8px ${cat.color}` }} />
                <span className="font-display" style={{ fontSize: 13, fontWeight: 700, color: cat.color }}>{cat.category}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {cat.items.map((item, i) => <SkillBar key={item.name} name={item.name} pct={item.pct} color={cat.color} delay={i * 120} />)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}