"use client";

import React, { useState, useRef, useEffect } from "react";
import { sendChat, type ChatMessage } from "@/lib/api";

type MascotState = "idle" | "typing" | "active";
interface Message extends ChatMessage { id: string; sources?: string[]; }

const SUGGESTIONS = [
  "What's Milan's tech stack?",
  "How does the RAG system work?",
  "What projects has Milan built?",
  "Tell me about Milan's background",
];

// Rotating fun status labels in title bar
const STATUS_LABELS = ["thinking...", "searching vectors...", "grounding response...", "almost there..."];

function renderContent(text: string) {
  const lines = text.split("\n").filter((l, i, arr) => !(l.trim() === "" && arr[i - 1]?.trim() === ""));
  const nodes: React.ReactNode[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // Section header: ends with ":" and not a sentence (no period, short)
    if (trimmed.endsWith(":") && trimmed.length < 40 && !trimmed.includes(".")) {
      nodes.push(
        <p key={i} style={{ color: "#00d4ff", fontWeight: 700, fontSize: 12, letterSpacing: "0.04em", textTransform: "uppercase", margin: "10px 0 4px", opacity: 0.9 }}>
          {trimmed.slice(0, -1)}
        </p>
      );
    }
    // Bullet
    else if (trimmed.startsWith("* ") || trimmed.startsWith("- ") || trimmed.startsWith("• ")) {
      const content = trimmed.replace(/^[\*\-•]\s+/, "");
      const parts = content.split(/(\*\*[^*]+\*\*)/g);
      nodes.push(
        <div key={i} style={{ display: "flex", gap: 8, margin: "2px 0", alignItems: "flex-start" }}>
          <span style={{ color: "#9d8ff0", fontSize: 10, marginTop: 5, flexShrink: 0 }}>▸</span>
          <span style={{ color: "#cbd5e1", fontSize: 14, lineHeight: 1.6 }}>
            {parts.map((p, j) => p.startsWith("**") && p.endsWith("**")
              ? <strong key={j} style={{ color: "white", fontWeight: 600 }}>{p.slice(2, -2)}</strong>
              : p)}
          </span>
        </div>
      );
    }
    // Numbered list
    else if (/^\d+\.\s/.test(trimmed)) {
      const num = trimmed.match(/^(\d+)\./)?.[1];
      const content = trimmed.replace(/^\d+\.\s+/, "");
      nodes.push(
        <div key={i} style={{ display: "flex", gap: 8, margin: "3px 0", alignItems: "flex-start" }}>
          <span style={{ color: "#9d8ff0", fontSize: 11, fontWeight: 700, flexShrink: 0, minWidth: 16 }}>{num}.</span>
          <span style={{ color: "#cbd5e1", fontSize: 14, lineHeight: 1.6 }}>{content}</span>
        </div>
      );
    }
    // Empty line → small spacer
    else if (trimmed === "") {
      nodes.push(<div key={i} style={{ height: 4 }} />);
    }
    // Normal paragraph
    else {
      const parts = trimmed.split(/(\*\*[^*]+\*\*)/g);
      nodes.push(
        <p key={i} style={{ margin: "2px 0", color: "#e2e8f0", fontSize: 14, lineHeight: 1.65 }}>
          {parts.map((p, j) => p.startsWith("**") && p.endsWith("**")
            ? <strong key={j} style={{ color: "white", fontWeight: 600 }}>{p.slice(2, -2)}</strong>
            : p)}
        </p>
      );
    }
    i++;
  }
  return nodes;
}

export default function ChatSection({ onMascotStateChange }: { onMascotStateChange?: (s: MascotState) => void }) {
  const [messages, setMessages] = useState<Message[]>([
    { id: "init", role: "assistant", content: "Hey! I'm Milan's AI assistant — ask me anything about his stack, projects, or architecture decisions." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusIdx, setStatusIdx] = useState(0);
  const statusRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasMounted = useRef(false);

  useEffect(() => {
    if (!hasMounted.current) { hasMounted.current = true; return; }
    const container = document.querySelector("[data-chat-messages]") as HTMLElement | null;
    if (container) container.scrollTop = container.scrollHeight;
  }, [messages]);

  // Block wheel/touch from reaching body snap container while scrolling inside chat
  useEffect(() => {
    const el = document.querySelector("[data-chat-messages]") as HTMLElement | null;
    if (!el) return;
    const block = (e: Event) => e.stopPropagation();
    el.addEventListener("wheel", block, { passive: false });
    el.addEventListener("touchmove", block, { passive: false });
    return () => {
      el.removeEventListener("wheel", block);
      el.removeEventListener("touchmove", block);
    };
  }, []);

  async function handleSend() {
    const msg = input.trim();
    if (!msg || loading) return;
    setMessages(p => [...p, { id: Date.now().toString(), role: "user", content: msg }]);
    setInput("");
    setLoading(true);
    setStatusIdx(0);
    statusRef.current = setInterval(() => setStatusIdx(i => (i + 1) % STATUS_LABELS.length), 900);
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
    } finally {
      setLoading(false);
      if (statusRef.current) clearInterval(statusRef.current);
    }
  }

  return (
    <section id="chat" data-snap className="section-pad" style={{ overflowY: "auto", justifyContent: "center", paddingTop: 80 }}>
      <style>{`@media (max-width: 768px) { #chat.section-pad { padding-top: 72px !important; padding-bottom: 40px !important; justify-content: flex-start !important; } }`}</style>
      <div style={{ maxWidth: 860, margin: "0 auto", width: "100%", position: "relative", zIndex: 1 }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <p style={{ fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", color: "#9d8ff0", marginBottom: 10, fontWeight: 600 }}>AI Sandbox</p>
          <h2 className="font-display" style={{ fontSize: "clamp(24px, 3.5vw, 38px)", fontWeight: 900, color: "white", marginBottom: 8 }}>
            Ask Me <span style={{ background: "linear-gradient(135deg, #9d8ff0, #00d4ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Anything</span>
          </h2>
          <p style={{ color: "#94a3b8", fontSize: 14 }}>RAG-powered assistant grounded in real portfolio content</p>
        </div>

        {/* Card */}
        <div style={{ position: "relative" }} onClick={e => e.stopPropagation()} onWheel={e => e.stopPropagation()} onTouchMove={e => e.stopPropagation()}>
          <div style={{ position: "absolute", inset: -20, background: "radial-gradient(ellipse, rgba(124,111,205,0.1) 0%, transparent 70%)", borderRadius: 28, filter: "blur(20px)", pointerEvents: "none" }} />
          <div className="glass-bright" style={{ borderRadius: 24, overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,0.5)", position: "relative" }}>

            {/* Top bar */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 20px", borderBottom: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)", flexWrap: "wrap", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ display: "flex", gap: 6 }}>
                  {["rgba(255,100,100,0.7)", "rgba(255,200,0,0.7)", "rgba(0,220,100,0.7)"].map((c, i) => (
                    <div key={i} style={{ width: 11, height: 11, borderRadius: "50%", background: c }} />
                  ))}
                </div>
                <span style={{ fontSize: 11, fontFamily: "monospace", color: "#64748b" }}>portfolio-rag</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, fontFamily: "monospace", color: "#475569" }}>
                {loading ? (
                  <span style={{ color: "#9d8ff0", animation: "fade-cycle 0.4s ease" }}>{STATUS_LABELS[statusIdx]}</span>
                ) : (
                  <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#00ffaa", boxShadow: "0 0 6px #00ffaa", animation: "glow-pulse 2s ease-in-out infinite" }} />
                    gemini-embedding-001
                  </span>
                )}
              </div>
            </div>

            {/* Messages */}
      <style>{`
        @keyframes wave-bar { 0%, 100% { transform: scaleY(0.4); opacity: 0.5; } 50% { transform: scaleY(1); opacity: 1; } }
        @keyframes fade-cycle { 0% { opacity: 0; transform: translateY(4px); } 100% { opacity: 1; transform: translateY(0); } }
        .chat-messages { height: clamp(320px, 42vh, 480px); }
        @media (max-width: 768px) { .chat-messages { height: auto; min-height: 220px; max-height: 45vh; } }
      `}</style>
            <div data-chat-messages className="chat-messages" style={{ overflowY: "auto", padding: "20px 22px", display: "flex", flexDirection: "column", gap: 16 }}>
              {messages.length === 1 && (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, padding: "24px 0", opacity: 0.5 }}>
                  <div style={{ fontSize: 28 }}>⚡</div>
                  <p style={{ fontSize: 12, color: "#475569", fontFamily: "monospace", textAlign: "center" }}>RAG pipeline ready · 17 docs indexed</p>
                </div>
              )}
              {messages.map((msg, idx) => (
                <div key={msg.id} style={{ display: "flex", gap: 10, flexDirection: msg.role === "user" ? "row-reverse" : "row", animation: "slide-in 0.25s ease forwards" }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: 9, flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, fontWeight: 700, fontFamily: "Syne, sans-serif",
                    background: msg.role === "user"
                      ? "linear-gradient(135deg, #7c6fcd, #9d8ff0)"
                      : "linear-gradient(135deg, rgba(0,212,255,0.15), rgba(0,255,170,0.08))",
                    color: msg.role === "user" ? "white" : "#00d4ff",
                    border: msg.role === "user" ? "none" : "1px solid rgba(0,212,255,0.3)",
                    boxShadow: msg.role === "user"
                      ? "0 0 10px rgba(124,111,205,0.35)"
                      : idx === messages.length - 1 ? "0 0 12px rgba(0,212,255,0.2)" : "none",
                  }}>
                    {msg.role === "user" ? "M" : "AI"}
                  </div>
                  <div style={{
                    maxWidth: msg.role === "user" ? "72%" : "92%",
                    width: msg.role === "assistant" ? "100%" : undefined,
                    padding: "11px 16px", borderRadius: 14, fontSize: 14, lineHeight: 1.65,
                    borderTopRightRadius: msg.role === "user" ? 4 : 14,
                    borderTopLeftRadius: msg.role === "user" ? 14 : 4,
                    background: msg.role === "user" ? "rgba(124,111,205,0.15)" : "rgba(255,255,255,0.04)",
                    border: msg.role === "user" ? "1px solid rgba(124,111,205,0.25)" : "1px solid rgba(255,255,255,0.07)",
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
                  <div style={{ width: 30, height: 30, borderRadius: 9, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, background: "linear-gradient(135deg, rgba(0,212,255,0.15), rgba(0,255,170,0.08))", color: "#00d4ff", border: "1px solid rgba(0,212,255,0.3)", boxShadow: "0 0 12px rgba(0,212,255,0.2)" }}>AI</div>
                  <div style={{ padding: "13px 16px", borderRadius: 14, borderTopLeftRadius: 4, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", display: "flex", alignItems: "center", gap: 3 }}>
                    {[0, 1, 2, 3].map(d => (
                      <div key={d} style={{ width: 3, height: 14, borderRadius: 2, background: "#9d8ff0", animation: "wave-bar 1s ease-in-out infinite", animationDelay: `${d * 120}ms` }} />
                    ))}
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Suggestions */}
            {messages.length === 1 && (
              <div style={{ padding: "10px 22px", borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", flexWrap: "wrap", gap: 8 }}>
                {[
                  { text: "What's Milan's tech stack?", emoji: "⚡" },
                  { text: "How does the RAG system work?", emoji: "🔍" },
                  { text: "What projects has Milan built?", emoji: "🚀" },
                  { text: "Tell me about Milan's background", emoji: "👤" },
                ].map(({ text, emoji }) => (
                  <button key={text} aria-label={`Suggested question: ${text}`} onClick={() => { setInput(text); inputRef.current?.focus(); }} style={{
                    fontSize: 12, padding: "7px 13px", borderRadius: 20, cursor: "pointer",
                    background: "rgba(157,143,240,0.06)", color: "#94a3b8",
                    border: "1px solid rgba(157,143,240,0.15)", transition: "all 0.2s",
                    fontFamily: "DM Sans, sans-serif", display: "flex", alignItems: "center", gap: 6,
                  }}
                    onMouseEnter={e => { const el = e.currentTarget; el.style.color = "#e2e8f0"; el.style.borderColor = "rgba(157,143,240,0.45)"; el.style.background = "rgba(157,143,240,0.12)"; }}
                    onMouseLeave={e => { const el = e.currentTarget; el.style.color = "#94a3b8"; el.style.borderColor = "rgba(157,143,240,0.15)"; el.style.background = "rgba(157,143,240,0.06)"; }}
                  ><span>{emoji}</span>{text}</button>
                ))}
              </div>
            )}

            {/* Input */}
            <div style={{ padding: "12px 16px", borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", gap: 10, alignItems: "center", background: "rgba(255,255,255,0.02)" }}>
              <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "10px 14px" }} onClick={e => e.stopPropagation()} onPointerDown={e => e.stopPropagation()}>
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
              <button onClick={handleSend} onPointerDown={e => e.stopPropagation()} disabled={loading || !input.trim()} aria-label="Send message" style={{
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