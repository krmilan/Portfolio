"use client";

import { useState, useRef, useEffect } from "react";
import { sendChat, type ChatMessage } from "@/lib/api";

type MascotState = "idle" | "typing" | "active";
interface Message extends ChatMessage { id: string; sources?: string[]; }

const SUGGESTIONS = [
  "What's Milan's tech stack?",
  "How does the RAG system work?",
  "What projects has Milan built?",
  "Tell me about Milan's background",
];

function renderContent(text: string) {
  return text.split("\n").map((line, i) => {
    if (line.startsWith("* ") || line.startsWith("- ")) {
      return <p key={i} style={{ paddingLeft: 14, color: "#e2e8f0", margin: "3px 0" }}>• {line.slice(2)}</p>;
    }
    if (/^\d+\. /.test(line)) {
      return <p key={i} style={{ paddingLeft: 14, color: "#e2e8f0", margin: "3px 0" }}>{line}</p>;
    }
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    return (
      <p key={i} style={{ margin: "3px 0", color: "#e2e8f0" }}>
        {parts.map((part, j) =>
          part.startsWith("**") && part.endsWith("**")
            ? <strong key={j} style={{ color: "white", fontWeight: 700 }}>{part.slice(2, -2)}</strong>
            : part
        )}
      </p>
    );
  });
}

export default function ChatSection({ onMascotStateChange }: { onMascotStateChange?: (s: MascotState) => void }) {
  const [messages, setMessages] = useState<Message[]>([
    { id: "init", role: "assistant", content: "Hey! I'm Milan's AI assistant — ask me anything about his stack, projects, or architecture decisions." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasMounted = useRef(false);

  useEffect(() => {
    if (!hasMounted.current) { hasMounted.current = true; return; }
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    const msg = input.trim();
    if (!msg || loading) return;
    setMessages(p => [...p, { id: Date.now().toString(), role: "user", content: msg }]);
    setInput("");
    setLoading(true);
    onMascotStateChange?.("typing");
    try {
      const history = messages.filter(m => m.id !== "init").map(({ role, content }) => ({ role, content }));
      const data = await sendChat(msg, history);
      setMessages(p => [...p, { id: (Date.now() + 1).toString(), role: "assistant", content: data.reply, sources: data.sources }]);
      onMascotStateChange?.("active");
      setTimeout(() => onMascotStateChange?.("idle"), 3000);
    } catch {
      setMessages(p => [...p, { id: (Date.now() + 1).toString(), role: "assistant", content: "Something went wrong. Please try again." }]);
      onMascotStateChange?.("idle");
    } finally { setLoading(false); }
  }

  return (
    <section id="chat" style={{ minHeight: "100vh", display: "flex", alignItems: "center", padding: "80px 24px", position: "relative" }}>
      <div style={{ maxWidth: 860, margin: "0 auto", width: "100%", position: "relative", zIndex: 1 }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 44 }}>
          <p style={{ fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", color: "#9d8ff0", marginBottom: 16, fontWeight: 600 }}>AI Sandbox</p>
          <h2 className="font-display" style={{ fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 900, color: "white", marginBottom: 14 }}>
            Ask Me <span style={{ background: "linear-gradient(135deg, #9d8ff0, #00d4ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Anything</span>
          </h2>
          <p style={{ color: "#94a3b8", fontSize: 16 }}>RAG-powered assistant grounded in real portfolio content</p>
        </div>

        {/* Card */}
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", inset: -20, background: "radial-gradient(ellipse, rgba(124,111,205,0.1) 0%, transparent 70%)", borderRadius: 28, filter: "blur(20px)", pointerEvents: "none" }} />
          <div className="glass-bright" style={{ borderRadius: 24, overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,0.5)", position: "relative" }}>

            {/* Top bar */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 22px", borderBottom: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)", flexWrap: "wrap", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ display: "flex", gap: 6 }}>
                  {["rgba(255,100,100,0.7)", "rgba(255,200,0,0.7)", "rgba(0,220,100,0.7)"].map((c, i) => (
                    <div key={i} style={{ width: 11, height: 11, borderRadius: "50%", background: c }} />
                  ))}
                </div>
                <span style={{ fontSize: 11, fontFamily: "monospace", color: "#64748b" }}>portfolio-rag</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 11, fontFamily: "monospace", color: "#475569" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#00ffaa", boxShadow: "0 0 6px #00ffaa", animation: "glow-pulse 2s ease-in-out infinite" }} />
                  gemini-embedding-001
                </span>
                <span style={{ display: "none" }} className="md-only">llama-3.1-8b</span>
              </div>
            </div>

            {/* Messages */}
            <div data-chat-messages style={{ height: "clamp(380px, 50vh, 520px)", overflowY: "auto", padding: "28px 26px", display: "flex", flexDirection: "column", gap: 20 }}>
              {messages.map(msg => (
                <div key={msg.id} style={{ display: "flex", gap: 10, flexDirection: msg.role === "user" ? "row-reverse" : "row", animation: "slide-in 0.25s ease forwards" }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: 9, flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, fontWeight: 700, fontFamily: "Syne, sans-serif",
                    background: msg.role === "user" ? "linear-gradient(135deg, #7c6fcd, #9d8ff0)" : "rgba(255,255,255,0.06)",
                    color: msg.role === "user" ? "white" : "#00d4ff",
                    border: msg.role === "user" ? "none" : "1px solid rgba(0,212,255,0.2)",
                    boxShadow: msg.role === "user" ? "0 0 10px rgba(124,111,205,0.35)" : "none",
                  }}>
                    {msg.role === "user" ? "M" : "AI"}
                  </div>
                  <div style={{
                    maxWidth: "78%", padding: "11px 16px", borderRadius: 14, fontSize: 14, lineHeight: 1.65,
                    borderTopRightRadius: msg.role === "user" ? 4 : 14,
                    borderTopLeftRadius: msg.role === "user" ? 14 : 4,
                    background: msg.role === "user" ? "rgba(124,111,205,0.15)" : "rgba(255,255,255,0.05)",
                    border: msg.role === "user" ? "1px solid rgba(124,111,205,0.25)" : "1px solid rgba(255,255,255,0.09)",
                  }}>
                    {renderContent(msg.content)}
                    {msg.sources && msg.sources.length > 0 && (
                      <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", flexWrap: "wrap", gap: 5 }}>
                        {[...new Set(msg.sources)].map(src => (
                          <span key={src} style={{ fontSize: 10, padding: "2px 8px", borderRadius: 999, background: "rgba(0,212,255,0.08)", color: "#00d4ff", border: "1px solid rgba(0,212,255,0.2)", fontWeight: 600 }}>{src}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div style={{ display: "flex", gap: 10 }}>
                  <div style={{ width: 30, height: 30, borderRadius: 9, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, background: "rgba(255,255,255,0.06)", color: "#00d4ff", border: "1px solid rgba(0,212,255,0.2)" }}>AI</div>
                  <div style={{ padding: "13px 16px", borderRadius: 14, borderTopLeftRadius: 4, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)" }}>
                    <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                      {[0, 150, 300].map(d => (
                        <div key={d} style={{ width: 6, height: 6, borderRadius: "50%", background: "#9d8ff0", animation: "bounce-dot 1.2s ease-in-out infinite", animationDelay: `${d}ms` }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Suggestions */}
            {messages.length === 1 && (
              <div style={{ padding: "10px 22px", borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", flexWrap: "wrap", gap: 8 }}>
                {SUGGESTIONS.map(s => (
                  <button key={s} aria-label={`Suggested question: ${s}`} onClick={() => { setInput(s); inputRef.current?.focus(); }} style={{
                    fontSize: 12, padding: "6px 12px", borderRadius: 8, cursor: "pointer",
                    background: "transparent", color: "#94a3b8",
                    border: "1px solid rgba(255,255,255,0.09)", transition: "all 0.2s",
                    fontFamily: "DM Sans, sans-serif",
                  }}
                    onMouseEnter={e => { (e.target as HTMLElement).style.color = "#9d8ff0"; (e.target as HTMLElement).style.borderColor = "rgba(157,143,240,0.4)"; }}
                    onMouseLeave={e => { (e.target as HTMLElement).style.color = "#94a3b8"; (e.target as HTMLElement).style.borderColor = "rgba(255,255,255,0.09)"; }}
                  >{s}</button>
                ))}
              </div>
            )}

            {/* Input */}
            <div style={{ padding: "14px 18px", borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", gap: 10, alignItems: "center", background: "rgba(255,255,255,0.02)" }}>
              <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "10px 14px" }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "#475569", flexShrink: 0 }}>
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                <input ref={inputRef} type="text" value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                  placeholder="Ask about Milan's projects, stack, architecture..."
                  disabled={loading}
                  style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 16, color: "white", caretColor: "#00d4ff", fontFamily: "DM Sans, sans-serif" }}
                />
              </div>
              <button onClick={handleSend} disabled={loading || !input.trim()} aria-label="Send message" style={{
                width: 48, height: 48, borderRadius: 12, border: "none",
                cursor: input.trim() && !loading ? "pointer" : "not-allowed",
                background: input.trim() && !loading ? "linear-gradient(135deg, #7c6fcd, #9d8ff0)" : "rgba(255,255,255,0.05)",
                color: input.trim() && !loading ? "white" : "rgba(255,255,255,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: input.trim() && !loading ? "0 0 20px rgba(124,111,205,0.45)" : "none",
                transition: "all 0.3s", flexShrink: 0,
              }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"/>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <p style={{ textAlign: "center", fontSize: 11, color: "#475569", marginTop: 14, fontFamily: "monospace" }}>
          pgvector · semantic search · groq llama-3.1 · gemini embeddings
        </p>
      </div>
    </section>
  );
}