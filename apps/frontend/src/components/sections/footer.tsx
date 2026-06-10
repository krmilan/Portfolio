"use client";

import { useState } from "react";

const CONTACT = [
  {
    label: "Email",
    value: "milanray.dev@gmail.com",
    href: "mailto:milanray.dev@gmail.com",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="2" y="4" width="20" height="16" rx="3"/>
        <polyline points="2,4 12,13 22,4"/>
      </svg>
    ),
    accent: "#9d8ff0",
  },
  {
    label: "GitHub",
    value: "github.com/krmilan",
    href: "https://github.com/krmilan",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
      </svg>
    ),
    accent: "#00d4ff",
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/krmilan",
    href: "https://linkedin.com/in/krmilan",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
    accent: "#00ffaa",
  },
];

const NAV_LINKS = [
  { label: "About",      href: "#about" },
  { label: "Skills",     href: "#skills" },
  { label: "Projects",   href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "AI Chat",    href: "#chat" },
];

function ContactCard({ item }: { item: typeof CONTACT[number] }) {
  const [hov, setHov] = useState(false);
  return (
    <a
      href={item.href}
      target={item.href.startsWith("mailto") ? undefined : "_blank"}
      rel="noopener noreferrer"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", alignItems: "center", gap: 16,
        padding: "16px 20px", borderRadius: 14, textDecoration: "none",
        background: hov ? `${item.accent}0d` : "rgba(255,255,255,0.025)",
        border: `1px solid ${hov ? item.accent + "33" : "rgba(255,255,255,0.07)"}`,
        boxShadow: hov ? `0 0 20px ${item.accent}14` : "none",
        transition: "all 0.25s ease",
      }}
    >
      <div style={{
        width: 40, height: 40, borderRadius: 10, flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: `${item.accent}15`, border: `1px solid ${item.accent}${hov ? "44" : "25"}`,
        color: item.accent, transition: "border-color 0.25s",
      }}>
        {item.icon}
      </div>
      <div style={{ minWidth: 0 }}>
        <p style={{ fontSize: 11, fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.35)", marginBottom: 2 }}>{item.label}</p>
        <p style={{ fontSize: 13, fontWeight: 600, color: hov ? item.accent : "rgba(255,255,255,0.75)", transition: "color 0.2s", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.value}</p>
      </div>
      <div style={{ marginLeft: "auto", color: hov ? item.accent : "rgba(255,255,255,0.15)", transition: "color 0.2s, transform 0.2s", transform: hov ? "translate(2px, -2px)" : "none" }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
      </div>
    </a>
  );
}

// ─── Footer (contact + footer bar in one viewport-height section) ─────────────

export default function Footer() {
  const [copied, setCopied] = useState(false);

  function copyEmail() {
    navigator.clipboard.writeText("milanray.dev@gmail.com").then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <section
      id="contact"
      data-snap
      style={{
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        background: "#080810",
      }}
    >
      <style>{`
        @media (max-width: 768px) {
          .contact-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
      `}</style>

      {/* Contact content — grows to fill available space, vertically centered accounting for navbar */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", padding: "clamp(32px, 5vh, 64px) clamp(20px, 5vw, 48px) clamp(32px, 5vh, 64px)", position: "relative", marginTop: 64 }}>

        {/* Ambient glow */}
        <div aria-hidden style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600, height: 300,
          background: "radial-gradient(ellipse, #9d8ff012 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <div style={{ maxWidth: 1152, margin: "0 auto", width: "100%", position: "relative", zIndex: 1 }}>
          <div className="contact-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>

            {/* Left */}
            <div>
              <p style={{ fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", color: "#00d4ff", marginBottom: 16, fontWeight: 600 }}>
                Contact
              </p>
              <h2 className="font-display" style={{ fontSize: "clamp(28px, 3.5vw, 42px)", fontWeight: 900, color: "white", lineHeight: 1.15, marginBottom: 16 }}>
                Let&apos;s Build{" "}
                <span style={{ background: "linear-gradient(135deg, #9d8ff0, #00d4ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  Something
                </span>
                <br />Together
              </h2>
              <p style={{ fontSize: 15, color: "#64748b", lineHeight: 1.7, maxWidth: 380, marginBottom: 32 }}>
                Open to AI Engineering, Full-Stack, and Applied AI roles. Also happy to chat about RAG systems, portfolio architecture, or anything interesting.
              </p>

              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <button
                  onClick={copyEmail}
                  style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "12px 22px", borderRadius: 12, cursor: "pointer",
                    background: "linear-gradient(135deg, #9d8ff0, #7c6fd0)",
                    border: "none", color: "white", fontSize: 14, fontWeight: 700,
                    boxShadow: "0 0 24px #9d8ff044", transition: "transform 0.2s, box-shadow 0.2s",
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 32px #9d8ff066"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 0 24px #9d8ff044"; }}
                >
                  {copied ? (
                    <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>Copied!</>
                  ) : (
                    <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="4" width="20" height="16" rx="3"/><polyline points="2,4 12,13 22,4"/></svg>Copy Email</>
                  )}
                </button>

                <a
                  href="/resume.pdf" target="_blank" rel="noopener noreferrer"
                  style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "12px 22px", borderRadius: 12, textDecoration: "none",
                    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)",
                    color: "rgba(255,255,255,0.8)", fontSize: 14, fontWeight: 600, transition: "all 0.2s",
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.09)"; (e.currentTarget as HTMLElement).style.color = "white"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.8)"; }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>
                  Resume
                </a>
              </div>
            </div>

            {/* Right */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {CONTACT.map(c => <ContactCard key={c.label} item={c} />)}
            </div>
          </div>
        </div>
      </div>

      {/* Footer bar — pinned to bottom */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "20px 0", flexShrink: 0 }}>
        <div style={{
          maxWidth: 1152, margin: "0 auto",
          padding: "0 clamp(20px, 5vw, 48px)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: 16,
        }}>
          {/* Brand */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 8,
              background: "linear-gradient(135deg, #9d8ff0, #00d4ff)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: 900, color: "white",
            }}>M</div>
            <span className="font-display" style={{ fontSize: 15, fontWeight: 800, color: "white" }}>
              Milan<span style={{ color: "#9d8ff0" }}>.</span>
            </span>
          </div>

          {/* Nav */}
          <nav aria-label="Footer navigation" style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            {NAV_LINKS.map(l => <FooterLink key={l.label} href={l.href} label={l.label} />)}
          </nav>

          {/* Copyright */}
          <p style={{ fontSize: 12, fontFamily: "monospace", color: "rgba(255,255,255,0.25)" }}>
            © {new Date().getFullYear()} Milan Ray
          </p>
        </div>
      </footer>
    </section>
  );
}

function FooterLink({ href, label }: { href: string; label: string }) {
  const [hov, setHov] = useState(false);
  return (
    <a
      href={href}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ fontSize: 13, textDecoration: "none", color: hov ? "white" : "rgba(255,255,255,0.35)", transition: "color 0.2s" }}
    >
      {label}
    </a>
  );
}
