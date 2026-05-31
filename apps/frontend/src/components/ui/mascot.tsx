"use client";
import { useEffect, useRef, useState, useCallback } from "react";

type MascotState = "idle" | "walking" | "sleeping" | "waving";

const QUIPS = [
  "Psst… try the AI chat! 👇",
  "Next.js + FastAPI 🚀",
  "Ask me about Milan!",
  "Open to work! 👀",
  "RAG pipeline inside 🧠",
  "Lighthouse: 99 🏆",
];

const FACE: Record<MascotState, string> = {
  idle:     "( ◕‿◕ )",
  walking:  "( >‿< )",
  sleeping: "( -‿- )zzz",
  waving:   "( ^‿^ )ﾉ",
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

  useEffect(() => {
    // Hide on mobile
    if (window.innerWidth < 768) return;
    const t = setTimeout(() => setVisible(true), 1500);
    return () => clearTimeout(t);
  }, []);

  const pickTarget = useCallback(() => {
    // Stay in left/right edges, not center — less distracting
    const side = Math.random() > 0.5;
    const x = side
      ? 40 + Math.random() * 120          // left edge zone
      : window.innerWidth - 160 + Math.random() * 100; // right edge zone
    const y = 100 + Math.random() * (window.innerHeight - 250);
    setFlipped(x < targetRef.current.x);
    targetRef.current = { x, y };
    setState("walking");
  }, []);

  // Wander every 6–10s (much slower)
  useEffect(() => {
    if (!visible) return;
    pickTarget();
    const schedule = () => {
      const delay = 12000 + Math.random() * 6000;
      return setTimeout(() => {
        pickTarget();
        timerRef.current = schedule();
      }, delay);
    };
    const timerRef = { current: schedule() };
    return () => clearTimeout(timerRef.current);
  }, [visible, pickTarget]);

  // Very slow smooth movement
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

  // Occasional sleep
  useEffect(() => {
    const id = setInterval(() => {
      if (Math.random() < 0.2) {
        setState("sleeping");
        setTimeout(() => setState("idle"), 5000);
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

  const color = state === "sleeping" ? "rgba(100,116,139,0.9)"
    : state === "waving" ? "rgba(0,255,170,0.9)"
    : state === "walking" ? "rgba(0,212,255,0.9)"
    : "rgba(124,111,205,0.9)";

  return (
    <div
      onClick={handleClick}
      style={{
        position: "fixed",
        left: pos.x - 32,
        top: pos.y - 40,
        zIndex: 9999,
        cursor: "pointer",
        userSelect: "none",
        transition: "opacity 0.8s ease",
      }}
    >
      {bubble && (
        <div style={{
          position: "absolute",
          bottom: 72,
          left: "50%",
          transform: `translateX(-50%) scaleX(${flipped ? -1 : 1})`,
          background: "rgba(13,13,26,0.97)",
          border: "1px solid rgba(157,143,240,0.5)",
          borderRadius: 12,
          padding: "6px 11px",
          fontSize: 11,
          fontFamily: "DM Sans, sans-serif",
          fontWeight: 500,
          color: "#e2e8f0",
          whiteSpace: "nowrap",
          boxShadow: "0 4px 24px rgba(124,111,205,0.3)",
          animation: "bubble-in 0.2s ease",
        }}>
          {bubble}
          <div style={{
            position: "absolute", bottom: -6, left: "50%",
            transform: "translateX(-50%)",
            width: 0, height: 0,
            borderLeft: "5px solid transparent",
            borderRight: "5px solid transparent",
            borderTop: "6px solid rgba(157,143,240,0.5)",
          }} />
        </div>
      )}

      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        transform: `scaleX(${flipped ? -1 : 1})`,
        transition: "transform 0.4s ease",
        filter: `drop-shadow(0 0 8px ${color})`,
        animation: state === "sleeping" ? "mascot-sway 4s ease-in-out infinite"
          : state === "walking" ? "mascot-walk 0.6s ease-in-out infinite alternate"
          : state === "waving" ? "mascot-wave 0.3s ease-in-out 3"
          : "mascot-float 4s ease-in-out infinite",
      }}>
        {/* Antenna */}
        <div style={{ position: "relative", width: 2, height: 8, background: color, borderRadius: 2, marginBottom: -2 }}>
          <div style={{ position: "absolute", top: -4, left: "50%", transform: "translateX(-50%)", width: 5, height: 5, borderRadius: "50%", background: color, animation: "blink 2.5s ease-in-out infinite" }} />
        </div>
        {/* Face */}
        <div style={{ background: color, borderRadius: 10, padding: "3px 9px", fontSize: 10, fontFamily: "monospace", fontWeight: 700, color: "#0d0d1a", whiteSpace: "nowrap", minWidth: 76, textAlign: "center", transition: "background 0.4s" }}>
          {FACE[state]}
        </div>
        {/* Body */}
        <div style={{ width: 32, height: 22, background: `linear-gradient(160deg, ${color}, rgba(0,0,0,0.4))`, borderRadius: 7, border: `1px solid ${color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: "#0d0d1a", fontWeight: 900, transition: "all 0.4s" }}>
          AI
        </div>
        {/* Legs */}
        <div style={{ display: "flex", gap: 6 }}>
          {[0, 1].map(i => (
            <div key={i} style={{ width: 7, height: 8, background: color, borderRadius: "0 0 3px 3px", transition: "background 0.4s",
              animation: state === "walking" ? `leg${i} 0.6s ease-in-out infinite alternate` : "none"
            }} />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes mascot-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
        @keyframes mascot-walk  { from{transform:translateY(0) rotate(-1deg)} to{transform:translateY(-2px) rotate(1deg)} }
        @keyframes mascot-wave  { 0%,100%{transform:rotate(0)} 50%{transform:rotate(10deg)} }
        @keyframes mascot-sway  { 0%,100%{transform:rotate(-4deg)} 50%{transform:rotate(4deg)} }
        @keyframes blink { 0%,88%,100%{opacity:1} 94%{opacity:0} }
        @keyframes bubble-in { from{opacity:0;transform:translateX(-50%) scale(0.8)} to{opacity:1;transform:translateX(-50%) scale(1)} }
        @keyframes leg0 { from{transform:translateY(0)} to{transform:translateY(3px)} }
        @keyframes leg1 { from{transform:translateY(3px)} to{transform:translateY(0)} }
      `}</style>
    </div>
  );
}
