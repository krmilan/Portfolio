"use client";

import { useState, useEffect, useRef } from "react";
import HeroTypewriter from "@/components/ui/hero-typewriter";
import { type Profile, type ExtraLink, getProfile } from "@/lib/content";
import { sendChat } from "@/lib/api";

const FALLBACK: Profile = {
  id: 1,
  name: "Milan Ray",
  bio: "I build production-grade systems where modern web engineering meets real AI — RAG pipelines, vector search, and full-stack applications built to ship.",
  github_url: "https://github.com/krmilan",
  linkedin_url: "https://linkedin.com/in/krmilan",
  email: "milan@email.com",
  open_to_work: true,
  roles: ["AI Engineer", "Full-Stack Dev", "RAG Architect", "Backend Engineer"],
  extra_links: [],
  resume_url: "/resume.pdf",
  avatar_url: "",
};

const FUNNY_REPLIES: Record<string, string> = {
  default: [
    "bash: command not found. Try: ask me something about Milan's stack.",
    "Error 418: I'm a teapot. Also, that query confused me.",
    "segfault (core dumped) — just kidding. Maybe rephrase?",
    "404: answer not found in this universe.",
    "sudo: permission denied. Try asking nicely about projects.",
    "NullPointerException: your question returned nothing useful.",
    "RuntimeError: brain.exe has stopped working. Try again.",
    "git: unknown command. Did you mean `ask about Milan`?",
  ] as unknown as string,
};

function getFunnyReply(): string {
  const arr = [
    "bash: command not found. Try asking about Milan's stack.",
    "Error 418: I'm a teapot. Also, that query confused me.",
    "segfault (core dumped) — just kidding. Maybe rephrase?",
    "404: answer not found in this universe.",
    "sudo: permission denied. Try asking about projects.",
    "NullPointerException: your question returned nothing useful.",
    "RuntimeError: brain.exe stopped working. Try again.",
    "git: unknown command. Did you mean `ask about Milan`?",
  ];
  return arr[Math.floor(Math.random() * arr.length)];
}

function IconForLink({ icon, size = 16 }: { icon: string; size?: number }) {
  if (icon === "linkedin")
    return (<svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>);
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>);
}

const MAX_MESSAGES = 2;

const CHIP_REPLIES: Record<string, { lines: string[]; color: string }> = {
  "How does RAG work here?": {
    lines: [
      "query → gemini embeds (768d) → pgvector finds nearest chunks → groq answers from context only.",
      "threshold 0.35 · 17 docs · hallucination: 0%",
    ],
    color: "#00ffaa",
  },
  "What's the stack?": {
    lines: [
      "Next.js 15 · FastAPI · Supabase+pgvector · Gemini · Groq · Docker",
      "zero infra cost. free tier. ships like it costs $500/mo.",
    ],
    color: "#00d4ff",
  },
  "Tell me about projects": {
    lines: [
      "Ledgr.ai — AI expense tracker · OCR + vector search.",
      "Portfolio RAG — the thing you're using right now.",
    ],
    color: "#9d8ff0",
  },
};

type TerminalLine =
  | { type: "input"; text: string }
  | { type: "output"; text: string; color?: string }
  | { type: "loading" }
  | { type: "nudge" };

export default function HeroSection() {
  const [profile, setProfile] = useState<Profile>(FALLBACK);
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [msgCount, setMsgCount] = useState(0);
  const [history, setHistory] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getProfile()
      .then(data => { if (data) setProfile(data); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const boot: { line: TerminalLine; delay: number }[] = [
      { line: { type: "output", text: "$ initializing portfolio-rag v1.0...", color: "#64748b" }, delay: 200 },
      { line: { type: "output", text: "✓ pgvector connected · 768d embeddings loaded", color: "#00ffaa" }, delay: 600 },
      { line: { type: "output", text: "✓ groq llm · gemini-embed · 17 docs indexed", color: "#00ffaa" }, delay: 1000 },
      { line: { type: "output", text: "─────────────────────────────────────────────", color: "#1e293b" }, delay: 1300 },
      { line: { type: "output", text: "ready. ask me anything about Milan →", color: "#9d8ff0" }, delay: 1600 },
    ];
    boot.forEach(({ line, delay }) => {
      setTimeout(() => setLines(p => [...p, line]), delay);
    });
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  async function handleSend(msg?: string) {
    const text = (msg ?? input).trim();
    if (!text || loading) return;
    setInput("");

    if (msgCount >= MAX_MESSAGES) {
      setLines(p => [...p, { type: "input", text }, { type: "nudge" }]);
      return;
    }

    // Chip shortcut — instant, no API
    const chipMatch = CHIP_REPLIES[text];
    if (chipMatch) {
      setLines(p => [...p, { type: "input", text }, { type: "loading" }]);
      setTimeout(() => {
        setLines(p => [
          ...p.filter(l => l.type !== "loading"),
          ...chipMatch.lines.map(t => ({ type: "output" as const, text: t, color: chipMatch.color })),
          { type: "nudge" },
        ]);
        setMsgCount(c => c + 1);
      }, 400);
      return;
    }

    setLines(p => [...p, { type: "input", text }, { type: "loading" }]);
    setLoading(true);

    try {
      const data = await sendChat(text, history);
      const reply = data.reply?.trim() || getFunnyReply();
      const looksConfused = reply.length < 30 && !reply.includes("Milan");
      const finalReply = looksConfused ? getFunnyReply() : reply;

      setLines(p => [
        ...p.filter(l => l.type !== "loading"),
        { type: "output", text: finalReply },
        { type: "nudge" },
      ]);
      setHistory(h => [...h, { role: "user", content: text }, { role: "assistant", content: finalReply }]);
      setMsgCount(c => c + 1);
    } catch {
      setLines(p => [
        ...p.filter(l => l.type !== "loading"),
        { type: "output", text: getFunnyReply(), color: "#f87171" },
      ]);
      setMsgCount(c => c + 1);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  const gh = profile.github_url || "https://github.com/krmilan";
  const li = profile.linkedin_url || "https://linkedin.com";
  const extraLinks: ExtraLink[] = profile.extra_links ?? [];
  const limitReached = msgCount >= MAX_MESSAGES;

  return (
    <section
      id="about"
      data-snap
      className="hero-pad"
     style={{ position: "relative", overflow: "visible", minHeight: "100vh", display: "flex", alignItems: "center" }}
    >
      <div style={{ maxWidth: 1152, margin: "0 auto", width: "100%", position: "relative", zIndex: 1 }}>
        <div className="hero-grid">
          {/* LEFT — identity */}
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
              <a href="#projects" aria-label="View Projects" style={{ padding: "13px 26px", borderRadius: 12, fontWeight: 600, fontSize: 14, background: "linear-gradient(135deg, #7c6fcd, #9d8ff0)", color: "white", textDecoration: "none", boxShadow: "0 0 32px rgba(124,111,205,0.4)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: "DM Sans, sans-serif" }}>View Projects</a>
              <a href="#chat" aria-label="Ask AI Assistant" style={{ padding: "13px 26px", borderRadius: 12, fontWeight: 600, fontSize: 14, background: "rgba(255,255,255,0.07)", color: "white", border: "1px solid rgba(255,255,255,0.14)", textDecoration: "none", display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: "DM Sans, sans-serif" }}>Ask AI Assistant</a>
              <a href={profile.resume_url ?? "/resume.pdf"} aria-label="Download Resume" style={{ padding: "13px 26px", borderRadius: 12, fontWeight: 600, fontSize: 14, background: "rgba(255,255,255,0.04)", color: "#cbd5e1", border: "1px solid rgba(255,255,255,0.09)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "DM Sans, sans-serif" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                Resume
              </a>
            </div>
          </div>

          {/* RIGHT — interactive terminal chat */}
          <div className="terminal-card" style={{ position: "relative" }}>
            <div style={{ position: "absolute", inset: -20, background: "radial-gradient(ellipse, rgba(124,111,205,0.18) 0%, transparent 70%)", borderRadius: 24, filter: "blur(20px)", pointerEvents: "none" }} />
            <div className="glass-bright" style={{ borderRadius: 20, width: 360, boxShadow: "0 32px 64px rgba(0,0,0,0.5)", position: "relative", overflow: "hidden" }}>

              {/* Title bar */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {["rgba(255,100,100,0.8)", "rgba(255,200,0,0.8)", "rgba(0,220,100,0.8)"].map((c, i) => (
                    <div key={i} style={{ width: 12, height: 12, borderRadius: "50%", background: c }} />
                  ))}
                  <span style={{ marginLeft: 6, fontSize: 11, color: "#64748b", fontFamily: "monospace" }}>portfolio-rag</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10, fontFamily: "monospace", color: "#334155" }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#00ffaa", boxShadow: "0 0 8px #00ffaa", animation: "glow-pulse 1.2s ease-in-out infinite" }} />
                  <span style={{ color: "#00ffaa", opacity: 0.7 }}>LIVE</span>
                </div>
              </div>

              {/* Terminal output */}
              <div
                ref={terminalRef}
                style={{ height: 220, overflowY: "auto", padding: "14px 16px", fontFamily: "monospace", fontSize: 12, lineHeight: 1.7, display: "flex", flexDirection: "column", gap: 2, position: "relative" }}
                onClick={() => inputRef.current?.focus()}
              >
                {/* scanline overlay */}
                <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)", pointerEvents: "none", zIndex: 1 }} />
                {lines.map((line, i) => {
                  if (line.type === "input") return (
                    <div key={i} style={{ display: "flex", gap: 8 }}>
                      <span style={{ color: "#9d8ff0", flexShrink: 0 }}>❯</span>
                      <span style={{ color: "#e2e8f0" }}>{line.text}</span>
                    </div>
                  );
                  if (line.type === "output") return (
                    <div key={i} style={{ paddingLeft: 16, color: line.color ?? "#94a3b8", whiteSpace: "pre-wrap", wordBreak: "break-word", display: "flex", gap: 8, alignItems: "flex-start" }}>
                      <span style={{ color: "#1e3a4a", fontSize: 10, flexShrink: 0, marginTop: 2, fontVariantNumeric: "tabular-nums" }}>{String(i).padStart(2, "0")}</span>
                      <span>{line.text}</span>
                    </div>
                  );
                  if (line.type === "loading") return (
                    <div key={i} style={{ paddingLeft: 16, display: "flex", gap: 4, alignItems: "center" }}>
                      {[0, 150, 300].map(d => (
                        <div key={d} style={{ width: 5, height: 5, borderRadius: "50%", background: "#9d8ff0", animation: "bounce-dot 1.2s ease-in-out infinite", animationDelay: `${d}ms` }} />
                      ))}
                    </div>
                  );
                  if (line.type === "nudge") return (
                    <div key={i} style={{ paddingLeft: 16, marginTop: 4 }}>
                      <span style={{ color: "#f59e0b" }}>⚡ limit reached · </span>
                      <a href="#chat" style={{ color: "#00d4ff", textDecoration: "none", borderBottom: "1px solid rgba(0,212,255,0.4)" }}>open full chat ↓</a>
                    </div>
                  );
                  return null;
                })}
              </div>

              {/* Quick suggestions — shown before first message */}
              {msgCount === 0 && (
                <div style={{ padding: "0 12px 10px", display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {["How does RAG work here?", "What's the stack?", "Tell me about projects"].map(s => (
                    <button key={s} onClick={() => handleSend(s)} style={{ fontSize: 11, padding: "4px 10px", borderRadius: 6, cursor: "pointer", background: "transparent", color: "#64748b", border: "1px solid rgba(255,255,255,0.08)", fontFamily: "monospace", transition: "all 0.15s" }}
                      onMouseEnter={e => { (e.target as HTMLElement).style.color = "#9d8ff0"; (e.target as HTMLElement).style.borderColor = "rgba(157,143,240,0.35)"; }}
                      onMouseLeave={e => { (e.target as HTMLElement).style.color = "#64748b"; (e.target as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)"; }}
                    >{s}</button>
                  ))}
                </div>
              )}

              {/* Input row */}
              <div style={{ padding: "10px 14px", borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", gap: 8, background: "rgba(0,0,0,0.15)" }}>
                <span style={{ color: "#9d8ff0", fontFamily: "monospace", fontSize: 13, flexShrink: 0 }}>❯</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                  placeholder={limitReached ? "open full chat for more ↓" : "ask anything..."}
                  disabled={loading || limitReached}
                  style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 12, color: limitReached ? "#334155" : "white", caretColor: "#9d8ff0", fontFamily: "monospace" }}
                />
                <button
                  onClick={() => handleSend()}
                  disabled={loading || !input.trim() || limitReached}
                  aria-label="Send"
                  style={{ width: 28, height: 28, borderRadius: 7, border: "none", cursor: input.trim() && !loading && !limitReached ? "pointer" : "not-allowed", background: input.trim() && !loading && !limitReached ? "rgba(157,143,240,0.25)" : "transparent", color: input.trim() && !loading && !limitReached ? "#9d8ff0" : "#334155", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s", flexShrink: 0 }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"/>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                  </svg>
                </button>
              </div>

              {/* Footer label */}
              <div style={{ padding: "6px 14px 10px", fontSize: 10, fontFamily: "monospace", color: "#1e4a3a", letterSpacing: "0.05em", display: "flex", gap: 8 }}>
                <span style={{ color: "#0d3d2e" }}>▸</span>
                <span style={{ color: "#00ffaa", opacity: 0.3 }}>pgvector</span>
                <span style={{ color: "#1e3a4a" }}>·</span>
                <span style={{ color: "#9d8ff0", opacity: 0.3 }}>gemini-001</span>
                <span style={{ color: "#1e3a4a" }}>·</span>
                <span style={{ color: "#00d4ff", opacity: 0.3 }}>groq llama-3.1</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="scroll-hint">
        <span style={{ fontSize: 9, letterSpacing: "0.35em", textTransform: "uppercase", color: "#334155", fontFamily: "DM Sans, sans-serif" }}>Scroll</span>
        <div style={{ width: 1, height: 36, background: "linear-gradient(to bottom, #334155, transparent)", animation: "scroll-line 1.8s ease-in-out infinite" }} />
        <style>{`
          @keyframes scroll-line {
            0% { opacity: 0; transform: scaleY(0); transform-origin: top; }
            50% { opacity: 1; transform: scaleY(1); }
            100% { opacity: 0; transform: scaleY(1); }
          }
          .scroll-hint {
            position: absolute; bottom: 32px; left: 50%; transform: translateX(-50%);
            display: flex; flex-direction: column; align-items: center; gap: 6px;
            pointer-events: none; z-index: 2;
          }
          @media (max-width: 768px) { .scroll-hint { display: none; } }
        `}</style>
      </div>
    </section>
  );
}
