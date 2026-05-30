export default function Footer() {
  return (
    <footer style={{ borderTop: "1px solid rgba(255,255,255,0.07)", padding: "28px 24px", position: "relative" }}>
      <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 180, height: 1, background: "linear-gradient(90deg, transparent, rgba(124,111,205,0.5), transparent)" }} />
      <div className="footer-inner" style={{ maxWidth: 1152, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span className="font-display" style={{ fontSize: 17, fontWeight: 900, color: "white" }}>
            Milan<span style={{ background: "linear-gradient(135deg, #9d8ff0, #00d4ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>.</span>
          </span>
          <span style={{ color: "#475569" }}>·</span>
          <span style={{ fontSize: 13, color: "#64748b" }}>Full-Stack & AI Engineer</span>
        </div>
        <p style={{ fontSize: 12, color: "#475569" }}>© 2026 Milan Ray</p>
        <div style={{ display: "flex", gap: 20 }}>
          {[["GitHub", "https://github.com"], ["Email", "mailto:milan@email.com"], ["Resume", "/resume.pdf"]].map(([label, href]) => (
            <a key={label} href={href} style={{ fontSize: 13, color: "#64748b", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={e => (e.target as HTMLElement).style.color = "white"}
              onMouseLeave={e => (e.target as HTMLElement).style.color = "#64748b"}
            >{label}</a>
          ))}
        </div>
      </div>
    </footer>
  );
}