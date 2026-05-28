"use client";

import { useEffect, useState } from "react";
import Mascot from "@/components/ui/mascot";

const ROLES = [
  "Full-Stack Engineer",
  "AI Engineer",
  "RAG Systems Builder",
  "Backend Engineer",
];

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [mascotState, setMascotState] = useState<"idle" | "typing">("idle");

  useEffect(() => {
    const current = ROLES[roleIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && displayed.length < current.length) {
      setMascotState("typing");
      timeout = setTimeout(() => {
        setDisplayed(current.slice(0, displayed.length + 1));
      }, 80);
    } else if (!deleting && displayed.length === current.length) {
      setMascotState("idle");
      timeout = setTimeout(() => setDeleting(true), 2000);
    } else if (deleting && displayed.length > 0) {
      setMascotState("typing");
      timeout = setTimeout(() => {
        setDisplayed(current.slice(0, displayed.length - 1));
      }, 40);
    } else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setRoleIndex((i) => (i + 1) % ROLES.length);
    }

    return () => clearTimeout(timeout);
  }, [displayed, deleting, roleIndex]);

  return (
    <section
      id="about"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "100px 24px 60px",
        position: "relative",
        zIndex: 1,
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          width: "100%",
          margin: "0 auto",
        }}
      >
        {/* top badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "6px 14px",
            borderRadius: "100px",
            border: "1px solid rgba(79,196,207,0.25)",
            background: "rgba(79,196,207,0.05)",
            marginBottom: "32px",
            animation: "fadeUp 0.6s ease both",
          }}
        >
          <span
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "#4fc4cf",
              boxShadow: "0 0 8px rgba(79,196,207,0.8)",
              animation: "pulse-glow 2s ease-in-out infinite",
              display: "inline-block",
            }}
          />
          <span
            style={{
              fontSize: "12px",
              color: "#4fc4cf",
              fontWeight: 500,
              letterSpacing: "0.05em",
            }}
          >
            OPEN TO WORK
          </span>
        </div>

        {/* name */}
        <h1
          style={{
            fontSize: "clamp(48px, 8vw, 96px)",
            fontWeight: 800,
            letterSpacing: "-0.04em",
            lineHeight: 1,
            marginBottom: "16px",
            animation: "fadeUp 0.6s ease 0.1s both",
          }}
        >
          Milan
          <br />
          <span className="text-gradient">Ray</span>
        </h1>

        {/* typewriter role */}
        <div
          style={{
            height: "48px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "24px",
            animation: "fadeUp 0.6s ease 0.2s both",
          }}
        >
          <Mascot size={40} state={mascotState} />
          <div
            style={{
              fontSize: "clamp(18px, 3vw, 26px)",
              color: "var(--text-secondary)",
              fontFamily: "var(--font-display)",
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              gap: "2px",
            }}
          >
            <span>{displayed}</span>
            <span
              style={{
                display: "inline-block",
                width: "2px",
                height: "1.2em",
                background: "var(--accent)",
                marginLeft: "2px",
                animation: "pulse-glow 1s step-end infinite",
                verticalAlign: "middle",
              }}
            />
          </div>
        </div>

        {/* bio */}
        <p
          style={{
            fontSize: "clamp(15px, 2vw, 18px)",
            color: "var(--text-secondary)",
            maxWidth: "560px",
            lineHeight: 1.8,
            marginBottom: "40px",
            animation: "fadeUp 0.6s ease 0.3s both",
          }}
        >
          I build production-grade systems where modern web engineering meets
          real AI capabilities — from RAG pipelines and vector search to
          full-stack applications built to ship.
        </p>

        {/* CTAs */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "12px",
            animation: "fadeUp 0.6s ease 0.4s both",
          }}
        >
          <a
            href="#projects"
            style={{
              padding: "12px 28px",
              borderRadius: "10px",
              background: "var(--accent)",
              color: "#fff",
              fontWeight: 600,
              fontSize: "15px",
              textDecoration: "none",
              fontFamily: "var(--font-display)",
              letterSpacing: "-0.01em",
              transition: "all 0.2s ease",
              boxShadow: "0 0 30px rgba(124,106,247,0.35)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "0 0 50px rgba(124,106,247,0.5)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 0 30px rgba(124,106,247,0.35)";
            }}
          >
            View Projects
          </a>

          <a
            href="#chat"
            style={{
              padding: "12px 28px",
              borderRadius: "10px",
              background: "transparent",
              color: "var(--text-primary)",
              fontWeight: 600,
              fontSize: "15px",
              textDecoration: "none",
              fontFamily: "var(--font-display)",
              letterSpacing: "-0.01em",
              border: "1px solid var(--border-hover)",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(124,106,247,0.5)";
              e.currentTarget.style.background = "rgba(124,106,247,0.06)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--border-hover)";
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Ask AI Assistant
          </a>

          <a
            href="https://github.com/krmilan"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: "12px 28px",
              borderRadius: "10px",
              background: "transparent",
              color: "var(--text-secondary)",
              fontWeight: 600,
              fontSize: "15px",
              textDecoration: "none",
              fontFamily: "var(--font-display)",
              letterSpacing: "-0.01em",
              border: "1px solid var(--border)",
              transition: "all 0.2s ease",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--border-hover)";
              e.currentTarget.style.color = "var(--text-primary)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--border)";
              e.currentTarget.style.color = "var(--text-secondary)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
            GitHub
          </a>
        </div>

        {/* scroll hint */}
        <div
          style={{
            marginTop: "80px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            animation: "fadeUp 0.6s ease 0.6s both",
          }}
        >
          <div
            style={{
              width: "1px",
              height: "40px",
              background:
                "linear-gradient(to bottom, transparent, var(--border-hover))",
            }}
          />
          <span
            style={{
              fontSize: "11px",
              color: "var(--text-muted)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            scroll to explore
          </span>
        </div>
      </div>
    </section>
  );
}