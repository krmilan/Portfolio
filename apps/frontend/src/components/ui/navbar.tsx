"use client";

import { useState, useEffect } from "react";

const links = ["About", "Projects", "Skills", "Experience", "AI Chat"];

const linkHref: Record<string, string> = {
  "AI Chat": "chat",
  "Experience": "experience",
  "Contact": "contact",
};

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
      background: scrolled ? "rgba(8,8,16,0.95)" : "rgba(8,8,16,0.5)",
      backdropFilter: "blur(20px)",
      borderBottom: "1px solid rgba(255,255,255,0.07)",
      padding: "14px 0",
      transition: "background 0.3s ease",
    }}>
      <div style={{
        maxWidth: 1152, margin: "0 auto", padding: "0 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>

        {/* Logo */}
        <a href="#about" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8, flexShrink: 0,
            background: "linear-gradient(135deg, #7c6fcd, #00d4ff)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "Syne, sans-serif", fontWeight: 900, fontSize: 14, color: "white",
            boxShadow: "0 0 16px rgba(124,111,205,0.5)",
          }}>M</div>
          <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 18, color: "white", whiteSpace: "nowrap" }}>
            Milan
            <span style={{ background: "linear-gradient(135deg, #9d8ff0, #00d4ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>.</span>
          </span>
        </a>

        {/* Desktop nav */}
        <div className="nav-links" style={{ display: "flex", alignItems: "center", gap: 2 }}>
          {links.map(link => (
            <a
              key={link}
              href={`#${linkHref[link] ?? link.toLowerCase()}`}
              style={{
                padding: "8px 14px", borderRadius: 8, fontSize: 14,
                color: "#94a3b8", textDecoration: "none", transition: "all 0.2s",
                fontFamily: "DM Sans, sans-serif", whiteSpace: "nowrap",
              }}
              onMouseEnter={e => {
                (e.currentTarget).style.color = "white";
                (e.currentTarget).style.background = "rgba(255,255,255,0.08)";
              }}
              onMouseLeave={e => {
                (e.currentTarget).style.color = "#94a3b8";
                (e.currentTarget).style.background = "transparent";
              }}
            >
              {link}
            </a>
          ))}


          {/* Hire me CTA */}
          <a
            href="#contact"
            style={{
              marginLeft: 8, padding: "8px 20px", borderRadius: 8,
              fontSize: 14, fontWeight: 600,
              background: "linear-gradient(135deg, #7c6fcd, #9d8ff0)",
              color: "white", textDecoration: "none",
              boxShadow: "0 0 20px rgba(124,111,205,0.4)",
              fontFamily: "DM Sans, sans-serif", whiteSpace: "nowrap",
              transition: "box-shadow 0.2s",
            }}
            onMouseEnter={e => { (e.currentTarget).style.boxShadow = "0 0 28px rgba(124,111,205,0.65)"; }}
            onMouseLeave={e => { (e.currentTarget).style.boxShadow = "0 0 20px rgba(124,111,205,0.4)"; }}
          >
            Hire me
          </a>
        </div>

        {/* Mobile burger */}
        <button
          className="nav-mobile-btn"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            background: "transparent", border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 8, padding: "8px 10px", cursor: "pointer",
            display: "none", flexDirection: "column", gap: 5,
            alignItems: "center", justifyContent: "center",
          }}
        >
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: 20, height: 2, background: "#cbd5e1", borderRadius: 2, transition: "all 0.3s",
              transform: menuOpen
                ? i === 0 ? "rotate(45deg) translate(5px, 5px)"
                : i === 2 ? "rotate(-45deg) translate(5px, -5px)"
                : "none"
                : "none",
              opacity: menuOpen && i === 1 ? 0 : 1,
            }} />
          ))}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          background: "rgba(8,8,16,0.98)", backdropFilter: "blur(20px)",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          padding: "16px 24px 24px",
        }}>
          {links.map(link => (
            <a
              key={link}
              href={`#${linkHref[link] ?? link.toLowerCase()}`}
              onClick={() => setMenuOpen(false)}
              style={{
                display: "block", padding: "12px 16px", borderRadius: 10,
                fontSize: 15, color: "#cbd5e1", textDecoration: "none", marginBottom: 4,
                fontFamily: "DM Sans, sans-serif",
              }}
              onMouseEnter={e => {
                (e.currentTarget).style.background = "rgba(255,255,255,0.06)";
                (e.currentTarget).style.color = "white";
              }}
              onMouseLeave={e => {
                (e.currentTarget).style.background = "transparent";
                (e.currentTarget).style.color = "#cbd5e1";
              }}
            >
              {link}
            </a>
          ))}

          {/* Mobile: Hire me */}
          <a
            href="#contact"
            onClick={() => setMenuOpen(false)}
            style={{
              display: "block", padding: "12px 16px", borderRadius: 10,
              fontSize: 15, fontWeight: 600, textAlign: "center",
              background: "linear-gradient(135deg, #7c6fcd, #9d8ff0)",
              color: "white", textDecoration: "none",
              boxShadow: "0 0 20px rgba(124,111,205,0.35)",
            }}
          >
            Hire me
          </a>
        </div>
      )}
    </nav>
  );
}
