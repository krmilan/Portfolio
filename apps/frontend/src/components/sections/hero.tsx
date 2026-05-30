"use client";
// Server Component — fetches profile via ISR (revalidate 60s)
// Typewriter animation isolated in HeroTypewriter (client-only)

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

async function fetchProfile(): Promise<Profile> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile`, {
      next: { revalidate: 60 }, // ISR: hero updates within 60s of admin save
    });
    if (!res.ok) return FALLBACK;
    return res.json();
  } catch {
    return FALLBACK;
  }
}

function IconForLink({ icon, size = 16 }: { icon: string; size?: number }) {
  if (icon === "linkedin")
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    );
  if (icon === "hackerrank")
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0c1.285 0 9.75 4.886 10.392 6 .645 1.115.645 10.885 0 12S13.287 24 12 24C10.712 24 2.25 19.114 1.608 18 .963 16.886.963 7.115 1.608 6 2.25 4.886 10.715 0 12 0zm-.91 5.27v2.79h-1.77V5.27H7.39v13.46h1.93v-2.79h1.77v2.79h1.93l.001-4.645h1.07c.35 0 .51.18.51.52V18.73h1.93v-4.365c0-1.03-.56-1.56-1.1-1.76.44-.29 1.1-.74 1.1-1.86V8.01c0-.86-.75-2.74-2.76-2.74H11.09zm0 3.33h.9c.49 0 .67.31.67.59v2.27c0 .28-.24.54-.67.54h-.9V8.6z" />
      </svg>
    );
  if (icon === "leetcode")
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" />
      </svg>
    );
  if (icon === "twitter" || icon === "x")
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.741l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    );
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

export default async function HeroSection() {
  const profile = await fetchProfile();

  const gh = profile.github_url || "https://github.com";
  const li = profile.linkedin_url || "https://linkedin.com";
  const extraLinks: ExtraLink[] = profile.extra_links ?? [];

  return (
    <section id="about" className="hero-pad">
      <div
        style={{
          maxWidth: 1152,
          margin: "0 auto",
          width: "100%",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div className="hero-grid">
          {/* Left */}
          <div>
            {/* Status badge */}
            {profile.open_to_work && (
              <div
                className="animate-fade-up"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 16px",
                  borderRadius: 999,
                  border: "1px solid rgba(0,255,170,0.35)",
                  background: "rgba(0,255,170,0.08)",
                  marginBottom: 32,
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "#00ffaa",
                    boxShadow: "0 0 10px #00ffaa",
                    animation: "glow-pulse 2s ease-in-out infinite",
                  }}
                />
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: "#00ffaa",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                  }}
                >
                  Open to Work
                </span>
              </div>
            )}

            {/* Avatar + Name row */}
            <div
              className="animate-fade-up delay-100"
              style={{
                display: "flex",
                alignItems: "flex-end",
                gap: 20,
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 20,
                  flexShrink: 0,
                  background: profile.avatar_url
                    ? `url(${profile.avatar_url}) center/cover no-repeat`
                    : "linear-gradient(135deg, rgba(124,111,205,0.3), rgba(0,212,255,0.2))",
                  border: "2px solid rgba(157,143,240,0.3)",
                  boxShadow: "0 0 24px rgba(124,111,205,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "Syne, sans-serif",
                  fontWeight: 900,
                  fontSize: 28,
                  color: "rgba(157,143,240,0.8)",
                }}
              >
                {!profile.avatar_url && (profile.name?.[0] ?? "M")}
              </div>

              <h1 className="font-display" style={{ lineHeight: 0.92 }}>
                <span
                  style={{
                    display: "block",
                    fontSize: "clamp(44px, 7vw, 88px)",
                    fontWeight: 900,
                    color: "white",
                  }}
                >
                  {profile.name?.split(" ")[0] ?? "Milan"}
                </span>
                <span
                  style={{
                    display: "block",
                    fontSize: "clamp(44px, 7vw, 88px)",
                    fontWeight: 900,
                    background: "linear-gradient(135deg, #9d8ff0, #00d4ff)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {profile.name?.split(" ")[1] ?? "Ray"}
                </span>
              </h1>
            </div>

            {/* Typewriter role — client component, receives roles from server */}
            <HeroTypewriter roles={profile.roles ?? []} />

            {/* Bio */}
            <p
              className="animate-fade-up delay-300"
              style={{
                color: "#94a3b8",
                fontSize: "clamp(14px, 1.8vw, 16px)",
                lineHeight: 1.75,
                maxWidth: 500,
                marginBottom: 32,
              }}
            >
              {profile.bio}
            </p>

            {/* Social links row */}
            <div
              className="animate-fade-up delay-300"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 28,
                flexWrap: "wrap",
              }}
            >
              {/* GitHub */}
              <a
                href={gh}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#94a3b8",
                  textDecoration: "none",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "white";
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "rgba(255,255,255,0.25)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "#94a3b8";
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "rgba(255,255,255,0.1)";
                }}
                title="GitHub"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href={li}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#94a3b8",
                  textDecoration: "none",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "#0a66c2";
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "rgba(10,102,194,0.4)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "#94a3b8";
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "rgba(255,255,255,0.1)";
                }}
                title="LinkedIn"
              >
                <IconForLink icon="linkedin" size={16} />
              </a>

              {/* Extra links (HackerRank, LeetCode, etc.) */}
              {extraLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={link.label}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "#94a3b8",
                    textDecoration: "none",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.color = "white";
                    (e.currentTarget as HTMLElement).style.borderColor =
                      "rgba(255,255,255,0.25)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.color = "#94a3b8";
                    (e.currentTarget as HTMLElement).style.borderColor =
                      "rgba(255,255,255,0.1)";
                  }}
                >
                  <IconForLink icon={link.icon} size={16} />
                </a>
              ))}

              {/* Email */}
              <a
                href={`mailto:${profile.email ?? "milan@email.com"}`}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#94a3b8",
                  textDecoration: "none",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "white";
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "rgba(255,255,255,0.25)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "#94a3b8";
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "rgba(255,255,255,0.1)";
                }}
                title="Email"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </a>
            </div>

            {/* CTAs */}
            <div className="cta-row animate-fade-up delay-400">
              <a
                href="#projects"
                style={{
                  padding: "13px 26px",
                  borderRadius: 12,
                  fontWeight: 600,
                  fontSize: 14,
                  background: "linear-gradient(135deg, #7c6fcd, #9d8ff0)",
                  color: "white",
                  textDecoration: "none",
                  boxShadow: "0 0 32px rgba(124,111,205,0.4)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "DM Sans, sans-serif",
                }}
              >
                View Projects
              </a>
              <a
                href="#chat"
                style={{
                  padding: "13px 26px",
                  borderRadius: 12,
                  fontWeight: 600,
                  fontSize: 14,
                  background: "rgba(255,255,255,0.07)",
                  color: "white",
                  border: "1px solid rgba(255,255,255,0.14)",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "DM Sans, sans-serif",
                }}
              >
                Ask AI Assistant
              </a>
              <a
                href={profile.resume_url ?? "/resume.pdf"}
                style={{
                  padding: "13px 26px",
                  borderRadius: 12,
                  fontWeight: 600,
                  fontSize: 14,
                  background: "rgba(255,255,255,0.04)",
                  color: "#cbd5e1",
                  border: "1px solid rgba(255,255,255,0.09)",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  fontFamily: "DM Sans, sans-serif",
                }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
                Resume
              </a>
            </div>
          </div>

          {/* Right — terminal (hidden mobile) */}
          <div className="terminal-card">
            <div style={{ position: "relative" }}>
              <div
                style={{
                  position: "absolute",
                  inset: -20,
                  background:
                    "radial-gradient(ellipse, rgba(124,111,205,0.18) 0%, transparent 70%)",
                  borderRadius: 24,
                  filter: "blur(20px)",
                }}
              />
              <div
                className="glass-bright"
                style={{
                  borderRadius: 20,
                  padding: 24,
                  width: 360,
                  boxShadow: "0 32px 64px rgba(0,0,0,0.5)",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 20,
                    paddingBottom: 16,
                    borderBottom: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  {[
                    "rgba(255,100,100,0.8)",
                    "rgba(255,200,0,0.8)",
                    "rgba(0,220,100,0.8)",
                  ].map((c, i) => (
                    <div
                      key={i}
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        background: c,
                      }}
                    />
                  ))}
                  <span
                    style={{
                      marginLeft: 8,
                      fontSize: 11,
                      color: "#64748b",
                      fontFamily: "monospace",
                    }}
                  >
                    milan@portfolio:~
                  </span>
                </div>
                <div
                  style={{ fontFamily: "monospace", fontSize: 12, lineHeight: 2 }}
                >
                  <div>
                    <span style={{ color: "#00ffaa" }}>→</span>{" "}
                    <span style={{ color: "#64748b" }}>stack</span>
                  </div>
                  <div style={{ paddingLeft: 16, color: "#cbd5e1" }}>
                    Next.js · FastAPI · pgvector
                  </div>
                  <div style={{ paddingLeft: 16, color: "#cbd5e1" }}>
                    Gemini · Groq · Supabase
                  </div>
                  <div style={{ marginTop: 4 }}>
                    <span style={{ color: "#00d4ff" }}>→</span>{" "}
                    <span style={{ color: "#64748b" }}>experience</span>
                  </div>
                  <div style={{ paddingLeft: 16, color: "#cbd5e1" }}>
                    MCA Graduate · 2023
                  </div>
                  <div style={{ paddingLeft: 16, color: "#cbd5e1" }}>
                    AI Engineering · Full-Stack
                  </div>
                  <div style={{ marginTop: 4 }}>
                    <span style={{ color: "#9d8ff0" }}>→</span>{" "}
                    <span style={{ color: "#64748b" }}>current</span>
                  </div>
                  <div style={{ paddingLeft: 16 }}>
                    <span style={{ color: "#00ffaa" }}>building</span>{" "}
                    <span style={{ color: "#94a3b8" }}>AI portfolio platform</span>
                  </div>
                  <div
                    style={{
                      paddingLeft: 16,
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <div
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "#00ffaa",
                        boxShadow: "0 0 6px #00ffaa",
                        animation: "glow-pulse 2s ease-in-out infinite",
                      }}
                    />
                    <span style={{ color: "#00ffaa" }}>open to opportunities</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div
          style={{
            position: "absolute",
            bottom: 24,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span
            style={{
              fontSize: 10,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "#475569",
            }}
          >
            Scroll
          </span>
          <div
            style={{
              width: 1,
              height: 40,
              background: "linear-gradient(to bottom, #475569, transparent)",
            }}
          />
        </div>
      </div>
    </section>
  );
}