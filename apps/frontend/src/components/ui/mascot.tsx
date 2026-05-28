"use client";

import { useEffect, useState } from "react";

type MascotState = "sleeping" | "idle" | "blinking" | "typing" | "active";

interface MascotProps {
  state?: MascotState;
  size?: number;
}

export default function Mascot({ state = "idle", size = 80 }: MascotProps) {
  const [currentState, setCurrentState] = useState<MascotState>(state);

  useEffect(() => {
    setCurrentState(state);
  }, [state]);

  // random blink every 3-5s when idle
  useEffect(() => {
    if (currentState !== "idle") return;
    const schedule = () => {
      const delay = 3000 + Math.random() * 2000;
      return setTimeout(() => {
        setCurrentState("blinking");
        setTimeout(() => setCurrentState("idle"), 200);
        timerRef = schedule();
      }, delay);
    };
    let timerRef = schedule();
    return () => clearTimeout(timerRef);
  }, [currentState]);

  const isAsleep = currentState === "sleeping";
  const isTyping = currentState === "typing";
  const isActive = currentState === "active";
  const isBlinking = currentState === "blinking";

  return (
    <div
      style={{
        width: size,
        height: size,
        position: "relative",
        animation: isAsleep ? "none" : "float 4s ease-in-out infinite",
      }}
    >
      <svg
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: "100%", height: "100%" }}
      >
        {/* glow ring */}
        <circle
          cx="40"
          cy="40"
          r="36"
          fill="rgba(124,106,247,0.08)"
          style={{
            animation: isActive
              ? "pulse-glow 1.5s ease-in-out infinite"
              : "none",
          }}
        />

        {/* body */}
        <circle cx="40" cy="40" r="28" fill="#1e1e2e" />
        <circle
          cx="40"
          cy="40"
          r="28"
          stroke="url(#mascot-border)"
          strokeWidth="1.5"
          fill="none"
        />

        {/* face */}
        {isAsleep ? (
          <>
            {/* sleeping eyes */}
            <path
              d="M28 38 Q31 35 34 38"
              stroke="#7c6af7"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M46 38 Q49 35 52 38"
              stroke="#7c6af7"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
            {/* zzz */}
            <text
              x="54"
              y="28"
              fontSize="8"
              fill="#7c6af7"
              opacity="0.7"
              fontFamily="sans-serif"
            >
              z
            </text>
            <text
              x="58"
              y="22"
              fontSize="6"
              fill="#7c6af7"
              opacity="0.5"
              fontFamily="sans-serif"
            >
              z
            </text>
            {/* calm mouth */}
            <path
              d="M34 46 Q40 48 46 46"
              stroke="#5a5870"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
            />
          </>
        ) : (
          <>
            {/* open eyes */}
            <circle cx="31" cy="36" r="3" fill="#7c6af7" />
            <circle cx="49" cy="36" r="3" fill="#7c6af7" />
            {isBlinking && (
              <>
                <line
                  x1="28"
                  y1="36"
                  x2="34"
                  y2="36"
                  stroke="#7c6af7"
                  strokeWidth="2"
                />
                <line
                  x1="46"
                  y1="36"
                  x2="52"
                  y2="36"
                  stroke="#7c6af7"
                  strokeWidth="2"
                />
              </>
            )}

            {/* mouth */}
            {isTyping ? (
              <circle cx="40" cy="48" r="1.5" fill="#7c6af7" opacity="0.6" />
            ) : (
              <path
                d="M34 46 Q40 49 46 46"
                stroke="#7c6af7"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
            )}
          </>
        )}

        {/* gradient border definition */}
        <defs>
          <linearGradient
            id="mascot-border"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#7c6af7" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#7c6af7" stopOpacity="0.2" />
          </linearGradient>
          <style>{`
            @keyframes float {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-10px); }
            }
            @keyframes pulse-glow {
              0%, 100% { r: 36; opacity: 0.08; }
              50% { r: 40; opacity: 0.15; }
            }
          `}</style>
        </defs>
      </svg>
    </div>
  );
}
