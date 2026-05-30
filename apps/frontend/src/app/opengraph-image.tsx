import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Milan Ray — AI & Full-Stack Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          background: "#080810",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Background grid effect */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(ellipse 80% 60% at 50% -20%, rgba(124,111,205,0.25) 0%, transparent 60%)",
          }}
        />

        {/* Top badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#00ffaa",
            }}
          />
          <span style={{ color: "#00ffaa", fontSize: "18px", fontWeight: 600 }}>
            OPEN TO WORK
          </span>
        </div>

        {/* Name */}
        <div
          style={{
            fontSize: "88px",
            fontWeight: 800,
            color: "white",
            lineHeight: 1,
            marginBottom: "16px",
            display: "flex",
          }}
        >
          Milan{" "}
          <span style={{ color: "#9d8ff0", marginLeft: "24px" }}>Ray</span>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: "32px",
            color: "#94a3b8",
            marginBottom: "40px",
            display: "flex",
          }}
        >
          AI Engineer · Full-Stack · RAG Systems
        </div>

        {/* Tech stack pills */}
        <div style={{ display: "flex", gap: "12px" }}>
          {["Next.js", "FastAPI", "pgvector", "Gemini", "Groq"].map((tech) => (
            <div
              key={tech}
              style={{
                padding: "8px 20px",
                borderRadius: "999px",
                background: "rgba(157,143,240,0.15)",
                border: "1px solid rgba(157,143,240,0.3)",
                color: "#9d8ff0",
                fontSize: "18px",
                fontWeight: 600,
                display: "flex",
              }}
            >
              {tech}
            </div>
          ))}
        </div>

        {/* URL bottom right */}
        <div
          style={{
            position: "absolute",
            bottom: "48px",
            right: "80px",
            color: "#475569",
            fontSize: "18px",
            display: "flex",
          }}
        >
          krmilan-portfolio-frontend.vercel.app
        </div>
      </div>
    ),
    { ...size }
  );
}
