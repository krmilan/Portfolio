"use client";
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        padding: "48px 24px",
        borderTop: "1px solid var(--border)",
        position: "relative",
        zIndex: 1,
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        {/* left */}
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "18px",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              color: "var(--text-primary)",
            }}
          >
            Milan<span style={{ color: "var(--accent)" }}>.</span>
          </span>
          <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
            Full-Stack & AI Engineer
          </span>
        </div>

        {/* center */}
        <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
          © {year} Milan Ray. Built with Next.js & FastAPI.
        </span>

        {/* right */}
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <a
            href="https://github.com/krmilan"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "var(--text-muted)",
              textDecoration: "none",
              fontSize: "13px",
              transition: "color 0.2s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "var(--text-primary)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "var(--text-muted)")
            }
          >
            GitHub
          </a>

          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "var(--text-muted)",
              textDecoration: "none",
              fontSize: "13px",
              transition: "color 0.2s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "var(--text-primary)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "var(--text-muted)")
            }
          >
            Resume
          </a>
        </div>
      </div>
    </footer>
  );
}