"use client";

import { useEffect, useState } from "react";

const LINES = [
  { text: "initializing milan.portfolio", delay: 0 },
  { text: "loading RAG pipeline...", delay: 300 },
  { text: "connecting to pgvector db...", delay: 600 },
  { text: "warming up Groq LLM...", delay: 900 },
  { text: "mounting Next.js app router...", delay: 1200 },
  { text: "ready.", delay: 1500, accent: true },
];

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [visibleLines, setVisibleLines] = useState<number[]>([]);
  const [done, setDone] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    LINES.forEach((line, i) => {
      setTimeout(() => {
        setVisibleLines(prev => [...prev, i]);
        if (i === LINES.length - 1) {
          setTimeout(() => {
            setFadeOut(true);
            setTimeout(onComplete, 600);
          }, 600);
        }
      }, line.delay);
    });
  }, [onComplete]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#080810",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "opacity 0.6s ease",
        opacity: fadeOut ? 0 : 1,
        pointerEvents: fadeOut ? "none" : "all",
      }}
    >
      <div style={{ width: "min(480px, 90vw)" }}>

        {/* Terminal header */}
        <div style={{
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "12px 12px 0 0",
          padding: "10px 16px",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}>
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ff5f57" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#febc2e" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#28c840" }} />
          <span style={{
            marginLeft: 8,
            fontSize: 12,
            color: "#475569",
            fontFamily: "monospace",
          }}>milan@portfolio:~</span>
        </div>

        {/* Terminal body */}
        <div style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderTop: "none",
          borderRadius: "0 0 12px 12px",
          padding: "24px",
          minHeight: 200,
          fontFamily: "monospace",
        }}>
          {LINES.map((line, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 10,
                opacity: visibleLines.includes(i) ? 1 : 0,
                transform: visibleLines.includes(i) ? "translateY(0)" : "translateY(4px)",
                transition: "opacity 0.3s ease, transform 0.3s ease",
              }}
            >
              <span style={{ color: "#7c6fcd", fontSize: 13 }}>→</span>
              <span style={{
                fontSize: 13,
                color: line.accent ? "#00ffaa" : "#94a3b8",
                fontWeight: line.accent ? 600 : 400,
              }}>
                {line.text}
                {line.accent && visibleLines.includes(i) && (
                  <span style={{
                    display: "inline-block",
                    width: 8,
                    height: 14,
                    background: "#00ffaa",
                    marginLeft: 4,
                    verticalAlign: "middle",
                    animation: "blink 1s step-end infinite",
                  }} />
                )}
              </span>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div style={{
          marginTop: 16,
          height: 2,
          background: "rgba(255,255,255,0.06)",
          borderRadius: 2,
          overflow: "hidden",
        }}>
          <div style={{
            height: "100%",
            background: "linear-gradient(90deg, #7c6fcd, #9d8ff0)",
            borderRadius: 2,
            width: `${(visibleLines.length / LINES.length) * 100}%`,
            transition: "width 0.3s ease",
          }} />
        </div>

      </div>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
