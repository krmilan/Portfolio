"use client";

import { useState, useEffect } from "react";
import HeroTypewriter from "@/components/ui/hero-typewriter";
import { type Profile, type ExtraLink } from "@/lib/content";


const FALLBACK: Profile = {
  id: 1,
  name: "Milan Ray",
  bio: "I build production-grade systems where modern web engineering meets real AI — RAG pipelines, vector search, and full-stack applications built to ship.",
  github_url: "https://github.com",
  linkedin_url: "https://linkedin.com",
  email: "milan@email.com",
  open_to_work: true,
  roles: ["AI Engineer", "Full-Stack Dev", "RAG Architect", "Backend Engineer"],
  extra_links: [],
  resume_url: "/resume.pdf",
  avatar_url: "",
};

function IconForLink({ icon, size = 16 }: { icon: string; size?: number }) {
  if (icon === "linkedin")
    return (<svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>);
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>);
}

export default function HeroSection() {
  const [profile, setProfile] = useState<Profile>(FALLBACK);

  useEffect(() => {
    import("@/lib/content").then(({ getProfile }) =>
      getProfile()
        .then(data => { if (data) setProfile(data); })
        .catch(() => {})
    );
  }, []);

  const gh = profile.github_url || "https://github.com";
  const li = profile.linkedin_url || "https://linkedin.com";
  const extraLinks: ExtraLink[] = profile.extra_links ?? [];

  return (
    <section id="about" className="hero-pad">
      <div style={{ maxWidth: 1152, margin: "0 auto", width: "100%", position: "relative", zIndex: 1 }}>
        <div className="hero-grid">
          <div>
            {profile.open_to_work && (
              <div className="animate-fade-up" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 999, border: "1px solid rgba(0,255,170,0.35)", background: "rgba(0,255,170,0.08)", marginBottom: 32 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#00ffaa", boxShadow: "0 0 10px #00ffaa", animation: "glow-pulse 2s ease-in-out infinite" }} />
                <span style={{ fontSize: 11, fontWeight: 600, color: "#00ffaa", letterSpacing: "0.2em", textTransform: "uppercase" }}>Open to Work</span>
              </div>
            )}
            <div className="animate-fade-up delay-100" style={{ display: "flex", alignItems: "flex-end", gap: 20, marginBottom: 20 }}>
              <div style={{ width: 80, height: 80, borderRadius: 20, flexShrink: 0, background: profile.avatar_url ? `url(${profile.avatar_url}) center/cover no-repeat` : "linear-gradient(135deg, rgba(124,111,205,0.3), rgba(0,212,255,0.2))", border: "2px solid rgba(157,143,240,0.3)", boxShadow: "0 0 24px rgba(124,111,205,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Syne, sans-serif", fontWeight: 900, fontSize: 28, color: "rgba(157,143,240,0.8)" }}>
                {!profile.avatar_url && (profile.name?.[0] ?? "M")}
              </div>
              <h1 className="font-display" style={{ lineHeight: 0.92 }}>
                <span style={{ display: "block", fontSize: "clamp(44px, 7vw, 88px)", fontWeight: 900, color: "white" }}>{profile.name?.split(" ")[0] ?? "Milan"}</span>
                <span style={{ display: "block", fontSize: "clamp(44px, 7vw, 88px)", fontWeight: 900, background: "linear-gradient(135deg, #9d8ff0, #00d4ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{profile.name?.split(" ")[1] ?? "Ray"}</span>
              </h1>
            </div>
            <HeroTypewriter roles={profile.roles ?? []} />
            <p className="animate-fade-up delay-300" style={{ color: "#94a3b8", fontSize: "clamp(14px, 1.8vw, 16px)", lineHeight: 1.75, maxWidth: 500, marginBottom: 32 }}>{profile.bio}</p>
            <div className="animate-fade-up delay-300" style={{ display: "flex", gap: 12, marginBottom: 32 }}>
              <a href={gh} target="_blank" rel="noopener noreferrer" aria-label="GitHub" style={{ width: 40, height: 40, borderRadius: 10, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", textDecoration: "none" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
              </a>
              <a href={li} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" style={{ width: 40, height: 40, borderRadius: 10, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", textDecoration: "none" }}>
                <IconForLink icon="linkedin" size={18} />
              </a>
              {profile.email && (
                <a href={`mailto:${profile.email}`} aria-label="Email" style={{ width: 40, height: 40, borderRadius: 10, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", textDecoration: "none" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                </a>
              )}
              {extraLinks.map((el, i) => (
                <a key={i} href={el.url} target="_blank" rel="noopener noreferrer" aria-label={el.label} style={{ width: 40, height: 40, borderRadius: 10, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", textDecoration: "none" }}>
                  <IconForLink icon={el.icon ?? "link"} size={18} />
                </a>
              ))}
            </div>
            <div className="animate-fade-up delay-400" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a href="#projects" style={{ padding: "13px 26px", borderRadius: 12, fontWeight: 600, fontSize: 14, background: "linear-gradient(135deg, #7c6fcd, #9d8ff0)", color: "white", textDecoration: "none", boxShadow: "0 0 32px rgba(124,111,205,0.4)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: "DM Sans, sans-serif" }}>View Projects</a>
              <a href="#chat" style={{ padding: "13px 26px", borderRadius: 12, fontWeight: 600, fontSize: 14, background: "rgba(255,255,255,0.07)", color: "white", border: "1px solid rgba(255,255,255,0.14)", textDecoration: "none", display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: "DM Sans, sans-serif" }}>Ask AI Assistant</a>
              <a href={profile.resume_url ?? "/resume.pdf"} style={{ padding: "13px 26px", borderRadius: 12, fontWeight: 600, fontSize: 14, background: "rgba(255,255,255,0.04)", color: "#cbd5e1", border: "1px solid rgba(255,255,255,0.09)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "DM Sans, sans-serif" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                Resume
              </a>
            </div>
          </div>

          {/* Terminal */}
          <div className="terminal-card">
            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", inset: -20, background: "radial-gradient(ellipse, rgba(124,111,205,0.18) 0%, transparent 70%)", borderRadius: 24, filter: "blur(20px)" }} />
              <div className="glass-bright" style={{ borderRadius: 20, padding: 24, width: 360, boxShadow: "0 32px 64px rgba(0,0,0,0.5)", position: "relative" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                  {["rgba(255,100,100,0.8)", "rgba(255,200,0,0.8)", "rgba(0,220,100,0.8)"].map((c, i) => (<div key={i} style={{ width: 12, height: 12, borderRadius: "50%", background: c }} />))}
                  <span style={{ marginLeft: 8, fontSize: 11, color: "#64748b", fontFamily: "monospace" }}>milan@portfolio:~</span>
                </div>
                <div style={{ fontFamily: "monospace", fontSize: 12, lineHeight: 2 }}>
                  <div><span style={{ color: "#00ffaa" }}>→</span> <span style={{ color: "#64748b" }}>stack</span></div>
                  <div style={{ paddingLeft: 16, color: "#cbd5e1" }}>Next.js · FastAPI · pgvector</div>
                  <div style={{ paddingLeft: 16, color: "#cbd5e1" }}>Gemini · Groq · Supabase</div>
                  <div style={{ marginTop: 4 }}><span style={{ color: "#00d4ff" }}>→</span> <span style={{ color: "#64748b" }}>experience</span></div>
                  <div style={{ paddingLeft: 16, color: "#cbd5e1" }}>MCA Graduate · 2023</div>
                  <div style={{ paddingLeft: 16, color: "#cbd5e1" }}>AI Engineering · Full-Stack</div>
                  <div style={{ marginTop: 4 }}><span style={{ color: "#9d8ff0" }}>→</span> <span style={{ color: "#64748b" }}>current</span></div>
                  <div style={{ paddingLeft: 16 }}><span style={{ color: "#00ffaa" }}>building</span> <span style={{ color: "#94a3b8" }}>AI portfolio platform</span></div>
                  <div style={{ paddingLeft: 16, display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#00ffaa", boxShadow: "0 0 6px #00ffaa", animation: "glow-pulse 2s ease-in-out infinite" }} />
                    <span style={{ color: "#00ffaa" }}>open to opportunities</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div style={{ position: "absolute", bottom: 24, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: "#475569" }}>Scroll</span>
          <div style={{ width: 1, height: 40, background: "linear-gradient(to bottom, #475569, transparent)" }} />
        </div>
      </div>
    </section>
  );
}
