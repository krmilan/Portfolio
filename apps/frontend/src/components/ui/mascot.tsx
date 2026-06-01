"use client";
import { useEffect, useRef, useState, useCallback } from "react";

type MascotState = "idle" | "walking" | "sleeping" | "waving" | "thinking";

const QUIPS = [
  "Psst… try the AI chat! 👇",
  "Next.js + FastAPI 🚀",
  "Ask me about Milan!",
  "Open to work! 👀",
  "RAG pipeline inside 🧠",
  "Lighthouse: 99 🏆",
  "Full-stack + AI 💡",
  "Built with pgvector 🔍",
];

// Eyes per state
const EYES: Record<MascotState, { l: string; r: string }> = {
  idle:     { l: "●", r: "●" },
  walking:  { l: "◉", r: "◉" },
  sleeping: { l: "—", r: "—" },
  waving:   { l: "^", r: "^" },
  thinking: { l: "◔", r: "◔" },
};

const MOUTH: Record<MascotState, string> = {
  idle:     "‿",
  walking:  "‿",
  sleeping: "~",
  waving:   "D",
  thinking: "o",
};

export default function Mascot() {
  const [pos, setPos] = useState({ x: 60, y: 300 });
  const [state, setState] = useState<MascotState>("idle");
  const [flipped, setFlipped] = useState(false);
  const [bubble, setBubble] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const targetRef = useRef({ x: 60, y: 300 });
  const animRef = useRef<number | undefined>(undefined);
  const quipIndex = useRef(0);
  const stateRef = useRef<MascotState>("idle");

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    if (window.innerWidth < 768) return;
    const t = setTimeout(() => setVisible(true), 1500);
    return () => clearTimeout(t);
  }, []);

  const pickTarget = useCallback(() => {
    const side = Math.random() > 0.5;
    const x = side
      ? 40 + Math.random() * 120
      : window.innerWidth - 160 + Math.random() * 100;
    const y = 100 + Math.random() * (window.innerHeight - 250);
    setFlipped(x < targetRef.current.x);
    targetRef.current = { x, y };
    setState("walking");
  }, []);

  useEffect(() => {
    if (!visible) return;
    pickTarget();
    const schedule = (): ReturnType<typeof setTimeout> => {
      const delay = 12000 + Math.random() * 6000;
      return setTimeout(() => {
        pickTarget();
        timerRef.current = schedule();
      }, delay);
    };
    const timerRef = { current: schedule() };
    return () => clearTimeout(timerRef.current);
  }, [visible, pickTarget]);

  useEffect(() => {
    const step = () => {
      setPos(p => {
        const dx = targetRef.current.x - p.x;
        const dy = targetRef.current.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 3) {
          setState(s => s === "walking" ? "idle" : s);
          return targetRef.current;
        }
        return { x: p.x + dx * 0.006, y: p.y + dy * 0.006 };
      });
      animRef.current = requestAnimationFrame(step);
    };
    animRef.current = requestAnimationFrame(step);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, []);

  // Occasional sleep or think
  useEffect(() => {
    const id = setInterval(() => {
      if (stateRef.current !== "idle") return;
      const r = Math.random();
      if (r < 0.2) {
        setState("sleeping");
        setTimeout(() => setState("idle"), 5000);
      } else if (r < 0.4) {
        setState("thinking");
        setTimeout(() => setState("idle"), 3000);
      }
    }, 15000);
    return () => clearInterval(id);
  }, []);

  const handleClick = () => {
    const q = QUIPS[quipIndex.current % QUIPS.length];
    quipIndex.current++;
    setBubble(q);
    setState("waving");
    setTimeout(() => setBubble(null), 2800);
    setTimeout(() => setState("idle"), 900);
  };

  if (!visible) return null;

  const color =
    state === "sleeping" ? "#64748b"
    : state === "thinking" ? "#f59e0b"
    : state === "waving"   ? "#00ffaa"
    : state === "walking"  ? "#00d4ff"
    : "#9d8ff0";

  const eyes = EYES[state];
  const mouth = MOUTH[state];

  const bodyAnim =
    state === "sleeping" ? "mascot-sway 4s ease-in-out infinite"
    : state === "walking" ? "mascot-walk 0.6s ease-in-out infinite alternate"
    : state === "waving"  ? "mascot-wave 0.3s ease-in-out 3"
    : state === "thinking"? "mascot-think 1.2s ease-in-out infinite"
    : "mascot-float 4s ease-in-out infinite";

  return (
    <div
      onClick={handleClick}
      style={{
        position: "fixed",
        left: pos.x - 32,
        top: pos.y - 50,
        zIndex: 9999,
        cursor: "pointer",
        userSelect: "none",
      }}
    >
      {/* Speech bubble — above head, proper cloud tail */}
      {bubble && (
        <div style={{
          position: "absolute",
          bottom: 90,
          left: "50%",
          transform: "translateX(-50%)",
          background: "rgba(13,13,26,0.97)",
          border: `1px solid ${color}55`,
          borderRadius: 10,
          padding: "5px 10px",
          fontSize: 11,
          fontFamily: "DM Sans, sans-serif",
          fontWeight: 500,
          color: "#e2e8f0",
          whiteSpace: "nowrap",
          boxShadow: `0 0 12px ${color}33`,
          animation: "bubble-in 0.2s ease",
          zIndex: 10000,
        }}>
          {bubble}
          {/* Tail pointing down to mascot */}
          <div style={{
            position: "absolute",
            bottom: -6,
            left: "50%",
            transform: "translateX(-50%)",
            width: 0, height: 0,
            borderLeft: "5px solid transparent",
            borderRight: "5px solid transparent",
            borderTop: `6px solid ${color}55`,
          }} />
        </div>
      )}

      {/* Thinking dots bubble */}
      {state === "thinking" && !bubble && (
        <div style={{
          position: "absolute",
          bottom: 88,
          left: "50%",
          transform: "translateX(-50%)",
          background: "rgba(13,13,26,0.97)",
          border: `1px solid ${color}55`,
          borderRadius: 10,
          padding: "5px 10px",
          fontSize: 13,
          color: color,
          whiteSpace: "nowrap",
          animation: "bubble-in 0.3s ease",
        }}>
          <span style={{ animation: "dot1 1.2s ease-in-out infinite" }}>●</span>{" "}
          <span style={{ animation: "dot2 1.2s ease-in-out infinite" }}>●</span>{" "}
          <span style={{ animation: "dot3 1.2s ease-in-out infinite" }}>●</span>
          <div style={{
            position: "absolute", bottom: -6, left: "50%",
            transform: "translateX(-50%)",
            width: 0, height: 0,
            borderLeft: "5px solid transparent",
            borderRight: "5px solid transparent",
            borderTop: `6px solid ${color}55`,
          }} />
        </div>
      )}

      {/* Mascot body */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        transform: `scaleX(${flipped ? -1 : 1})`,
        transition: "transform 0.4s ease",
        filter: `drop-shadow(0 0 6px ${color})`,
        animation: bodyAnim,
      }}>
        {/* Antenna */}
        <div style={{ position: "relative", width: 2, height: 8, background: color, borderRadius: 2, marginBottom: -2 }}>
          <div style={{
            position: "absolute", top: -4, left: "50%",
            transform: "translateX(-50%)",
            width: 5, height: 5, borderRadius: "50%",
            background: color,
            animation: state === "thinking" ? "blink 0.6s ease-in-out infinite" : "blink 2.5s ease-in-out infinite",
          }} />
        </div>

        {/* Head — helmet style */}
        <div style={{
          width: 46, height: 36,
          background: "rgba(13,13,26,0.95)",
          border: `1.5px solid ${color}`,
          borderRadius: "12px 12px 8px 8px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          position: "relative",
          transition: "border-color 0.4s",
        }}>
          {/* Visor strip */}
          <div style={{
            position: "absolute",
            top: 6,
            left: 4, right: 4,
            height: 14,
            background: `${color}18`,
            borderRadius: 4,
            border: `1px solid ${color}33`,
          }} />
          {/* Eyes */}
          <div style={{ display: "flex", gap: 8, position: "relative", zIndex: 1 }}>
            <span style={{ fontSize: 9, color, lineHeight: 1, transition: "color 0.4s" }}>{eyes.l}</span>
            <span style={{ fontSize: 9, color, lineHeight: 1, transition: "color 0.4s" }}>{eyes.r}</span>
          </div>
          {/* Mouth */}
          <span style={{ fontSize: 8, color: `${color}cc`, lineHeight: 1, position: "relative", zIndex: 1 }}>{mouth}</span>
        </div>

        {/* Body */}
        <div style={{
          width: 34, height: 24,
          background: "rgba(13,13,26,0.95)",
          border: `1.5px solid ${color}`,
          borderRadius: 6,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 8,
          fontFamily: "monospace",
          fontWeight: 900,
          color,
          letterSpacing: 1,
          transition: "border-color 0.4s, color 0.4s",
        }}>
          {state === "thinking" ? "···" : "AI"}
        </div>

        {/* Legs */}
        <div style={{ display: "flex", gap: 8 }}>
          {[0, 1].map(i => (
            <div key={i} style={{
              width: 7, height: 9,
              background: color,
              borderRadius: "0 0 3px 3px",
              transition: "background 0.4s",
              animation: state === "walking" ? `leg${i} 0.6s ease-in-out infinite alternate` : "none",
            }} />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes mascot-float  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
        @keyframes mascot-walk   { from{transform:translateY(0) rotate(-1deg)} to{transform:translateY(-2px) rotate(1deg)} }
        @keyframes mascot-wave   { 0%,100%{transform:rotate(0deg)} 50%{transform:rotate(12deg)} }
        @keyframes mascot-sway   { 0%,100%{transform:rotate(-4deg)} 50%{transform:rotate(4deg)} }
        @keyframes mascot-think  { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-2px) scale(1.03)} }
        @keyframes blink         { 0%,88%,100%{opacity:1} 94%{opacity:0} }
        @keyframes bubble-in     { from{opacity:0;transform:translateX(-50%) scale(0.85)} to{opacity:1;transform:translateX(-50%) scale(1)} }
        @keyframes leg0          { from{transform:translateY(0)} to{transform:translateY(3px)} }
        @keyframes leg1          { from{transform:translateY(3px)} to{transform:translateY(0)} }
        @keyframes dot1          { 0%,100%{opacity:0.2} 0%{opacity:1} }
        @keyframes dot2          { 0%,100%{opacity:0.2} 33%{opacity:1} }
        @keyframes dot3          { 0%,100%{opacity:0.2} 66%{opacity:1} }
      `}</style>
    </div>
  );
}
