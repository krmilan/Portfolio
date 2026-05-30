"use client";

// Isolated client component — handles only the typewriter animation.
// Receives roles as a prop from the Server Component parent.

import { useEffect, useState } from "react";

const DEFAULT_ROLES = [
  "AI Engineer",
  "Full-Stack Dev",
  "RAG Architect",
  "Backend Engineer",
];

export default function HeroTypewriter({ roles }: { roles: string[] }) {
  const activeRoles = roles.length > 0 ? roles : DEFAULT_ROLES;

  const [roleIdx, setRoleIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const target = activeRoles[roleIdx];
    if (!deleting && displayed.length < target.length) {
      const t = setTimeout(
        () => setDisplayed(target.slice(0, displayed.length + 1)),
        80
      );
      return () => clearTimeout(t);
    }
    if (!deleting && displayed.length === target.length) {
      const t = setTimeout(() => setDeleting(true), 2200);
      return () => clearTimeout(t);
    }
    if (deleting && displayed.length > 0) {
      const t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 45);
      return () => clearTimeout(t);
    }
    if (deleting && displayed.length === 0) {
      setDeleting(false);
      setRoleIdx((i) => (i + 1) % activeRoles.length);
    }
  }, [displayed, deleting, roleIdx, activeRoles]);

  return (
    <div
      className="animate-fade-up delay-200"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        marginBottom: 20,
      }}
    >
      <div
        style={{
          width: 32,
          height: 2,
          background: "linear-gradient(90deg, #7c6fcd, #00d4ff)",
          flexShrink: 0,
        }}
      />
      <p
        className="font-display"
        style={{
          fontSize: "clamp(15px, 2.5vw, 20px)",
          fontWeight: 600,
          color: "#cbd5e1",
        }}
      >
        {displayed}
        <span
          style={{
            display: "inline-block",
            width: 2,
            height: "1em",
            background: "#00d4ff",
            marginLeft: 2,
            verticalAlign: "middle",
            animation: "blink-cursor 1s step-end infinite",
          }}
        />
      </p>
    </div>
  );
}
